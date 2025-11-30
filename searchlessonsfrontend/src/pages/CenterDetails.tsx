import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  educationalCentersAPI,
  commentsAPI,
  starsAPI,
  branchesAPI,
} from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import type {
  EducationalCenter,
  CommentToEduCenter,
  Star,
  Branch,
} from "../types";

const CenterDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);

  // Fetch center details
  const {
    data: center,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["educational-center", id],
    queryFn: () => educationalCentersAPI.getCenter(id!),
    enabled: !!id,
  });

  // Fetch center branches
  const { data: branchesData } = useQuery({
    queryKey: ["branches", id],
    queryFn: () => branchesAPI.getBranches({ educationalCenterId: id }),
    enabled: !!id,
  });

  // Fetch comments
  const { data: commentsData } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => commentsAPI.getComments({ educationalCenterId: id }),
    enabled: !!id,
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (data: { message: string; educationalCenterId: string }) =>
      commentsAPI.createComment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      queryClient.invalidateQueries({ queryKey: ["educational-center", id] });
      setNewComment("");
      setShowCommentForm(false);
    },
  });

  // Add rating mutation
  const addRatingMutation = useMutation({
    mutationFn: (data: { star: number; educationalCenterId: string }) =>
      starsAPI.createStar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educational-center", id] });
      setNewRating(0);
      setShowRatingForm(false);
    },
  });

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && id) {
      addCommentMutation.mutate({
        message: newComment.trim(),
        educationalCenterId: id,
      });
    }
  };

  const handleAddRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating > 0 && id) {
      addRatingMutation.mutate({
        star: newRating,
        educationalCenterId: id,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !center) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              O'quv markazi haqida ma'lumot yuklanmadi. Iltimos, qaytadan urinib
              ko'ring.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const branches = branchesData?.data || [];
  const comments = commentsData?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Main Center Info */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {/* Header */}
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {center.name}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {center.Region?.name}
              </p>
              {center.averageStar && (
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(center.averageStar!)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {center.averageStar.toFixed(1)} yulduz
                    </span>
                  </div>
                </div>
              )}
            </div>
            {isAuthenticated && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowRatingForm(!showRatingForm)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Baholash
                </button>
                <button
                  onClick={() => setShowCommentForm(!showCommentForm)}
                  className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Izoh qoldirish
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200">
          <dl>
            {/* Image */}
            {center.image && (
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Rasmi</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <img
                    src={center.image}
                    alt={center.name}
                    className="h-64 w-full object-cover rounded-lg"
                  />
                </dd>
              </div>
            )}

            {/* Contact Information */}
            <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Aloqa ma'lumotlari
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 space-y-2">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {center.address}
                </div>
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {center.phoneNumber}
                </div>
              </dd>
            </div>

            {/* Fields */}
            {center.fieldEdu && center.fieldEdu.length > 0 && (
              <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Yo'nalishlar
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="flex flex-wrap gap-2">
                    {center.fieldEdu.map((fieldEdu) => (
                      <span
                        key={fieldEdu.id}
                        className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {fieldEdu.Field?.name}
                      </span>
                    ))}
                  </div>
                </dd>
              </div>
            )}

            {/* Subjects */}
            {center.subjectEdu && center.subjectEdu.length > 0 && (
              <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Ta'lim yo'nalishlari
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                    {center.subjectEdu.map((subjectEdu) => (
                      <li
                        key={subjectEdu.id}
                        className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                      >
                        <div className="w-0 flex-1 flex items-center">
                          <span className="ml-2 flex-1 w-0 truncate">
                            {subjectEdu.Subject?.name}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Branches */}
      {branches.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Filiallar
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Ushbu o'quv markazining filiallari
            </p>
          </div>
          <div className="border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              {branches.map((branch: Branch) => (
                <div
                  key={branch.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h4 className="font-medium text-gray-900">{branch.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{branch.address}</p>
                  <p className="text-sm text-gray-600">{branch.phoneNumber}</p>
                  {branch.Region && (
                    <p className="text-sm text-gray-500 mt-1">
                      {branch.Region.name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rating Form */}
      {showRatingForm && isAuthenticated && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Baholash
            </h3>
            <form onSubmit={handleAddRating} className="mt-4">
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className={`w-8 h-8 ${
                      star <= newRating ? "text-yellow-400" : "text-gray-300"
                    } hover:text-yellow-400`}
                  >
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
              <div className="mt-4 flex space-x-3">
                <button
                  type="submit"
                  disabled={newRating === 0 || addRatingMutation.isPending}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {addRatingMutation.isPending ? "Yuklanmoqda..." : "Baholash"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRatingForm(false)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comment Form */}
      {showCommentForm && isAuthenticated && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Izoh qoldirish
            </h3>
            <form onSubmit={handleAddComment} className="mt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Izohingizni yozing..."
                required
              />
              <div className="mt-4 flex space-x-3">
                <button
                  type="submit"
                  disabled={!newComment.trim() || addCommentMutation.isPending}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {addCommentMutation.isPending
                    ? "Yuklanmoqda..."
                    : "Izoh qoldirish"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCommentForm(false)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comments */}
      {comments.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Izohlar
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Foydalanuvchilar tomonidan qoldirilgan izohlar
            </p>
          </div>
          <div className="border-t border-gray-200">
            <div className="divide-y divide-gray-200">
              {comments.map((comment: CommentToEduCenter) => (
                <div key={comment.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {comment.User?.firstName?.[0]}
                          {comment.User?.lastName?.[0]}
                        </span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {comment.User?.firstName} {comment.User?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "uz-UZ"
                        )}
                      </p>
                      <p className="mt-2 text-sm text-gray-700">
                        {comment.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-4 sm:px-6 text-right">
          <Link
            to="/centers"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Orqaga
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CenterDetails;
