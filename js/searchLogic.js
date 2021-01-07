let searchDir = document.getElementById("better-search");
const root = document.getRootNode();

searchAndHighlight = function (searchTerm) {
  clearHighlight();

  if (searchTerm == "" || searchTerm == undefined) {
    // Invalid search term
    resetResults();
    return; 
  }

  if (USE_REGEX) {
    // if last value is \ remove it
    if (searchTerm[searchTerm.length-1] == '\\') {
      searchTerm = searchTerm.substring(0, searchTerm.length - 2);
    }
  } else { 
    searchTerm = cleanRegex(searchTerm);
  }

  let elems = getSearchNodes();

  while (elems.length != 0) {
    // Remove current Item and Add children
    searchDir = document.getElementById("better-search");
    const elem = elems[0];
    elems.shift();

    // Process text inside node
    if (isValidNode(elem)) {
      items = removeSubNodes(elem.innerHTML);
      const result = searchAndHighlightItems(items, searchTerm);
      if ( result != null) {
        elem.innerHTML = result;
      }
    }
    
    // Add children to elems
    if (elem.children != null)
    {
      for (let i = 0; i < elem.children.length; i++) {
        elems.push(elem.children[i]);
      }
    }
  }

  currMatchIdx = 0;
  scrollToMatch();
}

hasAncestor = function (elem, ancestor) {
  if (elem == null) return false;
  let parent = elem;

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
  const re = /<span class=['"]['"]>(.+?)<\/span>/gs ;

  let elems = document.getElementsByClassName('better-search-highlight');

  while (elems.length != 0) {
    const elem = elems[0];
    elem.classList.remove("better-search-highlight", "better-search-selected")
    elem.outerHTML = elem.outerHTML.replaceAll(re, "$1");
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

    const match = matches[0];
    // Each match is split into 3 (before (noTag), (match (tag)), after(could be anything))
    let itemsToAdd = []
    if (match[1] != "" && match[1] != undefined) {
      itemsToAdd.push([0, match[1]]);
    }
    itemsToAdd.push([1, match[2]])
    if (match[4] != "" && match[4] != undefined) {
      itemsToAdd.push([0, match[4]]);
    }

    items.splice(i, 1, ...itemsToAdd);
  }
  return items;
}

scrollToMatch = function() {
  // remove previous
  const selected = document.getElementsByClassName('better-search-selected');
  for(let i=0; i < selected.length; i++) {
    selected[i].classList.remove('better-search-selected');
  }

  // all highlighted matches
  const highlighted = document.getElementsByClassName("better-search-highlight");

  // highlight selected in orange
  if(highlighted.length > 0) {

    if(currMatchIdx < 0) { currMatchIdx += highlighted.length; }
    else{ currMatchIdx = currMatchIdx % highlighted.length; }

    highlighted[currMatchIdx].classList.add("better-search-selected");
    highlighted[currMatchIdx].scrollIntoView({behavior: "smooth", block: "center"});

    // change UI
    updateResults(currMatchIdx, highlighted.length);

  } else {
    resetResults();
  }

}

cleanRegex = function(searchTerm) {
  return searchTerm.replaceAll(/([.])/g, '\\$1');
}

isValidNode = function(node) {
  return !hasAncestor(node, searchDir) && node.className != 'better-search-highlight' && node.innerHTML != undefined
      && node.tagName != "SCRIPT" && node.tagName != "STYLE" && node.tagName != "LINK";
}

removeSubNodes = function(html) {
  const tagOnlyRe = /(.*?)(<(\w+).*?>.*<\/\3>)(.*)/gs;
  const singleTagRe = /(.*?)(<(?:!--)?(\w+).*?(?:--)?>)(.*)/gs;
  items = applyFilter([[0, html]], tagOnlyRe);
  items = applyFilter(items, singleTagRe);

  return items;
}

searchAndHighlightItems = function(items, searchTerm) {
  let matched = false;
  let result = "";
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item[0] != 0) {
      // if within sub node, just add it
      result += item[1];
    }
    else {
      result += replaceSearchTermByHighlight(item, searchTerm);
      if (result != "") {
        matched = true;
      }
    }
  }

  return (matched? result: null); 
}

getMatches = function(item, searchTerm) {
  if (!MATCH_CASE) {
    return [...item[1].toLowerCase().matchAll(searchTerm.toLowerCase())];
  }
  else {
    return [...item[1].matchAll(searchTerm)];
  }
}

replaceSearchTermByHighlight = function (item, searchTerm) {
  const matches = getMatches(item, searchTerm);
  result = "";

  if (matches != null && matches.length != 0) {

    let k = 0;
    for (let j = 0; j < matches.length; j++) {
      match = matches[j];
      if (MATCH_WORD) {
        idxs = [k + match.index-1, match.index + searchTerm.length];
        let continueOnMatch = false;

        for (let idxI = 0; idxI < idxs.length; idxI++) {
          idx = idxs[idxI];
          if (!(idx < 0 || idx >= item[1].length || (item[1][idx].match(/[\s.,-]/) != null &&  item[1][idx].match(/[\s.,-]/).length != 0) )) {
            continueOnMatch = true; 
            break;
          }
        }

        if (continueOnMatch) {
          continue;
        }

      }
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

  return result;
}

getDefaultSearchNodes = function () {
  return [...document.getElementsByTagName("BODY")];
}

getContingentNodes = function (lhs, rhs) {
  if (lhs == null || rhs == null) return getDefaultSearchNodes();
  else if (lhs == rhs) return [lhs.parentNode];
  let parent = lhs.parentNode;
  let currentNode = lhs;
  let nodes = [parent];

  while (parent != root && parent != null) {
    currentNode = parent.nextSibling;
    parent = parent.parentNode;

    if (hasAncestor(rhs, parent)) {
      break;
    }

    // Add next siblings in last parents
    while (currentNode != null) {
      nodes.push(currentNode);
    }
  }

  while (currentNode != null) {
    if (currentNode == rhs) {
      nodes.push(currentNode);
      break;
    }
    else if (hasAncestor(rhs, currentNode)) {
      // Enter the node
      currentNode = currentNode.firstChild;
    } else {
      nodes.push(currentNode);
      currentNode = currentNode.nextSibling;
    }
  }

  return nodes;
}

getSearchNodes = function () {
  if (FIND_IN_SELECTION) {
    if (currSelection == null) {
      return getDefaultSearchNodes();
    } else {
      return getContingentNodes(currSelection.anchorNode, currSelection.focusNode);
    }
  } else {
    return getDefaultSearchNodes();
  }
}
