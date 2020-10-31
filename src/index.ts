//import {setup, draw} from './Simulator.js'

//THIS IS A HACK!!
//window.setup = setup;
//window.draw = draw;
import { Drawing } from './Drawing'
import { vec2 } from "gl-matrix"
import { setup, draw, particles } from './Simulator'

let p: vec2 = [1.0, 2.0];

let ctx = new Drawing();

//draw.circle(p, 20.0);

setup();

console.log(particles);

let start: number | undefined = undefined;

function step(timestamp: number) {
  if (start === undefined)
    start = timestamp;
  const elapsed = timestamp - start;

  draw(ctx);

  if (elapsed < 10000) { // Stop the animation after 10 seconds
    window.requestAnimationFrame(step);
  }
}

window.requestAnimationFrame(step);
