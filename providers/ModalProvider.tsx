"use client";

import AuthModal from "@/components/AuthModal";
import SubcribeModal from "@/components/SubcribeModal";
import UploadModal from "@/components/UploadModal";
import { ProductsWithPrice } from "@/types";
import { useEffect, useState } from "react";

interface ModalProviderProps {
  products: ProductsWithPrice[];
}
const ModalProvider: React.FC<ModalProviderProps> = ({ products }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <AuthModal />
      <UploadModal />
      <SubcribeModal products={products} />
    </>
  );
};

export default ModalProvider;
