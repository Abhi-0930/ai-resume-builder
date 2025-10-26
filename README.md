# ResumeAI - AI-Powered Resume Builder

A smart resume builder that uses AI to tailor your resume content based on job descriptions.

## Quick Start

1. **Get your Gemini API key** from [Google AI Studio](https://aistudio.google.com/)

2. **Create environment file:**
   ```bash
   # Create .env file in project root
   echo "GEMINI_API_KEY=your_api_key_here" > .env
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the application:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   ```
   http://localhost:9002
   ```

## Features

- 🤖 **AI Resume Tailoring** - Automatically tailor resume sections to match job descriptions
- 🎯 **Drag & Drop Editor** - Reorder resume sections with intuitive drag-and-drop
- 📄 **PDF Export** - Download your resume as a professional PDF
- ✏️ **Live Editing** - Edit resume content in real-time
- 🎨 **Professional Design** - Clean, modern interface with professional styling
- 📱 **Responsive** - Works perfectly on desktop and mobile devices

## Tech Stack

- **Next.js 15** - React framework
- **Tailwind CSS** - Styling
- **Google Gemini AI** - AI-powered content generation
- **React DnD** - Drag and drop functionality
- **jsPDF** - PDF generation

## Project Structure

```
src/
├── ai/                 # AI integration (Gemini API)
├── app/               # Next.js app router
├── components/        # React components
│   ├── ui/           # Reusable UI components
│   └── layout/       # Layout components
├── hooks/            # Custom React hooks
├── lib/              # Utilities and constants
└── types/            # TypeScript type definitions
```

## Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks

## License

MIT License - feel free to use this project for your own resume building needs!