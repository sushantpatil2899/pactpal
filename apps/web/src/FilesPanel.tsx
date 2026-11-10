import { useEffect, useRef, useState, type FormEvent } from "react";
import { MAX_FILE_BYTES, addFile, fileUrl, listFiles, type DealFile } from "./api";
import { sizeWords } from "@pactpal/words";

const TYPE_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
  "image/png": "PNG picture",
  "image/jpeg": "JPEG picture",
  "image/gif": "GIF picture",
  "text/plain": "text",
};

const dateOf = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { dateStyle: "medium", timeZone: "UTC" });

const ADDED_BY: Record<DealFile["addedBy"], string> = {
  seller: "added by the seller",
  buyer: "added by the buyer",
  system: "added by PactPal",
};

/** What the add box asks for: the seller's sources, or the buyer's reference files. */
const ADD_LABELS = {
  seller:
    "Add a file the deal is based on (a saved chat, an email, a brief or pictures; up to 10 MB)",
  buyer:
    "Add a file for the seller (a brief, examples or reference pictures; PDF, PNG, JPEG, GIF or text; up to 10 MB)",
} as const;

/**
 * The files a deal is based on (a saved chat, a brief, reference pictures). Both sides list,
 * download and add them; each file says who added it. Each download is checked against its
 * fingerprint first.
 */
export function FilesPanel({
  dealId,
  addAs,
  onAdded,
}: {
  dealId: string;
  /** Who may add files here, or undefined when this visitor cannot. */
  addAs: "seller" | "buyer" | undefined;
  onAdded: () => void;
}) {
  const [files, setFiles] = useState<DealFile[] | undefined>();
  const [problem, setProblem] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const picker = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listFiles(dealId).then(setFiles, () => {
      setProblem("Could not load the files.");
    });
  }, [dealId]);

  const onAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const file = picker.current?.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setProblem("the file is larger than 10 MB");
      return;
    }
    setBusy(true);
    setProblem(undefined);
    addFile(dealId, file).then(
      (added) => {
        setBusy(false);
        setFiles((current) => [...(current ?? []), added]);
        if (picker.current) picker.current.value = "";
        onAdded();
      },
      (error: unknown) => {
        setBusy(false);
        setProblem(error instanceof Error ? error.message : "Could not add the file.");
      },
    );
  };

  return (
    <section aria-labelledby="files">
      <h3 id="files">Files</h3>
      {problem && (
        <p role="alert" data-tone="problem">
          {problem}
        </p>
      )}
      {files?.length === 0 && <p>No files yet.</p>}
      {files && files.length > 0 && (
        <ul>
          {files.map((file) => (
            <li key={file.id}>
              <a href={fileUrl(dealId, file.id)} download={file.filename}>
                {file.filename}
              </a>{" "}
              · {TYPE_LABELS[file.mediaType] ?? "other file"} · {sizeWords(file.sizeBytes)} ·{" "}
              {ADDED_BY[file.addedBy]} on {dateOf(file.addedAt)}{" "}
              <code title="This file's fingerprint (SHA-256)">{file.sha256.slice(0, 12)}…</code>
            </li>
          ))}
        </ul>
      )}
      {addAs && (
        <form onSubmit={onAdd}>
          <p>
            <label>
              {ADD_LABELS[addAs]} <input ref={picker} type="file" name="file" required />
            </label>{" "}
            <button type="submit" disabled={busy}>
              Add the file
            </button>
          </p>
        </form>
      )}
    </section>
  );
}
