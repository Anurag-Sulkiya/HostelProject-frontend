"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HostelCard from "./HostelCard";
import { useSearchParams } from "next/navigation";
import MapComponent from "./MapComponent";
import HousingLandingPage from "./HousingLandingPage";

import FilterBar from "./FilterBar";
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Pagination,
} from "@mui/material";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Linkedin,
  Youtube,
} from "lucide-react";
import Lottie from "lottie-react";
import wait from "../../../public/wait.json";
import { Facebook, Instagram } from "@mui/icons-material";
import Image from "next/image";
import ContactPage from "./ContactPage";
import ImageGallery from "./ImageGallary";
import CenteredFeatureSlider from "./CenterFeatureSlider";
import MobileApp from "./MobileApp";
import HostelworldLanding from "./HostelworldLanding";
import HostelSearch from "./HostelSearch";

interface Hostel {
  _id: string;
  name: string;
  owner: string;
  number: string;
  address: string;
  hostelType: string;
  beds: number;
  studentsPerRoom: number;
  food: boolean;
  foodType?: string;
  mealOptions?: string[];
  images: {
    contentType: string;
    data: string;
  }[];
  wifi: boolean;
  ac: boolean;
  mess: boolean;
  solar: boolean;
  studyRoom: boolean;
  tuition: boolean;
  verified: boolean;
  paymentStatus: string;
  pendingVisits: {
    student: string;
    visitDate: Date;
    visitTime: string;
  }[];
  rentStructure: {
    studentsPerRoom: number;
    rentPerStudent: number;
  }[];
  feedback: {
    student: string;
    rating: number;
    comment: string;
    date: Date;
  }[];
  complaints: {
    student: string;
    description: string;
    isAnonymous: boolean;
    images: {
      data: string;
      contentType: string;
    }[];
    date: Date;
    status: string;
    complaintType: string;
  }[];
  latitude: number;
  longitude: number;
}

interface Filters {
  searchName: string;
  type: string;
  studentsPerRoom: string;
  food: boolean;
  verified: boolean;
  sortByRatings: boolean;
  rentRange: [number, number];
  wifi: boolean;
  ac: boolean;
  mess: boolean;
  solar: boolean;
  studyRoom: boolean;
  tuition: boolean;
}

