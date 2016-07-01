# rpi-websocket

In this experiment I attach a 8x8 LED matrix to a Raspberry PI. Via WebSockets, the LEDs can be turned on and off.
If you access the PI on port `3000`, you get served a webpage with a 8x8 grid on it. On the grid, one led is highlighed. 
That LED is assigned to the browser, with the toggle button you can turn on and off the LED. Open another browser tab and
navigate to the same page. You will get another LED assigned.
