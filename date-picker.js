function getMonthInfo(month, year) {
  const prevMonthDays = new Date(year, month, 0).getDate(),
    days = new Date(year, month + 1, 0).getDate(),
    emptyCells = new Date(year, month, 1).getDay(),
    name = new Date(year, month).toLocaleString("en-US", {
      month: "long"
    });

  return {
    prevMonthDays,
    days,
    emptyCells,
    name
  };
}

function resetDatePicker(query) {
  delete document.querySelector(query).value;

  const p = document.querySelector(query + " p");

  p.querySelector(":scope span").innerText = p.dataset.default;
}

function createDatePicker(query) {
  const id = "dp-" + uuid();
  const calendarID = id + "-c";
  const pID = id + "-p";

  const datePicker = document.querySelector(query);
  datePicker.className = "date-picker";
  datePicker.tabIndex = 0;
  datePicker.onblur = () => datePicker.classList.remove("active");

  const p = document.createElement("p");
  p.id = pID;
  p.dataset.default = "yyyy/mm/dd";
  p.innerHTML = `
    <span>${p.dataset.default}</span>
    <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M9,10V12H7V10H9M13,10V12H11V10H13M17,10V12H15V10H17M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H6V1H8V3H16V1H18V3H19M19,19V8H5V19H19M9,14V16H7V14H9M13,14V16H11V14H13M17,14V16H15V14H17Z"
      />
    </svg>
  `;
  p.onclick = () => datePicker.classList.toggle("active");

  const div = document.createElement("div");

  div.innerHTML = `
    <div class="month">
      <svg
        onclick="changeMonth(-1,'${calendarID}')"
        style="width: 24px; height: 24px; transform: rotate(90deg)"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
        />
      </svg>
      <p>October 2022</p>
      <svg
        onclick="changeMonth(1,'${calendarID}')"
        style="width: 24px; height: 24px; transform: rotate(-90deg)"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
        />
      </svg>
    </div>
  `;

  const calendar = document.createElement("div");
  calendar.className = "calendar";
  calendar.dataset.month = new Date().getMonth();
  calendar.dataset.year = new Date().getFullYear();
  calendar.id = calendarID;

  calendar.onclick = e => {
    if (e.target.tagName.toLowerCase() !== "p") return;

    e.target.className = "selected";
    p.onclick();

    const month = parseInt(calendar.dataset.month) + 1;

    datePicker.value = p.querySelector(":scope > span").innerText =
      calendar.dataset.year +
      "/" +
      (month < 10 ? `0${month}` : month) +
      "/" +
      (e.target.textContent.length === 1
        ? "0" + e.target.textContent
        : e.target.textContent);
  };

  div.appendChild(calendar);

  datePicker.appendChild(p);
  datePicker.appendChild(div);

  setCalendar(calendarID);
}

function changeMonth(num, calendarID) {
  const calendar = document.getElementById(calendarID);

  let month = parseInt(calendar.dataset.month) + num,
    year = parseInt(calendar.dataset.year);

  if (month < 0) {
    month += 12;
    year--;
  } else if (month > 11) {
    month -= 12;
    year++;
  }

  calendar.dataset.month = month;
  calendar.dataset.year = year;

  setCalendar(calendarID);
}

function setCalendar(calendarID) {
  const calendar = document.getElementById(calendarID);

  const { prevMonthDays, days, emptyCells, name } = getMonthInfo(
    parseInt(calendar.dataset.month),
    parseInt(calendar.dataset.year)
  );

  document.querySelector(".month p").innerText =
    name + " " + calendar.dataset.year;

  calendar.innerHTML = "";

  calendar.insertAdjacentHTML(
    "beforeend",
    `
    <p class='no-hover'>Sun</p>
    <p class='no-hover' >Mon</p>
    <p class='no-hover'>Tue</p>
    <p class='no-hover'>Wed</p>
    <p class='no-hover'>Thu</p>
    <p class='no-hover'>Fri</p>
    <p class='no-hover'>Sat</p>
  `
  );

  for (let i = emptyCells - 1; i >= 0; i--)
    calendar.insertAdjacentHTML(
      "beforeend",
      `<p class="no-hover other-month">${prevMonthDays - i}</p>`
    );

  for (let i = 1; i <= days; i++)
    calendar.insertAdjacentHTML("beforeend", `<p>${i}</p>`);

  const numCells = emptyCells + days;

  for (let i = numCells + 1; i <= 42; i++)
    calendar.insertAdjacentHTML(
      "beforeend",
      `<p class="no-hover other-month">${i - numCells}</p>`
    );
}
