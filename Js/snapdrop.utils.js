// js/snapdrop.utils.js

export function debounce(fn, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  }
  
  export function isScrollAtBottom(container) {
    return container.scrollHeight - container.scrollTop === container.clientHeight;
  }
  
  // Add other utility functions like for formatting, validation, etc.
  