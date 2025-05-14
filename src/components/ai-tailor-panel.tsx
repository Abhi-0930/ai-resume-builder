"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { tailorResumeSection, type TailorResumeSectionOutput } from "@/ai/flows/tailor-resume-section";
import type { ResumeSection } from "@/types/resume";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface AiTailorPanelProps {
  resumeSections: ResumeSection[];
  onSectionTailored: (sectionId: string, newContent: string) => void;
}

export function AiTailorPanel({ resumeSections, onSectionTailored }: AiTailorPanelProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestionsDialog, setShowSuggestionsDialog] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<TailorResumeSectionOutput | null>(null);
  const [originalContent, setOriginalContent] = useState("");

  const { toast } = useToast();

  const handleTailorResume = async () => {
    if (!jobDescription.trim()) {
      toast({ title: "Job Description Required", description: "Please paste the job description.", variant: "destructive" });
      return;
    }
    if (!selectedSectionId) {
      toast({ title: "Section Required", description: "Please select a resume section to tailor.", variant: "destructive" });
      return;
    }

    const sectionToTailor = resumeSections.find(s => s.id === selectedSectionId);
    if (!sectionToTailor) {
      toast({ title: "Error", description: "Selected section not found.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setOriginalContent(sectionToTailor.content);

    try {
      const result = await tailorResumeSection({
        jobDescription,
        resumeSection: sectionToTailor.title,
        currentContent: sectionToTailor.content,
      });
      setAiSuggestions(result);
      setShowSuggestionsDialog(true);
      toast({ title: "AI Suggestions Ready!", description: "Review the tailored content." });
    } catch (error) {
      console.error("Error tailoring resume section:", error);
      toast({ title: "AI Error", description: "Could not tailor section. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = () => {
    if (aiSuggestions && selectedSectionId) {
      onSectionTailored(selectedSectionId, aiSuggestions.tailoredContent);
      toast({ title: "Section Updated", description: "AI suggestions have been applied." });
    }
    setShowSuggestionsDialog(false);
    setAiSuggestions(null);
  };

  return (
    <>
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Sparkles className="mr-2 h-6 w-6 text-accent" />
            AI Resume Tailor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
              className="border-input focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume-section">Section to Tailor</Label>
            <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
              <SelectTrigger id="resume-section" className="focus:ring-accent">
                <SelectValue placeholder="Select a section" />
              </SelectTrigger>
              <SelectContent>
                {resumeSections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleTailorResume} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Tailor with AI
          </Button>
        </CardContent>
      </Card>

      {aiSuggestions && (
        <Dialog open={showSuggestionsDialog} onOpenChange={setShowSuggestionsDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>AI Tailored Suggestions</DialogTitle>
              <DialogDescription>
                Review the AI's suggestions for your resume section.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div>
                <h4 className="font-semibold mb-2">Original Content:</h4>
                <pre className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">{originalContent}</pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">AI Suggested Content:</h4>
                <pre className="p-3 bg-primary/10 rounded-md text-sm whitespace-pre-wrap">{aiSuggestions.tailoredContent}</pre>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleApplySuggestion} className="bg-accent hover:bg-accent/90 text-accent-foreground">Apply Suggestion</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}