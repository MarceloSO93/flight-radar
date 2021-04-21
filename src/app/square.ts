export class Square {
    public color = '';
    public x = 0;
    public y = 0;
    public velocidade = 1.5;
    public id = 0;

    public raio = 0;
    public angulo = 0;
    public direcao = 0;
    public check = false;
    private arrow = { h: 5, w: 10 };


    constructor(public ctx: CanvasRenderingContext2D, x: number, y: number, id: number, velocidade: number, raio: number, angulo: number, direcao: number) {
        this.x = x
        this.y = y
        this.id = id
        this.velocidade = velocidade
        this.raio = raio
        this.angulo = angulo
        this.direcao = direcao
    }

    transladar(tX: number, tY: number) {
        this.x = this.x + tX;
        this.y = this.y + tY;
        this.draw();
    }


    // x = x * (Sx/100); 
	// y = y * (Sy/100);
    escalonar(sX: number, sY: number){
        this.x = this.x * (sX/100); 
        this.y = this.y * (sY/100);
        this.draw()
    }

    // escalonarOld(sX: number, sY: number){
    //     console.log("Escalonar")
    //     var rad = 0 * Math.PI / 180

    //     this.ctx.beginPath();
    //     this.ctx.lineWidth = 1;
    //     this.ctx.strokeStyle = this.color.length == 0 ? this.getRandomColor() : this.color;
       
    //     var A = this.rotacionarAviao((this.x + 5) * (sX / 100), this.y * (sY / 100), this.x, this.y, this.direcao)
    //     this.ctx.moveTo(A.x, -(A.y));
        
    //     var B = this.rotacionarAviao((this.x - 8) * (sX / 100), (this.y - 4) * (sY / 100), this.x, this.y,this.direcao)
    //     this.ctx.lineTo(B.x, -(B.y));
        
    //     this.ctx.lineTo(this.x * (sX / 100), -(this.y * (sY / 100) ));//Centro do triangulo

    //     var D = this.rotacionarAviao((this.x - 8) * (sX / 100), (this.y + 5) * (sY / 100), this.x, this.y,this.direcao)
    //     this.ctx.lineTo(D.x, -(D.y));

    //     this.ctx.fillStyle = this.color.length == 0 ? this.getRandomColor() : this.color;
    //     this.ctx.stroke();
    //     this.ctx.fill();
    //     this.ctx.closePath();
    // }

    rotacionar(Rx: number, Ry: number, AngR: number) {
        AngR = AngR * (Math.PI / 180)

        var newX = 0
        var newY = 0

        if (Rx == 0 && Ry == 0) {
            newX = this.x * (Math.cos(AngR)) - this.y * (Math.sin(AngR));
            this.y = this.y * (Math.cos(AngR)) + this.x * (Math.sin(AngR));
            this.x = newX
        } else {

            newX = (this.x + (Rx * (-1))) * (Math.cos(AngR)) - (this.y + (Ry * (-1)))* (Math.sin(AngR))
            newY = (this.y + (Ry * (-1)))* (Math.cos(AngR)) + (this.x + (Rx * (-1)))* (Math.sin(AngR))

            this.x = newX - (Rx * (-1))
            this.y = newY - (Ry * (-1))
        }
        this.draw();
    }


    fixo(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.draw();
    }

    rotacionarAviao(x: number, y: number, xCenter: number, yCenter: number, angulo: number) {

        angulo = angulo * (Math.PI / 180)

        var newX = 0
        var newY = 0

        if (xCenter == 0 && yCenter == 0) {
            newX = x * (Math.cos(angulo)) - y * (Math.sin(angulo));
            y = y * (Math.cos(angulo)) + x * (Math.sin(angulo));
            x = newX
        } else {

            newX = (x + (xCenter * (-1))) * (Math.cos(angulo)) - (y + (yCenter * (-1)))* (Math.sin(angulo))
            newY = (y + (yCenter * (-1)))* (Math.cos(angulo)) + (x + (xCenter * (-1)))* (Math.sin(angulo))

            x = newX - (xCenter * (-1))
            y = newY - (yCenter * (-1))
        }

        return {x:x, y:y}
    }

    draw() {
        var rad = 0 * Math.PI / 180

        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = this.color.length == 0 ? this.getRandomColor() : this.color;
       
        // var A = this.rotacionarAviao(this.x, this.y - 5, this.x, this.y, this.direcao)
        var A = this.rotacionarAviao(this.x + 5, this.y, this.x, this.y, this.direcao)
        console.log("x = " + A.x + " , y = " + A.y )
        this.ctx.moveTo(A.x, -(A.y));
        
        // var B = this.rotacionarAviao(this.x - 4, this.y + 8, this.x, this.y,this.direcao)
        var B = this.rotacionarAviao(this.x - 8, this.y - 4, this.x, this.y,this.direcao)
        console.log("x = " + B.x + " , y = " + B.y )
        this.ctx.lineTo(B.x, -(B.y));
        
        this.ctx.lineTo(this.x, -(this.y));//Centro do triangulo

        // var D = this.rotacionarAviao(this.x + 5, this.y + 8, this.x, this.y,this.direcao)
        var D = this.rotacionarAviao(this.x - 8, this.y + 5, this.x, this.y,this.direcao)
        console.log("x = " + D.x + " , y = " + D.y )
        this.ctx.lineTo(D.x, -(D.y));

        this.ctx.fillStyle = this.color.length == 0 ? this.getRandomColor() : this.color;
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        this.color = color
        return color;
    }

    moveRight() {
        this.x = this.x + this.velocidade;
        this.draw();
    }

    moveLeft() {
        this.x = this.x - this.velocidade;
        this.draw();
    }

    moveUp() {
        this.y = this.y - this.velocidade;
        this.draw();
    }

    moveDown() {
        this.y = this.y + this.velocidade;
        this.x = this.x + this.velocidade;
        this.draw();
    }
}
