/* ==== Root Theme ==== */
:root {
  --bg: #fdfdfd;
  --text: #222;
  --muted: #666;
  --brand: #7c5cff;
  --brand-accent: #00e0b8;
  --card: #ffffff;
  --border: #e3e3e3;
  --shadow: 0 8px 20px rgba(0,0,0,0.08);
  --radius: 14px;
  --gap: clamp(16px, 2vw, 28px);
}

html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: 'Inter', system-ui, sans-serif;
  background: linear-gradient(135deg, #fdfbfb, #ebedee);
  color: var(--text);
  line-height: 1.6;
}

/* ==== Containers ==== */
.container { width: min(1100px, 90%); margin-inline: auto; }
.section { padding: clamp(60px, 10vh, 100px) 0; }
.section h2 { font-size: 2.2rem; margin-bottom: 16px; }
.section p { color: var(--muted); }

/* ==== Header ==== */
.site-header {
  position: sticky; top: 0; z-index: 100;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(12px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}
.header-inner {
  display: flex; justify-content: space-between; align-items: center;
  min-height: 70px;
}
.brand { display: flex; align-items: center; gap: 10px; font-weight: 800; text-decoration: none; color: var(--text); }
.brand .accent { color: var(--brand); }

.nav-list {
  display: flex; gap: 18px; list-style: none; margin: 0; padding: 0;
}
.nav-list a {
  text-decoration: none; color: var(--text); font-weight: 600; padding: 6px 10px; border-radius: 8px;
  transition: background 0.2s ease;
}
.nav-list a:hover { background: rgba(124,92,255,0.1); }

/* ==== Hero ==== */
.hero {
  display: flex; align-items: center;
  min-height: 85vh;
  text-align: center;
}
.hero-inner { display: flex; flex-direction: column; gap: 20px; }
.hero-title { font-size: clamp(2.2rem, 5vw, 3.5rem); margin: 0; }
.hero-subtitle { color: var(--muted); }
.hero-cta { display: flex; justify-content: center; gap: 16px; margin-top: 20px; }

.btn {
  border: none; cursor: pointer; font-size: 1rem; font-weight: 600;
  border-radius: 8px; padding: 12px 20px; text-decoration: none; display: inline-block;
  transition: all 0.3s ease;
}
.btn.primary {
  background: linear-gradient(90deg, var(--brand), var(--brand-accent));
  color: #fff;
  box-shadow: var(--shadow);
}
.btn.primary:hover { transform: translateY(-2px); }
.btn.ghost {
  background: transparent; border: 2px solid var(--brand); color: var(--brand);
}
.btn.ghost:hover { background: var(--brand); color: #fff; }

/* ==== Cards ==== */
.card {
  background: var(--card); border-radius: var(--radius); padding: 24px;
  box-shadow: var(--shadow); margin-bottom: 20px;
  transition: transform 0.2s ease;
}
.card:hover { transform: translateY(-4px); }

/* ==== Grid ==== */
.grid { display: grid; gap: var(--gap); }
.about-grid { grid-template-columns: 1.2fr 0.8fr; align-items: start; }
.highlights { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.highlights li {
  padding: 10px 14px; border-left: 4px solid var(--brand);
  background: rgba(124,92,255,0.05); border-radius: 8px;
}

/* ==== Projects ==== */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--gap);
}
.project-card {
  background: var(--card); border-radius: var(--radius); overflow: hidden;
  box-shadow: var(--shadow); display: flex; flex-direction: column;
}
.project-card img { width: 100%; height: 180px; object-fit: cover; }
.project-card .content { padding: 16px; }
.project-card h3 { margin: 0; font-size: 1.3rem; }
.project-card p { color: var(--muted); font-size: 0.95rem; }
.tags { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px; }
.tags span { background: rgba(0,224,184,0.1); padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; }

/* ==== Skills ==== */
.skills { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 12px; }
.skills span { background: rgba(124,92,255,0.1); padding: 8px 14px; border-radius: 8px; font-weight: 600; }

/* ==== Achievements ==== */
#achievements ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
#achievements li {
  padding: 12px 16px; border-radius: 8px;
  background: rgba(0,0,0,0.04);
  font-weight: 500;
}

/* ==== Contact ==== */
form .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
form input, form textarea {
  padding: 12px 14px; border-radius: 8px; border: 1px solid var(--border); font-size: 1rem;
}
form button { margin-top: 10px; }

/* ==== Footer ==== */
.site-footer {
  padding: 20px 0; text-align: center;
  background: var(--bg);
  border-top: 1px solid var(--border);
  margin-top: 40px;
}
.footer-inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; }
.social { list-style: none; display: flex; gap: 12px; padding: 0; margin: 0; }
.social a { text-decoration: none; color: var(--brand); font-weight: 600; }

/* ==== Responsive ==== */
@media (max-width: 900px) {
  .about-grid { grid-template-columns: 1fr; }
  .footer-inner { flex-direction: column; gap: 10px; }
}
