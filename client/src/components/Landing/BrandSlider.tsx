import React from "react";
import { useLanguage } from "../../hooks/useLanguage";
import toyota from "../../assets/brands/toyota.png";
import porsche from "../../assets/brands/porsche.png";
import audi from "../../assets/brands/audi.png";
import bmw from "../../assets/brands/bmw.png";
import ford from "../../assets/brands/ford.png";
import nissan from "../../assets/brands/nissan.png";
import peugeot from "../../assets/brands/peugeot.png";
import volkswagen from "../../assets/brands/volkswagen.png";

const BrandSlider: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const brands = [
    { name: "Toyota", logo: toyota },
    { name: "Porsche", logo: porsche },
    { name: "Audi", logo: audi },
    { name: "BMW", logo: bmw },
    { name: "Ford", logo: ford },
    { name: "Nissan", logo: nissan },
    { name: "Peugeot", logo: peugeot },
    { name: "Volkswagen", logo: volkswagen },
  ];

  return (
    <div className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2
          className={`text-2xl font-bold mb-8 text-center ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
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
