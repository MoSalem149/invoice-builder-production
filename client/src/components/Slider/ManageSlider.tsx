import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  Upload,
  Trash2,
  Settings as SettingsIcon,
  RefreshCw,
} from "lucide-react";
import { SliderImage } from "../../types";
import { useLanguage } from "../../hooks/useLanguage";
import { useNotificationContext } from "../../hooks/useNotificationContext";

const ManageSlider: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { state: authState } = useAuth();
  const { showSuccess, showError } = useNotificationContext();
  const [images, setImages] = useState<SliderImage[]>([]);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sliderSettings, setSliderSettings] = useState({
    autoplay: true,
    autoplayDelay: 5000,
    loop: true,
    navigation: true,
    pagination: true,
    effect: "slide",
  });

  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Fetch images
        const imagesResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/slider-images`,
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        const imagesData = await imagesResponse.json();

        // Fetch settings
        const settingsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/slider-images/settings`,
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        const settingsData = await settingsResponse.json();

        if (imagesData.success) {
          setImages(imagesData.data);
        }

        if (settingsData.success) {
          setSliderSettings(settingsData.data);
        }
      } catch (err) {
        console.error("Failed to fetch slider data:", err);
        showError(t("errors.sliderLoadFailed"), t("errors.tryAgainLater"));
      } finally {
        setLoading(false);
      }
    };

    if (authState.isAuthenticated) {
      fetchSliderData();
    }
  }, [authState.isAuthenticated, authState.token, t, showError]);

  if (loading && images.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <RefreshCw className="animate-spin h-10 w-10 text-blue-600 mb-4" />
          <p className="text-gray-600 text-lg">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", newImage);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/slider-images`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setImages([...images, data.data]);
      setNewImage(null);
      showSuccess(t("success.imageUploaded"), t("success.imageAddedToSlider"));
    } catch (err) {
      console.error("Upload error:", err);
      showError(t("errors.uploadFailed"), t("errors.failedToUploadImage"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/slider-images/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Delete failed");

      setImages(images.filter((img) => img._id !== imageId));
      showSuccess(
        t("success.imageDeleted"),
        t("success.imageRemovedFromSlider")
      );
    } catch (err) {
      console.error("Delete error:", err);
      showError(t("errors.deleteFailed"), t("errors.failedToDeleteImage"));
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setSliderSettings({
      ...sliderSettings,
      [name]: type === "number" ? Number(val) : val,
    });
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/slider-images/settings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
          body: JSON.stringify(sliderSettings),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save settings");
      }

      setShowSettings(false);
      showSuccess(
        t("success.settingsSaved"),
        t("success.sliderSettingsUpdated")
      );
    } catch (err) {
      console.error("Settings save error:", err);
      showError(t("errors.saveFailed"), t("errors.failedToSaveSettings"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-14 ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      <div
        className={`flex justify-between items-center mb-6 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <h1 className="text-2xl font-bold">{t("dashboard.manageSlider")}</h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <SettingsIcon className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
          {t("hero.sliderSettings")}
        </button>
      </div>

      {showSettings && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {t("hero.sliderConfiguration")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("hero.sliderType")}
              </label>
              <select
                name="effect"
                value={sliderSettings.effect}
                onChange={handleSettingsChange}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <option value="slide">{t("hero.sliderTypes.default")}</option>
                <option value="fade">{t("hero.fade")}</option>
                <option value="cube">{t("hero.cube")}</option>
                <option value="coverflow">{t("hero.coverflow")}</option>
                <option value="flip">{t("hero.flip")}</option>
              </select>
            </div>

            <div
              className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <input
                type="checkbox"
                name="autoplay"
                checked={sliderSettings.autoplay}
                onChange={handleSettingsChange}
                className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                  isRTL ? "ml-2" : "mr-2"
                }`}
              />
              <label
                className={`block text-sm text-gray-700 ${isRTL ? "mr-2" : ""}`}
              >
                {t("hero.sliderTypes.progress")}
              </label>
            </div>

            <div
              className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <input
                type="checkbox"
                name="loop"
                checked={sliderSettings.loop}
                onChange={handleSettingsChange}
                className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                  isRTL ? "ml-2" : "mr-2"
                }`}
              />
              <label
                className={`block text-sm text-gray-700 ${isRTL ? "mr-2" : ""}`}
              >
                {t("common.loop")}
              </label>
            </div>

            <div
              className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <input
                type="checkbox"
                name="navigation"
                checked={sliderSettings.navigation}
                onChange={handleSettingsChange}
                className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                  isRTL ? "ml-2" : "mr-2"
                }`}
              />
              <label
                className={`block text-sm text-gray-700 ${isRTL ? "mr-2" : ""}`}
              >
                {t("hero.sliderTypes.custom-pagination")}
              </label>
            </div>

            <div
              className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <input
                type="checkbox"
                name="pagination"
                checked={sliderSettings.pagination}
                onChange={handleSettingsChange}
                className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                  isRTL ? "ml-2" : "mr-2"
                }`}
              />
              <label
                className={`block text-sm text-gray-700 ${isRTL ? "mr-2" : ""}`}
              >
                {t("hero.sliderTypes.side-padding")}
              </label>
            </div>

            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-1 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("hero.sliderTypes.vertical")} (ms)
              </label>
              <input
                type="number"
                name="autoplayDelay"
                min="1000"
                max="10000"
                step="500"
                value={sliderSettings.autoplayDelay}
                onChange={handleSettingsChange}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
          </div>

          <div
            className={`mt-6 flex justify-end space-x-3 ${
              isRTL ? "space-x-reverse" : ""
            }`}
          >
            <button
              onClick={() => setShowSettings(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t("common.cancel")}
            </button>
            <button
              onClick={saveSettings}
              disabled={loading}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              {loading ? (
                <RefreshCw
                  className={`animate-spin h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                />
              ) : null}
              <span>{t("hero.saveChanges")}</span>
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2
          className={`text-lg font-semibold mb-4 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t("hero.uploadNewImage")}
        </h2>
        <form onSubmit={handleImageUpload} className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("hero.selectImage")}
            </label>
            <div
              className={`flex items-center ${
                isRTL ? "flex-row-reverse space-x-reverse" : ""
              } space-x-2`}
            >
              <label
                className={`cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-md border-0 text-sm flex items-center ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Upload className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                {t("hero.chooseFile")}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImage(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-500">
                {newImage ? newImage.name : t("hero.noFileChosen")}
              </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={!newImage || loading}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {loading ? (
              <RefreshCw
                className={`animate-spin h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
              />
            ) : (
              <Upload className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            )}
            <span>{t("hero.uploadImage")}</span>
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2
          className={`text-lg font-semibold mb-4 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t("hero.currentSliderImages")}
        </h2>
        {loading && images.length === 0 ? (
          <p className={`text-gray-500 ${isRTL ? "text-right" : "text-left"}`}>
            {t("common.loading")}
          </p>
        ) : images.length === 0 ? (
          <p className={`text-gray-500 ${isRTL ? "text-right" : "text-left"}`}>
            {t("hero.noSliderImages")}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={image._id} className="relative group">
                <img
                  src={image.imageUrl}
                  alt={`Slider image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div
                  className={`absolute top-2 ${
                    isRTL ? "left-2" : "right-2"
                  } flex space-x-2 ${isRTL ? "space-x-reverse" : ""}`}
                >
                  <button
                    onClick={() => handleDeleteImage(image._id)}
                    className="bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div
                  className={`mt-2 text-sm text-gray-600 truncate ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {image.imageUrl.split("/").pop()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSlider;
