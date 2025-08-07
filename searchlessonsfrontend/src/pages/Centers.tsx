import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Phone, Filter, Search } from 'lucide-react';
import { educationalCentersAPI, regionsAPI } from '../lib/api';
import { type EducationalCenter, type Region } from '../lib/api';

const Centers: React.FC = () => {
  const [centers, setCenters] = useState<EducationalCenter[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    regionId: '',
    sortBy: 'createdAt' as 'name' | 'createdAt' | 'phoneNumber',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [centersRes, regionsRes] = await Promise.all([
          educationalCentersAPI.getAll(filters),
          regionsAPI.getAll(),
        ]);

        setCenters(centersRes.data.data || []);
        setRegions(regionsRes.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Ta'lim markazlari
          </h1>
          <p className="text-gray-600">
            Eng yaxshi ta'lim markazlarini toping va tanlang
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Filtrlar</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qidirish
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Markaz nomi..."
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hudud
              </label>
              <select
                value={filters.regionId}
                onChange={(e) => handleFilterChange('regionId', e.target.value)}
                className="input-field"
              >
                <option value="">Barcha hududlar</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tartiblash
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="input-field"
              >
                <option value="createdAt">Yangi qo'shilgan</option>
                <option value="name">Nomi bo'yicha</option>
                <option value="phoneNumber">Telefon raqam</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tartib
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="input-field"
              >
                <option value="desc">Kamayish</option>
                <option value="asc">O'sish</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {centers.map((center) => (
            <div key={center.id} className="card hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <img
                  src={center.image || '/placeholder.jpg'}
                  alt={center.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {center.name}
              </h3>
              
              <div className="space-y-2 mb-4">
                <p className="text-gray-600 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  {center.address}
                </p>
                
                <p className="text-gray-600 flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  {center.phoneNumber}
                </p>
                
                {center.region && (
                  <p className="text-sm text-gray-500">
                    {center.region.name}
                  </p>
                )}
              </div>
              
              {center.averageStar && (
                <div className="flex items-center mb-4">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-600">
                    {center.averageStar.toFixed(1)} yulduz
                  </span>
                </div>
              )}
              
              <Link
                to={`/centers/${center.id}`}
                className="btn-primary w-full text-center"
              >
                Batafsil ma'lumot
              </Link>
            </div>
          ))}
        </div>

        {centers.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MapPin className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Hech qanday markaz topilmadi
            </h3>
            <p className="text-gray-600">
              Filtrlarni o'zgartiring yoki keyinroq qayta urinib ko'ring
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Centers;
