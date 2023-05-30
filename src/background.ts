// interface Highlight {
//   url: string;
//   range: {
//     startOffset: number;
//     endOffset: number;
//   };
// }

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   let highlightData: any;
//   if (message.type === 'newHighlight') {
//     highlightData = message.data;
//     console.log("Message receieved.");

//     chrome.storage.local.get(['highlights']).then((results) => {
//       const highlights = results.highlights || [];
//       const updatedHighlights = highlights ? [...highlights, highlightData] : [highlightData];
//       chrome.storage.local.set({ highlights: updatedHighlights });
//     });
//   }
// });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.type === 'newHighlight') {
//     const highlightData: Highlight = message.data;
//     console.log("Message received.");

//     chrome.storage.local.get(['highlights']).then((results) => {
//       const highlights: Highlight[] = results.highlights || [];
//       const updatedHighlights = [...highlights, highlightData];
//       chrome.storage.local.set({ highlights: updatedHighlights });
//     });
//   }
// });


// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete' && tab.active) {
//     const websiteUrl = tab.url;

//     chrome.storage.local.get(['highlights'], (result) => {
//       const highlights: Highlight[] = result.highlights || [];
//       const websiteHighlights = highlights.filter((highlight: Highlight) => highlight.url === websiteUrl);

//       // send filtered highlights back to content script on active tab
//       chrome.tabs.sendMessage(tabId, { type: 'websiteHighlights', data: websiteHighlights });
//     })
//   }
// });

interface SerializedRange {
  startContainerPath: string | null;
  startOffset: number;
  endContainerPath: string | null;
  endOffset: number;
}

interface Highlight {
  url: string;
  serializedRange: SerializedRange;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'newHighlight') {
    const highlightData: Highlight = message.data;
    //console.log("Message received.");

    chrome.storage.local.get(['highlights'], (result) => {
      const highlights: Highlight[] = result.highlights || [];
      const updatedHighlights = [...highlights, highlightData];
      chrome.storage.local.set({ highlights: updatedHighlights }, () => {
        //console.log('Highlights stored in local storage.');
        //console.log(updatedHighlights);
      });
    });
  }
});


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    const websiteUrl = tab.url;

    console.log("made it into a new tab");

    chrome.storage.local.get(['highlights'], (result) => {
      const highlights: Highlight[] = result.highlights || [];
      const websiteHighlights = highlights.filter((highlight: Highlight) => highlight.url === websiteUrl);

      console.log(websiteHighlights);

      // send filtered highlights back to content script on active tab
      chrome.tabs.sendMessage(tabId, { type: 'websiteHighlights', data: websiteHighlights });
    });
  }
});
