import { useState } from "react";
import { MAX_FILE_BYTES, addFile, readScreenshots } from "./api";
import { screenshotNotice } from "./screenshot-words";
import { smallerCopy } from "./smaller-copy";

/** At most this many screenshots are read at once (as the server allows). */
const MAX_SCREENSHOTS = 10;

/**
 * "Read screenshots of the chat": the chosen screenshots are saved as source files of the deal
 * (in the order picked), an image model reads a smaller copy of each, and the text goes into the
 * chat box with a notice for the seller to check it. Nothing is drafted until they do.
 */
export function ScreenshotReader({
  dealId,
  disabled,
  onRead,
  onLogChange,
}: {
  dealId: string;
  disabled: boolean;
  onRead: (text: string, notice: string) => void;
  onLogChange: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | undefined>();
  const [chosen, setChosen] = useState<File[]>([]);

  const onClick = () => {
    if (chosen.length === 0) return;
    if (chosen.length > MAX_SCREENSHOTS) {
      setProblem(`Choose at most ${String(MAX_SCREENSHOTS)} screenshots at a time.`);
      return;
    }
    if (chosen.some((f) => f.size > MAX_FILE_BYTES)) {
      setProblem("Each screenshot must be 10 MB or less.");
      return;
    }
    setBusy(true);
    setProblem(undefined);
    const work = async () => {
      const saved = [];
      for (const file of chosen) saved.push(await addFile(dealId, file, "source"));
      onLogChange();
      const copies = [];
      for (const [i, file] of chosen.entries()) {
        const copy = await smallerCopy(file);
        const id = saved[i]?.id;
        if (copy && id !== undefined) copies.push({ fileId: id, ...copy });
      }
      return readScreenshots(dealId, { fileIds: saved.map((f) => f.id), copies });
    };
    work().then(
      (reading) => {
        setBusy(false);
        onRead(reading.text, screenshotNotice(reading));
      },
      (error: unknown) => {
        setBusy(false);
        setProblem(error instanceof Error ? error.message : "Could not read the screenshots.");
      },
    );
  };

  return (
    <p>
      <label>
        or read screenshots of the chat (in order, up to {MAX_SCREENSHOTS}){" "}
        <input
          type="file"
          accept="image/png,image/jpeg"
          multiple
          disabled={disabled || busy}
          onChange={(event) => {
            setChosen([...(event.currentTarget.files ?? [])]);
          }}
        />
      </label>{" "}
      <button type="button" disabled={disabled || busy || chosen.length === 0} onClick={onClick}>
        {busy ? "Reading…" : "Read the screenshots"}
      </button>
      {problem && (
        <span role="alert" data-tone="problem-block">
          {problem}
        </span>
      )}
    </p>
  );
}
