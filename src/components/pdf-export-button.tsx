"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";
import type { ResumeSection } from "@/types/resume";

export interface PdfExportButtonProps {
  resumeSections: ResumeSection[];
  resumeContainerRef: React.RefObject<HTMLDivElement>;
}

export function PdfExportButton({ resumeContainerRef }: PdfExportButtonProps) {
  const { toast } = useToast();

  const handleExportPdf = async () => {
    const input = resumeContainerRef.current;
    if (!input) {
      toast({
        title: "Error",
        description: "Resume content not found for PDF export.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Temporarily remove box shadows for cleaner PDF capture
      const elementsWithShadow = Array.from(input.querySelectorAll('.shadow-md, .shadow-lg, .shadow-sm'));
      elementsWithShadow.forEach(el => el.classList.add('shadow-none-pdf'));
      
      // Style for PDF rendering
      const pdfStyles = document.createElement('style');
      pdfStyles.innerHTML = `
        .shadow-none-pdf { box-shadow: none !important; }
        body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      `;
      document.head.appendChild(pdfStyles);


      const canvas = await html2canvas(input, {
        scale: 2, // Improves quality
        useCORS: true,
        logging: false,
        onclone: (document) => {
          // This is where you can modify the cloned document before rendering
          // For example, ensure dark mode styles are not applied if you want a light PDF
          document.body.classList.remove('dark'); 
        }
      });
      
      document.head.removeChild(pdfStyles);
      elementsWithShadow.forEach(el => el.classList.remove('shadow-none-pdf'));

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      let position = 0;
      const pageHeight = imgHeight * ratio > pdfHeight ? pdfHeight : imgHeight * ratio; // Max height of image per page
      
      let tempCanvas = document.createElement('canvas');
      let tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = imgWidth;
      tempCanvas.height = imgHeight; // full image height
      
      const image = new Image();
      image.onload = () => {
        tempCtx?.drawImage(image, 0, 0);

        let slicedHeight = 0;
        const pageCanvasHeight = Math.floor(pdfHeight / ratio); // height of source image to fit one PDF page

        while(slicedHeight < imgHeight) {
          if (slicedHeight > 0) {
            pdf.addPage();
          }
          const currentSliceHeight = Math.min(pageCanvasHeight, imgHeight - slicedHeight);
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = imgWidth;
          pageCanvas.height = currentSliceHeight;
          const pageCtx = pageCanvas.getContext('2d');
          pageCtx?.drawImage(tempCanvas, 0, slicedHeight, imgWidth, currentSliceHeight, 0, 0, imgWidth, currentSliceHeight);
          
          const pageImgData = pageCanvas.toDataURL('image/png');
          pdf.addImage(pageImgData, 'PNG', imgX, 0, imgWidth * ratio, currentSliceHeight * ratio);
          slicedHeight += currentSliceHeight;
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
    }
  };

  return (
    <Button onClick={handleExportPdf} variant="default">
      <Download className="mr-2 h-4 w-4" />
      Export PDF
    </Button>
  );
}