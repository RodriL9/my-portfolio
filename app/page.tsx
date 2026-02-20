"use client";
import { useState, useEffect, useRef } from "react";
import AIChatbot from "@/components/AIChatBot";

const NAV_ITEMS = ["About", "Projects", "Contact", "Resume"];

const PROJECTS = [
  {
    id: 1,
    title: "Project One",
    description: "A full-stack web application with real-time features.",
    tech: ["React", "Node.js", "PostgreSQL"],
    videoUrl: "https://www.youtube.com/embed/YOUR_VIDEO_ID_1",
    liveUrl: "https://your-project-1.vercel.app",
    repoUrl: "https://github.com/yourusername/project-1",
  },
  {
    id: 2,
    title: "Project Two",
    description: "REST API with authentication and cloud deployment.",
    tech: ["Next.js", "TypeScript", "MongoDB"],
    videoUrl: "https://www.youtube.com/embed/YOUR_VIDEO_ID_2",
    liveUrl: "https://your-project-2.vercel.app",
    repoUrl: "https://github.com/yourusername/project-2",
  },
  {
    id: 3,
    title: "Project Three",
    description: "Mobile-first e-commerce platform with payments integration.",
    tech: ["React Native", "Stripe", "Firebase"],
    videoUrl: "https://www.youtube.com/embed/YOUR_VIDEO_ID_3",
    liveUrl: "https://your-project-3.vercel.app",
    repoUrl: "https://github.com/yourusername/project-3",
  },
];

