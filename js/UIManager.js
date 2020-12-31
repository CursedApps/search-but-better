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
        search = function () { searchAndHighlight(input.value) };
        input.oninput = search;
        popup.appendChild(input);

        let div = document.createElement("span");
        div.className="iconContainer"
        // inline buttons
        createButton(div, "inline", "Match Case (alt+c)", "caseSensitiveBtn", chrome.extension.getURL('assets/icons/matchCase.svg'), toggleMatchCaseFlag);
        createButton(div, "inline", "Match whole word (alt+w)", "matchWordBtn", chrome.extension.getURL('assets/icons/matchWord.svg'), toggleMatchWordFlag);
        createButton(div, "inline", "Use regular expression (alt+r)", "useRegexBtn", chrome.extension.getURL('assets/icons/useRegex.svg'), toggleUseRegexFlag);
        popup.appendChild(div);

        // label
        let label = document.createElement("label");
        label.innerHTML = "No Results";
        label.id = "nbResults";
        popup.appendChild(label);

        // outside buttons
        createButton(popup, "outline", "Previous match (shit+enter)", "previousMatchBtn", chrome.extension.getURL('assets/icons/upArrow.svg'), goToPreviousMatch);
        createButton(popup, "outline", "Next match (enter)", "nextMatchBtn", chrome.extension.getURL('assets/icons/downArrow.svg'), goToNextMatch);
        createButton(popup, "outline", "Find in selection (alt+L)", "findInSelectionBtn", chrome.extension.getURL('assets/icons/findInSelection.svg'), toggleFindInSelectionFlag);
        createButton(popup, "outline", "Close (escape)", "closeBtn", chrome.extension.getURL('assets/icons/close.svg'), closeSearchPopup);

        document.body.appendChild(popup);

        // apply ui flags
        if (USE_REGEX) {
            let button = document.getElementById("useRegexBtn");
            button.classList.add("activated");
        }

        if (MATCH_WORD) {
            let button = document.getElementById("matchWordBtn");
            button.classList.add("activated");
        }

        if (MATCH_CASE) {
            let button = document.getElementById("caseSensitiveBtn");
            button.classList.add("activated");
        }

        if (FIND_IN_SELECTION) {
            let button = document.getElementById("findInSelectionBtn");
            button.classList.add("activated");
        }
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

// functions
// inline
toggleUseRegexFlag = function () {
    USE_REGEX = !USE_REGEX;
    toggle("useRegexBtn", USE_REGEX);
    search();
}

toggleMatchWordFlag = function () {
    MATCH_WORD = !MATCH_WORD;
    toggle("matchWordBtn", MATCH_WORD);
    search();
}

toggleMatchCaseFlag = function () {
    MATCH_CASE = !MATCH_CASE;
    toggle("caseSensitiveBtn", MATCH_CASE);
    search();
}

// outline
goToPreviousMatch = function() {
    // TODO
}

goToNextMatch = function() {
    // TODO
}

toggleFindInSelectionFlag = function () {
    FIND_IN_SELECTION = !FIND_IN_SELECTION;
    toggle("findInSelectionBtn", FIND_IN_SELECTION);
    search();

}

closeSearchPopup = function () {
    clearHighlight();
    let popup = document.getElementById("better-search");
    if (popup) {
        popup.parentNode.removeChild(popup);
    }
}

// helpers
toggle = function(id, condition) {
    let button = document.getElementById(id);
    if (condition) {
        button.classList.add("activated");
    } else {
        button.classList.remove("activated");
    }
}
