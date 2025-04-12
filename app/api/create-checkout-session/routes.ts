import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/libs/stripe";
import { getUrl } from "@/libs/helpers";
import { createdOrRetrieveACustomer } from "@/libs/supabaseAdmin";

export async function POST(request: Request) {
  const { price, quantity = 1, metadata = {} } = await request.json();

  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("User not authenticated", { status: 401 });
    }

    const customer = await createdOrRetrieveACustomer({
      uuid: user.id,
      email: user.email || "",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal"],
      mode: "subscription",
      billing_address_collection: "required",
      customer,
      line_items: [
        {
          price: price.id,
          quantity,
        },
      ],
      allow_promotion_codes: true,
      subscription_data: {
        trial_from_plan: true,
        metadata,
      } as any,
      success_url: `${getUrl()}/account`,
      cancel_url: `${getUrl()}/`,
      metadata,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.log("Error creating Stripe checkout session:", error.message);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
