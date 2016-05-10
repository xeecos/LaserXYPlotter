# LaserXYPlotter

![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/6.jpg)
LaserXYPlotter is a laser engraving control program that can work with Raspberry Pi. It can use serial communication and http service with Node.js. Also, it can render web pages and edit SVG through fabric.js. What’s more, it can transfer SVG image into G code by svg2gcode.js. But it does not support DXF yet.Here is the video.
[![video](http://img.youtube.com/vi/pr0rrINsPKs/0.jpg)](https://youtu.be/pr0rrINsPKs).

![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/6.jpg)
![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/xy.gif)

## Hardware
### Use MegaPi
MegaPi with Marlin firmware.
![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/5.jpg)
![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/10.jpg)
![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/11.jpg)
### Use Makeblock XY Plotter
Connecting XY Plotter with Raspberry Pi to control hardware. Use /dev/ttyUSB* to connect with serial port.
![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/9.jpg)

## Software

Login Raspberry Pi through SSH (make sure that Raspberry Pi and your computer are in the same local area network):

    $ ssh pi@your rpi's ip
    
### Install nodejs 
 ```
 sudo apt-get update
 sudo apt-get install gcc-4.8 g++-4.8
 sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 20
 sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.8 50
 sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.6 20
 sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.8 50
 wget http://node-arm.herokuapp.com/node_latest_armhf.deb sudo dpkg -i node_latest_armhf.deb node -v
```
### Clone this project with Raspberry Pi through Git

 `git clone https://github.com/xeecos/LaserXYPlotter`

### Install Node.js package

 ```
 cd LaserXYPlotter
 npm install
 ```

### Run

 `node server.js`

## Start to Use

### Open website in the browser

 `http://your rpi's ip:8000`

### Serial Ports
    * use /dev/ttyAMA0 on Rpi 2
    * use /dev/ttyS0 on Rpi 3
![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/2.jpg)
![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/6.jpg)
![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/4.jpg)
