// components/Landing/LandingPage.tsx
import React, { useState } from "react";
import Carousel from "./Carousel";
import CarFilters from "./CarFilters";
import BrandSlider from "./BrandSlider";
import CarDetails from "./CarDetails";
import { Car } from "../../types";

interface LandingPageProps {
  onCarSelect?: (car: Car) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onCarSelect }) => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);

  const cars: Car[] = [
    {
      id: "1",
      brand: "Toyota",
      model: "Corolla",
      year: 2022,
      price: 25000,
      image: "/images/cars/car1.jpg",
      category: "Sedan",
      bodyType: "Berlin",
      condition: "New",
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 0,
      color: "Red",
      engineSize: "2.0L",
      cylinders: 4,
      doors: 4,
      chassisNumber: "JT2BF22K6W0123456",
    },
    {
      id: "2",
      brand: "Porsche",
      model: "911 Carrera",
      year: 2021,
      price: 120000,
      image: "/images/cars/car2.jpg",
      category: "Sports",
      bodyType: "Coupe",
      condition: "Used",
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 12000,
      color: "Silver",
      engineSize: "3.0L",
      cylinders: 6,
      doors: 2,
      chassisNumber: "WP0ZZZ99ZTS392124",
    },
    {
      id: "3",
      brand: "Audi",
      model: "Q5",
      year: 2023,
      price: 45000,
      image: "/images/cars/car3.jpg",
      category: "SUV",
      bodyType: "Crossover",
      condition: "New",
      transmission: "Automatic",
      fuelType: "Diesel",
      mileage: 0,
      color: "Black",
      engineSize: "2.0L",
      cylinders: 4,
      doors: 5,
      chassisNumber: "WA1ANAFY0N2009876",
    },
    {
      id: "4",
      brand: "BMW",
      model: "X5",
      year: 2022,
      price: 65000,
      image: "/images/cars/car4.jpg",
      category: "SUV",
      bodyType: "SUV",
      condition: "Used",
      transmission: "Automatic",
      fuelType: "Hybrid",
      mileage: 15000,
      color: "White",
      engineSize: "3.0L",
      cylinders: 6,
      doors: 5,
      chassisNumber: "5UXCR6C05N9X54321",
    },
    {
      id: "5",
      brand: "Ford",
      model: "Mustang",
      year: 2023,
      price: 55000,
      image: "/images/cars/car5.jpg",
      category: "Sports",
      bodyType: "Coupe",
      condition: "New",
      transmission: "Manual",
      fuelType: "Petrol",
      mileage: 0,
      color: "Blue",
      engineSize: "5.0L",
      cylinders: 8,
      doors: 2,
      chassisNumber: "1FA6P8CF5M5101234",
    },
    {
      id: "6",
      brand: "Nissan",
      model: "Qashqai",
      year: 2022,
      price: 35000,
      image: "/images/cars/car6.jpg",
      category: "SUV",
      bodyType: "Crossover",
      condition: "New",
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 0,
      color: "Gray",
      engineSize: "1.3L",
      cylinders: 4,
      doors: 5,
      chassisNumber: "SJNFEAJ11U7023456",
    },
  ];

  const handleFilterChange = (filters: {
    brand: string;
    price: string;
    transmission: string;
    fuelType: string;
    condition: string;
    category: string;
    bodyType: string;
  }) => {
    let results = [...cars];

    if (filters.brand) {
      results = results.filter((car) => car.brand === filters.brand);
    }

    if (filters.price) {
      results = results.filter((car) => car.price <= Number(filters.price));
    }

    if (filters.transmission) {
      results = results.filter(
        (car) => car.transmission === filters.transmission
      );
    }

    if (filters.fuelType) {
      results = results.filter((car) => car.fuelType === filters.fuelType);
    }

    if (filters.condition) {
      results = results.filter((car) => car.condition === filters.condition);
    }

    if (filters.category) {
      results = results.filter((car) => car.category === filters.category);
    }

    if (filters.bodyType) {
      results = results.filter((car) => car.bodyType === filters.bodyType);
    }

    setFilteredCars(results.length > 0 ? results : cars);
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-screen max-h-[800px] overflow-hidden">
        {/* Background Image */}
        <img
          src="/images/hero.jpg"
          alt="Showcase vehicle"
          className="w-full h-full object-cover absolute top-0 left-0 min-h-[400px]"
        />

        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Premium Vehicles <br />
              <span className="text-blue-400">Exceptional Value</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Discover Switzerland's finest selection of luxury and performance
              vehicles
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <CarFilters onFilterChange={handleFilterChange} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Featured Vehicles
        </h1>

        <Carousel
          cars={filteredCars.length > 0 ? filteredCars : cars}
          onCarSelect={(car) => {
            setSelectedCar(car);
            if (onCarSelect) {
              onCarSelect(car);
            }
          }}
        />
      </div>

      <BrandSlider />

      {/* Car Details Modal */}
      {selectedCar && (
        <CarDetails car={selectedCar} onClose={() => setSelectedCar(null)} />
      )}
    </div>
  );
};

export default LandingPage;
