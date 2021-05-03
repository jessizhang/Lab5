// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');
const text = document.getElementById('generate-meme');
const imageInput = document.getElementById('image-input');

const submit = document.querySelector('button[type="submit"]');
const clear = document.querySelector('button[type="reset"]');
const read = document.querySelector('button[type="button"]');

const textTop = document.getElementById('text-top');
const textBottom = document.getElementById('text-bottom');

const volumeGroup = document.getElementById('volume-group');
const volumeRange = document.querySelector('input[type="range"]');
const icon = document.querySelector("[src='icons/volume-level-3.svg']");

const synth = window.speechSynthesis;
const voiceSelection = document.getElementById('voice-selection');

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  submit.disabled = false;
  clear.disabled = true;
  read.disabled = true;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const dimension = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  ctx.drawImage(img, dimension.startX, dimension.startY, dimension.width, dimension.height);
});

imageInput.addEventListener('change', () => {
  img.src = URL.createObjectURL(imageInput.files[0]);
  img.alt = imageInput.files[0].name;
  img.onload = function () {
    URL.revokeObjectURL(img.src);
  };
})

text.addEventListener('submit', (e) => {
  e.preventDefault();
  submit.disabled = true;
  clear.disabled = false;
  read.disabled = false;

  ctx.textAlign = "center";
  ctx.font = "50px Arial";
  ctx.fillStyle = 'white';
  ctx.fillText(textTop.value, canvas.width/2, 40);
  ctx.fillText(textBottom.value, canvas.width/2, 390);
});

clear.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  submit.disabled = false;
  clear.disabled = true;
  read.disabled = true;
});

read.addEventListener('click', ()=> {
  let text = textTop.value + ' ' + textBottom.value;
  let sentence = new SpeechSynthesisUtterance(text);
  sentence.volume = volumeRange.value / 100;
  sentence.lang = voiceSelection.value;
  synth.speak(sentence);
});

volumeRange.addEventListener('input', ()=>{
  voice.volume = volumeRange.value / 100;
  if(volume.value >= 67 && volume.value <= 100){
    icon.src = "icons/volume-level-3.svg";
  }else if(volume.value >= 34 && volume.value <= 66){
    icon.src = "icons/volume-level-2.svg";
  }else if(volume.value >= 1 && volume.value <= 33){
    icon.src = "icons/volume-level-1.svg";
  }else if(volume.value == 0) {
    icon.src = "icons/volume-level-0.svg";
  }
});

function populateVoiceList() {
  var voices = synth.getVoices();
  if(voices.length!=0){
    voiceSelection.disabled = false;
    document.querySelector('#voice-selection > option').remove();
  }
  for(var i = 0; i < voices.length; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }
    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    option.value = voices[i].lang;
    voiceSelection.appendChild(option);
  }
}
populateVoiceList();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = populateVoiceList;
}

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
