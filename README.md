# highlightExtension

## Developer Notes:
1. If you are on Windows, download WSL to work on this project.
2. Node Version: 18.16.0

### Details about some of the scripts: (Courtesy of ChatGPT)
> In a Chrome extension, background scripts, content scripts, and service workers serve different purposes and have different scopes within the extension ecosystem:
>
> Background Script: A background script is a long-running script that runs in the background of the extension, even when the extension's UI (popup or options page) is closed or not active. It is typically used to perform tasks that require ongoing monitoring or event handling, such as managing browser events, making network requests, or interacting with the Chrome APIs. The background script has access to the Chrome extension APIs and can communicate with other parts of the extension.
> 
> Content Script: A content script is a JavaScript file that runs in the context of a web page or tab when it matches the specified URL patterns. It can manipulate the DOM of the web page, interact with its content, and modify its behavior. Content scripts have restricted access to the Chrome extension APIs but can communicate with the background script using message passing. Content scripts are commonly used to add additional functionality or modify the appearance of web pages.
>
> Service Worker: A service worker is a script that runs in the background and acts as a network proxy for web pages. It intercepts network requests made by the web pages and can modify or cache them. Service workers enable offline support, push notifications, and background synchronization. In the context of Chrome extensions, service workers are typically used to add additional functionality or improve performance for web pages that are associated with the extension.
>
> To summarize, the background script runs continuously in the background of the extension, content scripts run in the context of web pages, and service workers handle network requests and provide additional functionality to web pages. Each of these scripts has different capabilities, scopes, and purposes within the Chrome extension architecture.