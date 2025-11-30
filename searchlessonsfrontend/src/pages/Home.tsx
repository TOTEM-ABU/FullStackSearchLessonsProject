import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const features = [
    {
      name: 'Professional o\'qituvchilar',
      description: 'Sertifikatlangan va tajribali o\'qituvchilar',
      icon: '👨‍🏫',
    },
    {
      name: 'Qulay joylashuv',
      description: 'Shaharning qulay joylarida joylashgan',
      icon: '📍',
    },
    {
      name: 'Zamonaviy usullar',
      description: 'Zamonaviy o\'quv dasturlari va usullari',
      icon: '💡',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            <span className="block">Yaxshi ta\'lim -</span>
            <span className="block text-blue-600">Yaxshi kelajak</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-gray-500">
            O\'z kasbingizni yarating yoki yangi ko\'nikmalar o\'rganing.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center gap-3">
            <Link
              to="/centers"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              O\'quv markazlari
            </Link>
            <Link
              to="/courses"
              className="mt-3 sm:mt-0 w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-gray-50"
            >
              Barcha kurslar
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Nega bizni tanlashadi?</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-medium">{feature.name}</h3>
                <p className="mt-2 text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
