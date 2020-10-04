const PI = 3.141592653589793;
//parâmetros de cada átomo
const X = {
    radius: 20,
    mass: 100
}

const Y = {
    radius: 30,
    mass: 10
}

//quantidades de cada partícula
let atom_num = {
    X: 1,
    Y: 1
}
let molecule_num = {
    XX: 1,
    YY: 1,
    XY: 1
}

//posicoes iniciais
const atom_initial_conditions = {
    X: {
        pos: Array(atom_num.X).fill("random"),
        vel: Array(atom_num.X).fill(100)
    },
    Y: {
        pos: Array(atom_num.Y).fill("random"),
        vel: Array(atom_num.Y).fill(100)
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
        cm_vel: 200,
        ang: [],
        omega: PI
    },
    XY: {
        all_random: true,
        cm_pos: [],
        cm_vel: 200,
        ang: [],
        omega: PI
    }
}