export const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
};

export const createTimer = (element) => {
  let seconds = 0;
  let intervalId = null;

  const render = () => {
    element.textContent = formatTime(seconds);
  };

  const start = () => {
    stop();
    seconds = 0;
    render();
    intervalId = window.setInterval(() => {
      seconds += 1;
      render();
    }, 1000);
  };

  const stop = () => {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  const getSeconds = () => seconds;

  render();

  return { start, stop, getSeconds, formatTime };
};
