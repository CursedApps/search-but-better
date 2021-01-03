// set logo image src

window.onload = function() {
    let img = document.getElementById('logo')
    img.src = chrome.extension.getURL('assets/images/get_started32.png')
    document.getElementById('useDarkMode').addEventListener('click', updateOptions);
    restoreOptions()
}

restoreOptions = function() {
    chrome.storage.local.get({
        useDarkMode: false // default value
    }, function(options) {
        document.getElementById('useDarkMode').checked = options.useDarkMode;
        options.useDarkMode ? document.body.setAttribute('data-theme', 'dark') : document.body.removeAttribute('data-theme');
    });
}

updateOptions = function() {
    let useDarkMode = document.getElementById('useDarkMode').checked;
    chrome.storage.local.set({
        useDarkMode: useDarkMode
    }, null);

    useDarkMode ? document.body.setAttribute('data-theme', 'dark') : document.body.removeAttribute('data-theme');
}