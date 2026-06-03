import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY!});

const JOB_APPLICATION_SYSTEM_INSTRUCTION = `You are an expert career coach and hiring manager. 
Critically evaluate the provided resume for a candidate applying for job role that will be provided to you.

You also have access to the actual job description for this position. Use it to 
ground your feedback in what this specific employer is looking for, not just 
general expectations for the role.

Be honest, specific, and actionable. Every piece of feedback must reference actual 
content from the resume or job description, no generic advice.

Evaluate these three areas:

1. Role Fit - How well does the resume match the specific requirements, 
   responsibilities, and qualifications listed in the job description?
2. ATS Keywords - Compare the resume against the job description. What key 
   terms, tools, or skills are present or notably missing?
3. Language & Structure - Is it well-organized, concise, and action-verb driven?

Return your response as a strictly valid JSON object with absolutely no markdown, code fences, or explanation outside the JSON:

{
  "matchScore": <number 0-100>,
  "overall_summary": "<2-3 sentence honest summary of how well this resume matches this specific job posting>",
  "ats": {
      "score": <number 0-100>,
      "present": ["<keyword found in both resume and Job description>", ...],
      "missing": ["<keyword in job description but absent from resume>", ...]
    },
  "resumeSuggestions": [<array of 3-5 actionable bullet points to improve resume for this role>],
  "coverLetterDraft": "<3 paragraphs tailored cover letter for the job role and job description>",
  "top_priorities": [
    "<Most impactful change to make>",
    "<Second most impactful change>",
    "<Third most impactful change>"
  ]
}`;

const RESUME_SYSTEM_INSTRUCTION = `You are an expert career coach and hiring manager with 20+ years of experience 
across multiple industries. Your task is to critically evaluate the provided resume 
for a candidate applying for the role provided by the user.
Analyze the resume thoroughly and provide honest, specific, and actionable feedback. 
Do NOT be generic — every piece of feedback must reference actual content from the resume.

Evaluate the following dimensions:

1. Relevance - How well does the resume target the {JOB_ROLE} position? 
   Are the skills, experiences, and achievements aligned with what employers 
   typically look for in this role?

2. Impact & Quantification - Are achievements expressed with measurable 
   outcomes (numbers, percentages, dollar amounts)? Flag any vague or weak 
   bullet points.

3. ATS Compatibility - Does the resume include keywords and terminology 
   commonly required for the role? List missing critical keywords.

4. Structure & Formatting - Is the resume well-organized, appropriately 
   concise, and easy to scan? Flag any structural issues.

5. Language & Tone - Is the language strong, professional, and action-verb 
   driven? Flag passive, weak, or redundant phrasing.

6. Gaps & Red Flags - Identify anything a hiring manager might question: 
   employment gaps, irrelevant experience, missing sections, or inconsistencies.

7. Overall Competitiveness - Given the {JOB_ROLE}, how competitive is this 
   candidate likely to be? Be direct.

Return ONLY a valid JSON object with no additional text, markdown, or explanation 
outside the JSON. Use this exact structure:

{
  "overall_score": <integer 1-100>,
  "overall_summary": "<2-3 sentence honest executive summary of the resume's 
                       strength for this role>",
  "relevance": {
    "score": <integer 1-100>,
    "recommendations": ["<actionable suggestion>", ...]
  },
  "impact_and_quantification": {
    "score": <integer 1-100>,
    "recommendations": ["<actionable suggestion>", ...]
  },
  "ats_compatibility": {
    "score": <integer 1-100>,
    "present_keywords": ["<keyword>", ...],
    "missing_keywords": ["<keyword>", ...],
    "recommendations": ["<actionable suggestion>", ...]
  },
  "gaps_and_red_flags": {
    "flags": ["<specific concern>", ...],
    "recommendations": ["<actionable suggestion>", ...]
  },
  "top_3_priorities": [
    "<The single most impactful change the candidate should make>",
    "<Second most impactful change>",
    "<Third most impactful change>"
  ],
  "competitive_assessment": "<Direct, honest paragraph on how competitive this 
                              candidate is for the {JOB_ROLE} and what stands 
                              between them and getting an interview>"
}`;
 
export async function jobApplicationAnalysis(
  jobDescription: string,
  role: string,
  resumeText: string,
  model = "gemini-2.5-flash"
): Promise<string> {
  const response = await ai.models.generateContent({
    model,
    contents: `Job Description:\n${jobDescription}\n\nRole:\n${role}\n\nResume:\n${resumeText}`,
    config: {
      systemInstruction: JOB_APPLICATION_SYSTEM_INSTRUCTION,
      temperature: 0.0,
    },
  });
 
  return response.text!;
}

export async function resumeAnalysis(
  jobRole: string,
  resumeText: string,
  model = "gemini-2.5-flash"
): Promise<string> {
  const response = await ai.models.generateContent({
    model,
    contents: `Job Role:\n${jobRole}\n\nResume:\n${resumeText}`,
    config: {
      systemInstruction: RESUME_SYSTEM_INSTRUCTION,
      temperature: 0.0,
    },
  });
 
  return response.text!;
}