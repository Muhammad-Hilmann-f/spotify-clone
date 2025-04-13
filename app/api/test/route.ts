import { NextResponse } from "next/server";

export async function GET() {
  const stripeKeyExists = !!process.env.STRIPE_SECRET_KEY;
  return NextResponse.json({
    message: "API is working!",
    stripeKeyExists,
    nodeEnv: process.env.NODE_ENV,
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    return NextResponse.json({
      message: "POST request received!",
      receivedData: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error parsing JSON data",
        error: (error as Error).message,
      },
      { status: 400 }
    );
  }
}
