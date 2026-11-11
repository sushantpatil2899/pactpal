import { LicenseManager } from "ag-grid-enterprise";
import { AgStudioLicenseManager } from "ag-studio";

let given = false;

/** Hands AG its licence key once, before the first grid or chart is drawn. */
export function giveAgLicence(): void {
  const key = import.meta.env.VITE_AG_LICENCE_KEY;
  if (given || key === undefined || key === "") return;
  given = true;
  LicenseManager.setLicenseKey(key);
  AgStudioLicenseManager.setLicenseKey(key);
}
