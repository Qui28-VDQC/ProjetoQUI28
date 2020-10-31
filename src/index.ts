//import {setup, draw} from './Simulator.js'

//THIS IS A HACK!!
//window.setup = setup;
//window.draw = draw;
import { Drawing } from './Drawing'
import { vec2 } from "gl-matrix"

let p: vec2 = [1.0, 2.0];

let draw = new Drawing();

draw.circle(p, 20.0);
