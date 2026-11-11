/**
 * PactPal's design tokens live in `@pactpal/brand`, shared with the help site; the page writes
 * them as CSS custom properties before anything is drawn.
 */
import { tokenCss } from "@pactpal/brand";

export {
  DARK,
  LIGHT,
  SHARED,
  token,
  tokenCss,
  type ColorToken,
  type TokenName,
} from "@pactpal/brand";

/** Writes the tokens to the page; call once, before the first render. */
export function applyTokens(page: Document): void {
  const style = page.createElement("style");
  style.dataset.tokens = "";
  style.textContent = tokenCss();
  page.head.append(style);
}
