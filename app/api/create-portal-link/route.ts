import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/libs/stripe";
import { getUrl } from "@/libs/helpers";
import { createdOrRetrieveACustomer } from "@/libs/supabaseAdmin";

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Could not get user");

    const customer = await createdOrRetrieveACustomer({
      uuid: user.id || "",
      email: user.email || "",
    });

    if (!customer) throw new Error("Could not get customer");

    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${getUrl()}/account`,
    });

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Billing Portal Error:", error.message);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
