"use client";
import Box from "@/components/Box";
import React from "react";
import { BounceLoader } from "react-spinners";

const loading = () => {
  return (
    <Box className="h-full flex items-center justify-center">
      <BounceLoader color="#22c55e" size={40} />
    </Box>
  );
};

export default loading;
