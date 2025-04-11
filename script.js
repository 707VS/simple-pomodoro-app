// Variables for Pomodoro Timer
const time = 25 * 60; // 25 minutes in seconds
const shortBreakTime = 5 * 60; // 5 minutes in seconds 300 seconds
const longBreakTime = 15 * 60; // 15 minutes in seconds 900 seconds
const cycles = 4; // 4 cycles of work and breaks

let timer = time;
let timeLeft = timer;

let actualMode = ["work", "shortBreak", "longBreak"];
let actualModeIndex = 0;

let timerState = null;
let isRunning = false;
let cycleCount = 0;
let initialTime = time;

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  setDarkTheme();
} else {
  setLightTheme();
}
updateResetButtonImage();

// SOM de Notificação de Conclusão
let notificationSound = new Audio("assets/songs/notification.mp3");

// Converter segundos para minutos e segundos
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

// Atualizar o tempo exibido na página
function updateTimerDisplay() {
  const timerDisplay = document.getElementById("time");
  timerDisplay.textContent = formatTime(timeLeft);
}

// Atualização do titulo da página com o tempo
function updateTitle() {
  document.title = formatTime(timeLeft) + " | PomoFoci";
}

// Contagem regressiva do tempo
function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timerState = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      updateTitle();
      if (timeLeft === 0) {
        clearInterval(timerState);
        isRunning = false;
        notificationSound.play();

        if (actualModeIndex === 0) {
          cycleCount++;

          if (cycleCount % cycles === 0) {
            actualModeIndex = 2;
            timeLeft = longBreakTime;
            timer = longBreakTime;
          } else {
            actualModeIndex = 1;
            timeLeft = shortBreakTime;
            timer = shortBreakTime;
          }
        } else {
          actualModeIndex = 0;
          timeLeft = time;
          timer = time;
        }
        updateTimerDisplay();
        updateTitle();
      }
    }, 1000);
  }
}

// Pausar o temporizador
function pauseTimer() {
  if (isRunning) {
    clearInterval(timerState);
    isRunning = false;
  }
}

// Reiniciar o temporizador
function resetTimer(customTime) {
  let resetTime;

  if (customTime) {
    resetTime = customTime;
  } else {
    if (actualModeIndex === 0) {
      resetTime = time;
    } else if (actualModeIndex === 1) {
      resetTime = shortBreakTime;
    } else if (actualModeIndex === 2) {
      resetTime = longBreakTime;
    }
  }

  console.log("Reset com tempo: ", resetTime);
  clearInterval(timerState);
  isRunning = false;
  timeLeft = resetTime;
  timer = resetTime;
  updateTimerDisplay();
  updateTitle();
}

// TEMAS

function setDarkTheme() {
  var body = document.body;
  body.classList.add("dark-theme"); // Adiciona a classe "dark-theme" ao elemento <body>
  localStorage.setItem("theme", "dark"); // Armazena a preferência de tema no localStorage
  updateResetButtonImage(); // Atualiza a imagem do botão de reset
}

function setLightTheme() {
  var body = document.body;
  body.classList.remove("dark-theme"); // Remove a classe "dark-theme" do elemento <body>
  localStorage.setItem("theme", "light"); // Armazena a preferência de tema no localStorage
  updateResetButtonImage(); // Atualiza a imagem do botão de reset
}

// Event listeners para os temas
document.getElementById("dark-btn").addEventListener("click", setDarkTheme);
document.getElementById("light-btn").addEventListener("click", setLightTheme);

// MUDAR A IMAGEM DO BOTÂO DE RESET PARA COR PRETA de acordo com o tema
function updateResetButtonImage() {
  const resetImg = document.getElementById("reset");
  const theme = localStorage.getItem("theme");

  if (theme === "light") {
    resetImg.src = "reset-black.png";
  } else {
    resetImg.src = "reset.png";
  }
}

// BOTÕES de OPÇÕES
//Função de Short Break
function shortBreak() {
  actualModeIndex = 1;
  resetTimer(shortBreakTime);
}

//Função de Long Break
function longBreak() {
  actualModeIndex = 2;
  resetTimer(longBreakTime);
}

//Função Pomodoro
function pomodoro() {
  actualModeIndex = 0;
  resetTimer(time);
}
