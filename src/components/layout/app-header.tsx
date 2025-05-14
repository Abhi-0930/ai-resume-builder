import { FileText } from 'lucide-react';
import type { PdfExportButtonProps } from '@/components/pdf-export-button';

interface AppHeaderProps {
  PdfExportButton: React.ComponentType<PdfExportButtonProps>;
  resumeSections: any[]; // Simplified for now, pass actual sections
  resumeContainerRef: React.RefObject<HTMLDivElement>;
}

export function AppHeader({ PdfExportButton, resumeSections, resumeContainerRef }: AppHeaderProps) {
  return (
    <header className="bg-card border-b sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-primary tracking-tight">ResumeAI</h1>
        </div>
        <PdfExportButton resumeSections={resumeSections} resumeContainerRef={resumeContainerRef} />
      </div>
    </header>
  );
}