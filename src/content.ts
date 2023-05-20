function handleTextSelection() {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      highlightSelectedText(range);
      selection.removeAllRanges();
    }
  }
  
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
  
  document.addEventListener("mouseup", handleTextSelection);
  