import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import type { Answer, AnswerBlock, Turn, Language } from "./mock-data";
import { UI } from "./mock-data";

const stamp = () => new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

// ─── colour palette (RGB tuples) ────────────────────────────────────────────
const C = {
  teal:       [20, 184, 166] as [number, number, number],
  tealLight:  [204, 243, 238] as [number, number, number],
  tealDark:   [13, 110, 99]  as [number, number, number],
  amber:      [217, 119, 6]  as [number, number, number],
  amberLight: [254, 243, 199] as [number, number, number],
  red:        [220, 38, 38]  as [number, number, number],
  redLight:   [254, 226, 226] as [number, number, number],
  green:      [22, 163, 74]  as [number, number, number],
  greenLight: [220, 252, 231] as [number, number, number],
  slate:      [71, 85, 105]  as [number, number, number],
  slateLight: [241, 245, 249] as [number, number, number],
  white:      [255, 255, 255] as [number, number, number],
  ink:        [15, 23, 42]   as [number, number, number],
  dim:        [100, 116, 139] as [number, number, number],
  border:     [226, 232, 240] as [number, number, number],
};

function getT(language: Language) { return UI[language]; }

function blockToLines(b: AnswerBlock, t: ReturnType<typeof getT>): string[] {
  switch (b.type) {
    case "kpi":          return [`${b.label}: ${b.value}${b.delta ? ` (${b.delta})` : ""}`];
    case "trend":        return [`${b.label} — ${b.period}: ${b.points.join(", ")}`];
    case "interpretation": return [`${t.interpretation}: ${b.text}`];
    case "drivers":      return [`${t.drivers}:`, ...b.items.map((i) => ` • ${i.label} — ${i.impact}`)];
    case "remedials":    return [`${t.remedials}:`, ...b.items.map((i) => ` • ${i}`)];
    case "breakdown":    return [`${b.label}:`, ...b.rows.map((r) => ` • ${r.name}: ${r.value}${r.delta ? ` (${r.delta})` : ""}`)];
    case "theme_chart":  return [`${b.label}:`, ...b.slices.map((s) => ` • ${s.name}: ${s.share}%`)];
    case "followups":    return [];
  }
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

function remedialsSnapshot(turns: Turn[]) {
  const items: { question: string; remedials: string[] }[] = [];
  turns.forEach((tn) => {
    if (tn.role !== "assistant") return;
    const rem = tn.answer.blocks.find((b) => b.type === "remedials");
    if (rem && rem.type === "remedials" && rem.items.length) {
      items.push({ question: tn.answer.question, remedials: rem.items });
    }
  });
  return items;
}

// ─── PDF helpers ─────────────────────────────────────────────────────────────

function drawPageHeader(doc: jsPDF, y: number, margin: number, pageW: number, title: string) {
  doc.setFillColor(...C.teal);
  doc.rect(0, 0, pageW, 52, "F");
  doc.setFillColor(...C.tealDark);
  doc.rect(0, 46, pageW, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...C.white);
  doc.text(title, margin, 28);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(200, 240, 236);
  doc.text("Lumen · MITRA Conversational Insights", margin, 41);
  return 66;
}

function drawSection(doc: jsPDF, y: number, margin: number, pageW: number, label: string, color: [number,number,number]) {
  doc.setFillColor(...color);
  doc.roundedRect(margin, y, pageW - margin * 2, 22, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...C.white);
  doc.text(label.toUpperCase(), margin + 10, y + 14);
  return y + 30;
}

function drawKpiCard(
  doc: jsPDF,
  x: number, y: number, w: number, h: number,
  label: string, value: string, delta?: string,
) {
  doc.setFillColor(...C.slateLight);
  doc.roundedRect(x, y, w, h, 4, 4, "F");
  doc.setFillColor(...C.teal);
  doc.roundedRect(x, y, 4, h, 2, 2, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.dim);
  doc.text(label, x + 10, y + 13);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...C.ink);
  doc.text(String(value), x + 10, y + 28);
  if (delta) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...C.tealDark);
    doc.text(delta, x + 10, y + 38);
  }
}

