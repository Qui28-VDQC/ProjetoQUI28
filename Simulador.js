/*código que pega todas as classes e funções definidas nos
outros arquivos e de fato executa. Variáveis do começo devem
ser alteradas dependendo do propósito da simulação*/

//construtores de tipos de átomos específicos
const atom_A = (pos, vel) => { return new Atom(pos, vel, 55, 100, "X") };
const atom_B = (pos, vel) => { return new Atom(pos, vel, 15, 10, "Y") };

//quantidades de cada partícula 
let atom_num = {
    X: 5,
    Y: 5
}
let molecule_num = {
    XX: 0,
    YY: 0,
    XY: 0
}


//lista de partículas "real"
let particles = [];
//lista de partículas a serem adicionadas a particles no fim do frame
let particles_add = [];
let particles_rm = []; // partículas a remover




function setup() {
    createCanvas(600, 600);
    //inicializar partículas 
    const vel = 200;
    for (let i = 0; i < atom_num.X; i++) {
        particles.push(atom_A(rand_vec(0, width, 0, height), rand_vec(-vel, vel, -vel, vel)));
    }
    for (let i = 0; i < atom_num.Y; i++) {
        particles.push(atom_B(rand_vec(0, width, 0, height), rand_vec(-vel, vel, -vel, vel)));
    }
}


function draw() {
    background(150);
    dt = min(1, 1 / frameRate());
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let a = particles[i];
            let b = particles[j];
            if (a instanceof Atom && b instanceof Atom) {
                let deltaT = check_collision(a, b);
                //se houver encontro
                if (deltaT > 0 && deltaT < dt) {
                    let collided = true;
                    //se os átomos forem do tipo que reage
                    //esse código depende da ordenação de partículas!!!
                    const molec_name = a.name + b.name;
                    if (E_table(molec_name)
                        && test_reaction(a, b, E_table(molec_name).BOND, E_table(molec_name).ACTV)) {
                        //se tem energia suficiente pra reagir...
                        v = react(a, b, E_table(molec_name).BOND, E_table(molec_name).ACTV);
                        //há reação, excluir átomos
                        particles_add.push(new Diatomic(a, b, a.radius + b.radius,
                            v[0], v[1], v[2], v[3], E_table(molec_name).BOND, v[4]))
                        particles_rm.push(i, j);
                        collided = false;
                    }
                    if (collided)
                        collide(particles[i], particles[j]);
                }
            }

            if ((a instanceof Diatomic) && (b instanceof Diatomic)) {
                //Colisão entre diatômicas
                let v = check_collision_di_di(a, b, dt);
                if (v != null)
                    collide_di_di(a, v[0], b, v[1]);
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
    for (let index of particles_rm.sort((x, y) => { return y - x; })) {
        particles.splice(index, 1);
    }
    //adicionar novas partícular(produtos de reação, por exemplo)
    //adicionar átomos junto de átomos, moléculas junto de moléculas, etc
    particles = particles.concat(particles_add);
    // reset
    particles_add = [];
    particles_rm = [];

    for (let a of particles) {
        //update da física
        a.update(dt);
        //desenhar
        a.draw();
    }

}