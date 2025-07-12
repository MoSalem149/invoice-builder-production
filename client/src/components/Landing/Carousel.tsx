// components/Landing/Carousel.tsx
import React from "react";
import { Car } from "../../types";

interface CarouselProps {
  cars: Car[];
  onCarSelect: (car: Car) => void;
}

const Carousel: React.FC<CarouselProps> = ({ cars, onCarSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <div
          key={car.id}
          className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onCarSelect(car)}
        >
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">
              {car.brand} {car.model} ({car.year})
            </h3>
            <p className="text-gray-600">${car.price.toLocaleString()}</p>
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>{car.mileage.toLocaleString()} km</span>
              <span>{car.transmission}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Carousel;
