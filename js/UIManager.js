search = function (){}

createPopup = function () {

    let popup = document.getElementById("better-search");

    if (!popup) {

        // parent
        popup = document.createElement("div");
        popup.className = "better-search";
        popup.id = "better-search";

        // input field
        let input = document.createElement("input");
        input.type = "text";
        input.id = "bs-input-field";
        input.className = "textinput";
        search = function () { searchAndHighlight(input.value, MATCH_CASE, MATCH_WORD, USE_REGEX) };
        input.oninput = search;
        popup.appendChild(input);

        // inline buttons
        createButton(popup, "inline", "Match Case (alt+c)", "caseSensitiveBtn", chrome.extension.getURL('assets/icons/matchCase.svg'), toggleMatchCaseFlag);
        createButton(popup, "inline", "Match whole word (alt+w)", "matchWordBtn", chrome.extension.getURL('assets/icons/matchWord.svg'), toggleMatchWordFlag);
        createButton(popup, "inline", "Use regular expression (alt+r)", "useRegexBtn", chrome.extension.getURL('assets/icons/useRegex.svg'), toggleUseRegexFlag);

        // label
        let label = document.createElement("label");
        label.innerHTML = "No Results";
        label.id = "nbResults";
        popup.appendChild(label);

        // outside buttons
        createButton(popup, "outline", "Previous match (shit+enter)", "previousMatchBtn", chrome.extension.getURL('assets/icons/upArrow.svg'), "goToPreviousMatch()");
        createButton(popup, "outline", "Next match (enter)", "nextMatchBtn", chrome.extension.getURL('assets/icons/downArrow.svg'), "goToNextMatch()");
        createButton(popup, "outline", "Find in selection (alt+L)", "findInSelectionBtn", chrome.extension.getURL('assets/icons/findInSelection.svg'), toggleFindInSelectionFlag);
        createButton(popup, "outline", "Close (escape)", "closeBtn", chrome.extension.getURL('assets/icons/close.svg'), closeSearchPopup);

        document.body.appendChild(popup);
    }

    return popup;
}

createButton = function (parent, className, title, id, iconSrc, onClick) {
    let newButton = document.createElement("input");
    newButton.className = className;
    newButton.title = title;
    newButton.type = "image";
    newButton.id = id;
    newButton.src = iconSrc;
    newButton.height = '21';
    newButton.onclick = function () {
        onClick();
    };

    parent.appendChild(newButton);
}

addSelection = function (selection) {
    let popup = document.getElementById("better-search");
    if (popup) {
        let input = document.getElementById("bs-input-field");
        input.value = selection;
        currSelection = selection;
    }
}

closeSearchPopup = function () {
    clearHighlight();
    let popup = document.getElementById("better-search");
    if (popup) {
        popup.parentNode.removeChild(popup);
    }
}

toggleFindInSelectionFlag = function () {
    FIND_IN_SELECTION = !FIND_IN_SELECTION;
    search();
    console.log("find in selection ", FIND_IN_SELECTION)
}

toggleUseRegexFlag = function () {
    USE_REGEX = !USE_REGEX;
    search();
    console.log("regex ", USE_REGEX)
}

toggleMatchWordFlag = function () {
    MATCH_WORD = !MATCH_WORD;
    search();
    console.log("match word ", MATCH_WORD)
}

toggleMatchCaseFlag = function () {
    MATCH_CASE = !MATCH_CASE;
    search();
    console.log("match case ", MATCH_CASE)

}
