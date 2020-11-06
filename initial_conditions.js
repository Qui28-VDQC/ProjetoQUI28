const PI = 3.141592653589793;
const CL2 = "ClCl";
const DECOMPOSE_TIME = Date.now() + 5 * 10 ** 3;
const BEGIN_TEMP_INCREASE = Date.now() + 0.01 * 10 ** 3;
const INTERVAL_TEMP_INCREASE = 10 * 2 ** 3;
const TOTAL_DELTA_E = 1000000;
let decomposed = true;
//parâmetros de cada átomo
const H = {
    radius: 100,
    mass: 40,
    //RGB
    color: [100, 100, 100],
    text_color: [255, 255, 255]
}

const Cl = {
    radius: 50,
    mass: 10,
    color: [0, 255, 0],
    text_color: [255, 255, 255]
}

//quantidades de cada partícula
let atom_num = {
    H: 0,
    Cl: 2
}

const atom_H = (cond) => { return new Atom(cond.pos, cond.vel, H.radius, H.mass, "H", H.color, H.text_color) };
const atom_Cl = (cond) => { return new Atom(cond.pos, cond.vel, Cl.radius, Cl.mass, "Cl", Cl.color, Cl.text_color) };

//posicoes iniciais
const atom_initial_conditions = {
    H: {
        pos: Array(atom_num.H).fill("random"),
        vel: Array(atom_num.H).fill(300)
    },
    Cl: {
        pos: Array(atom_num.Cl).fill("random"),
        vel: Array(atom_num.Cl).fill(100)
    }
}

let molecule_num = {
    HH: 1,
    ClCl: 0,
    HCl: 0
}

const energies = (bond, activation) => { return { BOND: bond, ACTV: activation }; };

const E_table = (molec_name) => {
    if (E_table_data[molec_name] == undefined) return false;
    else return E_table_data[molec_name];
}

const E_table_data = {
    HH: energies(300000, 100000),
    ClCl: energies(100000, 50000),
    HCl: energies(400000, 100000),
    //ClH: energies(0, 300000)
}
//construtores de tipos de átomos específicos


const molec_HH = (cond) => {
    return new Diatomic(atom_H(zero_cond()),
        atom_H(zero_cond()), 2 * H.radius, cond.cm_pos, cond.cm_vel, cond.ang, cond.omega, E_table("HH").BOND, 0)
};

const molec_ClCl = (cond) => {
    return new Diatomic(atom_Cl(zero_cond()),
        atom_Cl(zero_cond()), 2 * Cl.radius, cond.cm_pos, cond.cm_vel, cond.ang, cond.omega, E_table("ClCl").BOND, 0)
};

const molec_HCl = (cond) => {
    return new Diatomic(atom_H(zero_cond()),
        atom_Cl(zero_cond()), H.radius + Cl.radius, cond.cm_pos, cond.cm_vel, cond.ang, cond.omega, E_table("HCl").BOND, 0)
};

const reacts = {
    H: {
        HH: false,
        HCl: false,
        ClCl: false
        // {
        //     //função que cria o átomo final
        //     atom_f: atom_Cl,
        //     //função que cria a molécula final
        //     molec_f: molec_HCl,
        //     //tipo do átomo que vai ser liberado (checar)
        //     type: "Cl",
        //     //energia de ativação da reação
        //     ACTV: 100000
        // }
    },
    Cl: {
        HH: 
        {
            //função que cria o átomo final
            atom_f: atom_H,
            //função que cria a molécula final
            molec_f: molec_HCl,
            //tipo do átomo que vai ser liberado (checar)
            type: "H",
            //energia de ativação da reação
            ACTV: 100000
        },
        HCl: false,
        ClCl: false
    }
}



const molec_initial_conditions = {
    HH: {
        all_random: true,
        cm_pos: [],
        cm_vel: 200,
        ang: [],
        omega: PI
    },
    ClCl: {
        all_random: true,
        cm_pos: [],
        cm_vel: 300,
        ang: [],
        omega: PI
    },
    HCl: {
        all_random: true,
        cm_pos: [],
        cm_vel: 100,
        ang: [],
        omega: PI
    }
}