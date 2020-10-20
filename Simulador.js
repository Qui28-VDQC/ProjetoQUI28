/*código que pega todas as classes e funções definidas nos
outros arquivos e de fato executa. Variáveis do começo devem
ser alteradas dependendo do propósito da simulação*/

//construtores de tipos de átomos específicos
const atom_X = (cond) => { return new Atom(cond.pos, cond.vel, X.radius, X.mass, "X") };
const atom_Y = (cond) => { return new Atom(cond.pos, cond.vel, Y.radius, Y.mass, "Y") };

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

const cold = [0, 0, 255];
const hot = [255, 0, 0];


//lista de partículas "real"
let particles = [];
//lista de partículas a serem adicionadas a particles no fim do frame
let particles_add = [];
let particles_rm = []; // partículas a remover

const reacts = {
    X: {
        XX: false,
        XY: false,
        YY: false
    },
    Y: {
        XX: false,
        XY: {
            atom_f: atom_X,
            molec_f: molec_YY,
            type: "Y"
        },
        YY: false
    }
}


function setup() {
    createCanvas(600, 600);
    //inicializar partículas
    //átomo X
    let condition;
    for (let i = 0; i < atom_num.X; i++) {
        condition = eval_atom_init_cond(atom_initial_conditions.X, i);
        particles.push(atom_X(condition));
    }
    //átomo Y
    for (let i = 0; i < atom_num.Y; i++) {
        condition = eval_atom_init_cond(atom_initial_conditions.Y, i);
        particles.push(atom_Y(condition));
    }
    //molécula XX
    for (let i = 0; i < molecule_num.XX; i++) {
        condition = eval_molec_init_cond(molec_initial_conditions.XX, i);
        particles.push(molec_XX(condition));
    }
    //molécula YY
    for (let i = 0; i < molecule_num.YY; i++) {
        condition = eval_molec_init_cond(molec_initial_conditions.YY, i);
        particles.push(molec_YY(condition));
    }
    //molécula XY
    for (let i = 0; i < molecule_num.XY; i++) {
        condition = eval_molec_init_cond(molec_initial_conditions.XY, i);
        particles.push(molec_XY(condition));
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
                if (a.pos.dist(b.pos) < a.radius + b.radius)
                    static_collide_mono_mono(a, b);
                let deltaT = check_collision(a, b);
                //se houver encontro
                if (deltaT > 0 && deltaT < dt) {
                    let collided = true;
                    //se os átomos forem do tipo que reage
                    //esse código depende da ordenação de partículas!!!
                    const molec_name = a.name + b.name;
                    if (E_table(molec_name)
                        && test_mono_mono(a, b, E_table(molec_name).BOND, E_table(molec_name).ACTV)) {
                        //se tem energia suficiente pra reagir...
                        v = react_mono_mono(a, b, E_table(molec_name).BOND, E_table(molec_name).ACTV);
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
                v = check_collision_di_di(a, b, dt);
                if (v != null) {
                    static_collide_di_di(a, v[0], b, v[1]);
                    collide_di_di(a, v[0], b, v[1]);
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
                    if (reacts[b.name][a.atoms[0].name + a.atoms[1].name].type
                        == a.atoms[v].name) {
                        let new_cond = react_mono_di(b, a, v);
                        //remove o átomo e a molécula da lista de partículas
                        particles_rm.push(i, j);
                        //criar o átomo livre - índice 1 - i

                        particles_add.push(a.atoms[1 - v]);
                        //criar a nova molécula
                        particles_add.push(reacts[b.name][a.atoms[0].name
                            + a.atoms[1].name].molec_f(new_cond));
                    } else
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
    particles = particles.concat(particles_add);
    // reset
    particles_add = [];
    particles_rm = [];
    if (color_vel) {
        let vels = [];
        for (let p of particles) {
            vels.push((p instanceof Diatomic) ? p.cm_vel.mag() : p.velocity.mag());
        }
        let min_vel = Math.min(...vels);
        let max_vel = Math.max(...vels);
        let color;
        for (let a of particles) {
            //update da física
            a.update(dt);
            //desenhar

            if (a instanceof Atom) {
                color = lin_interpol(cold, hot, (a.velocity.mag() - min_vel) / (max_vel - min_vel));
                a.draw(color);
            } else a.draw();
        }
    } else {
        for (let a of particles) {
            //update da física
            a.update(dt);
            //desenhar
            a.draw();
        }
    }
}