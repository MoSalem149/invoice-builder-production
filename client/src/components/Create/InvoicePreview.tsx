import React from "react";
import { useApp } from "../../hooks/useApp";
import { useLanguage } from "../../hooks/useLanguage";
import { Invoice } from "../../types";

interface InvoicePreviewProps {
  invoice: Partial<Invoice>;
  onClientClick?: () => void;
  onDetailsClick?: () => void;
  onProductsClick?: () => void;
  onNotesClick?: () => void;
  onTermsClick?: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  onClientClick,
  onDetailsClick,
  onProductsClick,
  onNotesClick,
  onTermsClick,
}) => {
  const { state } = useApp();
  const { t, isRTL } = useLanguage();

  const currencySymbol = () => {
    switch (state.company.currency) {
      case "CHF":
        return "CHF";
      case "USD":
        return "$";
      case "EGP":
        return isRTL ? "ج.م" : "EGP";
      default:
        return "CHF";
    }
  };

  return (
    <div
      className={`bg-white p-4 sm:p-8 shadow-lg print:shadow-none print:p-0 relative ${
        isRTL ? "rtl" : "ltr"
      }`}
      style={{ minHeight: "11in", maxWidth: "8.5in", margin: "0 auto" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Status Watermark */}
      {invoice.showStatusWatermark && (
        <div
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10 print:opacity-20"
          style={{
            transform: "rotate(-45deg)",
            fontSize: "120px",
            fontWeight: "bold",
            textTransform: "uppercase",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            fontFamily: isRTL
              ? "'Noto Sans Arabic', Arial, sans-serif"
              : "Arial, sans-serif",
          }}
        >
          {invoice.paid ? t("invoice.paid") : t("invoice.unpaid")}
        </div>
      )}

      {/* Centered Invoice Title */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {t("invoice.invoice")}
        </h1>
      </div>

      {/* Logo above company info */}
      {state.company.logo && (
        <div className="mb-4">
          <img
            src={state.company.logo || "/images/default-logo.png"}
            alt="Company Logo"
            className="object-contain h-auto w-auto 
              max-h-[80px] max-w-[160px] 
              md:max-h-[120px] md:max-w-[240px] 
              lg:max-h-[150px] lg:max-w-[300px]
              print:max-h-[150px] print:max-w-[300px]"
          />
        </div>
      )}

      {/* Company and Client info in same row */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 sm:mb-8">
        {/* Company Info - Left */}
        <div
          className={`${
            isRTL ? "text-right" : "text-left"
          } mb-4 sm:mb-0 w-full sm:w-[50%]`}
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            {state.company.name}
          </h2>
          <p className="text-gray-600 whitespace-pre-line text-sm sm:text-base">
            {state.company.address}
          </p>
          {state.company.email && (
            <p className="text-gray-600 text-sm sm:text-base">
              {state.company.email}
            </p>
          )}
          {state.company.phone && (
            <p className="text-gray-600 text-sm sm:text-base">
              {state.company.phone}
            </p>
          )}
        </div>

        {/* Client Info - Right */}
        <div
          className={`${
            isRTL ? "text-right" : "text-left"
          } cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors print:hover:bg-transparent print:cursor-default print:p-0 w-full sm:w-[50%]`}
          onClick={onClientClick}
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            {t("invoice.billTo")}
          </h3>
          {invoice.client ? (
            <div className="text-gray-700 text-sm sm:text-base">
              <p className="font-medium">{invoice.client.name}</p>
              {invoice.client.email && <p>{invoice.client.email}</p>}
              <p className="whitespace-pre-line break-words">
                {invoice.client.address}
              </p>
              {invoice.client.phone && <p>{invoice.client.phone}</p>}
            </div>
          ) : (
            <p className="text-gray-400 italic print:hidden text-sm sm:text-base">
              {t("invoice.clickToSelectClient")}
            </p>
          )}
        </div>
      </div>

      {/* Centered Invoice Details with equal spacing */}
      <div
        className={`flex justify-center mb-6 sm:mb-8 ${
          isRTL ? "text-left" : "text-right"
        }`}
      >
        <div
          className="cursor-pointer hover:bg-blue-50 rounded transition-colors print:hover:bg-transparent print:cursor-default print:p-0 border border-gray-300 p-4 w-full max-w-2xl"
          onClick={onDetailsClick}
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">
                {t("invoice.invoiceNumber")}
              </p>
              <p className="font-medium text-gray-900 text-sm sm:text-base">
                {invoice.number || "INV-0001"}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">
                {t("invoice.invoiceDate")}
              </p>
              <div className="flex justify-center">
                {" "}
                <p
                  className="font-medium text-gray-900 text-sm sm:text-base"
                  dir="ltr"
                  style={{
                    direction: "ltr",
                    unicodeBidi: "isolate",
                  }}
                >
                  {invoice.date
                    ? new Date(invoice.date).toLocaleDateString("en-GB")
                    : t("invoice.selectDate")}
                </p>
              </div>
            </div>
            {!invoice.hideStatus && (
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Status</p>
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  {invoice.paid ? t("invoice.paid") : t("invoice.unpaid")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div
        className="mb-6 sm:mb-8 cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors print:hover:bg-transparent print:cursor-default print:p-0 overflow-x-auto"
        onClick={onProductsClick}
      >
        <table className="w-full border-collapse border border-gray-300 min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th
                className={`border border-gray-300 px-2 sm:px-4 py-2 ${
                  isRTL ? "text-right" : "text-left"
                } text-xs sm:text-sm`}
              >
                {t("invoice.product")}
              </th>
              <th className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-xs sm:text-sm w-24">
                {t("invoice.price")}
              </th>
              <th className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-xs sm:text-sm w-24 whitespace-nowrap">
                {t("invoice.discount")}
              </th>
              <th className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-xs sm:text-sm w-24">
                {t("invoice.amount")}
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items && invoice.items.length > 0 ? (
              invoice.items.map((item, index) => (
                <tr key={index}>
                  <td
                    className={`border border-gray-300 px-2 sm:px-4 py-2 ${
                      isRTL ? "text-right" : "text-left"
                    } text-xs sm:text-base max-w-xs`}
                  >
                    <div className="font-medium">
                      {item.name}
                      {item.quantity !== 1 ? ` × ${item.quantity}` : ""}
                    </div>
                    {item.description && (
                      <div className="text-xs text-gray-500 mt-1 whitespace-pre-wrap break-words">
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">
                    {currencySymbol()}
                    {(
                      item.amount /
                      item.quantity /
                      (1 - item.discount / 100)
                    ).toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">
                    {item.discount}%
                  </td>
                  <td className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-xs sm:text-sm">
                    {currencySymbol()}
                    {item.amount.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="print:hidden">
                <td
                  colSpan={4}
                  className="border border-gray-300 px-2 sm:px-4 py-6 sm:py-8 text-center text-gray-400 italic text-xs sm:text-sm"
                >
                  {t("invoice.clickToAddProducts")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div
        className={`flex ${
          isRTL ? "justify-start" : "justify-end"
        } mb-6 sm:mb-8`}
      >
        <div className="w-full sm:w-64">
          <div className="flex justify-between mb-2 text-sm sm:text-base">
            <span className="text-gray-700">{t("invoice.subtotal")}</span>
            <span className="font-medium">
              {currencySymbol()}
              {(invoice.subtotal || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between mb-2 text-sm sm:text-base">
            <span className="text-gray-700">
              {t("invoice.totalTax")} ({state.company.taxRate || 0}%)
            </span>
            <span className="font-medium">
              {currencySymbol()}
              {(invoice.tax || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-base sm:text-lg font-semibold border-t pt-2">
            <span>{t("invoice.total")}</span>
            <span>
              {currencySymbol()}
              {(invoice.total || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {(state.company.showNotes || invoice.notes) && (
        <div
          className={`mb-4 sm:mb-6 ${
            isRTL ? "text-right" : "text-left"
          } cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors print:hover:bg-transparent print:cursor-default print:p-0`}
          onClick={onNotesClick}
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            {t("invoice.notes")}
          </h3>
          <p className="text-gray-700 whitespace-pre-line text-sm sm:text-base">
            {invoice.notes || (
              <span className="text-gray-400 italic print:hidden">
                {t("invoice.clickToAddNotes")}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Terms */}
      {(state.company.showTerms || invoice.terms) && (
        <div
          className={`${
            isRTL ? "text-right" : "text-left"
          } cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors print:hover:bg-transparent print:cursor-default print:p-0`}
          onClick={onTermsClick}
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            {t("invoice.terms")}
          </h3>
          <p className="text-gray-700 whitespace-pre-line text-sm sm:text-base">
            {invoice.terms || (
              <span className="text-gray-400 italic print:hidden">
                {t("invoice.clickToAddTerms")}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default InvoicePreview;
