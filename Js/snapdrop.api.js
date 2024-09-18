// js/snapdrop.api.js

export function fetchDropdownItems(url, query) {
    return fetch(`${url}?query=${query}`)
      .then(response => response.json())
      .then(data => {
        return data.items;
      })
      .catch(error => {
        console.error("Error fetching dropdown items:", error);
        return [];
      });
  }
  
  // Add functions for lazy loading and more API requests
  