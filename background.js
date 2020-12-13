console.log("WORKING")

window.addEventListener("keydown", (event) => { /* Add keydown too */
  if (event.ctrlKey && event.shiftKey && event.key == 'F') {
    // Block CTRL + F event
    selection = window.getSelection().toString();
    content = document.documentElement.innerHTML
    alert("WANNA SEARCH? " + selection)

    popup = createPopup()

    // if (selection) {
    //   popup.value = selection
    // } else {
    //   popup.placeholder = "search text"
    // }
  }
})


createPopup = function() {

  let popup = document.getElementById("better-search");

  if (!popup) {

    // parent
    popup = document.createElement("div");
    popup.className="better-search";
    popup.id = "better-search"

    // input field
    input = document.createElement("input");
    input.type = "text";
    input.id = "bs-input-field"
    input.className = "textinput"
    popup.appendChild(input);
    
    // inline buttons
    createButton(popup, "inline", "Match Case (alt+c)", "caseSensitiveBtn", "https://www.flaticon.com/svg/static/icons/svg/68/68216.svg", false)
    createButton(popup, "inline", "Match whole word (alt+w)", "matchWordBtn", "https://www.flaticon.com/svg/static/icons/svg/2658/2658259.svg", false)
    createButton(popup, "inline", "Use regular expression (alt+r)", "useRegexBtn", "https://www.flaticon.com/svg/static/icons/svg/37/37490.svg", true)
    
    // label
    label = document.createElement("label")
    label.innerHTML = "No Results"
    label.id = "nbResults"
    popup.appendChild(label)
    
    // outside buttons
    createButton(popup, "outline", "Previous match (shit+enter)", "previousMatchBtn", "https://www.flaticon.com/svg/static/icons/svg/271/271237.svg")
    createButton(popup, "outline", "Next match (enter)", "matchWordBtn", "https://www.flaticon.com/svg/static/icons/svg/271/271208.svg")
    createButton(popup, "outline", "Find in selection (alt+L)", "findInSelectionBtn", "https://www.flaticon.com/svg/static/icons/svg/1437/1437803.svg")
    createButton(popup, "outline", "Close (escape)", "closeBtn", "https://www.flaticon.com/svg/static/icons/svg/271/271203.svg")
    
    document.body.appendChild(popup);
  }

  return popup
}


createButton = function(parent, className, title, id, iconSrc, last) {
  newButton = document.createElement("input");
  newButton.className=className;
  newButton.title = title;
  newButton.type = "image";
  newButton.id = id;
  newButton.src = iconSrc;
  newButton.height = '21';

  if (last) {
    newButton.style.paddingRight = '5px !important';
  }

  parent.appendChild(newButton)
}

// REFERENCE
/* 
<div class="better-search">
  <input value='hello'>
  <button class="inline" title="Match Case (alt+c)"><i class="fa fa-font" ></i></button>
  <button class="inline" title="Match whole word (alt+w)"><i class="fa fa-bold"></i></button>
  <button class="inline" title="Use regular expression (alt+r)"><i class="fa fa-italic"></i></button>
  <label>No results</label>
  <button class="btn" title="Previous match (shit+enter)"><i class="fa fa-arrow-up"></i></button>
  <button class="btn" title="Next match (enter)"><i class="fa fa-arrow-down"></i></button>
  <button class="btn" title="Find in selection (alt+L)"><i class="fa fa-align-left"></i></button>
  <button class="btn" title="Close (escape)"><i class="fa fa-times"></i></button>
</div> */