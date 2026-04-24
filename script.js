function openFeature() {
  var allElems = document.querySelectorAll(".allElems .elem");
  var fullPage = document.querySelectorAll(".fullPage");
  var backBtn = document.querySelectorAll(".fullPage .backbtn");
  var header = document.querySelector(".weather-header");
  console.log(header);

  allElems.forEach((e) => {
    e.addEventListener("click", () => {
      fullPage[e.id].style.display = "block";
      header.style.display = "none";
    });
  });

  // backBtn  code
  backBtn.forEach((back) => {
    back.addEventListener("click", () => {
      fullPage[back.id].style.display = "none";
      header.style.display = "block";
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

function weatherFancilitiy() {
  // api & key
  var apikeys = "80c2275973964ae193961552260104";
  var city = "Ghaziabad";

  // selection

  var loc = document.querySelector(".left .location");
  var temp = document.querySelector(".right .temp");
  var humidity = document.querySelector(".content .right .Humidity");
  var wind = document.querySelector(".right .Wind");
  var percipitation = document.querySelector(".right .percipitation");
  var condition = document.querySelector(".right .condition");
  var Day = document.querySelector(".left .time");
  var dateTrack = document.querySelector(".left .date");
  console.log(date.innerHTML);

  async function weatherAPI() {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${apikeys}&q=${city}`,
    );
    const data = await response.json();
    console.log(data);

    loc.innerHTML = `${data.location.name} , ${data.location.region}`;
    temp.innerHTML = `${Math.floor(data.current.temp_c)}°C`;
    humidity.innerHTML = `Humidity: ${data.current.humidity}%`;
    wind.innerHTML = `Wind: ${Math.floor(data.current.wind_kph)}km/h`;
    percipitation.innerHTML = `Heat Index: ${data.current.heatindex_c}`;
    condition.innerHTML = `condition: ${data.current.condition.text}`;
  }
  weatherAPI();

  function timeDate() {
    let date = new Date();

    var liveDay = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
    });

    var findDay = liveDay.split(" ")[1];
    var findMonth = liveDay.split(" ")[0];

    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var findDate = date.getDate();
    var findYear = date.getFullYear();

    Day.innerHTML = `${findDay}, ${hours}:${minutes}`;
    dateTrack.innerHTML = `${findDate} ${findMonth} ${findYear}`;

    if (hours > 12) {
      Day.innerHTML = `${findDay}, ${String(hours - 12).padStart("2", 0)}:${String(minutes).padStart("2", 0)}:${String(seconds).padStart("2", 0)} PM`;
    } else {
      Day.innerHTML = `${findDay}, ${String(hours).padStart("2", 0)}:${minutes}:${String(seconds).padStart("2", 0)} AM`;
    }
  }

  setInterval(() => {
    timeDate();
  }, 1000);
}

weatherFancilitiy();

function dailyPlanner() {
  let timerInterval = null;
  let totalSeconds = 25 * 60;

  let timer = document.querySelector(".pomo-timer h2");
  var startBtn = document.querySelector(".pomo-timer .start-timer");
  var pauseBtn = document.querySelector(".pomo-timer .pause-timer");
  var resetBtn = document.querySelector(".pomo-timer .reset-timer");
  var Session = document.querySelector(".pomo-timer h3");
  console.log(Session);

  var isWorkSession = true;

  function updateTImer() {
    let minutes = Math.floor(totalSeconds / 60);
    let secounds = totalSeconds % 60;

    timer.innerHTML = `${String(minutes).padStart("2", "0")}:${String(secounds).padStart("2", "0")}`;
  }

  function startTimer() {
    clearInterval(timerInterval);

    if (isWorkSession) {
      timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
          totalSeconds--;
          updateTImer();
        } else {
          isWorkSession = false;
          clearInterval(timerInterval);
          timer.innerHTML = `05:00`;
          Session.innerHTML = "Break Session";
          Session.style.backgroundColor = "var(--accent)";
          totalSeconds = 5 * 60;
        }
      }, 1000);
    } else {
      timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
          totalSeconds--;
          updateTImer();
        } else {
          isWorkSession = true;
          clearInterval(timerInterval);
          timer.innerHTML = `25:00`;
          Session.innerHTML = "Work Session";
          Session.style.backgroundColor = "var(--green)";
          totalSeconds = 25 * 60;
        }
      }, 1000);
    }
  }

  function pauseTimer() {
    clearInterval(timerInterval);
  }

  function resetTimer() {
    totalSeconds = 25 * 60;
    clearInterval(timerInterval);
    updateTImer();
  }

  pauseBtn.addEventListener("click", pauseTimer);
  startBtn.addEventListener("click", startTimer);
  resetBtn.addEventListener("click", resetTimer);
}

dailyPlanner();

var themeBtn = document.querySelector(".nav-in .theme");
var rootElement = document.documentElement;
var flag = 0;

const themes = [
  {
    name: "sunset",
    pri: "#F8F4E1",
    sec: "#222831",
    tri1: "#948979",
    tri2: "#393E46",
  },
  {
    name: "midnight",
    pri: "#ffffff",
    sec: "#1e293b",
    tri1: "#94a3b8",
    tri2: "#020617",
  },
  {
    name: "forest",
    pri: "#ffffff",
    sec: "#1b4332",
    tri1: "#95d5b2",
    tri2: "#081c15",
  },
  {
    name: "royal",
    pri: "#ffffff",
    sec: "#2b2d42",
    tri1: "#8d99ae",
    tri2: "#1a1b26",
  },
  {
    pri: "#f8f4e1",
    sec: "#381c0a",
    tri1: "#e5b299",
    tri2: "#74512d",
  },
];

let currentTheme = 0;

function applyTheme(theme) {
  rootElement.style.setProperty("--pri", theme.pri);
  rootElement.style.setProperty("--sec", theme.sec);
  rootElement.style.setProperty("--tri1", theme.tri1);
  rootElement.style.setProperty("--tri2", theme.tri2);
}

//  Button click → switch theme

themeBtn.addEventListener("click", () => {
  currentTheme = (currentTheme + 1) % themes.length;
  applyTheme(themes[currentTheme]);

  // save theme
  localStorage.setItem("themeIndex", currentTheme);
});

// ✅ Load saved theme on refresh
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("themeIndex");
  if (savedTheme !== null) {
    currentTheme = savedTheme;
  }
  applyTheme(themes[currentTheme]);
});
