// src/ai/flows/tailor-resume-section.ts
'use server';
/**
 * @fileOverview AI agent to tailor a resume section to a job description.
 *
 * - tailorResumeSection - A function that tailors a resume section based on a job description.
 * - TailorResumeSectionInput - The input type for the tailorResumeSection function.
 * - TailorResumeSectionOutput - The return type for the tailorResumeSection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TailorResumeSectionInputSchema = z.object({
  jobDescription: z.string().describe('The job description to tailor the resume section to.'),
  resumeSection: z.string().describe('The resume section to tailor (e.g., Skills, Experience).'),
  currentContent: z.string().describe('The current content of the resume section.'),
});
export type TailorResumeSectionInput = z.infer<typeof TailorResumeSectionInputSchema>;

const TailorResumeSectionOutputSchema = z.object({
  tailoredContent: z.string().describe('The tailored content of the resume section.'),
});
export type TailorResumeSectionOutput = z.infer<typeof TailorResumeSectionOutputSchema>;

export async function tailorResumeSection(input: TailorResumeSectionInput): Promise<TailorResumeSectionOutput> {
  return tailorResumeSectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tailorResumeSectionPrompt',
  input: {schema: TailorResumeSectionInputSchema},
  output: {schema: TailorResumeSectionOutputSchema},
  prompt: `You are a resume expert. You will be provided with a job description, a resume section, and the current content of that resume section.
Your goal is to tailor the resume section to the job description, improving the wording and highlighting the most relevant information.

Job Description: {{{jobDescription}}}

Resume Section: {{{resumeSection}}}

Current Content: {{{currentContent}}}

Tailored Content:`,
});

const tailorResumeSectionFlow = ai.defineFlow(
  {
    name: 'tailorResumeSectionFlow',
    inputSchema: TailorResumeSectionInputSchema,
    outputSchema: TailorResumeSectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
