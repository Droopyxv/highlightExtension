import { Rangee } from 'rangee';

const rangee = new Rangee({ document });

// interface SerializedRange {
//   startContainerPath: string | null;
//   startOffset: number;
//   endContainerPath: string | null;
//   endOffset: number;
// }

interface Highlight {
  url: string;
  serializedRange: string;
}

// function serializeRange(range: Range): SerializedRange {
//   const startPath = getXPath(range.startContainer) || '';
//   const endPath = getXPath(range.endContainer) || '';
//   return {
//     startContainerPath: startPath,
//     startOffset: range.startOffset,
//     endContainerPath: endPath,
//     endOffset: range.endOffset
//   };
// }

// function serializeRange(range: Range): SerializedRange {
//   const serializedRange: SerializedRange = {
//     startContainerPath: getXPath(range.startContainer),
//     startOffset: range.startOffset,
//     endContainerPath: getXPath(range.endContainer),
//     endOffset: range.endOffset
//   };
//   return serializedRange;
// }

// function deserializeRange(serializedRange: SerializedRange): Range | null {
//   const startNode = getNodeByXPath(serializedRange.startContainerPath || '');
//   const endNode = getNodeByXPath(serializedRange.endContainerPath || '');

//   if (startNode && endNode) {
//     const range = document.createRange();
//     range.setStart(startNode, serializedRange.startOffset);
//     range.setEnd(endNode, serializedRange.endOffset);
//     return range;
//   }

//   return null;
// }

// function getXPath(node: Node): string | null {
//   const parts: string[] = [];

//   while (node && node !== document.documentElement) {
//     let sibling = node;
//     let index = 1;

//     while (sibling && sibling.previousSibling) {
//       sibling = sibling.previousSibling;
//       if (sibling.nodeType === Node.ELEMENT_NODE) {
//         index++;
//       }
//     }

//     let tagName = node.nodeName.toLowerCase();
//     if (node.nodeType === Node.ELEMENT_NODE) {
//       parts.unshift(tagName + '[' + index + ']');
//     } else if (node.nodeType === Node.TEXT_NODE) {
//       parts.unshift(tagName + '[' + index + ']' + '/text()');
//     }

//     node = node.parentNode as Node;
//   }

//   return parts.length > 0 ? '/' + parts.join('/') : null;
// }

// function getXPath(node: Node): string | null {
//   if (node instanceof Text) {
//     const parent = node.parentNode;
//     if (parent) {
//       const siblings = Array.from(parent.childNodes);
//       const index = siblings.findIndex((sibling) => sibling === node);
//       return getXPath(parent) + `/text()[${index + 1}]`;
//     }
//   } else if (node instanceof Element) {
//     const parent = node.parentNode;
//     if (parent) {
//       const siblings = Array.from(parent.childNodes);
//       const index = siblings.findIndex((sibling) => sibling === node);
//       return getXPath(parent) + `/*[${index + 1}]`;
//     }
//   }

//   return null; // Return null for unsupported node types
// }


// function getNodeByXPath(xpath: string): Node | null {
//   try {
//     const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
//     return result.singleNodeValue;
//   } catch (error) {
//     console.error('Invalid XPath:', xpath);
//     return null;
//   }
// }



function handleTextSelection() {
  const selection = window.getSelection();
  if (selection && selection.toString().length > 0) {
    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    const websiteUrl = window.location.href;
    console.log("Selected Text:", selectedText);
    console.log("Website URL:", websiteUrl);
    console.log("Range selected: ", range);

    const serRange = rangee.serializeAtomic(range);

    const newHighlight: Highlight = {
      url: websiteUrl,
      serializedRange: serRange
    };
    chrome.runtime.sendMessage({ type: 'newHighlight', data: newHighlight });

    highlightSelectedText(range);
    selection.removeAllRanges();
  }
}



// function highlightSelectedText(startOffset: number, endOffset: number) {
//   const selection = window.getSelection();
//   if (selection && selection.rangeCount > 0) {
//     const range = selection.getRangeAt(0);

//     const highlightSpan = document.createElement("span");
//     highlightSpan.style.backgroundColor = "yellow";

//     const startContainer = range.startContainer;
//     const endContainer = range.endContainer;

//     if (startContainer === endContainer && startContainer.nodeType === Node.TEXT_NODE) {
//       const textNode = startContainer as Text;
//       const highlightedText = textNode.splitText(startOffset);
//       highlightedText.splitText(endOffset - startOffset);

//       const highlightedSpan = highlightSpan.cloneNode() as HTMLElement;
//       highlightedSpan.appendChild(highlightedText.cloneNode(true));
//       range.deleteContents();
//       range.insertNode(highlightedSpan);
//     } else {
//       const walker = document.createTreeWalker(
//         document.body,
//         NodeFilter.SHOW_ELEMENT,
//         {
//           acceptNode(node: Node) {
//             if (node.isEqualNode(startContainer) || node.contains(startContainer)) {
//               return NodeFilter.FILTER_ACCEPT;
//             }
//             return NodeFilter.FILTER_SKIP;
//           }
//         }
//       );

//       let currentNode: Node | null = walker.nextNode();

//       while (currentNode) {
//         if (currentNode.nodeType === Node.TEXT_NODE) {
//           const textNode = currentNode as Text;

//           if (currentNode === startContainer) {
//             range.setStart(textNode, startOffset);
//           }

//           if (currentNode === endContainer) {
//             range.setEnd(textNode, endOffset);
//             break;
//           }

//           const clonedRange = range.cloneRange();
//           clonedRange.selectNodeContents(textNode);
//           range.surroundContents(highlightSpan);
//         }

//         currentNode = walker.nextNode();
//       }
//     }

//     selection.removeAllRanges();
//     selection.addRange(range);
//   }
// }




  
function highlightSelectedText(range: Range) {
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

  if (nodesToWrap.length === 0 && range.commonAncestorContainer.nodeType === Node.TEXT_NODE) {
    nodesToWrap.push(range.commonAncestorContainer);
  }

  nodesToWrap.forEach((node) => {
    const span = document.createElement("span");
    span.style.backgroundColor = "yellow";
    const nodeRange = document.createRange();
    nodeRange.selectNodeContents(node);
    const intersectionRange = getIntersectionRange(nodeRange, range);
    intersectionRange.surroundContents(span);
  });
}
  
function isNodeIntersectingRange(node: Node, range: Range): boolean {
  const nodeRange = document.createRange();
  nodeRange.selectNodeContents(node);
  return (
    range.compareBoundaryPoints(Range.END_TO_START, nodeRange) <= 0 &&
    range.compareBoundaryPoints(Range.START_TO_END, nodeRange) >= 0
  );
}
  
function getIntersectionRange(range1: Range, range2: Range): Range {
  const intersectionRange = range1.cloneRange();
  intersectionRange.setStart(range2.startContainer, range2.startOffset);
  intersectionRange.setEnd(range2.endContainer, range2.endOffset);
  return intersectionRange;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'websiteHighlights') {
    const websiteHighlights: Highlight[] = message.data;

    console.log("Recieved websiteHighlights: ", websiteHighlights);

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
  
document.addEventListener("mouseup", handleTextSelection);
  