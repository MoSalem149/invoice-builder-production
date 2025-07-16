// components/Landing/BrandSlider.tsx
import React from "react";
import { useLanguage } from "../../hooks/useLanguage";

const BrandSlider: React.FC = () => {
  const { t } = useLanguage();
  const brands = [
    { name: "Toyota", logo: "/images/brands/toyota.png" },
    { name: "Porsche", logo: "/images/brands/porsche.png" },
    { name: "Audi", logo: "/images/brands/audi.png" },
    { name: "BMW", logo: "/images/brands/bmw.png" },
    { name: "Ford", logo: "/images/brands/ford.png" },
    { name: "Nissan", logo: "/images/brands/nissan.png" },
    { name: "Peugeot", logo: "/images/brands/peugeot.png" },
    { name: "Volkswagen", logo: "/images/brands/volkswagen.png" },
  ];

  return (
    <div className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">
          {t("brandSlider.ourPartners")}
        </h2>
        <div className="relative overflow-hidden">
          <div className="flex">
            <div className="flex space-x-16 animate-marquee whitespace-nowrap items-center">
              {brands.map((brand, index) => (
                <div key={index} className="flex-shrink-0 px-4">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-20 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              ))}
              {/* Duplicate for seamless looping */}
              {brands.map((brand, index) => (
                <div key={`duplicate-${index}`} className="flex-shrink-0 px-4">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-20 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandSlider;
