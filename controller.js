export class Controller {
    pixels = [];
    SHORT_DISTANCE = 50
    width = 0;
    height = 0;
    area = 0;
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
        //TODO: pass it to a functuion to calculate the 
        // global with and height
        this.height = height;
        this.width = width
        const area = width * height

        if(area < 1300) return

        this.#printSquare(ctx, this.xMin, this.yMin, width, height)
        // this.printRightPortion(ctx, width, this.xMax, this.yMin, height)
        // this.printLeftPortion(ctx, width, this.xMin, this.yMin, height)

        const leftY = this.#getLeftAverageSectionY()
        const rightY = this.#getRightAverageSectionY()
        this.printPoint({ ctx, y: leftY })
        this.printPoint({ ctx, y: rightY, x: this.xMax })

    }

    area() {
        this.area = this.width * this.height;
        return this.area
    }

    #getLeftAverageSectionY() {
        const xMax =  Math.floor(this.xMin + this.width/10);
        let totalY = 0;
        let totalPixels = 0;
        for (let i=0; i < this.pixels.length; i++) {
            if (this.pixels[i].x <= xMax) {
                totalY += this.pixels[i].y
                totalPixels += 1;
            }
        }
        return Math.floor(totalY / totalPixels);
    }

    #getRightAverageSectionY() {
        const xMin =  Math.floor(this.xMan - this.width/10);

        let totalY = 0;
        let totalPixels = 0;
        for (let i=0; i < this.pixels.length; i++) {
            if (this.pixels[i].x > xMin && this.pixels[i].x <= this.xMax) {
                totalY += this.pixels[i].y
                totalPixels += 1;
            }
        }
        return Math.floor(totalY / totalPixels);
    }

    printLeftPortion(ctx, width, initX, initY, height) {
        const endX = initX + (width/10)
        const newWidth = endX-initX
        this.#printSquare(ctx, initX, initY, newWidth, height, "#0f0")
    }

    printRightPortion(ctx, width, endX, initY, height) {
        const initX = endX - (width/10)
        const newWidth = endX-initX
        this.#printSquare(ctx, initX, initY, newWidth, height, "#0f0")
    }

    printPoint({ ctx, x, y }) {
        ctx.fillStyle="#f00" // Red
        ctx.beginPath();
        ctx.arc(x || this.xMin, y, 10, 0, 2*Math.PI)
        ctx.fill();
    }

    /**
     * Print a square around the object
     * @param {*} ctx canvas context
     * @param {Number} xMin 
     * @param {number} yMin 
     * @param {*} width 
     * @param {*} height 
     */
    #printSquare(ctx, xMin, yMin, width, height, color="#f00") {
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.beginPath();

        ctx.rect(xMin, yMin, width, height)
        ctx.stroke()
    }

}