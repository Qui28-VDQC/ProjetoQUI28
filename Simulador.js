/*código que pega todas as classes e funções definidas nos
outros arquivos e de fato executa. Variáveis do começo devem
ser alteradas dependendo do propósito da simulação*/




//lista de partículas "real"
let particles = [];
//lista de partículas a serem adicionadas a particles no fim do frame
let particles_add = [];
let particles_rm = []; // partículas a remover



function setup() {
    createCanvas(600, 600);

    //inicializar partículas
    //átomo X
    let condition;
    for (let i = 0; i < atom_num.X; i++) {
        condition = eval_atom_init_cond(atom_initial_conditions.X, i, particles, X.radius);
        particles.push(atom_X(condition));
    }
    //átomo Y
    for (let i = 0; i < atom_num.Y; i++) {
        condition = eval_atom_init_cond(atom_initial_conditions.Y, i, particles, Y.radius);
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
                        let molec = react_mono_mono(a, b, E_table(molec_name).BOND, E_table(molec_name).ACTV);
                        //há reação, excluir átomos
                        //console.log(molec.E_int);
                        particles_add.push(molec)
                        particles_rm.push(i, j);
                        collided = false;
                    }

                    if (collided) {
                        collide(particles[i], particles[j]);
                    }
                }
                if (a.pos.dist(b.pos) < a.radius + b.radius)
                    static_collide(a, b);
            }
            if ((a instanceof Diatomic) && (b instanceof Diatomic)) {
                //Colisão entre diatômicas
                v = check_collision_di_di(a, b, dt);
                if (v != null) {
                    static_collide_di_di(a, v[0], b, v[1]);
                    collide_di_di(a, v[0], b, v[1]);
                }
                //checa sobreposição
                for (let i_a = 0; i_a < 2; i_a++) {
                    for (let i_b = 0; i_b < 2; i_b++) {
                        if (a.atoms[i_a].pos.dist(b.atoms[i_b].pos) < a.atoms[i_a].radius + b.atoms[i_b].radius)
                            static_collide_di_di(a, i_a, b, i_b);
                    }
                }
            }
            if ((a instanceof Atom) && (b instanceof Diatomic)) {
                let aux = a;
                a = b;
                b = aux;
            }
            if ((a instanceof Diatomic) && (b instanceof Atom)) {
                //v é o índice do átomo que colidiu
                let E0 = b.m*b.velocity.magSq()/2 
                        + a.m_total*a.cm_vel.magSq()/2 
                        + a.I*a.omega.magSq()/2 + a.E_int + a.E_lig;
                let v = check_collision_di_mono(a, b, dt);
                if (v != null) {
                    static_collide_mono_di(a, v, b);
                    //ver se há reação
                    //se são do tipo certo - basta que exista
                    if (reacts[b.name][a.atoms[0].name + a.atoms[1].name].type
                        == a.atoms[v].name && check_energy(b, a, v)) {
                        
                        let new_part = react_mono_di(b, a, v);

                        particles_rm.push(i, j);
                        particles_add.push(new_part.new_atom);
                        particles_add.push(new_part.new_molec);
                    } else
                        collide_di_mono(a, v, b);
                    for (let i_a = 0; i_a < 2; i_a++) {
                        if (b.pos.dist(a.atoms[i_a].pos) < b.radius + a.atoms[i_a].radius)
                            static_collide_mono_di(a, v, b);
                    }
                }
                let Ef = b.m*b.velocity.magSq()/2 
                        + a.m_total*a.cm_vel.magSq()/2 
                        + a.I*a.omega.magSq()/2 + a.E_int + a.E_lig;
                //console.log(Ef-E0);
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

    update_particles();

    let E = 0;
    let new_atoms;
    let a;
    for (let i = 0; i < particles.length; i++) {
        a = particles[i];
        //update da física
        if (!decomposed && Date.now() > DECOMPOSE_TIME) {
            if (a instanceof Diatomic && a.atoms[0].name+a.atoms[1].name == CL2) {
                new_atoms = a.decompose();
                particles_add.push(...new_atoms);
                particles_rm.push(i);
            }
            decomposed = true;
        }
        a.update(dt);
        //desenhar
        a.draw();
        E += a.get_energy();
    }
    //console.log(E);

    //atualizar lista de partículas

    update_particles();
    
}