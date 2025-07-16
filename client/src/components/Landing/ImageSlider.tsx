import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Swiper from "swiper";
import {
  Autoplay,
  Navigation,
  Pagination,
  EffectFade,
  EffectCube,
  EffectCoverflow,
  EffectFlip,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/effect-cube";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-flip";
import { useLanguage } from "../../hooks/useLanguage";
import { getPlaceholderImage } from "../../utils/placeholders";

type SwiperModule =
  | typeof Autoplay
  | typeof Navigation
  | typeof Pagination
  | typeof EffectFade
  | typeof EffectCube
  | typeof EffectCoverflow
  | typeof EffectFlip;

type SwiperParams = {
  modules?: SwiperModule[];
  slidesPerView?: number | "auto";
  spaceBetween?: number;
  loop?: boolean;
  navigation?:
    | {
        nextEl: string;
        prevEl: string;
      }
    | boolean;
  pagination?:
    | {
        el: string;
        clickable: boolean;
      }
    | boolean;
  effect?: "slide" | "fade" | "cube" | "coverflow" | "flip";
  autoplay?: {
    delay: number;
    disableOnInteraction: boolean;
  };
};

const swiperModules: SwiperModule[] = [
  Autoplay,
  Navigation,
  Pagination,
  EffectFade,
  EffectCube,
  EffectCoverflow,
  EffectFlip,
];

interface ImageSliderProps {
  images: string[];
  height?: string;
  settings?: {
    sliderType?: string;
    slidesPerView?: number;
    spaceBetween?: number;
    autoplay?: boolean;
    autoplayDelay?: number;
    loop?: boolean;
    navigation?: boolean;
    pagination?: boolean;
    effect?: "slide" | "fade" | "cube" | "coverflow" | "flip";
  };
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  height = "h-[400px]",
  settings = {},
}) => {
  const swiperRef = useRef<Swiper | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(settings.autoplay ?? true);
  const { t } = useLanguage();
  const [errorImages, setErrorImages] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!sliderRef.current || images.length === 0) return;

    const swiperParams: SwiperParams = {
      modules: swiperModules,
      slidesPerView: 1,
      spaceBetween: 0,
      loop: settings.loop ?? true,
      navigation: settings.navigation
        ? {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }
        : false,
      pagination: settings.pagination
        ? {
            el: ".swiper-pagination",
            clickable: true,
          }
        : false,
      effect: settings.effect ?? "slide",
    };

    if (settings.autoplay) {
      swiperParams.autoplay = {
        delay: settings.autoplayDelay ?? 5000,
        disableOnInteraction: false,
      };
    }

    swiperRef.current = new Swiper(sliderRef.current, swiperParams);

    return () => {
      swiperRef.current?.destroy();
    };
  }, [images, settings]);

  useEffect(() => {
    if (!swiperRef.current || !settings.autoplay) return;

    if (autoScroll) {
      swiperRef.current.autoplay?.start();
    } else {
      swiperRef.current.autoplay?.stop();
    }
  }, [autoScroll, settings.autoplay]);

  const nextSlide = () => {
    swiperRef.current?.slideNext();
  };

  const prevSlide = () => {
    swiperRef.current?.slidePrev();
  };

  const handleImageError = (index: number) => {
    setErrorImages((prev) => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
  };

  if (images.length === 0) {
    const placeholderUrl = getPlaceholderImage(
      1200,
      800,
      t("imageSlider.noImages")
    );
    return (
      <div
        className={`relative w-full ${height} bg-gray-100 flex items-center justify-center`}
      >
        <img
          src={placeholderUrl}
          alt={t("imageSlider.noImages")}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${height} overflow-hidden`}
      onMouseEnter={() => setAutoScroll(false)}
      onMouseLeave={() => setAutoScroll(true)}
      ref={sliderRef}
    >
      <div className="swiper-wrapper h-full w-full">
        {images.map((image, index) => {
          const isError = errorImages.has(index);
          const imageUrl = isError
            ? getPlaceholderImage(1200, 400, t("imageSlider.imageLoadError"))
            : image;

          return (
            <div key={index} className="swiper-slide h-full w-full">
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt={`Slider image ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={() => handleImageError(index)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {settings.navigation && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {settings.pagination && (
        <div className="swiper-pagination absolute bottom-2 left-0 right-0 flex justify-center space-x-2 z-10"></div>
      )}
    </div>
  );
};

export default ImageSlider;
