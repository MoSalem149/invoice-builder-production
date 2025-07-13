import React, { useState, useEffect } from "react";
import { Save, Eye, Printer as Print, RefreshCw } from "lucide-react";
import { useApp } from "../../hooks/useApp";
import { useLanguage } from "../../hooks/useLanguage";
import { useNotificationContext } from "../../hooks/useNotificationContext";
import { Invoice, InvoiceItem } from "../../types";
import { downloadInvoicePDF } from "../../utils/invoiceGenerator";
import InvoicePreview from "./InvoicePreview";
import ClientPanel from "./panels/ClientPanel";
import InvoiceDetailsPanel from "./panels/InvoiceDetailsPanel";
import ProductsPanel from "./panels/ProductsPanel";
import NotesPanel from "./panels/NotesPanel";
import TermsPanel from "./panels/TermsPanel";

const CreateInvoice: React.FC = () => {
  const { state, saveInvoice } = useApp();
  const { t, isRTL } = useLanguage();
  const { showSuccess, showError } = useNotificationContext();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [invoice, setInvoice] = useState<Partial<Invoice>>({
    number: `INV-${String(state.invoices.length + 1).padStart(4, "0")}`,
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    notes: "",
    terms: "",
  });

  // Check screen size and set isMobile state
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Same duration as other components

    return () => clearTimeout(timer);
  }, []);

  const calculateTotals = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxRate = state.company.taxRate || 0;
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const updateInvoice = (updates: Partial<Invoice>) => {
    setInvoice((prev) => {
      const updated = { ...prev, ...updates };
      if (updates.items) {
        const { subtotal, tax, total } = calculateTotals(updates.items);
        updated.subtotal = subtotal;
        updated.tax = tax;
        updated.total = total;
      }
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      // Validate required fields before proceeding
      if (!invoice.client) {
        throw new Error(t("create.clientRequired"));
      }
      if (!invoice.items || invoice.items.length === 0) {
        throw new Error(t("create.itemsRequired"));
      }

      // Prepare the invoice data for submission
      const invoiceData: Partial<Invoice> = {
        number: invoice.number!,
        date: invoice.date!,
        dueDate: invoice.dueDate!,
        client: {
          _id: invoice.client._id, // Changed from 'id' to '_id' to match type
          name: invoice.client.name,
          ...(invoice.client.address && { address: invoice.client.address }), // Optional field
          ...(invoice.client.phone && { phone: invoice.client.phone }), // Optional field
        },
        items: invoice.items.map((item) => ({
          id: item.id || Date.now().toString(),
          name: item.name,
          description: item.description || "",
          quantity: item.quantity,
          price: item.price || 0, // Make sure this matches your InvoiceItem type
          discount: item.discount || 0,
          amount: item.amount || 0,
        })),
        subtotal: invoice.subtotal!,
        tax: invoice.tax!,
        total: invoice.total!,
        ...(invoice.notes && { notes: invoice.notes }), // Optional field
        ...(invoice.terms && { terms: invoice.terms }), // Optional field
      };

      // Save the invoice
      const success = await saveInvoice(invoiceData);

      if (success) {
        showSuccess(
          t("create.invoiceSavedSuccess"),
          t("create.invoiceSavedMessage").replace(
            "{number}",
            invoiceData.number!
          ),
          4000
        );

        // Reset form with new invoice number
        setInvoice({
          number: `INV-${String(state.invoices.length + 2).padStart(4, "0")}`,
          date: new Date().toISOString().split("T")[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          items: [],
          subtotal: 0,
          tax: 0,
          total: 0,
          notes: "",
          terms: "",
          client: undefined,
        });
      } else {
        throw new Error(t("create.saveFailedUnknown"));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("create.cannotSaveMessage");
      showError(t("create.cannotSaveInvoice"), errorMessage, 5000);
      console.error("Invoice save error:", error);
    }
  };

  const handlePrint = () => {
    if (invoice.client && invoice.items && invoice.items.length > 0) {
      const fullInvoice: Invoice = {
        _id: Date.now().toString(), // Changed to _id
        number: invoice.number!,
        date: invoice.date!,
        dueDate: invoice.dueDate!,
        client: {
          _id: invoice.client._id, // Changed to _id
          name: invoice.client.name,
          address: invoice.client.address || "",
          phone: invoice.client.phone || "",
        },
        items: invoice.items,
        subtotal: invoice.subtotal!,
        tax: invoice.tax!,
        total: invoice.total!,
        notes: invoice.notes || "",
        terms: invoice.terms || "",
      };

      const companyInfo = {
        ...state.company,
        address: state.company.address || "",
        email: state.company.email || "",
        phone: state.company.phone || "",
        watermark: state.company.watermark || "",
        showNotes: state.company.showNotes || false,
        showTerms: state.company.showTerms || false,
      };

      downloadInvoicePDF(fullInvoice, companyInfo, isRTL);
    } else {
      showError(
        t("create.cannotSaveInvoice"),
        t("create.cannotSaveMessage"),
        5000
      );
    }
  };

  const renderPanel = () => {
    if (!activePanel) return null;

    const panelProps = {
      onClose: () => {
        setActivePanel(null);
        if (isMobile) setShowPreview(true);
      },
    };

    switch (activePanel) {
      case "client":
        return (
          <ClientPanel
            selectedClient={invoice.client}
            onSelectClient={(client) => {
              updateInvoice({ client });
              setActivePanel(null);
              if (isMobile) setShowPreview(true);
            }}
            {...panelProps}
          />
        );
      case "details":
        return (
          <InvoiceDetailsPanel
            invoice={invoice}
            onUpdate={(updates) => {
              updateInvoice(updates);
              setActivePanel(null);
              if (isMobile) setShowPreview(true);
            }}
            {...panelProps}
          />
        );
      case "products":
        return (
          <ProductsPanel
            selectedItems={invoice.items || []}
            onUpdate={(items) => {
              updateInvoice({ items });
              setActivePanel(null);
              if (isMobile) setShowPreview(true);
            }}
            {...panelProps}
          />
        );
      case "notes":
        return (
          <NotesPanel
            notes={invoice.notes || ""}
            onUpdate={(notes) => {
              updateInvoice({ notes });
              setActivePanel(null);
              if (isMobile) setShowPreview(true);
            }}
            {...panelProps}
          />
        );
      case "terms":
        return (
          <TermsPanel
            terms={invoice.terms || ""}
            onUpdate={(terms) => {
              updateInvoice({ terms });
              setActivePanel(null);
              if (isMobile) setShowPreview(true);
            }}
            {...panelProps}
          />
        );
      default:
        return null;
    }
  };

  const panelClickHandler = (panel: string) => {
    setActivePanel(panel);
    if (isMobile) {
      setShowPreview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <RefreshCw className="animate-spin h-10 w-10 text-blue-600 mb-4" />
          <p className="text-gray-600 text-lg">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      {/* Left Panel - Always render but control visibility */}
      <div
        className={`${
          activePanel ? "block lg:w-1/3" : "hidden lg:block lg:w-0"
        } transition-all duration-300 overflow-hidden`}
      >
        {renderPanel()}
      </div>

      {/* Right Panel - Invoice Preview */}
      <div
        className={`${
          activePanel && !isMobile ? "lg:w-2/3" : "w-full"
        } transition-all duration-300 flex flex-col`}
      >
        {/* Toolbar - fixed below navbar - Always visible */}
        {(!activePanel || !isMobile) && (
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between print:hidden space-y-3 sm:space-y-0 sticky top-16 z-40 mb-16">
            <div
              className={`flex items-center space-x-4 ${
                isRTL ? "space-x-reverse flex-row-reverse" : ""
              }`}
            >
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                {t("create.title")}
              </h1>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center space-x-2 px-3 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors ${
                  isRTL ? "space-x-reverse flex-row-reverse" : ""
                }`}
              >
                <Eye className="h-4 w-4" />
                <span>
                  {showPreview
                    ? t("create.hidePreview")
                    : t("create.showPreview")}{" "}
                  {t("create.preview")}
                </span>
              </button>
            </div>
            <div
              className={`flex items-center space-x-3 ${
                isRTL ? "space-x-reverse flex-row-reverse" : ""
              }`}
            >
              <button
                onClick={handlePrint}
                className={`flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors ${
                  isRTL ? "space-x-reverse flex-row-reverse" : ""
                }`}
              >
                <Print className="h-4 w-4" />
                <span>{t("create.print")}</span>
              </button>
              <button
                onClick={handleSave}
                className={`flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                  isRTL ? "space-x-reverse flex-row-reverse" : ""
                }`}
              >
                <Save className="h-4 w-4" />
                <span>{t("create.saveInvoice")}</span>
              </button>
            </div>
          </div>
        )}

        {/* Invoice Preview - Conditionally rendered */}
        {showPreview && (
          <div className="flex-1 overflow-auto p-4 sm:p-6 print:p-0">
            <div className="max-w-4xl mx-auto print:max-w-none print:mx-0">
              <div id="invoice-preview" className="relative">
                <InvoicePreview
                  invoice={invoice}
                  onClientClick={() => panelClickHandler("client")}
                  onDetailsClick={() => panelClickHandler("details")}
                  onProductsClick={() => panelClickHandler("products")}
                  onNotesClick={() => panelClickHandler("notes")}
                  onTermsClick={() => panelClickHandler("terms")}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateInvoice;
