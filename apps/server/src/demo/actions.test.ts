import { createUser, readLedger } from "@pactpal/db";
import { TEST_NOW, testId, useMigratedTestDatabase } from "@pactpal/db/testing";
import { describe, expect, it } from "vitest";
import { dealTestApp } from "../deals/test-app.js";
import { fakePayPal } from "../payments/paypal-test-support.js";
import {
  SEED_AGENT,
  addBuyer,
  answerDelivery,
  chat,
  createDeal,
  deliver,
  paidOrInstruction,
  saveAgreement,
  sendForSigning,
  sendInvoice,
  sign,
  upload,
  type SeedContext,
} from "./actions.js";

const db = useMigratedTestDatabase();
const MAYA = "maya.lin@pact-pal.app";
const CHRIS = "chris.park@pact-pal.app";

/** The test app as the seed sees it, with Maya signed up and a stand-in PayPal. */
async function seedContext() {
  await createUser(db, { id: testId(1), email: MAYA, displayName: "Maya Lin" }, TEST_NOW);
  const paypal = fakePayPal();
  const env = dealTestApp(db, undefined, { invoices: paypal.invoices });
  const files: Record<string, Buffer> = {
    "chats/brief.txt": Buffer.from("Chris: a character, $240?\nMaya: yes"),
    "deliverables/final.txt": Buffer.from("Wren, final art (stand-in file)"),
  };
  const context: SeedContext = {
    app: env.app,
    db,
    clock: () => TEST_NOW,
    content: (path) => {
      const bytes = files[path];
      if (!bytes) throw new Error(`no content ${path}`);
      return bytes;
    },
  };
  return { context, paypal, env };
}

describe("the demo seed's actions (9b-2)", () => {
  it("make a real deal through PactPal's routes: agreement, signature, invoice, payment, delivery", async () => {
    const { context, paypal, env } = await seedContext();
    const dealId = await createDeal(context, MAYA, {
      title: "Wren, the lantern-keeper",
      category: "art-and-design",
    });
    await addBuyer(context, MAYA, dealId, { email: CHRIS, name: "Chris Park" });
    await upload(context, MAYA, dealId, {
      path: "chats/brief.txt",
      name: "discord.txt",
      kind: "source",
    });
    await chat(context, MAYA, dealId, "Hi Chris, the sketch comes Friday.");
    await chat(context, CHRIS, dealId, "Great, thanks!");
    await saveAgreement(context, MAYA, dealId, {
      summary: "A full-body character",
      deliverables: ["Full-body character, transparent PNG"],
      exclusions: ["Merchandise use"],
      revisionsIncluded: 2,
      milestones: [{ title: "Deposit", amount: "120.00" }],
    });
    await sendForSigning(context, MAYA, dealId);
    await sign(context, CHRIS, dealId, "Chris Park");

    await sendInvoice(context, MAYA, dealId, 1);
    await sendInvoice(context, MAYA, dealId, 1);
    expect(paypal.drafts).toHaveLength(1);
    const waiting = await paidOrInstruction(context, MAYA, dealId, 1, CHRIS);
    expect(waiting).toMatch(/^Pay stage 1 \(120\.00 USD\) as chris\.park@pact-pal\.app/);
    paypal.paid.add("INV2-TEST-1");
    // PactPal lets a payment be checked again only after a few seconds; the next run is a new app.
    const later = dealTestApp(db, undefined, { invoices: paypal.invoices });
    expect(
      await paidOrInstruction({ ...context, app: later.app }, MAYA, dealId, 1, CHRIS),
    ).toBeUndefined();
    await later.app.close();

    const fileId = await upload(context, MAYA, dealId, {
      path: "deliverables/final.txt",
      name: "wren-final.txt",
      kind: "deliverable",
    });
    const deliveryId = await deliver(context, MAYA, dealId, { stage: 1, fileIds: [fileId] });
    await answerDelivery(context, CHRIS, dealId, deliveryId, { approve: true });

    const entries = await readLedger(db, dealId);
    const types = entries.map((e) => e.type);
    expect(types).toEqual(
      expect.arrayContaining(["ACCEPTED", "INVOICE_SENT", "PAYMENT_RECEIVED", "DELIVERY_SENT"]),
    );
    // Every entry the seed made says so in its browser name.
    expect(
      entries.filter((e) => e.userAgent !== undefined).every((e) => e.userAgent === SEED_AGENT),
    ).toBe(true);
    await env.app.close();
  });

  it("say clearly when a seller has not signed in yet or a route refuses", async () => {
    const { context, env } = await seedContext();
    await expect(
      createDeal(context, "nobody@pact-pal.app", { title: "X", category: "art-and-design" }),
    ).rejects.toThrow(/nobody@pact-pal.app has not signed in to PactPal yet/);
    await expect(
      createDeal(context, MAYA, { title: "", category: "art-and-design" }),
    ).rejects.toThrow(/POST \/api\/deals as maya.lin@pact-pal.app answered 400/);
    await env.app.close();
  });
});
