import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

const ROLES = [
  "Data Scientist",
  "Software Engineer",
  "ML Researcher",
  "Pipeline Builder",
  "Problem Solver",
];

const FOCUS = [
  "Deep Learning",
  "Transformers",
  "Diffusion Models",
  "U-Nets",
  "Statistical Modeling",
  "Hypothesis Testing",
  "Data Pipelines",
  "Feature Engineering",
  "Geospatial Analysis",
  "Time-Series",
];

const TOOLKIT = [
  "Python",
  "SQL",
  "R",
  "C/C++",
  "Java",
  "PyTorch",
  "scikit-learn",
  "Pandas",
  "NumPy",
  "SciPy",
  "Matplotlib",
  "Seaborn",
  "ggplot2",
  "Plotly",
  "Tableau",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Alteryx",
  "Git",
];

const projects = [
  {
    title: "AI Energy Consumption & Grid Impact",
    meta: "Capstone · Spring 2025",
    bullets: [
      "Pulled monthly generation, CO₂ emissions, and retail price data for all 50 states straight from the EIA APIs and stitched it into one tidy pipeline.",
      "Trained a small PyTorch Transformer on six-month windows to call whether a state-month was “green.” Hit ~76% on the test set and beat my logistic baseline.",
      "Layered Ridge regression with state effects on top to project where prices might land as renewables grow. Used GroupShuffleSplit so nothing leaked.",
      "Wrapped the whole thing in a reusable module so I (or anyone) can rerun it without retyping the boring parts.",
    ],
    stack: "Python · PyTorch · scikit-learn · Pandas",
    link: "#",
  },
  {
    title: "Diffusion Model for Digit Generation",
    meta: "DAT 494 · Fall 2025",
    bullets: [
      "Trained a denoising diffusion model on MNIST that draws digits out of pure noise. Code is on GitHub.",
      "Six-layer U-Net (3 down, 3 up) with skip connections, GELU activations, and nearest-neighbor upsampling.",
      "Linear noise schedule via torch.lerp, 15 epochs, batch 128, MSE loss, Adam at 1e-4.",
      "Sampling runs a five-step denoising loop and the digits actually look like digits.",
    ],
    stack: "Python · PyTorch · NumPy",
    link: "https://github.com/dylanlucero",
  },
  {
    title: "Los Angeles Crime Data Analysis",
    meta: "DAT 301 · Spring 2025",
    bullets: [
      "Cleaned 900K+ crime records from LA’s open data portal and made them actually usable.",
      "Mapped hot spots and seasonal patterns in R (ggplot2) and Python (Plotly) so the trends could speak for themselves.",
      "Ran a two-sample t-test to check whether demographic differences in victimization were real or just noise.",
    ],
    stack: "R · Python · ggplot2 · Plotly",
    link: "#",
  },
  {
    title: "ASA DataFest 2025 — Real Estate",
    meta: "48-Hour Competition · April 2025",
    bullets: [
      "48 hours, five people, six years of national real estate data.",
      "Built features and a Linear Regression model to forecast price trends, scored with RMSE.",
      "Prepped the data in Pandas and put together Tableau dashboards for the final pitch.",
    ],
    stack: "Python · Pandas · Tableau",
    link: "#",
  },
];

function ShaderBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    const vert = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;
    const frag = `
      precision mediump float;
      uniform vec2 u_res;
      uniform float u_time;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float vnoise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      float fbm(vec2 p) {
        float v = 0.0;
        float amp = 0.5;
        for (int i = 0; i < 4; i++) {
          v += amp * vnoise(p);
          p *= 2.02;
          amp *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res.xy;
        vec2 p = uv * 2.4;
        p.x += u_time * 0.04;
        p.y -= u_time * 0.025;

        float n = fbm(p + fbm(p + u_time * 0.05));

        vec3 cream  = vec3(0.961, 0.925, 0.851);
        vec3 deep   = vec3(0.925, 0.875, 0.769);
        vec3 accent = vec3(0.784, 0.663, 0.416);

        vec3 col = mix(cream, deep, smoothstep(0.2, 0.85, n));
        col = mix(col, accent, smoothstep(0.65, 0.95, n) * 0.18);

        // soft vignette
        float d = distance(uv, vec2(0.5));
        col *= 1.0 - smoothstep(0.55, 1.1, d) * 0.18;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize);

    let raf;
    const start = performance.now();
    function loop(t) {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (t - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="shader-bg" aria-hidden="true" />;
}

function HeroShader() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    const vert = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;
    const frag = `
      precision mediump float;
      uniform vec2 u_res;
      uniform float u_time;

      vec3 palette(float t) {
        vec3 a = vec3(0.78, 0.66, 0.42);
        vec3 b = vec3(0.62, 0.50, 0.30);
        vec3 c = vec3(0.95, 0.88, 0.70);
        vec3 d = vec3(0.30, 0.22, 0.55);
        return a + b * cos(6.2831 * (c * t + d));
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_res.xy) / u_res.y;
        vec2 uv0 = uv;
        vec3 col = vec3(0.0);

        for (float i = 0.0; i < 3.0; i++) {
          uv = fract(uv * 1.4) - 0.5;
          float d = length(uv) * exp(-length(uv0));
          vec3 c = palette(length(uv0) + i * 0.4 + u_time * 0.25);
          d = sin(d * 8.0 + u_time * 0.6) / 8.0;
          d = abs(d);
          d = pow(0.012 / d, 1.4);
          col += c * d;
        }

        col *= 0.55;
        gl_FragColor = vec4(col, 0.42);
      }
    `;

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = canvas.clientWidth || canvas.parentElement.clientWidth;
      const h = canvas.clientHeight || canvas.parentElement.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("resize", resize);

    let raf;
    const start = performance.now();
    function loop(t) {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (t - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-shader" aria-hidden="true" />;
}

function RotatingRoles({ roles, interval = 2200 }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % roles.length), interval);
    return () => clearInterval(t);
  }, [roles.length, interval]);
  return (
    <div className="role-rotator" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[i]}
          initial={{ y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -22, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function Marquee({ items, direction = "left", duration = 38, solid = false }) {
  const doubled = [...items, ...items];
  const xRange = direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"];
  return (
    <div className="marquee" aria-hidden="false">
      <motion.div
        className="marquee-track"
        animate={{ x: xRange }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span key={i} className={solid ? "chip chip-solid" : "chip"}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <motion.div
      className="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
    >
      <div className="loader-glow loader-glow-a" />
      <div className="loader-glow loader-glow-b" />

      <div className="loader-stack">
        <h1 className="loader-name">Dylan Lucero</h1>

        <motion.p
          className="loader-eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Portfolio
        </motion.p>

        <motion.div
          className="loader-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <motion.div
            className="loader-bar-fill"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: "easeInOut", delay: 0.3 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

function FadeSection({ id, className, children }) {
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
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const portraitRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress: portraitScroll } = useScroll({
    target: portraitRef,
    offset: ["start end", "end start"],
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

  const portraitScale = useSpring(
    useTransform(portraitScroll, [0, 0.5, 1], [0.92, 1.04, 0.92]),
    { stiffness: 110, damping: 22, mass: 0.4 }
  );
  const portraitRotate = useSpring(
    useTransform(portraitScroll, [0, 1], [-6, 6]),
    { stiffness: 110, damping: 22, mass: 0.4 }
  );
  const portraitY = useSpring(
    useTransform(portraitScroll, [0, 1], [40, -40]),
    { stiffness: 110, damping: 22, mass: 0.4 }
  );

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <ShaderBackground />

      <AnimatePresence>{loading && <LoadingScreen key="loader" />}</AnimatePresence>

      <motion.div className="scroll-progress" style={{ scaleX: barScale }} />

      <main>
        <section id="hero" className="hero" ref={heroRef}>
          <HeroShader />
          <motion.div className="hero-glow hero-glow-a" style={{ y: heroBackgroundShift }} />
          <motion.div className="hero-glow hero-glow-b" style={{ y: heroBackgroundShift }} />

          <motion.div
            className="container hero-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 1.4 }}
            style={{ y: heroContentShift, opacity: heroContentOpacity }}
          >
            <div className="hero-grid">
              <div className="hero-text">
                <h1>Dylan Lucero</h1>
                <RotatingRoles roles={ROLES} />
                <p className="lead">
                  I build things with data — pipelines, models, and the occasional dashboard. Right now I’m finishing my <span className="hl">B.S. in Data Science</span> at <span className="hl">Arizona State</span> and lining up an <span className="hl">M.S. in Industrial Engineering</span>. I like problems that start messy and end up making sense.
                </p>
                <div className="hero-actions">
                  <a href="#projects" className="btn btn-primary">See my work</a>
                  <a href="#contact" className="btn btn-ghost">Say hi</a>
                </div>
              </div>

              <motion.div
                ref={portraitRef}
                className="portrait-wrap"
                style={{ scale: portraitScale, rotate: portraitRotate, y: portraitY }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="portrait-frame">
                  <img src="./portrait.jpeg" alt="Portrait of Dylan Lucero" loading="eager" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="scroll-cue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            <span>Scroll</span>
            <motion.div
              className="scroll-cue-line"
              animate={{ scaleY: [0.2, 1, 0.2] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </section>

        <FadeSection id="about" className="section section-light">
          <div className="container">
            <h2>About</h2>
            <p className="section-text section-text-wide">
              I sit somewhere between <span className="hl">data</span>, <span className="hl">ML</span>, and plain old <span className="hl">engineering</span>. Most of what I do is taking a messy dataset, asking it the right questions, and building something — a model, a pipeline, a chart — that actually answers them. I care about making the work <span className="hl">reproducible</span> so future-me (and anyone else) doesn’t have to guess what past-me did.
            </p>

            <div className="about-block">
              <h3 className="about-heading">Focus — what I love working on</h3>
              <Marquee items={FOCUS} direction="left" duration={42} />
            </div>

            <div className="about-block">
              <h3 className="about-heading">Toolkit — what I reach for</h3>
              <Marquee items={TOOLKIT} direction="right" duration={48} solid />
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

        <FadeSection id="projects" className="section section-dark">
          <div className="container">
            <h2>Things I’ve Built</h2>
            <p className="section-text section-text-wide">
              A handful of recent projects from coursework and competitions. Each one taught me something I didn’t know going in — usually about the data, sometimes about myself.
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

        <FadeSection id="contact" className="section section-light">
          <div className="container">
            <h2>Let’s Talk</h2>
            <p className="section-text">
              Always up for an interesting problem — internships, research, or a good data conversation. Email’s the quickest way to reach me.
            </p>
            <div className="contact-card">
              <a href="mailto:dylanlucero98@gmail.com">dylanlucero98@gmail.com</a>
              <div className="contact-links">
                <a href="https://github.com/dylanlucero" target="_blank" rel="noreferrer">GitHub</a>
                <a href="https://www.linkedin.com/in/dylanlucero/" target="_blank" rel="noreferrer">LinkedIn</a>
              </div>
            </div>
          </div>
        </FadeSection>
      </main>
    </>
  );
}

export default App;
