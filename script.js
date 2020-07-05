; /*
author: elektronaut (www.elektronaut.at)
licence:
This uses http://jscolor.com which is under GPLv3
this is just a cobbled together proof of concept which in my opinion is not worth any licence but to adhere to the GPLv3
it's also released as GPLv3. have fun

*/


window.ondragover = function (e) { e.preventDefault() };
window.ondrop = function (e) { e.preventDefault(); draw(e.dataTransfer.files[0]); };

var img = new Image();
img.src = 'dragme.png';
img.onload = function () {
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
};



function draw(file) {
//    console.log('draw');
    var img = new Image();
    // URL @ Mozilla, webkitURL @ Chrome
    img.src = (window.webkitURL ? webkitURL : URL).createObjectURL(file);

    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');

    var imageData;
    var data;
    var dataCopy

    img.onload = function () {
//        console.log('img.onload');
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.style.width = '600px';     
        //	600 / img.width * img.height
        canvas.style.height = 600 / img.width * img.height + 'px'; // *puke* but it works 
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        data = imageData.data;
        dataCopy = new Uint8ClampedArray(imageData.data);
    };

    var invert = function () {
//        console.log('invert');
        //step size 4 (rgb and alpha)
        for (var i = 0; i < data.length; i += 4) {
            //red
            data[i] = 255 - data[i];
            // green
            data[i + 1] = 255 - data[i + 1];
            // blue
            data[i + 2] = 255 - data[i + 2];
        }
        ctx.putImageData(imageData, 0, 0);
    };

    var pop = function () {
//        console.log('pop');
        //use JScolor
        var bcrgb = document.getElementById('bc').jscolor.rgb;
        var wcrgb = document.getElementById('wc').jscolor.rgb;
        
        //convert to obj
        var wc = { r: wcrgb[0], g: wcrgb[1], b: wcrgb[2] };
        var bc = { r: bcrgb[0], g: bcrgb[1], b: bcrgb[2] };

        for (var i = 0; i < data.length; i += 4) {
            grey = (dataCopy[i] + dataCopy[i + 1] + dataCopy[i + 2]) / 3;
            data[i] = grey / 255 * wc.r + (255 - grey) / 255 * bc.r;
            data[i + 1] = grey / 255 * wc.g + (255 - grey) / 255 * bc.g;
            data[i + 2] = grey / 255 * wc.b + (255 - grey) / 255 * bc.b;
        }
        ctx.putImageData(imageData, 0, 0);
    };

    var original = function () {
//        console.log('original');
        imageData.data.set(dataCopy);
        ctx.putImageData(imageData, 0, 0);

    };

    var invertbtn = document.getElementById('invertbtn');
    invertbtn.addEventListener('click', invert);

    var popbtn = document.getElementById('popbtn');
    popbtn.addEventListener('click', pop);

    var originalbut = document.getElementById('originalbut');
    originalbut.addEventListener('click', original);


};


