function setSelect(liID, pID) {
  const p = document.getElementById(pID);
  p.parentElement.value = p.querySelector(":scope > span").innerText =
    document.getElementById(liID).textContent;
  p.onclick();
}

function resetSelect(query) {
  delete document.querySelector(query).value;

  const p = document.querySelector(query + " p");

  p.querySelector(":scope span").innerText = p.dataset.default;
}

function updateSelect(query, options) {
  const ul = document.querySelector(query + " ul");
  const id = ul.id;
  pID = id + "-p";

  ul.innerHTML = "";

  options.forEach((option, idx) =>
    ul.insertAdjacentHTML(
      "beforeend",
      `<li id="${id}-${idx}" onclick="setSelect(this.id,'${pID}')">${option}</li>`
    )
  );
}

function createSelect(query, options, defaultText) {
  const id = "s-" + uuid();

  const taskSelect = document.querySelector(query);
  taskSelect.tabIndex = 0;
  taskSelect.className = "select";
  taskSelect.onblur = () => taskSelect.classList.remove("active");

  const p = document.createElement("p");
  p.id = id + "-p";
  p.dataset.default = defaultText;
  p.innerHTML = `
      <span>${p.dataset.default}</span>
      <svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
        />
      </svg>
    `;
  p.onclick = () => {
    taskSelect.classList.toggle("active");
  };

  const ul = document.createElement("ul");
  ul.id = id;
  options.forEach((option, idx) =>
    ul.insertAdjacentHTML(
      "beforeend",
      `<li id="${id}-${idx}" onclick="setSelect(this.id,'${p.id}')">${option}</li>`
    )
  );

  taskSelect.appendChild(p);
  taskSelect.appendChild(ul);
}
