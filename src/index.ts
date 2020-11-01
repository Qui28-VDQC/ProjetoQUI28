//import {setup, draw} from './Simulator.js'

//THIS IS A HACK!!
//window.setup = setup;
//window.draw = draw;
import { Drawing } from './Drawing';
import { vec2 } from "gl-matrix";
import { setup, draw, update_simulation } from './Simulator';

let p: vec2 = [1.0, 2.0];

let ctx = new Drawing();

//draw.circle(p, 20.0);

setup();


let start: number | undefined = undefined;
let prev_elapsed = 0.0;

function step(timestamp: number) {
  if (start === undefined)
    start = timestamp;
  const elapsed = timestamp - start;
  const dt = 0.001*(elapsed - prev_elapsed);
  prev_elapsed = elapsed;
  
  ctx.clearCanvas();
  draw(ctx);
  update_simulation(dt);

  if (elapsed < 10000) { // Stop the animation after 10 seconds
    window.requestAnimationFrame(step);
  }
}

window.requestAnimationFrame(step);
