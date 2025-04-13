import React, { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import toast from "react-hot-toast";

import { useUser } from "@/hooks/useUser";
import { postData } from "@/libs/helpers";
import { getStripe } from "@/libs/stripeClient";
import { Price, ProductsWithPrice } from "@/types";
import useSubscribeModal from "@/hooks/useSubcribeModal";

interface SubscribeModalProps {
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

const SubscribeModal: React.FC<SubscribeModalProps> = ({ products }) => {
  const subscribeModal = useSubscribeModal();
  const { user, isLoading, subscription } = useUser();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const hasProducts = products.length > 0;

  const onChange = (open: boolean) => {
    if (!open) {
      subscribeModal.onClose();
    }
  };
  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return toast.error("You must be logged in to subscribe");
    }

    if (subscription) {
      setPriceIdLoading(undefined);
      return toast.error("You already have an active subscription");
    }

    try {
      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { price },
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      toast.error((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  let content;

  if (subscription) {
    content = <div className="text-center">You are already subscribed.</div>;
  } else if (hasProducts) {
    content = (
      <div className="space-y-2">
        {products.map((product) =>
          product.prices?.length ? (
            product.prices.map((price) => (
              <Button
                key={price.id}
                onClick={() => handleCheckout(price)}
                disabled={isLoading || price.id === priceIdLoading}
                className="mb-4 w-full"
              >
                {`Subscribe for ${formatPrice(price)} / ${price.interval}`}
              </Button>
            ))
          ) : (
            <div key={product.id}>No prices available</div>
          )
        )}
      </div>
    );
  } else {
    content = <div className="text-center">No products available.</div>;
  }

  return (
    <Modal
      title="Only for Premium Users"
      description="Upgrade your account to listen to premium content without limits."
      isOpen={subscribeModal.isOpen}
      onChange={onChange}
    >
      {content}
    </Modal>
  );
};

export default SubscribeModal;
