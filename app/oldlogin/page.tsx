"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  email: string;
  password: string;
}
const EnhancedLoginForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [openForgotPassword, setOpenForgotPassword] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>("");
  const [resetMessage, setResetMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    console.log("formData", formData);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          ...formData,
          email: formData.email.toLowerCase(),
        }
      );

      const user = response.data;
      localStorage.setItem("email", formData.email.toLowerCase());
      localStorage.setItem("role", user.role);
      localStorage.setItem("token", user.token);
      localStorage.setItem("profileId", user.profileId);

      setIsRedirecting(true);
      toast.success("Login successful! Redirecting...");

      setTimeout(() => {
        switch (user.role) {
          case "student":
            router.push("/");
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
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        setError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
      setIsRedirecting(false);
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

  return (
    <div className="min-h-screen flex bg-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <div className="flex-1 relative overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://assets.mixkit.co/videos/4519/4519-720.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Typography variant="h3" className="text-white text-center font-bold">
            Welcome to Our Platform
          </Typography>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <Box
          component="form"
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-8 shadow-lg w-full max-w-md"
        >
          <Typography
            variant="h4"
            className="text-gray-800 text-center mb-6 font-bold"
          >
            Sign In
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            className="mb-4"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            className="mb-4"
          />
          {error && (
            <Typography
              color="error"
              variant="body2"
              className="mt-2 text-center"
            >
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="mt-6 mb-4 bg-blue-600 hover:bg-blue-700 transition-all duration-300"
            disabled={isLoading || isRedirecting}
          >
            {isLoading || isRedirecting ? (
              <span className="flex items-center justify-center">
                <CircularProgress size={24} color="inherit" className="mr-2" />
                {isRedirecting ? "Redirecting..." : "Signing In..."}
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
          <Typography variant="body2" className="text-center">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </Typography>
          <Typography variant="body2" className="text-center mt-2">
            <Link
              onClick={handleForgotPassword}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Forgot Password?
            </Link>
          </Typography>
          <Typography
            variant="body2"
            className="text-center mt-4 text-gray-600"
          >
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </Typography>
        </Box>
      </div>

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
            <Typography color="primary" variant="body2" className="mt-2">
              {resetMessage}
            </Typography>
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
  );
};

export default EnhancedLoginForm;
