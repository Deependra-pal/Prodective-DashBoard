function openFeature() {
  var allElems = document.querySelectorAll(".allElems .elem");
  var fullPage = document.querySelectorAll(".fullPage");
  var backBtn = document.querySelectorAll(".fullPage .backbtn");

  allElems.forEach((e) => {
    e.addEventListener("click", () => {
      fullPage[e.id].style.display = "block";
    });
  });

  // backBtn  code
  backBtn.forEach((back) => {
    back.addEventListener("click", () => {
      fullPage[back.id].style.display = "none";
    });
  });
}

openFeature();

// TODO app feature

var form = document.querySelector(".add-Task form");
var taskInput = document.querySelector(".add-Task form input");
var taskDetails = document.querySelector(".add-Task form textarea");
var taskCheckBox = document.querySelector(".add-Task form .mark-imp input");

function Todo() {
  // Local  Storage
  var currentTask = [];
  if (localStorage.getItem("currentTask")) {
    currentTask = JSON.parse(localStorage.getItem("currentTask"));
  } else {
    localStorage.setItem("currentTask", currentTask);
  }

  function renderTask() {
    var allTask = document.querySelector(".all-Task");
    var heading = document.querySelector(".todo-fullpage .heading");
    heading.innerHTML =
      currentTask.length === 0
        ? `📋 Your Tasks`
        : `📋 Your Tasks (${currentTask.length})`;

    var sum = `<h3>Your All Task</h3>`;

    if (currentTask.length === 0) {
      sum += `<p class="empty"><span>📭</span> No tasks yet</p>`;
    }

    currentTask.forEach((elem, idx) => {
      sum += `
<details class="task">

  <summary class="task-header">

    <h5 class="${elem.completed ? "completed" : ""}">
      ${elem.task} <span class=${elem.imp}>Imp</span>
    </h5>

    <div class="task-btns">
      <button class="complete-btn ${elem.completed ? "done" : ""}" id=${idx}>
        ${elem.completed ? "Completed" : "Complete"}
      </button>

      <button class="delete-btn" id=${idx}>Delete</button>
    </div>

  </summary>

  <p class="task-details">${elem.details}</p>

</details>
`;
    });

    allTask.innerHTML = sum;
    localStorage.setItem("currentTask", JSON.stringify(currentTask));

    completeTask();
    deleteFeature();
  }
  renderTask();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (taskInput.value.trim() === "") {
      alert("Please fill the Task");
      return;
    } else {
      currentTask.push({
        task: taskInput.value,
        details: taskDetails.value,
        imp: taskCheckBox.checked,
        completed: false,
      });
    }
    renderTask();

    taskInput.value = "";
    taskDetails.value = "";
    taskCheckBox.checked = false;
  });

  // Delete Feature
  function deleteFeature() {
    var deleteBtn = document.querySelectorAll(".task .task-btns .delete-btn");
    deleteBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        let index = btn.id;
        currentTask.splice(index, 1);
        renderTask();
      });
    });
  }

  // compeleted Feature
  function completeTask() {
    var completeBtn = document.querySelectorAll(
      ".task .task-btns .complete-btn",
    );

    completeBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        let index = btn.id;

        currentTask[index].completed = !currentTask[index].completed;
        console.log(currentTask);

        renderTask();
      });
    });
  }
}

Todo();

// Daily Planner
function Planner() {
  var planner = document.querySelector(".planner");
  var dayPlanData = JSON.parse(localStorage.getItem("dayPlanData")) || {};

  // UI rendering
  var hours = Array.from({ length: 18 }, function (_, idx) {
    return 6 + idx;
  });

  var wholeDaysSum = "";

  hours.forEach((hour) => {
    let showData = dayPlanData[hour] || "";

    wholeDaysSum += `
      <div class="planner-row">
        <p>${hour}:00 - ${hour + 1}:00</p>
        <input 
          type="text" 
          data-hour="${hour}" 
          placeholder="..." 
          value="${showData}"
        >
      </div>
    `;
  });

  planner.innerHTML = wholeDaysSum;

  // input handling
  let plannerInput = document.querySelectorAll(".planner-row input");

  plannerInput.forEach((elem) => {
    elem.addEventListener("input", () => {
      let hour = elem.dataset.hour;

      dayPlanData[hour] = elem.value;

      localStorage.setItem("dayPlanData", JSON.stringify(dayPlanData));
    });
  });
}

function restartData() {
  let todayDate = new Date().toISOString().split("T")[0];
  let oldDate = localStorage.getItem("currentDate");

  if (oldDate !== todayDate) {
    localStorage.removeItem("dayPlanData");
    localStorage.setItem("currentDate", todayDate);
  } else {
  }
}

function date() {
  var time = document.querySelector(".date h3");

  let today = new Date();

  let date = today.toISOString().split("T")[0].split("-")[2];

  let dayPlanner = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
  });
  let monthName = dayPlanner.split(" ")[0];
  let dayName = dayPlanner.split(" ")[1];

  time.innerHTML = `${dayName} , ${date} ${monthName}`;

  let formattedDate = today.toISOString().split("T")[0];
}
restartData();
Planner();
date();


function motivationalQuote() {
  var currentDate = new Date().toISOString().split("T")[0];

  // get  data from localstorage
  const saveQuote = localStorage.getItem("quote");
  const saveAuthro = localStorage.getItem("author");
  const saveDate = localStorage.getItem("currentDate");

  const liveDate = new Date().toISOString().split("T")[0].split("-")[2];
  document.querySelector(".motivation-1 .date h5").innerHTML = liveDate;

  const liveDay = new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
    })
    .split(" ")[0];

  document.querySelector(".motivation-1 .date h3").innerHTML = liveDay;

  // API Call
  async function getData() {
    try {
      const response = await fetch(
        "https://motivational-spark-api.vercel.app/api/quotes/random",
      );
      const data = await response.json();
      const author = data.author;
      const quote = data.quote;

      // local storage

      localStorage.setItem("author", author);
      localStorage.setItem("quote", quote);
      localStorage.setItem("currentDate", currentDate);

      document.querySelector(".motivation-2 h2").innerHTML = quote;
      document.querySelector(".author-name h2").innerHTML = author;
    } catch (err) {
      console.log(err);
    }
  }

  if (!saveQuote || !saveDate) {
    getData();
  } else if (saveDate.trim() === currentDate.trim()) {
    document.querySelector(".motivation-2 h2").innerText = saveQuote;
    document.querySelector(".author-name h2").innerText = saveAuthro;
  } else {
    getData();
  }
}
motivationalQuote();
