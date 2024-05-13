// Contrast stretching improves the dynamic range of the grayscale levels in an image

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = 'https://plus.unsplash.com/premium_photo-1664392314654-223b889aa2e1?q=80&w=1502&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=320';  // Specify the image path
img.onload = function () {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;

  // Algorithm for contrast stretching
  let min = 255, max = 0;
  for (let i = 0; i < data.length; i += 4) {
    let v = data[i];  // Assuming the image is grayscale
    min = Math.min(min, v);
    max = Math.max(max, v);
  }
  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i+1] = data[i+2] = 255 * (data[i] - min) / (max - min);
  }
  ctx.putImageData(data, 0, 0);
};