import React, { useState, useEffect } from "react";
import Carousel from "./Carousel";
import CarFilters from "./CarFilters";
import BrandSlider from "./BrandSlider";
import CarDetails from "./CarDetails";
import ImageSlider from "./ImageSlider";
import { useLanguage } from "../../hooks/useLanguage";
import { Car, SliderImage, SliderSettings } from "../../types";
import { RefreshCw } from "lucide-react";
import hero from "../../assets/hero.jpg";
import { getPlaceholderImage } from "../../utils/placeholders";

interface LandingPageProps {
  onCarSelect?: (car: Car) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onCarSelect }) => {
  const { t, isRTL } = useLanguage();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [sliderImages, setSliderImages] = useState<string[]>([]);
  const [sliderSettings, setSliderSettings] = useState<SliderSettings>({
    autoplay: true,
    autoplayDelay: 5000,
    loop: true,
    navigation: true,
    pagination: true,
    effect: "slide",
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/cars`
        );
        const data = await response.json();
        if (data.success) {
          setCars(data.data);
          setFilteredCars(data.data);
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    const fetchSliderImages = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/slider-images`
        );
        const data = await response.json();

        if (data.success) {
          // Ensure absolute URLs
          setSliderImages(
            data.data.map((img: SliderImage) =>
              img.imageUrl.startsWith("http")
                ? img.imageUrl
                : `${import.meta.env.VITE_API_URL}${img.imageUrl}`
            )
          );
        } else {
          setSliderImages([]);
        }
      } catch (error) {
        console.error("Error fetching slider images:", error);
        setSliderImages([
          getPlaceholderImage(1200, 400, t("landing.sliderImage1")),
          getPlaceholderImage(1200, 400, t("landing.sliderImage2")),
          getPlaceholderImage(1200, 400, t("landing.sliderImage3")),
        ]);
      }
    };

    fetchSliderImages();
  }, [t]);

  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/slider-images/settings`
        );
        const data = await response.json();
        if (data.success) {
          setSliderSettings(data.data);
        }
      } catch (error) {
        console.error("Error fetching slider settings:", error);
        // Use default settings if API fails
        setSliderSettings({
          autoplay: true,
          autoplayDelay: 5000,
          loop: true,
          navigation: true,
          pagination: true,
          effect: "slide",
        });
      }
    };

    fetchSliderData();
  }, []);

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
        (car) => (car.transmission || "Automatic") === filters.transmission
      );
    }

    if (filters.fuelType) {
      results = results.filter(
        (car) => (car.fuelType || "Petrol") === filters.fuelType
      );
    }

    if (filters.condition) {
      results = results.filter(
        (car) => (car.condition || "New") === filters.condition
      );
    }

    if (filters.category) {
      results = results.filter(
        (car) => (car.category || "Sedan") === filters.category
      );
    }

    if (filters.bodyType) {
      results = results.filter((car) => car.bodyType === filters.bodyType);
    }

    setFilteredCars(results.length > 0 ? results : cars);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <RefreshCw className="animate-spin h-10 w-10 text-blue-600 mb-4" />
          <p className="text-gray-600 text-lg">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <div className="relative h-screen max-h-[800px] overflow-hidden">
        {/* Background Image */}
        <img
          src={hero}
          alt="Showcase vehicle"
          className="w-full h-full object-cover absolute top-0 left-0 min-h-[400px]"
        />

        {/* Content */}
        <div
          className={`container mx-auto px-4 h-full flex items-center relative z-10 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              {t("landing.premiumVehicles")} <br />
              <span className="text-blue-400">
                {t("landing.exceptionalValue")}
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              {t("landing.discoverSelection")}
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <CarFilters cars={cars} onFilterChange={handleFilterChange} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {t("landing.featuredVehicles")}
        </h1>

        <Carousel
          cars={filteredCars}
          onCarSelect={(car) => {
            setSelectedCar(car);
            if (onCarSelect) {
              onCarSelect(car);
            }
          }}
        />
      </div>

      {/* Image Slider Section */}
      <div className="relative w-full" style={{ height: "600px" }}>
        <ImageSlider
          images={sliderImages}
          settings={sliderSettings}
          height="h-full"
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
