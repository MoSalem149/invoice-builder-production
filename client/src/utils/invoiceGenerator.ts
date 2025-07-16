import { Invoice } from "../types";

// Define the CompanyInfo type
export interface CompanyInfo {
  logo: string;
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  currency: "CHF" | "USD" | "EGP";
  language: "it" | "en" | "ar" | "gr";
  watermark?: string;
  showNotes?: boolean;
  showTerms?: boolean;
  taxRate?: number;
}

// Translation mappings
const translations = {
  invoice: {
    it: "FATTURA",
    en: "INVOICE",
    ar: "فاتورة",
    gr: "RECHNUNG",
  },
  billTo: {
    it: "Fattura a:",
    en: "Bill To:",
    ar: "فاتورة إلى:",
    gr: "Rechnung an:",
  },
  invoiceNumber: {
    it: "Numero fattura",
    en: "Invoice #",
    ar: "رقم الفاتورة",
    gr: "Rechnung Nr.",
  },
  invoiceDate: {
    it: "Data fattura",
    en: "Invoice Date",
    ar: "تاريخ الفاتورة",
    gr: "Rechnungsdatum",
  },
  status: {
    it: "Stato",
    en: "Status",
    ar: "الحالة",
    gr: "Status",
  },
  paid: {
    it: "Pagato",
    en: "Paid",
    ar: "مدفوع",
    gr: "Bezahlt",
  },
  unpaid: {
    it: "Non pagato",
    en: "Unpaid",
    ar: "غير مدفوع",
    gr: "Unbezahlt",
  },
  product: {
    it: "Prodotto",
    en: "Product",
    ar: "المنتج",
    gr: "Produkt",
  },
  price: {
    it: "Prezzo",
    en: "Price",
    ar: "السعر",
    gr: "Preis",
  },
  discount: {
    it: "Sconto %",
    en: "Discount %",
    ar: "الخصم %",
    gr: "Rabatt %",
  },
  amount: {
    it: "Importo",
    en: "Amount",
    ar: "المبلغ",
    gr: "Betrag",
  },
  subtotal: {
    it: "Subtotale:",
    en: "Subtotal:",
    ar: "المجموع الفرعي:",
    gr: "Zwischensumme:",
  },
  totalTax: {
    it: "Tassa:",
    en: "Tax:",
    ar: "الضريبة:",
    gr: "Steuer:",
  },
  total: {
    it: "Totale:",
    en: "Total:",
    ar: "الإجمالي:",
    gr: "Gesamt:",
  },
  notes: {
    it: "Note:",
    en: "Notes:",
    ar: "ملاحظات:",
    gr: "Notizen:",
  },
  terms: {
    it: "Termini e condizioni:",
    en: "Terms & Conditions:",
    ar: "الشروط والأحكام:",
    gr: "AGB:",
  },
  clickToSelectClient: {
    it: "Clicca per selezionare un cliente",
    en: "Click to select client",
    ar: "انقر لتحديد العميل",
    gr: "Klicken Sie, um einen Kunden auszuwählen",
  },
  selectDate: {
    it: "Seleziona data",
    en: "Select date",
    ar: "حدد تاريخًا",
    gr: "Datum auswählen",
  },
  clickToAddProducts: {
    it: "Clicca per aggiungere prodotti",
    en: "Click to add products",
    ar: "انقر لإضافة منتجات",
    gr: "Klicken Sie, um Produkte hinzuzufügen",
  },
  clickToAddNotes: {
    it: "Clicca per aggiungere note",
    en: "Click to add notes",
    ar: "انقر لإضافة ملاحظات",
    gr: "Klicken Sie, um Notizen hinzuzufügen",
  },
  clickToAddTerms: {
    it: "Clicca per aggiungere termini",
    en: "Click to add terms",
    ar: "انقر لإضافة شروط",
    gr: "Klicken Sie, um AGB hinzuzufügen",
  },
};