function ensurePage(doc: jsPDF, y: number, needed: number, margin: number): number {
  if (y + needed > doc.internal.pageSize.getHeight() - margin) {
    doc.addPage();
    return margin;
  }
  return y;
}

// ─── PDF EXPORT ───────────────────────────────────────────────────────────────
export function exportPDF(turns: Turn[], language: Language, contextLine: string) {
  const t = getT(language);
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 40;

  // ── Page 1: Cover / Header ─────────────────────────────────────────────────
  let y = drawPageHeader(doc, 0, margin, pageW, "Conversation Export");

  // Context strip
  doc.setFillColor(...C.slateLight);
  doc.rect(margin, y, pageW - margin * 2, 30, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...C.slate);
  doc.text(contextLine, margin + 10, y + 12);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin + 10, y + 24);
  y += 44;

  // ── KPI Grid ───────────────────────────────────────────────────────────────
  const kpis = kpiSnapshot(turns);
  if (kpis.length) {
    y = drawSection(doc, y, margin, pageW, "Key Metrics Snapshot", C.teal);
    const cols = Math.min(kpis.length, 3);
    const cardW = (pageW - margin * 2 - (cols - 1) * 10) / cols;
    const cardH = 46;
    let col = 0;
    let rowY = y;
    kpis.forEach((k, idx) => {
      y = ensurePage(doc, rowY, cardH + 10, margin);
      if (y !== rowY && col !== 0) { col = 0; rowY = y; }
      drawKpiCard(doc, margin + col * (cardW + 10), rowY, cardW, cardH, k.label, k.value, k.delta);
      col++;
      if (col >= cols) { col = 0; rowY += cardH + 10; }
    });
    y = rowY + (col > 0 ? cardH + 16 : 6);
  }

  // ── Remedials Summary ──────────────────────────────────────────────────────
  const remSummary = remedialsSnapshot(turns);
  if (remSummary.length) {
    y = ensurePage(doc, y, 60, margin);
    y = drawSection(doc, y, margin, pageW, `${t.remedials} Summary`, C.amber);

    remSummary.forEach((item) => {
      y = ensurePage(doc, y, 30, margin);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(...C.dim);
      const qLines = doc.splitTextToSize(`Q: ${item.question}`, pageW - margin * 2 - 10);
      doc.text(qLines, margin + 4, y);
      y += qLines.length * 12 + 4;

      item.remedials.forEach((r, i) => {
        y = ensurePage(doc, y, 18, margin);
        // Bullet circle
        doc.setFillColor(...C.amberLight);
        doc.circle(margin + 10, y - 3, 6, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...C.amber);
        doc.text(String(i + 1), margin + 10, y - 3 + 2.5, { align: "center" });
        // Text
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...C.ink);
        const rLines = doc.splitTextToSize(r, pageW - margin * 2 - 24);
        doc.text(rLines, margin + 20, y);
        y += rLines.length * 12 + 4;
      });
      y += 10;
    });
  }

  // ── Conversation Detail ────────────────────────────────────────────────────
  y = ensurePage(doc, y, 60, margin);
  y = drawSection(doc, y, margin, pageW, "Conversation Detail", C.slate);

  turns.forEach((tn, idx) => {
    if (tn.role === "user") {
      y = ensurePage(doc, y, 40, margin);

      // User bubble header
      doc.setFillColor(219, 234, 254);
      doc.roundedRect(margin, y, pageW - margin * 2, 18, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(30, 64, 175);
      doc.text(`You  ·  Turn ${Math.ceil((idx + 1) / 2)}`, margin + 8, y + 12);
      y += 22;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...C.ink);
      const lines = doc.splitTextToSize(tn.text, pageW - margin * 2 - 8);
      y = ensurePage(doc, y, lines.length * 13 + 8, margin);
      doc.text(lines, margin + 8, y);
      y += lines.length * 13 + 14;

    } else {
      // ── Lumen answer ──────────────────────────────────────────────────────
      y = ensurePage(doc, y, 50, margin);

      // Answer header
      doc.setFillColor(...C.tealLight);
      doc.roundedRect(margin, y, pageW - margin * 2, 18, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...C.tealDark);
      doc.text("Lumen", margin + 8, y + 12);
      // Source tag
      const src = tn.answer.source;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...C.teal);
      doc.text(`${src.table} · ${src.timeRange} · ${src.rows.toLocaleString()} rows`, pageW - margin - 4, y + 12, { align: "right" });
      y += 24;

      // KPI mini-cards for this answer
      const ansKpis = tn.answer.blocks.filter((b) => b.type === "kpi");
      if (ansKpis.length) {
        const cols = Math.min(ansKpis.length, 3);
        const cardW = (pageW - margin * 2 - (cols - 1) * 8) / cols;
        const cardH = 40;
        y = ensurePage(doc, y, cardH + 10, margin);
        ansKpis.forEach((b, ci) => {
          if (b.type !== "kpi") return;
          const cx = margin + ci * (cardW + 8);
          drawKpiCard(doc, cx, y, cardW, cardH, b.label, b.value, b.delta);
        });
        y += cardH + 14;
      }

      // Breakdown tables
      const breakdowns = tn.answer.blocks.filter((b) => b.type === "breakdown");
      breakdowns.forEach((b) => {
        if (b.type !== "breakdown") return;
        y = ensurePage(doc, y, 40, margin);
        autoTable(doc, {
          startY: y,
          head: [[b.label, "Value", "Change"]],
          body: b.rows.map((r) => [r.name, r.value, r.delta ?? "—"]),
          theme: "grid",
          headStyles: { fillColor: C.teal, textColor: C.white, fontSize: 8, fontStyle: "bold" },
          bodyStyles: { fontSize: 8, textColor: C.ink },
          alternateRowStyles: { fillColor: C.slateLight },
          margin: { left: margin, right: margin },
          columnStyles: { 1: { halign: "right", fontStyle: "bold" }, 2: { halign: "right" } },
        });
        // @ts-ignore
        y = doc.lastAutoTable.finalY + 12;
      });

      // Drivers
      const drivers = tn.answer.blocks.find((b) => b.type === "drivers");
      if (drivers && drivers.type === "drivers" && drivers.items.length) {
        y = ensurePage(doc, y, 20, margin);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...C.slate);
        doc.text(t.drivers.toUpperCase(), margin, y);
        y += 10;
        drivers.items.forEach((d) => {
          y = ensurePage(doc, y, 14, margin);
          const col = d.tone === "neg" ? C.red : d.tone === "pos" ? C.green : C.teal;
          doc.setFillColor(...col);
          doc.roundedRect(margin, y - 8, 22, 11, 2, 2, "F");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(7);
          doc.setTextColor(...C.white);
          doc.text(d.impact, margin + 11, y - 1, { align: "center" });
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(...C.ink);
          const dLines = doc.splitTextToSize(d.label, pageW - margin * 2 - 28);
          doc.text(dLines, margin + 26, y - 1);
          y += dLines.length * 12 + 4;
        });
        y += 6;
      }

      // Interpretation
      const interp = tn.answer.blocks.find((b) => b.type === "interpretation");
      if (interp && interp.type === "interpretation") {
        y = ensurePage(doc, y, 24, margin);
        doc.setFillColor(...C.amberLight);
        doc.roundedRect(margin, y, pageW - margin * 2, 16, 3, 3, "F");
        doc.setFillColor(...C.amber);
        doc.rect(margin, y, 3, 16, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...C.amber);
        doc.text(t.interpretation.toUpperCase(), margin + 8, y + 10);
        y += 20;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...C.ink);
        const iLines = doc.splitTextToSize(interp.text, pageW - margin * 2 - 8);
        y = ensurePage(doc, y, iLines.length * 12 + 4, margin);
        doc.text(iLines, margin + 4, y);
        y += iLines.length * 12 + 10;
      }

      // Remedials
      const rem = tn.answer.blocks.find((b) => b.type === "remedials");
      if (rem && rem.type === "remedials" && rem.items.length) {
        y = ensurePage(doc, y, 24, margin);
        doc.setFillColor(239, 246, 255);
        doc.roundedRect(margin, y, pageW - margin * 2, 16, 3, 3, "F");
        doc.setFillColor(...C.teal);
        doc.rect(margin, y, 3, 16, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...C.teal);
        doc.text(t.remedials.toUpperCase(), margin + 8, y + 10);
        y += 20;
        rem.items.forEach((r, ri) => {
          y = ensurePage(doc, y, 16, margin);
          doc.setFillColor(...C.tealLight);
          doc.circle(margin + 9, y - 2, 7, "F");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(...C.tealDark);
          doc.text(String(ri + 1), margin + 9, y + 0.5, { align: "center" });
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(...C.ink);
          const rLines = doc.splitTextToSize(r, pageW - margin * 2 - 22);
          doc.text(rLines, margin + 20, y);
          y += rLines.length * 12 + 5;
        });
        y += 6;
      }

      y += 10;
    }
  });

  // ── Footer on every page ───────────────────────────────────────────────────
  const totalPages = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    const ph = doc.internal.pageSize.getHeight();
    doc.setFillColor(...C.slateLight);
    doc.rect(0, ph - 24, pageW, 24, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...C.dim);
    doc.text("Lumen — MITRA Conversational Insights", margin, ph - 9);
    doc.text(`Page ${p} / ${totalPages}`, pageW - margin, ph - 9, { align: "right" });
  }

  doc.save(`lumen-conversation-${stamp()}.pdf`);
}

