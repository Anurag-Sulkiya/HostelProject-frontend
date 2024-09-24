// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import DataGalaxyLoader from "../DataGalaxyLoader";
// import { MdMoreVert } from "react-icons/md";

// interface Owner {
//   _id: string;
//   name: string;
//   hostels: string[];
//   number: string;
//   status: string;
//   address?: string;
//   image?: string;
// }

// export default function Owners() {
//   const [owners, setOwners] = useState<Owner[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
//   const [editingOwner, setEditingOwner] = useState<Partial<Owner> | null>(null);
//   const [showForm, setShowForm] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchOwners = async () => {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setError("No authentication token found.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get<Owner[]>(
//           "http://localhost:5000/api/admin/owners",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//             responseType: "json",
//           }
//         );
//         setOwners(response.data);
//       } catch (err) {
//         console.error("Error fetching owners:", err);
//         setError(
//           "Failed to fetch owners. Please check the console for details."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOwners();
//   }, []);

//   const getStatusBadgeColor = (status: string) => {
//     switch (status) {
//       case "active":
//         return "bg-green-500";
//       case "inactive":
//         return "bg-red-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   const handleViewDetails = (owner: Owner) => {
//     setSelectedOwner(owner);
//     setEditingOwner({ ...owner });
//     setShowForm(true);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (editingOwner) {
//       const { name, value } = e.target;
//       setEditingOwner((prev) => ({ ...prev, [name]: value }));
//     }
//   };
//   // ... (previous code remains the same)

//   const handleUpdateOwner = async () => {
//     if (!editingOwner || !selectedOwner) return;

//     const updatedFields: Partial<Owner> = {};
//     (Object.keys(editingOwner) as Array<keyof Owner>).forEach((key) => {
//       if (editingOwner[key] !== selectedOwner[key]) {
//         if (key === "hostels") {
//           // Handle the hostels array separately
//           if (
//             Array.isArray(editingOwner[key]) &&
//             Array.isArray(selectedOwner[key])
//           ) {
//             if (
//               editingOwner[key].length !== selectedOwner[key].length ||
//               !editingOwner[key].every(
//                 (val, index) => val === selectedOwner[key][index]
//               )
//             ) {
//               updatedFields[key] = editingOwner[key];
//             }
//           }
//         } else if (key !== "_id") {
//           // For all other fields except '_id'
//           updatedFields[key] = editingOwner[key] as string | undefined;
//         }
//       }
//     });

//     try {
//       await axios.put(
//         `http://localhost:5000/api/admin/owners`,
//         {
//           ownerId: selectedOwner._id,
//           ...updatedFields,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setOwners((prev) =>
//         prev.map((owner) =>
//           owner._id === selectedOwner._id
//             ? { ...owner, ...updatedFields }
//             : owner
//         )
//       );
//       setShowForm(false);
//       setSelectedOwner(null);
//       setEditingOwner(null);
//     } catch (error) {
//       console.error("Error updating owner:", error);
//     }
//   };

//   // ... (rest of the code remains the same)

//   if (loading) {
//     return <DataGalaxyLoader />;
//   }

//   if (error) {
//     return <div className="text-red-500">{error}</div>;
//   }

//   return (
//     <div className="p-4 bg-white min-h-screen">
//       <h2 className="text-2xl font-bold mb-4 text-black">Owners</h2>

