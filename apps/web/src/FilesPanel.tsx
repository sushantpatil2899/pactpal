import { useEffect, useRef, useState, type FormEvent } from "react";
import { MAX_FILE_BYTES, addFile, fileUrl, listFiles, type DealFile } from "./api";

const TYPE_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
  "image/png": "PNG picture",
  "image/jpeg": "JPEG picture",
  "image/gif": "GIF picture",
  "text/plain": "text",
};

function sizeOf(bytes: number): string {
  if (bytes < 1024) return `${String(bytes)} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const dateOf = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { dateStyle: "medium", timeZone: "UTC" });

/**
 * The files a deal is based on (a saved chat, a brief, reference pictures). Both sides list and
 * download them; the seller adds them. Each download is checked against its fingerprint first.
 */
export function FilesPanel({
  dealId,
  canAdd,
  onAdded,
}: {
  dealId: string;
  canAdd: boolean;
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
        <p role="alert" style={{ color: "#8a1c1c" }}>
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
              · {TYPE_LABELS[file.mediaType] ?? "other file"} · {sizeOf(file.sizeBytes)} · added{" "}
              {dateOf(file.addedAt)}{" "}
              <code title="This file's fingerprint (SHA-256)">{file.sha256.slice(0, 12)}…</code>
            </li>
          ))}
        </ul>
      )}
      {canAdd && (
        <form onSubmit={onAdd}>
          <p>
            <label>
              Add a file the deal is based on (a saved chat, an email, a brief or pictures; up to 10
              MB) <input ref={picker} type="file" name="file" required />
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
