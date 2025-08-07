import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Filter, Play, Download } from 'lucide-react';
import { resourcesAPI } from '../lib/api';
import { type Resource } from '../lib/api';

const Resources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    sortBy: 'name' as 'name' | 'createdAt',
    sortOrder: 'asc' as 'asc' | 'desc',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await resourcesAPI.getAll(filters);
        setResources(response.data.data || []);
      } catch (error) {
        console.error('Error fetching resources:', error);
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

  const getFileType = (media: string) => {
    if (media.includes('.pdf')) return 'PDF';
    if (media.includes('.doc') || media.includes('.docx')) return 'Word';
    if (media.includes('.mp4') || media.includes('.avi')) return 'Video';
    if (media.includes('.mp3')) return 'Audio';
    return 'File';
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
            Ta'lim resurslari
          </h1>
          <p className="text-gray-600">
            Foydali ta'lim materiallari va hujjatlar
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qidirish
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Resurs nomi..."
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  className="input-field pl-10"
                />
              </div>
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
                <option value="name">Nomi bo'yicha</option>
                <option value="createdAt">Yangi qo'shilgan</option>
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
                <option value="asc">O'sish</option>
                <option value="desc">Kamayish</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className="card hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <img
                  src={resource.image || '/placeholder.jpg'}
                  alt={resource.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {resource.name}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {resource.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {getFileType(resource.media)}
                </span>
                
                {resource.resourceCategory && (
                  <span className="text-sm text-gray-500">
                    {resource.resourceCategory.name}
                  </span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <a
                  href={resource.media}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn-secondary text-center flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Yuklab olish
                </a>
                
                {resource.media.includes('.mp4') && (
                  <button className="btn-primary flex items-center">
                    <Play className="h-4 w-4 mr-2" />
                    Ko'rish
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {resources.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Hech qanday resurs topilmadi
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

export default Resources;
