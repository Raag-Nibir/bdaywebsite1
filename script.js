// Open love letter
function openLetter() {
  const letter = document.getElementById('letter');
  if (letter.style.display !== 'block') {
    letter.style.display = 'block';
  }
}

// Camera setup
const video = document.getElementById('camera');
const stripCanvas = document.getElementById('stripCanvas');
const ctx = stripCanvas.getContext('2d');
const downloadLink = document.getElementById('download');

// Create flash overlay once
const flashOverlay = document.createElement('div');
flashOverlay.style.position = 'fixed';
flashOverlay.style.top = '0';
flashOverlay.style.left = '0';
flashOverlay.style.width = '100%';
flashOverlay.style.height = '100%';
flashOverlay.style.backgroundColor = 'white';
flashOverlay.style.opacity = '0';
flashOverlay.style.pointerEvents = 'none';
flashOverlay.style.transition = 'opacity 0.2s ease';
flashOverlay.style.zIndex = '9999';
document.body.appendChild(flashOverlay);

function flashEffect() {
  flashOverlay.style.opacity = '1';
  setTimeout(() => {
    flashOverlay.style.opacity = '0';
  }, 200);
}

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  }).catch(err => {
    console.error('Camera access denied', err);
  });

// Take 3 photos in sequence with flash effect
function startPhotoStrip() {
  let photos = [];
  let count = 0;

  function capture() {
    flashEffect(); // Flash before each photo

    let tempCanvas = document.createElement('canvas');
    let tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = video.videoWidth;
    tempCanvas.height = video.videoHeight;
    tempCtx.filter = 'contrast(120%) sepia(20%) grayscale(30%)';
    tempCtx.drawImage(video, 0, 0);
    photos.push(tempCanvas);

    count++;
    if (count < 3) {
      setTimeout(capture, 1500); // delay between photos
    } else {
      createStrip(photos);
    }
  }
  capture();
}

// Create photo strip
function createStrip(photos) {
  const width = photos[0].width;
  const height = photos[0].height * 3;
  stripCanvas.width = width;
  stripCanvas.height = height;

  photos.forEach((photo, i) => {
    ctx.drawImage(photo, 0, i * photo.height);
  });

  const dataURL = stripCanvas.toDataURL('image/png');
  downloadLink.href = dataURL;
}
// Close instructions
function closeInstructions() {
  document.getElementById('instructions').style.display = 'none';
}