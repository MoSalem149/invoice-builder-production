// components/Landing/CarFilters.tsx
import React, { useState } from "react";
import { Car } from "../../types";

interface CarFiltersProps {
  cars: Car[];
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

const CarFilters: React.FC<CarFiltersProps> = ({ cars, onFilterChange }) => {
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

  // Get unique values from cars data with fallbacks
  const brands = [...new Set(cars.map((car) => car.brand))].filter(Boolean);
  const categories = [
    ...new Set(cars.map((car) => car.category || "Sedan")),
  ].filter(Boolean);
  const conditions = [
    ...new Set(cars.map((car) => car.condition || "New")),
  ].filter(Boolean);
  const transmissions = [
    ...new Set(cars.map((car) => car.transmission || "Automatic")),
  ].filter(Boolean);
  const fuelTypes = [
    ...new Set(cars.map((car) => car.fuelType || "Petrol")),
  ].filter(Boolean);
  const bodyTypes = [...new Set(cars.map((car) => car.bodyType))].filter(
    Boolean
  );

  return (
    <div className="container mx-auto px-4 -mt-16 relative z-20">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
      >
        {/* Brand Filter */}
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

        {/* Price Filter */}
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

        {/* Transmission Filter */}
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
            {transmissions.map((trans) => (
              <option key={trans} value={trans}>
                {trans}
              </option>
            ))}
          </select>
        </div>

        {/* Fuel Type Filter */}
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
            {fuelTypes.map((fuel) => (
              <option key={fuel} value={fuel}>
                {fuel}
              </option>
            ))}
          </select>
        </div>

        {/* Condition Filter */}
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

        {/* Category Filter */}
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

        {/* Body Type Filter */}
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
