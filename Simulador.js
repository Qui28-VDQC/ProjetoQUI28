/*código que pega todas as classes e funções definidas nos
outros arquivos e de fato executa. Variáveis do começo devem
ser alteradas dependendo do propósito da simulação*/

//construtores de tipos de átomos específicos
const a_c = (pos, vel) => { return new Atom(pos, vel, 20, 100, "a") };
const b_c = (pos, vel) => { return new Atom(pos, vel, 50, 150, "b") };

//tipos de átomo isolado
//vetor de strings
//melhorar tipos de átomos: herança?
let atom_types = ["a", "b"];

//tipos de molécula
//pares de átomos
let molec_types = [["a", "a"], ["b", "b"], ["a", "b"]];

//energia de ligação e ativação de cada tipo de molécula
let molec_ligs = [0, 0, 500000];
let molec_ativacoes = [0, 0, 300000];

//colchetes apenas ilustrativos por enquanto
//depois tirar e preencher no setup

//quantidades
let atom_num = [5, 5];
let molec_num = [0, 0, 0];

//lista dos átomos
//array 2d com as instâncias de cada tipo, em ordem
//dimensões (número de tipos) x max(número de átomos)
//posições não ocupadas devem estar no fim e serem null
let atoms = [[], []];
atoms[0] = Array(atom_num[0]).fill(null);
atoms[1] = Array(atom_num[1]).fill(null);
let molecules = [[], [], []];

function flatten(list) {
    let v = [];
    //funciona pra 2D
    for (el of list) {
        v = v.concat(el);
    }
    return v;
}
function enumerate(arr) { //arr é uma mtriz 2D
    let v = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++)
            v.push([arr[i][j], j]);
    }
    return v;
}
function lin_interpol(v1, v2, frac) {
    //v1 é vetor inicial
    //v2 é vetor final
    //frac é % v2
    if (typeof v1 === "object") {
        let v = [];
        for (let i = 0; i < v1.length; i++) {
            v.push(Math.round((1 - frac) * v1[i] + frac * v2[i]));
        }
        return v;
    }
    else if (typeof v1 === "number") {
        return (1 - frac) * v1 + frac * v2;
    }
}

function rand_vec(x_min, x_max, y_min, y_max) {
    return createVector(lin_interpol(x_min, x_max, Math.random()),
        lin_interpol(y_min, y_max, Math.random()));
}
function setup() {
    createCanvas(600, 600);

    for (let i = 0; i < atom_num[0]; i++) {
        atoms[0][i] = (a_c(rand_vec(0, width, 0, height), rand_vec(-75, 75, -75, 75)));
    }
    for (let i = 0; i < atom_num[0]; i++) {
        atoms[1][i] = (b_c(rand_vec(0, width, 0, height), rand_vec(-75, 75, -75, 75)));
    }

    let mi = atoms[0][0].m * atoms[1][0].m / (atoms[0][0].m + atoms[1][0].m);
    console.log(mi * atoms[0][0].velocity.magSq() / 2);
}


function draw() {
    background(150);
    dt = min(1, 1 / frameRate());
    //às vezes a função não colide elasticamente dois atomos do tipo b
    for (a_list of enumerate(atoms)) {
        if (a_list[0] == null) {
            continue;
        }
        a = a_list[0];
        i_a = a_list[1];
        for (b_list of enumerate(atoms)) {
            if (b_list[0] == null) {
                continue;
            }
            b = b_list[0];
            i_b = b_list[1];
            if (a != b) {
                let deltaT = check_collision(a, b);
                if (deltaT > 0 && deltaT < dt) {
                    //adicionar reação aqui
                    v = react(a, b, molec_ligs[2], molec_ativacoes[2]);
                    if (v != null) {
                        if (a.name == "a" && b.name == "b") {
                            molecules[2].push(new Diatomic(a, b, a.radius + b.radius, v[0], v[1],
                                v[2], v[3], molec_ligs[2], v[4]));
                            if (atom_types[0] == a.name) {
                                atoms[0][i_a] = null;
                                atoms[1][i_b] = null;

                            }
                            else {
                                atoms[0][i_b] = null;
                                atoms[1][i_a] = null;
                            }
                        }



                    }
                    else
                        collide(a, b);
                }

            }
        }
    }
    //desenha
    for (a of flatten(molecules)) {
        a.update(dt);
        a.draw();
    }
    for (a of flatten(atoms)) {
        if (a == null) {
            continue;
        }
        a.update(dt);
        a.draw();
    }


}