export class Controller {
    pixels = [];
    SHORT_DISTANCE = 50
    constructor(x, y) {
        this.addPixel(x,y)
        this.xMin = x;
        this.xMax = x
        this.yMin = y
        this.yMax = y
    }

    isClose(x, y) {

        // Validating if the coordinate it into the x and y min, max
        if (
            this.xMin < x && x < this.xMax 
            && this.yMin < y && y < this.yMax
        ){
            return true
        }

        let distX = 0;
        let distY = 0;

        if(x < this.xMin){
            distX = this.xMin - x
        }
        if(x > this.xMax){
            distX = x - this.xMax
        }
        if(y < this.yMin){
            distY = this.yMin - y
        }
        if(y > this.yMax){
            distY = y - this.yMax
        }

        const distance = distX + distY

        // let shortDistance = -1
        // for (let i = 0; i < this.pixels.length; i++) {
        //     const distance = this.#distance(this.pixels[i], {x,y});
        //     if(shortDistance == -1 || distance < shortDistance) {
        //         shortDistance = distance
        //     }
        // }
        // return shortDistance < this.SHORT_DISTANCE;

        return distance < this.SHORT_DISTANCE
    }

    addPixel(x,y) {
        this.pixels.push({x, y})

        // get the corners
        if(x < this.xMin) this.xMin = x;
        if(y < this.yMin) this.yMin = y;
        if(x > this.xMax) this.xMax = x;
        if(y > this.yMax) this.yMax = y;
    }

    #distance(pixel1, pixel2) {
        const dx = pixel1.x - pixel2.x
        const dy = pixel1.y - pixel2.y
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
    }

    drawSquare(ctx) {
        const height = this.yMax - this.yMin;
        const width = this.xMax - this.xMin;
        const area = width * height

        if(area < 1300) return


        ctx.strokeStyle = "#f00";
        ctx.lineWidth = 4;
        ctx.beginPath();

        ctx.rect(this.xMin, this.yMin, width, height)
        ctx.stroke()

        
    }

    area() {
        const width = this.xMax - this.xMin;
        const height = this.yMax - this.yMin;
        return width * height
    }

}