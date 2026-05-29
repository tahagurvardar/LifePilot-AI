import { jsPDF } from "jspdf";
import { readStorage } from "./storage";
import {
  calculateBudgetUsage,
  calculateCareerReadiness,
  calculateFinanceSummary,
  formatCurrency,
  formatPercent
} from "./finance";

export const RESUME_ANALYSIS_KEY = "lifepilot_resume_analysis";

// Strip characters the default jsPDF (WinAnsi) font cannot render so Turkish
// text never produces garbled glyphs in the PDF. Latin-1 chars pass through.
function safeText(value) {
  if (value == null) return "";
  return String(value)
    .replace(/[ğĞ]/g, (c) => (c === "ğ" ? "g" : "G")) // ğ Ğ
    .replace(/[ı]/g, "i") // ı
    .replace(/[İ]/g, "I") // İ
    .replace(/[şŞ]/g, (c) => (c === "ş" ? "s" : "S")) // ş Ş
    .replace(/[çÇ]/g, (c) => (c === "ç" ? "c" : "C")) // ç Ç
    .replace(/[^\x00-\xFF]/g, ""); // drop anything else outside Latin-1
}

function groupApplicationsByStatus(applications = []) {
  return applications.reduce((acc, application) => {
    acc[application.status] = (acc[application.status] ?? 0) + 1;
    return acc;
  }, {});
}

/**
 * Generate and download a clean, text-based PDF report. Fully client-side via
 * jsPDF. Defensive against missing data so it never throws.
 *
 * @returns {{ ok: boolean, error?: string }}
 */
export function generateReport({ data, t, formatDate }) {
  try {
    const tr = typeof t === "function" ? t : (key) => key;
    const profile = data?.profile ?? {};
    const career = data?.career ?? {};
    const currency = data?.preferences?.currency ?? "USD";

    const summary = calculateFinanceSummary(data ?? {});
    const budget = calculateBudgetUsage(data ?? {});
    const readiness = calculateCareerReadiness(data ?? {});
    const savingsGoal = data?.savingsGoal ?? { current: 0, target: 0, name: "" };
    const savingsProgress = savingsGoal.target
      ? (savingsGoal.current / savingsGoal.target) * 100
      : 0;
    const resume = readStorage(RESUME_ANALYSIS_KEY, null);

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const ensureSpace = (needed) => {
      if (y + needed > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    const sectionHeading = (text) => {
      ensureSpace(14);
      y += 4;
      doc.setFillColor(16, 185, 129);
      doc.rect(margin, y - 4, 2.5, 6, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(20, 23, 31);
      doc.text(safeText(text), margin + 5, y);
      y += 6;
      doc.setDrawColor(229, 231, 235);
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;
    };

    const row = (label, value) => {
      ensureSpace(7);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(90, 96, 110);
      doc.text(safeText(label), margin, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 23, 31);
      doc.text(safeText(value), pageWidth - margin, y, { align: "right" });
      y += 6.5;
    };

    const paragraph = (text, color = [90, 96, 110]) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(safeText(text), contentWidth);
      lines.forEach((line) => {
        ensureSpace(6);
        doc.text(line, margin, y);
        y += 5;
      });
    };

    // ---- Header ----
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129);
    doc.text(safeText(tr("common.appName")), margin, y + 4);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(90, 96, 110);
    doc.text(safeText(tr("report.heading")), margin, y + 11);
    y += 18;

    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.6);
    doc.line(margin, y, pageWidth - margin, y);
    doc.setLineWidth(0.2);
    y += 8;

    const dateStr =
      typeof formatDate === "function"
        ? formatDate(new Date())
        : new Date().toLocaleDateString();
    row(tr("report.preparedFor"), profile.name || "Demo User");
    row(tr("report.date"), dateStr);

    // ---- Financial summary ----
    sectionHeading(tr("report.financialSummary"));
    row(tr("report.totalBalance"), formatCurrency(summary.totalBalance, currency));
    row(tr("report.monthlyIncome"), formatCurrency(summary.monthlyIncome, currency));
    row(tr("report.monthlyExpenses"), formatCurrency(summary.monthlyExpenses, currency));
    row(tr("report.monthlyBudget"), formatCurrency(budget.limit, currency));
    row(
      tr("report.budgetUsage"),
      budget.limit > 0 ? formatPercent(budget.usage) : "-"
    );
    row(
      tr("report.savingsGoal"),
      `${formatPercent(savingsProgress)} (${formatCurrency(savingsGoal.current, currency)} / ${formatCurrency(
        savingsGoal.target,
        currency
      )})`
    );

    // ---- Career summary ----
    sectionHeading(tr("report.careerSummary"));
    row(tr("report.targetRole"), career.targetRole || "-");
    row(tr("report.careerReadiness"), `${readiness} / 100`);
    const skills = (career.skills ?? []).slice(0, 8).join(", ");
    if (skills) {
      ensureSpace(7);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(90, 96, 110);
      doc.text(safeText(`${tr("report.skills")}:`), margin, y);
      y += 5.5;
      paragraph(skills, [20, 23, 31]);
    }
    const grouped = groupApplicationsByStatus(career.applications);
    const appsLine = Object.entries(grouped)
      .map(([status, count]) => `${status}: ${count}`)
      .join("   ");
    row(tr("report.applications"), appsLine || "-");

    // ---- Resume summary ----
    sectionHeading(tr("report.resumeSummary"));
    if (resume && typeof resume.overall === "number") {
      row(tr("report.resumeScore"), `${resume.overall} / 100`);
      const topNotes = (resume.sections ?? []).slice(0, 4);
      if (topNotes.length) {
        ensureSpace(6);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(20, 23, 31);
        doc.text(safeText(`${tr("report.keyFeedback")}:`), margin, y);
        y += 5.5;
        topNotes.forEach((section) => {
          paragraph(`- ${section.title} (${section.score}%): ${section.note}`);
        });
      }
    } else {
      paragraph(tr("report.noResume"));
    }

    // ---- AI advisor disclaimer ----
    sectionHeading(tr("report.advisorNote"));
    paragraph(tr("report.advisorDisclaimer"), [180, 83, 9]);

    // ---- Footer on every page ----
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i += 1) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(150, 155, 165);
      doc.text(safeText(tr("report.footer")), margin, pageHeight - 8);
      doc.text(`${i} / ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: "right" });
    }

    const safeName = (profile.name || "user").replace(/\s+/g, "-").toLowerCase();
    doc.save(`lifepilot-report-${safeName}.pdf`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: String(error?.message ?? error) };
  }
}
