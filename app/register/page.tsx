"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  BookOpen,
  Building,
  Upload,
  Home,
} from "lucide-react";
// import LoginPopUp from "../login/LoginPopUp";
import axios from "axios";
import api from "../utils/api";
import RoleSpecificTermsAndBenefits from "../Dashboard/student/component/RoleSpecificTermsAndBenefits";
import { Checkbox, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import Navbar from "../Component/mainpage/Navbar";

interface Role {
  _id: string;
  name: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  phoneNumber: string;
  parentnumber: string;
  classYear?: string;
  schoolCollegeName?: string;
  city: string;
  address?: string;
  passportPhoto?: File | null;
  idProof?: File | null;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    phoneNumber: "",
    parentnumber: "",
    classYear: "",
    schoolCollegeName: "",
    city: "",
    address: "",
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedOAuthProvider, setSelectedOAuthProvider] = useState("");
  const [showOAuthRoleModal, setShowOAuthRoleModal] = useState(false);
  const [oauthSelectedRole, setOauthSelectedRole] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [termsAccepted, setTermsAccepted] = useState(false);

  const router = useRouter();
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/getroles")
      .then((response) => {
        const filteredRoles = response.data.filter(
          (role: Role) => role.name === "hostelOwner" || role.name === "student"
        );
        setRoles(filteredRoles);
        if (filteredRoles.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            role: filteredRoles[0]._id,
          }));
        }
      })
      .catch((error) => console.error("Error fetching roles:", error));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fieldName =
        getCurrentRoleName() === "student" ? "passportPhoto" : "idProof";
      setFormData((prevData) => ({ ...prevData, [fieldName]: file }));
      setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));
    }
  };

  const getCurrentRoleName = (): string => {
    const currentRole = roles.find((role) => role._id === formData.role);
    return currentRole ? currentRole.name : "";
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Phone number is required";
    if (!formData.city) newErrors.city = "City is required";

    const currentRoleName = getCurrentRoleName();
    if (currentRoleName === "student") {
      if (!formData.parentnumber)
        newErrors.parentnumber = "Parent Phone number is required";
    } else if (currentRoleName === "hostelOwner") {
      if (!formData.address) newErrors.address = "Address is required";
    }
    console.log("sjsj", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (showOtpInput) {
      await handleOtpSubmit();
    } else {
      if (!validateForm()) return;

      const formDataToSend = new FormData();
      formDataToSend.set("role", formData.role);
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, value);
        }
      });

      // Append the role name instead of ID
      const currentRole = roles.find((role) => role._id === formData.role);
      if (currentRole) {
        formDataToSend.set("roleName", currentRole.name);
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/register",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setUserId(response.data.userId);
        setShowOtpInput(true);
      } catch (error: any) {
        console.error("Registration error:", error);
        setErrors({
          email:
            error.response?.data?.message ||
            "Registration failed. Please try again.",
        });
      }
    }
  };

  const handleOtpSubmit = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/verify-registration-otp",
        {
          userId,
          otp,
        }
      );
      alert("Registration completed successfully!");
      router.push("/login");
    } catch (error: any) {
      console.error("OTP verification error:", error);
      setErrors({
        otp: error.response?.data?.message || "Invalid OTP. Please try again.",
      });
    }
  };

  const closeLoginPopup = () => {
    setShowLoginPopup(false);
  };

  const handleOAuthRoleSelect = (selectedRole: string) => {
    console.log("Selected role for OAuth:", selectedRole); // Log the selected role
    setOauthSelectedRole(selectedRole);
    setShowOAuthRoleModal(false);
    handleOAuthLogin("google", selectedRole);
  };

  const handleOAuthLogin = (provider: string, roleId: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    console.log("Redirecting with roleId:", roleId); // Log the roleId being sent
    window.location.href = `${baseUrl}/api/auth/${provider}?roleId=${roleId}`;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {" "}
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-7xl z-10">
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden flex items-center">
            <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 bg-white rounded-full p-3">
                  <Home
                    className="h-8 w-8 text-indigo-600"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Stay Home Hostel
                  </h1>
                  <p className="mt-1 text-sm text-indigo-100">
                    Your Home Away from Home
                  </p>
                </div>
              </div>
            </div>

            <div className="px-4 py-8 sm:p-6">
              {/* <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
              Hostel Registration
            </h2> */}

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Terms and Conditions */}
                <RoleSpecificTermsAndBenefits
                  getCurrentRoleName={getCurrentRoleName}
                />
                {/* Registration Form */}
                <div className="lg:w-2/3">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="role"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Role
                        </label>
                        <select
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          required
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                          {roles.map((role) => (
                            <option key={role._id} value={role._id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Full Name
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder="John Doe"
                          />
                        </div>
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email address
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder="you@example.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="phoneNumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone Number
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder="+1 (555) 987-6543"
                          />
                        </div>
                        {errors.phoneNumber && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.phoneNumber}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        {errors.password && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.password}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Confirm Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>

                      {getCurrentRoleName() === "student" && (
                        <div>
                          <label
                            htmlFor="phoneNumber"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Phone Number
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </div>
                            <input
                              type="tel"
                              id="parentnumber"
                              name="parentnumber"
                              value={formData.parentnumber}
                              onChange={handleChange}
                              required
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                              placeholder="+1 (555) 987-6543"
                            />
                          </div>
                          {errors.parentnumber && (
                            <p className="mt-2 text-sm text-red-600">
                              {errors.parentnumber}
                            </p>
                          )}
                        </div>
                      )}

                      {getCurrentRoleName() === "hostelOwner" && (
                        <div className="md:col-span-2">
                          <label
                            htmlFor="address"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Address
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Building
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </div>
                            <input
                              type="text"
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              required
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                              placeholder="123 Main St, Apt 4B"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700"
                        >
                          City
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder="e.g., New York"
                          />
                        </div>
                      </div>
                    </div>
                    {showOtpInput && (
                      <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        OTP sent successfully. Please check your email.
                      </div>
                    )}
                    {showOtpInput ? (
                      <div className="mt-6">
                        <label
                          htmlFor="otp"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Enter OTP
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <input
                            type="text"
                            id="otp"
                            name="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder="Enter the 6-digit OTP"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-6">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                              Or continue with
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3">
                          <div>
                            <Tooltip
                              title={
                                !termsAccepted
                                  ? "Please accept the terms and conditions"
                                  : ""
                              }
                            >
                              <button
                                type="button"
                                onClick={() => setShowOAuthRoleModal(true)}
                                // className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:-translate-y-1 hover:scale-105 ${
                                  !termsAccepted &&
                                  "opacity-50 cursor-not-allowed"
                                }`}
                                disabled={!termsAccepted}
                              >
                                <span className="sr-only">
                                  Sign in with Google
                                </span>
                                <svg
                                  className="w-5 h-5"
                                  aria-hidden="true"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                                </svg>
                              </button>
                            </Tooltip>
                          </div>

                          <div>
                            <Tooltip
                              title={
                                !termsAccepted
                                  ? "Please accept the terms and conditions"
                                  : ""
                              }
                            >
                              <button
                                type="button"
                                //  onClick={() => handleOAuthLogin("facebook")}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:-translate-y-1 hover:scale-105 ${
                                  !termsAccepted &&
                                  "opacity-50 cursor-not-allowed"
                                }`}
                                disabled={!termsAccepted}
                              >
                                <span className="sr-only">
                                  Sign in with Facebook
                                </span>
                                <svg
                                  className="w-5 h-5"
                                  aria-hidden="true"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </Tooltip>
                          </div>

                          <div>
                            <Tooltip
                              title={
                                !termsAccepted
                                  ? "Please accept the terms and conditions"
                                  : ""
                              }
                            >
                              <button
                                type="button"
                                // onClick={() => handleOAuthLogin("instagram")}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:-translate-y-1 hover:scale-105 ${
                                  !termsAccepted &&
                                  "opacity-50 cursor-not-allowed"
                                }`}
                                disabled={!termsAccepted}
                              >
                                <span className="sr-only">
                                  Sign in with Instagram
                                </span>
                                <svg
                                  className="w-5 h-5"
                                  aria-hidden="true"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    )}

                    {showOAuthRoleModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl">
                          <h2 className="text-xl font-bold mb-4">
                            Select Your Role for Google Sign In
                          </h2>
                          <div className="space-y-2">
                            {roles.map((role) => (
                              <button
                                key={role._id}
                                onClick={() => handleOAuthRoleSelect(role._id)}
                                className="w-full p-2 text-left hover:bg-gray-100 rounded-md"
                              >
                                {role.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={termsAccepted}
                        onChange={() => setTermsAccepted(!termsAccepted)}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I accept the terms and conditions
                      </label>
                    </div>

                    <div className="mt-6">
                      <>
                        <Tooltip
                          title={
                            !termsAccepted
                              ? "Please accept the terms and conditions"
                              : ""
                          }
                        >
                          <button
                            type="submit"
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:-translate-y-1 hover:scale-105 ${
                              !termsAccepted && "opacity-50 cursor-not-allowed"
                            }`}
                            disabled={!termsAccepted}
                          >
                            {showOtpInput ? "Verify OTP" : "Register"}
                          </button>
                        </Tooltip>
                      </>
                    </div>
                  </form>
                </div>

                {/* Login Popup */}
                {showLoginPopup && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <LoginPopUp onClose={closeLoginPopup} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
