let FIND_IN_SELECTION = false
let USE_REGEX = false
let MATCH_WORD = false
let MATCH_CASE = false
let currSelection = null;
let currMatchIdx = 0;

window.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.shiftKey && event.key == 'F') {
    let selection = window.getSelection().toString();
    let content = document.documentElement.innerHTML;

    let popup = createPopup();
    if (selection) {
      addSelection(selection);
    }
  }

  else if (event.key == 'Escape') {
    closeSearchPopup();
  }

  else if (event.altKey && event.key == 'c') {
    toggleMatchCaseFlag();
  }

  else if (event.altKey && event.key == 'w') {
    toggleMatchWordFlag();
  }

  else if (event.altKey && event.key == 'r') {
    toggleUseRegexFlag();
  }

  else if (event.altKey && event.key == 'l') {
    toggleFindInSelectionFlag();
  }

  else if(event.shiftKey && event.key == 'Enter') {
    scrollToPrevMatch();
  }

  else if(event.key == 'Enter') {
    scrollToNextMatch();
  }
});

document.onselectionchange = () => {
  let selection = document.getSelection();
  currSelection = selection;
};
