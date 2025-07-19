import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  X,
  User,
  Archive,
  ArchiveRestore,
  Edit,
} from "lucide-react";
import { useApp } from "../../../hooks/useApp";
import { useAuth } from "../../../hooks/useAuth";
import { useLanguage } from "../../../hooks/useLanguage";
import { useNotificationContext } from "../../../hooks/useNotificationContext";
import { Client } from "../../../types";
import {
  validateClientName,
  validatePhoneNumber,
  validateAddress,
  validateDuplicateClient,
} from "../../../utils/validation";

interface ClientPanelProps {
  selectedClient?: Client;
  onSelectClient: (client: Client) => void;
  onClose: () => void;
}

const ClientPanel: React.FC<ClientPanelProps> = ({
  selectedClient,
  onSelectClient,
  onClose,
}) => {
  const { state, dispatch } = useApp();
  const { state: authState } = useAuth();
  const { t, isRTL } = useLanguage();
  const { showError, showSuccess } = useNotificationContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isArchiving, setIsArchiving] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [newClient, setNewClient] = useState<Omit<Client, "id" | "_id">>({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const filteredClients = state.clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.address || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.phone || "").includes(searchTerm);
    (client.email || "").includes(searchTerm);
    const matchesArchiveFilter = showArchived
      ? client.archived
      : !client.archived;
    return matchesSearch && matchesArchiveFilter;
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const nameError = validateClientName(newClient.name, t);
    if (nameError) newErrors.name = nameError;

    // Check for duplicate client (only if not editing or name changed)
    const duplicateError = validateDuplicateClient(
      newClient.name,
      state.clients,
      t
    );
    if (
      duplicateError &&
      (!editingClient || editingClient.name !== newClient.name)
    ) {
      newErrors.name = duplicateError;
    }

    if (newClient.phone) {
      const phoneError = validatePhoneNumber(newClient.phone, t);
      if (phoneError) newErrors.phone = phoneError;
    }

    if (newClient.address) {
      const addressError = validateAddress(newClient.address, t);
      if (addressError) newErrors.address = addressError;
    }

    if (newClient.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newClient.email)) {
        newErrors.email = t("validation.emailInvalid");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddClient = async () => {
    if (!validateForm()) {
      showError(
        t("validation.validationError"),
        t("validation.fixErrorsBelow")
      );
      return;
    }

    if (!authState.isAuthenticated || !authState.token) {
      showError("Authentication required", "Please login to add clients");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/clients`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authState.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newClient.name,
            address: newClient.address,
            phone: newClient.phone,
            email: newClient.email,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const client: Client = {
          _id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          address: data.data.address,
          phone: data.data.phone,
          archived: data.data.archived,
        };

        dispatch({ type: "ADD_CLIENT", payload: client });
        setNewClient({ name: "", address: "", phone: "" });
        setShowAddForm(false);
        onSelectClient(client);
        setErrors({});
        showSuccess(t("client.clientAdded"), t("client.clientAddedMessage"));
      } else {
        const errorData = await response.json();
        showError(
          "Failed to add client",
          errorData.message || "Please try again"
        );
      }
    } catch (error) {
      console.error("Error adding client:", error);
      showError("Network error", "Failed to connect to server");
    }
  };

  const handleUpdateClient = async () => {
    if (!validateForm() || !editingClient?._id) {
      showError(
        t("validation.validationError"),
        t("validation.fixErrorsBelow")
      );
      return;
    }

    if (!authState.isAuthenticated || !authState.token) {
      showError("Authentication required", "Please login to update clients");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/clients/${editingClient._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authState.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newClient.name,
            address: newClient.address,
            phone: newClient.phone,
            email: newClient.email,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const updatedClient: Client = {
          _id: data.data._id,
          name: data.data.name,
          address: data.data.address,
          phone: data.data.phone,
          email: data.data.email,
          archived: data.data.archived,
        };

        dispatch({ type: "UPDATE_CLIENT", payload: updatedClient });

        state.invoices.forEach((invoice) => {
          if (invoice.client._id === updatedClient._id) {
            const updatedInvoice = {
              ...invoice,
              client: {
                ...invoice.client,
                name: updatedClient.name,
                address: updatedClient.address,
                phone: updatedClient.phone,
                email: updatedClient.email,
              },
            };
            dispatch({ type: "UPDATE_INVOICE", payload: updatedInvoice });
          }
        });

        setNewClient({ name: "", address: "", phone: "", email: "" });
        setShowAddForm(false);
        setEditingClient(null);
        setErrors({});
        showSuccess(
          t("client.clientUpdated"),
          t("client.clientUpdatedMessage")
        );
      } else {
        const errorData = await response.json();
        showError(
          "Failed to update client",
          errorData.message || "Please try again"
        );
      }
    } catch (error) {
      console.error("Error updating client:", error);
      showError("Network error", "Failed to connect to server");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewClient({ ...newClient, [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleEditClick = (client: Client) => {
    setEditingClient(client);
    setNewClient({
      name: client.name,
      address: client.address || "",
      email: client.email || "",
      phone: client.phone || "",
    });
    setShowAddForm(true);
  };

  const handleArchiveToggle = async (clientId: string, isArchived: boolean) => {
    if (!clientId) {
      showError("Invalid client", "No client ID provided");
      return;
    }

    if (!authState.isAuthenticated || !authState.token) {
      showError("Authentication required", "Please login to modify clients");
      return;
    }

    setIsArchiving(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/clients/${clientId}/archive`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authState.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ archived: !isArchived }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update client");
      }

      const data = await response.json();
      const updatedClient = data.data;

      dispatch({
        type: isArchived ? "UNARCHIVE_CLIENT" : "ARCHIVE_CLIENT",
        payload: updatedClient._id,
      });

      showSuccess(
        isArchived ? t("client.clientUnarchived") : t("client.clientArchived"),
        isArchived
          ? t("client.clientUnarchivedMessage")
          : t("client.clientArchivedMessage")
      );
    } catch (error) {
      console.error("Error updating client:", error);
      showError(
        "Failed to update client",
        error instanceof Error ? error.message : "Please try again"
      );
    } finally {
      setIsArchiving(false);
    }
  };

  useEffect(() => {
    if (state.clients.length > 0 || state.products.length > 0) {
      setIsLoadingData(false);
    }
  }, [state.clients, state.products]);

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
            {t("client.selectClient")}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors z-50"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Archive Toggle */}
        <div className="mb-4 mt-4">
          <div
            className={`flex space-x-2 ${
              isRTL ? "space-x-reverse flex-row-reverse" : ""
            }`}
          >
            <button
              onClick={() => setShowArchived(false)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                !showArchived
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t("client.activeClients")}
            </button>
            <button
              onClick={() => setShowArchived(true)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                showArchived
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t("client.archivedClients")}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search
            className={`absolute ${
              isRTL ? "right-3" : "left-3"
            } top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`}
          />
          <input
            type="text"
            placeholder={t("client.searchClients")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full ${
              isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
            } py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>

        {/* Add Client Button */}
        {!showArchived && (
          <button
            onClick={() => {
              setEditingClient(null);
              setShowAddForm(true);
            }}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
              isRTL ? "space-x-reverse flex-row-reverse" : ""
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>{t("client.addNewClient")}</span>
          </button>
        )}
      </div>

      {/* Client List */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="space-y-3">
          {filteredClients.map((client) => (
            <div
              key={client._id}
              className={`p-3 sm:p-4 border rounded-lg transition-colors ${
                selectedClient?._id === client._id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              } ${client.archived ? "opacity-60" : ""}`}
            >
              <div
                className={`flex items-start justify-between ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex items-start space-x-3 flex-1 cursor-pointer ${
                    isRTL ? "space-x-reverse flex-row-reverse" : ""
                  }`}
                  onClick={() => !client.archived && onSelectClient(client)}
                >
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div
                    className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}
                  >
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                      {client.name}
                    </h3>
                    {/* Add this block for email display */}
                    {client.email && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {client.email}
                      </p>
                    )}
                    {client.address && (
                      <p
                        className="text-xs sm:text-sm text-gray-600 mt-1 whitespace-pre-line"
                        style={{ wordBreak: "break-word" }}
                      >
                        {client.address}
                      </p>
                    )}
                    {client.phone && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {client.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div
                  className={`flex space-x-2 ${isRTL ? "space-x-reverse" : ""}`}
                >
                  {!client.archived && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(client);
                      }}
                      className="p-1 hover:bg-gray-100 rounded transition-colors text-blue-500"
                      title={t("common.edit")}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArchiveToggle(client._id, client.archived || false);
                    }}
                    disabled={isArchiving || isLoadingData}
                    className={`p-1 hover:bg-gray-100 rounded transition-colors ${
                      isArchiving ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    title={
                      client.archived
                        ? t("common.unarchive")
                        : t("common.archive")
                    }
                  >
                    {client.archived ? (
                      <ArchiveRestore className="h-4 w-4 text-green-600" />
                    ) : (
                      <Archive className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-8">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">{t("client.noClientsFound")}</p>
          </div>
        )}
      </div>

      {/* Add/Edit Client Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start lg:items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md  mt-4 lg:mt-0">
            <h3
              className={`text-base sm:text-lg font-semibold text-gray-900 mb-4 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {editingClient
                ? t("client.editClient")
                : t("client.addNewClient")}
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-1 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("client.clientName")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isRTL ? "text-right" : "text-left"
                  } ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  placeholder={t("client.enterClientName")}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.name && (
                  <p
                    className={`text-red-500 text-sm mt-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-1 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("client.email")}
                </label>
                <input
                  type="email"
                  value={newClient.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isRTL ? "text-right" : "text-left"
                  } ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  placeholder={t("client.enterEmail")}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.email && (
                  <p
                    className={`text-red-500 text-sm mt-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-1 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("client.address")}
                </label>
                <textarea
                  value={newClient.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isRTL ? "text-right" : "text-left"
                  } ${errors.address ? "border-red-500" : "border-gray-300"}`}
                  placeholder={t("client.enterClientAddress")}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.address && (
                  <p
                    className={`text-red-500 text-sm mt-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.address}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-1 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("client.phoneNumber")}
                </label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isRTL ? "text-right" : "text-left"
                  } ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                  placeholder={t("client.enterPhoneNumber")}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                {errors.phone && (
                  <p
                    className={`text-red-500 text-sm mt-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div
              className={`flex space-x-3 mt-6 ${
                isRTL ? "space-x-reverse flex-row-reverse" : ""
              }`}
            >
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingClient(null);
                  setErrors({});
                  setNewClient({ name: "", address: "", phone: "", email: "" });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={editingClient ? handleUpdateClient : handleAddClient}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingClient
                  ? t("client.editClient")
                  : t("client.addNewClient")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPanel;
