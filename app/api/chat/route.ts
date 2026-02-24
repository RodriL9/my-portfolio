import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ─── PORTFOLIO CONTEXT ────────────────────────────────────────────────────────
// The AI uses this as its knowledge base to answer visitor questions accurately.
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
  Rodrigo is a junior Computer Science student at Kean University in Union, NJ, maintaining a 3.95 GPA and expected to graduate in December 2027. He has a deep curiosity for how things work — from low-level systems programming all the way up to the applications people use every day.

  He has hands-on experience with C, Python, Java, HTML, CSS, SQL, and tools like Git, Linux, and Microsoft Azure Virtual Machines. He has built projects like a C-based caching simulator that models hardware cache behavior, and implemented a Multi-Level Feedback Queue scheduler inside the xv6 kernel.

  Outside of school, Rodrigo works as a BMW Product Specialist at Open Road BMW in Edison, NJ, where he troubleshoots software and hardware issues, trains customers on BMW technology, and stays current with the latest automotive tech.

  He loves problem solving, thinking through solutions, and figuring out how to bring ideas to life. Outside of tech, he is passionate about sports and staying active. He is always looking for interesting projects to collaborate on and new things to learn.
`,
  skills: [
    "React", "Next.js", "TypeScript", "JavaScript",
    "Node.js", "PostgreSQL", "Git", "Tailwind CSS",
    "HTML/CSS", "C", "Java", "Python", "Linux","Microsoft Azure", "VS Code"
  ],

  projects: [
    {
      title: "Daily To-Do List",
      description: "A Daily To-Do list application built with React",
      tech: ["React","JavaScript XML", "HTML", "CSS"],
      liveUrl: "https://react-to-do-list-lime-omega.vercel.app/",
      repoUrl: "https://github.com/RodriL9/react_To-Do_list.git",
      details: "Features a clean UI that enables you to add and delete tasks seamlessly while keeping track of your daily activities.",
    },
    {
      title: "Sum App",
      description: "SUM app built with python and deployed on Kean University's OBI server",
      tech: ["Python", "PHP", "SSH" ],
      liveUrl: "https://obi2.kean.edu/~leitesmr@kean.edu/sum.php",
      repoUrl: "https://github.com/RodriL9/sum-app.git",
      details: "SUM app built with python and deployed on Kean University's OBI server.",
    },
    {
      title: "Chat Application with ChatGPT API",
      description: "A chat application that integrates with the ChatGPT API to provide intelligent responses.",
      tech: ["CSS", "JavaScript", "OpenAI API"],
      liveUrl: "https://rodrigo-leites-r89vz7vdy-rodril9s-projects.vercel.app/",
      repoUrl: "https://github.com/RodriL9/rodrigoLeites_abc.git",
      details: "This project demonstrates integration with the OpenAI ChatGPT API to generate intelligent responses in a chat interface.",

    },
  ],

  hobbies: "[ Playing sports like soccer, basketball, and tennis. Learning new things and challenging myself. ]",

 easterEggs: "[ Favorite animes are Vinland Saga, Attack on Titan, Jujutsu Kaisen, and My Hero Academia. Gojo is stronger than Ryomen Sukuna.]",

  resume: `Visitors can download Rodrigo's resume here: [Download Resume](${process.env.NEXT_PUBLIC_SITE_URL}/RodrigoResume.pdf)`,
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
${PORTFOLIO_CONTEXT.easterEggs}

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