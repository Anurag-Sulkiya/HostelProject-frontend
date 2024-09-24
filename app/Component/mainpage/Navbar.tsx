"use client";
import React, { useState, useEffect, useCallback, MouseEvent } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Modal,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import HomeIcon from "@mui/icons-material/Home";
import ApartmentIcon from "@mui/icons-material/Apartment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Hand } from "lucide-react";
import ExploreIcon from "@mui/icons-material/Explore";
import { useRouter } from "next/navigation";

import axios from "axios";

import NotificationsIcon from "@mui/icons-material/Notifications";
// import LoginPopUp from "@/app/login/LoginPopUp";
import Image from "next/image";
// import UserProfile from "./UserProfile";

interface HostelOwnerCTAProps {
  router: ReturnType<typeof useRouter>;
}

interface UserProfileProps {
  open: boolean;
  onClose: () => void;
  userEmail: string;
  userRole: string;
  userPassword?: string;
}

const Navbar: React.FC = () => {
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateUserInfo = useCallback(() => {
    if (isClient) {
      const email = localStorage.getItem("email");
      const role = localStorage.getItem("role");
      const id = localStorage.getItem("profileId");
      const token = localStorage.getItem("token");

      if (role && id && token) {
        if (role === "student") {
          setUserEmail(email);
        }
        setUserRole(role);
        setProfileId(id);
        setIsLoggedIn(true);
      } else {
        setUserEmail(null);
        setUserRole(null);
        setProfileId(null);
        setIsLoggedIn(false);
      }
    }
  }, [isClient]);

  const handleLoginClick = () => {
    setLoginModalOpen(true);
    document.body.classList.add("blur-background");
  };

  const handleCloseLoginModal = () => {
    setLoginModalOpen(false);
    document.body.classList.remove("blur-background");
  };
  const fetchWishlistCount = useCallback(async () => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("profileId");
    if (token && id && userRole === "student") {
      try {
        const response = await fetch(
          `https://hostelbackend-1.onrender.com/api/students/wishlist/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setWishlistCount(data.length);
        } else {
          console.error("Failed to fetch wishlist");
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    }
  }, [userRole]);

  useEffect(() => {
    updateUserInfo();
    fetchWishlistCount();

    const handleStorageChange = () => {
      updateUserInfo();
      fetchWishlistCount();
    };

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(() => {
      updateUserInfo();
      fetchWishlistCount();
    }, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [updateUserInfo, fetchWishlistCount]);

  const handleWishlistClick = () => {
    router.push("/wishlist");
  };

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setProfileOpen(true);
  };

  const logoutUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.post(
        "https://hostelbackend-1.onrender.com/api/auth/logout",
        {},
        config
      );
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleLogout = async () => {
    try {
      setUserEmail(null);
      setUserRole(null);
      setProfileId(null);
      setIsLoggedIn(false);
      setProfileOpen(false);
      setAnchorEl(null);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("profileId");
      localStorage.removeItem("email");
      localStorage.removeItem("wishlist");
      await logoutUser();
      window.dispatchEvent(new Event("storage"));
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("profileId");
      localStorage.removeItem("email");
      window.dispatchEvent(new Event("storage"));
      window.location.href = "/";
    }
  };

  const handleExploreClick = () => {
    router.push("/explore");
  };

  const iconStyle =
    "text-sky-500 hover:text-sky-600 transition-all duration-200 shadow-md hover:shadow-lg";

  return (
    <AppBar
      position="static"
      sx={{ bgcolor: "background.paper" }}
      elevation={0}
    >
      <Toolbar
        className="flex justify-between items-center px-8 py-4"
        style={{ minHeight: "70px" }}
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h6"
            component="div"
            className="flex items-center text-sky-500 font-bold cursor-pointer"
            onClick={() => router.push("/")}
            sx={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {" "}
            <Image
              src="/Images/NewLogo1.png"
              alt="Hostel Logo"
              width={100}
              height={100}
            />
            <span className="text-sky-500">Latur hostel</span>
          </Typography>
        </motion.div>

        <Box className="flex items-center space-x-6">
          <Typography
            color="primary"
            onClick={() => router.push("/")}
            className="text-sky-500 hover:text-sky-600 cursor-pointer font-semibold"
            sx={{
              fontSize: "0.9rem",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Home
          </Typography>
          <Typography
            color="primary"
            // onClick={() => router.push("/register")}
            className="text-sky-500 hover:text-sky-600 cursor-pointer font-semibold"
            sx={{
              fontSize: "0.9rem",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Amenities
          </Typography>
          <Typography
            color="primary"
            // onClick={() => router.push("/register")}
            className="text-sky-500 hover:text-sky-600 cursor-pointer font-semibold"
            sx={{
              fontSize: "0.9rem",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            About Us
          </Typography>
          <Typography
            color="primary"
            // onClick={() => router.push("/register")}
            className="text-sky-500 hover:text-sky-600 cursor-pointer font-semibold"
            sx={{
              fontSize: "0.9rem",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Gallery
          </Typography>
          {isLoggedIn ? (
            <>
              <motion.div whileHover={{ scale: 0.7 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  onClick={() => router.push("/Dashboard/student/wishlist")}
                  className={`${iconStyle} rounded-full p-3`}
                >
                  <Badge badgeContent={wishlistCount} color="error">
                    <FavoriteIcon sx={{ fontSize: 24 }} />
                  </Badge>
                </IconButton>
              </motion.div>
              <motion.div whileHover={{ scale: 0.7 }} whileTap={{ scale: 0.9 }}>
                <IconButton className={`${iconStyle} rounded-full p-3`}>
                  <NotificationsIcon sx={{ fontSize: 24 }} />
                </IconButton>
              </motion.div>
              <motion.div whileHover={{ scale: 0.7 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  onClick={handleMenu}
                  className={`${iconStyle} rounded-full p-2 border-2 border-sky-500 hover:border-sky-600`}
                >
                  <Avatar
                    className="bg-sky-500 text-white"
                    sx={{ width: 32, height: 32, fontSize: 20 }}
                  >
                    {userEmail?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </motion.div>

              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                className="mt-2"
              >
                <MenuItem disabled className="text-gray-500">
                  Hi, {userRole} ({userEmail})
                </MenuItem>
                <MenuItem
                  onClick={() => setProfileOpen(true)}
                  className="hover:bg-sky-50"
                >
                  Profile
                </MenuItem>
                {userRole === "hostelowner" && (
                  <>
                    <MenuItem
                      onClick={() => router.push("/hostel-management")}
                      className="hover:bg-sky-50"
                    >
                      Hostel Management
                    </MenuItem>
                    <MenuItem
                      onClick={() => router.push("/owner-dashboard")}
                      className="hover:bg-sky-50"
                    >
                      Owner Dashboard
                    </MenuItem>
                  </>
                )}
                <MenuItem onClick={handleLogout} className="hover:bg-sky-50">
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Typography
                  color="primary"
                  onClick={() => router.push("/register")}
                  className="text-sky-500 hover:text-sky-600 cursor-pointer font-semibold"
                  sx={{
                    fontSize: "0.9rem",
                    fontFamily: "'Roboto', sans-serif",
                  }}
                >
                  Sign Up
                </Typography>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Typography
                  color="primary"
                  onClick={() => router.push("/login")}
                  className="text-sky-500 hover:text-sky-600 cursor-pointer font-semibold"
                  sx={{
                    fontSize: "0.9rem",
                    fontFamily: "'Roboto', sans-serif",
                  }}
                >
                  Sign In
                </Typography>
              </motion.div>
            </>
          )}
        </Box>
      </Toolbar>
      {/* {isLoggedIn && (
        <UserProfile
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          userEmail={userEmail || ""}
          userRole={userRole || ""}
          userPassword={""}
        />
      )} */}
      <AnimatePresence>
        {loginModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Modal
              open={loginModalOpen}
              onClose={handleCloseLoginModal}
              aria-labelledby="login-modal"
              aria-describedby="login-modal-description"
              className="flex items-center justify-center"
            >
              <Box>{/* <LoginPopUp onClose={handleCloseLoginModal} /> */}</Box>
            </Modal>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        body.blur-background::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        body.blur-background::before {
          opacity: 1;
        }
      `}</style>
    </AppBar>
  );
};

export default Navbar;
