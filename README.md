# Computer-Aided-Diagnosis-System

[![GPLv3 license](https://img.shields.io/badge/License-GPLv3-blue.svg)](http://perso.crans.org/besson/LICENSE.html)
[![](https://img.shields.io/badge/python-3.5%2B-green.svg)]()
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)

一个漂亮且可定制的 Web 应用程序，可轻松部署您的 DL 模型 

<a href="https://www.buymeacoffee.com/fing" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png" alt="Buy Me A Coffee"></a>

## 1.项目简介
本项目以以图像分割为中心，利用人工智能实现肾脏、肿瘤及囊肿的精准分割，并通过Flask框架将肾脏及其病灶分割模型部署到网络应用程序。前端使用简单的JavaScript，HTML和CSS，后端使用Python语言开发，框架基于Flask和Pytorch, 相关代码持续更新中......

:point_down: Screenshot:


<p align="center">
  <img src="https://raw.githubusercontent.com/chuyi00123/Medical-Aided-Diagnosis-System/master/dfbec2cab597e4e3cefe99f10255e4b.png" height="420px" alt="">
</p>

## 2.语义分割模型
本项目利用KiTS21数据集进行模型训练，模型详情：https://openreview.net/forum?id=immB02xhM15

## 3.模型预测
使用模型进行预测，并将推断结果保存在'./run_code/Result'文件夹中

## 4.启动WEB应用
在Flask项目下运行以下代码启动后端：
```
python app.py
```
然后在浏览器打开Localhost即可：

<p align="center">
  <img src="https://raw.githubusercontent.com/chuyi00123/Medical-Aided-Diagnosis-System/master/dfbec2cab597e4e3cefe99f10255e4b.png" height="420px" alt="">
</p>

## 5.拓展
将你自定义的模型加载到此应用程序也很简单


<details>
 <summary>Details</summary>

### 使用自定义模型
将训练好的模型放入'run_code'文件夹，然后书写属于自己的推断代码

检查app.py中与模型推测有关的代码是否需要修改
  
### 界面修改
修改templates和static目录中的文件
用于UI的index.html和用于所有行为的main.js
  

