import { Check, Download, Loader2, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { Button } from "./Button";
import { useDemoData } from "../hooks/useDemoData";
import { useI18n } from "../hooks/useI18n";
import { generateReport } from "../utils/report";

/**
 * Self-contained "Export PDF" button. Generates a client-side PDF from the
 * current demo data and shows transient success/error feedback. Localized.
 */
export function ExportReportButton({ variant = "secondary", size = "sm", className = "" }) {
  const { data } = useDemoData();
  const { t, lang } = useI18n();
  const [status, setStatus] = useState("idle"); // idle | working | success | error

  async function handleExport() {
    setStatus("working");
    // Defer so the "working" state can paint before the (sync) jsPDF work.
    await new Promise((resolve) => window.setTimeout(resolve, 50));

    const result = generateReport({
      data,
      t,
      formatDate: (date) =>
        date.toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        })
    });

    setStatus(result.ok ? "success" : "error");
    window.setTimeout(() => setStatus("idle"), 2600);
  }

  const label =
    status === "working"
      ? t("common.exporting")
      : status === "success"
        ? t("common.exportSuccess")
        : status === "error"
          ? t("common.exportError")
          : t("common.exportPdf");

  const Icon =
    status === "working"
      ? Loader2
      : status === "success"
        ? Check
        : status === "error"
          ? TriangleAlert
          : Download;

  return (
    <Button
      variant={status === "error" ? "danger" : variant}
      size={size}
      className={className}
      onClick={handleExport}
      disabled={status === "working"}
      aria-label={t("common.exportPdf")}
    >
      <Icon size={16} className={status === "working" ? "animate-spin" : ""} />
      {label}
    </Button>
  );
}
