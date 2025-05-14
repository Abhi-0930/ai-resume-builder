"use client";

import type { Identifier, XYCoord } from 'dnd-core';
import React, { useRef, useState, type ChangeEvent } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GripVertical, Edit2, Trash2, Save, XCircle } from 'lucide-react';
import type { ResumeSection } from '@/types/resume';
import { ItemTypes } from '@/types/resume';

interface DraggableResumeSectionProps {
  section: ResumeSection;
  index: number;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
  updateSection: (id: string, title: string, content: string) => void;
  deleteSection: (id: string) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export function DraggableResumeSection({
  section,
  index,
  moveSection,
  updateSection,
  deleteSection,
}: DraggableResumeSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableTitle, setEditableTitle] = useState(section.title);
  const [editableContent, setEditableContent] = useState(section.content);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: ItemTypes.RESUME_SECTION,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveSection(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.RESUME_SECTION,
    item: () => ({ id: section.id, index }),
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref)); // Attach drag source and drop target to the same ref

  const handleSaveEdit = () => {
    updateSection(section.id, editableTitle, editableContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditableTitle(section.title);
    setEditableContent(section.content);
    setIsEditing(false);
  };

  const opacity = isDragging ? 0.4 : 1;

  return (
    <div ref={preview} style={{ opacity }} data-handler-id={handlerId} className="mb-4">
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="p-4 flex flex-row items-center justify-between bg-muted/30 border-b">
          <div ref={ref} className="flex items-center cursor-move"> {/* Drag handle is part of this div */}
            <GripVertical className="h-5 w-5 text-muted-foreground mr-2" />
            {isEditing ? (
              <Input
                value={editableTitle}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditableTitle(e.target.value)}
                className="text-lg font-semibold h-9"
              />
            ) : (
              <h3 className="text-lg font-semibold text-primary">{section.title}</h3>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="ghost" size="icon" onClick={handleSaveEdit} title="Save">
                  <Save className="h-5 w-5 text-green-600" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleCancelEdit} title="Cancel">
                  <XCircle className="h-5 w-5 text-red-600" />
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} title="Edit Section">
                <Edit2 className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => deleteSection(section.id)} title="Delete Section">
              <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {isEditing ? (
            <Textarea
              value={editableContent}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditableContent(e.target.value)}
              rows={8}
              className="text-sm"
            />
          ) : (
            <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">{section.content}</pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}