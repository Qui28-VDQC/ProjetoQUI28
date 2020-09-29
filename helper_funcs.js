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

function clone_atom(atom) {
    return new Atom(createVector(atom.pos.x, atom.pos.y), createVector(atom.velocity.x, atom.velocity.y),
        atom.radius, atom.m, "fake");
}

function clone_molec(molec) {
    let atom1 = clone_atom(molec.atoms[0])
    let atom2 = clone_atom(molec.atoms[1]);
    let fake_molec = new Diatomic(atom1, atom2, molec.dist,
        createVector(molec.cm_pos.x, molec.cm_pos.y),
        createVector(molec.cm_vel.x, molec.cm_vel.y), molec.n[0].heading(), createVector(0, 0, molec.omega.z));
    return fake_molec;
}

// function create_atom(particle_list, atom_constructor, vel) {
//     //tenta criar um novo átomo, sem que ele se sobreponha às partículas já existentes
//     let new_atom;
//     let some_collision;
//     do {
//         some_collision = false;
//         new_atom = atom_constructor(rand_vec(0, width, 0, height),
//             rand_vec(-vel, vel, -vel, vel));
//         for (let j = 0; j < particle_list.length; j++) {
//             if (particle_list[j] instanceof Atom) {
//                 //a colisão já ocorreu 
//                 if (check_collision(new_atom, particle_list[j]) <= 0) {
//                     some_collision = true;
//                 }
//             }
//             if (particle_list[j] instanceof Diatomic) {
//                 if (check_collision_di_mono(particle_list[j], new_atom, 0) != null) {
//                     some_collision = true;
//                 }
//             }
//         }
//         console.log(new_atom.pos, some_collision);
//     } while (some_collision)

//     return new_atom;
// }