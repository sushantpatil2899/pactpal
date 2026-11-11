import Mustache from "mustache";
import { z } from "zod";

const hex = z.string().regex(/^#[0-9a-f]{6}$/i, "must be a colour such as #0fa97a");

/** `templates/brand.json`: what every email shares, editable without code (9h). */
export const brandSchema = z.strictObject({
  productName: z.string().min(1).max(40),
  /** The logo image every email shows, served by the website (`/brand/logo-email.png`). */
  logoUrl: z.url({ protocol: /^https$/ }),
  colors: z.strictObject({
    background: hex,
    surface: hex,
    surfaceSoft: hex,
    ink: hex,
    muted: hex,
    line: hex,
    button: hex,
    onButton: hex,
    ok: hex,
    okSoft: hex,
    wait: hex,
    waitSoft: hex,
    alert: hex,
    alertSoft: hex,
    ai: hex,
    aiSoft: hex,
    info: hex,
    infoSoft: hex,
  }),
  /** Lines under every email, after the required sandbox notice. */
  footerLines: z.array(z.string().min(1).max(300)).max(4),
  links: z.strictObject({ help: z.url(), privacy: z.url() }),
});
export type Brand = z.infer<typeof brandSchema>;

/** The kinds of email, each with its colour: done, needs you, a dispute, AI, or plain news. */
export const EMAIL_TONES = ["ok", "wait", "alert", "ai", "info"] as const;
export type EmailTone = (typeof EMAIL_TONES)[number];

/**
 * How the required sandbox notice ends the text: after a blank line (`sandbox`), on the next line
 * (`tight`), or not added because the body already says it (`none`).
 */
const FOOTERS = ["sandbox", "tight", "none"] as const;

/**
 * One email's template file: header lines (`subject:`, `tag:`, `tone:`, `heading:`, `button:`
 * "Label | url", `fact:` "Label | value", `footer:`), a line `---`, then the body. Every field is
 * filled in with Mustache from the email's own values.
 */
export const emailTemplateSchema = z.strictObject({
  subject: z.string().min(1),
  tag: z.string().min(1),
  tone: z.string().min(1),
  heading: z.string().min(1).optional(),
  button: z.string().includes("|").optional(),
  facts: z.array(z.string().includes("|")).max(6),
  footer: z.enum(FOOTERS).default("sandbox"),
  body: z.string().min(1),
});
export type EmailTemplate = z.infer<typeof emailTemplateSchema>;

/** A template file that cannot be used, with the reason. */
export class EmailTemplateError extends Error {
  override readonly name = "EmailTemplateError";
}

const SINGLE_KEYS = new Set(["subject", "tag", "tone", "heading", "button", "footer"]);

/** Reads a template file (see `emailTemplateSchema`); throws `EmailTemplateError` when it is wrong. */
export function parseEmailTemplate(source: string, name: string): EmailTemplate {
  const split = source.replace(/\r\n/g, "\n").split(/^---$/m);
  if (split.length < 2) throw new EmailTemplateError(`${name}: no "---" line after the header`);
  const [head = "", ...rest] = split;
  const fields: Record<string, unknown> = { facts: [] };
  for (const line of head.split("\n").filter((l) => l.trim() !== "")) {
    const match = /^([a-z]+):\s?(.*)$/.exec(line);
    const key = match?.[1] ?? "";
    const value = match?.[2] ?? "";
    if (key === "fact") (fields.facts as string[]).push(value);
    else if (SINGLE_KEYS.has(key) && !(key in fields)) fields[key] = value;
    else throw new EmailTemplateError(`${name}: unknown or repeated header line "${line}"`);
  }
  fields.body = rest.join("---").replace(/^\n/, "");
  const parsed = emailTemplateSchema.safeParse(fields);
  if (!parsed.success) {
    throw new EmailTemplateError(
      `${name}: ${parsed.error.issues.map((i) => i.message).join("; ")}`,
    );
  }
  // Mustache mistakes (an unclosed section) surface now, not when an email is sent.
  for (const text of [parsed.data.subject, parsed.data.body, ...parsed.data.facts]) {
    try {
      Mustache.parse(text);
    } catch (error) {
      throw new EmailTemplateError(
        `${name}: ${error instanceof Error ? error.message : "bad field"}`,
      );
    }
  }
  return parsed.data;
}

/** Values an email fills its template with. Lists are for `{{#list}}` sections. */
export type EmailView = Readonly<
  Record<string, string | number | boolean | readonly string[] | undefined>
>;

type Token = [string, string, number, number, Token[]?];

/** Every field a piece of template text names at its top level. */
function fieldsOf(text: string): string[] {
  const names: string[] = [];
  const walk = (tokens: Token[], top: boolean) => {
    for (const [type, value, , , children] of tokens) {
      if (top && ["name", "&", "#", "^"].includes(type)) names.push(value.split(".")[0] ?? value);
      // Inside a list section `{{.}}` and parent fields are allowed; parents are checked here too.
      if (children) walk(children, true);
    }
  };
  walk(Mustache.parse(text) as Token[], true);
  return names.filter((n) => n !== "");
}

/** The fields a template uses that the email did not give; an empty list is good. */
export function missingFields(template: EmailTemplate, view: EmailView): string[] {
  const texts = [
    template.subject,
    template.tag,
    template.tone,
    template.heading ?? "",
    template.button ?? "",
    template.body,
    ...template.facts,
  ];
  return [...new Set(texts.flatMap(fieldsOf))].filter((name) => !(name in view));
}

/** Fills text in without HTML escaping (subject and plain text); HTML is escaped separately. */
const fill = (text: string, view: EmailView): string =>
  Mustache.render(text, view, {}, { escape: (value: string) => value });

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
/** Text made safe to put inside HTML. */
export const escapeHtml = (text: string): string =>
  text.replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);

