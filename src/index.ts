//import {setup, draw} from './Simulator.js'

//THIS IS A HACK!!
//window.setup = setup;
//window.draw = draw;
import { vec2 } from "gl-matrix"


class Drawing {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;  

  constructor() {
      let canvas = document.getElementById('MainCanvas') as HTMLCanvasElement;
      let context = canvas.getContext("2d");
      if(context !== null) {
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 1;
  
        this.canvas = canvas;
        this.context = context;
      } else {
        throw "Error: could not get the current 2d context for the canvas.";
      }
  }
  private clearCanvas() {
    this.context
        .clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  /**
   * circle
   * Draws a circle with the given radius
   * at the position given by pos
   */
  public circle(pos: vec2, radius: number):void {
    this.context.beginPath();
    this.context.arc(pos[0], pos[1], radius, 0, 2*Math.PI);
    this.context.stroke();
  }
}

let p: vec2 = [1.0, 2.0];

let draw = new Drawing();

draw.circle(p, 20.0);
