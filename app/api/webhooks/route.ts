import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/libs/stripe";
import {
  upsertProductRecord,
  upsertPriceRecord,
  manageSubscriptionStatusChange,
} from "@/libs/supabaseAdmin";

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(request: Request) {
  console.log("Webhook route hit");

  const body = await request.text();
  const sig = headers().get("Stripe-Signature");
  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      console.error("Missing Stripe signature or webhook secret");
      return new NextResponse("Invalid webhook signature", { status: 400 });
    }

    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log("Received Stripe event:", event.type);
    console.log("Event data:", event.data.object);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          console.log("Processing product event");
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;

        case "price.created":
        case "price.updated":
          console.log("Processing price event");
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;

        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          console.log("Processing subscription event:", subscription);

          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === "customer.subscription.created"
          );
          console.log("Subscription processed successfully");
          break;
        }

        case "checkout.session.completed": {
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            console.log(
              "Processing checkout session subscription ID:",
              subscriptionId
            );

            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              true
            );
            console.log("Checkout session processed successfully");
          }
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (err) {
      console.error("Error handling event:", err);
      return new NextResponse("Webhook handler error", { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
