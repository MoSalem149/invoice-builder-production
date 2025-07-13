// components/Landing/Carousel.tsx
import React, { useState, useEffect } from "react";
import { Car } from "../../types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  cars: Car[];
  onCarSelect: (car: Car) => void;
}

const Carousel: React.FC<CarouselProps> = ({ cars, onCarSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  // Number of cards to show at once
  const cardsToShow = 3;
  const totalCards = cars.length;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= totalCards - cardsToShow ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex <= 0 ? totalCards - cardsToShow : prevIndex - 1
    );
  };

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScroll) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoScroll, currentIndex]);

  // Determine which cards to display
  const visibleCars = [];
  for (let i = 0; i < cardsToShow; i++) {
    const index = (currentIndex + i) % totalCards;
    visibleCars.push(cars[index]);
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setAutoScroll(false)}
      onMouseLeave={() => setAutoScroll(true)}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {visibleCars.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow border border-gray-100"
            onClick={() => onCarSelect(car)}
          >
            <div className="relative pb-[75%] overflow-hidden">
              <img
                src={car.image}
                alt={`${car.brand} ${car.model}`}
                className="absolute top-0 left-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300 min-h-[200px]"
              />
              <div className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                {car.condition}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold">
                {car.brand} {car.model}
              </h3>
              <p className="text-gray-600 text-sm mb-2">{car.year}</p>
              <div className="flex justify-between items-center">
                <p className="text-blue-600 font-bold">
                  CHF {car.price.toLocaleString()}
                </p>
                <div className="flex space-x-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {car.mileage.toLocaleString()} km
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {car.transmission}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
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
