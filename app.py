# Flask
from flask import Flask, redirect, url_for, request, render_template, Response, jsonify, redirect
from werkzeug.utils import secure_filename
from gevent.pywsgi import WSGIServer
import base64
import re

import SimpleITK as sitk
import numpy as np
import skimage.io
from run_code import run_inference
import os
import nibabel as nib
from run_code import color_img

# def read_img(path):
#     img = sitk.ReadImage(path)
#     data = sitk.GetArrayFromImage(img)
#     return data
def read_img(file_name):
    if not os.path.exists(file_name):
        return np.array([1])

    proxy = nib.load(file_name)
    # affine = proxy.affine.copy()
    # hdr = proxy.header.copy()
    data = proxy.get_fdata()
    proxy.uncache()
    return data

# Declare a flask app
app = Flask(__name__)
@app.route('/', methods=['GET'])
def index():
    # Main page
    return render_template('index.html')


@app.route('/preview', methods=['GET', 'POST'])
def preview():
    if request.method == 'POST':
        # Get the image from post request
        # img = base64_to_pil(request.json)
        for i in request.json:
            print("i:",i)
        print(request.json['name'])
        print("Start save")
        base64_t0_nii(request.json['image_data'], './input_nifti/'+request.json['name'])
        pics = read_img('./input_nifti/'+request.json['name'])
        nii_name = request.json['name'].split('.')[0]
        print(nii_name)
        b64_data_s = []
        picsroot='./run_code/pics'
        if not os.path.exists(picsroot):
            os.makedirs(picsroot)

        for pic in range(len(pics)):
            skimage.io.imsave('./run_code/pics/'+nii_name+'-'+str(pic)+'.png', pics[pic])
            with open('./run_code/pics/'+nii_name+'-'+str(pic)+".png", "rb") as f:  # 转为二进制格式
                # 使用base64进行加密
                base64_data = base64.b64encode(f.read())
                b64_data_s.append(str(base64_data, encoding='utf8'))

        # Serialize the result, you can add additional fields
        return jsonify(result=b64_data_s, probability=0)
    return None




@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'POST':
        # Get the image from post request
        for i in request.json:
            print("i:",i)
        print(request.json['name'])
        print("Start save")
        base64_t0_nii(request.json['image_data'], './input_nifti/'+request.json['name'])
        pics = read_img('./input_nifti/'+request.json['name'])
        nii_name = request.json['name'].split('.')[0]
        print(nii_name)
        b64_data_s = []
        picsroot = './run_code/pics'
        if not os.path.exists(picsroot):
            os.makedirs(picsroot)
        result_picsroot = './run_code/result_pics'
        if not os.path.exists(result_picsroot):
            os.makedirs(result_picsroot)
        for pic in range(len(pics)):
            skimage.io.imsave('./run_code/pics/'+nii_name+'-'+str(pic)+'.png', pics[pic])
            with open('./run_code/pics/'+nii_name+'-'+str(pic)+".png", "rb") as f:  # 转为二进制格式
                # 使用base64进行加密
                base64_data = base64.b64encode(f.read())
                b64_data_s.append(str(base64_data, encoding='utf8'))
        # 进行语义分割
        run_inference.predict_code('./input_nifti', request.json['name'])
        result_pics = read_img('./run_code/Result/'+request.json['name'])
        b64_data_result = []
        color_img.color('./run_code/pics', './run_code/Result/'+request.json['name'], str(nii_name), './run_code/result_pics')
        for pic in range(len(result_pics)):
            with open('./run_code/result_pics'+'/'+nii_name + '-' + str(pic)+".png", "rb") as f:
                base64_data = base64.b64encode(f.read())
                b64_data_result.append(str(base64_data, encoding='utf8'))

        # Serialize the result, you can add additional fields
        return jsonify(result=b64_data_s, result2=b64_data_result, probability=0)
    return None






def base64_t0_nii(nii_base64, nii_name='temp.nii'):
    nii_base64 = re.sub('^.+;base64,', '', nii_base64)
    with open(nii_name, 'wb') as f:
        f.write(base64.b64decode(nii_base64))
        print("解码完毕")


if __name__ == '__main__':

    # Serve the app with gevent
    http_server = WSGIServer(('0.0.0.0',67), app)
    print('Model loaded. Check http://127.0.0.1:67')
    http_server.serve_forever()

