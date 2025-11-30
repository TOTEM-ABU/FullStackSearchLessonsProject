import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  // Mock data for enrolled courses - replace with actual data from API
  const enrolledCourses = [
    {
      id: '1',
      name: 'Web Dasturlash',
      center: 'Najot Ta\'lim',
      startDate: '2023-10-15',
      endDate: '2024-04-15',
      progress: 45,
    },
    {
      id: '2',
      name: 'IELTS Preparation',
      center: 'British Council',
      startDate: '2023-11-01',
      endDate: '2024-05-01',
      progress: 20,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Shaxsiy kabinet</h1>
        <p className="mt-1 text-sm text-gray-600">
          Xush kelibsiz, {user?.firstName} {user?.lastName}!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Shaxsiy ma'lumotlar
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-xl font-medium">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h4>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Telefon raqam</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.phoneNumber || 'Kiritilmagan'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Ro'li</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">
                    {user?.role.toLowerCase().replace('_', ' ')}
                  </dd>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to="/profile"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Profilni tahrirlash
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Mening kurslarim
                </h3>
                <Link
                  to="/courses"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Barcha kurslar
                </Link>
              </div>
            </div>
            <div className="border-t border-gray-200">
              {enrolledCourses.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {enrolledCourses.map((course) => (
                    <li key={course.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-blue-600 truncate">
                            {course.name}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            {course.center} • {course.startDate} - {course.endDate}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <Link
                            to={`/my-courses/${course.id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-500"
                          >
                            Ko'rish
                          </Link>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 text-right">
                          {course.progress}% bajarildi
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-12 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Siz hali hech qanday kursga yozilmagansiz
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    O'zingizga kerakli kursni toping va hoziroq ro'yxatdan o'ting.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/courses"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 1 1 0 001.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Kurslarni ko'rish
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
