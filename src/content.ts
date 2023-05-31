// Import the Rangee library and create a new instance
import { Rangee } from 'rangee';

const rangee = new Rangee({ document });

import {Highlight} from 'src/utils/interface.ts'
//import highlights from interface file.


// Function to handle a text selection
function handleTextSelection() {
    // Get the current text selection
  const selection = window.getSelection();
  if (selection && selection.toString().length > 0) {
    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    const websiteUrl = window.location.href;
    console.log("Selected Text:", selectedText);
    console.log("Website URL:", websiteUrl);
    console.log("Range selected: ", range);

    // Serialize the selected range using Rangee
    const serRange = rangee.serializeAtomic(range);

     // Create a new highlight object and send it to the background script
    const newHighlight: Highlight = {
      url: websiteUrl,
      serializedRange: serRange
    };
    chrome.runtime.sendMessage({ type: 'newHighlight', data: newHighlight });

    // Highlight the selected text and remove the selection
    highlightSelectedText(range);
    selection.removeAllRanges();
  }
}


  // Function to highlight selected text
function highlightSelectedText(range: Range) {
  // Find all text nodes that contain the selected range and wrap them in a <span> element with a yellow background
  const nodesToWrap: Node[] = [];
  const treeWalker = document.createTreeWalker(
    range.commonAncestorContainer,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
  );

  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    if (isNodeIntersectingRange(node, range)) {
      nodesToWrap.push(node);
    }
  }

  // If the selection spans only one text node, wrap that node in a <span> element
  if (nodesToWrap.length === 0 && range.commonAncestorContainer.nodeType === Node.TEXT_NODE) {
    nodesToWrap.push(range.commonAncestorContainer);
  }

  // Wrap each text node in a <span> element and highlight it
  nodesToWrap.forEach((node) => {
    const span = document.createElement("span");
    span.style.backgroundColor = "yellow";
    const nodeRange = document.createRange();
    nodeRange.selectNodeContents(node);
    const intersectionRange = getIntersectionRange(nodeRange, range);
    intersectionRange.surroundContents(span);
  });
}
  
// Function to determine if a node intersects a given range
function isNodeIntersectingRange(node: Node, range: Range): boolean {
  const nodeRange = document.createRange();
  nodeRange.selectNodeContents(node);
  return (
    range.compareBoundaryPoints(Range.END_TO_START, nodeRange) <= 0 &&
    range.compareBoundaryPoints(Range.START_TO_END, nodeRange) >= 0
  );
}
  
// Function to get the intersection of two ranges
function getIntersectionRange(range1: Range, range2: Range): Range {
  const intersectionRange = range1.cloneRange();
  intersectionRange.setStart(range2.startContainer, range2.startOffset);
  intersectionRange.setEnd(range2.endContainer, range2.endOffset);
  return intersectionRange;
}

// Listener for messages from the background script containing website-specific highlights
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'websiteHighlights') {
    // Extract the website-specific highlights from the message
    const websiteHighlights: Highlight[] = message.data;

    console.log("Recieved websiteHighlights: ", websiteHighlights);

    // For each highlight, deserialize the range and highlight the corresponding text
    websiteHighlights.forEach(highlight => {
      const ranges = rangee.deserilaizeAtomic(highlight.serializedRange);
      console.log("deserialized range: ", ranges);
      if (ranges) {
        ranges.forEach(range => {
          highlightSelectedText(range);
        });
        //highlightSelectedText(range);
      }
    });
  }
});
  
// Add a listener for mouseup events to detect text selections
document.addEventListener("mouseup", handleTextSelection);
  