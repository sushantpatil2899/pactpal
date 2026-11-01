import { formatErrors, loadConfig, type Config } from "./config.js";

/** The settings from the environment for a command-line tool; prints what is wrong and stops if they are invalid. */
export function loadConfigOrExit(): Config {
  const result = loadConfig(process.env);
  if (!result.ok) {
    process.stderr.write(formatErrors(result.errors));
    process.exit(1);
  }
  return result.config;
}
