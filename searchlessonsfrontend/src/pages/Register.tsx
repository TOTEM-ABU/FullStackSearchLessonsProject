import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Phone, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { regionsAPI, type Region } from '../lib/api';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    yearOfBirth: '',
    regionId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [regions, setRegions] = useState<Region[]>([]);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Static list of Uzbekistan regions
  const uzbekistanRegions = [
    { id: '1', name: 'Toshkent shahri' },
    { id: '2', name: 'Toshkent viloyati' },
    { id: '3', name: 'Andijon viloyati' },
    { id: '4', name: 'Buxoro viloyati' },
    { id: '5', name: 'Farg\'ona viloyati' },
    { id: '6', name: 'Jizzax viloyati' },
    { id: '7', name: 'Xorazm viloyati' },
    { id: '8', name: 'Namangan viloyati' },
    { id: '9', name: 'Navoiy viloyati' },
    { id: '10', name: 'Qashqadaryo viloyati' },
    { id: '11', name: 'Qoraqalpog\'iston Respublikasi' },
    { id: '12', name: 'Samarqand viloyati' },
    { id: '13', name: 'Sirdaryo viloyati' },
    { id: '14', name: 'Surxondaryo viloyati' },
  ];

  useEffect(() => {
    // Set the static regions data
    setRegions(uzbekistanRegions);
    
    // Uncomment this code when the backend is ready
    /*
    const fetchRegions = async () => {
      try {
        const response = await regionsAPI.getAll();
        setRegions(response.data.data || uzbekistanRegions);
      } catch (error) {
        console.error('Error fetching regions, using static data instead:', error);
        setRegions(uzbekistanRegions);
      }
    };
    
    fetchRegions();
    */
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Parollar mos kelmadi");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        yearOfBirth: formData.yearOfBirth,
        regionId: formData.regionId || undefined,
      });
      
      // Navigate to OTP verification
      navigate('/verify-otp', { 
        state: { email: formData.email } 
      });
    } catch (error: any) {
      setError(error.response?.data?.message || "Ro'yxatdan o'tishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Ro&apos;yxatdan o&apos;tish</h2>
          <p className="mt-2 text-sm text-gray-600">
            Yoki{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              tizimga kiring
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Ism
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Ismingiz"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Familiya
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Familiyangiz"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email manzil
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Telefon raqam
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="+998 90 123 45 67"
                />
              </div>
            </div>

            <div>
              <label htmlFor="yearOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                Tug'ilgan yili
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="yearOfBirth"
                  name="yearOfBirth"
                  type="date"
                  required
                  value={formData.yearOfBirth}
                  onChange={handleChange}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="regionId" className="block text-sm font-medium text-gray-700 mb-2">
                Hudud
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  id="regionId"
                  name="regionId"
                  value={formData.regionId}
                  onChange={handleChange}
                  className="input-field pl-10"
                >
                  <option value="">Hududni tanlang</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Parol
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10"
                  placeholder="Kamida 6 ta belgi"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Parolni tasdiqlang
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10"
                  placeholder="Parolni qayta kiriting"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Ro&apos;yxatdan o&apos;tish...
                  </div>
                ) : (
                  "Ro'yxatdan o'tish"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Ro&apos;yxatdan o&apos;tish orqali siz{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                foydalanish shartlari
              </Link>{' '}
              va{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                maxfiylik siyosati
              </Link>{' '}
              bilan tanishib chiqasiz
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