export default function Home() {
  const [activeSection, setActiveSection] = useState("About");
  const [mounted, setMounted] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [activeProject, setActiveProject] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id.charAt(0).toUpperCase() + id.slice(1));
  };

  return (
    <>


      {/* Custom Cursor */}
      {mounted && (
        <>
          <div
            className="cursor"
            style={{ left: cursorPos.x - 6, top: cursorPos.y - 6 }}
          />
        </>
      )}

      {/* NAV */}
      <nav>
        <div className="nav-logo">
          RL<span>.</span>M
        </div>
        <ul className="nav-links">
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <button
                onClick={() => scrollTo(item.toLowerCase())}
                className={activeSection === item ? "active" : ""}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* HERO */}
      <section id="hero" style={{ padding: 0 }}>
        <div className="hero" ref={heroRef}>
          <div className="hero-bg" />
          <div className="hero-grid" />
          <div className="hero-content">
            <div className="hero-tag">
              <span className="dot" /> Full Stack Developer
            </div>
            <h1 className="hero-name">
              <span className="line1">Rodrigo</span>
              <span className="line2">Leites-Mena</span>
            </h1>
            <p className="hero-desc">
              Building full-stack applications with clean code and thoughtful UX.
              Passionate about turning complex problems into elegant, scalable solutions.
            </p>
            <div className="hero-cta">
              <button className="btn-primary" onClick={() => scrollTo("projects")}>
                <span>View Projects</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="btn-outline" onClick={() => scrollTo("contact")}>
                Get in Touch
              </button>
            </div>
          </div>
          <div className="scroll-hint">
            SCROLL
            <div className="scroll-line" />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="section-label">01 — About</div>
        <h2 className="section-title">
          Who I Am
        </h2>
        <div className="about-grid">
          <div className="about-photo-wrap">
            <div className="about-photo">
              {/* Replace with: <Image src="/your-photo.jpg" alt="Rodrigo" fill style={{objectFit:'cover'}} /> */}
              [ Your Photo ]
            </div>
            <div className="about-photo-accent" />
          </div>
          <div className="about-text">
            <p>
              Hey! I'm <strong>Rodrigo Leites-Mena</strong>, a full-stack developer based in
              [Your City]. I build end-to-end web applications with a focus on performance,
              clean architecture, and user experience.
            </p>
            <p>
              I specialize in the modern JavaScript ecosystem — from building reactive
              frontends in <strong>React & Next.js</strong> to crafting robust APIs
              and database layers on the backend.
            </p>
            <p>
              When I'm not coding, you can find me [your hobbies — gaming, hiking,
              music, etc.]. I'm always looking for interesting problems to solve and
              exciting new projects to collaborate on.
            </p>
            <div className="skills-grid">
              {["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "MongoDB", "Docker", "AWS", "Git"].map(s => (
                <span key={s} className="skill-tag">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <div className="section-label">02 — Work</div>
        <h2 className="section-title">Featured Projects</h2>
        <div className="projects-nav">
          {PROJECTS.map((p, i) => (
            <button
              key={p.id}
              className={`proj-tab ${activeProject === i ? "active" : ""}`}
              onClick={() => setActiveProject(i)}
            >
              {p.title}
            </button>
          ))}
        </div>

        {PROJECTS.map((project, i) => (
          <div
            key={project.id}
            className="project-card"
            style={{ display: activeProject === i ? "grid" : "none" }}
          >
            <div className="video-wrap">
              {project.videoUrl.includes("YOUR_VIDEO_ID") ? (
                <div className="video-placeholder">
                  <div className="play-icon">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                      <path d="M6 4l9 5-9 5V4z" />
                    </svg>
                  </div>
                  <span>Paste your YouTube embed URL</span>
                </div>
              ) : (
                <iframe
                  src={project.videoUrl}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            <div className="project-info">
              <span className="project-num">
                {String(i + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
              </span>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>
              <div className="project-tech">
                {project.tech.map((t) => (
                  <span key={t} className="tech-badge">{t}</span>
                ))}
              </div>
              <div className="project-links">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-btn link-btn-primary"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 6a5 5 0 1010 0A5 5 0 001 6z" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M6 1c-1.5 1.5-2 3-2 5s.5 3.5 2 5M6 1c1.5 1.5 2 3 2 5s-.5 3.5-2 5M1 6h10" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                  Live Demo
                </a>
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-btn link-btn-secondary"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 .5a5.5 5.5 0 00-1.74 10.72c.28.05.38-.12.38-.26v-.9C3.17 10.34 2.84 9.3 2.84 9.3c-.25-.64-.62-.81-.62-.81-.5-.35.04-.34.04-.34.56.04.85.57.85.57.5.85 1.3.6 1.62.46.05-.36.2-.6.35-.74-1.24-.14-2.54-.62-2.54-2.76 0-.61.22-1.11.57-1.5-.06-.14-.25-.71.05-1.48 0 0 .47-.15 1.53.57a5.3 5.3 0 012.8 0c1.06-.72 1.52-.57 1.52-.57.3.77.11 1.34.06 1.48.36.39.57.89.57 1.5 0 2.15-1.31 2.62-2.56 2.76.2.17.38.52.38 1.04v1.55c0 .15.1.32.39.26A5.5 5.5 0 006 .5z"/>
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="section-label">03 — Contact</div>
        <h2 className="section-title">Let's Build<br />Something Together</h2>
        <div className="contact-grid">
          <div className="contact-text">
            <p>
              I'm currently open to new opportunities — freelance projects,
              full-time roles, or just an interesting conversation about tech.
              Drop me a message and I'll get back to you within 24 hours.
            </p>
            <div className="contact-items">
              <a href="mailto:rodrigonleites1@outlook.com" className="contact-item">
                <div className="contact-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                </div>
                rodrigonleites1@outlook.com
              </a>
              <a href="https://www.linkedin.com/in/rodrigo-leites-mena-3a53aa348/" target="_blank" rel="noopener noreferrer" className="contact-item">
                <div className="contact-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2.5 1a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM1 5.5h3V15H1zM6 5.5h2.9v1.3h.04c.4-.76 1.4-1.56 2.88-1.56 3.08 0 3.65 2.03 3.65 4.67V15h-3v-4.5c0-1.07-.02-2.45-1.5-2.45-1.5 0-1.73 1.17-1.73 2.37V15H6V5.5z"/>
                  </svg>
                </div>
                linkedin.com/in/rodrigo-leites-mena
              </a>
              <a href="https://github.com/RodriL9" target="_blank" rel="noopener noreferrer" className="contact-item">
                <div className="contact-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 .5a7.5 7.5 0 00-2.37 14.62c.37.07.5-.16.5-.35v-1.23c-2.08.45-2.52-.87-2.52-.87-.34-.86-.83-1.1-.83-1.1-.68-.47.05-.46.05-.46.75.05 1.15.77 1.15.77.67 1.15 1.76.82 2.2.63.07-.49.26-.82.47-1.01-1.67-.19-3.42-.84-3.42-3.73 0-.82.3-1.5.77-2.03-.08-.19-.34-.96.07-2 0 0 .63-.2 2.06.77a7.15 7.15 0 013.76 0c1.43-.97 2.05-.77 2.05-.77.41 1.04.15 1.81.07 2 .48.53.77 1.21.77 2.03 0 2.9-1.76 3.54-3.44 3.73.27.23.51.69.51 1.39v2.07c0 .2.13.43.51.36A7.5 7.5 0 008 .5z"/>
                  </svg>
                </div>
                github.com/RodriL9
              </a>
            </div>
          </div>

          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>NAME</label>
              <input type="text" placeholder="Your name" />
            </div>
            <div className="form-group">
              <label>EMAIL</label>
              <input type="email" placeholder="your@email.com" />
            </div>
            <div className="form-group">
              <label>MESSAGE</label>
              <textarea placeholder="Tell me about your project..." />
            </div>
            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              <span>Send Message</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        </div>
      </section>

      {/* RESUME */}
      <section id="resume">
        <div className="section-label" style={{ justifyContent: "center" }}>04 — Resume</div>
        <h2 className="section-title" style={{ textAlign: "center" }}>Download My Resume</h2>
        <div className="resume-card">
          <div className="resume-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M8 4h8l6 6v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M16 4v6h6M11 17h6M11 13h6M11 21h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h3>Rodrigo Leites-Mena — Resume</h3>
          <p>
            Full Stack Developer with experience building scalable web applications.
            Download my resume to see my full work history, skills, and education.
          </p>
          <a
            href="/resume.pdf"
            download="Rodrigo_Leites-Mena_Resume.pdf"
            className="btn-primary"
            style={{ display: "inline-flex", margin: "0 auto", textDecoration: "none" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v8M4 7l3 3 3-3M2 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Download PDF</span>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2025 Rodrigo Leites-Mena — Built with Next.js</p>
        <div className="footer-socials">
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="GitHub">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 .5a7.5 7.5 0 00-2.37 14.62c.37.07.5-.16.5-.35v-1.23c-2.08.45-2.52-.87-2.52-.87-.34-.86-.83-1.1-.83-1.1-.68-.47.05-.46.05-.46.75.05 1.15.77 1.15.77.67 1.15 1.76.82 2.2.63.07-.49.26-.82.47-1.01-1.67-.19-3.42-.84-3.42-3.73 0-.82.3-1.5.77-2.03-.08-.19-.34-.96.07-2 0 0 .63-.2 2.06.77a7.15 7.15 0 013.76 0c1.43-.97 2.05-.77 2.05-.77.41 1.04.15 1.81.07 2 .48.53.77 1.21.77 2.03 0 2.9-1.76 3.54-3.44 3.73.27.23.51.69.51 1.39v2.07c0 .2.13.43.51.36A7.5 7.5 0 008 .5z"/>
            </svg>
          </a>
          <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.5 1a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM1 5.5h3V15H1zM6 5.5h2.9v1.3h.04c.4-.76 1.4-1.56 2.88-1.56 3.08 0 3.65 2.03 3.65 4.67V15h-3v-4.5c0-1.07-.02-2.45-1.5-2.45-1.5 0-1.73 1.17-1.73 2.37V15H6V5.5z"/>
            </svg>
          </a>
        </div>
      </footer>

      {/* AI Chatbot */}
      <AIChatbot />
    </>
  );
}