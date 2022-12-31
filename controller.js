export class Controller {
    pixels = [];
    constructor(x, y) {
        this.addPixel(x,y)
        this.xMin = x;
        this.xMax = x
        this.yMin = y
        this.yMax = y
    }

    isClose(x, y) {
        let shortDistance = -1
        for (let i = 0; i < this.pixels.length; i++) {
            const distance = this.#distance(this.pixels[i], {x,y});
            if(shortDistance == -1 || distance < shortDistance) {
                shortDistance = distance
            }
        }
         
        return shortDistance < 50;
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
        ctx.strokeStyle = "#f00";
        ctx.lineWidth = 4;
        ctx.beginPath();
        const height = this.yMax - this.yMin;
        const width = this.xMax - this.xMin;

        ctx.rect(this.xMin, this.yMin, width, height)
        ctx.stroke()
    }

}