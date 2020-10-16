var devices = [];
var selectedCamera = "env";

function handleError(error) {
  console.log("Something went wrong: ", error.message, error.name);
}

function getDevices(deviceInfos) {
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    if (deviceInfo.kind === "videoinput") {
      var id = deviceInfo.deviceId;
      if (!devices.includes(id)) {
        devices.push(id);
      }
    }
  }
}

function switchCam(e) {
  var constraints;

  if (selectedCamera === "env") {
    constraints = {
      audio: false,
      video: {
        facingMode: "user",
        width: {
          ideal: 640,
        },
        height: {
          ideal: 480,
        },
      },
    };
    selectedCamera = "user";
  } else {
    constraints = {
      audio: false,
      video: {
        facingMode: "environment",
        width: {
          ideal: 640,
        },
        height: {
          ideal: 480,
        },
      },
    };
    selectedCamera = "env";
  }
  console.log("Contraints selected. Attempting to change camera...");

  var domElement = document.querySelector("#arjs-video");

  var oldStream = domElement.srcObject;
  oldStream.getTracks().forEach(function (track) {
    track.stop();
    console.log("Current stream stopped");
  });

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      
      domElement.srcObject = stream;

      var event = new CustomEvent("camera-init", { stream: stream });
      window.dispatchEvent(event);
      console.log("Event dispatched. Changing camera.");

      document.body.addEventListener("click", function () {
        domElement.play();
      });
    })
    .catch(handleError);
}

navigator.mediaDevices.enumerateDevices().then(getDevices).catch(handleError);

btn.addEventListener("click", switchCam);
