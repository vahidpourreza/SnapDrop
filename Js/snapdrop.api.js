// js/snapdrop.api.js

export function fetchDropdownItems(url, query) {
  return fetch(`${url}?query=${query}`)
    .then(response => response.json())
    .then(data => data.items)
    .catch(error => {
      console.error("Error fetching dropdown items:", error);
      return [];
    });
}
