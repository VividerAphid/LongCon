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
        this.ctx.lineWidth = 1;
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
            g.lineWidth = 4;
            g.translate(scaledX, scaledY);
            //g.rotate(-triangle.direction);
            g.translate(-scaledX, -scaledY);
            g.beginPath();

            g.moveTo(scaledX-(baseWidth*this.scale), scaledY-(height*this.scale));
            g.lineTo(scaledX+(baseWidth*this.scale), scaledY-(height*this.scale));
            g.lineTo(scaledX, scaledY+(height*this.scale));

            g.closePath();
            g.stroke();
        }
        g.restore();
    }
    drawPlanetHighlight(x, y, rad){
        this.ctx.fillStyle = "#fff";
        this.ctx.strokeStyle = "#fff";
        
    }
    drawTargetPointer(x, y, rad){
        this.ctx.fillStyle = "#f00";
        this.ctx.strokeStyle = "#f00";
        this.ctx.lineWidth = 5;
        this.ctx.moveTo(x, y-(rad+15));
        this.ctx.lineTo(x, y+(rad+15));
        this.ctx.moveTo(x-(rad+15), y);
        this.ctx.lineTo(x+(rad+15), y);
        this.ctx.stroke();

        this.ctx.fillStyle = "#999";
        this.ctx.strokeStyle = "#999";
        this.ctx.lineWidth = 3;
    }
    drawPointer(x, y, color){
        let scale = 1;
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x,y); //50,60
        this.ctx.lineTo(x-12.5, y-25); //37.5, 35
        this.ctx.bezierCurveTo(x-(scale*25), y-(scale*55), x+(scale*25), y-(scale*55), x+(scale*12.5), y-(scale*25)); //25, 5, 75, 5, 62.5, 35
        this.ctx.lineTo(x,y); //50,60
        this.ctx.fill();
    }
}