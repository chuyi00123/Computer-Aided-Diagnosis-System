//========================================================================
// Drag and drop image handling
//========================================================================

var fileDrag = document.getElementById("file-drag");
var fileSelect = document.getElementById("file-upload");
var pic1slider =  document.getElementById("pic1slider");
var pic2slider =  document.getElementById("pic2slider");
// Add event listeners
fileDrag.addEventListener("dragover", fileDragHover, false);
fileDrag.addEventListener("dragleave", fileDragHover, false);
fileDrag.addEventListener("drop", fileSelectHandler, false);
fileSelect.addEventListener("change", fileSelectHandler, false);

function fileDragHover(e) {
  // prevent default behaviour
  e.preventDefault();
  e.stopPropagation();

  fileDrag.className = e.type === "dragover" ? "upload-box dragover" : "upload-box";
}

function fileSelectHandler(e) {
  // handle file selecting
  var files = e.target.files || e.dataTransfer.files;
  fileDragHover(e);
  for (var i = 0, f; (f = files[i]); i++) {
    previewFile(f);
  }
}

//========================================================================
// Web page elements for functions to use
//========================================================================

var imagePreview = document.getElementById("image-preview");
var imageDisplay = document.getElementById("image-display");
var uploadCaption = document.getElementById("upload-caption");
var uploadimage = document.getElementById("upload-image")
var predResult = document.getElementById("pred-result");
var loader = document.getElementById("loader");
var loader1 = document.getElementById("loader1");

//========================================================================
// Main button events
//========================================================================

function previewbutton() {
  // action for the submit button
  console.log("preview");

  if (!imageDisplay.src || !imageDisplay.src.startsWith("data")) {
    window.alert("Please select an image before submit.");
    return;
  }

  loader1.classList.remove("hidden");
  imageDisplay.classList.add("loading");

  // call the predict function of the backend
  previewImage(imageDisplay.src);
}



function submitImage() {
  // action for the submit button
  console.log("submit");

  if (!imageDisplay.src || !imageDisplay.src.startsWith("data")) {
    window.alert("Please select an image before submit.");
    return;
  }

  loader.classList.remove("hidden");
  imageDisplay.classList.add("loading");

  // call the predict function of the backend
  predictImage(imageDisplay.src);
}

function clearImage() {
  // reset selected files
  fileSelect.value = "";

  // remove image sources and hide them
  imagePreview.src = "";
  imageDisplay.src = "";
  predResult.innerHTML = "";

  hide(imagePreview);
  hide(imageDisplay);
  hide(loader);
  hide(predResult);
  show(uploadCaption);
  show(uploadimage);

  imageDisplay.classList.remove("loading");
}

function previewFile(file) {
  // show the preview of the image
  console.log(file.name);
  var fileName = encodeURI(file.name);

  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => {
    imagePreview.src = URL.createObjectURL(file);

    show(imagePreview);
    hide(uploadCaption);
    hide(uploadimage);


    // reset
    predResult.innerHTML = "";
    imageDisplay.classList.remove("loading");

    displayImage(reader.result, "image-display");
  };
}

//========================================================================
// Helper functions
//========================================================================
var pics =[];
var pics2 =[];

function predictImage(image) {
  fetch("/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({"image_data":image,"name":fileSelect.files[0].name})
  })
    .then(resp => {
      if (resp.ok)
        resp.json().then(data => {
          //displayResult(data);
            pics = data.result;
            pic1slider.setAttribute('max',pics.length-1)
            imagePreview.setAttribute( 'src', 'data:image/png;base64,'+data.result[0])

            pics2 = data.result2;
            pic2slider.setAttribute('max',pics2.length-1)
            imageDisplay.setAttribute( 'src', 'data:image/png;base64,'+data.result2[0])
            hide(loader);

        });
    })
    .catch(err => {
      console.log("An error occured", err.message);
      window.alert("Oops! Something went wrong.");
    });
}


function previewImage(image) {
  fetch("/preview", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({"image_data":image,"name":fileSelect.files[0].name})
  })
    .then(resp => {
      if (resp.ok)
        resp.json().then(data => {
          //displayResult(data);
            pics = data.result;
            pic1slider.setAttribute('max',pics.length-1)
            imagePreview.setAttribute( 'src', 'data:image/png;base64,'+data.result[0])
            hide(loader1);

        });
    })
    .catch(err => {
      console.log("An error occured", err.message);
      window.alert("Oops! Something went wrong.");
    });
}



function displayImage(image, id) {
  // display image on given id <img> element
  let display = document.getElementById(id);
  display.src = image;
  show(display);
}

function displayResult(data) {
  // display the result
  // imageDisplay.classList.remove("loading");
  hide(loader);
  predResult.innerHTML = data.result;
  show(predResult);
}

function hide(el) {
  // hide an element
  el.classList.add("hidden");
}

function show(el) {
  // show an element
  el.classList.remove("hidden");
}

function showValue(newValue){
           //to do:接收newValue的值
  console.log(newValue)
}

var rangeValue = function(){
  var newValue = pic1slider.value;
  imagePreview.setAttribute( 'src', 'data:image/png;base64,'+pics[newValue])
  console.log(newValue);
}
//绑定input监听事件
pic1slider.addEventListener("input", rangeValue);


var range2Value = function(){
  var newValue2 = pic2slider.value;
  imageDisplay.setAttribute( 'src', 'data:image/png;base64,'+pics2[newValue2])
  console.log(newValue2);
}
//绑定input监听事件
pic2slider.addEventListener("input", range2Value);