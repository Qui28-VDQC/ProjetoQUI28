"use strict";
/*código que pega todas as classes e funções definidas nos
outros arquivos e de fato executa. Variáveis do começo devem
ser alteradas dependendo do propósito da simulação*/
//const PI = Math.PI;
const CL2 = "XX";
const DECOMPOSE_TIME = Date.now() + 5 * 10 ** 3;
const BEGIN_TEMP_INCREASE = Date.now() + 0.01 * 10 ** 3;
const INTERVAL_TEMP_INCREASE = 10 * 2 ** 3;
const TOTAL_DELTA_E = 1000000;
let decomposed = true;

//import './Diatomic.js'
import * as inc from './initial_conditions.js';
import { Atom, check_collision, 
    collide, static_collide_mono_mono } from './Atom.js';
import {
    Diatomic, check_collision_di_di, check_collision_di_mono, 
    static_collide_di_di, static_collide_mono_di,
    collide_di_di, collide_di_mono
} from './Diatomic.js';

import * as hpf from './helper_funcs.js';
//import p5 from 'p5';

let E0: number;

//lista de partículas "real"
let particles: (Atom | Diatomic)[] = [];
//lista de partículas a serem adicionadas a particles no fim do frame
let particles_add: (Atom | Diatomic)[] = [];
let particles_rm: number[] = []; // partículas a remover
let dt = 0.0;


function setup() {
    //createCanvas(600, 600);

    //inicializar partículas
    //átomo X
    let condition;
    for (let i = 0; i < inc.atom_num.X; i++) {
        condition = hpf.eval_atom_init_cond(inc.atom_initial_conditions.X, i, particles, inc.X.radius);
        particles.push(inc.atom_X(condition));
    }
    //átomo Y
    for (let i = 0; i < inc.atom_num.Y; i++) {
        condition = hpf.eval_atom_init_cond(inc.atom_initial_conditions.Y, i, particles, inc.Y.radius);
        particles.push(inc.atom_Y(condition));
    }
    //molécula XX
    for (let i = 0; i < inc.molecule_num.XX; i++) {
        condition = hpf.eval_molec_init_cond(inc.molec_initial_conditions.XX, i);
        particles.push(inc.molec_XX(condition));
    }
    //molécula YY
    for (let i = 0; i < inc.molecule_num.YY; i++) {
        condition = hpf.eval_molec_init_cond(inc.molec_initial_conditions.YY, i);
        particles.push(inc.molec_YY(condition));
    }
    //molécula XY
    for (let i = 0; i < inc.molecule_num.XY; i++) {
        condition = hpf.eval_molec_init_cond(inc.molec_initial_conditions.XY, i);
        particles.push(inc.molec_XY(condition));
    }



    E0 = hpf.get_system_energy(particles);
}

let lastLoop: number = 0.0;
let thisLoop: number = 0.1;

