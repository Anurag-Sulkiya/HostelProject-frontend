// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   FaBed,
//   FaBuilding,
//   FaUsers,
//   FaEdit,
//   FaTrashAlt,
//   FaCheck,
// } from "react-icons/fa";

// import DataGalaxyLoader from "../DataGalaxyLoader";
// // Define the interface for a hostel
// interface Hostel {
//   _id: string;
//   name: string;
//   address: string;
//   beds: number;
//   hostelType: number;
//   studentsPerRoom: number;
//   food: number;
//   images: string[]; // Handle multiple images
//   verified: boolean; // Add verified property
// }

// const HostelCard = ({ hostel }: { hostel: Hostel }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isVerified, setIsVerified] = useState(hostel.verified);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     name: hostel.name,
//     address: hostel.address,
//     beds: hostel.beds,
//     hostelType: hostel.hostelType,
//     studentsPerRoom: hostel.studentsPerRoom,
//     food: hostel.food,
//   });

//   const handleVerify = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("No token found. Please log in.");
//         return;
//       }
//       await axios.put(
//         "http://localhost:5000/api/admin/hostels/verify",
//         { hostelId: hostel._id },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setIsVerified(true);
//     } catch (error: any) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRemove = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("No token found. Please log in.");
//         return;
//       }
//       await axios.delete(
//         `http://localhost:5000/api/admin/hostels/${hostel._id}`,
//         {
//           headers: {
//             Authorization: ` Bearer ${token}`,
//           },
//         }
//       );
//     } catch (error: any) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("No token found. Please log in.");
//         return;
//       }

//       const updateData = {
//         hostelId: hostel._id,
//         ...formData,
//       };

