"use client";

import { useState, useRef } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { AiTailorPanel } from '@/components/ai-tailor-panel';
import { ResumeEditor } from '@/components/resume-editor';
import { PdfExportButton } from '@/components/pdf-export-button';
import type { ResumeSection } from '@/types/resume';
import { INITIAL_RESUME_SECTIONS } from '@/lib/constants';

export default function ResumeBuilderPage() {
  const [resumeSections, setResumeSections] = useState<ResumeSection[]>(INITIAL_RESUME_SECTIONS);
  const resumeContainerRef = useRef<HTMLDivElement>(null);

  const handleSectionTailored = (sectionId: string, newContent: string) => {
    setResumeSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId ? { ...section, content: newContent } : section
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader 
        PdfExportButton={PdfExportButton} 
        resumeSections={resumeSections}
        resumeContainerRef={resumeContainerRef}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <AiTailorPanel
              resumeSections={resumeSections}
              onSectionTailored={handleSectionTailored}
            />
          </div>
          <div className="lg:col-span-2" ref={resumeContainerRef}>
            <ResumeEditor
              sections={resumeSections}
              setSections={setResumeSections}
            />
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-muted-foreground text-sm border-t">
        <p>&copy; {new Date().getFullYear()} ResumeAI. Built with Next.js and Tailwind CSS.</p>
      </footer>
    </div>
  );
}