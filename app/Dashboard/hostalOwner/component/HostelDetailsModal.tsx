"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  FaBed,
  FaUsers,
  FaMoneyBillWave,
  FaUtensils,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface HostelImage {
  contentType: string;
  data: string;
}

interface RentStructure {
  studentsPerRoom: number;
  rentPerStudent: number;
}

interface Feedback {
  rating: number;
  comment: string;
}

interface Hostel {
  _id: string;
  name: string;
  address: string;
  beds: number;
  studentsPerRoom: number;
  fetchedImages?: HostelImage[];
  food: boolean;
  verified: boolean;
  number?: string;
  rentStructure: RentStructure[];
  feedback?: Feedback[];
}

interface HostelDetailsModalProps {
  hostel: Hostel;
  isOpen: boolean;
  onClose: () => void;
}

const HostelDetailsModal: React.FC<HostelDetailsModalProps> = ({
  hostel,
  isOpen,
  onClose,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const IconText: React.FC<{
    icon: React.ElementType;
    text: string;
    gradient: string;
  }> = ({ icon: Icon, text, gradient }) => (
    <Box
      className={`flex items-center space-x-2 p-2 rounded-lg ${gradient} text-white`}
    >
      <Icon className="text-2xl" />
      <Typography variant="body1">{text}</Typography>
    </Box>
  );

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent className="bg-gradient-to-br from-gray-900 to-white text-white">
        <IconButton
          onClick={onClose}
          className="absolute top-2 right-2 text-white"
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h4" className="mb-4 text-cyan-400">
          {hostel.name} 🏢
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="w-full h-64 rounded-lg mb-4"
            >
              {hostel.fetchedImages && hostel.fetchedImages.length > 0 ? (
                hostel.fetchedImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={`data:${image.contentType};base64,${image.data}`}
                      alt={`${hostel.name} - ${index + 1}`}
                      className="w-full h-full object-cover object-center rounded-lg cursor-pointer"
                      onClick={() =>
                        setSelectedImage(
                          `data:${image.contentType};base64,${image.data}`
                        )
                      }
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

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <IconText
                  icon={FaBed}
                  text={`${hostel.beds} Beds`}
                  gradient="bg-gradient-to-r from-blue-500 to-cyan-500"
                />
              </Grid>
              <Grid item xs={6}>
                <IconText
                  icon={FaUsers}
                  text={`${hostel.studentsPerRoom} per room`}
                  gradient="bg-gradient-to-r from-purple-500 to-pink-500"
                />
              </Grid>
              <Grid item xs={6}>
                <IconText
                  icon={FaUtensils}
                  text={hostel.food ? "Food Available" : "No Food"}
                  gradient="bg-gradient-to-r from-yellow-500 to-orange-500"
                />
              </Grid>
              <Grid item xs={6}>
                <IconText
                  icon={hostel.verified ? FaCheckCircle : FaTimesCircle}
                  text={hostel.verified ? "Verified" : "Not Verified"}
                  gradient={`bg-gradient-to-r ${
                    hostel.verified
                      ? "from-green-500 to-emerald-500"
                      : "from-red-500 to-pink-500"
                  }`}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" className="mb-2 text-cyan-400">
              📍 Address
            </Typography>
            <Typography variant="body1" className="mb-4">
              {hostel.address}
            </Typography>

            <Typography variant="h6" className="mb-2 text-cyan-400">
              📞 Contact
            </Typography>
            <Typography variant="body1" className="mb-4">
              {hostel.number}
            </Typography>

            <Typography variant="h6" className="mb-2 text-cyan-400">
              💰 Rent Structure
            </Typography>
            {hostel.rentStructure.map((rent, index) => (
              <Box key={index} className="mb-2">
                <IconText
                  icon={FaMoneyBillWave}
                  text={`${rent.studentsPerRoom} Students: ₹${rent.rentPerStudent} per student`}
                  gradient="bg-gradient-to-r from-green-500 to-teal-500"
                />
              </Box>
            ))}

            <Typography variant="h6" className="mt-4 mb-2 text-cyan-400">
              ⭐ Feedback
            </Typography>
            {hostel.feedback && hostel.feedback.length > 0 ? (
              hostel.feedback.map((fb, index) => (
                <Box key={index} className="mb-2 p-2 bg-gray-800 rounded-lg">
                  <Typography variant="body2">
                    Rating: {"⭐".repeat(fb.rating)}
                  </Typography>
                  <Typography variant="body2">{fb.comment}</Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2">No feedback available</Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          maxWidth="lg"
        >
          <DialogContent className="bg-black">
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="w-full h-auto"
            />
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};

export default HostelDetailsModal;
