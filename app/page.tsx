import React, { Suspense } from "react";
import { Typography, Container, Grid } from "@mui/material";
import dynamic from "next/dynamic";
import Navbar from "./Component/mainpage/Navbar";

const DynamicHomePageContent = dynamic(
  () => import("./Component/mainpage/HomePageContent"),
  {
    loading: () => <Typography>Loading...</Typography>,
    ssr: false,
  }
);

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Container maxWidth={false} className="mt-0 px-4 md:px-8">
        <Suspense fallback={<Typography>Loading...</Typography>}>
          <Navbar />
          <DynamicHomePageContent />
        </Suspense>
      </Container>
    </div>
  );
};

export default HomePage;
