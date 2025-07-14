// components/Cars/UpdateCars.tsx
import React, { useState, useEffect } from "react";
import { useNotificationContext } from "../../hooks/useNotificationContext";
import { useLanguage } from "../../hooks/useLanguage";
import { Car } from "../../types";
import { Plus, Trash2, Edit, X, Save } from "lucide-react";
import Loader from "../UI/Loader";

const UpdateCars: React.FC = () => {
  const { t } = useLanguage();
  const { showError, showSuccess } = useNotificationContext();
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [newCar, setNewCar] = useState<Partial<Car>>({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    image: "",
    category: "Sedan",
    condition: "New",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: 0,
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      // In a real app, you would fetch this from your API
      setCars([]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (editingCar) {
      setEditingCar({ ...editingCar, [name]: value });
    } else {
      setNewCar({ ...newCar, [name]: value });
    }
  };

  const handleAddCar = () => {
    if (!newCar.brand || !newCar.model) {
      showError(
        t("notifications.error"),
        t("notifications.fillRequiredFields")
      );
      return;
    }

    const carToAdd: Car = {
      id: Date.now().toString(),
      brand: newCar.brand || "",
      model: newCar.model || "",
      year: newCar.year || new Date().getFullYear(),
      price: newCar.price || 0,
      image: newCar.image || "",
      category: newCar.category || "Sedan",
      condition: newCar.condition || "New",
      transmission: newCar.transmission || "Automatic",
      fuelType: newCar.fuelType || "Petrol",
      mileage: newCar.mileage || 0,
      bodyType: newCar.bodyType || "Berlin",
      color: newCar.color || "",
      engineSize: newCar.engineSize || "",
      cylinders: newCar.cylinders || 4,
      doors: newCar.doors || 4,
      chassisNumber: newCar.chassisNumber || "",
    };

    setCars([...cars, carToAdd]);
    setNewCar({
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      image: "",
      category: "Sedan",
      condition: "New",
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 0,
    });

    showSuccess(t("notifications.success"), t("notifications.carAdded"));
  };

  const handleUpdateCar = () => {
    if (!editingCar) return;

    setCars(cars.map((car) => (car.id === editingCar.id ? editingCar : car)));
    setEditingCar(null);

    showSuccess(t("notifications.success"), t("notifications.carUpdated"));
  };

  const handleDeleteCar = (id: string) => {
    setCars(cars.filter((car) => car.id !== id));
    showSuccess(t("notifications.success"), t("notifications.carDeleted"));
  };

  const categories = [
    "Sedan",
    "SUV",
    "Sports",
    "Hatchback",
    "Coupe",
    "Convertible",
  ];
  const conditions = ["New", "Used"];
  const transmissions = ["Automatic", "Manual"];
  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];
  const bodyTypes = ["Berlin", "Station Wagon", "Crossover", "MPV", "Pickup"];

  if (isLoading) {
    return <Loader fullScreen size="xl" />;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-14">
      <h1 className="text-3xl font-bold mb-8">
        {t("dashboard.updateCarData")}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add/Edit Car Form */}
        <div className="bg-white rounded-xl shadow-md p-6">
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
                className="w-full p-2 border border-gray-300 rounded-md"
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
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {t("dashboard.year")}
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
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {t("dashboard.price")} (CHF)
              </label>
              <input
                type="number"
                name="price"
                value={editingCar ? editingCar.price : newCar.price || 0}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {t("dashboard.imageUrl")}
              </label>
              <input
                type="text"
                name="image"
                value={editingCar ? editingCar.image : newCar.image || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
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
                className="w-full p-2 border border-gray-300 rounded-md"
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
                className="w-full p-2 border border-gray-300 rounded-md"
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
                className="w-full p-2 border border-gray-300 rounded-md"
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
                className="w-full p-2 border border-gray-300 rounded-md"
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
                {t("dashboard.bodyType")}
              </label>
              <select
                name="bodyType"
                value={
                  editingCar ? editingCar.bodyType : newCar.bodyType || "Berlin"
                }
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {bodyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
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
                className="w-full p-2 border border-gray-300 rounded-md"
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
                className="w-full p-2 border border-gray-300 rounded-md"
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
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {t("dashboard.chassisNumber")}
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
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            {editingCar && (
              <button
                onClick={() => setEditingCar(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                <X size={18} className="inline mr-1" />
                {t("dashboard.cancel")}
              </button>
            )}

            <button
              onClick={editingCar ? handleUpdateCar : handleAddCar}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
        <div className="bg-white rounded-xl shadow-md p-6">
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
                  key={car.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {car.brand} {car.model} ({car.year})
                      </h3>
                      <p className="text-sm text-gray-600">
                        {car.category} • {car.condition} • CHF{" "}
                        {car.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingCar(car)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title={t("dashboard.edit")}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCar(car.id)}
                        className="p-1 text-red-600 hover:text-red-800"
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
