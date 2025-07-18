import React, { useState, useEffect, useCallback } from "react";
import { useNotificationContext } from "../../hooks/useNotificationContext";
import { useLanguage } from "../../hooks/useLanguage";
import { useAuth } from "../../hooks/useAuth";
import { Car } from "../../types";
import { getPlaceholderImage } from "../../utils/placeholders";
import { Plus, Trash2, Edit, X, Save, RefreshCw } from "lucide-react";

const UpdateCars: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { showError, showSuccess } = useNotificationContext();
  const { state: authState } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [newCar, setNewCar] = useState<Partial<Car>>({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    images: [],
    category: "Sedan",
    condition: "New",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: 0,
    engineSize: "",
    cylinders: 4,
    color: "",
    doors: 4,
    chassisNumber: "",
    description: "",
    isFeatured: false,
  });

  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cars`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cars");
      }

      const data = await response.json();
      if (data.success) {
        setCars(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch cars");
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      showError(t("notifications.error"), t("notifications.failedToFetchCars"));
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [authState.token, showError, t]);

  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchCars();
    }
  }, [authState.isAuthenticated, authState.token, fetchCars]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (editingCar) {
      setEditingCar({ ...editingCar, [name]: value });
    } else {
      setNewCar({ ...newCar, [name]: value });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cars/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload images");
      }

      const data = await response.json();

      if (editingCar) {
        setEditingCar({
          ...editingCar,
          images: [...editingCar.images, ...data.urls],
        });
      } else {
        setNewCar({
          ...newCar,
          images: [...(newCar.images || []), ...data.urls],
        });
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      showError(
        t("notifications.error"),
        error instanceof Error
          ? error.message
          : t("notifications.failedToUploadImages")
      );
    }
  };

  const removeImage = (index: number) => {
    if (editingCar) {
      const updatedImages = [...editingCar.images];
      updatedImages.splice(index, 1);
      setEditingCar({ ...editingCar, images: updatedImages });
    } else {
      const updatedImages = [...(newCar.images || [])];
      updatedImages.splice(index, 1);
      setNewCar({ ...newCar, images: updatedImages });
    }
  };

  const handleAddCar = async () => {
    if (
      !newCar.brand ||
      !newCar.model ||
      !newCar.year ||
      !newCar.price ||
      !newCar.images ||
      newCar.images.length === 0
    ) {
      showError(
        t("notifications.validationFailed"),
        t("notifications.requiredFieldsMissing")
      );
      return;
    }

    try {
      const carData = {
        ...newCar,
        price: Number(newCar.price),
        year: Number(newCar.year),
        mileage: Number(newCar.mileage),
        cylinders: Number(newCar.cylinders),
        doors: Number(newCar.doors),
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cars`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify(carData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add car");
      }

      fetchCars();
      setNewCar({
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        price: 0,
        images: [],
        category: "Sedan",
        condition: "New",
        transmission: "Automatic",
        fuelType: "Petrol",
        mileage: 0,
        engineSize: "",
        cylinders: 4,
        color: "",
        doors: 4,
        chassisNumber: "",
        description: "",
        isFeatured: false,
      });
      showSuccess(t("notifications.success"), t("notifications.carAdded"));
    } catch (error) {
      console.error("Error adding car:", error);
      showError(
        t("notifications.errorAddingCar"),
        error instanceof Error ? error.message : t("notifications.error")
      );
    }
  };

  const handleUpdateCar = async () => {
    if (!editingCar) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cars/${editingCar._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
          body: JSON.stringify(editingCar),
        }
      );
      const data = await response.json();
      if (data.success) {
        fetchCars();
        setEditingCar(null);
        showSuccess(t("notifications.success"), t("notifications.carUpdated"));
      } else {
        throw new Error(data.message || "Failed to update car");
      }
    } catch (error) {
      console.error("Error updating car:", error);
      showError(
        t("notifications.errorUpdatingCar"),
        error instanceof Error ? error.message : t("notifications.error")
      );
    }
  };

  const handleDeleteCar = async (id: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cars/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        fetchCars();
        showSuccess(t("notifications.success"), t("notifications.carDeleted"));
      } else {
        throw new Error(data.message || "Failed to delete car");
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      showError(
        t("notifications.errorDeletingCar"),
        error instanceof Error ? error.message : t("notifications.error")
      );
    }
  };

  const categories = [
    t("dashboard.category.Sedan"),
    t("dashboard.category.SUV"),
    t("dashboard.category.Hatchback"),
    t("dashboard.category.Coupe"),
    t("dashboard.category.Crossover"),
  ];

  const conditions = [
    t("dashboard.condition.New"),
    t("dashboard.condition.Used"),
  ];

  const transmissions = [
    t("dashboard.transmission.Automatic"),
    t("dashboard.transmission.Manual"),
  ];

  const fuelTypes = [
    t("dashboard.fuelType.Petrol"),
    t("dashboard.fuelType.Diesel"),
    t("dashboard.fuelType.Electric"),
    t("dashboard.fuelType.Hybrid"),
  ];

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 mt-14">
      <div className="mb-6 sm:mb-8">
        <h1
          className={`text-2xl sm:text-3xl font-bold text-gray-900 mb-2 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t("dashboard.updateCarData")}
        </h1>
        <p className={`text-gray-600 ${isRTL ? "text-right" : "text-left"}`}>
          {t("dashboard.updateCarDataDesc")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add/Edit Car Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2
            className={`text-xl font-semibold mb-4 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {editingCar ? t("dashboard.editCar") : t("dashboard.addNewCar")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium text-gray-600 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("dashboard.brand")}
                <span className="text-red-500"> *</span>
              </label>
              <input
                type="text"
                name="brand"
                value={editingCar ? editingCar.brand : newCar.brand || ""}
                onChange={handleInputChange}
                className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                required
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-gray-600 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("dashboard.model")} <span className="text-red-500"> *</span>
              </label>
              <input
                type="text"
                name="model"
                value={editingCar ? editingCar.model : newCar.model || ""}
                onChange={handleInputChange}
                className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                required
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-gray-600 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("dashboard.year")} <span className="text-red-500"> *</span>
              </label>
              <input
                type="number"
                name="year"
                value={
                  editingCar
                    ? editingCar.year
                    : newCar.year || new Date().getFullYear()
                }
                onChange={handleInputChange}
                className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-gray-600 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("dashboard.price")} (CHF){" "}
                <span className="text-red-500"> *</span>
              </label>
              <input
                type="number"
                name="price"
                value={editingCar ? editingCar.price : newCar.price || 0}
                onChange={handleInputChange}
                className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            <div className="md:col-span-2">
              <label
                className={`block text-sm font-medium text-gray-600 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("dashboard.images")} <span className="text-red-500"> *</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(editingCar ? editingCar.images : newCar.images || []).map(
                  (img, index) => (
                    <div
                      key={index}
                      className="relative h-24 w-24 bg-gray-100 rounded-md overflow-hidden"
                    >
                      <img
                        src={
                          img
                            ? img.startsWith("http")
                              ? img
                              : `${import.meta.env.VITE_API_URL}${img}`
                            : getPlaceholderImage(400, 300, "Car+Image")
                        }
                        alt={`Car preview ${index}`}
                        className="absolute inset-0 w-full h-full object-contain"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            getPlaceholderImage(400, 300, "Car+Image");
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )
                )}
              </div>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className={`block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  <span className="text-gray-700">
                    {t("dashboard.chooseFile")}
                  </span>
                  <span
                    className={`text-gray-500 ${isRTL ? "mr-2" : "ml-2"}`}
                    id="file-chosen"
                  >
                    {t("dashboard.noFileChosen")}
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-gray-600 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("dashboard.categoryHeader")}
              </label>
              <select
                name="category"
                value={
                  editingCar ? editingCar.category : newCar.category || "Sedan"
                }
                onChange={handleInputChange}
                className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-gray-600 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("dashboard.conditionHeader")}
              </label>
              <select
                name="condition"
                value={
                  editingCar ? editingCar.condition : newCar.condition || "New"
                }
                onChange={handleInputChange}
                className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-gray-600 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("dashboard.transmissionHeader")}
              </label>
              <select
                name="transmission"
                value={
                  editingCar
                    ? editingCar.transmission
                    : newCar.transmission || "Automatic"
                }
                onChange={handleInputChange}
                className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {transmissions.map((trans) => (
                  <option key={trans} value={trans}>
                    {trans}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-gray-600 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("dashboard.fuelTypeHeader")}
              </label>
              <select
                name="fuelType"
                value={
                  editingCar ? editingCar.fuelType : newCar.fuelType || "Petrol"
                }
                onChange={handleInputChange}
                className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {fuelTypes.map((fuel) => (
                  <option key={fuel} value={fuel}>
                    {fuel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-gray-600 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("dashboard.mileage")} (km)
              </label>
              <input
                type="number"
                name="mileage"
                value={editingCar ? editingCar.mileage : newCar.mileage || 0}
                onChange={handleInputChange}
                className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-gray-600 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("dashboard.color")}
              </label>
              <input
                type="text"
                name="color"
                value={editingCar ? editingCar.color || "" : newCar.color || ""}
                onChange={handleInputChange}
                className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-gray-600 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("dashboard.engineSize")}
              </label>
              <input
                type="text"
                name="engineSize"
                value={
                  editingCar
                    ? editingCar.engineSize || ""
                    : newCar.engineSize || ""
                }
                onChange={handleInputChange}
                className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-gray-600 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("dashboard.cylinders")}
              </label>
              <input
                type="number"
                name="cylinders"
                value={
                  editingCar ? editingCar.cylinders : newCar.cylinders || 4
                }
                onChange={handleInputChange}
                className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-gray-600 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("dashboard.doors")}
              </label>
              <input
                type="number"
                name="doors"
                value={editingCar ? editingCar.doors : newCar.doors || 4}
                onChange={handleInputChange}
                className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            <div className="md:col-span-2">
              <label
                className={`block text-sm font-medium text-gray-600 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("dashboard.chassisNumber")}{" "}
              </label>
              <input
                type="text"
                name="chassisNumber"
                value={
                  editingCar
                    ? editingCar.chassisNumber || ""
                    : newCar.chassisNumber || ""
                }
                onChange={handleInputChange}
                className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            <div className="md:col-span-2">
              <label
                className={`block text-sm font-medium text-gray-600 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("dashboard.description")}
              </label>
              <textarea
                name="description"
                value={
                  editingCar
                    ? editingCar.description || ""
                    : newCar.description || ""
                }
                onChange={handleInputChange}
                className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                rows={3}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            <div>
              <label
                className={`flex items-center space-x-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={
                    editingCar
                      ? editingCar.isFeatured
                      : newCar.isFeatured || false
                  }
                  onChange={(e) => {
                    if (editingCar) {
                      setEditingCar({
                        ...editingCar,
                        isFeatured: e.target.checked,
                      });
                    } else {
                      setNewCar({ ...newCar, isFeatured: e.target.checked });
                    }
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-600">
                  {t("dashboard.featured")}
                </span>
              </label>
            </div>
          </div>

          <div
            className={`mt-6 flex justify-end space-x-3 ${
              isRTL ? "space-x-reverse" : ""
            }`}
          >
            {editingCar && (
              <button
                type="button"
                onClick={() => setEditingCar(null)}
                className={`px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors flex items-center ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <X size={18} className={isRTL ? "ml-1" : "mr-1"} />
                {t("dashboard.cancel")}
              </button>
            )}

            <button
              type="button"
              onClick={editingCar ? handleUpdateCar : handleAddCar}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              {editingCar ? (
                <>
                  <Save size={18} className={isRTL ? "ml-1" : "mr-1"} />
                  {t("dashboard.updateCar")}
                </>
              ) : (
                <>
                  <Plus size={18} className={isRTL ? "ml-1" : "mr-1"} />
                  {t("dashboard.addCar")}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Cars List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2
            className={`text-xl font-semibold mb-4 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("dashboard.carList")}
          </h2>

          {cars.length === 0 ? (
            <div
              className={`text-center py-8 text-gray-500 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("dashboard.noCarsFound")}
            </div>
          ) : (
            <div className="space-y-4">
              {cars.map((car) => (
                <div
                  key={car._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`flex justify-between items-start ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-4 ${
                        isRTL ? "space-x-reverse" : ""
                      }`}
                    >
                      {car.images?.length > 0 ? (
                        <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={
                              car.images?.[0]
                                ? car.images[0].startsWith("http")
                                  ? car.images[0]
                                  : `${import.meta.env.VITE_API_URL}${
                                      car.images[0]
                                    }`
                                : getPlaceholderImage(400, 300, "Car+Image")
                            }
                            alt={`${car.brand} ${car.model}`}
                            className="w-full h-full object-contain"
                            crossOrigin="anonymous"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                getPlaceholderImage(400, 300, "Car+Image");
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            {t("dashboard.noFileChosen")}
                          </span>
                        </div>
                      )}
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <h3 className="font-medium">
                          {car.brand} {car.model} ({car.year})
                        </h3>
                        <p className="text-sm text-gray-600">
                          {car.category} • {car.condition} • CHF{" "}
                          {car.price.toLocaleString()}
                        </p>
                        {car.isFeatured && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {t("dashboard.featured")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className={`flex space-x-2 ${
                        isRTL ? "space-x-reverse" : ""
                      }`}
                    >
                      <button
                        onClick={() => setEditingCar(car)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title={t("dashboard.edit")}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCar(car._id)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        title={t("dashboard.delete")}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateCars;
