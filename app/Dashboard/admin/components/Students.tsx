"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import DataGalaxyLoader from "../DataGalaxyLoader";

type Student = {
  _id: string; // MongoDB ID
  name: string;
  number: string;
  city: string;
  school: string;
  address: string;
  class: string;
  year: string;
  passportPhotoUrl?: string;
  [key: string]: any;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found, please login first.");
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Fetch students
        const response = await axios.get(
          "http://localhost:5000/api/admin/students",
          config
        );
        const studentsData: Student[] = response.data;

        // Fetch passport photos
        const studentsWithPhotos = await Promise.all(
          studentsData.map(async (student) => {
            try {
              const photoResponse = await axios.get(
                `http://localhost:5000/api/students/getphoto/${student._id}`,
                {
                  responseType: "blob",
                }
              );
              student.passportPhotoUrl = URL.createObjectURL(
                photoResponse.data
              );
            } catch (error) {
              console.error(
                ` Error fetching photo for student ${student._id}`,
                error
              );
            }
            return student;
          })
        );

        setStudents(studentsWithPhotos);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setEditingStudent({ ...student });
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedStudent(null);
    setEditingStudent(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingStudent) {
      const { name, value } = e.target;
      setEditingStudent((prev) => (prev ? { ...prev, [name]: value } : null));
    }
  };

  const handleUpdateStudent = async () => {
    if (!editingStudent || !selectedStudent) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token not found. Please log in again.");
      return;
    }

    try {
      const updatedFields: Partial<Student> = {};
      for (const key in editingStudent) {
        if (editingStudent[key] !== selectedStudent[key]) {
          updatedFields[key] = editingStudent[key];
        }
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.put(
        `http://localhost:5000/api/admin/students`,
        {
          studentId: editingStudent._id,
          ...updatedFields,
        },
        config
      );

      setStudents((prev) =>
        prev.map((student) =>
          student._id === editingStudent._id
            ? { ...student, ...updatedFields }
            : student
        )
      );
      handleClosePopup();
    } catch (error) {
      console.error("Error updating student:", error);
      setError(
        "Failed to update student. Please check the console for details."
      );
    }
  };

  if (loading) {
    return <DataGalaxyLoader />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Students</h2>

      {/* Table view for larger screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                School
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr
                key={student._id}
                className="hover:bg-gray-100 transition duration-200 ease-in-out"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.passportPhotoUrl ? (
                    <img
                      src={student.passportPhotoUrl}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {student.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {student.number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {student.city}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {student.school}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {student.class}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {student.year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(student)}
                    className="text-blue-500 hover:text-blue-400 transition duration-200 ease-in-out"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile screens */}
      <div className="md:hidden space-y-4">
        {students.map((student) => (
          <div key={student._id} className="bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              {student.passportPhotoUrl ? (
                <img
                  src={student.passportPhotoUrl}
                  alt={student.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 mr-3"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-3"></div>
              )}
              <h3 className="text-lg font-semibold text-gray-900">
                {student.name}
              </h3>
            </div>
            <div className="text-sm text-gray-600">
              <p>
                <span className="font-medium">Number:</span> {student.number}
              </p>
              <p>
                <span className="font-medium">City:</span> {student.city}
              </p>
              <p>
                <span className="font-medium">School:</span> {student.school}
              </p>
              <p>
                <span className="font-medium">Class:</span> {student.class}
              </p>
              <p>
                <span className="font-medium">Year:</span> {student.year}
              </p>
            </div>
            <button
              onClick={() => handleViewDetails(student)}
              className="text-blue-500 hover:text-blue-400 transition duration-200 ease-in-out mt-3"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Popup for editing student details */}
      {showPopup && selectedStudent && editingStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Edit Student Details
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={editingStudent.name}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number
              </label>
              <input
                type="text"
                name="number"
                value={editingStudent.number}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                value={editingStudent.city}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                School
              </label>
              <input
                type="text"
                name="school"
                value={editingStudent.school}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Class
              </label>
              <input
                type="text"
                name="class"
                value={editingStudent.class}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <input
                type="text"
                name="year"
                value={editingStudent.year}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleClosePopup}
                className="text-gray-500 hover:text-gray-400 transition duration-200 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStudent}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-400 transition duration-200 ease-in-out"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
