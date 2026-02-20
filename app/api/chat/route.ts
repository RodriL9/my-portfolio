import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ─── PORTFOLIO CONTEXT ────────────────────────────────────────────────────────
// Update this object with your real information. The AI uses this as its
// knowledge base to answer visitor questions accurately.
// ─────────────────────────────────────────────────────────────────────────────
const PORTFOLIO_CONTEXT = {
  name: "Rodrigo Leites-Mena",
  role: "Computer Science Student at Kean University ",
  location: "[Linden, New Jersey]",
  email: "rodrigonleites1@outlook.com",
  linkedin: "https://www.linkedin.com/in/rodrigo-leites-mena-3a53aa348/",
  github: "github.com/RodriL9",
  availability: "Open to full-time roles and freelance projects",

  about: `
      Rodrigo is a Computer Science student at Kean University based in Linden, New Jersey...
  (write your real bio here)
    [ Add more personal details here — background, education, experience years, etc. ]
  `,

  skills: [
    "React", "Next.js", "TypeScript", "JavaScript",
    "Node.js", "Express", "PostgreSQL", "MongoDB",
    "Docker", "AWS", "Git", "REST APIs", "Tailwind CSS"
  ],

  projects: [
    {
      title: "Project One",
      description: "A full-stack web application with real-time features.",
      tech: ["React", "Node.js", "PostgreSQL"],
      liveUrl: "https://your-project-1.vercel.app",
      repoUrl: "https://github.com/yourusername/project-1",
      details: "[ Add a detailed description of this project ]",
    },
    {
      title: "Project Two",
      description: "REST API with authentication and cloud deployment.",
      tech: ["Next.js", "TypeScript", "MongoDB"],
      liveUrl: "https://your-project-2.vercel.app",
      repoUrl: "https://github.com/yourusername/project-2",
      details: "[ Add a detailed description of this project ]",
    },
    {
      title: "Project Three",
      description: "Mobile-first e-commerce platform with payments integration.",
      tech: ["React Native", "Stripe", "Firebase"],
      liveUrl: "https://your-project-3.vercel.app",
      repoUrl: "https://github.com/yourusername/project-3",
      details: "[ Add a detailed description of this project ]",
    },
  ],

  hobbies: "[ Add your hobbies here — gaming, hiking, music, etc. ]",

  resume: "Available for download at /resume.pdf",
};

const SYSTEM_PROMPT = `
You are an AI assistant embedded in ${PORTFOLIO_CONTEXT.name}'s personal portfolio website.
Your job is to answer questions from visitors (recruiters, potential clients, collaborators)
about Rodrigo in a helpful, confident, and conversational way.

Here is everything you know about Rodrigo:

NAME: ${PORTFOLIO_CONTEXT.name}
ROLE: ${PORTFOLIO_CONTEXT.role}
LOCATION: ${PORTFOLIO_CONTEXT.location}
EMAIL: ${PORTFOLIO_CONTEXT.email}
LINKEDIN: ${PORTFOLIO_CONTEXT.linkedin}
GITHUB: ${PORTFOLIO_CONTEXT.github}
AVAILABILITY: ${PORTFOLIO_CONTEXT.availability}

ABOUT:
${PORTFOLIO_CONTEXT.about}

TECHNICAL SKILLS:
${PORTFOLIO_CONTEXT.skills.join(", ")}

HOBBIES / INTERESTS:
${PORTFOLIO_CONTEXT.hobbies}

PROJECTS:
${PORTFOLIO_CONTEXT.projects
  .map(
    (p) => `
  - ${p.title}: ${p.description}
    Tech used: ${p.tech.join(", ")}
    Live: ${p.liveUrl}
    Code: ${p.repoUrl}
    Details: ${p.details}
`
  )
  .join("")}

RESUME: ${PORTFOLIO_CONTEXT.resume}

RULES:
- Be warm, professional, and concise. Max 3-4 sentences per reply unless a list is clearly better.
- Speak about Rodrigo in third person ("He built...", "Rodrigo specializes in...").
- If asked about something not covered above, say you don't have that info but invite the visitor
  to reach out directly at ${PORTFOLIO_CONTEXT.email}.
- Never make up facts, projects, or skills not listed above.
- If asked about hiring or working together, enthusiastically encourage them to reach out.
- Format lists with bullet points when listing multiple items (skills, projects, etc.).
- Keep a friendly but professional tone — like a knowledgeable colleague introducing Rodrigo.
`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Filter to only user/assistant messages and strip the initial client-side greeting
    const filtered = messages.filter(
      (m: { role: string }) => m.role === "user" || m.role === "assistant"
    );
    const chatMessages = filtered.slice(
      filtered[0]?.role === "assistant" ? 1 : 0
    );

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // fast + affordable — swap to "gpt-4o" for higher quality
      max_tokens: 500,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...chatMessages,
      ],
    });

    const reply =
      response.choices[0]?.message?.content ?? "Sorry, I couldn't get a response.";

    // Return in the shape AIChatbot.tsx expects
    return NextResponse.json({
      content: [{ type: "text", text: reply }],
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    );
  }
}