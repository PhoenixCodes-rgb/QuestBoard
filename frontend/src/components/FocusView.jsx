import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlay,
  FiPause,
  FiRotateCcw,
  FiFastForward,
  FiCheckCircle,
  FiTarget,
  FiCoffee,
  FiClock,
  FiMaximize2,
  FiMinimize2,
  FiVolume2,
  FiVolumeX,
  FiAward,
} from "react-icons/fi";

const MODES = {
  focus: { label: "Focus", minutes: 25, icon: <FiTarget size={16} /> },
  shortBreak: { label: "Short Break", minutes: 5, icon: <FiCoffee size={16} /> },
  longBreak: { label: "Long Break", minutes: 15, icon: <FiCoffee size={16} /> },
};

function playAudioChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Pleasant two-tone chime (F5 -> A5)
    osc.frequency.setValueAtTime(698.46, ctx.currentTime);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.4);
  } catch {
    // AudioContext blocked or not supported
  }
}

function FocusView({ tasks = [], onToggleTask }) {
  const [currentMode, setCurrentMode] = useState("focus");
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isZenMode, setIsZenMode] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");

  const intervalRef = useRef(null);

  // Storage key for daily focus stats
  const todayKey = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  const [focusStats, setFocusStats] = useState(() => {
    try {
      const saved = localStorage.getItem(`questboard_focus_${todayKey}`);
      return saved ? JSON.parse(saved) : { minutes: 0, sessions: 0 };
    } catch {
      return { minutes: 0, sessions: 0 };
    }
  });

  const saveStats = (newMinutes, newSessions) => {
    const updated = {
      minutes: focusStats.minutes + newMinutes,
      sessions: focusStats.sessions + newSessions,
    };
    setFocusStats(updated);
    try {
      localStorage.setItem(`questboard_focus_${todayKey}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Switch mode
  const switchMode = (modeKey) => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setCurrentMode(modeKey);
    const mins = MODES[modeKey].minutes;
    setDurationMinutes(mins);
    setTimeLeft(mins * 60);
  };

  // Set custom minutes
  const setCustomMinutes = (mins) => {
    const valid = Math.max(1, Math.min(180, Number(mins) || 25));
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setDurationMinutes(valid);
    setTimeLeft(valid * 60);
  };

  // Timer Tick
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);

            if (soundEnabled) {
              playAudioChime();
            }

            if (currentMode === "focus") {
              saveStats(durationMinutes, 1);
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, currentMode, durationMinutes, soundEnabled]);

  // Reset timer
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(durationMinutes * 60);
  };

  // Skip session
  const handleSkip = () => {
    setIsRunning(false);
    if (currentMode === "focus") {
      switchMode("shortBreak");
    } else {
      switchMode("focus");
    }
  };

  const totalSeconds = durationMinutes * 60;
  const progressFraction = totalSeconds > 0 ? (totalSeconds - timeLeft) / totalSeconds : 0;
  const circumference = 2 * Math.PI * 130;
  const strokeDashoffset = circumference * (1 - progressFraction);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Pending tasks for selection
  const pendingTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);
  const activeTask = useMemo(
    () => tasks.find((t) => t._id === selectedTaskId),
    [tasks, selectedTaskId]
  );

  return (
    <div
      className={`mt-8 space-y-8 transition-all ${
        isZenMode
          ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f5f7f2] p-6 dark:bg-[#0f1712]"
          : ""
      }`}
    >
      {/* Header */}
      {!isZenMode && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl text-gray-900 dark:text-white">
              Focus Mode
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Eliminate distractions, focus deeply, and level up your progress.
            </p>
          </div>

          <button
            onClick={() => setIsZenMode(true)}
            className="flex items-center gap-2 self-start rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 dark:border-[#233428] dark:bg-[#17231c] dark:text-gray-300 dark:hover:bg-[#1f2e24] sm:self-auto"
            title="Enter Zen Fullscreen Mode"
          >
            <FiMaximize2 size={14} />
            <span>Zen Mode</span>
          </button>
        </div>
      )}

      {/* Main Focus Card */}
      <div className="relative mx-auto w-full max-w-2xl rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-colors duration-200 dark:border-[#233428] dark:bg-[#17231c]">
        {/* Top Control Strip inside Card */}
        <div className="flex items-center justify-between">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 rounded-full bg-gray-100 p-1.5 dark:bg-[#111a14]">
            {Object.entries(MODES).map(([key, mode]) => (
              <button
                key={key}
                onClick={() => switchMode(key)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  currentMode === key
                    ? "bg-[#193b27] text-white shadow-sm dark:bg-green-700"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                {mode.icon}
                <span>{mode.label}</span>
              </button>
            ))}
          </div>

          {/* Sound & Zen Exit controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition hover:bg-gray-100 dark:bg-[#1f2d24] dark:text-gray-300 dark:hover:bg-[#283b2f]"
              title={soundEnabled ? "Mute chime sound" : "Enable chime sound"}
            >
              {soundEnabled ? <FiVolume2 size={16} /> : <FiVolumeX size={16} />}
            </button>

            {isZenMode && (
              <button
                onClick={() => setIsZenMode(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition hover:bg-gray-100 dark:bg-[#1f2d24] dark:text-gray-300 dark:hover:bg-[#283b2f]"
                title="Exit Zen Mode"
              >
                <FiMinimize2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Circular Timer Display */}
        <div className="relative my-8 flex items-center justify-center">
          <svg className="h-72 w-72 -rotate-90 transform sm:h-80 sm:w-80">
            {/* Background circle track */}
            <circle
              cx="50%"
              cy="50%"
              r="130"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-gray-100 dark:text-[#233428]"
            />
            {/* Animated progress circle */}
            <circle
              cx="50%"
              cy="50%"
              r="130"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-[#193b27] transition-all duration-500 ease-linear dark:text-green-500"
            />
          </svg>

          {/* Center Digital Counter */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <h2 className="font-mono text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              {formatTime(timeLeft)}
            </h2>

            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-400">
              {isRunning
                ? currentMode === "focus"
                  ? "Stay Focused"
                  : "Enjoy Your Break"
                : timeLeft === 0
                ? "Session Complete! 🎉"
                : "Ready to Focus"}
            </p>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleReset}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-100 dark:border-[#233428] dark:bg-[#111a14] dark:text-gray-300 dark:hover:bg-[#1f2e24]"
            title="Reset Timer"
          >
            <FiRotateCcw size={18} />
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRunning(!isRunning)}
            className="flex h-16 w-28 items-center justify-center gap-2 rounded-full bg-[#193b27] text-base font-semibold text-white shadow-md transition hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600"
          >
            {isRunning ? (
              <>
                <FiPause size={20} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <FiPlay size={20} className="ml-1" />
                <span>Start</span>
              </>
            )}
          </motion.button>

          <button
            onClick={handleSkip}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-100 dark:border-[#233428] dark:bg-[#111a14] dark:text-gray-300 dark:hover:bg-[#1f2e24]"
            title="Skip to next session"
          >
            <FiFastForward size={18} />
          </button>
        </div>

        {/* Quick Custom Time Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-gray-100 pt-6 dark:border-[#233428]">
          <span className="text-xs text-gray-400">Duration:</span>
          {[15, 25, 45, 60].map((m) => (
            <button
              key={m}
              onClick={() => setCustomMinutes(m)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                durationMinutes === m && currentMode === "focus"
                  ? "bg-green-100 text-green-800 font-semibold dark:bg-green-950/60 dark:text-green-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#111a14] dark:text-gray-400 dark:hover:bg-[#1f2d24]"
              }`}
            >
              {m}m
            </button>
          ))}
        </div>

        {/* Task Selection Integration */}
        <div className="mt-6 rounded-2xl bg-gray-50 p-4 transition-colors duration-200 dark:bg-[#111a14]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <FiTarget size={16} className="text-green-700 dark:text-green-400" />
              <label className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                Focus on a Task:
              </label>
            </div>

            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="max-w-xs rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 outline-none transition focus:border-green-600 dark:border-[#233428] dark:bg-[#17231c] dark:text-gray-200"
            >
              <option value="">-- Pick a task to focus on --</option>
              {pendingTasks.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title} ({t.priority})
                </option>
              ))}
            </select>
          </div>

          {/* Active Task Banner */}
          {activeTask && (
            <div className="mt-3 flex items-center justify-between rounded-xl border border-green-200 bg-green-50/60 p-3 text-xs dark:border-green-900/40 dark:bg-green-950/20">
              <div className="min-w-0 pr-3">
                <p className="truncate font-semibold text-green-950 dark:text-green-200">
                  {activeTask.title}
                </p>
                {activeTask.description && (
                  <p className="mt-0.5 truncate text-[11px] text-green-800/80 dark:text-green-300/70">
                    {activeTask.description}
                  </p>
                )}
              </div>

              {onToggleTask && (
                <button
                  onClick={() => {
                    onToggleTask(activeTask._id);
                    setSelectedTaskId("");
                  }}
                  className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#193b27] px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-green-800 dark:bg-green-700"
                >
                  <FiCheckCircle size={13} />
                  <span>Mark Done</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Focus Daily Stats Strip */}
      {!isZenMode && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-[#233428] dark:bg-[#17231c]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Today's Focus Time
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400">
                <FiClock size={18} />
              </div>
            </div>
            <h3 className="mt-3 text-3xl font-semibold text-gray-900 dark:text-white">
              {focusStats.minutes} mins
            </h3>
            <p className="mt-1 text-xs text-gray-400">Total deep work today</p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-[#233428] dark:bg-[#17231c]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Sessions Completed
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <FiAward size={18} />
              </div>
            </div>
            <h3 className="mt-3 text-3xl font-semibold text-gray-900 dark:text-white">
              {focusStats.sessions}
            </h3>
            <p className="mt-1 text-xs text-gray-400">Focus cycles knocked out</p>
          </div>

          <div className="rounded-3xl bg-[#193b27] p-6 text-white shadow-sm sm:col-span-2 lg:col-span-1">
            <span className="text-xs font-medium uppercase tracking-wider text-green-200">
              Focus Insight
            </span>
            <p className="mt-3 text-sm leading-relaxed text-green-50">
              {focusStats.sessions >= 4
                ? "Phenomenal discipline! Taking regular rest breaks keeps your brain primed for creativity."
                : focusStats.sessions >= 2
                ? "Great momentum! Complete 2 more focus cycles to hit your daily productivity peak."
                : "Tip: Put your notifications on silent and commit 25 uninterrupted minutes to your hardest task."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FocusView;
