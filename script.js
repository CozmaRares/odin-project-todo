let filter = null;

const PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high"
};

function getTodayDate() {
  return new Date().toLocaleDateString("en-ZA");
}

function loadFromStorage(key) {
  // const data = localStorage.getItem(key);

  // if (data === null) return;

  // return JSON.parse(data);
  return;
}

let projects = loadFromStorage("projects") || {
  personal: [
    {
      id: "t-" + uuid(),
      title: "Finish this shit",
      priority: PRIORITY.LOW,
      dueDate: "2022/10/09",
      done: true
    }
  ],
  work: []
};

function renderProjects() {
  const sidebar = document.querySelector("[data-sidebar]");

  sidebar.innerHTML = "";

  Object.keys(projects).forEach(project => {
    const li = document.createElement("li");

    li.onclick = () => renderTasks(project);

    li.id = project;
    li.className = "project-list";
    li.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M4 13C2.89 13 2 13.89 2 15V19C2 20.11 2.89 21 4 21H8C9.11 21 10 20.11 10 19V15C10 13.89 9.11 13 8 13M8.2 14.5L9.26 15.55L5.27 19.5L2.74 16.95L3.81 15.9L5.28 17.39M4 3C2.89 3 2 3.89 2 5V9C2 10.11 2.89 11 4 11H8C9.11 11 10 10.11 10 9V5C10 3.89 9.11 3 8 3M4 5H8V9H4M12 5H22V7H12M12 19V17H22V19M12 11H22V13H12Z"
          />
        </svg>
        ${project}
        <svg viewBox="0 0 24 24" class="trash-can" onclick="deleteProject('${project}')">
          <path
            fill="currentColor"
            d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"
          />
        </svg>
      `;

    sidebar.appendChild(li);
  });

  sidebar.insertAdjacentHTML(
    "beforeend",
    `
      <li data-add-project class="add-project" onclick="openProjectPrompt()">
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
          />
        </svg>
        Add Project
      </li>
      <div>
        <input type="text" id="add-project" />
        <div class="add" onclick="addProject()">Add</div>
        <div class="cancel" onclick="closeProjectPrompt()">Cancel</div>
      </div>
      `
  );
}

function renderTasks(type = null) {
  filter = type;

  document.querySelector("[data-list]").innerHTML = "";

  document.querySelector("[data-title]").innerText = type ? type : "all";

  if (type === "done") return renderAllTasks(true);
  if (type === "today") return renderTodayTasks();
  if (type === "by priority") return sortByPriority();

  if (type !== null) return renderProjectTasks(type);

  renderAllTasks();
}

function renderAllTasks(onlyDone) {
  Object.keys(projects).forEach(project =>
    renderProjectTasks(project, onlyDone)
  );
}

function renderProjectTasks(project, onlyDone) {
  projects[project].forEach((task, idx) =>
    renderTask(project, task, idx, onlyDone)
  );
}

function renderTodayTasks() {
  const todayDate = getTodayDate();

  Object.entries(projects).forEach(([project, tasks]) =>
    tasks.forEach((task, idx) => {
      if (task.dueDate === todayDate) renderTask(project, task, idx);
    })
  );
}

function sortByPriority() {
  const high = {},
    medium = {},
    low = {};

  Object.entries(projects).forEach(([project, tasks]) => {
    high[project] = [];
    medium[project] = [];
    low[project] = [];

    tasks.forEach(task => {
      if (task.priority === PRIORITY.HIGH) return high[project].push(task);

      if (task.priority === PRIORITY.MEDIUM) return medium[project].push(task);

      low[project].push(task);
    });
  });

  // debugger;

  [high, medium, low].forEach(object => {
    Object.entries(object).forEach(([project, tasks]) =>
      tasks.forEach((task, idx) => renderTask(project, task, idx))
    );
  });
}

function renderTask(project, task, idx, onlyDone) {
  if (onlyDone === true && task.done === false) return;

  const { id, title, dueDate, priority, done } = task;

  const li = document.createElement("li");

  li.id = id;
  li.className = priority;

  if (done === true) {
    li.classList.add("done");
    if (onlyDone === false) li.classList.add("strike-through");
  }

  const circle = document.createElement("div");
  circle.className = "circle";
  circle.onclick = () => {
    li.classList.toggle("done");

    if (onlyDone === false) li.classList.toggle("strike-through");

    projects[project][idx].done = !projects[project][idx].done;
  };

  li.appendChild(circle);
  li.insertAdjacentHTML(
    "beforeend",
    `
      <div class="info">
        <p>${title}</p>
        <p>${dueDate}</p>
      </div>
      <div class="project-name">${project}</div>
      <svg style="width:24px;height:24px" viewBox="0 0 24 24" class="trash-can" onclick="deleteTask('${id}','${project}')" title="Delete Task">
        <path
          fill="currentColor"
          d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"
        />
      </svg>
    `
  );

  document.querySelector("[data-list]").appendChild(li);
}

document.querySelector("[data-task-form]").onsubmit = e => {
  e.preventDefault();

  if (Object.keys(projects).length === 0) {
    alert("Please add a project");
    document.querySelector("[data-task-overlay]").classList.remove("active");
    return;
  }

  const task = {};

  const form = document.querySelector("[data-task-form]");

  form
    .querySelectorAll(":scope [data-input]")
    .forEach(inp => (task[inp.id] = inp.value));

  form.querySelector(":scope input").value = "";

  form
    .querySelectorAll(":scope .select")
    .forEach(select => resetSelect("#" + select.id));

  resetDatePicker("#dueDate");

  if (task.project === undefined) task.project = Object.keys(projects)[0];

  if (task.priority === undefined) task.priority = PRIORITY.LOW;

  if (task.dueDate === undefined) task.dueDate = getTodayDate();

  if (task.dueDate < getTodayDate()) {
    alert("Please select an upcoming date");
    document.querySelector("[data-task-overlay]").classList.remove("active");
    return;
  }

  addTask(task);

  document.querySelector("[data-task-overlay]").classList.remove("active");
};

function addTask(task) {
  const project = [...task.project].join("");

  delete task.project;

  task.id = "t-" + uuid();
  task.done = false;

  projects[project].push(task);
  renderTasks(filter);
}

function deleteTask(id, project) {
  projects[project] = projects[project].filter(task => task.id !== id);

  renderTasks(filter);
}

function openProjectPrompt() {
  document.querySelector("[data-add-project]").classList.add("inactive");
}

function closeProjectPrompt() {
  document.getElementById("add-project").value = "";
  document.querySelector("[data-add-project]").classList.remove("inactive");
}

function addProject() {
  const input = document.getElementById("add-project");
  projects[input.value] = [];
  input.value = "";

  document.querySelector("[data-add-project]").classList.remove("inactive");

  updateSelect("#project", Object.keys(projects));
  renderProjects();
}

function deleteProject(name) {
  document.getElementById(name).onclick = undefined;

  delete projects[name];

  updateSelect("#project", Object.keys(projects));

  renderProjects();
  renderTasks();
}

document.querySelectorAll(".overlay").forEach(
  overlay =>
    (overlay.onclick = e => {
      if (e.target !== overlay) return;

      overlay.classList.remove("active");
    })
);

document.querySelector("[data-add-task]").onclick = () =>
  document.querySelector("[data-task-overlay]").classList.add("active");

createSelect("#project", Object.keys(projects), "select project");
createSelect(
  "#priority",
  Object.entries(PRIORITY).map(([priority, _]) => priority.toLowerCase()),
  "select priority"
);
createDatePicker("#dueDate");

renderProjects();
renderTasks();
