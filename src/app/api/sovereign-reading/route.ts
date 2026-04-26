import { NextRequest, NextResponse } from "next/server";
import { synthesize } from "@/lib/engine/synthesis/chaldean-synthesis-engine";
import { checkRateLimit } from "@/lib/utils/rateLimiter";

export async function POST(request: NextRequest) {
  try {
    const rateLimitError = checkRateLimit(request, '/api/sovereign-reading', 10, 60000);
    if (rateLimitError) return rateLimitError;

    const { name, birthDay, birthMonth, birthYear } = await request.json();

    if (!name || !birthDay || !birthMonth || !birthYear) {
      return NextResponse.json({ error: "Missing name or DOB components" }, { status: 400 });
    }

    // Call the deterministic synthesis engine (which stops before Groq)
    const { contract } = await synthesize(
      name, 
      parseInt(birthDay, 10), 
      parseInt(birthMonth, 10), 
      parseInt(birthYear, 10)
    );

    // Frame traits interpretively as per user requirements
    const compoundTraits = contract.identity_layer.raw_traits.compound.join(", ");
    const previewInsight = `You carry the vibration of ${contract.identity_layer.compound_number} — a number associated with ${compoundTraits}.`;

    const responseData = {
      name: contract.identity_layer.name,
      compoundNumber: contract.identity_layer.compound_number,
      planet: contract.identity_layer.planet,
      previewInsight: previewInsight,
      confidence: contract.identity_layer.metadata.confidence,
      isAmbiguous: contract.identity_layer.metadata.isAmbiguous,
      // We pass the full contract back so the frontend can securely pass it to Stage 2
      // (In a real production app, we might store this in a cache or session to prevent tampering)
      contract
    };

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400',
        'Vary': 'Authorization'
      }
    });
  } catch (error: any) {
    console.error("Sovereign Reading API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
