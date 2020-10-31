//import {setup, draw} from './Simulator.js'

//THIS IS A HACK!!
//window.setup = setup;
//window.draw = draw;
import {join} from 'lodash';

  function component() {
    const element = document.createElement('div');

    element.innerHTML = join(['Hello', 'webpack'], ' ');

    return element;
  }

document.body.appendChild(component());