import React from "react";
import { Link } from "react-router-dom";
import type { Resource } from "../types";

interface CourseCardProps {
  resource: Resource;
}

const CourseCard: React.FC<CourseCardProps> = ({ resource }) => (
  <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
    <div className="aspect-w-16 aspect-h-9">
      <img
        src={resource.image || "/placeholder-resource.jpg"}
        alt={resource.name}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-4 flex flex-col gap-2">
      <Link
        to={`/courses/${resource.id}`}
        className="text-lg font-semibold text-gray-900 hover:text-blue-600"
      >
        {resource.name}
      </Link>
      {resource.ResourceCategory && (
        <span className="inline-block text-xs font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded">
          {resource.ResourceCategory.name}
        </span>
      )}
      <p className="text-sm text-gray-600 line-clamp-2">
        {resource.description}
      </p>
      <div className="mt-auto flex gap-2">
        <Link
          to={`/courses/${resource.id}`}
          className="w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Details
        </Link>
      </div>
    </div>
  </div>
);

export default CourseCard;
