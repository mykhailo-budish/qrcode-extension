function copyToTheClipboard(textToCopy) {
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

function decodeImageAndCopy(imageUrl) {
  require("./toaster.js");
  require("./qcode-decoder.js");

  const toaster = new Toaster();
  const decoder = new QCodeDecoder();
  decoder.decodeFromImage(imageUrl, function(result) {
    if (!result) {
      return toaster.error("Unable to decode image");
    }
    copyToTheClipboard(result);
    toaster.success("Copied to clipboard");
  });
}

function decodeImageAndOpen(imageUrl) {
  require("./toaster.js");
  require("./qcode-decoder.js");

  const toaster = new Toaster();
  const decoder = new QCodeDecoder();
  decoder.decodeFromImage(imageUrl, function(result) {
    if (!result) {
      return toaster.error("Unable to decode image");
    }
    const url = result.startsWith("http")
      ? result
      : `https://google.com/search?q=${result}`;
    window.open(url, "_blank");
  });
}
