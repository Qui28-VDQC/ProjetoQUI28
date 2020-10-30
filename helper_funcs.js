const zero_cond = () => {
    return {
        pos: createVector(0, 0),
        vel: createVector(0, 0)
    };
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

function rand_pos(dist) {
    return createVector(lin_interpol(0 + dist, width - dist, Math.random()),
        lin_interpol(0 + dist, height - dist, Math.random()));
}

function rand_vel(max_mag) {
    return p5.Vector.random2D().mult(max_mag);
}

function eval_atom_init_cond(atom_cond, i, part_list, r) {
    let cond = {
        pos: null,
        vel: null
    }
    if (atom_cond.pos[i] == "random") {
        cond.pos = rand_pos(r);
    }

    else cond.pos = createVector(...atom_cond.pos[i]);
    if (typeof atom_cond.vel[i] == "number")
        cond.vel = rand_vel(atom_cond.vel[i]);
    else cond.vel = createVector(...atom_cond.vel[i]);
    return cond;
}

function eval_molec_init_cond(molec_cond, i) {
    let cond = {
        cm_pos: null,
        cm_vel: null,
        ang: null,
        omega: null
    }
    if (molec_cond.all_random) {
        cond.cm_vel = rand_vel(molec_cond.cm_vel);
        cond.ang = 2 * PI * Math.random();
        cond.cm_pos = rand_pos(50);
        cond.omega = createVector(0, 0, Math.random()).mult(molec_cond.omega);
    }
    else {
        cond.cm_pos = createVector(...molec_cond.cm_pos[i]);
        cond.cm_vel = createVector(...molec_cond.cm_vel[i]);
        cond.ang = molec_cond.ang[i];
        cond.omega = createVector(0, 0, molec_cond.omega[i]);
    }
    return cond;
}

function project(v, a) {
    //projeta v em a
    //<v, a>/||a||^2 * a
    return p5.Vector.mult(a, v.dot(a) / (a.magSq()));
}

function Bhaskara(a, b, c) {
    //função que resolve equações de segundo grau
    if (b ** 2 - 4 * a * c < 0)
        return null;
    else
        return [(-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a), (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a)];
}

function clone_atom(atom) {
    return new Atom(createVector(atom.pos.x, atom.pos.y), createVector(atom.velocity.x, atom.velocity.y),
        atom.radius, atom.m, atom.name);

}

function clone_molec(molec) {
    let atom1 = clone_atom(molec.atoms[0])
    let atom2 = clone_atom(molec.atoms[1]);
    let fake_molec = new Diatomic(atom1, atom2, molec.dist,
        createVector(molec.cm_pos.x, molec.cm_pos.y),
        createVector(molec.cm_vel.x, molec.cm_vel.y), molec.n[0].heading(),
        createVector(0, 0, molec.omega.z), molec.E_lig, molec.E_int);
    return fake_molec;
}

function update_particles() {
    for (let index of particles_rm.sort((x, y) => { return y - x; })) {
        particles.splice(index, 1);
    }
    //adicionar novas partícular(produtos de reação, por exemplo)
    particles = particles.concat(particles_add);
    // reset
    particles_add = [];
    particles_rm = [];
}

function increase_temp(deltaE, particle) {
    //deltaE é variação de energia por chamada da função
    if (particle instanceof Atom) {
        let curr_E = particle.get_energy() + deltaE;
        particle.velocity.normalize().mult(Math.sqrt(2 * curr_E / particle.m));
    }
    else if (particle instanceof Diatomic) {
        //mantém a razão de energia translacional e rotacional
        let ratio = particle.m_total * particle.cm_vel.magSq() / (particle.I * particle.omega.magSq());
        let kin_E = particle.m_total * particle.cm_vel.magSq() / 2
            + particle.I * particle.omega.magSq() / 2 + deltaE;
        particle.cm_vel.normalize().mult(Math.sqrt(2 * kin_E * (ratio / (1 + ratio)) / particle.m_total));
        particle.omega.normalize().mult(Math.sqrt(2 * kin_E * (1 / (1 + ratio)) / particle.I));
    }

}

function get_system_energy(part_list) {
    let E = 0;
    for (let part of part_list)
        E += part.get_energy();
    return E;
}