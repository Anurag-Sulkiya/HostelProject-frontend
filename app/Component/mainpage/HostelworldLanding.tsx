"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Users,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const HostelworldLanding = () => {
  const bubbles = [
    {
      text: "No Hidden Charges, No brokrage",
      top: "10%",
      right: "5%",
      image: "/Images/HomePage/student1.jpeg",
    },
    {
      text: "Your success needed focus",
      top: "35%",
      right: "15%",
      image: "/Images/HomePage/student2.jpeg",
    },
    {
      text: "Man or Women? we have space for both",
      top: "65%",
      right: "3%",
      image: "/Images/HomePage/student1.jpeg",
    },
  ];

  const avatars = [
    { top: "5%", right: "22%", image: "/Images/HomePage/student1.jpeg" },
    { top: "25%", right: "3%", image: "/Images/HomePage/student1.jpeg" },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    { src: "/Images/aspiringstudent.jpg", alt: "Hostel common area" },
    { src: "/Images/Beds.jpg", alt: "Travelers enjoying a meal" },
    { src: "/Images/Buildings.jpg", alt: "City exploration" },
    { src: "/Images/Genralmage1.jpg", alt: "Group activity" },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(nextImage, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[70vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: 'url("/Images/HomePage/COverImage.png")',
        }}
      />

      <div className="absolute inset-0 bg-black opacity-50 z-10" />

      <div className="relative z-20 text-white p-8 h-full flex flex-col justify-between">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold mb-2">
            Affordable living, Friendly and Safe Atmosphere
          </h1>
          <p className="text-lg">
            We suggest potentially lower costs and simpler processes by removal
            of middlemen.
          </p>
        </div>

        {bubbles.map((bubble, index) => (
          <div
            key={index}
            className="absolute"
            style={{ top: bubble.top, right: bubble.right }}
          >
            <div className="relative">
              <img
                src={bubble.image}
                alt="Avatar"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
            </div>
            <div className="mt-1 bg-purple-900 bg-opacity-80 rounded-lg px-2 py-1 text-xs whitespace-nowrap shadow-lg">
              {bubble.text}
            </div>
          </div>
        ))}

        {avatars.map((avatar, index) => (
          <div
            key={index}
            className="absolute"
            style={{ top: avatar.top, right: avatar.right }}
          >
            <div className="relative">
              <img
                src={avatar.image}
                alt="Avatar"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
            </div>
          </div>
        ))}

        <div className="bg-white rounded-full p-3 flex items-center space-x-4 mt-auto z-10 max-w-3xl mx-auto">
          <div className="flex-grow">
            <div className="flex items-center text-gray-500">
              <Search size={16} className="mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Find Your Hostel"
                className="w-full bg-transparent outline-none text-black text-sm"
              />
            </div>
          </div>
          <button className="bg-orange-500 text-white px-4 py-1 rounded-full flex items-center whitespace-nowrap text-sm">
            Let's go! <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostelworldLanding;
