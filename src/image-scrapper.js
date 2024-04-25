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
      const canvas = document.createElement("canvas");
      canvas.width = imgBoundingRect.width;
      canvas.height = imgBoundingRect.height;
      const context = canvas.getContext("2d");
      context.drawImage(
        image,
        imgBoundingRect.x,
        imgBoundingRect.y,
        imgBoundingRect.width,
        imgBoundingRect.height,
        0,
        0,
        imgBoundingRect.width,
        imgBoundingRect.height
      );
      const clippedImageUrl = canvas.toDataURL('image/png');
      res(clippedImageUrl);
    };
  });
}
