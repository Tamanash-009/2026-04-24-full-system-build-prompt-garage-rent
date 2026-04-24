import PDFDocument from "pdfkit";
import * as XLSX from "xlsx";

import { buildTenancyFinanceSummary } from "@/lib/rent";
import type { TenancyRecord } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export async function buildPdfLedger(tenancies: TenancyRecord[]) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 40,
      size: "A4"
    });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk as Buffer));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc
      .fillColor("#0f172a")
      .fontSize(22)
      .text("GarageFlow Ledger", { align: "left" })
      .moveDown(0.3)
      .fontSize(11)
      .fillColor("#475569")
      .text("Monthly rent, advance, and electricity summary")
      .moveDown(1);

    tenancies.forEach((tenancy, index) => {
      const summary = buildTenancyFinanceSummary(tenancy);

      doc
        .fillColor("#0f172a")
        .fontSize(15)
        .text(`${tenancy.user?.name ?? "Tenant"} • ${tenancy.property?.name ?? "Property"}`)
        .moveDown(0.2)
        .fontSize(10)
        .fillColor("#475569")
        .text(`Location: ${tenancy.property?.location ?? "N/A"}`)
        .text(`Monthly rent: ${formatCurrency(tenancy.monthly_rent)}`)
        .text(`Advance remaining: ${formatCurrency(summary.advanceRemaining)}`)
        .text(`Pending dues: ${formatCurrency(summary.pendingAmount)}`)
        .text(`Electricity due: ${formatCurrency(summary.electricityDue)}`)
        .moveDown(0.6);

      doc.fontSize(11).fillColor("#0f172a").text("Month", 40, doc.y, { continued: true });
      doc.text("Status", 170, doc.y, { continued: true });
      doc.text("Amount", 300, doc.y, { continued: true });
      doc.text("Paid on", 430, doc.y);
      doc.moveDown(0.2);

      summary.ledger.forEach((entry) => {
        doc
          .fontSize(10)
          .fillColor("#1e293b")
          .text(entry.month, 40, doc.y, { continued: true })
          .text(entry.status.toUpperCase(), 170, doc.y, { continued: true })
          .text(formatCurrency(entry.amount), 300, doc.y, { continued: true })
          .text(entry.paid_on ? new Date(entry.paid_on).toLocaleDateString("en-IN") : "Pending", 430, doc.y);
      });

      doc
        .moveDown(0.8)
        .fontSize(10)
        .fillColor("#334155")
        .text("Signature: ______________________________")
        .moveDown(index === tenancies.length - 1 ? 0 : 1.2);

      if (index < tenancies.length - 1) {
        doc.addPage();
      }
    });

    doc.end();
  });
}

export function buildExcelLedger(tenancies: TenancyRecord[]) {
  const workbook = XLSX.utils.book_new();
  const ledgerRows = tenancies.flatMap((tenancy) => {
    const summary = buildTenancyFinanceSummary(tenancy);
    return summary.ledger.map((entry) => ({
      Tenant: tenancy.user?.name ?? "Tenant",
      Property: tenancy.property?.name ?? "Property",
      Month: entry.month,
      Status: entry.status,
      Amount: entry.amount,
      "Paid On": entry.paid_on ? new Date(entry.paid_on).toLocaleDateString("en-IN") : ""
    }));
  });

  const worksheet = XLSX.utils.json_to_sheet(ledgerRows, {
    header: ["Tenant", "Property", "Month", "Status", "Amount", "Paid On"]
  });
  const summaryStart = ledgerRows.length + 3;

  XLSX.utils.sheet_add_aoa(
    worksheet,
    [
      ["Summary"],
      ["Total Paid", null, null, null, { f: `SUMIF(D2:D${ledgerRows.length + 1},"paid",E2:E${ledgerRows.length + 1})` }],
      [
        "Balance",
        null,
        null,
        null,
        { f: `SUMIF(D2:D${ledgerRows.length + 1},"pending",E2:E${ledgerRows.length + 1})` }
      ],
      [
        "Advance Remaining",
        null,
        null,
        null,
        tenancies.reduce(
          (sum, tenancy) => sum + buildTenancyFinanceSummary(tenancy).advanceRemaining,
          0
        )
      ]
    ],
    {
      origin: `A${summaryStart}`
    }
  );

  worksheet["!cols"] = [
    { wch: 18 },
    { wch: 18 },
    { wch: 12 },
    { wch: 12 },
    { wch: 14 },
    { wch: 14 }
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger");
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}
