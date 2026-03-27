import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

const projects = [
  {
    title: "Project Name",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet deserunt hic dolor ea, beatae aperiam exercitationem odit eos explicabo laboriosam? Sit, et dolor vero eveniet sint aspernatur id assumenda nulla.",
    stack: "Lorem",
    link: "#",
  },
  {
    title: "Another Project",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet deserunt hic dolor ea, beatae aperiam exercitationem odit eos explicabo laboriosam? Sit, et dolor vero eveniet sint aspernatur id assumenda nulla.",
    stack: "Ipsum",
    link: "#",
  },
  {
    title: "Experimental Work",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet deserunt hic dolor ea, beatae aperiam exercitationem odit eos explicabo laboriosam? Sit, et dolor vero eveniet sint aspernatur id assumenda nulla.",
    stack: "Dolor",
    link: "#",
  },
];

function FadeSection({ id, className, children, amount = 0.25 }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const opacityRaw = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const opacity = useSpring(opacityRaw, { stiffness: 120, damping: 26, mass: 0.35 });

  return (
    <motion.section ref={sectionRef} id={id} className={className} style={{ opacity }}>
      {children}
    </motion.section>
  );
}

function FadeItem({ children, className }) {
  const itemRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start 0.95", "end 0.05"],
  });
  const opacityRaw = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const yRaw = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [18, 0, 0, -18]);
  const opacity = useSpring(opacityRaw, { stiffness: 130, damping: 28, mass: 0.34 });
  const y = useSpring(yRaw, { stiffness: 130, damping: 28, mass: 0.34 });

  return (
    <motion.article
      ref={itemRef}
      className={className}
      style={{ opacity, y }}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 240, damping: 22, mass: 0.5 }}
    >
      {children}
    </motion.article>
  );
}

function App() {
  const [theme, setTheme] = useState("light");
  const [themeWave, setThemeWave] = useState(null);
  const [pageRipple, setPageRipple] = useState(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const heroBackgroundShift = useSpring(
    useTransform(heroScrollProgress, [0, 1], [0, 220]),
    { stiffness: 110, damping: 24, mass: 0.42 }
  );
  const heroContentShift = useSpring(useTransform(heroScrollProgress, [0, 1], [0, 120]), {
    stiffness: 110,
    damping: 24,
    mass: 0.42,
  });
  const heroContentOpacity = useSpring(
    useTransform(heroScrollProgress, [0, 0.65, 1], [1, 0.85, 0]),
    { stiffness: 110, damping: 24, mass: 0.42 }
  );

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeToggle = (event) => {
    const nextTheme = theme === "light" ? "dark" : "light";
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const maxX = Math.max(x, window.innerWidth - x);
    const maxY = Math.max(y, window.innerHeight - y);
    const radius = Math.hypot(maxX, maxY);
    const waveColor = nextTheme === "dark" ? "#282828" : "#f8f6f1";

    setThemeWave({
      x,
      y,
      radius,
      color: waveColor,
    });
    window.setTimeout(() => setTheme(nextTheme), 120);
    window.setTimeout(() => setPageRipple({ x, y }), 170);
    window.setTimeout(() => setThemeWave(null), 340);
    window.setTimeout(() => setPageRipple(null), 460);
  };

  return (
    <>
      {themeWave && (
        <motion.div
          className="theme-wave"
          aria-hidden="true"
          style={{ background: themeWave.color }}
          initial={{ clipPath: `circle(0px at ${themeWave.x}px ${themeWave.y}px)` }}
          animate={{ clipPath: `circle(${themeWave.radius}px at ${themeWave.x}px ${themeWave.y}px)` }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
      {pageRipple && (
        <motion.div
          className="page-ripple"
          aria-hidden="true"
          style={{
            background: `radial-gradient(circle at ${pageRipple.x}px ${pageRipple.y}px, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0.12) 18%, transparent 55%)`,
          }}
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: [0, 0.25, 0], scale: [0.985, 1.015, 1] }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        />
      )}
      <motion.div className="scroll-progress" style={{ scaleX: barScale }} />

      <header className="site-header">
        <div className="container header-inner">
          <div className="header-spacer" aria-hidden="true" />
          <nav className="nav">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </nav>
          <button
            type="button"
            className="theme-toggle"
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            onClick={handleThemeToggle}
          >
            {theme === "light" ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4.2" />
                <path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9 5.3 5.3" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.4 14.2A8.5 8.5 0 1 1 9.8 3.6a7 7 0 0 0 10.6 10.6z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main>
        <section id="hero" className="hero" ref={heroRef}>
          <motion.div className="hero-glow hero-glow-a" style={{ y: heroBackgroundShift }} />
          <motion.div className="hero-glow hero-glow-b" style={{ y: heroBackgroundShift }} />
          <motion.div
            className="container hero-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ y: heroContentShift, opacity: heroContentOpacity }}
          >
            <p className="eyebrow">Portfolio</p>
            <h1>Dylan Lucero</h1>
            <p className="lead">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet deserunt hic dolor ea, beatae aperiam exercitationem odit eos explicabo laboriosam? Sit, et dolor vero eveniet sint aspernatur id assumenda nulla.
            </p>
            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary">
                View projects
              </a>
              <a href="#contact" className="btn btn-ghost">
                Contact me
              </a>
            </div>
          </motion.div>
        </section>

        <FadeSection id="about" className="section section-light" amount={0.25}>
          <div className="container">
            <h2>About</h2>
            <p className="section-text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet deserunt hic dolor ea, beatae aperiam exercitationem odit eos explicabo laboriosam? Sit, et dolor vero eveniet sint aspernatur id assumenda nulla.
            </p>
            <div className="about-grid">
              <div className="panel">
                <h3>Focus</h3>
                <ul>
                  <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ut ex aperiam reprehenderit quae sint. Doloremque eos reiciendis eveniet perspiciatis fugiat incidunt magnam. Quaerat nesciunt vel, quisquam repellendus dignissimos quibusdam commodi.</li>
                </ul>
              </div>
              <div className="panel">
                <h3>Toolkit</h3>
                <ul>
                  <li>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempora quod voluptatibus a ducimus culpa quasi iure, nam eos pariatur nemo alias deserunt enim. Explicabo ipsa eum incidunt qui pariatur ex?</li>
                </ul>
              </div>
            </div>
          </div>
        </FadeSection>

        <FadeSection id="projects" className="section section-dark" amount={0.2}>
          <div className="container">
            <h2>Selected Projects</h2>
            <p className="section-text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet deserunt hic dolor ea, beatae aperiam exercitationem odit eos explicabo laboriosam? Sit, et dolor vero eveniet sint aspernatur id assumenda nulla.
            </p>
            <div className="project-grid">
              {projects.map((project, index) => (
                <FadeItem key={project.title} className="project-card">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-foot">
                    <span>{project.stack}</span>
                    <a href={project.link}>Details</a>
                  </div>
                </FadeItem>
              ))}
            </div>
          </div>
        </FadeSection>

        <FadeSection id="contact" className="section section-light" amount={0.25}>
          <div className="container">
            <h2>Contact</h2>
            <p className="section-text">
              Let&apos;s build something together.
            </p>
            <div className="contact-card">
              <a href="mailto:dylanlucero98@gmail.com">dylanlucero98@gmail.com</a>
              <div className="contact-links">
                <a href="https://github.com/dylanlucero" target="_blank" rel="noreferrer">
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/dylanlucero/" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </FadeSection>
      </main>
    </>
  );
}

export default App;

