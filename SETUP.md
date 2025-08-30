# Word-Whisper: Dyslexic-Friendly Text Reader

A Next.js application that scans textbook images, extracts text using OCR, simplifies it for dyslexic readers using OpenAI, and provides text-to-speech functionality.

## Features

- 📸 **Image Upload**: Drag & drop or click to upload textbook page images
- 🔍 **OCR Processing**: Extract text from images using Tesseract.js
- 🤖 **AI Simplification**: Simplify complex text using OpenAI GPT-3.5 Turbo
- 🔊 **Text-to-Speech**: Read simplified text aloud with word highlighting
- 📄 **PDF Conversion**: Convert uploaded images to PDF format
- 👀 **Dyslexic-Friendly**: Uses Comic Neue and Lexend fonts with proper spacing
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### 1. Install Dependencies

```bash
cd fyp-test
npm install
```

### 2. Configure OpenAI API Key

1. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Open `.env.local` file
3. Replace `your_openai_api_key_here` with your actual API key:

```
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload Image**: Drag and drop or click to upload a textbook page image
2. **OCR Processing**: The app will automatically extract text from the image
3. **Simplify Text**: Click "Make This Easier to Read" to simplify the text using AI
4. **Listen & Read**: Use the text-to-speech controls to listen to the simplified text
5. **Download PDF**: Click "Download as PDF" to save the scanned image as a PDF

## Supported File Formats

- **Images**: JPEG, PNG, WebP (max 10MB)
- **Output**: PDF download, simplified text, audio playback

## Dyslexic-Friendly Features

- **Fonts**: Comic Neue and Lexend fonts for better readability
- **Spacing**: Increased letter and word spacing
- **Colors**: High contrast with cream/yellow background
- **Text Size**: Large, readable text with proper line height
- **Simplification**: AI-powered text simplification that:
  - Uses simple, common words
  - Breaks long sentences into shorter ones
  - Removes jargon and complex structures
  - Maintains all important information

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom dyslexic-friendly styles
- **OCR**: Tesseract.js for text extraction
- **AI**: OpenAI GPT-3.5 Turbo for text simplification
- **PDF**: jsPDF for PDF generation
- **Speech**: Web Speech API for text-to-speech

## Environment Variables

```
OPENAI_API_KEY=your_openai_api_key_here
```

## Troubleshooting

1. **OCR not working**: Ensure images have clear, readable text
2. **Simplification fails**: Check your OpenAI API key is correct and has credits
3. **PDF download issues**: Try with smaller image files
4. **Speech not working**: Ensure your browser supports Web Speech API
5. **Console errors fixed**: Worker script errors have been resolved with CDN configuration

## Fixed Issues ✅

- **Tesseract.js Worker Errors**: Configured to use CDN-hosted worker scripts
- **Next.js Compatibility**: Updated webpack configuration for proper module handling
- **Image Display**: Optimized for base64 data URLs
- **Error Handling**: Added error boundary for better user experience
- **Build Process**: All compilation errors resolved

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```