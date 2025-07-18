import React, { useState } from "react";
import { X, Calendar, Hash, Check } from "lucide-react";
import { useLanguage } from "../../../hooks/useLanguage";
import { Invoice } from "../../../types";

interface InvoiceDetailsPanelProps {
  invoice: Partial<Invoice>;
  onUpdate: (updates: Partial<Invoice>) => void;
  onClose: () => void;
}

const InvoiceDetailsPanel: React.FC<InvoiceDetailsPanelProps> = ({
  invoice,
  onUpdate,
  onClose,
}) => {
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState({
    number: invoice.number || "",
    date: invoice.date || new Date().toISOString().split("T")[0],
    paid: invoice.paid || false,
    hideStatus: invoice.hideStatus || false,
    showStatusWatermark: invoice.showStatusWatermark || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const handlePaidStatusChange = (isPaid: boolean) => {
    setFormData({ ...formData, paid: isPaid });
  };

  const toggleCheckbox = (field: keyof typeof formData) => {
    const newValue = !formData[field];
    setFormData({ ...formData, [field]: newValue });

    // If hiding status, also hide the watermark
    if (field === "hideStatus" && newValue) {
      setFormData((prev) => ({ ...prev, showStatusWatermark: false }));
    }
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col mt-14 lg:pt-0">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 relative">
        <div
          className={`flex items-center justify-between ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            {t("details.invoiceDetails")}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors z-50"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Invoice Number */}
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              <Hash className={`h-4 w-4 inline ${isRTL ? "ml-1" : "mr-1"}`} />
              {t("invoice.invoiceNumber")}
            </label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) =>
                setFormData({ ...formData, number: e.target.value })
              }
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isRTL ? "text-right" : "text-left"
              }`}
              placeholder="INV-0001"
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>

          {/* Invoice Date */}
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              <Calendar
                className={`h-4 w-4 inline ${isRTL ? "ml-1" : "mr-1"}`}
              />
              {t("invoice.invoiceDate")}
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isRTL ? "text-right" : "text-left"
              }`}
            />
          </div>

          {/* Hide Status Checkbox */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => toggleCheckbox("hideStatus")}
              className={`flex items-center justify-center h-6 w-6 rounded border-2 ${
                formData.hideStatus
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-300"
              } transition-colors`}
            >
              {formData.hideStatus && (
                <Check className="h-4 w-4 text-white" strokeWidth={3} />
              )}
            </button>
            <label
              className={`${
                isRTL ? "mr-3" : "ml-3"
              } text-sm font-medium text-gray-700`}
            >
              {t("details.hideStatus")}
            </label>
          </div>

          {/* Paid Status - Only shown when hideStatus is false */}
          {!formData.hideStatus && (
            <div className="space-y-3">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => handlePaidStatusChange(true)}
                  className={`flex items-center justify-center h-6 w-6 rounded border-2 ${
                    formData.paid
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300"
                  } transition-colors`}
                >
                  {formData.paid && (
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  )}
                </button>
                <label
                  className={`${
                    isRTL ? "mr-3" : "ml-3"
                  } text-sm font-medium text-gray-700`}
                >
                  {t("invoice.paid")}
                </label>
              </div>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => handlePaidStatusChange(false)}
                  className={`flex items-center justify-center h-6 w-6 rounded border-2 ${
                    !formData.paid
                      ? "bg-red-500 border-red-500"
                      : "border-gray-300"
                  } transition-colors`}
                >
                  {!formData.paid && (
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  )}
                </button>
                <label
                  className={`${
                    isRTL ? "mr-3" : "ml-3"
                  } text-sm font-medium text-gray-700`}
                >
                  {t("invoice.unpaid")}
                </label>
              </div>

              {/* Show Status Watermark Checkbox - Only shown when hideStatus is false */}
              <div className="flex items-center pt-4">
                <button
                  type="button"
                  onClick={() => toggleCheckbox("showStatusWatermark")}
                  className={`flex items-center justify-center h-6 w-6 rounded border-2 ${
                    formData.showStatusWatermark
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300"
                  } transition-colors`}
                >
                  {formData.showStatusWatermark && (
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  )}
                </button>
                <label
                  className={`${
                    isRTL ? "mr-3" : "ml-3"
                  } text-sm font-medium text-gray-700`}
                >
                  {t("details.showStatusWatermark")}
                </label>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("details.updateDetails")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvoiceDetailsPanel;
