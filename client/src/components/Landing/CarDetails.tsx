import React from "react";
import { Car } from "../../types";
import { X } from "lucide-react";

interface CarDetailsProps {
  car: Car;
  onClose: () => void;
}

const CarDetails: React.FC<CarDetailsProps> = ({ car, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {car.brand} {car.model} ({car.year})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full min-h-[300px] object-cover"
            />
          </div>

          <div className="p-6 md:w-1/2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  CHF {car.price.toLocaleString()}
                </p>
                <p className="text-gray-500">{car.condition}</p>
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {car.category}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Transmission</p>
                <p className="font-medium">{car.transmission}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Fuel Type</p>
                <p className="font-medium">{car.fuelType}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Mileage</p>
                <p className="font-medium">{car.mileage.toLocaleString()} km</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Color</p>
                <p className="font-medium">{car.color || "N/A"}</p>
              </div>
              {car.engineSize && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Engine Size</p>
                  <p className="font-medium">{car.engineSize}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
