import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.PERPLEXITY_API_KEY || process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY;
  
  return NextResponse.json({
    status: "ok",
    apiKeyConfigured: !!apiKey,
    apiKeyLength: apiKey?.length || 0,
    nodeEnv: process.env.NODE_ENV,
  });
}
