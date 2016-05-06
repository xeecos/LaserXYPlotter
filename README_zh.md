# LaserXYPlotter
LaserXYPlotter是一个可以部署在树莓派上的激光雕刻机控制程序，使用Node.js实现了串口通讯和http服务, 使用fabric.js实现了网页渲染和编辑SVG，使用svg2gcode.js将SVG图形转换为G代码。 DXF暂时还不支持。 

这里查看 [演示视频](http://v.youku.com/v_show/id_XMTU1MDgyMjg4OA==.html).

![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/6.jpg)
![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/xy.gif)

## 硬件
###使用MegaPi
MegaPi使用Marlin固件。
![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/5.jpg)
![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/10.jpg)
![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/11.jpg)
###使用Makeblock XY Plotter
通过USB线连接到树莓派，实现硬件控制。串口使用/dev/ttyUSB*。
![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/9.jpg)

## 软件部署

使用SSH远程登录树莓派（保证树莓派跟你的电脑在同一个局域网内）:

    $ ssh pi@your rpi's ip
    
### 安装nodejs
 ```
 sudo apt-get update
 sudo apt-get install gcc-4.8 g++-4.8
 sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 20
 sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.8 50
 sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.6 20
 sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.8 50
 wget http://node-arm.herokuapp.com/node_latest_armhf.deb sudo dpkg -i node_latest_armhf.deb node -v
```
### 通过Git将本项目拉取到树莓派上

 `git clone https://github.com/xeecos/LaserXYPlotter`

### 安装 Node.js 相关包

 ```
 cd LaserXYPlotter
 npm install
 ```

### 运行服务

 `node index.js`

## 使用

### 在浏览器中打开网页

 `http://your rpi's ip:8000`

### 串口
    * 树莓派2B使用/dev/ttyAMA0
    * 树莓派3使用/dev/ttyS0
![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/2.jpg)
![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/6.jpg)
![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/4.jpg)
