import Preasure from "../../node_modules/pressure/dist/pressure";
import "../../node_modules/pressure/src/jquery_pressure";
(function () {
    var canvas, context;
    var isMouseDown = false;
    var mousePosition = null;
    var $lineWidth = null;
    var $lineColor = null;
    var multiplier = null;
    jQuery(function ($) {

        $lineWidth = $("#LineWidth");
        $lineColor = $("#LineColor");

        canvas = document.getElementById("WorkCanvas");
        if (!canvas.getContext) {
            alert("Your browser is not supported. Please stop using IE");
        }
        context = canvas.getContext("2d");

        $(canvas)
            .on("unload-mode", function () {
                if (MODE_PEN != HTMLPaint.mode) return;

                $(canvas)
                    .off('mousedown', onMouseDown)
                    .off('mousemove', onMouseMove)
                    .off('mouseup', onMouseUp)
                    .off('mouseout', onMouseOut)
                ;

            })
            .on("set-mode.pen", function () {
                $(canvas)
                    .on('mousedown', onMouseDown)
                    .on('mousemove', onMouseMove)
                    .on('mouseup', onMouseUp)
                    .on('mouseout', onMouseOut)
                ;

                HTMLPaint.mode = MODE_PEN;
            })
        ;

        Preasure.set(canvas, {
            change: function (force) {
                multiplier = force;
                adjustLineWidth();
            }
        }, {
            only: 'pointer'
        })

    });

    var prevMultiplier = 0;

    function onMouseDown(ev) {
        isMouseDown = true;
        mousePosition = {
            x: ev.offsetX,
            y: ev.offsetY
        };

        context.beginPath();

        context.lineWidth = $lineWidth.val();
        context.lineCap = "round";
        context.lineJoin = "round";
        context.strokeStyle = getStrokeColor();
    }

    function onMouseMove(ev) {

        if (!isMouseDown) {
            return;
        }

        var currentPosition = {
            x: ev.offsetX,
            y: ev.offsetY
        };

        adjustLineWidth();

        context.lineTo(currentPosition.x, currentPosition.y);
        context.stroke();

        mousePosition = currentPosition;

        return false;
    }

    function adjustLineWidth() {

        if (multiplier !== null) {
            if (prevMultiplier == null) {
                prevMultiplier = multiplier;
            }

            if (prevMultiplier != null && Math.abs(multiplier - prevMultiplier) > 0.1) {
                context.lineWidth = $lineWidth.val() * (1 + multiplier);
                console.log(context.lineWidth);
                context.beginPath();

                prevMultiplier = multiplier;
            }

        }
    }

    function onMouseUp(ev) {

        if (!isMouseDown) {
            return;
        }

        isMouseDown = false;

        var currentPosition = {
            x: ev.offsetX,
            y: ev.offsetY

        };

        context.lineTo(currentPosition.x, currentPosition.y);
        context.stroke();

        localStorage.image = canvas.toDataURL();

        $(canvas).trigger("image-changed");
    }

    function onMouseOut() {

        if (!isMouseDown) {
            return;
        }
    }

    function getStrokeColor() {
        var color = $lineColor.val();

        // #XXXXXX -> ["XX", "XX", "XX"]
        var value = color.match(/[A-Za-z0-9]{2}/g);

        // ["XX", "XX", "XX"] -> [n, n, n]
        value = value.map(function (v) {
            return parseInt(v, 16)
        });

        // [n, n, n] -> rgb(n,n,n)
        return "rgb(" + value.join(",") + ")";
    }

})();