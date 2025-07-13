function scrapImage({ tabImageUrl, imageUrl }) {
  return new Promise((res, rej) => {
    const imgElement = document.querySelector(`img[src="${imageUrl}"]`);
    if (!imgElement) {
      return rej("Unable to find image element");
    }
    const imgBoundingRect = imgElement.getBoundingClientRect();
    const image = new Image();
    image.src = tabImageUrl;
    image.onload = () => {
      const scale = window.devicePixelRatio;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      const subImageX = imgBoundingRect.x * scale;
      const subImageY = imgBoundingRect.y * scale;
      const subImageWidth = imgBoundingRect.width * scale;
      const subImageHeight = imgBoundingRect.height * scale;

      canvas.width = subImageWidth;
      canvas.height = subImageHeight;

      context.drawImage(
        image,
        subImageX,
        subImageY,
        subImageWidth,
        subImageHeight,
        0,
        0,
        subImageWidth,
        subImageHeight
      );
      const clippedImageUrl = canvas.toDataURL('image/png');
      res(clippedImageUrl);
    };
  });
}
