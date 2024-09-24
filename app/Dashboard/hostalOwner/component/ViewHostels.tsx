"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios, { AxiosError } from "axios";
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import debounce from "lodash/debounce";
import {
  FaBed,
  FaBuilding,
  FaEdit,
  FaTrash,
  FaUsers,
  FaMoneyBillWave,
  FaInfoCircle,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HostelDetailsModal from "./HostelDetailsModal";

interface Feedback {
  user: string;
  rating: number;
  comment: string;
}

interface RentStructure {
  studentsPerRoom: number;
  rentPerStudent: number;
}

interface Hostel {
  _id: string;
  name: string;
  address: string;
  hostelType: "boys" | "girls";
  beds: number;
  studentsPerRoom: number;
  paymentStatus: "pending" | "paid";
  number: string;
  food: boolean;
  verified: boolean;
  feedback?: Feedback[];
  fetchedImages?: { contentType: string; data: string }[];
  rentStructure: RentStructure[];
}

interface UpdateData extends Omit<Hostel, "_id" | "verified" | "feedback"> {
  images: (string | File)[];
  rentStructure: any[];
}

interface HostelCardProps {
  hostel: Hostel;
  onUpdate: (hostel: Hostel) => void;
  onDelete: (id: string) => void;
}
const HostelCard: React.FC<HostelCardProps> = React.memo(
  ({ hostel, onUpdate, onDelete }) => {
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    return (
      <>
        "
        <div className="bg-gradient-to-r from-white-500 to-white-500 p-6 rounded-xl shadow-2xl flex flex-col md:flex-row w-full border border-gray-700 hover:border-cyan-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-cyan-500/20">
          "
          <div className="md:w-1/3 flex justify-center md:justify-start items-center mb-4 md:mb-0">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="w-full md:w-64 h-48 md:h-auto rounded-lg shadow-lg"
            >
              {hostel.fetchedImages && hostel.fetchedImages.length > 0 ? (
                hostel.fetchedImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={`data:${image.contentType};base64,${image.data}`}
                      alt={`${hostel.name} - ${index + 1}`}
                      className="w-full h-full object-cover object-center rounded-lg"
                    />
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className="w-full h-full flex items-center justify-center bg-gray-700 rounded-lg">
                    <p className="text-gray-400">No images available</p>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
          </div>
          <div className="md:w-2/3 md:pl-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-semibold text-cyan-400">
                  {hostel.name}
                </h3>
                <div className="space-x-2">
                  <button
                    onClick={() => onUpdate(hostel)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(hostel._id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => setDetailsModalOpen(true)}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-4 py-2 rounded-full flex items-center space-x-2 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
                  >
                    <FaInfoCircle />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
              <p className="text-sm text-black-400 mb-4">{hostel.address}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 mb-2">
                  <FaUsers className="text-blue-400 text-xl" />
                  <p className="text-sm text-black-300">
                    <span className="font-semibold text-white">
                      {hostel.beds}
                    </span>{" "}
                    Beds
                  </p>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <FaBed className="text-cyan-400 text-xl" />
                  <p className="text-sm text-black-300">
                    <span className="font-semibold text-white">
                      {hostel.paymentStatus}
                    </span>{" "}
                    Payment
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <FaBed className="text-cyan-400 text-xl" />
                  <p className="text-sm text-black-500">
                    <span className="font-semibold text-black">
                      {hostel.food ? "Available" : "Not Available"}
                    </span>{" "}
                    Food
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-black-400">
                Contact: <span className="text-white">{hostel.number}</span>
              </p>
              <div className="flex items-center">
                <p className="text-sm text-gray-400 mr-2">Verified:</p>
                <span
                  className={`w-3 h-3 rounded-full ${
                    hostel.verified ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-lg font-semibold text-black-400 mb-2">
                Rent Structure
              </h4>
              {hostel.rentStructure.map((rent, index) => (
                <div key={index} className="flex items-center gap-3 mb-2">
                  <FaMoneyBillWave className="text-black-400 text-xl" />
                  <p className="text-sm text-black-300">
                    <span className="font-semibold text-white">
                      {rent.studentsPerRoom}
                    </span>{" "}
                    Students:
                    <span className="font-semibold text-black ml-2">
                      ₹{rent.rentPerStudent}
                    </span>{" "}
                    per student
                  </p>
                </div>
              ))}
            </div>
          </div>
          <HostelDetailsModal
            hostel={hostel}
            isOpen={detailsModalOpen}
            onClose={() => setDetailsModalOpen(false)}
          />
        </div>
      </>
    );
  }
);

const ViewHostels: React.FC = () => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [updateData, setUpdateData] = useState<UpdateData>({
    name: "",
    address: "",
    hostelType: "boys",
    beds: 0,
    studentsPerRoom: 0,
    paymentStatus: "pending",
    number: "",
    food: false,
    images: [],
    rentStructure: [],
  });

  const fetchOwnerHostels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const profileId = localStorage.getItem("profileId");
      const token = localStorage.getItem("token");
      if (!profileId || !token) throw new Error("Authentication error");

      const hostelResponse = await axios.get(
        `http://localhost:5000/api/hostels/${profileId}/hostels`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const hostels = hostelResponse.data.hostels;
      setHostels(hostels);

      hostels.forEach(async (hostel: any) => {
        try {
          const token = localStorage.getItem("token");
          const imageResponse = await axios.get(
            `http://localhost:5000/api/hostels/gethostalphotos/${hostel._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setHostels((prevHostels) =>
            prevHostels.map((h) =>
              h._id === hostel._id
                ? { ...h, fetchedImages: imageResponse.data }
                : h
            )
          );
        } catch (error) {
          console.error(
            `Error fetching images for hostel ${hostel._id}`,
            error
          );
          toast.error(`Failed to load images for hostel ${hostel.name}`);
        }
      });
    } catch (error) {
      console.error("Error fetching owner's hostels:", error);
      setError("Failed to fetch hostels. Please try again later.");
      toast.error("Failed to fetch hostels. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOwnerHostels();
  }, [fetchOwnerHostels]);

  const handleUpdateClick = useCallback((hostel: Hostel) => {
    setSelectedHostel(hostel);
    setUpdateData({
      name: hostel.name,
      address: hostel.address,
      hostelType: hostel.hostelType,
      beds: hostel.beds,
      studentsPerRoom: hostel.studentsPerRoom,
      paymentStatus: hostel.paymentStatus,
      number: hostel.number,
      food: hostel.food,
      images: hostel.fetchedImages
        ? hostel.fetchedImages.map(
            (image) =>
              new File([image.data], `${hostel.name}-${image.contentType}`, {
                type: image.contentType,
              })
          )
        : [],
      rentStructure: hostel.rentStructure || [],
    });
    setOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setSelectedHostel(null);
  }, []);

  const handleUpdateHostel = useCallback(async () => {
    if (!selectedHostel) return;

    try {
      const formData = new FormData();
      Object.entries(updateData).forEach(([key, value]) => {
        if (key === "images") {
          // Append each image file to FormData
          (value as (string | File)[]).forEach((item, index) => {
            if (item instanceof File) {
              formData.append("images", item); // Note: Use "images" as the key
            } else if (typeof item === "string") {
              formData.append("images", item); // This is if you have URLs or data strings, but usually, you'd only send File objects
            }
          });
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value)); // Handle arrays by converting to JSON
        } else {
          formData.append(key, value.toString()); // Handle other types
        }
      });

      formData.append("hostelId", selectedHostel._id);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication error");

      const response = await axios.put(
        `http://localhost:5000/api/hostels/update-hostel`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setHostels((prevHostels) =>
        prevHostels.map((hostel) =>
          hostel._id === selectedHostel._id ? response.data : hostel
        )
      );
      fetchOwnerHostels();
      handleCloseModal();
      toast.success("Hostel updated successfully!");
    } catch (error) {
      console.error("Error updating hostel:", error);
      toast.error("Failed to update hostel. Please try again later.");
    }
  }, [selectedHostel, updateData, handleCloseModal]);

  const handleDeleteHostel = useCallback(async (id: string) => {
    try {
      const profileId = localStorage.getItem("profileId");
      const token = localStorage.getItem("token");
      if (!profileId || !token) throw new Error("Authentication error");

      await axios.delete(`http://localhost:5000/api/hostels/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHostels((prevHostels) =>
        prevHostels.filter((hostel) => hostel._id !== id)
      );
      toast.success("Hostel deleted successfully!");
    } catch (error) {
      console.error("Error deleting hostel:", error);

      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          `Failed to delete hostel: ${
            error.response.data.message || error.message
          }`
        );
      } else {
        toast.error("Failed to delete hostel. Please try again later.");
      }
    }
  }, []);

  const debouncedFetchOwnerHostels = useCallback(
    debounce(fetchOwnerHostels, 300), // Adjust the delay as needed
    []
  );

  useEffect(() => {
    return () => {
      // Call the cancel method on the debounced function
      debouncedFetchOwnerHostels.cancel();
    };
  }, [debouncedFetchOwnerHostels]);

  return (
    <div className="flex flex-col items-center space-y-8 mx-8 md:mx-12 lg:mx-24 xl:mx-48 mb-24">
      <ToastContainer position="top-right" autoClose={5000} />
      {isLoading ? (
        <CircularProgress color="primary" />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : hostels.length === 0 ? (
        <p className="text-gray-500">No hostels found.</p>
      ) : (
        hostels.map((hostel) => (
          <HostelCard
            key={hostel._id}
            hostel={hostel}
            onUpdate={handleUpdateClick}
            onDelete={handleDeleteHostel}
          />
        ))
      )}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Update Hostel</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              label="Name"
              fullWidth
              value={updateData.name}
              onChange={(e) =>
                setUpdateData((prevData) => ({
                  ...prevData,
                  name: e.target.value,
                }))
              }
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Address"
              fullWidth
              value={updateData.address}
              onChange={(e) =>
                setUpdateData((prevData) => ({
                  ...prevData,
                  address: e.target.value,
                }))
              }
              margin="normal"
              variant="outlined"
            />
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Hostel Type</InputLabel>
              <Select
                value={updateData.hostelType}
                onChange={(e) =>
                  setUpdateData((prevData) => ({
                    ...prevData,
                    hostelType: e.target.value as "boys" | "girls",
                  }))
                }
                label="Hostel Type"
              >
                <MenuItem value="boys">Boys</MenuItem>
                <MenuItem value="girls">Girls</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Beds"
              fullWidth
              type="number"
              value={updateData.beds}
              onChange={(e) =>
                setUpdateData((prevData) => ({
                  ...prevData,
                  beds: Number(e.target.value),
                }))
              }
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Students Per Room"
              fullWidth
              type="number"
              value={updateData.studentsPerRoom}
              onChange={(e) =>
                setUpdateData((prevData) => ({
                  ...prevData,
                  studentsPerRoom: Number(e.target.value),
                }))
              }
              margin="normal"
              variant="outlined"
            />

            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={updateData.paymentStatus}
                onChange={(e) =>
                  setUpdateData((prevData) => ({
                    ...prevData,
                    paymentStatus: e.target.value as "pending" | "paid",
                  }))
                }
                label="Payment Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Contact Number"
              fullWidth
              value={updateData.number}
              onChange={(e) =>
                setUpdateData((prevData) => ({
                  ...prevData,
                  number: e.target.value,
                }))
              }
              margin="normal"
              variant="outlined"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={updateData.food}
                  onChange={(e) =>
                    setUpdateData((prevData) => ({
                      ...prevData,
                      food: e.target.checked,
                    }))
                  }
                  name="food"
                  color="primary"
                />
              }
              label="Food Available"
            />
            <TextField
              label="Images"
              fullWidth
              type="file"
              onChange={(e) => {
                if (`e.target.files`) {
                  setUpdateData((prevData) => ({
                    ...prevData,
                    images: [
                      `...prevData.images, ...Array.from(e.target.files)`,
                    ],
                  }));
                }
              }}
              margin="normal"
              variant="outlined"
              inputProps={{ multiple: true }}
            />
            <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
              Rent Structure
            </Typography>
            {updateData.rentStructure.map((rent, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                marginBottom={2}
              >
                <TextField
                  label="Students per Room"
                  type="number"
                  value={rent.studentsPerRoom}
                  onChange={(e) => {
                    const newRentStructure = [...updateData.rentStructure];
                    newRentStructure[index].studentsPerRoom = Number(
                      e.target.value
                    );
                    setUpdateData({
                      ...updateData,
                      rentStructure: newRentStructure,
                    });
                  }}
                  margin="dense"
                  variant="outlined"
                  style={{ marginRight: "10px" }}
                />
                <TextField
                  label="Rent per Student"
                  type="number"
                  value={rent.rentPerStudent}
                  onChange={(e) => {
                    const newRentStructure = [...updateData.rentStructure];
                    newRentStructure[index].rentPerStudent = Number(
                      e.target.value
                    );
                    setUpdateData({
                      ...updateData,
                      rentStructure: newRentStructure,
                    });
                  }}
                  margin="dense"
                  variant="outlined"
                  style={{ marginRight: "10px" }}
                />
                <IconButton
                  onClick={() => {
                    const newRentStructure = updateData.rentStructure.filter(
                      (_, i) => i !== index
                    );
                    setUpdateData({
                      ...updateData,
                      rentStructure: newRentStructure,
                    });
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => {
                const newRentStructure = [
                  ...updateData.rentStructure,
                  { studentsPerRoom: 1, rentPerStudent: 0 },
                ];
                setUpdateData({
                  ...updateData,
                  rentStructure: newRentStructure,
                });
              }}
              variant="outlined"
              style={{ marginTop: "10px" }}
            >
              Add Rent Structure
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateHostel}
            color="primary"
            variant="contained"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewHostels;
