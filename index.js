var btn = document.getElementById("take-photo");
var devices = [];
var selectedCamera = "";

function handleError(error) {
  console.log(
    "navigator.MediaDevices.getUserMedia error: ",
    error.message,
    error.name
  );
}

function gotDevices(deviceInfos) {
  for (var i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    if (deviceInfo.kind === "videoinput") {
      const id = deviceInfo.deviceId;
      if (!devices.includes(id)) {
        devices.push(id);
      }
    }
  }

  var domElement = document.querySelector("#arjs-video");

  var oldStream = domElement.srcObject;
  oldStream.getTracks().forEach(function (track) {
    track.stop();
  });

  var videoSource = devices[0];
  var constraints = {
    audio: false,
    video: { deviceId: videoSource ? { exact: videoSource } : undefined },
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function success(stream) {
      domElement.srcObject = stream;

      var event = new CustomEvent("camera-init", { stream: stream });
      window.dispatchEvent(event);

      document.body.addEventListener("click", function () {
        domElement.play();
      });
    });
}

function takePicture(e) {
  navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
}

btn.addEventListener("click", takePicture);