/** Text as HTML with its web addresses as links. */
const linked = (text: string, color: string) =>
  escapeHtml(text).replace(
    /https?:\/\/[^\s<]+[^\s<.,;:!?)]/g,
    (url) => `<a href="${url}" style="color:${color};word-break:break-all">${url}</a>`,
  );

/** The body's paragraphs as HTML: lists for "- " lines, the button's own address line left out. */
function bodyHtml(text: string, buttonUrl: string | undefined, brand: Brand): string {
  const { ink, muted, ok } = brand.colors;
  const p = `margin:0 0 14px;font-size:15px;line-height:1.6;color:${muted};overflow-wrap:anywhere`;
  return text
    .split(/\n{2,}/)
    .map((paragraph) => {
      let lines = paragraph.split("\n").filter((l) => l !== "");
      if (buttonUrl !== undefined && lines.at(-1) === buttonUrl) {
        lines = lines.slice(0, -1);
        const last = lines.at(-1);
        if (last?.endsWith(":") === true) lines[lines.length - 1] = `${last.slice(0, -1)}.`;
      }
      const runs: { list: boolean; lines: string[] }[] = [];
      for (const line of lines) {
        const list = line.startsWith("- ");
        const run = runs.at(-1);
        if (run?.list === list) run.lines.push(line);
        else runs.push({ list, lines: [line] });
      }
      return runs
        .map(({ list, lines: group }) =>
          list
            ? `<ul style="margin:0 0 14px;padding-left:20px;color:${ink};font-size:15px;line-height:1.6">${group
                .map((l) => `<li>${linked(l.slice(2), ok)}</li>`)
                .join("")}</ul>`
            : `<p style="${p}">${group.map((l) => linked(l, ok)).join("<br>")}</p>`,
        )
        .join("");
    })
    .join("");
}

const pair = (text: string): [string, string] => {
  const at = text.indexOf("|");
  return [text.slice(0, at).trim(), text.slice(at + 1).trim()];
};

/** The notice every PactPal email ends with; templates cannot remove it. */
export const SANDBOX_NOTICE = "PactPal (sandbox demo: no real money moves). Not legal advice.";

export interface RenderedEmail {
  subject: string;
  text: string;
  html: string;
}

/**
 * One email from its template: the plain text (the body, then the sandbox notice), the subject,
 * and the designed HTML from `layout` (a Mustache page; see `templates/emails/layout.html`).
 * Throws `EmailTemplateError` when the email did not give a field the template uses.
 */
export function renderEmail(
  template: EmailTemplate,
  layout: string,
  brand: Brand,
  view: EmailView,
): RenderedEmail {
  const missing = missingFields(template, view);
  if (missing.length > 0) {
    throw new EmailTemplateError(`missing fields: ${missing.join(", ")}`);
  }
  const body = fill(template.body, view)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const ending = { sandbox: `\n\n${SANDBOX_NOTICE}`, tight: `\n${SANDBOX_NOTICE}`, none: "" };
  const subject = fill(template.subject, view).replace(/\s+/g, " ").trim();
  const tone = fill(template.tone, view).trim();
  if (!(EMAIL_TONES as readonly string[]).includes(tone)) {
    throw new EmailTemplateError(`tone "${tone}" is not one of ${EMAIL_TONES.join(", ")}`);
  }
  const [buttonLabel, buttonUrl] = template.button ? pair(fill(template.button, view)) : ["", ""];
  const colors = brand.colors as Record<string, string>;
  const facts = template.facts
    .map((fact) => pair(fill(fact, view)))
    .filter(([, value]) => value !== "")
    .map(([label, value]) => ({ label, value }));
  const html = Mustache.render(
    layout,
    {
      brand,
      subject,
      tag: fill(template.tag, view),
      toneColor: colors[tone],
      toneSoft: colors[`${tone}Soft`],
      heading: fill(template.heading ?? template.subject, view),
      body: bodyHtml(body, buttonUrl === "" ? undefined : buttonUrl, brand),
      facts,
      hasFacts: facts.length > 0,
      button: buttonUrl === "" ? undefined : { label: buttonLabel, url: buttonUrl },
      sandboxNotice: SANDBOX_NOTICE,
    },
    {},
    { escape: escapeHtml },
  );
  return { subject, text: `${body}${ending[template.footer]}`, html };
}
