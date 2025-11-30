import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface EnrolledCourse {
  id: string;
  name: string;
  centerName: string;
  startDate: string;
  endDate: string;
  progress: number;
  nextLesson?: {
    date: string;
    time: string;
    topic: string;
  };
}

const MyCourses: React.FC = () => {
  const { user } = useAuth();

  // Mock data for enrolled courses - replace with actual API call
  const enrolledCourses: EnrolledCourse[] = [
    {
      id: '1',
      name: 'Web Dasturlash',
      centerName: 'Najot Ta\'lim',
      startDate: '2023-10-15',
      endDate: '2024-04-15',
      progress: 45,
      nextLesson: {
        date: '2023-11-20',
        time: '18:00',
        topic: 'React Hooks va State Management'
      }
    },
    {
      id: '2',
      name: 'IELTS Preparation',
      centerName: 'British Council',
      startDate: '2023-11-01',
      endDate: '2024-05-01',
      progress: 20,
      nextLesson: {
        date: '2023-11-21',
        time: '17:00',
        topic: 'Writing Task 2: Essay Structure'
      }
    },
  ];

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Kurslaringizni ko'rish uchun tizimga kiring</h2>
        <Link
          to="/auth/login"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Kirish
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mening kurslarim</h1>
        <p className="mt-1 text-sm text-gray-600">
          Siz yozilgan barcha kurslaringiz va ularning holati
        </p>
      </div>

      {enrolledCourses.length > 0 ? (
        <div className="space-y-6">
          {enrolledCourses.map((course) => (
            <div key={course.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {course.name}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {course.centerName}
                  </p>
                </div>
                <span className="px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
                  {course.progress}% bajarildi
                </span>
              </div>
              <div className="border-t border-gray-200">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Davomiyligi</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
                    </dd>
                  </div>
                  {course.nextLesson && (
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                      <dt className="text-sm font-medium text-gray-500">Keyingi dars</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="font-medium">{course.nextLesson.topic}</div>
                        <div className="text-gray-500">
                          {new Date(course.nextLesson.date).toLocaleDateString()} • {course.nextLesson.time}
                        </div>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
              <div className="px-4 py-4 bg-gray-50 text-right sm:px-6">
                <Link
                  to={`/my-courses/${course.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Kursga o'tish
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
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
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0114 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Siz hali hech qanday kursga yozilmagansiz</h3>
          <p className="mt-1 text-sm text-gray-500">O'zingizga kerakli kursni toping va hoziroq ro'yxatdan o'ting.</p>
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
  );
};

export default MyCourses;
