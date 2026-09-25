"use client";

export type DraftNotice = {
  kind: "success" | "info" | "error";
  message: string;
};

interface DraftActionsProps {
  notice: DraftNotice | null;
  onSave: () => void;
  onDelete: () => void;
}

export default function DraftActions({
  notice,
  onSave,
  onDelete,
}: DraftActionsProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn-secondary" onClick={onSave}>
          下書きを保存
        </button>
        <button type="button" className="btn-secondary" onClick={onDelete}>
          下書きを削除
        </button>
      </div>
      {notice && (
        <p
          className={`text-sm ${
            notice.kind === "error"
              ? "text-[var(--color-error)]"
              : notice.kind === "success"
                ? "text-[var(--color-accent-cyan)]"
                : "text-[var(--color-text-muted)]"
          }`}
          role={notice.kind === "error" ? "alert" : "status"}
          aria-live={notice.kind === "error" ? "assertive" : "polite"}
        >
          {notice.message}
        </p>
      )}
    </div>
  );
}