// ─── Excel EXPORT ─────────────────────────────────────────────────────────────
export function exportExcel(turns: Turn[], language: Language, contextLine: string) {
  const t = getT(language);
  const wb = XLSX.utils.book_new();

  // Sheet 1: Summary — KPIs + all remedials together
  const kpis = kpiSnapshot(turns);
  const remSummary = remedialsSnapshot(turns);
  const summaryData: (string | number)[][] = [
    ["LUMEN — MITRA CONVERSATIONAL INSIGHTS"],
    [contextLine],
    [new Date().toLocaleString()],
    [],
    ["── KEY METRICS ──────────────────────────────"],
    ["Metric", "Value", "Change"],
    ...kpis.map((k) => [k.label, k.value, k.delta ?? ""]),
    [],
    ["── REMEDIALS SUMMARY ────────────────────────"],
    ["Question", "#", "Recommended Action"],
    ...remSummary.flatMap((item) =>
      item.remedials.map((r, i) => [i === 0 ? item.question : "", i + 1, r])
    ),
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary["!cols"] = [{ wch: 50 }, { wch: 6 }, { wch: 80 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

  // Sheet 2: Conversation
  const convData: (string | number)[][] = [["#", "Role", "Language", "Message / Summary"]];
  turns.forEach((tn, i) => {
    if (tn.role === "user") {
      convData.push([i + 1, "User", tn.language, tn.text]);
    } else {
      const summary = tn.answer.blocks.flatMap((b) => blockToLines(b, t)).join("\n");
      convData.push([i + 1, "Assistant", tn.answer.language, `Q: ${tn.answer.question}\n\n${summary}`]);
    }
  });
  const wsConv = XLSX.utils.aoa_to_sheet(convData);
  wsConv["!cols"] = [{ wch: 5 }, { wch: 12 }, { wch: 10 }, { wch: 90 }];
  XLSX.utils.book_append_sheet(wb, wsConv, "Conversation");

  // Sheet 3: Breakdowns
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

// ─── CSV EXPORT ───────────────────────────────────────────────────────────────
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
