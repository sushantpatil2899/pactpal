import {
  CHAT_CHANNEL,
  parseChatEvent,
  publishChatEvent,
  type ChatEvent,
  type Database,
} from "@pactpal/db";

/** What a bus delivers: a chat event, or "resync" after events may have been missed. */
export type BusSignal = ChatEvent | { type: "resync" };

/**
 * Carries chat events between the copies of the server (and from the background worker), so a
 * page connected to any copy hears about every change. Events say what changed, never the text:
 * receivers read messages from the database.
 */
export interface ChatBus {
  publish(event: ChatEvent): Promise<void>;
  subscribe(listener: (signal: BusSignal) => void): () => void;
  close(): Promise<void>;
}

function listeners() {
  const all = new Set<(signal: BusSignal) => void>();
  return {
    add(listener: (signal: BusSignal) => void) {
      all.add(listener);
      return () => {
        all.delete(listener);
      };
    },
    emit(signal: BusSignal) {
      for (const listener of all) listener(signal);
    },
  };
}

/** One process only: tests, and a server without a database. Delivers after the caller returns. */
export function memoryBus(): ChatBus {
  const all = listeners();
  return {
    publish: (event) =>
      new Promise((resolve) => {
        queueMicrotask(() => {
          all.emit(event);
          resolve();
        });
      }),
    subscribe: (listener) => all.add(listener),
    close: () => Promise.resolve(),
  };
}

/** Starts listening on a channel; given by the caller so tests need no Postgres server. */
export type Listen = (handlers: {
  channel: string;
  onNotification: (payload: string) => void;
  onError: (error: Error) => void;
  onListening: () => void;
}) => { close(): Promise<void> };

/**
 * Postgres `LISTEN/NOTIFY`: events are sent with `pg_notify` and come back to every listening
 * copy, this one included, so each event is delivered once, from the database. After the
 * listening connection is restored, listeners get "resync" to re-read what they show.
 */
export function postgresBus(
  db: Database,
  listen: Listen,
  log: { warn(details: object, message: string): void },
): ChatBus {
  const all = listeners();
  let listenedBefore = false;
  const listener = listen({
    channel: CHAT_CHANNEL,
    onNotification: (payload) => {
      const event = parseChatEvent(payload);
      if (event) all.emit(event);
      else log.warn({}, "Unreadable chat event ignored");
    },
    onError: (error) => {
      log.warn({ err: error.message }, "Chat events connection lost; reconnecting");
    },
    onListening: () => {
      if (listenedBefore) all.emit({ type: "resync" });
      listenedBefore = true;
    },
  });
  return {
    publish: (event) => publishChatEvent(db, event),
    subscribe: (handler) => all.add(handler),
    close: () => listener.close(),
  };
}
