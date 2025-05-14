
"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";
import type { ResumeSection } from "@/types/resume";

export interface PdfExportButtonProps {
  resumeSections: ResumeSection[];
  resumeContainerRef: React.RefObject<HTMLDivElement>; // Keep for initial check if editor is ready
}

export function PdfExportButton({ resumeSections, resumeContainerRef }: PdfExportButtonProps) {
  const { toast } = useToast();

  const handleExportPdf = async () => {
    if (!resumeContainerRef.current) {
      toast({
        title: "Error",
        description: "Resume editor component not ready.",
        variant: "destructive",
      });
      return;
    }
    if (!resumeSections || resumeSections.length === 0) {
      toast({
        title: "Error",
        description: "No resume content to export.",
        variant: "destructive",
      });
      return;
    }

    // 1. Create the printable container
    const printableResume = document.createElement('div');
    printableResume.id = 'printable-resume-area';
    printableResume.style.fontFamily = "Arial, sans-serif";
    printableResume.style.padding = "40pt";
    printableResume.style.backgroundColor = "white";
    printableResume.style.color = "#333333"; // Default text color
    printableResume.style.width = "595pt"; // A4 width in points (approx 210mm)
    printableResume.style.boxSizing = "border-box";
    printableResume.style.lineHeight = "1.4"; // Base line height

    // For off-screen rendering by html2canvas
    printableResume.style.position = "absolute";
    printableResume.style.left = "-9999px";
    printableResume.style.top = "0";
    printableResume.style.zIndex = "-100"; 

    // 2. Populate with resume sections
    resumeSections.forEach((section, idx) => {
      const sectionContainer = document.createElement('div');
      // No margin bottom on last section to prevent extra space at the end of PDF
      if (idx < resumeSections.length -1) {
        sectionContainer.style.marginBottom = "15pt";
      }

      const titleEl = document.createElement('h2');
      titleEl.textContent = section.title;
      titleEl.style.fontSize = "14pt";
      titleEl.style.fontWeight = "bold";
      titleEl.style.marginTop = (idx === 0) ? "0" : "10pt";
      titleEl.style.marginBottom = "8pt";
      titleEl.style.borderBottom = "1px solid #cccccc";
      titleEl.style.paddingBottom = "4pt";
      titleEl.style.color = "#000000"; // Black for titles

      const contentEl = document.createElement('div');
      contentEl.textContent = section.content;
      contentEl.style.fontSize = "10pt";
      contentEl.style.whiteSpace = "pre-wrap"; 
      contentEl.style.color = "#333333"; // Dark gray for content
      
      sectionContainer.appendChild(titleEl);
      sectionContainer.appendChild(contentEl);
      printableResume.appendChild(sectionContainer);
    });

    document.body.appendChild(printableResume);

    const pdfStyles = document.createElement('style');
    pdfStyles.innerHTML = `
      body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      #printable-resume-area * { transition: none !important; }
    `;
    document.head.appendChild(pdfStyles);

    try {
      const canvas = await html2canvas(printableResume, {
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: null,
        onclone: (clonedDoc) => {
          clonedDoc.body.classList.remove('dark');
        }
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const sourceImgWidthPx = canvas.width;
      const sourceImgHeightPx = canvas.height;

      // This ratio converts pixels from html2canvas output to points in PDF
      const ratio = pdfWidth / sourceImgWidthPx;

      const displayWidthOnPdf = sourceImgWidthPx * ratio; // This will be pdfWidth
      const imgX = (pdfWidth - displayWidthOnPdf) / 2; // This will be ~0

      const image = new Image();
      image.onload = () => {
        let tempFullSourceCanvas = document.createElement('canvas');
        tempFullSourceCanvas.width = sourceImgWidthPx;
        tempFullSourceCanvas.height = sourceImgHeightPx;
        let tempCtx = tempFullSourceCanvas.getContext('2d');
        tempCtx?.drawImage(image, 0, 0);

        let currentYPositionOnSourcePx = 0;
        const totalSourceHeightPx = sourceImgHeightPx;
        // How many pixels from the source html2canvas output fit onto one PDF page height
        const sourcePxPerPdfPageHeight = Math.floor(pdfHeight / ratio);


        while(currentYPositionOnSourcePx < totalSourceHeightPx) {
          if (currentYPositionOnSourcePx > 0) {
            pdf.addPage();
          }
          
          const currentSliceHeightPx = Math.min(sourcePxPerPdfPageHeight, totalSourceHeightPx - currentYPositionOnSourcePx);

          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = sourceImgWidthPx;
          pageCanvas.height = currentSliceHeightPx; 
          const pageCtx = pageCanvas.getContext('2d');
          
          pageCtx?.drawImage(tempFullSourceCanvas, 
                             0, currentYPositionOnSourcePx,
                             sourceImgWidthPx, currentSliceHeightPx,
                             0, 0,
                             sourceImgWidthPx, currentSliceHeightPx);
          
          const pageImgData = pageCanvas.toDataURL('image/png');
          pdf.addImage(pageImgData, 'PNG', imgX, 0, displayWidthOnPdf, currentSliceHeightPx * ratio);
          
          currentYPositionOnSourcePx += currentSliceHeightPx;
        }
        pdf.save("resume.pdf");

        toast({
          title: "Success!",
          description: "Your resume has been exported as PDF.",
        });
      }
      image.src = imgData;

    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Error",
        description: "Failed to export resume as PDF.",
        variant: "destructive",
      });
    } finally {
      if (document.body.contains(printableResume)) {
        document.body.removeChild(printableResume);
      }
      if (document.head.contains(pdfStyles)) {
        document.head.removeChild(pdfStyles);
      }
    }
  };

  return (
    <Button onClick={handleExportPdf} variant="default">
      <Download className="mr-2 h-4 w-4" />
      Export PDF
    </Button>
  );
}
