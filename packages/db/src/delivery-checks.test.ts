import { describe, expect, it } from "vitest";
import {
  MAX_CHECKS_PER_DEAL,
  listDeliveryChecks,
  readLedger,
  recordDeliveryCheck,
} from "./index.js";
import {
  addTestFile,
  createAwaitingTestDeal,
  createSignedTestDeal,
  minutesAfterTestNow,
  refusalMatching,
  testId,
  useMigratedTestDatabase,
  type TestDealMaker,
} from "./testing.js";

const db = useMigratedTestDatabase();
const at = minutesAfterTestNow;
const PNG = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]);

const refusal = (reason: string) => refusalMatching("DeliveryCheckNotAllowedError", reason);

/** A signed deal with one delivered file (test id 600), and a way to keep a check of it. */
async function signedWithFile(make: TestDealMaker = createSignedTestDeal) {
  const deal = await make(db);
  const file = await addTestFile(
    db,
    deal,
    { id: testId(600), kind: "deliverable", filename: "courier.png", bytes: PNG },
    at(1),
  );
  const files = [{ fileId: file.id, filename: file.filename, sha256: file.sha256 }];
  const check = (n: number, overrides: object = {}) =>
    recordDeliveryCheck(
      db,
      {
        id: testId(900 + n),
        dealId: deal.dealId,
        sellerId: deal.seller.id,
        version: 1,
        stage: 1,
        files,
        report: { code: [], look: [] },
        ...overrides,
      },
      at(2 + n),
    );
  return { ...deal, file, files, check };
}

describe("delivery checks", () => {
  it("are kept for the seller, newest first, and never logged", async () => {
    const deal = await signedWithFile();
    const logged = (await readLedger(db, deal.dealId)).length;
    const first = await deal.check(1);
    expect(first).toMatchObject({
      stage: 1,
      version: 1,
      files: deal.files,
      checkedBy: deal.seller.id,
    });
    await deal.check(2, { report: { code: [{ line: 1 }] } });
    expect((await listDeliveryChecks(db, deal.dealId)).map((c) => c.id)).toEqual([
      testId(902),
      testId(901),
    ]);
    expect(await readLedger(db, deal.dealId)).toHaveLength(logged);
  });

  it("are refused from the buyer, before signing, for other files, and past the limit", async () => {
    const deal = await signedWithFile();
    await expect(deal.check(1, { sellerId: deal.buyer.id })).rejects.toEqual(
      refusal("not-your-deal"),
    );
    const wrongFile = [{ ...deal.files[0], sha256: "e".repeat(64) }];
    await expect(deal.check(1, { files: wrongFile })).rejects.toEqual(refusal("wrong-files"));
    const unknown = [{ fileId: testId(601), filename: "x.png", sha256: "e".repeat(64) }];
    await expect(deal.check(1, { files: unknown })).rejects.toEqual(refusal("wrong-files"));
    for (let n = 1; n <= MAX_CHECKS_PER_DEAL; n++) await deal.check(n);
    await expect(deal.check(30)).rejects.toEqual(refusal("too-many"));
  });

  it("need a signed deal", async () => {
    const deal = await signedWithFile(createAwaitingTestDeal);
    await expect(deal.check(1)).rejects.toEqual(refusal("not-signed"));
  });

  it("cannot be changed or removed", async () => {
    const deal = await signedWithFile();
    await deal.check(1);
    await expect(db.query("UPDATE delivery_checks SET stage = 2")).rejects.toThrow(/append-only/);
    await expect(db.query("DELETE FROM delivery_checks")).rejects.toThrow(/append-only/);
    await expect(db.query("TRUNCATE delivery_checks")).rejects.toThrow(/append-only/);
  });
});
