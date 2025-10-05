const getImageInfoFromImageUrl = imageUrl => {
  const imgElement = document.querySelector(`img[src="${imageUrl}"]`);
  if (!imgElement) {
    return [null, "Unable to find image element"];
  }
  const imgBoundingRect = imgElement.getBoundingClientRect();
  const scale = window.devicePixelRatio;
  return [
    {
      x: imgBoundingRect.x * scale,
      y: imgBoundingRect.y * scale,
      width: imgBoundingRect.width * scale,
      height: imgBoundingRect.height * scale
    },
    null
  ];
};

const getImageInfoFromCoordinates = coordinates => {
  const scale = window.devicePixelRatio;

  return {
    x: coordinates.x * scale,
    y: coordinates.y * scale,
    width: coordinates.width * scale,
    height: coordinates.height * scale
  };
};

function scrapImage({ tabImageUrl, imageUrl, coordinates }) {
  return new Promise((res, rej) => {
    let imageInfo;
    if (imageUrl) {
      const [imageInfoFromImageUrl, error] = getImageInfoFromImageUrl(imageUrl);
      if (error) {
        return rej(error);
      }
      imageInfo = imageInfoFromImageUrl;
    } else if (coordinates) {
      imageInfo = getImageInfoFromCoordinates(coordinates);
    } else {
      return rej(
        "Invalid arguments, expected either `imageUrl` from image element on page or `coordinates` of rectangle from page viewport"
      );
    }

    const image = new Image();
    image.src = tabImageUrl;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = imageInfo.width;
      canvas.height = imageInfo.height;

      context.drawImage(
        image,
        imageInfo.x,
        imageInfo.y,
        imageInfo.width,
        imageInfo.height,
        0,
        0,
        imageInfo.width,
        imageInfo.height
      );
      const clippedImageUrl = canvas.toDataURL("image/png");
      res(clippedImageUrl);
    };
  });
}