//       await axios.put("http://localhost:5000/api/admin/hostels", updateData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       alert("Hostel details updated successfully");
//       setIsEditing(false);
//     } catch (error: any) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   return (
//     <div className="bg-white-600 p-4 sm:p-6 rounded-xl shadow-2xl flex flex-col w-full border border-gray-300 hover:border-cyan-400 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-cyan-200/20">
//       <div className="flex flex-col sm:flex-row">
//         <div className="w-full sm:w-1/3 flex justify-center sm:justify-start items-center mb-4 sm:mb-0">
//           {hostel.images.length > 0 ? (
//             <img
//               src={hostel.images[0]}
//               alt={hostel.name}
//               className="rounded-lg shadow-lg w-full h-48 sm:h-auto object-cover object-center"
//             />
//           ) : (
//             <div className="w-full h-48 sm:h-auto bg-gray-700 rounded-lg"></div>
//           )}
//         </div>
//         <div className="w-full sm:w-2/3 sm:pl-4 md:pl-8 flex flex-col justify-between">
//           <div>
//             <h3 className="text-xl sm:text-2xl font-semibold text-cyan-400 mb-2">
//               {hostel.name}
//             </h3>
//             <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-4">
//               {hostel.address}
//             </p>
//             <div className="grid grid-cols-2 gap-2">
//               <div className="flex items-center gap-2">
//                 <FaUsers className="text-cyan-400 text-lg" />
//                 <p className="text-xs sm:text-sm text-gray-300">
//                   <span className="font-semibold text-white">
//                     {hostel.beds}
//                   </span>{" "}
//                   beds
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <FaBuilding className="text-cyan-400 text-lg" />
//                 <p className="text-xs sm:text-sm text-gray-300">
//                   <span className="font-semibold text-white">
//                     {hostel.hostelType}
//                   </span>{" "}
//                   type
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <FaBed className="text-cyan-400 text-lg" />
//                 <p className="text-xs sm:text-sm text-gray-300">
//                   <span className="font-semibold text-white">
//                     {hostel.studentsPerRoom}
//                   </span>{" "}
//                   per room
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <FaBed className="text-cyan-400 text-lg" />
//                 <p className="text-xs sm:text-sm text-gray-300">
//                   <span className="font-semibold text-white">
//                     {hostel.food}
//                   </span>{" "}
//                   Food
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-wrap justify-end gap-2 sm:gap-4 mt-4">
//         <button
//           onClick={handleVerify}
//           className={`${
//             isVerified
//               ? "bg-gradient-to-r from-blue-500 to-blue-700"
//               : "bg-gradient-to-r from-green-500 to-green-700"
//           } text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-semibold shadow-lg hover:shadow-${
//             isVerified ? "blue" : "green"
//           }-500/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex items-center gap-1 sm:gap-2`}
//           disabled={loading || isVerified}
//         >
//           <FaCheck />
//           <span className="hidden sm:inline">
//             {isVerified ? "Verified" : "Verify"}
//           </span>
//         </button>
//         <button
//           onClick={handleRemove}
//           className="bg-gradient-to-r from-red-500 to-red-700 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-semibold shadow-lg hover:shadow-red-500/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex items-center gap-1 sm:gap-2"
//           disabled={loading}
//         >
//           <FaTrashAlt />
//           <span className="hidden sm:inline">Remove</span>
//         </button>
//         <button
//           onClick={() => setIsEditing(!isEditing)}
//           className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-semibold shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex items-center gap-1 sm:gap-2"
//           disabled={loading}
//         >
//           <FaEdit />
//           <span className="hidden sm:inline">Edit</span>
//         </button>
//       </div>
//       {isEditing && (
//         <div className="mt-4 bg-gray-100 p-4 rounded-md">
//           <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
//             Edit Hostel
//           </h4>
//           <form onSubmit={handleEdit} className="space-y-2 sm:space-y-4">
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Hostel Name"
//               className="p-2 rounded-md bg-gray-400 text-gray border border-gray-300 w-full text-sm"
//             />
//             <input
//               type="text"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               placeholder="Address"
//              className="p-2 rounded-md bg-gray-400 text-gray border border-gray-300 w-full text-sm"
//             />
//             <div className="grid grid-cols-2 gap-2">
//               <input
//                 type="number"
//                 name="beds"
//                 value={formData.beds}
//                 onChange={handleChange}
//                 placeholder="Beds"
//                 className="p-2 rounded-md bg-gray-400 text-gray border border-gray-300 w-full text-sm"
//               />
//               <select
//                 name="hostelType"
//                 value={formData.hostelType}
//                 onChange={handleChange}
//                className="p-2 rounded-md bg-gray-400 text-gray border border-gray-300 w-full text-sm"
//               >
//                 <option value={0}>Type 0</option>
//                 <option value={1}>Type 1</option>
//               </select>
//             </div>
//             <div className="grid grid-cols-2 gap-2">
//               <input
//                 type="number"
//                 name="studentsPerRoom"
//                 value={formData.studentsPerRoom}
//                 onChange={handleChange}
//                 placeholder="Students/Room"
//                 className="p-2 rounded-md bg-gray-400 text-gray border border-gray-300 w-full text-sm"
//               />
//               <input
//                 type="number"
//                 name="food"
//                 value={formData.food}
//                 onChange={handleChange}
//                 placeholder="Food"
//                 className="p-2 rounded-md bg-gray-400 text-gray border border-gray-300 w-full text-sm"              />
//             </div>
//             <button
//               type="submit"
//               className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-lg hover:shadow-green-500/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 w-full"
//               disabled={loading}
//             >
//               Save Changes
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default function Hostels() {
//   const [hostels, setHostels] = useState<Hostel[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchHostels = async () => {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setError("No token found. Please log in.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const hostelResponse = await axios.get(
//           "http://localhost:5000/api/admin/hostels",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         // Fetch photos for each hostel
//         const hostelsWithPhotos = await Promise.all(
//           hostelResponse.data.map(async (hostel: Hostel) => {
//             const photoResponse = await axios.get(
//               `http://localhost:5000/api/hostels/gethostalphotos/${hostel._id}`
//             );
//             const images = photoResponse.data.map(
//               (img: any) => `data:${img.contentType};base64,${img.data}`
//             );
//             return {
//               ...hostel,
//               images: images.length > 0 ? images : [hostel.images],
//             };
//           })
//         );

//         setHostels(hostelsWithPhotos);
//       } catch (error: any) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHostels();
//   }, []);

//   if (loading) {
//     return <DataGalaxyLoader />;
//   }

//   if (error) {
//     return <div className="text-red-500">{error}</div>;
//   }

//   return (
//     <div className="p-4 sm:p-8 bg-black-900 min-h-screen">
//       <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 text-white text-center">
//         Hostels
//       </h2>
//       <div className="grid gap-4 sm:gap-8">
//         {hostels.map((hostel) => (
//           <HostelCard key={hostel._id} hostel={hostel} />
//         ))}
//       </div>
//     </div>
//   );
// }



"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import {
  FaBed,
  FaBuilding,
  FaUsers,
  FaEdit,
  FaTrashAlt,
  FaCheck,
} from "react-icons/fa";

import DataGalaxyLoader from "../DataGalaxyLoader";

interface Hostel {
  _id: string;
  name: string;
  address: string;
  beds: number;
  hostelType: number;
  studentsPerRoom: number;
  food: number;
  images: string[];
  verified: boolean;
}

