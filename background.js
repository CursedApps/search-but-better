console.log("WORKING")

window.addEventListener("keydown", (event) => { /* Add keydown too */
  if (event.ctrlKey && event.shiftKey && event.key == 'F') {
    // Block CTRL + F event
    selection = window.getSelection().toString();
    content = document.documentElement.innerHTML
    alert("WANNA SEARCH? " + selection)

    let popup = document.getElementById("search_popup");

    if (!popup) {
      popup = document.createElement("input");
      popup.type = "text";
      popup.id = "search_popup"
      document.body.appendChild(popup);
    }

    if (selection) {
      popup.value = selection
    } else {
      popup.placeholder = "search text"
    }
  }
})