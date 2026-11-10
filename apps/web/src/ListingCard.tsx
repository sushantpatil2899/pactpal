import { listingLines, listingSource } from "@pactpal/words";
import type { ListingPreview, ListingView } from "./api";
import { WRAP } from "./styles";

const fileUrl = (dealId: string, fileId: string) =>
  `/api/deals/${encodeURIComponent(dealId)}/files/${encodeURIComponent(fileId)}`;

/**
 * "What's being sold" (8e): the product as its listing page described it, in the same lines the
 * signed page, the receipt and the AI read, with the saved photos (served by PactPal itself).
 */
export function ListingCard({
  dealId,
  listing,
}: {
  dealId: string;
  listing: ListingPreview | ListingView;
}) {
  const photos = "photos" in listing ? listing.photos : [];
  return (
    <section
      aria-label="What is being sold, as listed"
      style={{ ...WRAP, border: "1px solid #ccc", borderRadius: 8, padding: "0 12px" }}
    >
      <h4>What is being sold, as listed on {listingSource(listing)}</h4>
      {photos.length > 0 && (
        <p>
          {photos.map((photo, n) => (
            <img
              key={photo.artifactId}
              src={fileUrl(dealId, photo.artifactId)}
              alt={`Listing photo ${String(n + 1)} of ${listing.title}`}
              style={{ width: 120, height: 120, objectFit: "contain", marginRight: 8 }}
            />
          ))}
        </p>
      )}
      <ul>
        {listingLines(listing).map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p>
        <small>
          Listing page:{" "}
          <a href={listing.url} target="_blank" rel="noreferrer noopener">
            {listing.url}
          </a>
          {photos.length === 0 && listing.imageUrls.length > 0
            ? ` · ${String(listing.imageUrls.length)} photos found, saved when the listing is used`
            : ""}
          . Product details by Channel3.
        </small>
      </p>
    </section>
  );
}
