FIND_IN_SELECTION = false
USE_REGEX = false
MATCH_WORD = false
MATCH_CASE = false
currSelection = null;

window.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.shiftKey && event.key == 'F') {
    selection = window.getSelection().toString();
    content = document.documentElement.innerHTML

    popup = createPopup()
    if (selection) {
      addSelection(selection)
    }
  }

  else if (event.key == 'Escape') {
    closeSearchPopup() 
  }

  else if (event.altKey && event.key == 'c') {
    toggleMatchCaseFlag() 
  }

  else if (event.altKey && event.key == 'w') {
    toggleMatchWordFlag() 
  }

  else if (event.altKey && event.key == 'r') {
    toggleUseRegexFlag() 
  }

  else if (event.altKey && event.key == 'l') {
    toggleFindInSelectionFlag() 
  }
});

document.onselectionchange = () => {
  selection = document.getSelection()
  currSelection = selection
};

addSelection = function (selection) {
  let popup = document.getElementById("better-search");
  if (popup) {
    input = document.getElementById("bs-input-field")
    input.value = selection;
    currSelection = selection
  }
}

closeSearchPopup = function () {
  let popup = document.getElementById("better-search");
  if (popup) {
    popup.parentNode.removeChild(popup);
  }
}

toggleFindInSelectionFlag = function() {
  FIND_IN_SELECTION = !FIND_IN_SELECTION
}

toggleUseRegexFlag = function() { 
  USE_REGEX = !USE_REGEX
}

toggleMatchWordFlag = function() {
  MATCH_WORD = !MATCH_WORD
}

toggleMatchCaseFlag = function() { 
  MATCH_CASE = !MATCH_CASE
}

createPopup = function () {

  let popup = document.getElementById("better-search");

  if (!popup) {

    // parent
    popup = document.createElement("div");
    popup.className = "better-search";
    popup.id = "better-search"

    // input field
    input = document.createElement("input");
    input.type = "text";
    input.id = "bs-input-field"
    input.className = "textinput"
    input.oninput = function() { searchAndHighlight(input.value) }
    popup.appendChild(input);

    // inline buttons
    createButton(popup, "inline", "Match Case (alt+c)", "caseSensitiveBtn", chrome.extension.getURL('images/icons/matchCase.svg'), toggleMatchCaseFlag)
    createButton(popup, "inline", "Match whole word (alt+w)", "matchWordBtn", chrome.extension.getURL('images/icons/matchWord.svg'), toggleMatchWordFlag)
    createButton(popup, "inline", "Use regular expression (alt+r)", "useRegexBtn", chrome.extension.getURL('images/icons/useRegex.svg'), toggleUseRegexFlag)

    // label
    label = document.createElement("label")
    label.innerHTML = "No Results"
    label.id = "nbResults"
    popup.appendChild(label)

    // outside buttons
    createButton(popup, "outline", "Previous match (shit+enter)", "previousMatchBtn", chrome.extension.getURL('images/icons/upArrow.svg'), "goToPreviousMatch()")
    createButton(popup, "outline", "Next match (enter)", "nextMatchBtn", chrome.extension.getURL('images/icons/downArrow.svg'), "goToNextMatch()")
    createButton(popup, "outline", "Find in selection (alt+L)", "findInSelectionBtn", chrome.extension.getURL('images/icons/findInSelection.svg'), toggleFindInSelectionFlag)
    createButton(popup, "outline", "Close (escape)", "closeBtn", chrome.extension.getURL('images/icons/close.svg'), closeSearchPopup)

    document.body.appendChild(popup);
  }

  return popup
}

createButton = function (parent, className, title, id, iconSrc, onClick) {
  newButton = document.createElement("input");
  newButton.className = className;
  newButton.title = title;
  newButton.type = "image";
  newButton.id = id;
  newButton.src = iconSrc;
  newButton.height = '21';
  newButton.onclick = function () {
    onClick();
  };

  parent.appendChild(newButton)
}

searchAndHighlight = function(searchTerm) {
  clearHighlight();

  if (searchTerm == "") {return;}
  // Go trough every text possible and find the searchterm

  matches = [];
  elems = [  document.getRootNode() ];
  searchDir = document.getElementById("better-search");
  visitedNodes = []

  while (elems.length != 0)
  {
    // Remove current Item and Add children
    elem = elems[0];
    elems.shift();

    for (i = 0 ; i < elem.children.length; i++) {
      child = elem.children[i]
      elems.push(child)
    }


    // Process text inside node
    if (!hasAncestor(elem, searchDir ) && elem.innerHTML != undefined && elem.tagName != "SCRIPT" && elem.tagName != "STYLE" && elem.tagName != "LINK")
    {
      TagOnlyRe = /(<(\w+).*?>.*<\/\2>)/gs; // TODO: improve tag detection
      singleTagRe = /<(\w+).*?>/gs;
      text = elem.innerHTML.replace(TagOnlyRe, '').replace(singleTagRe, '');
      if (text != "") {
        // Check if search term in text
        matchs = text.match(searchTerm)
        if (matchs != null)
        {
          visitedNodes.push(elem);
          elem.innerHTML = elem.innerHTML.replace(searchTerm, "<span class='better-search-highlight'>"+ searchTerm + "</span>");
        }
      }
    }
  }
}

hasAncestor= function(elem, ancestor) {
  if (elem == null) return false;
  parent = elem.parentNode;
  root = document.getRootNode();

  while(parent != root && parent != null) {
    if (parent == ancestor) {
      return true;
    }
    else {
      parent = parent.parentNode;
    }
  }
  
  return false;
}

clearHighlight = function() {
  elems = document.getElementsByClassName('better-search-highlight');
  re = /<span.*>(.+?)<\/span>/gs

  for (i = 0; i < elems.length; i++) {
    elem = elems[i]
    resultStr = re.exec(elem.outerHTML)[1];
    console.log(resultStr);
    elem.outerHTML = elem.outerHTML.replace(re, resultStr);
  }
}
