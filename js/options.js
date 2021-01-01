// set logo image src
window.onload = function() {
    let img = document.getElementById('logo')
    img.src = chrome.extension.getURL('assets/images/get_started32.png')
}