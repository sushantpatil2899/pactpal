import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  EmailTemplateError,
  brandSchema,
  parseEmailTemplate,
  renderEmail,
  type Brand,
  type EmailTemplate,
  type EmailView,
  type RenderedEmail,
} from "@pactpal/email";

/**
 * The repository's `templates/` folder (9h): next to the source when developing and testing, and
 * next to the built server on Render, which runs from the repository checkout.
 */
export function templatesDir(from = dirname(fileURLToPath(import.meta.url))): string {
  const dir = repoFolder("templates", "brand.json", from);
  if (dir === undefined) throw new EmailTemplateError("No templates/brand.json found");
  return dir;
}

/**
 * A folder of the repository checkout (`folder`, recognised by a file in it), found by walking up
 * from `from`: next to the source when developing and testing, next to the build on Render.
 */
export function repoFolder(folder: string, marker: string, from: string): string | undefined {
  for (let dir = from; ; dir = dirname(dir)) {
    if (existsSync(join(dir, folder, marker))) return join(dir, folder);
    if (dirname(dir) === dir) return undefined;
  }
}

export interface EmailTemplates {
  brand: Brand;
  layout: string;
  emails: ReadonlyMap<string, EmailTemplate>;
}

/** Reads and checks every template at once, so a broken file stops the start, not an email. */
export function loadEmailTemplates(dir = templatesDir()): EmailTemplates {
  const brand = brandSchema.safeParse(JSON.parse(readFileSync(join(dir, "brand.json"), "utf8")));
  if (!brand.success) {
    throw new EmailTemplateError(
      `brand.json: ${brand.error.issues.map((i) => `${i.path.join(".")} ${i.message}`).join("; ")}`,
    );
  }
  const folder = join(dir, "emails");
  const emails = new Map<string, EmailTemplate>();
  for (const file of readdirSync(folder).filter((name) => name.endsWith(".txt"))) {
    const kind = file.slice(0, -".txt".length);
    emails.set(kind, parseEmailTemplate(readFileSync(join(folder, file), "utf8"), file));
  }
  return { brand: brand.data, layout: readFileSync(join(folder, "layout.html"), "utf8"), emails };
}

let loaded: EmailTemplates | undefined;

/** The email of template `kind` filled with `view`: subject, plain text and HTML. */
export function emailFrom(kind: string, view: EmailView): RenderedEmail {
  loaded ??= loadEmailTemplates();
  const template = loaded.emails.get(kind);
  if (!template) throw new EmailTemplateError(`No template templates/emails/${kind}.txt`);
  try {
    return renderEmail(template, loaded.layout, loaded.brand, view);
  } catch (error) {
    if (error instanceof EmailTemplateError) {
      throw new EmailTemplateError(`${kind}.txt: ${error.message}`);
    }
    throw error;
  }
}

let logo: Buffer | undefined;

/** The email logo's bytes (`templates/brand/logo-email.png`), read once. */
export function emailLogo(dir?: string): Buffer {
  logo ??= readFileSync(join(dir ?? templatesDir(), "brand", "logo-email.png"));
  return logo;
}
