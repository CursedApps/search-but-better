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
  matches = $(`*:contains('${searchTerm}'):last`)
  alert(matches)
  offset = matches.offset()
  top = offset.top
  $(window).scrollTop(top);
}

// Copy pasted
// searchAndHighlight = function(searchTerm) {
//   if (searchTerm) {
//       var selector = currSelection || "#realTimeContents"; // use body as selector if none provided
//       alert(currSelection + ", " + selector)
//       var searchTermRegEx = new RegExp(searchTerm, "ig");
//       var matches = $(selector).text().match(searchTermRegEx);
//       if (matches != null && matches.length > 0) {
//           $('.highlighted').removeClass('highlighted'); //Remove old search highlights 

//           //Remove the previous matches
//           $span = $('#realTimeContents span');
//           $span.replaceWith($span.html());

//           if (searchTerm === "&") {
//               searchTerm = "&amp;";
//               searchTermRegEx = new RegExp(searchTerm, "ig");
//           }
//           $(selector).html($(selector).html().replace(searchTermRegEx, "<span class='match'>" + searchTerm + "</span>"));
//           $('.match:first').addClass('highlighted');

//           var i = 0;

//           $('.next_h').off('click').on('click', function () {
//               i++;

//               if (i >= $('.match').length) i = 0;

//               $('.match').removeClass('highlighted');
//               $('.match').eq(i).addClass('highlighted');
//               $('.ui-mobile-viewport').animate({
//                   scrollTop: $('.match').eq(i).offset().top
//               }, 300);
//           });
//           $('.previous_h').off('click').on('click', function () {

//               i--;

//               if (i < 0) i = $('.match').length - 1;

//               $('.match').removeClass('highlighted');
//               $('.match').eq(i).addClass('highlighted');
//               $('.ui-mobile-viewport').animate({
//                   scrollTop: $('.match').eq(i).offset().top
//               }, 300);
//           });




//           if ($('.highlighted:first').length) { //if match found, scroll to where the first one appears
//               $(window).scrollTop($('.highlighted:first').position().top);
//           }
//           return true;
//       }
//   }
//   return false;
// }
