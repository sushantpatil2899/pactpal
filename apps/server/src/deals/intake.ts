import {
  addArtifact,
  createDeal,
  postgresContentStore,
  type Database,
  type IntakeKey,
} from "@pactpal/db";

/**
 * Creates a draft deal for an intake secret's owner (4p, 4p-2): the given title, the secret's
 * default category and currency unless others are given, and the text saved as a source file.
 * `DEAL_CREATED` records how it came in and the secret's last 4 characters, never the secret.
 */
export async function createIntakeDeal(
  deps: { db: Database; clock: () => Date; newId: () => string },
  input: {
    record: IntakeKey;
    via: "intake" | "email" | "agent";
    title: string;
    text: string;
    /** The source file's name, e.g. "email-2026-11-05.txt". */
    filename: string;
    category?: IntakeKey["defaultCategory"];
    currency?: IntakeKey["defaultCurrency"];
  },
): Promise<string> {
  const { db, clock, newId } = deps;
  const { record } = input;
  const { deal } = await createDeal(
    db,
    {
      id: newId(),
      sellerId: record.sellerId,
      title: input.title,
      category: input.category ?? record.defaultCategory,
      currency: input.currency ?? record.defaultCurrency,
    },
    clock(),
    { via: input.via, keyEnding: record.keyEnding },
  );
  await addArtifact(
    db,
    postgresContentStore(db, clock),
    {
      id: newId(),
      dealId: deal.id,
      kind: "source",
      filename: input.filename,
      bytes: new TextEncoder().encode(input.text),
      addedBy: { actor: "seller", actorId: record.sellerId },
    },
    clock(),
  );
  return deal.id;
}

/** "<prefix>-YYYY-MM-DD.txt", the day in UTC. */
export const intakeFilename = (prefix: string, now: Date) =>
  `${prefix}-${now.toISOString().slice(0, 10)}.txt`;
