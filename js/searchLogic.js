searchAndHighlight = function (searchTerm, isMatchCase) {
  // Prepare \ in search term
  searchTerm = searchTerm.replaceAll('\\', '\\\\');

  clearHighlight();

  if (searchTerm == "" || searchTerm == undefined) { return; }
  // Go trough every text possible and find the searchterm

  let elems = [...document.getElementsByTagName("BODY")];
  const searchDir = document.getElementById("better-search");

  while (elems.length != 0) {
    // Remove current Item and Add children
    const elem = elems[0];
    elems.shift();

    let matched = false;
    // Process text inside node
    if (!hasAncestor(elem, searchDir) && elem.className != 'better-search-highlight' && elem.innerHTML != undefined
      && elem.tagName != "SCRIPT" && elem.tagName != "STYLE" && elem.tagName != "LINK") {
      tagOnlyRe = /(.*?)(<(\w+).*?>.*<\/\3>)(.*)/gs;
      singleTagRe = /(.*?)(<(\w+).*?>)(.*)/gs;
      items = applyFilter([[0, elem.innerHTML]], tagOnlyRe);
      items = applyFilter(items, singleTagRe);

      let result = ""
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item[0] != 0) {
          result += item[1];
        }
        else {
          let matches = null;
          if (!isMatchCase) {
            matches = [...item[1].toLowerCase().matchAll(searchTerm.toLowerCase())]
          }
          else {
            matches = [...item[1].matchAll(searchTerm.raw())]
          }
          if (matches != null && matches.length != 0) {
            matched = true;

            let k = 0;
            for (let j = 0; j < matches.length; j++) {
              match = matches[j];
              result += item[1].substring(k, match.index);
              k = match.index + searchTerm.length;
              const actualTerm = item[1].substring(match.index, k);
              result += "<span class='better-search-highlight'>" + actualTerm + "</span>";
            }

            result += item[1].substring(k, item[1].length);
          }
          else {
            result += item[1];
          }
        }
      }
      if (matched) {
        elem.innerHTML = result
      }
    }

    for (let i = 0; i < elem.children.length; i++) {
      const child = elem.children[i]
      elems.push(child)
    }
  }
}

hasAncestor = function (elem, ancestor) {
  if (elem == null) return false;
  let parent = elem.parentNode;
  const root = document.getRootNode();

  while (parent != root && parent != null) {
    if (parent == ancestor) {
      return true;
    }
    else {
      parent = parent.parentNode;
    }
  }

  return false;
}

clearHighlight = function () {
  const re = /<span class=['"]better-search-highlight['"]>(.+?)<\/span>/gs

  let elems = document.getElementsByClassName('better-search-highlight');
  while (elems.length != 0) {
    const elem = elems[0];
    elem.outerHTML = elem.outerHTML.replaceAll(re, "$1");;
    elems = document.getElementsByClassName('better-search-highlight');
  }
}

applyFilter = function (items, filter) {
  // go through all items
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    // Check changes only for unmatch strings
    if (item[0] != 0) { continue; }

    let matches = [...item[1].matchAll(filter)]
    if (matches == null || matches.length == 0) {
      continue;
    }

    const match = matches[0]
    // Each match is split into 3 (before (noTag), (match (tag)), after(could be anything))
    let itemsToAdd = []
    if (match[1] != "" && match[1] != undefined) {
      itemsToAdd.push([0, match[1]])
    }
    itemsToAdd.push([1, match[2]])
    if (match[4] != "" && match[4] != undefined) {
      itemsToAdd.push([0, match[4]])
    }

    items.splice(i, 1, ...itemsToAdd)
  }
  return items;
}
