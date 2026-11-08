import { parseServerFrame, type ClientFrame } from "@pactpal/live";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { getChat, liveUrl, postChat } from "./chat-api";
import { chatReducer, initialChat, lastSeq, reconnectDelay, type ChatState } from "./chat-state";

/** How often the page tells the server it is still there (proxies close quiet connections). */
const PING_MS = 25_000;
/** "Typing" is re-sent at most this often while the person keeps typing. */
const TYPING_REPEAT_MS = 3000;
/** After this long without a key press, the page says the person stopped typing. */
const TYPING_IDLE_MS = 4000;
/** The other side's "typing" hint disappears after this long without news. */
const TYPING_SHOWN_MS = 6000;
/** One answer holds at most this many messages; a full one means there may be more. */
const PAGE = 200;

export interface LiveChat {
  state: ChatState;
  send(body: string): void;
  retry(clientId: string): void;
  /** Call on every change to the message box. */
  typing(): void;
}

/**
 * The deal's live chat: loads the history, keeps a WebSocket open (reconnecting with growing
 * waits and catching up from the last message it has), sends typing and read marks, and posts
 * messages over HTTP so a message is saved even while the connection is down. `reading` says
 * whether the person can see the chat now; only then are messages marked read.
 */
export function useLiveChat(
  dealId: string,
  options: { reading: boolean; onNotify?: () => void },
): LiveChat {
  const [state, dispatch] = useReducer(chatReducer, initialChat);
  const socket = useRef<WebSocket | undefined>(undefined);
  const stateRef = useRef(state);
  stateRef.current = state;
  const onNotify = useRef(options.onNotify);
  onNotify.current = options.onNotify;
  const pendingBodies = useRef(new Map<string, string>());
  const typingSent = useRef(0);
  const typingIdle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const sendFrame = useCallback((frame: ClientFrame) => {
    if (socket.current?.readyState === WebSocket.OPEN) socket.current.send(JSON.stringify(frame));
  }, []);

  useEffect(() => {
    let stopped = false;
    let attempt = 0;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let pingTimer: ReturnType<typeof setInterval> | undefined;

    async function loadHistory() {
      for (;;) {
        const view = await getChat(dealId, lastSeq(stateRef.current));
        if (stopped) return;
        dispatch({ type: "loaded", view });
        stateRef.current = chatReducer(stateRef.current, { type: "loaded", view });
        if (view.messages.length < PAGE) return;
      }
    }

    function connect() {
      if (stopped) return;
      dispatch({ type: "connection", connection: "connecting" });
      const ws = new WebSocket(liveUrl(window.location, dealId, lastSeq(stateRef.current)));
      socket.current = ws;
      ws.onopen = () => {
        attempt = 0;
        dispatch({ type: "connection", connection: "live" });
        pingTimer = setInterval(() => {
          sendFrame({ type: "ping" });
        }, PING_MS);
      };
      ws.onmessage = (event: MessageEvent<unknown>) => {
        const frame = typeof event.data === "string" ? parseServerFrame(event.data) : undefined;
        if (!frame) return;
        if (frame.type === "notify") onNotify.current?.();
        dispatch({ type: "frame", frame });
      };
      ws.onclose = () => {
        clearInterval(pingTimer);
        if (socket.current === ws) socket.current = undefined;
        if (stopped) return;
        dispatch({ type: "connection", connection: "offline" });
        retryTimer = setTimeout(connect, reconnectDelay(attempt));
        attempt += 1;
      };
    }

    loadHistory().then(connect, () => {
      dispatch({ type: "connection", connection: "offline" });
      retryTimer = setTimeout(connect, reconnectDelay(0));
    });
    return () => {
      stopped = true;
      clearTimeout(retryTimer);
      clearInterval(pingTimer);
      socket.current?.close();
      socket.current = undefined;
    };
  }, [dealId, sendFrame]);

  // Messages are read when the chat is in view and the page is in front.
  const newest = lastSeq(state);
  const { role } = state;
  const readSoFar = role === undefined ? 0 : state.read[role];
  useEffect(() => {
    const mark = () => {
      if (options.reading && document.visibilityState === "visible" && newest > readSoFar) {
        sendFrame({ type: "read", seq: newest });
      }
    };
    mark();
    document.addEventListener("visibilitychange", mark);
    return () => {
      document.removeEventListener("visibilitychange", mark);
    };
  }, [options.reading, newest, readSoFar, state.connection, sendFrame]);

  // The other side's "typing" hint fades if no news follows.
  useEffect(() => {
    if (!state.otherTyping) return undefined;
    const timer = setTimeout(() => {
      dispatch({ type: "typing-expired" });
    }, TYPING_SHOWN_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [state.otherTyping, state.messages.length]);

  const stopTyping = useCallback(() => {
    clearTimeout(typingIdle.current);
    if (typingSent.current !== 0) sendFrame({ type: "typing", typing: false });
    typingSent.current = 0;
  }, [sendFrame]);

  const typing = useCallback(() => {
    const now = Date.now();
    if (now - typingSent.current > TYPING_REPEAT_MS) {
      sendFrame({ type: "typing", typing: true });
      typingSent.current = now;
    }
    clearTimeout(typingIdle.current);
    typingIdle.current = setTimeout(stopTyping, TYPING_IDLE_MS);
  }, [sendFrame, stopTyping]);

  const post = useCallback(
    (clientId: string, body: string) => {
      dispatch({ type: "sending", clientId, body });
      postChat(dealId, body, clientId).then(
        (message) => {
          pendingBodies.current.delete(clientId);
          dispatch({ type: "sent", message });
        },
        () => {
          dispatch({ type: "failed", clientId });
        },
      );
    },
    [dealId],
  );

  const send = useCallback(
    (body: string) => {
      const clientId = crypto.randomUUID();
      pendingBodies.current.set(clientId, body);
      stopTyping();
      post(clientId, body);
    },
    [post, stopTyping],
  );

  const retry = useCallback(
    (clientId: string) => {
      const body = pendingBodies.current.get(clientId);
      if (body !== undefined) post(clientId, body);
    },
    [post],
  );

  return { state, send, retry, typing };
}
