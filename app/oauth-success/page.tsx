"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const OAuthSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");
    const profileId = searchParams.get("profileId");

    if (token && role && profileId) {
      // Store the token and user info
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("profileId", profileId);

      // Redirect based on role
      switch (role) {
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
    } else {
      console.error("Missing required parameters in OAuth callback");
      router.push("/login"); // Redirect to login page if parameters are missing
    }
  }, [router, searchParams]);

  return <div>Authentication successful. Redirecting...</div>;
};

export default OAuthSuccess;
