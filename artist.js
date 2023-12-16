class artist{
    constructor(ctx){
        this.ctx = ctx;
        this.scale = 1;
        this.labelFont = "bold 15px Consolas";
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
        g.lineWidth = 1;
        g.strokeStyle = triangle.color;
        g.fillStyle = triangle.color;
        g.translate(scaledX, scaledY);
        g.rotate(-triangle.direction);
        g.translate(-scaledX, -scaledY);
        g.beginPath();

        g.moveTo(scaledX-(baseWidth*this.scale), scaledY-(height*this.scale));
        g.lineTo(scaledX+(baseWidth*this.scale), scaledY-(height*this.scale));
        g.lineTo(scaledX, scaledY+(height*this.scale));

        g.closePath();
        g.fill();

        if(triangle.player.isBot == false){
            //console.log("drawing player");
            g.strokeStyle = "#fff";
            g.lineWidth = 2;
            g.translate(scaledX, scaledY);
            g.rotate(-triangle.direction);
            g.translate(-scaledX, -scaledY);
            g.beginPath();

            g.moveTo(scaledX-(baseWidth*this.scale), scaledY-(height*this.scale));
            g.lineTo(scaledX+(baseWidth*this.scale), scaledY-(height*this.scale));
            g.lineTo(scaledX, scaledY+(height*this.scale));

            g.closePath();
        }
        g.restore();
    }
}