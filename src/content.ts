// content.ts

console.log("content.js init");


// Function to handle the text selection event
function handleTextSelection() {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
        const range = selection.getRangeAt(0);
        const highlightSpan = document.createElement("span");
        highlightSpan.style.backgroundColor = "yellow"; // Set the desired highlight color
        range.surroundContents(highlightSpan);

        // Clear the selection
        selection.removeAllRanges();
    }
}
  
// Add an event listener to the mouseup event
document.addEventListener("mouseup", handleTextSelection);