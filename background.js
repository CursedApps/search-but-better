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
    popup.appendChild(input);
    
    // inline buttons
    createButton(popup, "inline", "Match Case (alt+c)", "caseSensitiveBtn", "fas fa-bold")
    createButton(popup, "inline", "Match whole word (alt+w)", "matchWordBtn", "fas fa-bold")
    createButton(popup, "inline", "Use regular expression (alt+r)", "useRegexBtn", "fas fa-italic")
    
    // label
    label = document.createElement("label")
    label.text = "No Results"
    label.id = "nbResults"
    popup.appendChild(label)
    
    // outside buttons
    createButton(popup, "", "Previous match (shit+enter)", "previousMatchBtn", "fas fa-arrow-up")
    createButton(popup, "", "Next match (enter)", "matchWordBtn", "fas fa-arrow-down")
    createButton(popup, "", "Find in selection (alt+L)", "useRegexBtn", "fas fa-align-left")
    createButton(popup, "", "Close (escape)", "useRegexBtn", "fas fa-camera")
    
    document.body.appendChild(popup);
  }

  return popup
}


createButton = function(parent, className, title, id, iconPath) {
  newButton = document.createElement("button")
  newButton.className=className
  newButton.title = title
  newButton.id =id

  icon = document.createElement("i")
  icon.className=iconPath
  newButton.appendChild(icon)

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