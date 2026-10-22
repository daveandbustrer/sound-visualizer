// html elements
let audioElement = document.getElementById("Audio");
let input = document.getElementById("file");

// url peremenance
let objectURL;

// sound analysis
let analysis;
let bins;
function createAnalysis() {
  if (!analysis) {
    let audiocontext = new AudioContext();
    let source = audiocontext.createMediaElementSource(audioElement);

    analysis = audiocontext.createAnalyser();
    analysis.fftSize = 256;

    source.connect(analysis);
    analysis.connect(audiocontext.destination);
    bins = new Uint8Array(analysis.frequencyBinCount);
  }
}
// sets up everything
input.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const previousURL = objectURL;

  objectURL = URL.createObjectURL(file);
  audioElement.src = objectURL;

  if (previousURL) {
    URL.revokeObjectURL(previousURL);
  }
});
audioElement.addEventListener("play", async () => {
  createAnalysis();
});
// sketch part

function setup() {
  createCanvas(windowWidth, windowHeight);
}
function draw() {
  background("black");

  // Wait until the audio analysis has been initialized.
  if (!analysis || !bins) return;
  analysis.getByteFrequencyData(bins);

  fill("white");
  const changed_width = width * 2.75;
  const bar_width = changed_width / bins.length;
  for (let i = 0; i < bins.length; i++) {
    const bar_height = bins[i] * 2;
    fill(255 - i, 255 - i * 2, 255 - i * 3);
    rect(
      bar_width / 2 + i * bar_width,
      height - bar_height,
      bar_width,
      bar_height,
    );
  }
}
