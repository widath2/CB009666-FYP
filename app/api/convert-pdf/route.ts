import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const imageDataUrl = `data:${file.type};base64,${base64}`;

    // Create PDF
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // For server-side rendering, we'll use default dimensions
    // In a real application, you might want to use a library like sharp for server-side image processing
    try {
      // Calculate dimensions to fit the page while maintaining a standard aspect ratio
      const aspectRatio = 4 / 3; // Default aspect ratio
      let finalWidth = pdfWidth - 20; // 10mm margin on each side
      let finalHeight = finalWidth / aspectRatio;
      
      if (finalHeight > pdfHeight - 20) { // 10mm margin top and bottom
        finalHeight = pdfHeight - 20;
        finalWidth = finalHeight * aspectRatio;
      }
      
      const xPosition = (pdfWidth - finalWidth) / 2;
      const yPosition = (pdfHeight - finalHeight) / 2;
      
      pdf.addImage(imageDataUrl, 'JPEG', xPosition, yPosition, finalWidth, finalHeight);
    } catch (error) {
      console.error("Error processing image:", error);
      // If image processing fails, add image with default dimensions
      pdf.addImage(imageDataUrl, 'JPEG', 10, 10, pdfWidth - 20, pdfHeight - 20);
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="scanned-textbook-${Date.now()}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error("PDF conversion error:", error);
    return NextResponse.json(
      { error: "Failed to convert image to PDF" },
      { status: 500 }
    );
  }
}