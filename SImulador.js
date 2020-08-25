/*código que pega todas as classes e funções definidas nos
outros arquivos e de fato executa. Variáveis do começo devem
ser alteradas dependendo do propósito da simulação*/

//tipos de átomo isolado
//vetor de strings
//melhorar tipos de átomos: herança?
let atom_types = ["a", "b"];

//tipos de molécula
//pares de átomos
let molec_types = [["a", "a"], ["b", "b"], ["a", "b"]]

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
let molecules = [[], [], []];

function flatten(list) {
    let v = [];
    //funciona pra 2D
    for (el of list) {
        v = v.concat(el);
    }
    return v;
}

function setup() {
    createCanvas(600, 600);
    //cuidado!! atom_types e atom_num tem que ter mesmo compriemnto
    for (let i = 0; i < atom_types.length; i++) {
        for (let j = 0; j < atom_num[i]; j++) {
            //assumindo tela quadrada só por simplicidade
            atoms[i].push(new Atom(p5.Vector.random2D().mult(width),
                p5.Vector.random2D().mult(50),
                (atom_types[i] == "a") ? 10 : 30,
                (atom_types[i] == "a") ? 50 : 500,
                atom_types[i]
            ));
        }
    }

}

function draw() {
    background(150);
    dt = min(1, 1 / frameRate());
    for (a of flatten(atoms)) {
        for (b of flatten(atoms)) {
            if (a != b) {
                let deltaT = check_collision(a, b);
                if (deltaT > 0 && deltaT < dt) {
                    //adicionar reação aqui
                    collide(a, b);
                }
            }
        }
    }
    //desenha
    for (a of flatten(atoms)) {
        a.update(dt);
        a.draw();
    }
}