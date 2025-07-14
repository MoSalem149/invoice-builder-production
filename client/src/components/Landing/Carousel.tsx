// components/Landing/Carousel.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Car } from "../../types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  cars: Car[];
  onCarSelect: (car: Car) => void;
}

const Carousel: React.FC<CarouselProps> = ({ cars, onCarSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  const cardsToShow = 3;
  const totalCards = cars?.length || 0;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= totalCards - cardsToShow ? 0 : prevIndex + 1
    );
  }, [totalCards, cardsToShow]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex <= 0 ? totalCards - cardsToShow : prevIndex - 1
    );
  }, [totalCards, cardsToShow]);

  useEffect(() => {
    if (!autoScroll) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoScroll, currentIndex, nextSlide]);

  let visibleCars = [];
  if (totalCards <= cardsToShow) {
    visibleCars = [...cars]; // Show all available cars without duplication
  } else {
    visibleCars = cars.slice(currentIndex, currentIndex + cardsToShow);
    // Handle wrap-around if needed
    if (visibleCars.length < cardsToShow) {
      const remaining = cardsToShow - visibleCars.length;
      visibleCars.push(...cars.slice(0, remaining));
    }
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setAutoScroll(false)}
      onMouseLeave={() => setAutoScroll(true)}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {visibleCars.map((car, index) => (
          <div
            key={`${car._id}-${index}`}
            className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow border border-gray-100"
            onClick={() => onCarSelect(car)}
          >
            <div className="relative pb-[15%] overflow-hidden">
              <img
                src={
                  car.images?.[0]
                    ? `${import.meta.env.VITE_API_URL}${car.images[0]}`
                    : "/images/default-car.jpg"
                }
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/images/default-car.jpg";
                }}
              />
              <div className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                {car.condition}
              </div>
            </div>
            <div className="p-4 pt-2">
              <h3 className="text-lg font-bold">
                {car.brand} {car.model}
              </h3>
              <p className="text-gray-600 text-sm mb-1">{car.year}</p>
              <div className="flex justify-between items-center">
                <p className="text-blue-600 font-bold">
                  CHF {car.price.toLocaleString()}
                </p>
                <div className="flex space-x-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {car.mileage?.toLocaleString() || "0"} km
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {car.transmission || "Automatic"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Previous"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Next"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Carousel;
