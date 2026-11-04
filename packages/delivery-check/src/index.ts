/**
 * The pre-delivery check (4l): what code can read from delivered files (type, size, pixel size,
 * transparency), what the agreement's lines ask for and whether the files meet it, and the
 * prompt and reply check for a vision model's look at each image. Pure; the server makes the
 * calls. Advice for the seller only.
 */
export { imageFacts, type ImageFacts, type Transparency } from "./image.js";
export { lineRequirements, type CheckedFormat, type Requirement } from "./requirements.js";
export {
  codeChecks,
  type CheckLine,
  type CheckedFile,
  type LineCodeResult,
  type RequirementResult,
} from "./code-checks.js";
export { checkableLines } from "./lines.js";
export { LOOK_PROMPT_VERSION, buildLookMessages, type LookPrompt } from "./prompt.js";
export { LOOK_VERDICTS, checkLook, type CheckedLook, type Look, type LookVerdict } from "./look.js";
