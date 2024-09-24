// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import {
//   User,
//   Mail,
//   Lock,
//   Phone,
//   MapPin,
//   BookOpen,
//   Building,
//   Upload,
//   Home,
// } from "lucide-react";
// import LoginPopUp from "../login/LoginPopUp";
// import axios from "axios";

// type Role = "student" | "owner";

// interface FormData {
//   name: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   role: Role;
//   phoneNumber: string;
//   classYear?: string;
//   schoolCollegeName?: string;
//   city: string;
//   address?: string;
//   studentImage?: File | null;
//   ownerIdProof?: File | null;
// }

// export default function RegisterPage() {
//   const [formData, setFormData] = useState<FormData>({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "student",
//     phoneNumber: "",
//     classYear: "",
//     schoolCollegeName: "",
//     city: "",
//     address: "",
//     studentImage: null,
//     ownerIdProof: null,
//   });
//   const [roles, setRoles] = useState<string[]>([]);
//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/admin/getroles")
//       .then((response) => {
//         const filteredRoles = response.data
//           .filter(
//             (role: { name: string }) =>
//               role.name === "hostelOwner" || role.name === "student"
//           )
//           .map((role: { name: string }) => role.name);
//         setRoles(filteredRoles);
//       })
//       .catch((error) => console.error("Error fetching roles:", error));
//   }, []);

//   const [showLoginPopup, setShowLoginPopup] = useState(false);

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       const fieldName =
//         formData.role === "student" ? "studentImage" : "ownerIdProof";
//       setFormData((prevData) => ({ ...prevData, [fieldName]: file }));
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     setShowLoginPopup(true);
//   };

//   const closeLoginPopup = () => {
//     setShowLoginPopup(false);
//   };

//   const handleOAuthLogin = (provider: string) => {
//     const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
//     const redirectUri = `${baseUrl}/api/auth/${provider}/callback`;
//     const encodedRedirectUri = encodeURIComponent(redirectUri);

//     window.location.href = `${baseUrl}/api/auth/${provider}?redirect_uri=${encodedRedirectUri}`;
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col py-12 sm:px-6 lg:px-8 relative overflow-hidden">
//         {/* Background decorative elements */}
//         <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
//           <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
//           <div className="absolute top-0 right-0 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
//           <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
//         </div>

//         <div className="sm:mx-auto sm:w-full sm:max-w-7xl z-10">
//           <div className="bg-white shadow-2xl rounded-2xl overflow-hidden flex items-center">
//             <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
//               <div className="flex items-center space-x-4">
//                 <div className="flex-shrink-0 bg-white rounded-full p-3">
//                   <Home
//                     className="h-8 w-8 text-indigo-600"
//                     aria-hidden="true"
//                   />
//                 </div>
//                 <div>
//                   <h1 className="text-3xl font-bold text-white">
//                     Stay Home Hostel
//                   </h1>
//                   <p className="mt-1 text-sm text-indigo-100">
//                     Your Home Away from Home
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="px-4 py-8 sm:p-6">
//               {/* <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
//               Hostel Registration
//             </h2> */}

//               <div className="flex flex-col lg:flex-row gap-8">
//                 {/* Terms and Conditions */}
//                 <div className="lg:w-2/3 space-y-6 bg-gray-50 p-6 rounded-xl">
//                   <h3 className="text-xl font-semibold text-indigo-700">
//                     Terms and Conditions
//                   </h3>
//                   <div className="text-sm text-gray-600 space-y-4">
//                     <div>
//                       <h4 className="font-medium text-indigo-600">
//                         For Students:
//                       </h4>
//                       <ul className="list-disc pl-5 space-y-1 mt-2">
//                         <li>Maintain a clean and tidy living space</li>
//                         <li>Respect quiet hours from 10 PM to 7 AM</li>
//                         <li>
//                           No illegal substances or activities on the premises
//                         </li>
//                         <li>
//                           Notify management of any maintenance issues promptly
//                         </li>
//                         <li>
//                           Adhere to all safety protocols and emergency
//                           procedures
//                         </li>
//                       </ul>
//                     </div>
//                     <div>
//                       <h4 className="font-medium text-indigo-600">
//                         For Owners:
//                       </h4>
//                       <ul className="list-disc pl-5 space-y-1 mt-2">
//                         <li>Provide a safe and clean living environment</li>
//                         <li>Maintain all necessary licenses and permits</li>
//                         <li>
//                           Respect tenant privacy and provide adequate notice for
//                           inspections
//                         </li>
//                         <li>Address maintenance requests in a timely manner</li>
//                         <li>
//                           Comply with all local housing laws and regulations
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-indigo-600">
//                       Additional Information
//                     </h4>
//                     <p className="mt-2 text-sm text-gray-600">
//                       By registering, you agree to abide by all hostel rules and
//                       regulations. Failure to comply may result in termination
//                       of your stay or listing.
//                     </p>
//                   </div>
//                 </div>

