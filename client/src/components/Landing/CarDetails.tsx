// components/Landing/CarDetails.tsx
import React, { useState } from "react";
import { Car } from "../../types";
import { X } from "lucide-react";

interface CarDetailsProps {
  car: Car;
  onClose: () => void;
}

const CarDetails: React.FC<CarDetailsProps> = ({ car, onClose }) => {
  const [showContact, setShowContact] = useState(false);

  const handleContactClick = () => {
    setShowContact(true);
  };

  const handleCloseContact = () => {
    setShowContact(false);
  };

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
            <div className="relative h-64 w-full bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={
                  car.images?.[0]
                    ? `${import.meta.env.VITE_API_URL}${car.images[0]}`
                    : "/images/default-car.jpg"
                }
                alt={`${car.brand} ${car.model}`}
                className="absolute inset-0 w-full h-full object-contain"
                crossOrigin="anonymous"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/images/default-car.jpg";
                }}
              />
            </div>
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
                <p className="font-medium">
                  {car.mileage?.toLocaleString() || "N/A"} km
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Color</p>
                <p className="font-medium">{car.color || "N/A"}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Engine Size</p>
                <p className="font-medium">{car.engineSize || "N/A"}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Cylinders</p>
                <p className="font-medium">{car.cylinders || "N/A"}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Doors</p>
                <p className="font-medium">{car.doors || "N/A"}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Chassis Number</p>
                <p className="font-medium">{car.chassisNumber || "N/A"}</p>
              </div>
              {car.bodyType && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Body Type</p>
                  <p className="font-medium">{car.bodyType}</p>
                </div>
              )}
            </div>

            {car.description && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Description
                </h4>
                <p className="text-gray-700">{car.description}</p>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={handleContactClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Modal */}
      {showContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Get in Touch</h3>
              <button
                onClick={handleCloseContact}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Address</h4>
                <p>Via S.Gottardo 100, 6596 Gordola, Switzerland</p>
              </div>

              <div>
                <h4 className="font-semibold">Phone</h4>
                <p>+41 91 929 29 29</p>
              </div>

              <div>
                <h4 className="font-semibold">Email</h4>
                <p>info@saidauto.ch</p>
              </div>

              <div>
                <h4 className="font-semibold">Business Hours</h4>
                <p>Monday-Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 9:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleCloseContact}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetails;
