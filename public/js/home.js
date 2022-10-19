let box = document.getElementById("trending-posts");
var container = document.getElementById("trending-box");

let boxWidth = window
  .getComputedStyle(box)
  .getPropertyValue("width")
  .replace("px", "");


// Moving Headlines
const move = (element, direction, distance = 20) => {
  var topOrLeft = direction == "left" || direction == "right" ? "left" : "top";
  var frameDistance = 1;
  if (direction == "up" || direction == "left") {
    distance *= -1;
    frameDistance = -1;
  }
  var elStyle = window.getComputedStyle(element);
  var value = elStyle.getPropertyValue(topOrLeft).replace("px", "");
  var destination = Number(value) + distance + "px";
  function moveAFrame() {
    if (elStyle.getPropertyValue(topOrLeft) == destination) {
      let conStyle = window.getComputedStyle(container);
      let width = conStyle.getPropertyValue("width").replace("px", "");

      element.style[topOrLeft] = Number(width) + 20 + "px";
      //clearInterval(movingFrames);
    } else {
      elStyle = window.getComputedStyle(element);
      value = elStyle.getPropertyValue(topOrLeft).replace("px", "");
      element.style[topOrLeft] = Number(value) + frameDistance + "px";
    }
  }
  var movingFrames = setInterval(moveAFrame, 20);
};

move(box, "left", parseInt(boxWidth));
