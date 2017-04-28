/**
 * Created by vciobota on 4/15/17.
 */

(function () {
    const PROP_WIDTH = "width";
    const PROP_HEIGHT = "height";
    var $canvas;
    var context;
    var $width, $height;
    jQuery(function ($) {
        $canvas = $("#WorkCanvas");
        context = $canvas.get(0).getContext("2d");
        $width = $("#CanvasWidth");
        $height = $("#CanvasHeight");
        $canvas.prop(PROP_WIDTH, localStorage.canvasWidth || 1024);
        $canvas.prop(PROP_HEIGHT, localStorage.canvasHeight || 768);

        $width.change(function () {
            resize();
        });

        $height.change(function () {
            resize();
        });
    });

    function resize() {
        var w = $width.val();
        var h = $height.val();
        var canvas = $canvas.get(0);

        // create a temporary canvas obj to cache the pixel data //
        var temp_cnvs = document.createElement('canvas');
        var temp_cntx = temp_cnvs.getContext('2d');
        // set it to the new width & height and draw the current canvas data into it //
        temp_cnvs.width = w;
        temp_cnvs.height = h;
        temp_cntx.fillStyle = "rgb(255,255,255)";  // the original canvas's background color
        temp_cntx.fillRect(0, 0, w, h);
        temp_cntx.drawImage(canvas, 0, 0);

        // resize & clear the original canvas and copy back in the cached pixel data //
        canvas.width = w;
        canvas.height = h;
        context.drawImage(temp_cnvs, 0, 0);
    }
})();