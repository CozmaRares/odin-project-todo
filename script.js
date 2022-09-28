function toggleList(li) {
  li.classList.toggle("active");
}

const projects = localStorage.getItem("projects") || {
  personal: [],
  work: []
};

Object.entries(projects).forEach(([type, projects]) => {
  const li = document.createElement("li");

  li.onclick = () => toggleList(li);
  li.className = "project-list";
  li.innerHTML = `
  <div>
    <svg viewBox="0 0 24 24" class="caret">
      <path
        fill="currentColor"
        d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
      />
    </svg>
    ${type}
  </div>
  <div>
      ${
        projects.length !== 0
          ? projects.map(project => `<div>${project}</div>`).join("")
          : "no projects added"
      }
  </div>
  `;

  document.querySelector(".sidebar").appendChild(li);
});
