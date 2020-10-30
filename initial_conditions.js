const PI = 3.141592653589793;
const color_vel = false;
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
    X: 5,
    Y: 0
}
let molecule_num = {
    XX: 0,
    YY: 1,
    XY: 0
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
        all_random: false,
        cm_pos: [[400, 300]],
        cm_vel: [[0, 0]],
        ang: [PI / 2],
        omega: [PI / 3.5]
    },
    XY: {
        all_random: true,
        cm_pos: [],
        cm_vel: 100,
        ang: [],
        omega: PI
    }
}