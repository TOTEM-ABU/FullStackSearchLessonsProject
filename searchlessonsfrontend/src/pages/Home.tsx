import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, BookOpen, Users, Award } from 'lucide-react';
import { educationalCentersAPI, subjectsAPI, regionsAPI } from '../lib/api';
import type { EducationalCenter, Subject, Region } from '../lib/api';

const Home: React.FC = () => {
  const [centers, setCenters] = useState<EducationalCenter[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [centersRes, subjectsRes, regionsRes] = await Promise.all([
          educationalCentersAPI.getAll({ limit: 6 }),
          subjectsAPI.getAll({ limit: 6 }),
          regionsAPI.getAll(),
        ]);

        setCenters(centersRes.data.data || []);
        setSubjects(subjectsRes.data.data || []);
        setRegions(regionsRes.data.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Ta'lim markazlarini toping
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Eng yaxshi ta'lim markazlari va o'qituvchilar bir joyda
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ta'lim markazi, fan yoki hudud..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md transition-colors"
                >
                  Qidirish
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">100+</h3>
              <p className="text-gray-600">Ta'lim markazi</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">50+</h3>
              <p className="text-gray-600">Fan va yo'nalish</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">1000+</h3>
              <p className="text-gray-600">Mamnun foydalanuvchi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Centers Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Mashhur ta'lim markazlari</h2>
            <Link
              to="/centers"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Barchasini ko'rish →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centers.map((center) => (
              <div key={center.id} className="card hover:shadow-md transition-shadow">
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
                <p className="text-gray-600 mb-3 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {center.address}
                </p>
                {center.averageStar && (
                  <div className="flex items-center mb-3">
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
                  Batafsil
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Fanlar va yo'nalishlar</h2>
            <Link
              to="/subjects"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Barchasini ko'rish →
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {subjects.map((subject) => (
              <Link
                key={subject.id}
                to={`/subjects/${subject.id}`}
                className="group"
              >
                <div className="text-center p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                  <div className="w-16 h-16 mx-auto mb-3 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <BookOpen className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-primary-600">
                    {subject.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nima uchun SearchLessons?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Eng yaxshi ta'lim markazlarini topish va tanlash uchun barcha kerakli ma'lumotlar
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Oson qidirish
              </h3>
              <p className="text-gray-600">
                Hudud, fan yoki markaz nomi bo'yicha tez qidirish
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Reytinglar va izohlar
              </h3>
              <p className="text-gray-600">
                Haqiqiy foydalanuvchilar reytinglari va izohlari
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ishonchli ma'lumotlar
              </h3>
              <p className="text-gray-600">
                Barcha ma'lumotlar tekshirilgan va yangilangan
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
