class artist{
    constructor(ctx){
        this.ctx = ctx;
        this.scale = 1;
    }
    fillRect(x, y, w, h, fill, stroke){
        this.ctx.fillStyle = fill;
        this.ctx.strokeStyle = stroke;
        this.ctx.fillRect(x, y, w, h);
    }
    drawStar(x, y, color, radius){
        //let radius = 10;
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        this.ctx.arc(x, y, (radius*2), 0, 2*Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
    }
    drawText(x, y, text, font, colour){
        this.ctx.fillStyle = colour;
        this.ctx.strokeStyle = colour;
        this.ctx.font = font;
        this.ctx.fillText(text, x, y);
    }
    drawTriangle(triangle){
        let g = this.ctx;
        let baseWidth = 10;
        let height = 14;
        let scaledX = triangle.x * this.scale;
        let scaledY = triangle.y * this.scale;
        g.save();
        // if(triangle.selected){
        //     g.fillStyle = "#fff";
        //     g.lineWidth = this.scale * 3;
        // }
        // else{
            g.fillStyle = triangle.color;
        //}
        g.strokeStyle = triangle.color;
        g.translate(scaledX, scaledY);
        g.rotate(-triangle.direction);
        g.translate(-scaledX, -scaledY);
        g.beginPath();

        g.moveTo(scaledX-(baseWidth*this.scale), scaledY-(height*this.scale));
        g.lineTo(scaledX+(baseWidth*this.scale), scaledY-(height*this.scale));
        g.lineTo(scaledX, scaledY+(height*this.scale));

        g.closePath();
        g.fill();
        g.restore();
    }
}