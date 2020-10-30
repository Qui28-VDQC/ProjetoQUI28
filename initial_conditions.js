const PI = 3.141592653589793;
const CL2 = "XX";
const DECOMPOSE_TIME = Date.now() + 5 * 10 ** 3;
const BEGIN_TEMP_INCREASE = Date.now() + 0.01 * 10 ** 3;
const INTERVAL_TEMP_INCREASE = 10 * 2 ** 3;
const TOTAL_DELTA_E = 1000000;
let decomposed = true;
//parâmetros de cada átomo
const X = {
    radius: 100,
    mass: 40
}

const Y = {
    radius: 50,
    mass: 10
}

//quantidades de cada partícula
let atom_num = {
    X: 1,
    Y: 0
}

const atom_X = (cond) => { return new Atom(cond.pos, cond.vel, X.radius, X.mass, "X") };
const atom_Y = (cond) => { return new Atom(cond.pos, cond.vel, Y.radius, Y.mass, "Y") };

//posicoes iniciais
const atom_initial_conditions = {
    X: {
        pos: Array(atom_num.X).fill("random"),
        vel: Array(atom_num.X).fill(300)
    },
    Y: {
        pos: Array(atom_num.Y).fill("random"),
        vel: Array(atom_num.Y).fill(100)
    }
}

let molecule_num = {
    XX: 0,
    YY: 1,
    XY: 0
}

const energies = (bond, activation) => { return { BOND: bond, ACTV: activation }; };

const E_table = (molec_name) => {
    if (E_table_data[molec_name] == undefined) return false;
    else return E_table_data[molec_name];
}

const E_table_data = {
    //XX: energies(300000, 100000),
    // YY: energies(100000, 50000),
    // XY: energies(200000, 100000),
    //YX: energies(0, 300000)
}
//construtores de tipos de átomos específicos


const molec_XX = (cond) => {
    return new Diatomic(atom_X(zero_cond()),
        atom_X(zero_cond()), 2 * X.radius, cond.cm_pos, cond.cm_vel, cond.ang, cond.omega, E_table("XX").BOND, 0)
};

const molec_YY = (cond) => {
    return new Diatomic(atom_Y(zero_cond()),
        atom_Y(zero_cond()), 2 * Y.radius, cond.cm_pos, cond.cm_vel, cond.ang, cond.omega, E_table("YY").BOND, 0)
};

const molec_XY = (cond) => {
    return new Diatomic(atom_X(zero_cond()),
        atom_Y(zero_cond()), X.radius + Y.radius, cond.cm_pos, cond.cm_vel, cond.ang, cond.omega, E_table("XY").BOND, 0)
};

const reacts = {
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



const molec_initial_conditions = {
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