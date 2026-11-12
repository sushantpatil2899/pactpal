# Changing emails

Every email's wording and look lives in [`templates/`](../templates), not in code:

| File                             | What it sets                                                                                                                                                |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `templates/brand.json`           | Product name, logo address, colours, footer lines, help and privacy links                                                                                   |
| `templates/emails/layout.html`   | The design every email shares                                                                                                                               |
| `templates/emails/<kind>.txt`    | One email: `subject:`, `tag:`, `tone:` (`ok`, `wait`, `alert`, `ai`, `info`), `heading:`, `button:` (label \| link), `fact:` lines, then `---` and the text |
| `templates/brand/logo-email.png` | The logo emails show                                                                                                                                        |

Fields such as `{{dealTitle}}` are filled in for each email; `{{#message}}…{{/message}}` shows a part only when there is a message. The same file gives the designed email and its plain-text copy. Edit, run `pnpm test` (a broken template or a field the email does not have fails it), push, and Render redeploys in a few minutes. The sandbox notice is added to every email and cannot be removed. The receipt and evidence packet PDFs are evidence, so their look is fixed in code for each document format.
