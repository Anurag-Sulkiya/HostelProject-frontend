"use client";
import React, { useState } from "react";
import { FaFacebook, FaApple, FaGoogle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { ChevronRight } from "lucide-react";
import Navbar from "../Component/mainpage/Navbar";

interface LoginPopUpProps {
  onClose: () => void;
}

const Login: React.FC<LoginPopUpProps> = ({ onClose }) => {
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let response;
      if (loginMethod === "email") {
        response = await axios.post("http://localhost:5000/api/auth/login", {
          email: email.toLowerCase(),
          password,
        });
      } else {
        // Implement phone login logic here
        console.log("Phone login not implemented yet");
        return;
      }

      const user = response.data;
      localStorage.setItem("email", email.toLowerCase());
      localStorage.setItem("role", user.role);
      localStorage.setItem("token", user.token);
      localStorage.setItem("profileId", user.profileId);

      toast.success("Login successful! Redirecting...");

      setTimeout(() => {
        switch (user.role) {
          case "student":
            router.push("/Dashboard/student");
            break;
          case "hostelOwner":
            router.push("/Dashboard/hostalOwner");
            break;
          case "admin":
            router.push("/Dashboard/admin");
            break;
          default:
            router.push("/customizeDashboard");
        }
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An error occurred during login.";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => setOpenForgotPassword(true);

  const handleCloseForgotPassword = () => {
    setOpenForgotPassword(false);
    setResetEmail("");
    setResetMessage("");
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    setResetMessage("");

    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        email: resetEmail.toLowerCase(),
      });
      setResetMessage(
        "If an account with that email exists, a password reset link has been sent."
      );
      toast.info("Password reset link sent. Please check your email.");
    } catch (error) {
      setResetMessage("An error occurred. Please try again later.");
      toast.error("Failed to send reset link. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueWith = (method: string) => {
    if (method === "google") {
      window.location.href = "http://localhost:5000/api/auth/google";
    } else {
      console.log(`Continuing with ${method}`);
      // Implement other social login logic here
    }
  };
  return (
    <>
      <Navbar />

      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <ToastContainer autoClose={5000} hideProgressBar={false} />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-4xl relative z-1050 flex"
        >
          {/* Left side with logo and quote */}
          <div className="w-2/5 bg-indigo-600 p-8 text-white flex flex-col justify-between">
            <div>
              <div className="mb-8 flex justify-center">
                <Image
                  src="/Images/NewLogo1.png"
                  alt="Hostel Logo"
                  width={200}
                  height={200}
                />
              </div>
              <h1 className="text-3xl font-bold mb-4 text-center">
                Latur Hostel
              </h1>
              <p className="text-lg italic text-center">
                "Every hostel has a story and you will become a part of its
                novel with every night's stay"
              </p>
              <br />
              <br />
              <p className="text-center">
                Remember: Please follow the community guidelines. If not
                followed, strong action will be taken against the respective
                person.
              </p>
            </div>
            <p className="text-sm text-center">Your home away from home</p>
          </div>

          {/* Right side with login form */}
          <div className="w-3/5 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Login to Stay Home
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex mb-4">
              <button
                className={`flex-1 py-2 ${
                  loginMethod === "email"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setLoginMethod("email")}
              >
                Email
              </button>
              <button
                className={`flex-1 py-2 ${
                  loginMethod === "phone"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setLoginMethod("phone")}
              >
                Phone
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {loginMethod === "email" ? (
                <>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </>
              ) : (
                <div className="flex">
                  <input
                    type="text"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-20 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone Number"
                    className="flex-1 p-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <CircularProgress
                      size={24}
                      color="inherit"
                      className="mr-2"
                    />
                    Signing In...
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="text-center">
                <button
                  onClick={handleForgotPassword}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Forgot your password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Don't have an account?{" "}
                    <a
                      href="/register"
                      className="text-sm text-blue-400 hover:text-gray-800 transition-colors duration-200"
                    >
                      sign up
                    </a>
                  </span>
                </div>
              </div>
            </div>
            <div className="my-4 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-3 text-sm text-gray-500">
                or continue with
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="space-y-3">
              {[
                {
                  icon: MdEmail,
                  text: "Continue with Email",
                  color: "text-gray-700",
                  bgColor: "bg-gray-100",
                  method: "email",
                },
                {
                  icon: FaGoogle,
                  text: "Continue with Google",
                  color: "text-red-600",
                  bgColor: "bg-red-50",
                  method: "google",
                },
                {
                  icon: FaFacebook,
                  text: "Continue with Facebook",
                  color: "text-blue-600",
                  bgColor: "bg-blue-50",
                  method: "facebook",
                },
                {
                  icon: FaApple,
                  text: "Continue with Apple",
                  color: "text-gray-900",
                  bgColor: "bg-gray-100",
                  method: "apple",
                },
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleContinueWith(item.method)}
                  className={`w-full p-2 rounded-md flex items-center justify-center font-medium ${item.color} ${item.bgColor} hover:opacity-90 transition-opacity duration-200`}
                >
                  <item.icon className="mr-2" /> {item.text}
                </button>
              ))}
            </div>

            <p className="mt-6 text-xs text-center text-gray-500">
              By signing in you agree to our Privacy Policy and Terms &
              Conditions
            </p>
          </div>
        </motion.div>

        <Dialog open={openForgotPassword} onClose={handleCloseForgotPassword}>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="resetEmail"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            {resetMessage && (
              <p className="mt-2 text-sm text-blue-600">{resetMessage}</p>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForgotPassword}>Cancel</Button>
            <Button onClick={handleResetPassword} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Login;
