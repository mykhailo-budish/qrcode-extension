const OPEN_LINK_FROM_QR_MENU_ID = "open-link-from-qr";
const COPY_CONTENT_FROM_QR_MENU_ID = "copy-content-from-qr";

async function decodeFromImageByCoordinatesAndCopy(tabImageUrl, coordinates) {
  require("./decode-helpers.js");
  require("./image-scrapper.js");

  const localImageUrl = await scrapImage({ tabImageUrl, coordinates });

  decodeImageAndCopy(localImageUrl);
}

async function decodeFromImageAndOpen(tabImageUrl, imageUrl) {
  require("./image-scrapper.js");
  require("./decode-helpers.js");

  const localImageUrl = await scrapImage({ tabImageUrl, imageUrl });

  decodeImageAndOpen(localImageUrl);
}

async function decodeFromImageAndCopy(tabImageUrl, imageUrl) {
  require("./image-scrapper.js");
  require("./decode-helpers.js");

  const localImageUrl = await scrapImage({ tabImageUrl, imageUrl });

  decodeImageAndCopy(localImageUrl);
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) {
    return;
  }

  if (info.menuItemId === OPEN_LINK_FROM_QR_MENU_ID) {
    chrome.tabs.captureVisibleTab(
      tab.windowId,
      { format: "png" },
      tabImageUrl => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: decodeFromImageAndOpen,
          args: [tabImageUrl, info.srcUrl]
        });
      }
    );
  }

  if (info.menuItemId === COPY_CONTENT_FROM_QR_MENU_ID) {
    chrome.tabs.captureVisibleTab(
      tab.windowId,
      { format: "png" },
      tabImageUrl => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: decodeFromImageAndCopy,
          args: [tabImageUrl, info.srcUrl]
        });
      }
    );
  }
});

chrome.action.onClicked.addListener(tab => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["./select-image.js"]
  });
});
chrome.runtime.onMessage.addListener((e, sender) => {
  const senderTab = sender.tab;
  if (e.type === "qr-code-image-selected" && senderTab) {
    chrome.tabs.captureVisibleTab(
      senderTab.windowId,
      { format: "png" },
      tabImageUrl => {
        chrome.scripting.executeScript({
          target: { tabId: senderTab.id },
          func: decodeFromImageByCoordinatesAndCopy,
          args: [tabImageUrl, e.payload]
        });
      }
    );
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: OPEN_LINK_FROM_QR_MENU_ID,
    title: "Open link from QR code",
    contexts: ["image"]
  });

  chrome.contextMenus.create({
    id: COPY_CONTENT_FROM_QR_MENU_ID,
    title: "Copy content from QR code",
    contexts: ["image"]
  });
});
