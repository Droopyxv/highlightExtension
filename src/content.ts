function handleTextSelection() {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      highlightSelectedText(range);
      selection.removeAllRanges();
    }
  }

  console.log("i am called");
  
  function highlightSelectedText(range: Range) {
    const nodesToWrap: Node[] = [];
    const treeWalker = document.createTreeWalker(
      range.commonAncestorContainer,
      NodeFilter.SHOW_TEXT,
      null
    );
  
    while (treeWalker.nextNode()) {
      const node = treeWalker.currentNode as Text;
      const nodeRange = document.createRange();
      nodeRange.selectNodeContents(node);
      if (isRangeIntersecting(range, nodeRange)) {
        nodesToWrap.push(node);
      }
    }
  
    nodesToWrap.forEach((node) => {
      const span = document.createElement("span");
      span.style.backgroundColor = "yellow";
      const nodeRange = document.createRange();
      nodeRange.selectNodeContents(node);
      nodeRange.surroundContents(span);
    });
  }
  
  function isRangeIntersecting(range1: Range, range2: Range): boolean {
    return (
      range1.compareBoundaryPoints(Range.END_TO_START, range2) <= 0 &&
      range1.compareBoundaryPoints(Range.START_TO_END, range2) >= 0
    );
  }
  
  document.addEventListener("mouseup", handleTextSelection);
  