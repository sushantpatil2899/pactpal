import { getArtifact, type ContentStore, type Database, type DraftRecord } from "@pactpal/db";
import { numberSourceLines, type SourceLine } from "@pactpal/scope-draft";

const decoder = new TextDecoder("utf-8", { fatal: true });

/** The file's text, or undefined when it is not valid UTF-8. */
export function textOf(bytes: Uint8Array): string | undefined {
  try {
    return decoder.decode(bytes);
  } catch {
    return undefined;
  }
}

/** The numbered chat a draft was made from, read again from the stored file; null if it cannot be. */
export async function numberedChat(
  found: { db: Database; deal: { id: string } },
  draft: DraftRecord,
  store: ContentStore,
  log: { error(fields: object, message: string): void },
): Promise<SourceLine[] | null> {
  try {
    const file = await getArtifact(found.db, store, draft.sourceArtifactId, found.deal.id);
    const text = textOf(file.bytes);
    const numbered = text === undefined ? undefined : numberSourceLines(text);
    return numbered?.ok ? numbered.lines : null;
  } catch (error) {
    // The draft is still shown; only the chat beside it is missing.
    log.error(
      {
        dealId: found.deal.id,
        draftId: draft.id,
        err: error instanceof Error ? error.name : "unknown",
      },
      "The chat of a draft could not be read",
    );
    return null;
  }
}