const HomePage: React.FC = () => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [filteredHostels, setFilteredHostels] = useState<Hostel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    searchName: "",
    type: "All",
    studentsPerRoom: "Any",
    food: false,
    verified: false,
    sortByRatings: false,
    rentRange: [0, 10000],
    wifi: false,
    ac: false,
    mess: false,
    solar: false,
    studyRoom: false,
    tuition: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const hostelsPerPage = 10;

  const searchParams = useSearchParams();
  const filterRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const hostelListRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  interface GalleryImage {
    src: string;
    alt: string;
    title: string;
    description: string;
  }

  const images: GalleryImage[] = [
    {
      src: "/Images/Safe&Comfort.jpg",
      alt: "Hostel Exterior",
      title: "Modern Hostel Building",
      description:
        "Our state-of-the-art hostel facility with comfortable accommodations for students.",
    },
    {
      src: "/Images/MainRoom.jpg",
      alt: "Clean Room",
      title: "Spotless Living Spaces",
      description:
        "We maintain the highest standards of cleanliness and hygiene in all our rooms.",
    },
    {
      src: "/Images/Liabrary.jpg",
      alt: "Cleaning Supplies",
      title: "Well-Equipped for Cleanliness",
      description:
        "All necessary cleaning supplies are provided to maintain a healthy living environment.",
    },
    {
      src: "/Images/spacious.jpg",
      alt: "Common Area",
      title: "Vibrant Common Spaces",
      description:
        "Our common areas are designed to foster community and collaboration among residents.",
    },
    {
      src: "/Images/Successful.jpg",
      alt: "Student Group",
      title: "Diverse Student Community",
      description:
        "Join a diverse and friendly community of students from various backgrounds.",
    },
    {
      src: "/Images/Bedroom.jpg",
      alt: "Spacious Room",
      title: "Roomy Accommodations",
      description:
        "Enjoy spacious rooms that provide comfort and privacy for your studies and relaxation.",
    },
  ];

  const fetchHostels = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/hostels/all");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const hostelsWithPhotos = await Promise.all(
        data.map(async (hostel: Hostel) => {
          try {
            const photoResponse = await fetch(
              `http://localhost:5000/api/hostels/gethostalphotos/${hostel._id}`
            );
            if (!photoResponse.ok) {
              throw new Error(`HTTP error! status: ${photoResponse.status}`);
            }
            const photos = await photoResponse.json();
            return {
              ...hostel,
              images: photos,
              id: hostel._id,
              latitude: hostel.latitude || 0,
              longitude: hostel.longitude || 0,
            };
          } catch (photoError) {
            console.error("Error fetching hostel photos:", photoError);
            return {
              ...hostel,
              images: [],
              id: hostel._id,
              latitude: hostel.latitude || 0,
              longitude: hostel.longitude || 0,
            };
          }
        })
      );

      setHostels(hostelsWithPhotos);
      setFilteredHostels(hostelsWithPhotos);
    } catch (error) {
      console.error("Error fetching hostels:", error);
      setError("Error fetching hostels");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHostels();
  }, [fetchHostels]);

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setFilters((prevFilters) => ({ ...prevFilters, searchName: query }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (filterRef.current) {
      const filterHeight = filterRef.current.offsetHeight;
      document.body.style.paddingTop = `${filterHeight}px`;
    }
  }, []);
  const handleFilter = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  const LoaderComponent = () => {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex justify-center items-center z-50">
        <div className="w-90 h-90 justify-center">
          {/* <Lottie animationData={wait} loop={true} autoplay={true} /> */}
        </div>
      </div>
    );
  };

  const NoHostelsFound = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-64"
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-400 mb-4"
        animate={{
          rotate: [0, 10, -10, 10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </motion.svg>
      <motion.h2
        className="text-2xl font-semibold text-gray-700 mb-2"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        No Hostels Found
      </motion.h2>
      <p className="text-gray-500">
        Try adjusting your filters or search criteria.
      </p>
    </motion.div>
  );

  useEffect(() => {
    const handleScroll = () => {
      if (
        mapContainerRef.current &&
        hostelListRef.current &&
        paginationRef.current
      ) {
        const scrollY = window.scrollY;
        const headerHeight = 220; // Adjust this value based on your actual header height
        const hostelListRect = hostelListRef.current.getBoundingClientRect();
        const paginationRect = paginationRef.current.getBoundingClientRect();
        const mapHeight = mapContainerRef.current.offsetHeight;
        const windowHeight = window.innerHeight;

        // Calculate the point where the map should start scrolling
        const scrollStartPoint =
          hostelListRect.top + window.scrollY - headerHeight;

        if (scrollY >= scrollStartPoint) {
          // Fix the map to the top when scrolling starts
          mapContainerRef.current.style.position = "fixed";
          mapContainerRef.current.style.top = `${headerHeight}px`;
          mapContainerRef.current.style.width = `${mapContainerRef.current.offsetWidth}px`;

          // Calculate the distance from the bottom of the map to the top of the pagination
          const distanceToPagination =
            paginationRect.top - (headerHeight + mapHeight);

          if (distanceToPagination < 0) {
            // Start moving the map up when it's about to overlap with the pagination
            const moveUpAmount = Math.min(
              Math.abs(distanceToPagination),
              mapHeight
            );
            mapContainerRef.current.style.transform = `translateY(-${moveUpAmount}px)`;
          } else {
            // Keep the map at the top
            mapContainerRef.current.style.transform = "translateY(0)";
          }
        } else {
          // Reset styles when scrolled above the start point
          mapContainerRef.current.style.position = "static";
          mapContainerRef.current.style.transform = "translateY(0)";
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const indexOfLastHostel = currentPage * hostelsPerPage;
  const indexOfFirstHostel = indexOfLastHostel - hostelsPerPage;
  const currentHostels = filteredHostels.slice(
    indexOfFirstHostel,
    indexOfLastHostel
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  const handleSearch = useCallback((query: string, location: string) => {
    setFilters((prev) => ({ ...prev, searchName: query }));
    if (hostelListRef.current) {
      hostelListRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  useEffect(() => {
    if (hostels.length > 0) {
      let result = hostels;

      // Apply all filters
      if (filters.searchName.trim() !== "") {
        const searchLower = filters.searchName.toLowerCase();
        result = result.filter(
          (hostel) =>
            hostel.name.toLowerCase().includes(searchLower) ||
            hostel.address.toLowerCase().includes(searchLower) ||
            hostel.owner.toLowerCase().includes(searchLower)
        );
      }

      if (filters.type !== "All") {
        result = result.filter(
          (hostel) =>
            hostel.hostelType.toLowerCase() === filters.type.toLowerCase()
        );
      }

      if (filters.studentsPerRoom !== "Any") {
        const studentsPerRoom = parseInt(filters.studentsPerRoom);
        result = result.filter((hostel) => {
          if (studentsPerRoom === 3) {
            return hostel.studentsPerRoom >= 3;
          }
          return hostel.studentsPerRoom === studentsPerRoom;
        });
      }

      if (filters.food) {
        result = result.filter((hostel) => hostel.food);
      }

      if (filters.verified) {
        result = result.filter((hostel) => hostel.verified);
      }

      if (filters.rentRange[0] > 0 || filters.rentRange[1] < 10000) {
        result = result.filter((hostel) => {
          const lowestRent = Math.min(
            ...hostel.rentStructure.map((r) => r.rentPerStudent)
          );
          return (
            lowestRent >= filters.rentRange[0] &&
            lowestRent <= filters.rentRange[1]
          );
        });
      }

      // Apply new filters
      if (filters.wifi) result = result.filter((hostel) => hostel.wifi);
      if (filters.ac) result = result.filter((hostel) => hostel.ac);
      if (filters.mess) result = result.filter((hostel) => hostel.mess);
      if (filters.solar) result = result.filter((hostel) => hostel.solar);
      if (filters.studyRoom)
        result = result.filter((hostel) => hostel.studyRoom);
      if (filters.tuition) result = result.filter((hostel) => hostel.tuition);

      if (filters.sortByRatings) {
        result.sort((a, b) => {
          const ratingA =
            a.feedback.reduce((sum, f) => sum + f.rating, 0) /
              a.feedback.length || 0;
          const ratingB =
            b.feedback.reduce((sum, f) => sum + f.rating, 0) /
              b.feedback.length || 0;
          return ratingB - ratingA;
        });
      }

      setFilteredHostels(result);
      setCurrentPage(1);
    }
  }, [hostels, filters]);
  return (
    <div>
      <div className="sticky top-0 z-10 bg-white">
        {/* <HostelworldLanding /> */}
        <HostelSearch />
        <FilterBar
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />
      </div>
      <CenteredFeatureSlider />
      {isLoading ? (
        <LoaderComponent />
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div ref={hostelListRef} className="w-full md:w-2/3">
              <AnimatePresence>
                {currentHostels.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {currentHostels.map((hostel, index) => (
                      <motion.div
                        key={hostel._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                        style={{ minHeight: "200px" }}
                      >
                        <HostelCard
                          id={hostel._id}
                          images={hostel.images}
                          name={hostel.name}
                          owner={hostel.owner}
                          number={hostel.number}
                          address={hostel.address}
                          hostelType={hostel.hostelType}
                          food={hostel.food}
                          foodType={hostel.foodType}
                          mealOptions={hostel.mealOptions}
                          beds={hostel.beds}
                          studentsPerRoom={hostel.studentsPerRoom}
                          rentStructure={hostel.rentStructure}
                          isVerified={hostel.verified}
                          feedback={hostel.feedback}
                          ratings={
                            hostel.feedback.reduce(
                              (sum, f) => sum + f.rating,
                              0
                            ) / hostel.feedback.length || 0
                          }
                          wifi={hostel.wifi}
                          ac={hostel.ac}
                          mess={hostel.mess}
                          solar={hostel.solar}
                          studyRoom={hostel.studyRoom}
                          tuition={hostel.tuition}
                          paymentStatus={hostel.paymentStatus}
                          pendingVisits={hostel.pendingVisits}
                          complaints={hostel.complaints}
                          onWishlistToggle={(id, isInWishlist) => {
                            console.log(
                              `Toggled wishlist for ${id}: ${isInWishlist}`
                            );
                          }}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <NoHostelsFound />
                )}
              </AnimatePresence>
              <div ref={paginationRef} className="mt-8 flex justify-center">
                <Pagination
                  count={Math.ceil(filteredHostels.length / hostelsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </div>
            </div>
            <div className="w-full md:w-1/3 relative">
              <div ref={mapContainerRef}>
                <MobileApp />
              </div>
            </div>
          </div>
        </div>
      )}
      <main className="container mx-auto p-4" ref={galleryRef}>
        <h1 className="text-2xl font-bold mb-4">Our Hostel Gallery</h1>
        <div className="image-gallery">
          <ImageGallery images={images} />
        </div>
      </main>
      <ContactPage />
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-4 md:mb-0">
              <Image
                src={"/Images/HostelLogo4.png"}
                alt="Stanza Living"
                width={150}
                height={50}
                className="rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col space-y-2">
                <h3 className="font-semibold text-white">About Us</h3>
                <a href="#" className="text-gray-300 hover:text-white">
                  Team
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  Investor Relations
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  Media
                </a>
              </div>
              <div className="flex flex-col space-y-2">
                <h3 className="font-semibold text-white">Blogs</h3>
                <a href="#" className="text-gray-300 hover:text-white">
                  FAQs
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  Refer and Earn
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  House Rules
                </a>
              </div>
              <div className="flex flex-col space-y-2">
                <h3 className="font-semibold text-white">T&C</h3>
                <a href="#" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  Contact Us
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  COVID-19
                </a>
              </div>
              <div className="flex flex-col space-y-2">
                <h3 className="font-semibold text-white">Partner With Us</h3>
                <a href="#" className="text-gray-300 hover:text-white">
                  Cookie Policy
                </a>
              </div>
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" aria-label="Facebook">
                <Facebook className="text-white hover:text-blue-500" />
              </a>
              <a href="#" aria-label="LinkedIn">
                <Linkedin className="text-white hover:text-blue-700" />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram className="text-white hover:text-pink-500" />
              </a>
              <a href="#" aria-label="YouTube">
                <Youtube className="text-white hover:text-red-600" />
              </a>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>
              Copyright © 2024 | All Rights Reserved by Dtwelve Spaces Pvt Ltd.
              |{" "}
              <a href="#" className="hover:text-white">
                Sitemap
              </a>
            </p>
            <p className="mt-2 md:mt-0">
              Images shown are for representational purposes only. Amenities
              depicted may or may not form a part of that individual property.
            </p>
          </div>
        </div>
        <div className="fixed bottom-4 right-4">
          <a href="#" aria-label="WhatsApp">
            <div className="bg-green-500 p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
