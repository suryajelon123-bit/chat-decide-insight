import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import type { Answer, AnswerBlock, Turn, Language } from "./mock-data";
import { UI } from "./mock-data";

const stamp = () => new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

function blockToLines(b: AnswerBlock, t: ReturnType<typeof getT>): string[] {
  switch (b.type) {
    case "kpi":
      return [`${b.label}: ${b.value}${b.delta ? ` (${b.delta})` : ""}`];
    case "trend":
      return [`${b.label} — ${b.period}: ${b.points.join(", ")}`];
    case "interpretation":
      return [`${t.interpretation}: ${b.text}`];
    case "drivers":
      return [`${t.drivers}:`, ...b.items.map((i) => ` • ${i.label} — ${i.impact}`)];
    case "remedials":
      return [`${t.remedials}:`, ...b.items.map((i) => ` • ${i}`)];
    case "breakdown":
      return [`${b.label}:`, ...b.rows.map((r) => ` • ${r.name}: ${r.value}${r.delta ? ` (${r.delta})` : ""}`)];
    case "followups":
      return [];
  }
}

function getT(language: Language) {
  return UI[language];
}

function kpiSnapshot(turns: Turn[]) {
  const kpis: { label: string; value: string; delta?: string }[] = [];
  turns.forEach((tn) => {
    if (tn.role !== "assistant") return;
    tn.answer.blocks.forEach((b) => {
      if (b.type === "kpi") kpis.push({ label: b.label, value: b.value, delta: b.delta });
    });
  });
  return kpis;
}

// ---------------- PDF ----------------
export function exportPDF(turns: Turn[], language: Language, contextLine: string) {
  const t = getT(language);
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 40;
  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Lumen — Conversation Export", margin, y);
  y += 22;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(contextLine, margin, y);
  y += 14;
  doc.text(new Date().toLocaleString(), margin, y);
  y += 20;
  doc.setTextColor(0);

  // Snapshot of key metrics
  const kpis = kpiSnapshot(turns);
  if (kpis.length) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Key Metrics Snapshot", margin, y);
    y += 6;
    autoTable(doc, {
      startY: y + 4,
      head: [["Metric", "Value", "Change"]],
      body: kpis.map((k) => [k.label, k.value, k.delta ?? "—"]),
      theme: "grid",
      headStyles: { fillColor: [20, 184, 166] },
      margin: { left: margin, right: margin },
    });
    // @ts-ignore
    y = doc.lastAutoTable.finalY + 24;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Conversation", margin, y);
  y += 16;

  const ensure = (h: number) => {
    if (y + h > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
  };

  turns.forEach((tn) => {
    if (tn.role === "user") {
      ensure(40);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 64, 175);
      doc.text("You", margin, y);
      y += 14;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0);
      const lines = doc.splitTextToSize(tn.text, pageW - margin * 2);
      ensure(lines.length * 14);
      doc.text(lines, margin, y);
      y += lines.length * 14 + 10;
    } else {
      ensure(40);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(13, 148, 136);
      doc.text("Lumen", margin, y);
      y += 14;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(0);
      tn.answer.blocks.forEach((b) => {
        const lines = blockToLines(b, t);
        lines.forEach((l) => {
          const wrapped = doc.splitTextToSize(l, pageW - margin * 2);
          ensure(wrapped.length * 13);
          doc.text(wrapped, margin, y);
          y += wrapped.length * 13;
        });
      });
      y += 10;
    }
  });

  doc.save(`lumen-conversation-${stamp()}.pdf`);
}

// ---------------- Excel ----------------
export function exportExcel(turns: Turn[], language: Language, contextLine: string) {
  const t = getT(language);
  const wb = XLSX.utils.book_new();

  // Sheet 1: Key Metrics
  const kpis = kpiSnapshot(turns);
  const metricsData = [
    ["Lumen — Key Metrics Snapshot"],
    [contextLine],
    [new Date().toLocaleString()],
    [],
    ["Metric", "Value", "Change"],
    ...kpis.map((k) => [k.label, k.value, k.delta ?? ""]),
  ];
  const wsMetrics = XLSX.utils.aoa_to_sheet(metricsData);
  wsMetrics["!cols"] = [{ wch: 40 }, { wch: 20 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, wsMetrics, "Key Metrics");

  // Sheet 2: Conversation
  const convData: (string | number)[][] = [["#", "Role", "Language", "Message / Summary"]];
  turns.forEach((tn, i) => {
    if (tn.role === "user") {
      convData.push([i + 1, "User", tn.language, tn.text]);
    } else {
      const summary = tn.answer.blocks
        .flatMap((b) => blockToLines(b, t))
        .join("\n");
      convData.push([i + 1, "Assistant", tn.answer.language, `Q: ${tn.answer.question}\n\n${summary}`]);
    }
  });
  const wsConv = XLSX.utils.aoa_to_sheet(convData);
  wsConv["!cols"] = [{ wch: 5 }, { wch: 12 }, { wch: 10 }, { wch: 90 }];
  XLSX.utils.book_append_sheet(wb, wsConv, "Conversation");

  // Sheet 3: Breakdowns (state/category tables)
  const breakdownRows: (string | number)[][] = [["Question", "Breakdown", "Name", "Value", "Change"]];
  turns.forEach((tn) => {
    if (tn.role !== "assistant") return;
    tn.answer.blocks.forEach((b) => {
      if (b.type === "breakdown") {
        b.rows.forEach((r) => {
          breakdownRows.push([tn.answer.question, b.label, r.name, r.value, r.delta ?? ""]);
        });
      }
    });
  });
  const wsBreak = XLSX.utils.aoa_to_sheet(breakdownRows);
  wsBreak["!cols"] = [{ wch: 40 }, { wch: 30 }, { wch: 25 }, { wch: 14 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, wsBreak, "Breakdowns");

  // Sheet 4: Sources
  const srcRows: (string | number)[][] = [["Question", "Table", "Filters", "Time range", "Rows scanned"]];
  turns.forEach((tn) => {
    if (tn.role !== "assistant") return;
    const s = tn.answer.source;
    srcRows.push([tn.answer.question, s.table, s.filters.join("; "), s.timeRange, s.rows]);
  });
  const wsSrc = XLSX.utils.aoa_to_sheet(srcRows);
  wsSrc["!cols"] = [{ wch: 40 }, { wch: 28 }, { wch: 40 }, { wch: 20 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, wsSrc, "Sources");

  XLSX.writeFile(wb, `lumen-conversation-${stamp()}.xlsx`);
}

// ---------------- CSV ----------------
export function exportCSV(turns: Turn[], language: Language) {
  const t = getT(language);
  const rows: string[][] = [["#", "Role", "Language", "Question", "Block Type", "Content"]];
  turns.forEach((tn, i) => {
    if (tn.role === "user") {
      rows.push([String(i + 1), "User", tn.language, tn.text, "message", tn.text]);
    } else {
      tn.answer.blocks.forEach((b) => {
        const content = blockToLines(b, t).join(" | ");
        if (content) rows.push([String(i + 1), "Assistant", tn.answer.language, tn.answer.question, b.type, content]);
      });
    }
  });
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""').replace(/\n/g, " ")}"`).join(","))
    .join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lumen-conversation-${stamp()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
