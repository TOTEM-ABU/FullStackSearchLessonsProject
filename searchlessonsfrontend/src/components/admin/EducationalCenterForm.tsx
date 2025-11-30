import React, { useState, useEffect } from "react";
import { regionsAPI } from "../../services/api";
import {
  type EducationalCenter,
  type Region,
  type CreateEducationalCenterRequest,
} from "../../types";
import FileUpload from "./FileUpload";
import {
  X,
  Building,
  MapPin,
  Phone,
  Image as ImageIcon,
  Save,
  Loader,
} from "lucide-react";

interface EducationalCenterFormProps {
  center?: EducationalCenter | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (centerData: CreateEducationalCenterRequest) => Promise<void>;
  title: string;
}

const EducationalCenterForm: React.FC<EducationalCenterFormProps> = ({
  center,
  isOpen,
  onClose,
  onSubmit,
  title,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    regionId: "",
    image: "",
  });

  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      loadRegions();
      if (center) {
        setFormData({
          name: center.name || "",
          address: center.address || "",
          phoneNumber: center.phoneNumber || "",
          regionId: center.regionId || "",
          image: center.image || "",
        });
      } else {
        setFormData({
          name: "",
          address: "",
          phoneNumber: "",
          regionId: "",
          image: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, center]);

  const loadRegions = async () => {
    try {
      const response = await regionsAPI.getRegions({ limit: 1000 });
      setRegions(response.data);
    } catch (error) {
      console.error("Failed to load regions:", error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Markaz nomi kiritish majburiy";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Manzil kiritish majburiy";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Telefon raqam kiritish majburiy";
    }

    if (!formData.regionId) {
      newErrors.regionId = "Mintaqa tanlash majburiy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error: unknown) {
      console.error("Form submission failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Xatolik yuz berdi";
      setErrors({
        submit: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      image: imageUrl,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="ml-3 text-lg leading-6 font-medium text-gray-900">
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Building className="inline h-4 w-4 mr-1" />
                  Markaz nomi *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Ta'lim markazi nomini kiriting"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Manzil *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.address ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="To'liq manzilni kiriting"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Telefon raqam *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.phoneNumber ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="+998901234567"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Mintaqa *
                  </label>
                  <select
                    name="regionId"
                    value={formData.regionId}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.regionId ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">Mintaqani tanlang</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                  {errors.regionId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.regionId}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="inline h-4 w-4 mr-1" />
                  Markaz rasmi
                </label>
                <FileUpload
                  accept="image/*"
                  maxFileSize={5}
                  onFileUpload={handleImageUpload}
                  existingFiles={formData.image ? [formData.image] : []}
                  className="mt-2"
                />
                {formData.image && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Joriy rasm:</p>
                    <img
                      src={formData.image}
                      alt="Center preview"
                      className="h-32 w-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="animate-spin h-4 w-4 mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalCenterForm;
