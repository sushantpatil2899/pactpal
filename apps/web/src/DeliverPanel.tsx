import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  MAX_FILE_BYTES,
  addFile,
  getDeliveryChecks,
  runDeliveryCheck,
  sendDelivery,
  type DeliveriesView,
  type DeliveryCheckView,
} from "./api";
import { DeliveryCheckReport } from "./DeliveryCheckReport";
import { smallerCopy } from "./smaller-copy";
import { FULL_WIDTH } from "./styles";

/** At most this many images get the automatic look in one check. */
const MAX_LOOKS = 4;

/** Which stage and files a check was for, so changing either clears it. */
const selectionKey = (stage: number, files: readonly File[]) =>
  [
    String(stage),
    ...files.map((f) => `${f.name}:${String(f.size)}:${String(f.lastModified)}`),
  ].join("|");

/** The files chosen in the form, and the stage. */
function chosen(form: HTMLFormElement) {
  const data = new FormData(form);
  const files = data.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  const message = data.get("message");
  return {
    stage: Number(data.get("stage")),
    files,
    message: typeof message === "string" && message.trim() !== "" ? message : undefined,
  };
}

/**
 * The seller's form to deliver work: pick the stage, choose files and add a message. "Check the
 * files first" uploads them and checks them against the signed agreement (advice only); "Send to
 * the buyer" sends the checked files, or uploads and sends the chosen ones. The buyer gets an
 * email with a private link.
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
  const [busy, setBusy] = useState<"checking" | "sending" | undefined>();
  const [problem, setProblem] = useState<string | undefined>();
  const [checks, setChecks] = useState<DeliveryCheckView[]>([]);
  // The newest check of the files now chosen: their uploaded ids and the selection they match.
  const [checked, setChecked] = useState<{ key: string; fileIds: string[] } | undefined>();
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    getDeliveryChecks(dealId).then(
      (view) => {
        setChecks(view.checks);
      },
      () => undefined,
    );
  }, [dealId]);

  /** The chosen files, or undefined after saying what is wrong with them. */
  const validFiles = () => {
    if (!form.current) return undefined;
    const choice = chosen(form.current);
    if (choice.files.length === 0) {
      setProblem("Choose at least one file.");
      return undefined;
    }
    if (choice.files.some((f) => f.size > MAX_FILE_BYTES)) {
      setProblem("Each file must be 10 MB or less.");
      return undefined;
    }
    return choice;
  };

  const fail = (error: unknown, fallback: string) => {
    setBusy(undefined);
    setProblem(error instanceof Error ? error.message : fallback);
  };

  const onCheck = () => {
    const choice = validFiles();
    if (!choice) return;
    setBusy("checking");
    setProblem(undefined);
    const key = selectionKey(choice.stage, choice.files);
    Promise.all(choice.files.map((f) => addFile(dealId, f, "deliverable")))
      .then(async (added) => {
        const copies: { fileId: string; mediaType: "image/jpeg"; base64: string }[] = [];
        for (const [i, file] of choice.files.entries()) {
          const id = added[i]?.id;
          const copy = copies.length < MAX_LOOKS ? await smallerCopy(file) : undefined;
          if (id !== undefined && copy) copies.push({ fileId: id, ...copy });
        }
        const fileIds = added.map((f) => f.id);
        const view = await runDeliveryCheck(dealId, { stage: choice.stage, fileIds, copies });
        setBusy(undefined);
        setChecks(view.checks);
        setChecked({ key, fileIds });
      })
      .catch((error: unknown) => {
        fail(error, "Could not check the files.");
      });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const choice = validFiles();
    if (!choice) return;
    setBusy("sending");
    setProblem(undefined);
    const sameAsChecked = checked?.key === selectionKey(choice.stage, choice.files);
    const fileIds = sameAsChecked
      ? Promise.resolve(checked.fileIds)
      : Promise.all(choice.files.map((f) => addFile(dealId, f, "deliverable"))).then((added) =>
          added.map((f) => f.id),
        );
    fileIds
      .then((ids) =>
        sendDelivery(dealId, {
          stage: choice.stage,
          ...(choice.message === undefined ? {} : { message: choice.message }),
          fileIds: ids,
        }),
      )
      .then(
        (view) => {
          setBusy(undefined);
          setChecked(undefined);
          form.current?.reset();
          onSent(view);
        },
        (error: unknown) => {
          fail(error, "Could not send the delivery.");
        },
      );
  };

  // A different stage or file choice no longer matches the check shown.
  const onChange = () => {
    if (!form.current || !checked) return;
    const choice = chosen(form.current);
    if (selectionKey(choice.stage, choice.files) !== checked.key) setChecked(undefined);
  };

  const [newest, ...earlier] = checks;
  return (
    <form ref={form} onSubmit={onSubmit} onChange={onChange} aria-labelledby="deliver">
      <h4 id="deliver">Deliver work</h4>
      {problem && (
        <p role="alert" data-tone="problem">
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
        &ldquo;Check the files first&rdquo; compares them with the signed agreement: exact checks by
        code, and an automatic look at images that may be wrong. Only you see it. The files are
        uploaded to the deal for the check.
      </p>
      {checked && newest && <DeliveryCheckReport check={newest} />}
      <p>
        The buyer gets an email with a private link. Opening the delivery and each download are
        recorded.
      </p>
      <button type="button" disabled={busy !== undefined} onClick={onCheck}>
        {busy === "checking" ? "Checking…" : "Check the files first"}
      </button>{" "}
      <button type="submit" disabled={busy !== undefined}>
        {checked ? "Send the checked files to the buyer" : "Send to the buyer"}
      </button>
      {(checked ? earlier : checks).length > 0 && (
        <details>
          <summary>Earlier checks ({(checked ? earlier : checks).length})</summary>
          {(checked ? earlier : checks).map((check) => (
            <DeliveryCheckReport key={check.id} check={check} />
          ))}
        </details>
      )}
    </form>
  );
}
