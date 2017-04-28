(function () {
    var input;
    var canvas, context;
    var $width, $height;
    jQuery(function ($) {
        input = document.getElementById("LoadFile");
        canvas = document.getElementById("WorkCanvas");
        context = canvas.getContext("2d");
        $width = $("#CanvasWidth");
        $height = $("#CanvasHeight");

        input.addEventListener("change", function handleImage(e) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var img = new Image();
                img.onload = function () {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img, 0, 0);
                    $width.val(img.width);
                    $height.val(img.height);
                }
                img.src = event.target.result;

                input.value = "";


                $(canvas).trigger("image-changed");
            };

            reader.readAsDataURL(e.target.files[0]);
        });
    });
})();