import { Component, ViewChild, ElementRef, OnInit, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Square } from './square';


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [
    "../../node_modules/bootstrap/dist/css/bootstrap.min.css",
    './app.component.scss'
  ],
  styles: [
    'canvas { border-style: solid}',
  ]
})

export class AppComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  requestId;
  interval;
  squares: Square[] = []
  logs: String[] = []
  label;

  title = 'Drawable designer'

  constructor(private ngZone: NgZone) { }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.translate(300, 300);
    this.ctx.save()

    this.desenharQuadriculados()
    this.desenharEixos()
    this.desenharDescricoes()

    // this.ngZone.runOutsideAngular(() => this.tick());
    // setInterval(() => {
    //   this.tick();
    // }, 200);
  }

  // translate() {
  //   setInterval(() => {
  //     this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  //     this.squares.forEach((square: Square) => {
  //       square.moveRight();
  //     });
  //     this.requestId = requestAnimationFrame(() => this.translate);
  //   }, 200);
  // }

  translate(form: NgForm) {
    this.limpar()

    this.squares.forEach((square: Square) => {

      if (square.check) {
        square.transladar(form.value.translateX, form.value.translateY);
      } else {
        square.fixo(square.x, square.y);
      }

    });

  }

  escalonar(form: NgForm) {
    this.limpar()

    this.squares.forEach((square: Square) => {

      if (square.check) {
        square.escalonar(form.value.escalonarX, form.value.escalonarY);
      } else {
        square.fixo(square.x, square.y);
      }

    });

  }

  rotacionar(form: NgForm) {
    this.limpar()

    this.squares.forEach((square: Square) => {

      if (square.check) {
        square.rotacionar(form.value.centroRotacaoX, form.value.centroRotacaoY, form.value.anguloRotacao);
      } else {
        square.fixo(square.x, square.y);
      }

    });
  }

  VerifiarDistanciaMinimaAeroporto(form: NgForm) {
    this.logs = []
    this.logs.push("------------------------------------------------Distância mínima-----------------------------------------------------")
    this.squares.forEach((square: Square) => {
      square.raio = Math.sqrt((square.x * square.x) + (square.y * square.y));
      if (square.raio <= form.value.distanciaMinimaAeroporto) {
        this.logs.push("O avião " + square.id + " esta proximo da base")
      }
    });
    this.logs.push("----------------------------------------------------------------------------------------------------------------------------")
  }

  VerifiarDistanciaMinimaAvioes(form: NgForm) {

    this.logs = []
    var arrows1 = []
    var arrows2 = []
    var idsVerificados = []
    var raio

    this.squares.forEach((square: Square) => {
      if (square.check) {
        arrows1.push(square)
      }
    });

    arrows2 = arrows1
    this.logs.push("----------------------------------------------Distância mínima entre eviões--------------------------------------")
    arrows1.forEach((square1: Square) => {

      arrows2.forEach((square2: Square) => {
        if (square1.id != square2.id && !idsVerificados.includes(square1.id)) {

          raio = Math.sqrt(Math.pow((square2.x - square1.x), 2) + Math.pow((square2.y - square1.y), 2))
          if (raio <= form.value.distanciaMinimaAvioes) {
            this.logs.push("O avião " + square1.id + " e o " + square2.id + " estão a menos de " + form.value.distanciaMinimaAvioes + " km um do outro.")
          }

          idsVerificados.push(square2.id)
        }
      });

    });
    this.logs.push("----------------------------------------------------------------------------------------------------------------------------")
  }

  VerifiarRotaColisao(form: NgForm) {

    var arrows = []
    this.logs = []

    this.squares.forEach((square: Square) => {

      if (square.check && arrows.length <= 2) {
        arrows.push(square)
      }

    });

    if (arrows.length != 2) {
      alert("Informe apenas dois aviões")
      return
    }

    var tempoFinal = (arrows[0].raio + arrows[1].raio) / (arrows[0].velocidade + arrows[1].velocidade)

    if (tempoFinal < form.value.tempoMinimoRotaColisao) {
      this.logs.push("------------------------------------------------Rota de colisão-----------------------------------------------------")
      this.logs.push("Aviões " + arrows[0].id + " e " + arrows[1].id + " estão em rota de colisão")
      this.logs.push("----------------------------------------------------------------------------------------------------------------------------")
    }

  }



  play() {
    // const square = new Square(this.ctx, this.translatex, this.translatey);
    // this.squares = this.squares.concat(square);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }

  setValues(form: NgForm) {
    console.log(form.value)
    var polar
    var cartesian
    if(form.value.x != null, form.value.y != null){
      polar = this.cartesianToPolar(form.value.x, form.value.y)
    }
    // if(form.value.raio != null, form.value.angulo != null){
    //   cartesian = this.polarToCartesian(form.value.raio, form.value.angulo)
    // }

    const square = new Square(
      this.ctx,
      form.value.x,
      form.value.y,
      this.squares.length + 1,
      form.value.velocidade,
      form.value.raio || polar.raio,
      form.value.angulo || polar.angulo,
      form.value.direcao
    );


    square.draw();
    this.squares = this.squares.concat(square);

    form.resetForm()
  }

  cartesianToPolar(x: number, y: number) {

    var r = Math.sqrt((x * x) + (y * y));
    var angulo

    if (x == 0 && y > 0) {
      angulo = 90 * Math.PI / 180
    } else if (x == 0 && y < 0) {
      angulo = 127 * Math.PI / 180
    } else if (y == 0 && x > 0) {
      angulo = 0 * Math.PI / 180
    } else if (y == 0 && x < 0) {
      angulo = 180 * Math.PI / 180
    } else {
      angulo = Math.atan(y / x);
    }

    return {raio:r, angulo: angulo}
  }

  polarToCartesian(r: number, angulo: number){

    var x = r*Math.cos(angulo);
    var y = r*Math.sin(angulo);
    
    return {x:x, y:y}
  }

  remover(square: Square) {
    this.limpar()

    this.squares.splice(this.squares.indexOf(square), 1);

    this.squares.forEach((square: Square) => {
      square.fixo(square.x, square.y);
    });
  }

  onChange(model: Object) {
    console.log("objeto", model)
  }

  desenharQuadriculados() {
    // Quadriculados
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#eee";
    for (var x = -300; x < 600; x += 10) {
      this.ctx.moveTo(x, -600);
      this.ctx.lineTo(x, 300);
      this.ctx.stroke();
    }
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.strokeStyle = "#eee";
    for (var y = -300; y < 300; y += 10) {
      this.ctx.moveTo(-600, y);
      this.ctx.lineTo(600, y);
      this.ctx.stroke();
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  desenharEixos() {
    //Eixo X e Y
    this.ctx.beginPath();
    this.ctx.setLineDash([10, 7]);
    this.ctx.strokeStyle = "#C9D6FE";
    this.ctx.lineDashOffset = 1;
    this.ctx.moveTo(-600, 0);
    this.ctx.lineTo(600, 0);
    this.ctx.stroke();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.lineDashOffset = 1;
    this.ctx.moveTo(0, -600);
    this.ctx.lineTo(0, 600);
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.fill();
  }

  desenharDescricoes() {
    this.ctx.beginPath();
    this.ctx.fillStyle = 'red';
    this.ctx.font = "12px Arial";
    this.ctx.fillText("+ x", 275, -10);
    this.ctx.fillText("- y", 10, 295);

    this.ctx.fillText("- x", -295, -10);
    this.ctx.fillText("+ y", 10, -290);
    this.ctx.closePath();
    this.ctx.fill();
  }

  redesenhar() {
    this.desenharQuadriculados()
    this.desenharEixos()
    this.desenharDescricoes()
  }

  limpar() {
    this.ctx.clearRect(-300, -300, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.restore()
    this.ctx.save()
    this.redesenhar()
  }

  drawCartesianPoint(ctx, x, y) {
    ctx.fillRect(x, -(y), 4, 4);
  }

  drawCartesianText(ctx, x, y, text) {
    ctx.fillText(text, x, -(y));
  }


}