const HostelCard = ({ hostel }: { hostel: Hostel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(hostel.verified);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: hostel.name,
    address: hostel.address,
    beds: hostel.beds,
    hostelType: hostel.hostelType,
    studentsPerRoom: hostel.studentsPerRoom,
    food: hostel.food,
  });

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    throw new Error("Function not implemented.");
  }

  function handleEdit(event: FormEvent<HTMLFormElement>): void {
    throw new Error("Function not implemented.");
  }

  function handleVerify(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
    throw new Error("Function not implemented.");
  }

  function handleRemove(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
    throw new Error("Function not implemented.");
  }

  // ... (handleVerify, handleRemove, handleEdit, and handleChange functions remain unchanged)

  return (
    <div className="bg-white-600 p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl flex flex-col w-full border border-gray-300 hover:border-cyan-400 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-cyan-200/20">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/3 lg:w-1/4 flex justify-center sm:justify-start items-center mb-4 sm:mb-0">
          {hostel.images.length > 0 ? (
            <img
              src={hostel.images[0]}
              alt={hostel.name}
              className="rounded-lg shadow-lg w-full h-48 sm:h-56 lg:h-64 object-cover object-center"
            />
          ) : (
            <div className="w-full h-48 sm:h-56 lg:h-64 bg-gray-700 rounded-lg"></div>
          )}
        </div>
        <div className="w-full sm:w-2/3 lg:w-3/4 sm:pl-4 md:pl-8 flex flex-col justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-cyan-400 mb-2">
              {hostel.name}
            </h3>
            <p className="text-xs sm:text-sm lg:text-base text-gray-400 mb-2 sm:mb-4">
              {hostel.address}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <FaUsers className="text-cyan-400 text-lg sm:text-xl" />
                <p className="text-xs sm:text-sm lg:text-base text-gray-300">
                  <span className="font-semibold text-white">
                    {hostel.beds}
                  </span>{" "}
                  beds
                </p>
              </div>
              <div className="flex items-center gap-2">
                <FaBuilding className="text-cyan-400 text-lg sm:text-xl" />
                <p className="text-xs sm:text-sm lg:text-base text-gray-300">
                  <span className="font-semibold text-white">
                    {hostel.hostelType}
                  </span>{" "}
                  type
                </p>
              </div>
              <div className="flex items-center gap-2">
                <FaBed className="text-cyan-400 text-lg sm:text-xl" />
                <p className="text-xs sm:text-sm lg:text-base text-gray-300">
                  <span className="font-semibold text-white">
                    {hostel.studentsPerRoom}
                  </span>{" "}
                  per room
                </p>
              </div>
              <div className="flex items-center gap-2">
                <FaBed className="text-cyan-400 text-lg sm:text-xl" />
                <p className="text-xs sm:text-sm lg:text-base text-gray-300">
                  <span className="font-semibold text-white">
                    {hostel.food}
                  </span>{" "}
                  Food
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-2 sm:gap-4 mt-4">
        <button
          onClick={handleVerify}
          className={`${
            isVerified
              ? "bg-gradient-to-r from-blue-500 to-blue-700"
              : "bg-gradient-to-r from-green-500 to-green-700"
          } text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-semibold shadow-lg hover:shadow-${
            isVerified ? "blue" : "green"
          }-500/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex items-center gap-1 sm:gap-2`}
          disabled={loading || isVerified}
        >
          <FaCheck />
          <span className="hidden sm:inline">
            {isVerified ? "Verified" : "Verify"}
          </span>
        </button>
        <button
          onClick={handleRemove}
          className="bg-gradient-to-r from-red-500 to-red-700 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-semibold shadow-lg hover:shadow-red-500/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex items-center gap-1 sm:gap-2"
          disabled={loading}
        >
          <FaTrashAlt />
          <span className="hidden sm:inline">Remove</span>
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-semibold shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex items-center gap-1 sm:gap-2"
          disabled={loading}
        >
          <FaEdit />
          <span className="hidden sm:inline">Edit</span>
        </button>
      </div>
      {isEditing && (
        <div className="mt-4 bg-gray-100 p-4 rounded-md">
          <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-4">
            Edit Hostel
          </h4>
          <form onSubmit={handleEdit} className="space-y-2 sm:space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Hostel Name"
              className="p-2 rounded-md bg-gray-400 text-gray border border-gray-300 w-full text-sm sm:text-base"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="p-2 rounded-md bg-gray-400 text-gray border border-gray-300 w-full text-sm sm:text-base"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <input
                type="number"
                name="beds"
                value={formData.beds}
                onChange={handleChange}
                placeholder="Beds"
                className="p-2 rounded-md bg-gray-400 text-gray border border-gray-300 w-full text-sm sm:text-base"
              />
              <select
                name="hostelType"
                value={formData.hostelType}
                onChange={handleChange}
                className="p-2 rounded-md bg-gray-400 text-gray border border-gray-300 w-full text-sm sm:text-base"
              >
                <option value={0}>Type 0</option>
                <option value={1}>Type 1</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <input
                type="number"
                name="studentsPerRoom"
                value={formData.studentsPerRoom}
                onChange={handleChange}
                placeholder="Students/Room"
                className="p-2 rounded-md bg-gray-400 text-gray border border-gray-300 w-full text-sm sm:text-base"
              />
              <input
                type="number"
                name="food"
                value={formData.food}
                onChange={handleChange}
                placeholder="Food"
                className="p-2 rounded-md bg-gray-400 text-gray border border-gray-300 w-full text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-md text-sm sm:text-base font-semibold shadow-lg hover:shadow-green-500/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 w-full"
              disabled={loading}
            >
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default function Hostels() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ... (fetchHostels function remains unchanged)
  }, []);

  if (loading) {
    return <DataGalaxyLoader />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-black-900 min-h-screen">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8 text-white text-center">
        Hostels
      </h2>
      <div className="grid gap-4 sm:gap-6 lg:gap-8">
        {hostels.map((hostel) => (
          <HostelCard key={hostel._id} hostel={hostel} />
        ))}
      </div>
    </div>
  );
}