//                 {/* Registration Form */}
//                 <div className="lg:w-2/3">
//                   <form onSubmit={handleSubmit} className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label
//                           htmlFor="role"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Role
//                         </label>
//                         <select
//                           id="role"
//                           name="role"
//                           value={formData.role}
//                           onChange={handleChange}
//                           required
//                           className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//                         >
//                           <option value="student">Student</option>
//                           <option value="owner">Owner</option>
//                         </select>
//                       </div>

//                       <div>
//                         <label
//                           htmlFor="name"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Full Name
//                         </label>
//                         <div className="mt-1 relative rounded-md shadow-sm">
//                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <User
//                               className="h-5 w-5 text-gray-400"
//                               aria-hidden="true"
//                             />
//                           </div>
//                           <input
//                             type="text"
//                             id="name"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             required
//                             className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
//                             placeholder="John Doe"
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label
//                           htmlFor="email"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Email address
//                         </label>
//                         <div className="mt-1 relative rounded-md shadow-sm">
//                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <Mail
//                               className="h-5 w-5 text-gray-400"
//                               aria-hidden="true"
//                             />
//                           </div>
//                           <input
//                             type="email"
//                             id="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             required
//                             className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
//                             placeholder="you@example.com"
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label
//                           htmlFor="phoneNumber"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Phone Number
//                         </label>
//                         <div className="mt-1 relative rounded-md shadow-sm">
//                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <Phone
//                               className="h-5 w-5 text-gray-400"
//                               aria-hidden="true"
//                             />
//                           </div>
//                           <input
//                             type="tel"
//                             id="phoneNumber"
//                             name="phoneNumber"
//                             value={formData.phoneNumber}
//                             onChange={handleChange}
//                             required
//                             className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
//                             placeholder="+1 (555) 987-6543"
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label
//                           htmlFor="password"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Password
//                         </label>
//                         <div className="mt-1 relative rounded-md shadow-sm">
//                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <Lock
//                               className="h-5 w-5 text-gray-400"
//                               aria-hidden="true"
//                             />
//                           </div>
//                           <input
//                             type="password"
//                             id="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             required
//                             className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label
//                           htmlFor="confirmPassword"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           Confirm Password
//                         </label>
//                         <div className="mt-1 relative rounded-md shadow-sm">
//                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <Lock
//                               className="h-5 w-5 text-gray-400"
//                               aria-hidden="true"
//                             />
//                           </div>
//                           <input
//                             type="password"
//                             id="confirmPassword"
//                             name="confirmPassword"
//                             value={formData.confirmPassword}
//                             onChange={handleChange}
//                             required
//                             className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
//                           />
//                         </div>
//                       </div>

//                       {formData.role === "student" && (
//                         <>
//                           <div>
//                             <label
//                               htmlFor="classYear"
//                               className="block text-sm font-medium text-gray-700"
//                             >
//                               Class/Year
//                             </label>
//                             <div className="mt-1 relative rounded-md shadow-sm">
//                               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                 <BookOpen
//                                   className="h-5 w-5 text-gray-400"
//                                   aria-hidden="true"
//                                 />
//                               </div>
//                               <input
//                                 type="text"
//                                 id="classYear"
//                                 name="classYear"
//                                 value={formData.classYear}
//                                 onChange={handleChange}
//                                 required
//                                 className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
//                                 placeholder="e.g., 3rd Year or 12th Grade"
//                               />
//                             </div>
//                           </div>

//                           <div>
//                             <label
//                               htmlFor="schoolCollegeName"
//                               className="block text-sm font-medium text-gray-700"
//                             >
//                               School/College Name
//                             </label>
//                             <div className="mt-1 relative rounded-md shadow-sm">
//                               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                 <Building
//                                   className="h-5 w-5 text-gray-400"
//                                   aria-hidden="true"
//                                 />
//                               </div>
//                               <input
//                                 type="text"
//                                 id="schoolCollegeName"
//                                 name="schoolCollegeName"
//                                 value={formData.schoolCollegeName}
//                                 onChange={handleChange}
//                                 required
//                                 className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
//                                 placeholder="e.g., Springfield High School"
//                               />
//                             </div>
//                           </div>
//                         </>
//                       )}

//                       {formData.role === "owner" && (
//                         <div className="md:col-span-2">
//                           <label
//                             htmlFor="address"
//                             className="block text-sm font-medium text-gray-700"
//                           >
//                             Address
//                           </label>
//                           <div className="mt-1 relative rounded-md shadow-sm">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                               <Building
//                                 className="h-5 w-5 text-gray-400"
//                                 aria-hidden="true"
//                               />
//                             </div>
//                             <input
//                               type="text"
//                               id="address"
//                               name="address"
//                               value={formData.address}
//                               onChange={handleChange}
//                               required
//                               className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
//                               placeholder="123 Main St, Apt 4B"
//                             />
//                           </div>
//                         </div>
//                       )}

