This is my Multimedia Application Development lab assignment.

I wanted to build a basic HTML5 Paint application. 

Key features:

- Pure HTML5 API used (i.e. No Flash or anything).
- Free drawing mode with any line width and color. 
- Support for pressure drawing devices (Wacom tablets) in Pen mode
- Rectangle drawing mode
- In place text with font picker
- Ability to snap a photo if the device has a camera
- Ability to open an image without server connection

Development features:
- JavaScript compiled with [WebPack](https://webpack.js.org/)
- CSS compiled with SASS
- Uses Twitter Bootstrap v3.3 with stock color scheme
- Single Page Application

It's not my intention at this point to develop it further, but it was a fun little project (it took me less than 20 hours in total to write, spread accross multiple days, most of it waiting for a slow mountain-side connection cause I had to learn HTML5 canvas) and I can easily be persuaded to add new features. Just add any feature request in the GitHub Issue tracker.

[Demo](https://paint.borina.ro) 
Just ignore the SSL certificate error. It's just that the Camera HTML5 API does not work with HTTP, only with HTTPS