import { Download } from "lucide-react";
import { exportMoodSummaryPDF } from "../utils/exportMoodSummaryPDF.js";

export default function MoodExportButton({ entries, userName }) {
  return (
    <button
      onClick={() => exportMoodSummaryPDF(entries, userName)}
      className="btn-primary flex items-center gap-2 text-sm"
    >
      <Download size={16} />
      Export summary
    </button>
  );
}