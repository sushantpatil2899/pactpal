import { useState } from "react";
import { lookUpListing, saveListingPhotos, type ListingPreview, type ListingView } from "./api";
import { ListingCard } from "./ListingCard";
import { FULL_WIDTH } from "./styles";

/**
 * "What's being sold" in the agreement editor (8e): the seller pastes the product's listing
 * link, reads what Channel3 found, and uses it (its photos are then saved as the deal's files).
 * The listing joins the agreement when the seller saves it; it can be removed before then.
 */
export function ListingEditor({
  dealId,
  listing,
  onChange,
}: {
  dealId: string;
  listing: ListingView | undefined;
  onChange: (listing: ListingView | undefined) => void;
}) {
  const [preview, setPreview] = useState<ListingPreview | undefined>();
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | undefined>();

  const run = <T,>(work: Promise<T>, then: (value: T) => void) => {
    setBusy(true);
    setProblem(undefined);
    work.then(
      (value) => {
        setBusy(false);
        then(value);
      },
      (error: unknown) => {
        setBusy(false);
        setProblem(error instanceof Error ? error.message : "Something went wrong.");
      },
    );
  };
  // A button, not a form: this sits inside the agreement's own form.
  const lookUp = () => {
    if (url.trim() === "") return;
    run(lookUpListing(dealId, url.trim()), (found) => {
      setPreview(found.listing);
    });
  };
  const use = (found: ListingPreview) => {
    const urls = found.imageUrls;
    run(
      urls.length === 0 ? Promise.resolve({ photos: [] }) : saveListingPhotos(dealId, urls),
      (saved) => {
        onChange({ ...found, photos: saved.photos });
        setPreview(undefined);
      },
    );
  };

  return (
    <fieldset>
      <legend>What&rsquo;s being sold (optional)</legend>
      {problem && (
        <p role="alert" style={{ color: "#8a1c1c" }}>
          {problem}
        </p>
      )}
      {listing ? (
        <>
          <ListingCard dealId={dealId} listing={listing} />
          <p>
            Part of the agreement once you save it; the buyer signs it with the rest.{" "}
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                onChange(undefined);
              }}
            >
              Remove the listing
            </button>
          </p>
        </>
      ) : (
        <>
          <p>
            Paste the product&rsquo;s listing link (your shop page, say). Its details become part of
            what the buyer signs, so a &ldquo;not as described&rdquo; claim can be checked against
            them.
          </p>
          <p>
            <label>
              Listing link{" "}
              <input
                type="url"
                value={url}
                maxLength={2000}
                style={FULL_WIDTH}
                onChange={(event) => {
                  setUrl(event.target.value);
                }}
              />
            </label>{" "}
            <button type="button" disabled={busy || url.trim() === ""} onClick={lookUp}>
              Look up
            </button>
          </p>
          {preview && (
            <>
              <ListingCard dealId={dealId} listing={preview} />
              <p>
                Check these details are right before using them.{" "}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    use(preview);
                  }}
                >
                  Use this listing
                </button>
              </p>
            </>
          )}
        </>
      )}
    </fieldset>
  );
}
