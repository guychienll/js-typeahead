export const delay = (time) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const debounce = (fn, delay) => {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