//       {/* Table view for larger screens */}
//       <div className="hidden md:block overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-300">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Number
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Address
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Hostels
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {owners.map((owner) => (
//               <tr
//                 key={owner._id}
//                 className="hover:bg-gray-50 transition duration-200 ease-in-out"
//               >
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
//                   {owner.name}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {owner.number}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {owner.address || "N/A"}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {owner.hostels.length}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <button
//                     onClick={() => handleViewDetails(owner)}
//                     className="text-blue-600 hover:text-blue-500 transition duration-200 ease-in-out"
//                   >
//                     Edit
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Card view for mobile screens */}
//       <div className="md:hidden space-y-4">
//         {owners.map((owner) => (
//           <div key={owner._id} className="bg-gray-100 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold text-black mb-2">
//               {owner.name}
//             </h3>
//             <div className="text-sm text-gray-500">
//               <p>
//                 <span className="font-medium">Number:</span> {owner.number}
//               </p>
//               <p>
//                 <span className="font-medium">Address:</span>{" "}
//                 {owner.address || "N/A"}
//               </p>
//               <p>
//                 <span className="font-medium">Hostels:</span>{" "}
//                 {owner.hostels.length}
//               </p>
//             </div>
//             <div className="mt-3 flex justify-end">
//               <button
//                 onClick={() => handleViewDetails(owner)}
//                 className="text-blue-600 hover:text-blue-500 transition duration-200 ease-in-out"
//               >
//                 <MdMoreVert size={20} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Edit form (same for both views) */}
//       {showForm && editingOwner && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
//           <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md mx-4 overflow-auto max-h-[90vh]">
//             <h3 className="text-xl font-bold text-black mb-4">Edit Owner</h3>
//             <form className="space-y-3">
//               <div>
//                 <label className="block text-gray-600 text-sm">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={editingOwner.name || ""}
//                   onChange={handleInputChange}
//                   className="mt-1 p-2 w-full bg-gray-100 border border-gray-300 rounded text-black"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-600 text-sm">
//                   Mobile Number
//                 </label>
//                 <input
//                   type="tel"
//                   name="number"
//                   value={editingOwner.number || ""}
//                   onChange={handleInputChange}
//                   className="mt-1 p-2 w-full bg-gray-100 border border-gray-300 rounded text-black"
//                   pattern="[0-9]{10}"
//                   placeholder="1234567890"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-600 text-sm">Address</label>
//                 <input
//                   type="text"
//                   name="address"
//                   value={editingOwner.address || ""}
//                   onChange={handleInputChange}
//                   className="mt-1 p-2 w-full bg-gray-100 border border-gray-300 rounded text-black"
//                 />
//               </div>
//               <div className="flex justify-end space-x-2 mt-4">
//                 <button
//                   type="button"
//                   onClick={handleUpdateOwner}
//                   className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//                 >
//                   Save
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import DataGalaxyLoader from "../DataGalaxyLoader";
import { MdMoreVert } from "react-icons/md";

interface Owner {
  _id: string;
  name: string;
  hostels: string[];
  number: string;
  status: string;
  address?: string;
  image?: string;
}

export default function Owners() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [editingOwner, setEditingOwner] = useState<Partial<Owner> | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    const fetchOwners = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<Owner[]>(
          "http://localhost:5000/api/admin/owners",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "json",
          }
        );
        setOwners(response.data);
      } catch (err) {
        console.error("Error fetching owners:", err);
        setError(
          "Failed to fetch owners. Please check the console for details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleViewDetails = (owner: Owner) => {
    setSelectedOwner(owner);
    setEditingOwner({ ...owner });
    setShowForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingOwner) {
      const { name, value } = e.target;
      setEditingOwner((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdateOwner = async () => {
    if (!editingOwner || !selectedOwner) return;

    const updatedFields: Partial<Owner> = {};
    (Object.keys(editingOwner) as Array<keyof Owner>).forEach((key) => {
      if (editingOwner[key] !== selectedOwner[key]) {
        if (key === "hostels") {
          if (
            Array.isArray(editingOwner[key]) &&
            Array.isArray(selectedOwner[key])
          ) {
            if (
              editingOwner[key].length !== selectedOwner[key].length ||
              !editingOwner[key].every(
                (val, index) => val === selectedOwner[key][index]
              )
            ) {
              updatedFields[key] = editingOwner[key];
            }
          }
        } else if (key !== "_id") {
          updatedFields[key] = editingOwner[key] as string | undefined;
        }
      }
    });

    try {
      await axios.put(
        `http://localhost:5000/api/admin/owners`,
        {
          ownerId: selectedOwner._id,
          ...updatedFields,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOwners((prev) =>
        prev.map((owner) =>
          owner._id === selectedOwner._id
            ? { ...owner, ...updatedFields }
            : owner
        )
      );
      setShowForm(false);
      setSelectedOwner(null);
      setEditingOwner(null);
    } catch (error) {
      console.error("Error updating owner:", error);
    }
  };

  if (loading) {
    return <DataGalaxyLoader />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white min-h-screen">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8 text-black">Owners</h2>

      {/* Table view for larger screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Number
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Hostels
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {owners.map((owner) => (
              <tr
                key={owner._id}
                className="hover:bg-gray-50 transition duration-200 ease-in-out"
              >
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base font-medium text-black">
                  {owner.name}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-gray-500">
                  {owner.number}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-gray-500">
                  {owner.address || "N/A"}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-gray-500">
                  {owner.hostels.length}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base font-medium">
                  <button
                    onClick={() => handleViewDetails(owner)}
                    className="text-blue-600 hover:text-blue-500 transition duration-200 ease-in-out"
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
        {owners.map((owner) => (
          <div key={owner._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold text-black mb-2">
              {owner.name}
            </h3>
            <div className="text-sm sm:text-base text-gray-500">
              <p className="mb-1">
                <span className="font-medium">Number:</span> {owner.number}
              </p>
              <p className="mb-1">
                <span className="font-medium">Address:</span>{" "}
                {owner.address || "N/A"}
              </p>
              <p className="mb-1">
                <span className="font-medium">Hostels:</span>{" "}
                {owner.hostels.length}
              </p>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => handleViewDetails(owner)}
                className="text-blue-600 hover:text-blue-500 transition duration-200 ease-in-out"
              >
                <MdMoreVert size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit form (same for both views) */}
      {showForm && editingOwner && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md mx-4 overflow-auto max-h-[90vh]">
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-4">Edit Owner</h3>
            <form className="space-y-3">
              <div>
                <label className="block text-gray-600 text-sm sm:text-base">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingOwner.name || ""}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full bg-gray-100 border border-gray-300 rounded text-black text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm sm:text-base">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="number"
                  value={editingOwner.number || ""}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full bg-gray-100 border border-gray-300 rounded text-black text-sm sm:text-base"
                  pattern="[0-9]{10}"
                  placeholder="1234567890"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm sm:text-base">Address</label>
                <input
                  type="text"
                  name="address"
                  value={editingOwner.address || ""}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full bg-gray-100 border border-gray-300 rounded text-black text-sm sm:text-base"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={handleUpdateOwner}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm sm:text-base"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}