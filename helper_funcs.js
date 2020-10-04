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

function rand_pos() {
    return createVector(lin_interpol(0, width, Math.random()),
        lin_interpol(0, height, Math.random()));
}

function rand_vel(max_mag) {
    return p5.Vector.random2D().mult(max_mag);
}

function eval_atom_init_cond(atom_cond, i) {
    let cond = {
        pos: null,
        vel: null
    }
    if (atom_cond.pos[i] == "random")
        cond.pos = rand_pos();
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
        cond.cm_pos = rand_pos();
        cond.cm_vel = rand_vel(molec_cond.cm_vel);
        cond.ang = 2 * PI * Math.random();
        cond.omega = createVector(0, 0, Math.random()).mult(molec_cond.omega);
    }
    else {
        cond.cm_pos = createVector(...molec_cond.cm_pos[i]);
        cond.cm_vel = createVector(...molec_cond.cm_vel[i]);
        cond.ang = molec_cond.ang;
        cond.omega = createVector(0, 0, molec_cond.omega);
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
        return [(-b + Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a), (-b - Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a)];
}