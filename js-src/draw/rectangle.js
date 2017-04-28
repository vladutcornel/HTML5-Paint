(function () {
    var canvas, context;
    var isMouseDown = false;
    var startPosition = null;
    var $lineWidth = null;
    var $lineColor = null;
    var $fillColor = null;
    var $tempCanvas;
    jQuery(function ($) {

        $lineWidth = $("#LineWidth");
        $lineColor = $("#LineColor");
        $fillColor = $("#FillColor");
        $tempCanvas = $("#TempCanvas");

        canvas = document.getElementById("WorkCanvas");
        if (!canvas.getContext) {
            alert("Your browser is not supported. Please stop using IE");
        }
        context = canvas.getContext("2d");

        $(canvas)
            .on("unload-mode", function () {
                if (MODE_RECTANGLE != HTMLPaint.mode) return;

                $(canvas)
                    .off('mousedown', onMouseDown)
                ;
                $tempCanvas
                    .off('mousemove', onMouseMove)
                    .off('mouseup', onMouseUp)
                    .off('mouseout', onMouseOut)
                    ;

            })
            .on("set-mode.rectangle", function () {
                $(canvas)
                    .on('mousedown', onMouseDown)
                ;
                $tempCanvas
                    .on('mousemove', onMouseMove)
                    .on('mouseup', onMouseUp)
                    .on('mouseout', onMouseOut)
                ;

                HTMLPaint.mode = MODE_RECTANGLE;
            })
        ;

    });

    function onMouseDown(ev) {
        isMouseDown = true;
        startPosition = {
            x: ev.offsetX,
            y: ev.offsetY
        };

        context.lineWidth = $lineWidth.val();
        context.lineCap = "square";
        context.fillStyle = getRGBColor($fillColor.val());
        context.strokeStyle = getRGBColor($lineColor.val());

        $tempCanvas.removeClass("hidden");

        var offset = $(canvas).offset();
        $tempCanvas
            .css({position:"absolute"})
            .prop("width", canvas.width)
            .prop("height", canvas.height)
            .offset(offset)
        ;
    }

    function onMouseMove(ev) {

        if (!isMouseDown) {
            return;
        }

        var rect = getRectParams(startPosition.x, ev.offsetX, startPosition.y, ev.offsetY);

        var tempContext = $tempCanvas.get(0).getContext("2d");

        // Clear
        tempContext.clearRect(0,0, tempContext.canvas.width, tempContext.canvas.height);

        // reset style
        tempContext.lineWidth = $lineWidth.val();
        tempContext.lineCap = "square";
        tempContext.fillStyle = getRGBColor($fillColor.val());
        tempContext.strokeStyle = getRGBColor($lineColor.val());

        // draw rectangle
        tempContext.fillRect(rect.x, rect.y, rect.width, rect.height);

        if (0 < $lineWidth.val()) {
            tempContext.strokeRect(rect.x, rect.y, rect.width, rect.height);
        }

        return false;

    }

    function onMouseUp(ev) {

        if (!isMouseDown) {
            return;
        }

        isMouseDown = false;

        context.beginPath();
        context.lineWidth = $lineWidth.val();
        context.lineCap = "square";
        context.fillStyle = getRGBColor($fillColor.val());
        context.strokeStyle = getRGBColor($lineColor.val());

        var rect = getRectParams(startPosition.x, ev.offsetX, startPosition.y, ev.offsetY);
        context.fillRect(rect.x, rect.y, rect.width, rect.height);
        if (0 < $lineWidth.val()) {
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        }

        $tempCanvas.addClass("hidden");
        
        $(canvas).trigger("image-changed")
    }

    function onMouseOut() {

        if (!isMouseDown) {
            return;
        }
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

    function getRectParams(startX, endX, startY, endY) {

        if (startX > endX) {
            var tempX = startX;
            startX = endX;
            endX = tempX;
        }

        if (startY > endY) {
            var tempY = startY;
            startY = endY;
            endY = tempY;
        }

        return {
            x: startX,
            y: startY,
            width: endX - startX,
            height: endY - startY
        }
    }

})();
