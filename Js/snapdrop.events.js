// js/snapdrop.events.js

export function handleDropdownToggle(event) {
  const snapdropInstance = event.target.snapdropInstance;
  snapdropInstance.toggle();
}

export function handleItemSelect(event) {
  const item = event.target;
  const snapdropInstance = item.snapdropInstance;
  snapdropInstance.state.selectedItems.push(item);
  // Update UI to show selected item
}

export function handleSearchInput(event) {
  const snapdropInstance = event.target.snapdropInstance;
  snapdropInstance.search(event.target.value);
}
