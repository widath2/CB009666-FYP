import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("Processing uploaded file:", file.name, file.type, file.size);

    // For now, provide demo text to demonstrate the workflow
    // In a production environment, you would integrate with:
    // - Google Cloud Vision API
    // - Azure Computer Vision  
    // - AWS Textract
    // - Or configure Tesseract.js properly for your server environment

    const demoText = `The Science of Learning

Learning is a complex process that involves creating new connections in our brain. When we study, our brain forms pathways that help us remember and use information.

How Learning Works:
1. Information enters through our senses
2. The brain processes and filters this information
3. Important details are stored in memory
4. Practice strengthens these memory connections
5. Regular review helps maintain long-term retention

Effective Learning Strategies:
• Break information into smaller chunks
• Use visual aids and diagrams
• Practice active recall
• Connect new information to what you already know
• Take regular breaks to let your brain process

The most important factor in learning is consistency. Regular practice, even for short periods, is more effective than long, infrequent study sessions.

Understanding how your brain learns helps you study more effectively and remember information longer.`;

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Demo text provided for workflow demonstration");

    return NextResponse.json({ text: demoText });

  } catch (error) {
    console.error("OCR API error:", error);
    return NextResponse.json(
      { error: "Failed to process image. Please try again." },
      { status: 500 }
    );
  }
}
