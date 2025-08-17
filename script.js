// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Render Projects
const projects = window.__PROJECTS__ || [];
const grid = document.getElementById("projectsGrid");

function renderProjects() {
  projects.forEach(p => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.setAttribute("data-animate","");
    card.innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.blurb}</p>
      <div class="tags">${p.stack.map(s=>`<span>${s}</span>`).join("")}</div>
    `;
    grid.appendChild(card);
  });
}
renderProjects();

// Contact form dummy
document.getElementById("contactForm").addEventListener("submit", e=>{
  e.preventDefault();
  alert("✅ Thank you for reaching out, Sneha will get back to you soon!");
  e.target.reset();
});

// Intersection Observer for animations
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
},{threshold:0.2});

document.querySelectorAll("[data-animate]").forEach(el=>observer.observe(el));
