import type { ChatClient } from "@pactpal/ai";
import { loadConfigOrExit } from "./cli-config.js";
import { councilClients } from "./drafting/runtime.js";

/** The names in a `--models a,b` value; an empty list means all models. */
export function modelNames(value: string | undefined): string[] {
  return value === undefined ? [] : value.split(",").map((name) => name.trim());
}

/** The models whose names are listed, in the order of `clients`; an empty list means all. Unknown names are returned so the caller can say so. */
export function pickModels<T extends { spec: { name: string } }>(
  clients: readonly T[],
  names: readonly string[],
): { picked: T[]; unknown: string[] } {
  if (names.length === 0) return { picked: [...clients], unknown: [] };
  return {
    picked: clients.filter((client) => names.includes(client.spec.name)),
    unknown: names.filter((name) => !clients.some((client) => client.spec.name === name)),
  };
}

/** For the live commands: the configured models, narrowed to `names`; says why and exits when none are left. */
export function selectedClientsOrExit(names: readonly string[]): ChatClient[] {
  const { picked, unknown } = pickModels(councilClients(loadConfigOrExit().ai.keys), names);
  if (unknown.length > 0) process.stderr.write(`Not a configured model: ${unknown.join(", ")}\n`);
  if (picked.length === 0) {
    process.stderr.write(
      "No AI model key is set (or none matches --models), so there is nothing to test.\n",
    );
    process.exit(1);
  }
  return picked;
}
