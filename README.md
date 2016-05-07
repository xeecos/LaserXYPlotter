# LaserXYPlotter
## Hardware
![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/6.jpg)

LaserXYPlotter is a plotter project on Raspberry Pi using Node.js, fabric.js and svg2gcode.js. DXF is not supported at the moment. See the demo in action.

[![video](http://img.youtube.com/vi/pr0rrINsPKs/0.jpg)](https://youtu.be/pr0rrINsPKs).

###MegaPi
MegaPi can use the Marlin firmware.
## Setup

To get started with Raspberry Pi.
With Raspberry Pi and your computer on the same Wi-Fi network, it is also possible to connect to Raspberry Pi wirelessly via SSH. This is particularly helpful when running the demo. To do so, open a new terminal window and type the following:

    $ ssh pi@your rpi's ip
    
### Configuring the package manager

### Cloning this repository onto Raspberry Pi

 `git clone https://github.com/xeecos/LaserXYPlotter`.

### Installing Node.js packages

 `npm install`

### Running the Node.js server

* Run the server by typing `node server.js`.

#### Viewing the control page

Open a browser window and navigate to `http://your rpi's ip:8000`
