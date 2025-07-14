// components/Cars/UpdateCars.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useNotificationContext } from "../../hooks/useNotificationContext";
import { useLanguage } from "../../hooks/useLanguage";
import { useAuth } from "../../hooks/useAuth";
import { Car } from "../../types";
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
    // Default values for optional fields
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
      setCars([]); // Set empty array on error
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
        `${import.meta.env.VITE_API_URL}/api/cars/upload`, // Updated endpoint
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
        t("notifications.error"),
        t("notifications.fillRequiredFields")
      );
      return;
    }

    try {
      // Convert numeric fields to numbers
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
        t("notifications.error"),
        error instanceof Error ? error.message : "Failed to add car"
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
        t("notifications.error"),
        error instanceof Error ? error.message : "Failed to update car"
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
        t("notifications.error"),
        error instanceof Error ? error.message : "Failed to delete car"
      );
    }
  };

  const categories = ["Sedan", "SUV", "Hatchback", "Coupe", "Crossover"];
  const conditions = ["New", "Used"];
  const transmissions = ["Automatic", "Manual"];
  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];

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
          <h2 className="text-xl font-semibold mb-4">
            {editingCar ? t("dashboard.editCar") : t("dashboard.addNewCar")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {t("dashboard.brand")}
                <span className="text-red-500"> *</span>
              </label>
              <input
                type="text"
                name="brand"
                value={editingCar ? editingCar.brand : newCar.brand || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {t("dashboard.model")} <span className="text-red-500"> *</span>
              </label>
              <input
                type="text"
                name="model"
                value={editingCar ? editingCar.model : newCar.model || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
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
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {t("dashboard.price")} (CHF){" "}
                <span className="text-red-500"> *</span>
              </label>
              <input
                type="number"
                name="price"
                value={editingCar ? editingCar.price : newCar.price || 0}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {t("dashboard.images")} <span className="text-red-500"> *</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newCar.images?.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={
                        img
                          ? `${import.meta.env.VITE_API_URL}${img}`
                          : "/images/default-car.jpg"
                      }
                      alt={`Car preview ${index}`}
                      className="h-16 w-16 object-cover rounded-md"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/default-car.jpg";
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
                ))}
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {t("dashboard.category")}
              </label>
              <select
                name="category"
                value={
                  editingCar ? editingCar.category : newCar.category || "Sedan"
                }
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {t("dashboard.condition")}
              </label>
              <select
                name="condition"
                value={
                  editingCar ? editingCar.condition : newCar.condition || "New"
                }
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {t("dashboard.transmission")}
              </label>
              <select
                name="transmission"
                value={
                  editingCar
                    ? editingCar.transmission
                    : newCar.transmission || "Automatic"
                }
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {transmissions.map((trans) => (
                  <option key={trans} value={trans}>
                    {trans}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {t("dashboard.fuelType")}
              </label>
              <select
                name="fuelType"
                value={
                  editingCar ? editingCar.fuelType : newCar.fuelType || "Petrol"
                }
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {fuelTypes.map((fuel) => (
                  <option key={fuel} value={fuel}>
                    {fuel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {t("dashboard.mileage")} (km)
              </label>
              <input
                type="number"
                name="mileage"
                value={editingCar ? editingCar.mileage : newCar.mileage || 0}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {t("dashboard.color")}
              </label>
              <input
                type="text"
                name="color"
                value={editingCar ? editingCar.color || "" : newCar.color || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
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
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {t("dashboard.cylinders")}
              </label>
              <input
                type="number"
                name="cylinders"
                value={
                  editingCar ? editingCar.cylinders : newCar.cylinders || 4
                }
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {t("dashboard.doors")}
              </label>
              <input
                type="number"
                name="doors"
                value={editingCar ? editingCar.doors : newCar.doors || 4}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
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
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
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
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
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

          <div className="mt-6 flex justify-end space-x-3">
            {editingCar && (
              <button
                type="button"
                onClick={() => setEditingCar(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
              >
                <X size={18} className="inline mr-1" />
                {t("dashboard.cancel")}
              </button>
            )}

            <button
              type="button"
              onClick={editingCar ? handleUpdateCar : handleAddCar}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingCar ? (
                <>
                  <Save size={18} className="inline mr-1" />
                  {t("dashboard.updateCar")}
                </>
              ) : (
                <>
                  <Plus size={18} className="inline mr-1" />
                  {t("dashboard.addCar")}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Cars List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">
            {t("dashboard.carList")}
          </h2>

          {cars.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {t("dashboard.noCarsFound")}
            </div>
          ) : (
            <div className="space-y-4">
              {cars.map((car) => (
                <div
                  key={car._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      {car.images?.length > 0 ? (
                        <img
                          src={
                            car.images?.[0]
                              ? `${import.meta.env.VITE_API_URL}${
                                  car.images[0]
                                }`
                              : "/images/default-car.jpg"
                          }
                          alt={`${car.brand} ${car.model}`}
                          className="h-16 w-16 object-cover rounded-md"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/default-car.jpg";
                          }}
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            No Image
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium">
                          {car.brand} {car.model} ({car.year})
                        </h3>
                        <p className="text-sm text-gray-600">
                          {car.category} • {car.condition} • CHF{" "}
                          {car.price.toLocaleString()}
                        </p>
                        {car.isFeatured && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
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
