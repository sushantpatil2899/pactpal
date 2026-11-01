/**
 * Drafting a deal's scope from a pasted chat: numbering the chat, the prompt, the shape of the
 * answer, and the code that checks every citation. Pure functions over plain data; calling the
 * models and storing drafts happen elsewhere.
 */

export {
  MAX_SOURCE_CHARS,
  MAX_SOURCE_LINES,
  numberSourceLines,
  type NumberedSource,
  type SourceLine,
} from "./source.js";
export { VAGUE_KINDS, scopeDraftSchema, type Citation, type ScopeDraft } from "./schema.js";
export { SCOPE_DRAFT_SCHEMA_NAME, scopeDraftWireSchema } from "./wire-schema.js";
export {
  SCOPE_DRAFT_PROMPT_VERSION,
  buildScopeDraftMessages,
  renderChat,
  type ScopeDraftPrompt,
  type ScopeDraftPromptInput,
} from "./prompt.js";
export {
  BLOCKED_CATEGORIES,
  UNCLEAR_CATEGORY,
  allowedCategoryIds,
  categoryVerdict,
  type CategoryVerdict,
} from "./category.js";
export {
  normalizeForMatch,
  readScopeDraft,
  validateScopeDraft,
  type ScopeDraftCheck,
  type ValidationContext,
} from "./validate.js";
export { scopeDraftCouncilTask, type ScopeDraftTask } from "./council-task.js";
