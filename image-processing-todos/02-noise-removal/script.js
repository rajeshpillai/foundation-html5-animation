// Contrast stretching improves the dynamic range of the grayscale levels in an image

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const img = new Image();

img.src = 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRRHBHE59Jpir-0jJVU7e-ECG18wXuE-DhOSkCndvmHZT1Op1e6IeYXd_Fq_7le';
img.onload = function () {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;
  let filteredData = new Uint8ClampedArray(data);

  // Mean filter for noise removal
  let kernelSize = 3; // 3x3 kernel
  let half = Math.floor(kernelSize / 2);
  for (let y = half; y < canvas.height - half; y++) {
      for (let x = half; x < canvas.width - half; x++) {
          let r = 0, g = 0, b = 0;
          for (let ky = -half; ky <= half; ky++) {
              for (let kx = -half; kx <= half; kx++) {
                  let idx = ((y + ky) * canvas.width + (x + kx)) * 4;
                  r += data[idx];
                  g += data[idx + 1];
                  b += data[idx + 2];
              }
          }
          let idx = (y * canvas.width + x) * 4;
          filteredData[idx] = filteredData[idx + 1] = filteredData[idx + 2] = (r + g + b) / (kernelSize * kernelSize);
      }
  }
  imageData.data.set(filteredData);
  ctx.putImageData(imageData, 0, 0);
};