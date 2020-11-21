  console.log("WORKING")
  
  window.addEventListener("keydown", (event) => { /* Add keydown too */
    if (event.ctrlKey && event.shiftKey && event.key == 'F') {

      // Block CTRL + F event
      text = window.getSelection().toString();
      content = document.documentElement.innerHTML
      alert("WANNA SEARCH? " + text)

    }
  })