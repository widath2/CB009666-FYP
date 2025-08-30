import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // In a real implementation, you would:
    // 1. Send the image to an OCR service (Google Vision API, Tesseract, etc.)
    // 2. Process the response
    // 3. Return the extracted text

    // For now, we'll return dummy text to demonstrate the flow
    const dummyText = `The Solar System

The solar system consists of the Sun and everything that orbits around it. This includes eight planets, their moons, asteroids, comets, and other small objects.

The Planets:
1. Mercury - The smallest planet and closest to the Sun
2. Venus - The hottest planet with thick clouds
3. Earth - Our home planet with liquid water
4. Mars - The red planet with polar ice caps
5. Jupiter - The largest planet with a Great Red Spot
6. Saturn - Famous for its beautiful rings
7. Uranus - Tilted on its side as it orbits
8. Neptune - The windiest planet in our solar system

The Sun is a medium-sized star that provides light and heat to all the planets. It contains 99.86% of the solar system's mass.`;

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return NextResponse.json({ text: dummyText });
  } catch (error) {
    console.error("OCR error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
