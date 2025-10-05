var animationDuration = 2700;
var cssWobbleAnimationId = "css-wobble-animation";

function createToastContainer() {
  const toastContainer = document.createElement("div");
  toastContainer.style.position = "fixed";
  toastContainer.style.top = "20px";
  toastContainer.style.right = "20px";
  toastContainer.style.zIndex = "9999";
  toastContainer.style.borderRadius = "4px";
  toastContainer.style.padding = "8px";
  toastContainer.style.color = "white";
  toastContainer.style.transform = "translateX(150%)";
  toastContainer.style.animation = `wobble ${animationDuration}ms ease`;
  const css = `
  @keyframes wobble {
    0% { transform: translateX(150%); }
    11% { transform: translateX(-7%); }
    15% { transform: translateX(4%); }
    19% { transform: translateX(0); }
    81% { transform: translateX(0); }
    85% { transform: translateX(-7%); }
    100% { transform: translateX(150%); }
  }
  `;
  const existingCssStyle = document.getElementById(cssWobbleAnimationId);
  if (!existingCssStyle) {
    const cssStyle = document.createElement("style");
    cssStyle.innerHTML = css;
    cssStyle.id = cssWobbleAnimationId;
    document.head.appendChild(cssStyle);
  }

  return toastContainer;
}

function Toaster() {
  if (!(this instanceof Toaster)) return new Toaster();

  this.toastContainer = null;

  Toaster.initiateAnimation = function() {
    setTimeout(() => {
      this.toastContainer.remove();
      this.toastContainer = null;
    }, animationDuration);

    document.body.appendChild(this.toastContainer);
  };

  Toaster.success = function(message) {
    this.toastContainer = createToastContainer();

    this.toastContainer.style.backgroundColor = "#4CAF50";
    this.toastContainer.innerText = message;

    this.initiateAnimation();
  };

  Toaster.error = function(message) {
    this.toastContainer = createToastContainer();

    this.toastContainer.style.backgroundColor = "#FF2C2C";
    this.toastContainer.innerText = message;

    this.initiateAnimation();
  };

  return Toaster;
}
