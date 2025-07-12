// components/Landing/LandingPage.tsx
import React from "react";
import Carousel from "./Carousel";
import CarFilters from "./CarFilters";
import { Car } from "../../types";

interface LandingPageProps {
  onCarSelect: (car: Car) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onCarSelect }) => {
  const cars: Car[] = [
    {
      id: "1",
      brand: "Toyota",
      model: "Corolla",
      year: 2022,
      price: 25000,
      image: "/images/car1.jpg",
      category: "Sedan",
      condition: "New",
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 0,
      color: "Red",
      engineSize: "2.0L",
    },
    // Add more cars...
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Fleet</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <CarFilters />
        </div>

        <div className="w-full md:w-3/4">
          <Carousel cars={cars} onCarSelect={onCarSelect} />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
