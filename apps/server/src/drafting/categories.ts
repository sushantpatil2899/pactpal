import { DEAL_CATEGORIES } from "@pactpal/db";

/** The categories the models may choose from, as the draft prompt wants them. */
export const draftCategories = Object.entries(DEAL_CATEGORIES).map(([id, { label }]) => ({
  id,
  label,
}));