//                       <div>
//                         <label
//                           htmlFor="city"
//                           className="block text-sm font-medium text-gray-700"
//                         >
//                           City
//                         </label>
//                         <div className="mt-1 relative rounded-md shadow-sm">
//                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <MapPin
//                               className="h-5 w-5 text-gray-400"
//                               aria-hidden="true"
//                             />
//                           </div>
//                           <input
//                             type="text"
//                             id="city"
//                             name="city"
//                             value={formData.city}
//                             onChange={handleChange}
//                             required
//                             className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
//                             placeholder="e.g., New York"
//                           />
//                         </div>
//                       </div>

//                       {formData.role === "student" ? (
//                         <div>
//                           <label
//                             htmlFor="studentImage"
//                             className="block text-sm font-medium text-gray-700"
//                           >
//                             Upload Your Image
//                           </label>

//                           <div className="mt-1 flex items-center">
//                             <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
//                               {formData.studentImage ? (
//                                 <img
//                                   src={URL.createObjectURL(
//                                     formData.studentImage
//                                   )}
//                                   alt="Student"
//                                   className="h-full w-full object-cover"
//                                 />
//                               ) : (
//                                 <svg
//                                   className="h-full w-full text-gray-300"
//                                   fill="currentColor"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
//                                 </svg>
//                               )}
//                             </span>
//                             <button
//                               type="button"
//                               onClick={() => fileInputRef.current?.click()}
//                               className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                             >
//                               Change
//                             </button>
//                           </div>
//                           <input
//                             type="file"
//                             ref={fileInputRef}
//                             onChange={handleFileChange}
//                             accept="image/*"
//                             className="hidden"
//                           />
//                         </div>
//                       ) : (
//                         <div>
//                           <label
//                             htmlFor="ownerIdProof"
//                             className="block text-sm font-medium text-gray-700"
//                           >
//                             Upload ID Proof
//                           </label>
//                           <div className="mt-1 flex items-center">
//                             <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
//                               {formData.ownerIdProof ? (
//                                 <div className="h-full w-full flex items-center justify-center bg-gray-300 text-gray-600">
//                                   <Upload className="h-6 w-6" />
//                                 </div>
//                               ) : (
//                                 <svg
//                                   className="h-full w-full text-gray-300"
//                                   fill="currentColor"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
//                                 </svg>
//                               )}
//                             </span>
//                             <button
//                               type="button"
//                               onClick={() => fileInputRef.current?.click()}
//                               className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                             >
//                               Upload
//                             </button>
//                           </div>
//                           <input
//                             type="file"
//                             ref={fileInputRef}
//                             onChange={handleFileChange}
//                             accept=".pdf,.jpg,.jpeg,.png"
//                             className="hidden"
//                           />
//                           {formData.ownerIdProof && (
//                             <p className="mt-2 text-sm text-gray-500">
//                               File uploaded: {formData.ownerIdProof.name}
//                             </p>
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     {/* OAuth Buttons */}
//                     <div className="mt-6">
//                       <div className="relative">
//                         <div className="absolute inset-0 flex items-center">
//                           <div className="w-full border-t border-gray-300" />
//                         </div>
//                         <div className="relative flex justify-center text-sm">
//                           <span className="px-2 bg-white text-gray-500">
//                             Or continue with
//                           </span>
//                         </div>
//                       </div>

//                       <div className="mt-6 grid grid-cols-3 gap-3">
//                         <div>
//                           <button
//                             type="button"
//                             onClick={() => handleOAuthLogin("google")}
//                             className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//                           >
//                             <span className="sr-only">Sign in with Google</span>
//                             <svg
//                               className="w-5 h-5"
//                               aria-hidden="true"
//                               fill="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
//                             </svg>
//                           </button>
//                         </div>

//                         <div>
//                           <button
//                             type="button"
//                             onClick={() => handleOAuthLogin("facebook")}
//                             className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//                           >
//                             <span className="sr-only">
//                               Sign in with Facebook
//                             </span>
//                             <svg
//                               className="w-5 h-5"
//                               aria-hidden="true"
//                               fill="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 fillRule="evenodd"
//                                 d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
//                                 clipRule="evenodd"
//                               />
//                             </svg>
//                           </button>
//                         </div>

//                         <div>
//                           <button
//                             type="button"
//                             onClick={() => handleOAuthLogin("instagram")}
//                             className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//                           >
//                             <span className="sr-only">
//                               Sign in with Instagram
//                             </span>
//                             <svg
//                               className="w-5 h-5"
//                               aria-hidden="true"
//                               fill="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 fillRule="evenodd"
//                                 d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
//                                 clipRule="evenodd"
//                               />
//                             </svg>
//                           </button>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mt-6">
//                       <button
//                         type="submit"
//                         className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:-translate-y-1 hover:scale-105"
//                       >
//                         Register
//                       </button>
//                     </div>
//                   </form>
//                 </div>

//                 {/* Login Popup */}
//                 {showLoginPopup && (
//                   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <LoginPopUp onClose={closeLoginPopup} />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
