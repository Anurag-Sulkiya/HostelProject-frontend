"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ChevronLeft,
  ThumbsUp,
  Home,
  Coffee,
  Lock,
  Clock as Stay,
  Pizza,
  CreditCard,
  TicketIcon,
  Dumbbell,
  ChevronRight,
  Wifi,
} from "lucide-react";
import { gsap } from "gsap";
import { Sun } from "lucide-react";

const MobileApp = () => {
  const [currentScreen, setCurrentScreen] = useState("support");
  const [currentHomeSlide, setCurrentHomeSlide] = useState(0);
  const [currentSupportSlide, setCurrentSupportSlide] = useState(0);
  const appRef = useRef(null);
  const supportRef = useRef(null);
  const homeRef = useRef(null);

  const homeSlides = [
    {
      title: "Welcome to Latur Hostel",
      description: "Your home away from home",
    },
    { title: "Explore Amenities", description: "Discover what we offer" },
    { title: "Stay Connected", description: "Join our community events" },
  ];
  const slideColors = [
    "bg-blue-100", // Color for the first slide
    "bg-green-100", // Color for the second slide
    "bg-yellow-100", // Color for the third slide
  ];

  const supportSlides = [
    { title: "24/7 Support", description: "We're here to help anytime" },
    {
      title: "Quick Resolutions",
      description: "Fast and efficient problem-solving",
    },
    { title: "FAQ Section", description: "Find answers to common questions" },
  ];

  useEffect(() => {
    const app = appRef.current;
    const support = supportRef.current;
    const home = homeRef.current;

    gsap.set([app, support, home], { autoAlpha: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(app, { autoAlpha: 1, duration: 1 }).to(support, {
      autoAlpha: 1,
      y: 0,
      duration: 0.5,
    });

    setTimeout(() => {
      gsap.to(support, { autoAlpha: 0, y: 50, duration: 0.5 });
      gsap.to(home, { autoAlpha: 1, y: 0, duration: 0.5, delay: 0.5 });
      setCurrentScreen("home");
    }, 5000);

    const homeInterval = setInterval(() => {
      setCurrentHomeSlide((prevSlide) => (prevSlide + 1) % homeSlides.length);
    }, 3000);

    const supportInterval = setInterval(() => {
      setCurrentSupportSlide(
        (prevSlide) => (prevSlide + 1) % supportSlides.length
      );
    }, 3000);

    return () => {
      clearInterval(homeInterval);
      clearInterval(supportInterval);
    };
  }, [homeSlides.length, supportSlides.length]);

  const Slider = ({ slides, currentSlide }) => (
    <div className="mt-0 mb-4 relative h-32 bg-teal-100 rounded-lg overflow-hidden">
      {slides.map(
        (
          slide: {
            title:
              | string
              | number
              | bigint
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | Promise<React.AwaitedReactNode>
              | null
              | undefined;
            description:
              | string
              | number
              | bigint
              | boolean
              | React.ReactElement<
                  any,
                  string | React.JSXElementConstructor<any>
                >
              | Iterable<React.ReactNode>
              | React.ReactPortal
              | Promise<React.AwaitedReactNode>
              | null
              | undefined;
          },
          index: React.Key | null | undefined
        ) => (
          <div
            key={index}
            className={`absolute inset-0 flex flex-col justify-center items-center transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <h2 className="text-xl font-semibold">{slide.title}</h2>
            <p className="text-sm">{slide.description}</p>
          </div>
        )
      )}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
        {slides.map((_: any, index: React.Key | null | undefined) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full mx-1 ${
              index === currentSlide ? "bg-teal-500" : "bg-teal-300"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );

  const SupportScreen = () => (
    <div ref={supportRef} className="absolute inset-0 pt-12 pb-20 px-4">
      <div className="flex justify-between items-center mb-4">
        <ChevronLeft size={24} />
        <h1 className="text-xl font-semibold">Support</h1>
        <span className="text-teal-500 text-sm">Ticket History</span>
      </div>

      <Slider slides={supportSlides} currentSlide={currentSupportSlide} />

      <div className="bg-gray-100 rounded-full p-2 mb-4 flex items-center">
        <Search size={20} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Type to search for assistance..."
          className="bg-transparent w-full outline-none text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {[
          "Food",
          "Internet",
          "Payments",
          "Security",
          "Electricity",
          "Housekeeping",
        ].map((tag) => (
          <span
            key={tag}
            className="bg-gray-100 rounded-full px-3 py-1 text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="bg-gray-100 rounded-lg p-4 mb-4">
        <h2 className="font-semibold mb-2">Popular help topics</h2>
        {[
          "Issue with a recent service",
          "Food related issues",
          "A guide to Stanza users",
          "How to change delivery timing?",
          "What to do when I receive cold food?",
        ].map((topic) => (
          <div
            key={topic}
            className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
          >
            <span className="text-sm">{topic}</span>
            <ChevronLeft size={16} className="transform rotate-180" />
          </div>
        ))}
        <button className="text-teal-500 text-sm mt-2">Show more</button>
      </div>

      <button className="bg-teal-500 text-white rounded-full py-2 px-4 text-sm flex items-center">
        <span className="mr-2">Raise a complaint</span>
      </button>
    </div>
  );

  const HomeScreen = () => (
    <div ref={homeRef} className="absolute inset-0 pt-12 pb-20 px-4">
      {/* Slider Section */}
      <div className="mb-4 relative h-32 rounded-lg overflow-hidden">
        {homeSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex flex-col justify-center items-center transition-opacity duration-500 ${
              slideColors[index]
            } ${index === currentHomeSlide ? "opacity-100" : "opacity-0"}`}
          >
            <h2 className="text-xl font-semibold">{slide.title}</h2>
            <p className="text-sm">{slide.description}</p>
          </div>
        ))}
      </div>

      {/* Services Section */}
      <div className="bg-gray-100 rounded-lg p-4 mb-4">
        <h2 className="font-semibold mb-2">Our Services</h2>
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white rounded-lg p-4 shadow text-left flex items-center">
            <Sun className="text-yellow-500 mr-2" size={24} />
            <span className="font-medium">Solar</span>
          </button>

          <button className="bg-white rounded-lg p-4 shadow text-left flex items-center">
            <Home className="text-green-500 mr-2" size={24} />
            <span className="font-medium">Amenities</span>
          </button>

          <button className="bg-white rounded-lg p-4 shadow text-left flex items-center">
            <TicketIcon className="text-blue-500 mr-2" size={24} />
            <span className="font-medium">Mess</span>
          </button>

          <button className="bg-white rounded-lg p-4 shadow text-left flex items-center">
            <Wifi className="text-purple-500 mr-2" size={24} />
            <span className="font-medium">WiFi</span>
          </button>
        </div>
      </div>

      {/* Steps Section */}
      <div className="bg-teal-100 rounded-lg p-4">
        <h2 className="font-semibold mb-2">Follow these Steps</h2>
        <ul className="space-y-2">
          <li className="flex justify-between items-center">
            <span>Register</span>
            <ChevronRight size={16} />
          </li>
          <li className="flex justify-between items-center">
            <span>Login</span>
            <ChevronRight size={16} />
          </li>
          <li className="flex justify-between items-center">
            <span>Shortlist Hostel</span>
            <ChevronRight size={16} />
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center h-screen bg-teal-100">
      <div
        ref={appRef}
        className="relative w-[320px] h-[650px] bg-black rounded-[40px] p-2 shadow-xl"
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 w-[160px] h-[30px] bg-black rounded-b-[20px] transform -translate-x-1/2 z-10"></div>

        {/* Screen */}
        <div className="w-full h-full bg-white rounded-[35px] overflow-hidden relative">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-[44px] bg-white flex items-center justify-between px-6 text-black z-20">
            <span className="text-sm font-semibold">9:41 AM</span>
            <div className="flex items-center space-x-1">
              <div className="w-6 h-3 bg-black rounded-sm relative">
                <div className="absolute right-[2px] top-[2px] bottom-[2px] left-[9px] bg-white rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Content */}
          {currentScreen === "support" ? <SupportScreen /> : <HomeScreen />}
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-2 left-2 right-2 h-[60px] bg-gray-800 rounded-[30px] flex justify-around items-center">
          <Home size={24} className="text-white" />
          <Coffee size={24} className="text-white" />
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center -mt-6">
            <Lock size={24} className="text-white" />
          </div>
          <Stay size={24} className="text-white" />
          <Coffee size={24} className="text-white" />
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-teal-300 rounded-full -translate-x-1/2 -translate-y-1/2 -z-10"></div>
      <div className="absolute bottom-10 right-10">
        <div className="bg-white rounded-full p-4 shadow-lg">
          <ThumbsUp size={32} className="text-teal-500" />
        </div>
      </div>
    </div>
  );
};

export default MobileApp;
