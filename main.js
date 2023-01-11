import { Controller } from "./controller.js";

// const FRAMES = 30
const VIDEO_WIDTH = 500;
const VIDEO_HEIGTH = 500;
const BLUE = { r: 0, g: 0, b: 255 }
const BLUE_BORDER = 175
const GAIN = 1.05;

let $video;
let $canvas;
let $degree;
let $pointer;

window.addEventListener("load", function() {
    // Show camera in html
    showCamera()    
})

function showCamera() {  
    $video = document.getElementById("video"); 
    $canvas = document.getElementById("canvas"); 
    $degree = document.getElementById("degree"); 
    $pointer = document.getElementById("pointer");

    const options = {
        audio: false,
        video: {
            width: VIDEO_WIDTH, heigth: VIDEO_HEIGTH
        }
    } 

    if(navigator.mediaDevices.getDisplayMedia){
        navigator.mediaDevices.getUserMedia(options)
            .then(function(stream) {
                video.srcObject = stream
                processCamera()
            })
            .catch(function(err) {
                console.log('err: ', err);
            })
    }
}

function processCamera() {    
    const canvasContex = $canvas.getContext("2d")

    // TODO: read about this
    canvasContex.drawImage($video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGTH, 0, 0, $canvas.width, $canvas.height)
    const imageData = canvasContex.getImageData(0, 0, $canvas.width, $canvas.height)
    const pixels = imageData.data

    const controllers = [];
    
    for (let pixel = 0; pixel < pixels.length; pixel+=4) {
        const currenPixel = {
            r: pixels[pixel],
            g: pixels[pixel+1],
            b: pixels[pixel+2]
            // alpha: pixels[pixel+3]
        }
        const distance = distanceOfColor(BLUE, currenPixel)

        if(distance < BLUE_BORDER){

            // Getting average
            const positionX = (pixel / 4) % $canvas.width; // Method to normalize
            const positionY = Math.floor(pixel / 4 / $canvas.width);

            // Group
            if(!controllers.length) {
                const controller = new Controller(positionX, positionY);
                controllers.push(controller)
            } else {
                // validate if the new position is close to some controller
                let isNewController = true;
                for (let i = 0; i < controllers.length; i++) {
                    if(controllers[i].isClose(positionX, positionY)){
                        controllers[i].addPixel(positionX, positionY)
                        isNewController = false
                        break
                    }
                }
                // new Controller
                if(isNewController) {
                    // TODO: validate area
                    const newController = new Controller(positionX, positionY);
                    controllers.push(newController)
                }
            }
        }      
    }

    // canvasContex.putImageData(imageData, 0, 0)

    for (let i = 0; i < controllers.length; i++) {
        controllers[i].drawSquare(canvasContex);
        const degrees = controllers[i].getDegree()
        if(degrees == 0 || !Number(degrees)) continue
        setDregreesToHtml(degrees)
    }

    setTimeout(processCamera, 60)

}

function distanceOfColor(color, currenPixel){
    const dr = color.r - currenPixel.r
    const dg = color.g - currenPixel.g
    const db = color.b - currenPixel.b
    return Math.sqrt(Math.pow(dr, 2) + Math.pow(dg, 2) + Math.pow(db, 2))
}

function setDregreesToHtml(text) {
    
    if(Number(text)){
        const degree = text * 100 * GAIN;
        $degree.innerText = degree
        $pointer.style.transform = `rotate(${degree}deg)`
    }

}
