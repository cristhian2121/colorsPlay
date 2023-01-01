import { Controller } from "./controller.js";

// const FRAMES = 30
const VIDEO_WIDTH = 500;
const VIDEO_HEIGTH = 500;
const BLUE = { r: 0, g: 0, b: 255 }
const BLUE_BORDER = 175

let $video;
let $canvas;

window.addEventListener("load", function() {
    // Show camera in html
    showCamera()    
})

function showCamera() {  
    $video = document.getElementById("video"); 
    $canvas = document.getElementById("canvas"); 
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

    let shortDistance = null
    let bluePixel = null

    // let sumX = 0
    // let sumY = 0
    // let count = 0

    const controllers = [];
    
    for (let pixel = 0; pixel < pixels.length; pixel+=4) {
        const currenPixel = {
            r: pixels[pixel],
            g: pixels[pixel+1],
            b: pixels[pixel+2]
        }
        const distance = distanceOfColor(BLUE, currenPixel)

        if(distance < BLUE_BORDER){
            // pixels[pixel] = 0;
            // pixels[pixel+1] = 255;
            // pixels[pixel+2] = 0;

            // to get the average
            const positionX = (pixel / 4) % $canvas.width; // without round because is square
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

            // sumX += positionX
            // sumY += positionY

            // count++
        }        

        // Shortist distance
        // if(shortDistance == null || distance < shortDistance) {
        //     shortDistance = distance
    
        //     // The blue more blue
        //     const positionY = Math.floor(pixel / 4 / $canvas.width);
        //     const positionX = (pixel / 4) % $canvas.width; // without round because is square
        //     bluePixel = {
        //         x: positionX,
        //         y: positionY
        //     }
        // }        
    }

    canvasContex.putImageData(imageData, 0, 0)

    // console.log('controllers.length: ', controllers.length);
    for (let i = 0; i < controllers.length; i++) {
        controllers[i].drawSquare(canvasContex);
    }

    // print pixel more blue
    // if(count){            
    //     printCicle({ 
    //         ctx: canvasContex,
    //         x: sumX / count,
    //         y: sumY /count
    //     })
    // }


    setTimeout(processCamera, 30)

}

function distanceOfColor(color, currenPixel){
    const dr = color.r - currenPixel.r
    const dg = color.g - currenPixel.g
    const db = color.b - currenPixel.b
    return Math.sqrt(Math.pow(dr, 2) + Math.pow(dg, 2) + Math.pow(db, 2))
}

function printCicle({ ctx, x, y }) {
    
    ctx.fillStyle="#f00" // Red
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2*Math.PI)
    ctx.fill();
}


