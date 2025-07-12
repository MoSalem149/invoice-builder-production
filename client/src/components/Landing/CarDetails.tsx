// components/Landing/CarDetails.tsx
import React from "react";
import { Car } from "../../types";

interface CarDetailsProps {
  car: Car;
  onBack: () => void;
}

const CarDetails: React.FC<CarDetailsProps> = ({ car, onBack }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Back to List
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-auto"
            />
          </div>

          <div className="p-6 md:w-1/2">
            <h2 className="text-2xl font-bold mb-2">
              {car.brand} {car.model} ({car.year})
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold">Price</h3>
                <p>${car.price.toLocaleString()}</p>
              </div>

              <div>
                <h3 className="font-semibold">Category</h3>
                <p>{car.category}</p>
              </div>

              <div>
                <h3 className="font-semibold">Condition</h3>
                <p>{car.condition}</p>
              </div>

              <div>
                <h3 className="font-semibold">Transmission</h3>
                <p>{car.transmission}</p>
              </div>

              <div>
                <h3 className="font-semibold">Fuel Type</h3>
                <p>{car.fuelType}</p>
              </div>

              <div>
                <h3 className="font-semibold">Mileage</h3>
                <p>{car.mileage.toLocaleString()} km</p>
              </div>

              {/* Optional fields - only show if they exist */}
              {car.engineSize && (
                <div>
                  <h3 className="font-semibold">Engine Size</h3>
                  <p>{car.engineSize}</p>
                </div>
              )}

              {car.color && (
                <div>
                  <h3 className="font-semibold">Color</h3>
                  <p>{car.color}</p>
                </div>
              )}
            </div>

            <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
