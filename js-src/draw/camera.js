
(function () {
    var $cameraContainer;
    var $videoContainer;
    var $selectCamera;
    var $startCamera;
    var $width, $height;
    var canvas, context;

    var video;

    var devices = {};
    var selectedDeviceId = "";

    var CLASS_ACTIVE = "active";

    jQuery(function ($) {
        canvas = document.getElementById("WorkCanvas");
        context = canvas.getContext("2d");

        $cameraContainer = $("#CameraContainer");
        $videoContainer = $cameraContainer.find("#VideoContainer");
        $selectCamera = $cameraContainer.find('.camera-picker');
        $width = $("#CanvasWidth");
        $height = $("#CanvasHeight");


        $startCamera = $("#StartCamera");


        canvas = document.getElementById("WorkCanvas");
        if (!canvas.getContext) {
            disableCameraFunctions();
            alert("Your browser is not supported. Please stop using IE");
        }
        context = canvas.getContext("2d");

        $startCamera.click(showSnapWindow);

        // Prepare cameras
        navigator.mediaDevices.enumerateDevices()
            .then(function gotDevices(deviceInfos) {
                $('#selectArea').show();
                var camcount = 1;   //used for labeling if the device label is not enumerated
                if (deviceInfos.length > 0) {
                    devices = {};
                    $selectCamera.empty();
                }

                for (var i = 0; i !== deviceInfos.length; ++i) {
                    var deviceInfo = deviceInfos[i];

                    if (deviceInfo.kind === 'videoinput') {
                        var button = document.createElement('button');
                        button.value = deviceInfo.deviceId;

                        button.innerText = deviceInfo.label || 'camera #' + camcount;

                        devices[deviceInfo.deviceId] = button;
                        $selectCamera.append(button);
                        camcount++;

                        if(!selectedDeviceId) {
                            selectedDeviceId = deviceInfo.deviceId;
                            button.classList.add(CLASS_ACTIVE);
                        }
                    }
                }

            })
            .catch(function errorCallback(error) {
                console.log('navigator.getUserMedia error: ', error);
            });

        $selectCamera.on("click", "button", function(ev) {
            var btn = ev.currentTarget;
            btn.classList.add(CLASS_ACTIVE);
            $(btn).siblings().removeClass(CLASS_ACTIVE);
            switchCamera(btn.value);
        });

        $cameraContainer
            .on("click", ".close", hideSnapWindow)
            .on("click", ".snap-photo-btn", function () {
                openImage();
            })
        ;
    });

    function openImage() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        $width.val(video.videoWidth);
        $height.val(video.videoHeight);

        context.drawImage(video, 0, 0);

        hideSnapWindow();

        $(canvas).trigger("image-changed");
    }

    function disableCameraFunctions() {
        $('.CameraField').remove();
    }

    function showSnapWindow() {

        video = document.createElement("video");
        $videoContainer.append(video);
        var $video = $(video);

        $cameraContainer.removeClass("hidden");

        var constraints = {
            video: {
                deviceId: selectedDeviceId ? {exact: selectedDeviceId} : undefined
            }
        };

        // Get access to the camera!
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Not adding `{ audio: true }` since we only want video now
            navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                video.src = window.URL.createObjectURL(stream);
                playVideo();
            });
        }
        // else if (navigator.getUserMedia) { // Standard
        //     navigator.getUserMedia(constraints, function (stream) {
        //         video.src = stream;
        //         playVideo();
        //     }, errBack);
        // }
        // else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
        //     navigator.webkitGetUserMedia(constraints, function (stream) {
        //         video.src = window.webkitURL.createObjectURL(stream);
        //         playVideo();
        //     }, errBack);
        // }
        // else if (navigator.mozGetUserMedia) { // Mozilla-prefixed
        //     navigator.mozGetUserMedia(constraints, function (stream) {
        //         video.src = window.URL.createObjectURL(stream);
        //         playVideo();
        //     }, errBack);
        // }
        else {
            alert("Your system does not support the camera function");
            HTMLPaint.switchToMode(MODE_PEN);
        }

    }

    function hideSnapWindow() {
        $(video).remove();
        $cameraContainer.addClass("hidden");
    }

    function playVideo() {
        var $video = $(video);
        var $parent = $video.parent();

        $video.on("loadedmetadata", function() {
            console.log(video.videoHeight, video.videoWidth);
            if ($video.height() < video.videoHeight || $video.width() < video.videoWidth) {
                $video.css ({
                    width: "100%",
                    height: "100%"
                });
            } else {
                $video.css ({
                    width: "auto",
                    height: "auto"
                });
            }
        });

        video.play();
    }

    function switchCamera(id) {
        hideSnapWindow();

        selectedDeviceId = id;

        showSnapWindow();
    }

})();
