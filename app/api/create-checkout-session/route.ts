import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/libs/stripe";
import { getUrl } from "@/libs/helpers";
import { createOrRetrieveACustomer } from "@/libs/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const { price, quantity = 1, metadata = {} } = await request.json();

    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("User not authenticated", { status: 401 });
    }

    const customer = await createOrRetrieveACustomer({
      uuid: user.id,
      email: user.email || "",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
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
      },
      success_url: `${getUrl()}/account`,
      cancel_url: `${getUrl()}/`,
    });

    console.log("Stripe session created:", session.id);

    return NextResponse.json({ sessionId: session.id });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating checkout session:", error.message);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