export const generateInvoicePDF = (
  invoice: Invoice,
  companyInfo: CompanyInfo,
  isRTL: boolean
): string => {
  // Determine currency symbol based on currency and language
  let currencySymbol = "$";
  switch (companyInfo.currency) {
    case "CHF":
      currencySymbol = "CHF";
      break;
    case "USD":
      currencySymbol = "$";
      break;
    case "EGP":
      currencySymbol = isRTL ? "ج.م" : "EGP";
      break;
  }

  // Get language from company info
  const lang = companyInfo.language || "en";
  const dir = isRTL ? "rtl" : "ltr";

  // Get appropriate translations
  const t = (key: keyof typeof translations) => translations[key][lang];

  return `
    <!DOCTYPE html>
    <html dir="${dir}" lang="${lang}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t("invoice")} ${invoice.number}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: ${
              isRTL
                ? "'Noto Sans Arabic', Arial, sans-serif"
                : "Arial, sans-serif"
            };
            line-height: 1.6;
            color: #333;
            background: white;
            padding: 16px;
            direction: ${dir};
          }
          
          .invoice-container {
            background: white;
            padding: 16px;
            margin: 0 auto;
            max-width: 8.5in;
            min-height: 11in;
            position: relative;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
            flex-direction: ${isRTL ? "row-reverse" : "row"};
          }
          
          .invoice-title {
            font-size: 24px;
            font-weight: bold;
            color: #111827;
          }
          
          .company-logo {
            object-fit: contain;
            height: auto;
            width: auto;
            max-height: 80px;
            max-width: 160px;
          }
          
          @media (min-width: 640px) {
            .company-logo {
              max-height: 120px;
              max-width: 240px;
            }
          }
          
          @media (min-width: 1024px) {
            .company-logo {
              max-height: 150px;
              max-width: 300px;
            }
          }
          
          .company-info {
            margin-bottom: 24px;
            text-align: ${isRTL ? "right" : "left"};
          }
          
          .company-name {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 8px;
          }
          
          .company-address, .company-contact {
            color: #4b5563;
            font-size: 14px;
            white-space: pre-line;
          }
          
          .invoice-details {
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
            margin-bottom: 24px;
          }
          
          @media (min-width: 1024px) {
            .invoice-details {
              grid-template-columns: 1fr 1fr;
            }
          }
          
          .bill-to {
            text-align: ${isRTL ? "right" : "left"};
            order: ${isRTL ? "2" : "1"};
          }
          
          .invoice-info {
            text-align: ${isRTL ? "left" : "right"};
            order: ${isRTL ? "1" : "2"};
            border: 1px solid #d1d5db;
            padding: 16px;
            border-radius: 4px;
          }
          
          .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 16px;
          }
          
          .client-name {
            font-weight: 500;
            margin-bottom: 4px;
            font-size: 14px;
            color: #111827;
          }
          
          .client-details {
            color: #4b5563;
            white-space: pre-line;
            word-wrap: break-word;
            font-size: 14px;
          }
          
          .invoice-meta {
            margin-bottom: 16px;
          }
          
          .meta-label {
            font-size: 12px;
            color: #4b5563;
            margin-bottom: 4px;
          }
          
          .meta-value {
            font-weight: 500;
            color: #111827;
            font-size: 14px;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
            border: 1px solid #d1d5db;
            font-size: 12px;
            min-width: 100%;
          }
          
          .items-table th {
            background-color: #f9fafb;
            border: 1px solid #d1d5db;
            padding: 8px 16px;
            text-align: ${isRTL ? "right" : "left"};
            font-weight: normal;
          }
          
          .items-table td {
            border: 1px solid #d1d5db;
            padding: 8px 16px;
          }
          
          .items-table th:nth-child(2),
          .items-table td:nth-child(2),
          .items-table th:nth-child(3),
          .items-table td:nth-child(3),
          .items-table th:nth-child(4),
          .items-table td:nth-child(4) {
            width: 96px;
            text-align: center;
          }
          
          .items-table td:nth-child(4) {
            text-align: ${isRTL ? "left" : "right"};
          }
          
          .product-name {
            font-weight: 500;
            margin-bottom: 4px;
            font-size: 12px;
            color: #111827;
          }
          
          .product-description {
            font-size: 11px;
            color: #6b7280;
            white-space: pre-wrap;
            word-wrap: break-word;
            margin-top: 4px;
          }
          
          .totals {
            display: flex;
            justify-content: ${isRTL ? "flex-start" : "flex-end"};
            margin-bottom: 24px;
          }
          
          .totals-table {
            width: 100%;
            max-width: 256px;
          }
          
          .totals-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 4px 0;
            font-size: 14px;
          }
          
          .totals-row.total {
            border-top: 2px solid #111827;
            padding-top: 8px;
            font-weight: 600;
            font-size: 16px;
          }
          
          .notes-section,
          .terms-section {
            margin-bottom: 16px;
            text-align: ${isRTL ? "right" : "left"};
          }
          
          .section-content {
            color: #4b5563;
            white-space: pre-line;
            margin-top: 8px;
            word-wrap: break-word;
            font-size: 14px;
          }
          
          .watermark {
            position: fixed;
            opacity: 0.1;
            font-size: 120px;
            color: #000;
            z-index: 0;
            width: 100%;
            text-align: center;
            top: 50%;
            left: 0;
            transform: translateY(-50%) rotate(-45deg);
            font-weight: bold;
            text-transform: uppercase;
            pointer-events: none;
            user-select: none;
            background: none !important;
            font-family: ${
              isRTL
                ? "'Noto Sans Arabic', Arial, sans-serif"
                : "Arial, sans-serif"
            };
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
          }
          
          .italic {
            font-style: italic;
          }
          
          .text-gray-400 {
            color: #9ca3af;
          }
          
          @media print {
            body {
              padding: 0;
            }
            .invoice-container {
              box-shadow: none;
              padding: 0;
              max-width: 100%;
              min-height: auto;
            }
            
            .company-logo {
              max-height: 150px !important;
              max-width: 300px !important;
            }
            
            .watermark {
              opacity: 0.2;
            }
            
            .print-hidden {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- Watermark -->
          ${
            companyInfo.watermark
              ? `<div class="watermark">${companyInfo.watermark}</div>`
              : ""
          }
          
          <!-- Header -->
          <div class="header">
            <div class="invoice-title">${t("invoice")}</div>
            ${
              companyInfo.logo
                ? `<img src="${companyInfo.logo}" alt="Company Logo" class="company-logo">`
                : ""
            }
          </div>
          
          <!-- Company Info -->
          <div class="company-info">
            <div class="company-name">${companyInfo.name}</div>
            ${
              companyInfo.address
                ? `<div class="company-address">${companyInfo.address}</div>`
                : ""
            }
            ${
              companyInfo.email
                ? `<div class="company-contact">${companyInfo.email}</div>`
                : ""
            }
            ${
              companyInfo.phone
                ? `<div class="company-contact">${companyInfo.phone}</div>`
                : ""
            }
          </div>
          
          <!-- Invoice Details -->
          <div class="invoice-details">
            <div class="bill-to">
              <div class="section-title">${t("billTo")}</div>
              ${
                invoice.client
                  ? `
                    <div class="client-name">${invoice.client.name}</div>
                    ${
                      invoice.client.email
                        ? `<div class="client-details">${invoice.client.email}</div>`
                        : ""
                    }
                    ${
                      invoice.client.address
                        ? `<div class="client-details">${invoice.client.address}</div>`
                        : ""
                    }
                    ${
                      invoice.client.phone
                        ? `<div class="client-details">${invoice.client.phone}</div>`
                        : ""
                    }
                  `
                  : `<p class="text-gray-400 italic print-hidden">${t(
                      "clickToSelectClient"
                    )}</p>`
              }
            </div>
            
            <div class="invoice-info">
              <div class="invoice-meta">
                <div class="meta-label">${t("invoiceNumber")}</div>
                <div class="meta-value">${invoice.number || "INV-0001"}</div>
              </div>
              <div class="invoice-meta">
                <div class="meta-label">${t("invoiceDate")}</div>
                <div class="meta-value">${invoice.date || t("selectDate")}</div>
              </div>
              <div class="invoice-meta">
                <div class="meta-label">${t("status")}</div>
                <div class="meta-value">${
                  invoice.paid ? t("paid") : t("unpaid")
                }</div>
              </div>
            </div>
          </div>
          
          <!-- Items Table -->
          <table class="items-table">
            <thead>
              <tr>
                <th>${t("product")}</th>
                <th>${t("price")}</th>
                <th>${t("discount")}</th>
                <th>${t("amount")}</th>
              </tr>
            </thead>
            <tbody>
              ${
                invoice.items && invoice.items.length > 0
                  ? invoice.items
                      .map(
                        (item) => `
                    <tr>
                      <td style="max-width: 300px; word-wrap: break-word;">
                        <div class="product-name" style="font-weight: 500; margin-bottom: 4px;">
                          ${item.name}${
                          item.quantity !== 1 ? ` × ${item.quantity}` : ""
                        }
                        </div>
                        ${
                          item.description
                            ? `<div class="product-description" style="color: #6b7280; font-size: 11px; margin-top: 4px; white-space: pre-wrap; word-wrap: break-word;">
                                ${item.description}
                              </div>`
                            : ""
                        }
                      </td>
                      <td>${currencySymbol}${(
                          item.amount /
                          item.quantity /
                          (1 - item.discount / 100)
                        ).toFixed(2)}</td>
                      <td>${item.discount}%</td>
                      <td>${currencySymbol}${item.amount.toFixed(2)}</td>
                    </tr>
                  `
                      )
                      .join("")
                  : `
                    <tr class="print-hidden">
                      <td colspan="4" class="text-gray-400 italic" style="text-align: center; padding: 24px 16px;">
                        ${t("clickToAddProducts")}
                      </td>
                    </tr>
                  `
              }
            </tbody>
          </table>
          
          <!-- Totals -->
          <div class="totals">
            <div class="totals-table">
              <div class="totals-row">
                <span>${t("subtotal")}</span>
                <span>${currencySymbol}${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div class="totals-row">
                <span>${t("totalTax")} (${companyInfo.taxRate || 0}%)</span>
                <span>${currencySymbol}${invoice.tax.toFixed(2)}</span>
              </div>
              <div class="totals-row total">
                <span>${t("total")}</span>
                <span>${currencySymbol}${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <!-- Notes -->
          ${
            (companyInfo.showNotes || invoice.notes) && invoice.notes
              ? `
            <div class="notes-section">
              <div class="section-title">${t("notes")}</div>
              <div class="section-content">${invoice.notes}</div>
            </div>
          `
              : companyInfo.showNotes
              ? `
            <div class="notes-section">
              <div class="section-title">${t("notes")}</div>
              <div class="section-content text-gray-400 italic print-hidden">
                ${t("clickToAddNotes")}
              </div>
            </div>
          `
              : ""
          }
          
          <!-- Terms -->
          ${
            (companyInfo.showTerms || invoice.terms) && invoice.terms
              ? `
            <div class="terms-section">
              <div class="section-title">${t("terms")}</div>
              <div class="section-content">${invoice.terms}</div>
            </div>
          `
              : companyInfo.showTerms
              ? `
            <div class="terms-section">
              <div class="section-title">${t("terms")}</div>
              <div class="section-content text-gray-400 italic print-hidden">
                ${t("clickToAddTerms")}
              </div>
            </div>
          `
              : ""
          }
        </div>
      </body>
    </html>
  `;
};

export const downloadInvoicePDF = (
  invoice: Invoice,
  companyInfo: CompanyInfo,
  isRTL: boolean
) => {
  const htmlContent = generateInvoicePDF(invoice, companyInfo, isRTL);

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Ensure fonts are loaded before printing
    const style = printWindow.document.createElement("style");
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap');
    `;
    printWindow.document.head.appendChild(style);

    // Use setTimeout to ensure everything is loaded
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      // Don't close immediately - let user see print dialog
    }, 500);
  } else {
    console.error("Failed to open print window");
  }
};
