import { useEffect, useRef } from "react";

const SKILL_CATEGORIES = [
  {
    name: "Data Integrity & Testing",
    items: [
      "User Acceptance Testing (UAT)",
      "Quality Assurance (QA)",
      "Data Cleaning & Validation",
      "Financial/Statistical Analysis",
      "ETL",
      "Discrepancy Tracking",
      "Data Quality Guardrails"
    ],
    type: "accent"
  },
  {
    name: "Languages",
    items: ["SQL", "Python", "R", "Java", "C/C++"],
    type: "solid"
  },
  {
    name: "Tools",
    items: [
      "Excel (Pivot Tables, Advanced Formulas)",
      "Tableau",
      "Power BI",
      "Alteryx",
      "AWS",
      "Git/GitHub",
      "PostgreSQL",
      "MongoDB"
    ],
    type: "standard"
  },
  {
    name: "Libraries",
    items: [
      "Pandas",
      "NumPy",
      "scikit-learn",
      "PyTorch",
      "SciPy",
      "Matplotlib",
      "Plotly",
      "ggplot2"
    ],
    type: "solid"
  }
];

const projects = [
  {
    title: "AI Energy Consumption & Grid Impact",
    meta: "Major Capstone Project · Spring 2025",
    bullets: [
      "Built automated ETL pipelines via EIA APIs (Python, SQL) to analyze residential utility price burdens across multiple states.",
      "Trained a PyTorch Transformer model on rolling windows to classify electricity demand, achieving 76% test accuracy."
    ],
    stack: "Python · PyTorch · scikit-learn · SQL",
    image: "./project_energy.png",
    link: "#",
  },
  {
    title: "Los Angeles Crime Data Analysis",
    meta: "Academic Project · Spring 2025",
    bullets: [
      "Cleaned and transformed 900K+ arrest records from the LA Open Data Portal, removing 18 irrelevant attributes.",
      "Identified demographic arrest differences using a two-sample t-test and mapped spatial clusters across 16 areas."
    ],
    stack: "R · ggplot2 · Plotly · Stats",
    image: "./project_crime.png",
    link: "#",
  },
  {
    title: "MLB Home Run Analysis",
    meta: "Personal Project · Spring 2025",
    bullets: [
      "Developed BeautifulSoup web scrapers (Python) to extract batting metrics from paginated sports data sources.",
      "Conducted team-level power hitting t-tests (SciPy) and created 5+ interactive player-metric charts in Plotly."
    ],
    stack: "Python · Pandas · SciPy · Plotly",
    image: "./project_mlb.png",
    link: "https://github.com/dylanlucero",
  },
  {
    title: "ASA DataFest 2025 — Real Estate",
    meta: "Competition · April 2025",
    bullets: [
      "Collaborated in a 48-hour sprint to clean, analyze, and model 6 years of national real estate data, earning 5th Place.",
      "Built linear regression forecasting models for regional price trends and prepped interactive Tableau dashboards."
    ],
    stack: "Python · Pandas · Tableau · Stats",
    image: "./project_datafest.png",
    link: "#",
  },
  {
    title: "Diffusion Model for Digit Generation",
    meta: "Academic Project · Fall 2025",
    bullets: [
      "Trained a PyTorch denoising diffusion model on MNIST to generate handwritten digits from pure gaussian noise.",
      "Implemented a 6-layer U-Net with skip connections, GELU activations, and a 5-step sampling schedule."
    ],
    stack: "Python · PyTorch · NumPy · U-Net",
    image: "./project_diffusion.png",
    link: "https://github.com/dylanlucero",
  },
];

function ShaderBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const currentMouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      };
    };
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mouseRef.current = {
          x: e.touches[0].clientX / window.innerWidth,
          y: 1 - e.touches[0].clientY / window.innerHeight,
        };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

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
      uniform vec2 u_mouse;
      uniform float u_time;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res.xy;
        
        // Aspect-ratio correction to prevent stretching of circular mouse-following gradient
        vec2 p = uv;
        float aspect = u_res.x / u_res.y;
        p.x *= aspect;
        
        vec2 m = u_mouse;
        m.x *= aspect;
        
        float dist = distance(p, m);
        
        // Add subtle organic distortion to the highlight using noise
        float n = noise(p * 5.0 + u_time * 0.15);
        dist += n * 0.035;
        
        // Warm technical sand/gray desk background: #eae6dc
        vec3 desk = vec3(0.918, 0.902, 0.863);
        
        // Soft warm sunlight spotlight glow: #faeed1
        vec3 glow = vec3(0.980, 0.937, 0.820);
        
        // Radial blend centered on mouse position
        float intensity = smoothstep(0.48, 0.0, dist);
        vec3 col = mix(desk, glow, intensity * 0.55);
        
        // Subtle paper fiber grain texture
        float grain = hash(gl_FragCoord.xy + u_time * 0.01) * 0.014;
        col -= vec3(grain);
        
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
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
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
      // Smoothly interpolate current mouse coordinate to target
      currentMouseRef.current.x += (mouseRef.current.x - currentMouseRef.current.x) * 0.08;
      currentMouseRef.current.y += (mouseRef.current.y - currentMouseRef.current.y) * 0.08;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, currentMouseRef.current.x, currentMouseRef.current.y);
      gl.uniform1f(uTime, (t - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="shader-bg" aria-hidden="true" />;
}

function App() {
  return (
    <>
      <ShaderBackground />

      <div className="notebook-sheet">
        <header className="site-header">
          <div className="container">
            <nav className="notebook-nav">
              <a href="#hero" className="nav-link">// 01_INTRO</a>
              <a href="#about" className="nav-link">// 02_ABOUT</a>
              <a href="#projects" className="nav-link">// 03_PROJECTS</a>
              <a href="#contact" className="nav-link">// 04_CONTACT</a>
            </nav>
          </div>
        </header>

        <main>
          <section id="hero" className="hero">
            <div className="container hero-content">
              <div className="hero-grid">
                <div className="hero-text">
                  <div className="notebook-tag">SEC_01 // INTRO</div>
                  <h1>Dylan Lucero</h1>
                  <div className="sub-roles">
                    [ DATA SCIENTIST ] &bull; [ SOFTWARE ENGINEER ] &bull; [ DATA INTEGRITY &amp; TESTING ]
                  </div>
                  <p className="lead">
                    Hi, I’m Dylan. I’m a data scientist and developer focused on turning complex, messy datasets into clean, reliable pipelines. Having completed my <span className="hl">B.S. in Data Science</span> at <span className="hl">Arizona State</span>, I’m preparing for my <span className="hl">M.S. in Industrial Engineering</span> to blend statistical analysis with operations research. I thrive on unstructured challenges that need a balance of mathematics and code to solve.
                  </p>
                  <div className="hero-actions">
                    <a href="#projects" className="btn btn-primary">See my work</a>
                    <a href="#contact" className="btn btn-ghost">Say hi</a>
                  </div>
                </div>

                <div className="portrait-wrap">
                  <div className="portrait-frame">
                    <img src="./portrait.jpeg" alt="Portrait of Dylan Lucero" loading="eager" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="about" className="section">
            <div className="container">
              <div className="notebook-tag">SEC_02 // ABOUT</div>
              <h2>About</h2>
              <p className="section-text section-text-wide">
                My work lies at the intersection of statistical modeling, data integrity, and software engineering. From validating predictive PyTorch Transformer models for regional utility baselines, to profiling and scrubbing campaign data using SHAP analysis, I enjoy writing code that makes complex data clear and reliable. I place a strong emphasis on <span className="hl">reproducibility and testing</span>—ensuring that every pipeline, validation script, and statistical model is robust and easy to build upon.
              </p>

              <div className="about-block">
                <h3 className="about-heading">Education</h3>
                <div className="edu-list">
                  <div className="edu-item">
                    <div className="edu-degree">M.S. Industrial Engineering</div>
                    <div className="edu-school">Arizona State University Online</div>
                    <div className="edu-date">Expected May 2028</div>
                  </div>
                  <div className="edu-item">
                    <div className="edu-degree">B.S. Data Science, Computer Science Track</div>
                    <div className="edu-school">Arizona State University &bull; Tempe, AZ</div>
                    <div className="edu-date">May 2026 &bull; GPA: 3.32/4.00</div>
                  </div>
                  <div className="edu-item">
                    <div className="edu-degree">A.S. Computer Science</div>
                    <div className="edu-school">Glendale Community College &bull; Glendale, AZ</div>
                    <div className="edu-date">December 2023 &bull; GPA: 3.47/4.00</div>
                  </div>
                </div>
              </div>

              {SKILL_CATEGORIES.map((cat, idx) => (
                <div key={idx} className="about-block">
                  <h3 className="about-heading">{cat.name}</h3>
                  <div className="chip-row">
                    {cat.items.map((item, i) => {
                      let cls = "chip";
                      if (cat.type === "solid") cls = "chip chip-solid";
                      if (cat.type === "accent") cls = "chip chip-accent";
                      return <span key={i} className={cls}>{item}</span>;
                    })}
                  </div>
                </div>
              ))}

              <div className="about-block">
                <h3 className="about-heading">Extracurriculars &amp; Certifications</h3>
                <div className="chip-row">
                  <span className="chip chip-accent">Alteryx Core Designer Certification (March 2026)</span>
                  <span className="chip chip-solid">ASA DataFest 2025 (5th Place)</span>
                </div>
              </div>
            </div>
          </section>

          <section id="projects" className="section">
            <div className="container">
              <div className="notebook-tag">SEC_03 // THINGS I'VE BUILT</div>
              <h2>Things I’ve Built</h2>
              <p className="section-text section-text-wide">
                A handful of recent projects from coursework, competitions, and personal development. Each represents a unique challenge solved using modern data engineering and statistical methods.
              </p>
              <div className="project-grid">
                {projects.map((project, idx) => (
                  <article key={idx} className="project-card">
                    {project.image && (
                      <div className="project-card-image-wrap">
                        <img src={project.image} alt={project.title} className="project-card-image" loading="lazy" />
                      </div>
                    )}
                    <div className="project-card-content">
                      <h3>{project.title}</h3>
                      {project.meta && <p className="project-meta">{project.meta}</p>}
                      <ul className="project-bullets">
                        {project.bullets.map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                      <div className="project-foot">
                        <span className="project-stack">{project.stack}</span>
                        <a href={project.link} className="project-link" target="_blank" rel="noreferrer">Code &rarr;</a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="contact" className="section">
            <div className="container">
              <div className="notebook-tag">SEC_04 // CONTACT</div>
              <h2>Let’s Talk</h2>
              <p className="section-text">
                I’m always open to talking shop about data engineering, machine learning pipelines, or upcoming research opportunities in operations and systems modeling. Whether you have a challenging technical problem or just want to connect, feel free to drop me an email!
              </p>
              <div className="contact-card">
                <a href="mailto:dylanlucero98@gmail.com" className="contact-email">dylanlucero98@gmail.com</a>
                <div className="contact-links">
                  <a href="https://github.com/dylanlucero" target="_blank" rel="noreferrer">GitHub</a>
                  <a href="https://www.linkedin.com/in/dylanlucero/" target="_blank" rel="noreferrer">LinkedIn</a>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default App;
