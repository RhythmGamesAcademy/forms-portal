export const LOCAL_DRAFT_VERSION = 1;

export type DraftFormType = "instructor" | "course";

export type LocalDraftReadResult<T> =
  | { status: "missing" }
  | { status: "loaded"; data: T }
  | { status: "invalid" }
  | { status: "unavailable" };

type LocalDraftEnvelope<T> = {
  version: typeof LOCAL_DRAFT_VERSION;
  form: DraftFormType;
  data: T;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function readLocalDraft<T>(
  key: string,
  form: DraftFormType,
  parseData: (value: unknown) => T | null
): LocalDraftReadResult<T> {
  if (typeof window === "undefined") return { status: "unavailable" };

  let serialized: string | null;
  try {
    serialized = window.localStorage.getItem(key);
  } catch {
    return { status: "unavailable" };
  }

  if (serialized === null) return { status: "missing" };

  let envelope: unknown;
  try {
    envelope = JSON.parse(serialized);
  } catch {
    return { status: "invalid" };
  }

  if (
    !isRecord(envelope) ||
    envelope.version !== LOCAL_DRAFT_VERSION ||
    envelope.form !== form ||
    !("data" in envelope)
  ) {
    return { status: "invalid" };
  }

  try {
    const data = parseData(envelope.data);
    return data === null ? { status: "invalid" } : { status: "loaded", data };
  } catch {
    return { status: "invalid" };
  }
}

/** Writes one key in a single operation; an exception leaves its prior value untouched. */
export function writeLocalDraft<T>(
  key: string,
  form: DraftFormType,
  data: T
): boolean {
  if (typeof window === "undefined") return false;

  try {
    const envelope: LocalDraftEnvelope<T> = {
      version: LOCAL_DRAFT_VERSION,
      form,
      data,
    };
    const serialized = JSON.stringify(envelope);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch {
    return false;
  }
}

export function deleteLocalDraft(key: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function isRecordValue(value: unknown): value is Record<string, unknown> {
  return isRecord(value);
}
