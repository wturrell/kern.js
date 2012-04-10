// http://albertogasparin.it/demo/multiply-filter/

var multiplyFilter = (function() {

  //** private vars **//
  var multiplyColor,
      imageBottom, imageId,
      canvas;

  //** private functions **//

  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.width = imageBottom.width;
    canvas.height = imageBottom.height;
    imageBottom.parentNode.insertBefore(canvas, imageBottom);
    // no canvas support?
    if (!canvas.getContext) { return; }

    draw();
  }

  function draw() {
    var context, imgData, pix,
        w = imageBottom.width,
        h = imageBottom.height;
    // get 2d context
    context = canvas.getContext('2d');
    // draw the image on the canvas
    context.drawImage(imageBottom, 0, 0);
    // Get the CanvasPixelArray from the given coordinates and dimensions.
    imgData = context.getImageData(0, 0, w, h);
    pix = imgData.data;
    // Loop over each pixel and change the color.
    for (var i = 0, n = pix.length; i < n; i += 4) {
      pix[i ] = multiplyPixels(multiplyColor[0], pix[i ]); // red
      pix[i+1] = multiplyPixels(multiplyColor[1], pix[i+1]); // green
      pix[i+2] = multiplyPixels(multiplyColor[2], pix[i+2]); // blue
      // pix[i+3] is alpha channel (ignored)

      // another check to see if image is still empty
      if(i < 5 && !pix[i] && !pix[i+1] && !pix[i+2] && !pix[i+3]) {
        canvas.parentNode.removeChild(canvas);
        setTimeout(function() { multiplyFilter.init(imageId, multiplyColor); }, 500);
        return false;
      }
    }
    // Draw the result on the canvas
    context.putImageData(imgData, 0, 0);
  }

  //** helper function **//
  function multiplyPixels(topValue, bottomValue) {
    // the multiply formula
    return topValue * bottomValue / 255;
  }


  //** public functions **//
  return {
    init : function(imgId, color) {
      imageId = imgId;
      imageBottom = document.getElementById(imageId);
      multiplyColor = color;

      // lauch the draw function as soon as the image is loaded
      if(imageBottom && imageBottom.clientWidth > 50) { // image loaded
        createCanvas();
      } else { // not yet ready
        setTimeout(function() { multiplyFilter.init(imageId, color); }, 1000);
      }
    }
  }
})();