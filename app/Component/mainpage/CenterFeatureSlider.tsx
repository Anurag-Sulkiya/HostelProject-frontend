"use client";
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  Settings,
  Hotel,
  Power,
  Sanitizer,
  Security,
  Restaurant,
  LocalShipping,
} from "@mui/icons-material";
import { keyframes } from "@emotion/react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  color: string;
}

const slideAnimation = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
`;

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, color }) => (
  <Card
    sx={{
      width: "100%", // Ensure the card takes full width of its container
      height: "200px", // Fixed height to prevent overlap
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      p: 2,
      backgroundColor: color,
      border: "2px solid transparent",
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        transform: "scale(1.05)",
        boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
        borderColor: "skyblue",
      },
    }}
  >
    <CardContent
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
      <Typography
        variant="h6"
        component="div"
        sx={{ mt: 2, textAlign: "center" }}
      >
        {title}
      </Typography>
    </CardContent>
  </Card>
);

const FeatureSlider: React.FC = () => {
  const features = [
    {
      icon: <Settings sx={{ fontSize: 60, color: "orange" }} />,
      title: "Student Friendly",
      color: "#FFEBEE",
    },
    {
      icon: <Hotel sx={{ fontSize: 60, color: "orange" }} />,
      title: "Girls Hostel",
      color: "#E3F2FD",
    },
    {
      icon: <Power sx={{ fontSize: 60, color: "orange" }} />,
      title: "Power Backup",
      color: "#FFF3E0",
    },
    {
      icon: <Sanitizer sx={{ fontSize: 60, color: "orange" }} />,
      title: "Hygiene",
      color: "#E8F5E9",
    },
    {
      icon: <Security sx={{ fontSize: 60, color: "orange" }} />,
      title: "24 * 7 Security",
      color: "#F3E5F5",
    },
    {
      icon: <Restaurant sx={{ fontSize: 60, color: "orange" }} />,
      title: "Food & Mess",
      color: "#FFEB3B",
    },
    {
      icon: <LocalShipping sx={{ fontSize: 60, color: "orange" }} />,
      title: "Pick Up & Drop",
      color: "#FFFDE7",
    },
  ];

  const animationDuration = `${features.length * 5}s`;

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center", // Ensure cards are vertically centered
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "200%", // Ensures continuous scrolling
          animation: `${slideAnimation} ${animationDuration} linear infinite`,
          "&:hover": {
            animationPlayState: "paused",
          },
        }}
      >
        {[...features, ...features].map((feature, index) => (
          <Box
            key={index}
            sx={{
              flexShrink: 0,
              width: "calc(100% / 7)", // Ensure each card takes up equal space (100% / number of cards)
              display: "flex",
              justifyContent: "center",
              alignItems: "center", // Vertical center alignment to prevent overlap
              p: 1, // Small padding to avoid any clipping
            }}
          >
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              color={feature.color}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const CenteredFeatureSlider: React.FC = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      overflow: "hidden",
    }}
  >
    <FeatureSlider />
  </Box>
);
export default CenteredFeatureSlider;
