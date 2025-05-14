import type { ResumeSection } from '@/types/resume';

export const INITIAL_RESUME_SECTIONS: ResumeSection[] = [
  { 
    id: 'personal-info', 
    title: 'Personal Information', 
    content: 'Your Name\nyour.email@example.com\n(555) 123-4567\nLinkedIn Profile URL (Optional)' 
  },
  { 
    id: 'summary', 
    title: 'Summary', 
    content: 'A brief professional summary highlighting your key qualifications and career goals. Tailor this to each job application.' 
  },
  { 
    id: 'experience', 
    title: 'Work Experience', 
    content: 'Job Title | Company Name | City, State | Month Year - Month Year (or Present)\n- Accomplishment or responsibility, quantified if possible.\n- Another key achievement using action verbs.' 
  },
  { 
    id: 'education', 
    title: 'Education', 
    content: 'Degree Name | Major/Minor | University Name | City, State | Graduation Month Year\n- Relevant coursework, honors, or GPA (optional).' 
  },
  { 
    id: 'skills', 
    title: 'Skills', 
    content: 'Technical Skills: JavaScript, Python, React, SQL\nSoft Skills: Communication, Teamwork, Problem-solving' 
  },
];