(() => {
  const backdropId = "qr-code-scanner-backdrop";

  var backdrop = document.getElementById(backdropId);
  if (backdrop) {
    backdrop.remove();
  } else {
    addBackdrop();
  }

  var isSelecting = false;
  var getCoords = e => ({ x: Math.floor(e.x), y: Math.floor(e.y) });
  var selectionRectangle = {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 }
  };

  function addBackdrop() {
    backdrop = document.createElement("div");
    backdrop.id = backdropId;
    Object.assign(backdrop.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100dvw",
      height: "100dvh",
      background: "rgba(0, 0, 0, 0.4)",
      zIndex: "2147483647",
      willChange: "clip-path",
      transform: "translateZ(0)"
    });

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    var adjustBackdropBackground = () => {
      var { start, end } = selectionRectangle;
      var top, bottom, left, right;
      if (start.y < end.y) {
        (top = start.y), (bottom = end.y);
      } else {
        (top = end.y), (bottom = start.y);
      }
      if (start.x < end.x) {
        (left = start.x), (right = end.x);
      } else {
        (left = end.x), (right = start.x);
      }
      backdrop.style.clipPath = `polygon(
        0 0,
        100% 0,
        100% 100%,
        0 100%,
        0 ${bottom}px,
        ${left}px ${bottom}px,
        ${right}px ${bottom}px,
        ${right}px ${top}px,
        ${left}px ${top}px,
        ${left}px ${bottom}px,
        0 ${bottom}px
      )`;
      requestAnimationFrame(adjustBackdropBackground);
    };
    requestAnimationFrame(adjustBackdropBackground);

    var hint = document.createElement("div");
    Object.assign(hint.style, {
      padding: "4px",
      backgroundColor: "white",
      color: "#333",
      borderRadius: "2px",
      fontSize: "1rem",
      position: "absolute",
      right: "20px",
      top: "10px"
    });
    hint.innerText =
      "Click to start selection and drag the cursor to select QR code";
    backdrop.appendChild(hint);

    document.body.appendChild(backdrop);
  }

  function onPointerDown(e) {
    isSelecting = true;
    selectionRectangle.start = getCoords(e);
    selectionRectangle.end = getCoords(e);
  }
  function onPointerMove(e) {
    if (isSelecting) {
      selectionRectangle.end = getCoords(e);
    }
  }
  function onPointerUp(e) {
    isSelecting = false;
    selectionRectangle.end = getCoords(e);
    const { start, end } = selectionRectangle;
    if (start.x !== end.x && start.y !== end.y) {
      const payload = {
        x: Math.min(start.x, end.x),
        y: Math.min(start.y, end.y),
        width: Math.abs(start.x - end.x),
        height: Math.abs(start.y - end.y)
      };
      chrome.runtime.sendMessage({
        type: "qr-code-image-selected",
        payload
      });
    }

    window.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    backdrop.remove();
  }
})();
