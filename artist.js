class artist{
    constructor(ctx){
        this.ctx = ctx;
        this.labelFont = "bold 14px Consolas, monospace";
        this.labelColors = new Map();
        this.cameraOffset = {x: this.ctx.canvas.width/2, y: this.ctx.canvas.height/2};
        this.cameraZoom = 1;
        this.maxZoom = 3;
        this.minZoom = 0.1;
        this.initialPinchDistance = null;
        this.lastZoom = this.cameraZoom;
        this.scrollSensitivity = 0.0005;
        this.isDragging = false;
        this.dragChanged = false;
        this.dragStart = {x: 0, y: 0};
        this.mouseDownStart = {x: 0, y:0};
    }
    fillRect(x, y, w, h, fill, stroke){
        this.ctx.fillStyle = fill;
        this.ctx.strokeStyle = stroke;
        this.ctx.fillRect(x, y, w, h);
    }
    drawStar(x, y, color, radius){
        const ctx = this.ctx;
        const size = radius * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x - size * 0.12, y - size * 0.14, size * 0.68, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255, 255, 255, 0.24)";
        ctx.fill();
    }
    drawText(x, y, text, font, colour){
        const ctx = this.ctx;
        if(!this.labelColors.has(colour)){
            ctx.fillStyle = colour;
            ctx.fillStyle = `color-mix(in srgb, ${colour}, white 28%)`;
            this.labelColors.set(colour, ctx.fillStyle);
        }
        ctx.font = font;
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#08111e";
        ctx.strokeText(text, x, y);
        ctx.fillStyle = this.labelColors.get(colour);
        ctx.fillText(text, x, y);
    }
    drawTriangle(triangle, triangleScale=1){
        const g = this.ctx;
        g.save();
        g.translate(triangle.x * triangleScale, triangle.y * triangleScale);
        g.rotate(-triangle.direction);
        g.scale(triangleScale, triangleScale);
        g.beginPath();
        g.moveTo(0, 14);
        g.lineTo(-9, -11);
        g.lineTo(0, -6);
        g.lineTo(9, -11);
        g.closePath();
        g.fillStyle = triangle.color;
        g.fill();
        if(triangle.player.isBot == false){
            g.strokeStyle = "#fff";
            g.lineWidth = 2;
            g.lineJoin = "round";
            g.stroke();
        }
        g.restore();
    }
    drawPlanetHighlight(x, y, rad){
        this.ctx.fillStyle = "#fff";
        this.ctx.strokeStyle = "#fff";
        
    }
    drawTargetPointer(x, y, rad){
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(x, y, rad * 2 + 5, 0, 2 * Math.PI);
        ctx.strokeStyle = "#08111e";
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.strokeStyle = "#ffd166";
        ctx.lineWidth = 2;
        ctx.stroke();
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
