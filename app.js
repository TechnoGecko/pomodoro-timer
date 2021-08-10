function App() {
  const [displayTime, setDisplayTime] = React.useState(25 * 60);
  const [breakTime, setBreakTime] = React.useState(5 * 60);
  const [sessionTime, setSessionTime] = React.useState(25 * 60);
  const [timerOn, setTimerOn] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);

  var beepAudio = document.getElementById("beep");

  const playBreakSound = () => {
    beepAudio.currentTime = 0;
    beepAudio.play();
  };

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const formatMinutes = (time) => {
    let minutes = Math.floor(time / 60);
    return minutes;
  };

  const changeTime = (amount, type) => {
    if (type == "break") {
      if (
        (breakTime <= 60 && amount < 0) ||
        (breakTime >= 3600 && amount > 0)
      ) {
        return;
      }
      setBreakTime((prev) => prev + amount);
    } else {
      if (
        (sessionTime <= 60 && amount < 0) ||
        (sessionTime >= 3600 && amount > 0)
      ) {
        return;
      }
      setSessionTime((prev) => prev + amount);
      if (!timerOn) {
        setDisplayTime(sessionTime + amount);
      }
    }
  };

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;
    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplayTime((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              playBreakSound();
              onBreakVariable = true;
              setOnBreak(true);
              return breakTime;
            } else if (prev <= 0 && onBreakVariable) {
              playBreakSound();
              onBreakVariable = false;
              setOnBreak(false);
              return sessionTime;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimerOn(!timerOn);
  };

  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
    setOnBreak(false);

    var audio = document.getElementById("beep");

    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }

    if (timerOn) {
      controlTime();
    }
  };

  return (
    <div className="center-align">
      <h1>Pomodoro Timer</h1>
      <div className="dual-container">
        <BreakLength
          changeTime={changeTime}
          type={"break"}
          time={breakTime}
          formatMinutes={formatMinutes}
          resetTime={resetTime}
        />
        <SessionLength
          changeTime={changeTime}
          type={"session"}
          time={sessionTime}
          formatMinutes={formatMinutes}
        />
      </div>
      <h3 id="timer-label">{onBreak ? "Relax..." : "Time to Focus"}</h3>
      <h1 id="time-left">{formatTime(displayTime)}</h1>
      <audio id="beep" preload="auto" src="./marimba.mp3"></audio>
      <button
        id="start_stop"
        className="btn-large deep-purple lighten-2"
        onClick={controlTime}
      >
        {timerOn ? (
          <i className="material-icons">pause_circle_filled</i>
        ) : (
          <i className="material-icons">play_circle_filled</i>
        )}
      </button>
      <button
        className="btn-large deep-purple lighten-2"
        id="reset"
        onClick={resetTime}
      >
        <i className="material-icons">autorenew</i>
      </button>
    </div>
  );
}

function BreakLength({ changeTime, type, time, formatMinutes }) {
  return (
    <div>
      <h3 id="break-label">Break Length</h3>
      <div className="time-sets">
        <button
          className="btn-small deep-purple lighten-2"
          id="break-decrement"
          onClick={() => changeTime(-60, type)}
        >
          <i className="material-icons">arrow_downward</i>
        </button>
        <h3 id="break-length">{formatMinutes(time)}</h3>
        <button
          className="btn-small deep-purple lighten-2"
          id="break-increment"
          onClick={() => changeTime(60, type)}
        >
          <i className="material-icons">arrow_upward</i>
        </button>
      </div>
    </div>
  );
}

function SessionLength({ changeTime, type, time, formatMinutes }) {
  return (
    <div>
      <h3 id="session-label">Session Length</h3>
      <div className="time-sets">
        <button
          className="btn-small deep-purple lighten-2"
          id="session-decrement"
          onClick={() => changeTime(-60, type)}
        >
          <i className="material-icons">arrow_downward</i>
        </button>
        <h3 id="session-length">{formatMinutes(time)}</h3>
        <button
          className="btn-small deep-purple lighten-2"
          id="session-increment"
          onClick={() => changeTime(60, type)}
        >
          <i className="material-icons">arrow_upward</i>
        </button>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
