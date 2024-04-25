const OPEN_LINK_FROM_QR_MENU_ID = "open-link-from-qr";
const COPY_CONTENT_FROM_QR_MENU_ID = "copy-content-from-qr";

async function decodeFromImageAndOpen(tabImageUrl, imageUrl) {
  require("./image-scrapper.js");
  require("./qcode-decoder.js");
  const decoder = new QCodeDecoder();

  const localImageUrl = await scrapImage({ tabImageUrl, imageUrl });

  decoder.decodeFromImage(localImageUrl, function(result) {
    if (!result) {
      return console.log("Unable to decode image");
    }
    const url = result.startsWith("http")
      ? result
      : `https://google.com/search?q=${result}`;
    window.open(url, "_blank");
  });
}

async function decodeFromImageAndCopy(tabImageUrl, imageUrl) {
  require("./image-scrapper.js");
  require("./qcode-decoder.js");
  require("./toaster.js");
  const decoder = new QCodeDecoder();
  const toaster = new Toaster();

  const localImageUrl = await scrapImage({ tabImageUrl, imageUrl });

  decoder.decodeFromImage(localImageUrl, function(result) {
    if (!result) {
      return console.log("Unable to decode image");
    }
    async function copyToTheClipboard(textToCopy) {
      const el = document.createElement("textarea");
      el.value = textToCopy;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    copyToTheClipboard(result).then(function() {
      toaster.success("Copied to clipboard");
    });
  });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) {
    return;
  }

  if (info.menuItemId === OPEN_LINK_FROM_QR_MENU_ID) {
    chrome.tabs.captureVisibleTab(
      tab.windowId,
      { format: "png" },
      (tabImageUrl) => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: decodeFromImageAndOpen,
          args: [tabImageUrl, info.srcUrl],
        });
      }
    );
  }

  if (info.menuItemId === COPY_CONTENT_FROM_QR_MENU_ID) {
    chrome.tabs.captureVisibleTab(
      tab.windowId,
      { format: "png" },
      (tabImageUrl) => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: decodeFromImageAndCopy,
          args: [tabImageUrl, info.srcUrl],
        });
      }
    );
  }
});

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: OPEN_LINK_FROM_QR_MENU_ID,
    title: "Open link from QR code",
    contexts: ["image"],
  });

  chrome.contextMenus.create({
    id: COPY_CONTENT_FROM_QR_MENU_ID,
    title: "Copy content from QR code",
    contexts: ["image"],
  });
});
