import AvailableFonts from '../lib/fonts';

(function () {
    const KEY_TAB = 9;
    const KEY_Enter = 13;
    var canvas, context;
    var isEnteringText = false;
    var startPosition = null;
    var $workArea = $("#Wrapper");
    var $lineWidth = null;
    var $lineColor = null;
    var $fillColor = null;
    var $fontSize = null;
    var $fontFamily = null;
    var $tempCanvas;
    var $tempInput;
    jQuery(function ($) {
        console.log(AvailableFonts);

        $lineWidth = $("#LineWidth");
        $lineColor = $("#LineColor");
        $fillColor = $("#FillColor");
        $fontSize = $("#FontSize");
        $fontFamily = $("#FontFamily");
        $tempCanvas = $("#TempCanvas");

        canvas = document.getElementById("WorkCanvas");
        if (!canvas.getContext) {
            alert("Your browser is not supported. Please stop using IE");
        }
        context = canvas.getContext("2d");

        AvailableFonts.forEach(function(fontName) {
            var option = document.createElement("option");
            option.innerHTML = fontName;
            $fontFamily.append(option);
        });

        $(canvas)
            .on("unload-mode", function () {
                if (MODE_TEXT != HTMLPaint.mode) return;

                commitText();

                $(canvas)
                    .off('click', onClick)
                ;
                $tempCanvas.off("click", onClick);

                $tempInput
                    .off('keyup', onKeyUp)
                    .off('keydown', onKeyDown)
                    .remove()
                ;
                $workArea.off("change",":input", resetInput);
            })
            .on("set-mode.text", function () {
                $tempInput = $("<input type='text' class='hidden'>");
                $tempInput.appendTo('body');

                $(canvas)
                    .on('click', onClick)
                ;
                $tempCanvas.on("click", onClick);

                $tempInput
                    .on('keyup', onKeyUp)
                    .on('keydown', onKeyDown)
                ;
                $workArea.on("change",":input", resetInput);

                HTMLPaint.mode = MODE_TEXT;
            })
        ;

    });

    function onClick(ev) {

        if (isEnteringText) {
            commitText();
        }

        startPosition = {
            x: ev.offsetX,
            y: ev.offsetY
        };

        isEnteringText = true;

        resetInput();
    }

    function onKeyDown(ev) {
        if (-1 < [KEY_Enter, KEY_TAB].indexOf(ev.keyCode)) {
            commitText();
            ev.preventDefault();
            return false;
        }
    }

    function onKeyUp(ev) {

        if (! isEnteringText) {
            return;
        }

        resetInput();

    }

    function resetInput() {

        if (! isEnteringText ) {
            return;
        }

        var offset = $(canvas).offset();

        var outlineColor = $lineColor.val();
        var outlineWidth = $lineWidth.val();
        var fontSize = $fontSize.val();

        $tempInput
            .removeClass("hidden")
            .css({
            position: "absolute",
            font: buildFormSpec(),
            color: $fillColor.val(),
            height: fontSize + "px",
            width: canvas.width - startPosition.x,
            verticalAlign: "top",

            background: "transparent",
            border: "none",
            //borderBottom: "1px solid",
            outline: "none",
            padding: 0,
            margin:0,
        }).offset({
            top: offset.top + startPosition.y - fontSize * 0.85,
            left: offset.left + startPosition.x
        });

        $tempInput.focus();

    }

    function commitText() {
        if(null === startPosition) {
            return;
        }

        context.lineWidth = $lineWidth.val();
        // context.lineCap = "square";
        context.fillStyle = getRGBColor($fillColor.val());
        context.strokeStyle = getRGBColor($lineColor.val());
        context.font = buildFormSpec();

        context.fillText($tempInput.val(), startPosition.x, startPosition.y);
        if (0 < $lineWidth.val()) {
            context.strokeText($tempInput.val(), startPosition.x, startPosition.y);
        }

        isEnteringText = false;

        $tempInput.val("").addClass("hidden");

        $(canvas).trigger("image-changed");

        startPosition = null;
    }

    function getRGBColor(color) {
        // #XXXXXX -> ["XX", "XX", "XX"]
        var value = color.match(/[A-Za-z0-9]{2}/g);

        // ["XX", "XX", "XX"] -> [n, n, n]
        value = value.map(function (v) {
            return parseInt(v, 16)
        });

        // [n, n, n] -> rgb(n,n,n)
        return "rgb(" + value.join(",") + ")";
    }

    function buildFormSpec() {
        var fontSize = $fontSize.val();
        var lineHeight = fontSize * 1.1;
        return $fontSize.val() + 'px/'+ lineHeight +'px "' + ($fontFamily.val() || 'serif') + '"';
    }
})();
