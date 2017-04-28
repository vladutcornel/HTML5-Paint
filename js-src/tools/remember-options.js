(function () {

    var $width, $height;
    var $lineWidth, $lineColor, $fillColor;
    var $fontSize, $fontFamily;
    var $canvas, canvas;

    jQuery(function ($) {
        canvas = document.getElementById("WorkCanvas");
        $canvas = $(canvas);
        $width = $("#CanvasWidth");
        $height = $("#CanvasHeight");
        $lineWidth = $("#LineWidth");
        $lineColor = $("#LineColor");
        $fillColor = $("#FillColor");
        $fontSize = $("#FontSize");
        $fontFamily = $("#FontFamily");

        $width.val(localStorage.canvasWidth || 1024);
        $height.val(localStorage.canvasHeight || 768);

        $lineWidth.val(localStorage.lineWidth || 1);
        $lineColor.val(localStorage.lineColor || "#333333");

        var defaults = {
            canvasWidth: {
                $: $width,
                value: 1024
            },
            canvasHeight: {
                $: $height,
                value: 768
            },
            lineWidth: {
                $: $lineWidth,
                value: 1
            },
            lineColor: {
                $: $lineColor,
                value: "#333333"
            },
            fillColor: {
                $: $fillColor,
                value: "#ffffff"
            },
            fontSize: {
                $: $fontSize,
                value: 20
            },
            fontFamily: {
                $: $fontFamily,
                value: "serif"
            }
        };

        for(var key in defaults) {
            if (! defaults.hasOwnProperty(key)) {
                continue;
            }
            
            (function(key) {
                var opt = defaults[key];

                opt.$.val(localStorage.getItem(key) || opt.value);

                opt.$.change(function() {
                    localStorage.setItem(key, opt.$.val());
                });
            })(key);

        }

        // load storage image
        var context = canvas.getContext("2d");
        if (localStorage.image) {
            var img = document.createElement("img");
            img.src = localStorage.image;

            img.addEventListener("load", function() {
                canvas.width = img.width;
                canvas.height = img.height;

                context.drawImage(img, 0, 0, img.width, img.height, 0,0, canvas.width, canvas.height);
            });
        }

        $canvas.on("image-changed", function() {
            // save stored image when changed
            localStorage.image = canvas.toDataURL();

            for(var key in defaults) {
                if (! defaults.hasOwnProperty(key)) {
                    continue;
                }

                localStorage.setItem(key, defaults[key].$.val());

            }
        });

    });
})();