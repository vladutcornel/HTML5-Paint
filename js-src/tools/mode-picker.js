(function () {
    var $workArea;
    var $container;
    var $canvas;
    jQuery(function ($) {
        $workArea = $("#ToolBar");
        $container = $("#ModePicker");
        $canvas = $("#WorkCanvas");

        $container.on("click", "a", function (ev) {
            var $a = $(ev.currentTarget);
            var newMode = $a.data("mode");

            $workArea.removeClass("mode-" + HTMLPaint.mode);
            $canvas.trigger("unload-mode");
            $canvas.trigger("set-mode." + newMode);
            HTMLPaint.mode = newMode;
            $workArea.addClass("mode-" + HTMLPaint.mode);

            $a.parent().addClass('active').siblings().removeClass('active');
        });

        HTMLPaint.switchToMode = function (mode) {
            $("#ToolBar .nav .mode-" + mode + " a").click();
        }
    });
})();