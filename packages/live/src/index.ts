/** The live chat's wire format, shared by the server and the web app (Phase 7). */
export {
  MAX_CLIENT_FRAME_BYTES,
  PARTIES,
  chatMessageSchema,
  clientFrameSchema,
  noticeSchema,
  otherParty,
  parseClientFrame,
  parseServerFrame,
  serverFrameSchema,
} from "./frames.js";
export type { ChatMessageView, ClientFrame, Party, ServerFrame } from "./frames.js";
