import { describe, expect, it } from "vitest";
import { PayPalApiError } from "./errors.js";
import { PARTNER_FEATURES, PayPalPartners, referralBody } from "./partners.js";
import { fakeClients } from "./test-fakes.js";

function setup(rest: unknown[] = []) {
  const { rest: client, restCalls } = fakeClients({ mcp: "none", rest });
  return { partners: new PayPalPartners(client), restCalls };
}

const notFound = new PayPalApiError("GET x", 404, "RESOURCE_NOT_FOUND", "not found", [], "dbg-404");

describe("PayPalPartners.createReferral", () => {
  const request = {
    trackingId: "pactpal-1",
    returnUrl: "https://pactpal.test/",
    features: PARTNER_FEATURES,
    requestId: "ref-1",
  };

  it("asks for third-party invoice and dispute permissions and returns the connect page", async () => {
    const { partners, restCalls } = setup([
      {
        links: [
          {
            href: "https://api-m.sandbox.paypal.com/v2/customer/partner-referrals/R1",
            rel: "self",
          },
          {
            href: "https://www.sandbox.paypal.com/bizsignup/partner/entry?referralToken=T",
            rel: "action_url",
          },
        ],
      },
    ]);
    expect(await partners.createReferral(request)).toEqual({
      actionUrl: "https://www.sandbox.paypal.com/bizsignup/partner/entry?referralToken=T",
      debugId: "dbg-rest",
    });
    expect(restCalls[0]).toMatchObject({
      method: "POST",
      path: "/v2/customer/partner-referrals",
      requestId: "ref-1",
      body: referralBody(request),
    });
    expect(referralBody(request)).toMatchObject({
      tracking_id: "pactpal-1",
      operations: [
        {
          operation: "API_INTEGRATION",
          api_integration_preference: {
            rest_api_integration: {
              integration_type: "THIRD_PARTY",
              third_party_details: {
                features: ["INVOICE_READ_WRITE", "READ_SELLER_DISPUTE", "UPDATE_SELLER_DISPUTE"],
              },
            },
          },
        },
      ],
      partner_config_override: { return_url: "https://pactpal.test/" },
    });
  });

  it("rejects an answer without a connect page", async () => {
    const { partners } = setup([{ links: [{ href: "x", rel: "self" }] }]);
    await expect(partners.createReferral(request)).rejects.toThrow(/no action_url link/);
  });
});

describe("PayPalPartners.ownAccountId", () => {
  it("reads the platform account's id from its balances report", async () => {
    const { partners, restCalls } = setup([{ account_id: "PARTNER1", balances: [] }]);
    expect(await partners.ownAccountId()).toBe("PARTNER1");
    expect(restCalls[0]).toMatchObject({ method: "GET", path: "/v1/reporting/balances" });
  });

  it("rejects an answer without an account id", async () => {
    const { partners } = setup([{ balances: [] }]);
    await expect(partners.ownAccountId()).rejects.toThrow();
  });
});

describe("PayPalPartners.findMerchant", () => {
  it("finds the seller who connected with the tracking id", async () => {
    const { partners, restCalls } = setup([{ merchant_id: "SELLER2", tracking_id: "t-1" }]);
    expect(await partners.findMerchant("PARTNER1", "t-1")).toEqual({
      connected: true,
      merchantId: "SELLER2",
    });
    expect(restCalls[0]).toMatchObject({
      path: "/v1/customer/partners/PARTNER1/merchant-integrations",
      query: { tracking_id: "t-1" },
    });
  });

  it.each([
    ["a 404", notFound],
    ["an answer without a merchant id", { tracking_id: "t-1" }],
    ["an empty answer", undefined],
  ])("reads %s as not connected yet", async (_label, reply) => {
    const { partners } = setup([reply]);
    expect(await partners.findMerchant("PARTNER1", "t-1")).toEqual({ connected: false });
  });

  it("passes on any other PayPal error", async () => {
    const forbidden = new PayPalApiError("GET x", 403, "NOT_AUTHORIZED", "no", [], "dbg-403");
    const { partners } = setup([forbidden]);
    await expect(partners.findMerchant("PARTNER1", "t-1")).rejects.toBe(forbidden);
  });
});

describe("PayPalPartners.merchantStatus", () => {
  it("reads the account checks and the permissions granted to each platform app", async () => {
    const { partners, restCalls } = setup([
      {
        merchant_id: "SELLER2",
        tracking_id: "t-1",
        payments_receivable: true,
        primary_email_confirmed: false,
        oauth_integrations: [
          {
            integration_type: "OAUTH_THIRDPARTY",
            oauth_third_party: [
              {
                partner_client_id: "client-id",
                scopes: ["https://uri.paypal.com/services/invoicing"],
              },
              {},
            ],
          },
          {},
        ],
      },
    ]);
    expect(await partners.merchantStatus("PARTNER1", "SELLER2")).toEqual({
      merchantId: "SELLER2",
      trackingId: "t-1",
      paymentsReceivable: true,
      emailConfirmed: false,
      grants: [
        { partnerClientId: "client-id", scopes: ["https://uri.paypal.com/services/invoicing"] },
        { partnerClientId: undefined, scopes: [] },
      ],
    });
    expect(restCalls[0]).toMatchObject({
      method: "GET",
      path: "/v1/customer/partners/PARTNER1/merchant-integrations/SELLER2",
    });
  });

  it("reads a seller with no permissions listed", async () => {
    const { partners } = setup([{ merchant_id: "SELLER2" }]);
    expect(await partners.merchantStatus("PARTNER1", "SELLER2")).toMatchObject({
      grants: [],
      paymentsReceivable: undefined,
    });
  });

  it("rejects an answer without the seller's id", async () => {
    const { partners } = setup([{}]);
    await expect(partners.merchantStatus("PARTNER1", "SELLER2")).rejects.toBeInstanceOf(Error);
  });
});
