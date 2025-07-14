// components/Landing/CarFilters.tsx
import React, { useState } from "react";

interface CarFiltersProps {
  onFilterChange?: (filters: {
    brand: string;
    price: string;
    transmission: string;
    fuelType: string;
    condition: string;
    category: string;
    bodyType: string;
  }) => void;
}

const CarFilters: React.FC<CarFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    brand: "",
    price: "",
    transmission: "",
    fuelType: "",
    condition: "",
    category: "",
    bodyType: "",
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  const brands = [
    "Toyota",
    "Porsche",
    "Audi",
    "BMW",
    "Ford",
    "Nissan",
    "Peugeot",
    "Volkswagen",
  ];

  const categories = [
    "Sedan",
    "SUV",
    "Sports",
    "Hatchback",
    "Coupe",
    "Convertible",
  ];
  const bodyTypes = ["Berlin", "Station Wagon", "Crossover", "MPV", "Pickup"];
  const conditions = ["New", "Used"];

  return (
    <div className="container mx-auto px-4 -mt-16 relative z-20">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
      >
        {/* First Row - 4 filters */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Brand
          </label>
          <select
            name="brand"
            value={filters.brand}
            onChange={handleFilterChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Price (CHF)
          </label>
          <input
            type="number"
            name="price"
            placeholder="Max price"
            value={filters.price}
            onChange={handleFilterChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Transmission
          </label>
          <select
            name="transmission"
            value={filters.transmission}
            onChange={handleFilterChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
          >
            <option value="">Any</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Fuel Type
          </label>
          <select
            name="fuelType"
            value={filters.fuelType}
            onChange={handleFilterChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
          >
            <option value="">Any Fuel Type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* Second Row - 3 filters + search button */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Condition
          </label>
          <select
            name="condition"
            value={filters.condition}
            onChange={handleFilterChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
          >
            <option value="">Any Condition</option>
            {conditions.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Category
          </label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
          >
            <option value="">Any Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Body Type
          </label>
          <select
            name="bodyType"
            value={filters.bodyType}
            onChange={handleFilterChange}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
          >
            <option value="">Any Body Type</option>
            {bodyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="h-[50px] bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold transition-colors"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default CarFilters;
