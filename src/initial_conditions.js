"use strict"
import {Atom} from './Atom.js';
import {Diatomic} from './Diatomic.js';
import {zero_cond} from './helper_funcs.js'


export const PI = Math.PI;
export const CL2 = "XX";
export const DECOMPOSE_TIME = Date.now() + 5 * 10 ** 3;
export const BEGIN_TEMP_INCREASE = Date.now() + 0.01 * 10 ** 3;
export const INTERVAL_TEMP_INCREASE = 10 * 2 ** 3;
export const TOTAL_DELTA_E = 1000000;
export let decomposed = true;



//parâmetros de cada átomo
export const X = {
    radius: 100,
    mass: 40
}

export const Y = {
    radius: 50,
    mass: 10
}

//quantidades de cada partícula
export let atom_num = {
    X: 1,
    Y: 0
}

export const atom_X = (cond) => { return new Atom(cond.pos, cond.vel, X.radius, X.mass, "X") };
export const atom_Y = (cond) => { return new Atom(cond.pos, cond.vel, Y.radius, Y.mass, "Y") };

//posicoes iniciais
export const atom_initial_conditions = {
    X: {
        pos: Array(atom_num.X).fill("random"),
        vel: Array(atom_num.X).fill(300)
    },
    Y: {
        pos: Array(atom_num.Y).fill("random"),
        vel: Array(atom_num.Y).fill(100)
    }
}

export let molecule_num = {
    XX: 0,
    YY: 1,
    XY: 0
}

export const energies = (bond, activation) => { return { BOND: bond, ACTV: activation }; };

export const E_table = (molec_name) => {
    if (E_table_data[molec_name] == undefined) return false;
    else return E_table_data[molec_name];
}

export const E_table_data = {
    //XX: energies(300000, 100000),
    // YY: energies(100000, 50000),
    // XY: energies(200000, 100000),
    //YX: energies(0, 300000)
}
//construtores de tipos de átomos específicos


export const molec_XX = (cond) => {
    return new Diatomic(atom_X(zero_cond()),
        atom_X(zero_cond()), 2 * X.radius, cond.cm_pos, cond.cm_vel, cond.ang, cond.omega, E_table("XX").BOND, 0)
};

export const molec_YY = (cond) => {
    return new Diatomic(atom_Y(zero_cond()),
        atom_Y(zero_cond()), 2 * Y.radius, cond.cm_pos, cond.cm_vel, cond.ang, cond.omega, E_table("YY").BOND, 0)
};

export const molec_XY = (cond) => {
    return new Diatomic(atom_X(zero_cond()),
        atom_Y(zero_cond()), X.radius + Y.radius, cond.cm_pos, cond.cm_vel, cond.ang, cond.omega, E_table("XY").BOND, 0)
};

export const reacts = {
    X: {
        XX: false,
        XY: false,
        YY: false
        // {
        //     //função que cria o átomo final
        //     atom_f: atom_Y,
        //     //função que cria a molécula final
        //     molec_f: molec_XY,
        //     //tipo do átomo que vai ser liberado (checar)
        //     type: "Y",
        //     //energia de ativação da reação
        //     ACTV: 100000
        // }
    },
    Y: {
        XX: false,
        XY: false,
        YY: false
    }
}



export const molec_initial_conditions = {
    XX: {
        all_random: true,
        cm_pos: [],
        cm_vel: 200,
        ang: [],
        omega: PI
    },
    YY: {
        all_random: true,
        cm_pos: [],
        cm_vel: 300,
        ang: [],
        omega: PI
    },
    XY: {
        all_random: true,
        cm_pos: [],
        cm_vel: 100,
        ang: [],
        omega: PI
    }
}