import {Highlight} from 'src/utils/interface.ts'
//importing the interface highlights.


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { //adds listener to chrome runtime object.
  if (message.type === 'newHighlight') { //when a call from the extension with the name newHighlight is called the code below is run.
    const highlightData: Highlight = message.data;
    //initializes a variable names highlightData that is an object of the highlight interface with the data recieved from the runtime listener.

    chrome.storage.local.get(['highlights'], (result) => {
      const highlights: Highlight[] = result.highlights || [];
      const updatedHighlights = [...highlights, highlightData];
      chrome.storage.local.set({ highlights: updatedHighlights }, () => {

      });
    });

    //reads chrome local storage to see if there are any highlights previously made. if there are previous highlights, they are added on before the new highlights. if there are no preivous highlights, highlights is set to an empty array.
  }
});


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {  //adds a listener to watch for updates in the chrome tab.
  if (changeInfo.status === 'complete' && tab.active) { //when the tab is active and returns the status complete the code below is ran.
    const websiteUrl = tab.url;  //sets the variable website url equal to the current tabs url.

    console.log("made it into a new tab");


    // Retrieve highlights from local storage
    chrome.storage.local.get(['highlights'], (result) => {
      // Extract the highlights array from the result, or use an empty array if it doesn't exist
      const highlights: Highlight[] = result.highlights || [];
       // Filter the highlights array to only include highlights for the current website
      const websiteHighlights = highlights.filter((highlight: Highlight) => highlight.url === websiteUrl);

      console.log(websiteHighlights);

      // Send a message to the content script in the active tab with the filtered highlights
      chrome.tabs.sendMessage(tabId, { type: 'websiteHighlights', data: websiteHighlights });
    });
  }
});
