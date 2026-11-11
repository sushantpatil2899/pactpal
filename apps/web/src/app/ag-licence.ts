import { LicenseManager } from "ag-grid-enterprise";
import { AgStudioLicenseManager } from "ag-studio";

let given = false;

/**
 * Hands AG its licence keys once, before the first grid or chart is drawn (9k-2). AG Grid
 * Enterprise (the deals table) and AG Studio (Insights) are licensed separately, so each gets its
 * own key; a product without its key stays in AG's trial mode rather than being given the other's.
 */
export function giveAgLicence(
  gridKey = import.meta.env.VITE_AG_GRID_LICENCE_KEY,
  studioKey = import.meta.env.VITE_AG_LICENCE_KEY,
): void {
  if (given) return;
  given = true;
  if (gridKey !== undefined && gridKey !== "") LicenseManager.setLicenseKey(gridKey);
  if (studioKey !== undefined && studioKey !== "") AgStudioLicenseManager.setLicenseKey(studioKey);
}
