"use strict"
import { Atom } from './Atom'
import { Diatomic } from './Diatomic.js'
import { vec2 } from 'gl-matrix'

export const zero_cond = () => {
    return {
        pos: vec2.create(),
        vel: vec2.create()
    };
}

// export function lin_interpol(v1, v2, frac) {
//     //v1 é vetor inicial
//     //v2 é vetor final
//     //frac é % v2
//     if (typeof v1 === "object") {
//         let v = [];
//         for (let i = 0; i < v1.length; i++) {
//             v.push(Math.round((1 - frac) * v1[i] + frac * v2[i]));
//         }
//         return v;
//     }
//     else if (typeof v1 === "number") {
//         return (1 - frac) * v1 + frac * v2;
//     }
// }

// export function rand_pos(dist) {
//     return vec2.fromValues(lin_interpol(0 + dist, width - dist, Math.random()),
//         lin_interpol(0 + dist, height - dist, Math.random()));
// }

// export function rand_vel(max_mag) {
//     return p5.Vector.random2D().mult(max_mag);
// }

// export function eval_atom_init_cond(atom_cond: Condition, i: number, part_list, r) {
//     let cond: Condition = {
//         pos: null,
//         vel: null
//     }
//     if (atom_cond.pos[i] == "random") {
//         vec2.random(cond.pos, r);
//     }

//     else cond.pos = vec2.fromValues(...atom_cond.pos[i]);
//     if (typeof atom_cond.vel[i] == "number")
//         cond.vel = rand_vel(atom_cond.vel[i]);
//     else cond.vel = vec2.fromValues(...atom_cond.vel[i]);
//     return cond;
// }

// export function eval_molec_init_cond(molec_cond, i) {
//     let cond = {
//         cm_pos: null,
//         cm_vel: null,
//         ang: null,
//         omega: null
//     }
//     if (molec_cond.all_random) {
//         cond.cm_vel = rand_vel(molec_cond.cm_vel);
//         cond.ang = 2 * PI * Math.random();
//         cond.cm_pos = rand_pos(50);
//         cond.omega = vec2.fromValues(0, 0, Math.random()).mult(molec_cond.omega);
//     }
//     else {
//         cond.cm_pos = vec2.fromValues(...molec_cond.cm_pos[i]);
//         cond.cm_vel = vec2.fromValues(...molec_cond.cm_vel[i]);
//         cond.ang = molec_cond.ang[i];
//         cond.omega = vec2.fromValues(0, 0, molec_cond.omega[i]);
//     }
//     return cond;
// }

export function project(v: vec2, a: vec2) {
    //projeta v em a
    //<v, a>/||a||^2 * a
    let projection = vec2.create();
    vec2.scale(projection, a, vec2.dot(v,a) / vec2.sqrLen(a));
    return projection;
}

export function Bhaskara(a: number, b: number, c: number) {
    //função que resolve equações de segundo grau
    if (b ** 2 - 4 * a * c < 0)
        return null;
    else
        return [(-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a), (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a)];
}

export function clone_atom(atom: Atom) {
    return new Atom(vec2.fromValues(atom.pos[0], atom.pos[1]), vec2.fromValues(atom.velocity[0], atom.velocity[1]),
        atom.radius, atom.m, atom.name);

}

export function clone_molec(molec: Diatomic) {
    let atom1 = clone_atom(molec.atoms[0])
    let atom2 = clone_atom(molec.atoms[1]);
    let fake_molec = new Diatomic(atom1, atom2, molec.dist,
        vec2.fromValues(molec.cm_pos.x, molec.cm_pos.y),
        vec2.fromValues(molec.cm_vel.x, molec.cm_vel.y), molec.n[0].heading(),
        vec2.fromValues(0, molec.omega), molec.E_lig, molec.E_int); //TODO: Fix this code
        //Currently, we're giving two arguments to fromValues(): 0 and omega. That makes no sense!
    return fake_molec;
}



export function increase_temp(deltaE: number, particle: Atom | Diatomic) {
    //deltaE é variação de energia por chamada da função
    if (particle instanceof Atom) {
        let curr_E = particle.get_energy() + deltaE;
        vec2.normalize(particle.velocity, particle.velocity);
        vec2.scale(particle.velocity, particle.velocity, Math.sqrt(2 * curr_E / particle.m));
    }
    else if (particle instanceof Diatomic) {
        //mantém a razão de energia translacional e rotacional
        let ratio = particle.m_total * particle.cm_vel.magSq() / (particle.I * particle.omega.magSq());
        let kin_E = particle.m_total * particle.cm_vel.magSq() / 2
            + particle.I * particle.omega.magSq() / 2 + deltaE;
        particle.cm_vel.normalize().mult(Math.sqrt(2 * kin_E * (ratio / (1 + ratio)) / particle.m_total));
        particle.omega.normalize().mult(Math.sqrt(2 * kin_E * (1 / (1 + ratio)) / particle.I));
    }

}

export function get_system_energy(part_list: (Atom | Diatomic)[]) {
    let E = 0;
    for (let part of part_list)
        E += part.get_energy();
    return E;
}