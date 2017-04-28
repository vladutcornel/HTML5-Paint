/**
 * Created by vciobota on 4/15/17.
 */

//dependencies
import jQuery from '../node_modules/jquery/src/jquery';
import '../node_modules/webrtc-adapter/out/adapter';

// Use jQuery globally
window.jQuery = window.$ = jQuery;

window.MODE_OPEN = "open";
window.MODE_RESIZE = "resize";
window.MODE_PEN = "pen";
window.MODE_RECTANGLE = "rectangle";
window.MODE_TEXT = "text";

let HTMLPaint = {
    mode: MODE_PEN
};
window.HTMLPaint = HTMLPaint;

// App files
import './lib/fonts';
import './draw/file';
import './draw/pen';
import './draw/rectangle';
import './draw/text';
import './draw/camera';
import './tools/resize-canvas';
import './tools/remember-options';
import './tools/mode-picker';

import './init'