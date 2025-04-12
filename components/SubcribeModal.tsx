import React from "react";
import Modal from "./Modal";
import { Price, ProductsWithPrice } from "@/types";
import Button from "./Button";

interface SubcribeModalProps {
  products: ProductsWithPrice[];
}

const formatPrice = (price: Price) => {
  const priceString = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format((price?.unit_amount || 0) / 100);

  return priceString;
};

const SubcribeModal: React.FC<SubcribeModalProps> = ({ products }) => {
  const hasProducts = products.length > 0;

  const content = hasProducts ? (
    <div className="space-y-2">
      {products.map((product) =>
        product.prices?.length ? (
          product.prices.map((price) => (
            <Button key={price.id}>
              {`Subscribe for ${formatPrice(price)} / ${price.interval}`}
            </Button>
          ))
        ) : (
          <div key={product.id}>No prices available</div>
        )
      )}
    </div>
  ) : (
    <div>No product available</div>
  );

  return (
    <Modal
      title="Only for premium user"
      description="Listen to music with Spotify premium"
      isOpen
      onChange={() => {}}
    >
      <div className="text-center">{content}</div>
    </Modal>
  );
};

export default SubcribeModal;
