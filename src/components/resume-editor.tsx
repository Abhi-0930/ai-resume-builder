"use client";

import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableResumeSection } from '@/components/draggable-resume-section';
import type { ResumeSection } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';


interface ResumeEditorProps {
  sections: ResumeSection[];
  setSections: React.Dispatch<React.SetStateAction<ResumeSection[]>>;
}

export function ResumeEditor({ sections, setSections }: ResumeEditorProps) {
  const moveSection = (dragIndex: number, hoverIndex: number) => {
    setSections((prevSections) => {
      const newSections = [...prevSections];
      const [draggedSection] = newSections.splice(dragIndex, 1);
      newSections.splice(hoverIndex, 0, draggedSection);
      return newSections;
    });
  };

  const updateSection = (id: string, title: string, content: string) => {
    setSections((prevSections) =>
      prevSections.map((s) => (s.id === id ? { ...s, title, content } : s))
    );
  };

  const deleteSection = (id: string) => {
    setSections((prevSections) => prevSections.filter((s) => s.id !== id));
  };

  const addSection = () => {
    const newSection: ResumeSection = {
      id: `custom-${Date.now()}`, // Unique ID for custom sections
      title: 'New Section',
      content: 'Add your content here...',
    };
    setSections((prevSections) => [...prevSections, newSection]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Your Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sections.map((section, index) => (
              <DraggableResumeSection
                key={section.id}
                section={section}
                index={index}
                moveSection={moveSection}
                updateSection={updateSection}
                deleteSection={deleteSection}
              />
            ))}
          </div>
          <Button onClick={addSection} variant="outline" className="mt-6 w-full border-dashed hover:border-primary hover:text-primary">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Section
          </Button>
        </CardContent>
      </Card>
    </DndProvider>
  );
}