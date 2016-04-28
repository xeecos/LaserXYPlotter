# LaserXYPlotter
LaserXYPlotter是一个可以部署在树莓派上的激光雕刻机控制程序，使用Node.js实现了串口通讯和http服务, 使用fabric.js实现了网页渲染和编辑SVG，使用svg2gcode.js将SVG图形转换为G代码。 DXF暂时还不支持。 查看演示视频 [这里](http://v.youku.com/v_show/id_XMTU1MDgyMjg4OA==.html).

![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/6.jpg)

## 硬件
###使用MegaPi
MegaPi使用Marlin固件。
![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/5.jpg)
###使用Makeblock XY Plotter
通过USB线连接到树莓派，实现硬件控制。需要修改index.js中连接的串口端口号。
![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/9.jpg)

## 软件部署

使用SSH远程登录树莓派（保证树莓派跟你的电脑在同一个局域网内）:

    $ ssh pi@your rpi's ip
    
### 安装nodejs
 `curl -L https://raw.github.com/midnightcodr/rpi_node_install/master/setup.sh`
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

![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/2.jpg)
![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/6.jpg)
![image](https://github.com/xeecos/LaserXYPlotter/raw/master/images/4.jpg)