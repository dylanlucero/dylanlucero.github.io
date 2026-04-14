import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

const projects = [
  {
    title: "AI Energy Consumption & Grid Impact",
    meta: "DAT 490 Capstone · Spring 2025",
    bullets: [
      "Built a full data pipeline ingesting monthly generation, CO₂ emissions (SEDS TETCE), and retail electricity price data across all 50 U.S. states from multiple EIA.gov APIs.",
      "Engineered a custom PyTorch Transformer classifier with state-token embeddings and 6-month feature sequences to predict whether a state-month is \u201Cgreen,\u201D achieving ≈76% test accuracy and outperforming logistic regression.",
      "Trained a Ridge regression model with state fixed effects and polynomial features to project retail electricity prices under various renewable-share scenarios; evaluated with GroupShuffleSplit to prevent leakage.",
      "Authored a reusable Python module handling data loading, feature engineering, sequence windowing, and train/test splitting for reproducibility.",
    ],
    stack: "Python · PyTorch · scikit-learn · Pandas",
    link: "#",
  },
  {
    title: "Diffusion Model for Digit Generation",
    meta: "DAT 494 · Fall 2025",
    bullets: [
      "Designed a denoising diffusion model that generates handwritten digits from pure noise on MNIST (60K images); code published on GitHub.",
      "Built a 6-layer U-Net (3 down / 3 up) with skip connections, Conv2d layers (1→32→64→64, 5×5 kernels), GELU activations, MaxPool downsampling, and nearest-neighbor upsampling.",
      "Implemented a linear noise schedule via torch.lerp interpolation; trained 15 epochs (batch size 128) with MSELoss and Adam (lr = 1e-4).",
      "Generated novel digits through a 5-step iterative denoising loop.",
    ],
    stack: "Python · PyTorch · NumPy",
    link: "https://github.com/dylanlucero",
  },
  {
    title: "Los Angeles Crime Data Analysis",
    meta: "DAT 301 · Spring 2025",
    bullets: [
      "Cleaned and analyzed 900K+ crime records (2020–2025) from the City of Los Angeles Open Data portal.",
      "Produced geospatial and temporal visualizations in R (ggplot2) and Python (Plotly) to identify high-crime areas and seasonal patterns.",
      "Performed hypothesis testing (two-sample t-test) to evaluate demographic differences in crime victimization.",
    ],
    stack: "R · Python · ggplot2 · Plotly",
    link: "#",
  },
  {
    title: "ASA DataFest 2025 — Real Estate Prediction",
    meta: "48-Hour Competition · April 2025",
    bullets: [
      "Collaborated in a 5-person team during a 48-hour competition to analyze 6 years of national real estate transaction data.",
      "Engineered features and built a Linear Regression model to forecast property price trends, evaluated via RMSE.",
      "Cleaned and transformed raw data using Pandas; created Tableau dashboards for exploratory analysis and final presentation.",
    ],
    stack: "Python · Pandas · Tableau",
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

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <>
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
            <p className="eyebrow">Data Science · Machine Learning</p>
            <h1>Dylan Lucero</h1>
            <p className="lead lead-wide">
              <span className="hl">Data scientist and engineer</span> focused on building <span className="hl">end-to-end pipelines</span>, <span className="hl">deep learning models</span>, and clear, <span className="hl">reproducible analysis</span>. Currently pursuing a <span className="hl">B.S. in Data Science</span> at <span className="hl">Arizona State University</span>, with an <span className="hl">M.S. in Industrial Engineering</span> on deck.
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
            <p className="section-text section-text-wide">
              I work at the intersection of <span className="hl">data</span>, <span className="hl">machine learning</span>, and <span className="hl">engineering</span> — turning messy real-world data into models and tools that hold up to scrutiny. My coursework and projects span <span className="hl">deep learning</span>, <span className="hl">statistical modeling</span>, <span className="hl">geospatial analysis</span>, and the <span className="hl">pipelines</span> that make all of it <span className="hl">reproducible</span>.
            </p>

            <div className="about-block">
              <h3 className="about-heading">Focus</h3>
              <div className="chip-row">
                <span className="chip">Deep Learning</span>
                <span className="chip">Transformers</span>
                <span className="chip">Diffusion Models</span>
                <span className="chip">U-Nets</span>
                <span className="chip">Statistical Modeling</span>
                <span className="chip">Hypothesis Testing</span>
                <span className="chip">Data Pipelines</span>
                <span className="chip">Feature Engineering</span>
                <span className="chip">Geospatial Analysis</span>
                <span className="chip">Time-Series</span>
              </div>
            </div>

            <div className="about-block">
              <h3 className="about-heading">Toolkit</h3>
              <div className="chip-row">
                <span className="chip chip-solid">Python</span>
                <span className="chip chip-solid">SQL</span>
                <span className="chip chip-solid">R</span>
                <span className="chip chip-solid">C/C++</span>
                <span className="chip chip-solid">Java</span>
                <span className="chip">PyTorch</span>
                <span className="chip">scikit-learn</span>
                <span className="chip">Pandas</span>
                <span className="chip">NumPy</span>
                <span className="chip">SciPy</span>
                <span className="chip">Matplotlib</span>
                <span className="chip">Seaborn</span>
                <span className="chip">ggplot2</span>
                <span className="chip">Plotly</span>
                <span className="chip">Tableau</span>
                <span className="chip">PostgreSQL</span>
                <span className="chip">MongoDB</span>
                <span className="chip">AWS</span>
                <span className="chip">Alteryx</span>
                <span className="chip">Git</span>
              </div>
            </div>

            <div className="about-block">
              <h3 className="about-heading">Education</h3>
              <div className="edu-list">
                <div className="edu-item">
                  <div className="edu-degree">M.S. Industrial Engineering</div>
                  <div className="edu-school">Arizona State University</div>
                  <div className="edu-date">Expected May 2028</div>
                </div>
                <div className="edu-item">
                  <div className="edu-degree">B.S. Data Science, CS Track</div>
                  <div className="edu-school">Arizona State University</div>
                  <div className="edu-date">May 2026</div>
                </div>
                <div className="edu-item">
                  <div className="edu-degree">A.S. Computer Science</div>
                  <div className="edu-school">Glendale Community College</div>
                  <div className="edu-date">December 2023</div>
                </div>
              </div>
            </div>

            <div className="about-block">
              <h3 className="about-heading">Certifications</h3>
              <div className="chip-row">
                <span className="chip chip-accent">Alteryx Designer Core — Mar 2026</span>
              </div>
            </div>
          </div>
        </FadeSection>

        <FadeSection id="projects" className="section section-dark" amount={0.2}>
          <div className="container">
            <h2>Selected Projects</h2>
            <p className="section-text section-text-wide">
              A cross-section of recent coursework and competitions — <span className="hl">deep learning models</span>, <span className="hl">statistical analyses</span>, and <span className="hl">data pipelines</span> built around <span className="hl">real datasets</span>. Each one is as much about the plumbing as the result.
            </p>
            <div className="project-grid">
              {projects.map((project) => (
                <FadeItem key={project.title} className="project-card">
                  <h3>{project.title}</h3>
                  {project.meta && <p className="project-meta">{project.meta}</p>}
                  <ul className="project-bullets">
                    {project.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
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
              Open to internships, research collaborations, and data science roles. Email is the fastest way to reach me.
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