function draw() {
    thisLoop = Date.now();
    dt = thisLoop - lastLoop;
    lastLoop = thisLoop;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let a = particles[i];
            let b = particles[j];
            if (a instanceof Atom && b instanceof Atom) {
                if (a.pos.dist(b.pos) < a.radius + b.radius)
                    static_collide_mono_mono(a, b);

                let deltaT = check_collision(a, b);
                //se houver encontro
                if (deltaT > 0 && deltaT < dt) {
                    let collided = true;
                    //se os átomos forem do tipo que reage
                    //esse código depende da ordenação de partículas!!!
                    const molec_name = a.name + b.name;
                    if (inc.E_table(molec_name)
                        && test_mono_mono(a, b, inc.E_table(molec_name).BOND, inc.E_table(molec_name).ACTV)) {
                        //se tem energia suficiente pra reagir...
                        let molec = react_mono_mono(a, b, inc.E_table(molec_name).BOND, inc.E_table(molec_name).ACTV);
                        //há reação, excluir átomos
                        //console.log(molec.E_int);
                        particles_add.push(molec)
                        particles_rm.push(i, j);
                        collided = false;
                    }

                    if (collided) {
                        collide(particles[i], particles[j]);
                    }
                }
                if (a.pos.dist(b.pos) < a.radius + b.radius)
                    static_collide_mono_mono(a, b);
            }
            if ((a instanceof Diatomic) && (b instanceof Diatomic)) {
                //Colisão entre diatômicas
                v = check_collision_di_di(a, b, dt);
                if (v != null) {
                    static_collide_di_di(a, v[0], b, v[1]);
                    collide_di_di(a, v[0], b, v[1]);
                }
                //checa sobreposição
                for (let i_a = 0; i_a < 2; i_a++) {
                    for (let i_b = 0; i_b < 2; i_b++) {
                        if (a.atoms[i_a].pos.dist(b.atoms[i_b].pos) < a.atoms[i_a].radius + b.atoms[i_b].radius)
                            static_collide_di_di(a, i_a, b, i_b);
                    }
                }
            }
            if ((a instanceof Atom) && (b instanceof Diatomic)) {
                let aux = a;
                a = b;
                b = aux;
            }
            if ((a instanceof Diatomic) && (b instanceof Atom)) {
                //v é o índice do átomo que colidiu
                let v = check_collision_di_mono(a, b, dt);
                if (v != null) {
                    static_collide_mono_di(a, v, b);
                    //ver se há reação
                    //se são do tipo certo - basta que exista
                    if (inc.reacts[b.name][a.atoms[0].name + a.atoms[1].name].type
                        == a.atoms[v].name && check_energy(b, a, v)) {

                        let new_part = react_mono_di(b, a, v);

                        particles_rm.push(i, j);
                        particles_add.push(new_part.new_atom);
                        particles_add.push(new_part.new_molec);
                    } else
                        collide_di_mono(a, v, b);
                    for (let i_a = 0; i_a < 2; i_a++) {
                        if (b.pos.dist(a.atoms[i_a].pos) < b.radius + a.atoms[i_a].radius)
                            static_collide_mono_di(a, v, b);
                    }
                }
            }
            if ((a instanceof Atom) && (b instanceof Diatomic)) {
                let aux = a;
                a = b;
                b = aux;
            }
            if ((a instanceof Diatomic) && (b instanceof Atom)) {
                let v = check_collision_di_mono(a, b, dt);
                if (v != null) {
                    collide_di_mono(a, v, b);
                }
            }
        }
    }
    //atualizar lista de partículas

    update_particles();

    let new_atoms;
    let a;
    for (let i = 0; i < particles.length; i++) {
        a = particles[i];
        //update da física
        //faz a decomposição, se precisar
        if (!decomposed && Date.now() > DECOMPOSE_TIME) {
            if (a instanceof Diatomic && a.atoms[0].name + a.atoms[1].name == CL2) {
                new_atoms = a.decompose();
                particles_add.push(...new_atoms);
                particles_rm.push(i);
            }
            decomposed = true;
        }
        //faz o aumento de temperatura
        if (Date.now() > BEGIN_TEMP_INCREASE
            && hpf.get_system_energy(particles) - E0 < TOTAL_DELTA_E) {
            hpf.increase_temp(TOTAL_DELTA_E / INTERVAL_TEMP_INCREASE, a);
        }
        a.update(dt);
        //desenhar
        a.draw();
    }
    //console.log(E);

    //atualizar lista de partículas

    update_particles();

}

function update_particles() {
    for (let index of particles_rm.sort((x, y) => { return y - x; })) {
        particles.splice(index, 1);
    }
    //adicionar novas partícular(produtos de reação, por exemplo)
    particles = particles.concat(particles_add);
    // reset
    particles_add = [];
    particles_rm = [];
}

//THIS IS A HACK!!
window.setup = setup;
window.draw = draw;