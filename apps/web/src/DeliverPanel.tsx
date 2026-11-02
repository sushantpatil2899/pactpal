import { useState, type FormEvent } from "react";
import { MAX_FILE_BYTES, addFile, sendDelivery, type DeliveriesView } from "./api";
import { FULL_WIDTH } from "./styles";

/**
 * The seller's form to deliver work: pick the stage, choose files and add a message. The files
 * are uploaded as delivered work, then sent together; the buyer gets an email with a private link.
 */
export function DeliverPanel({
  dealId,
  stages,
  onSent,
}: {
  dealId: string;
  stages: DeliveriesView["stages"];
  onSent: (view: DeliveriesView) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | undefined>();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const files = data.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
    const message = data.get("message");
    if (files.length === 0) {
      setProblem("Choose at least one file.");
      return;
    }
    if (files.some((f) => f.size > MAX_FILE_BYTES)) {
      setProblem("Each file must be 10 MB or less.");
      return;
    }
    setBusy(true);
    setProblem(undefined);
    Promise.all(files.map((f) => addFile(dealId, f, "deliverable")))
      .then((added) =>
        sendDelivery(dealId, {
          stage: Number(data.get("stage")),
          ...(typeof message === "string" && message.trim() !== "" ? { message } : {}),
          fileIds: added.map((f) => f.id),
        }),
      )
      .then(
        (view) => {
          setBusy(false);
          form.reset();
          onSent(view);
        },
        (error: unknown) => {
          setBusy(false);
          setProblem(error instanceof Error ? error.message : "Could not send the delivery.");
        },
      );
  };

  return (
    <form onSubmit={onSubmit} aria-labelledby="deliver">
      <h4 id="deliver">Deliver work</h4>
      {problem && (
        <p role="alert" style={{ color: "#8a1c1c" }}>
          {problem}
        </p>
      )}
      <p>
        <label>
          Payment stage{" "}
          <select name="stage" required>
            {stages.map((s) => (
              <option key={s.stage} value={s.stage}>
                {s.stage}. {s.title}
              </option>
            ))}
          </select>
        </label>
      </p>
      <p>
        <label>
          Files (up to 10 MB each) <input name="files" type="file" multiple required />
        </label>
      </p>
      <p>
        <label>
          Message to the buyer (optional)
          <textarea name="message" maxLength={1000} rows={2} style={FULL_WIDTH} />
        </label>
      </p>
      <p>
        The buyer gets an email with a private link. Opening the delivery and each download are
        recorded.
      </p>
      <button type="submit" disabled={busy}>
        Send to the buyer
      </button>
    </form>
  );
}
