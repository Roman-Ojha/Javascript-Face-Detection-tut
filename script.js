// firstly you have to download the face api library
// https://github.com/justadudewhohacks/face-api.js
// https://github.com/WebDevSimplified/Face-Detection-JavaScript
// and fade model
// https://github.com/WebDevSimplified/Face-Detection-JavaScript/tree/master/models

const video = document.getElementById("video");
// here we are getting all the model that we want
Promise.all([
  // here we are importing all the model from the folder 'models'
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  // this will going to register different part of the face like mouth,nose,eye,etc..
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  // this will going to recognise where face is
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  // this will going to recognise the face Expression
]).then(startVideo);
// after that we want to start the video

function startVideo() {
  // here we have to get the webcam to use for the video
  navigator.getUserMedia(
    { video: {} },
    // here stream is the what is comming from a web cam
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

startVideo();

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }, 100);
});
