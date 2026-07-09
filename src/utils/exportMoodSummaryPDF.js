import jsPDF from "jspdf";

export function exportMoodSummaryPDF(entries, userName) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 48;
  let cursorY = 64;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Mood Summary", marginX, cursorY);

  cursorY += 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(90, 87, 79);
  doc.text(userName, marginX, cursorY);
  doc.text(
    `Generated ${new Date().toLocaleDateString()}`,
    doc.internal.pageSize.getWidth() - marginX,
    cursorY,
    { align: "right" }
  );

  cursorY += 32;
  doc.setDrawColor(230, 227, 220);
  doc.line(marginX, cursorY, doc.internal.pageSize.getWidth() - marginX, cursorY);
  cursorY += 24;

  entries.forEach((entry) => {
    if (cursorY > 760) {
      doc.addPage();
      cursorY = 64;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(45, 42, 38);
    doc.text(formatDate(entry.date), marginX, cursorY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(90, 87, 79);
    doc.text(`Mood ${entry.moodScore}/5`, marginX + 140, cursorY);

    if (entry.note) {
      cursorY += 16;
      const wrapped = doc.splitTextToSize(entry.note, 460);
      doc.text(wrapped, marginX, cursorY);
      cursorY += wrapped.length * 14;
    }

    cursorY += 22;
  });

  doc.save(`mood-summary-${Date.now()}.pdf`);
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}