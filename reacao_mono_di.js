function react_mono_di(atom, molec, i) {
    //faz a colisão ineslástica entre o átomo e a molécula,
    //sem criar o novo átomo e a nova molécula, nem incluir o deltaH
    //i é o indice do atomo da molécula que colidiu

    //variação de energia
    //E= E_cinetica
    let E_atom = atom.m * atom.velocity.magSq();
    //E= E_cinetica + E_rotação
    let E_molec = molec.m_total * molec.cm_vel.magSq() + molec.I * molec.omega.magSq();
    let n = p5.Vector.sub(atom.pos, molec.atoms[i].pos);
    n.normalize();
    //há reação
    let new_molec_cond = inellastic_collision(atom, molec, i, n);
    let new_particles = create_new(atom, molec, i, new_molec_cond);
    //"colisão" superelástica p incluir o deltaH - age sobre as novas partículas
}

function inellastic_collision(atom, molec, i, n) {
    //antes de reagir, as partículas colidem inelasticamente
    //a = atomo, b = molec, n de b pra a
    //posição relativa do pto de colisão em rel ao CM da molec
    //molec.n + n*raio do átomo colidido
    let collided_point_pos = p5.Vector.add(molec.n[i], p5.Vector.mult(n, molec.atoms[i].radius));
    //velocidade do ponto de colisão da molécula
    //v_cm + w x r
    let collided_point_vel = p5.Vector.add(molec.cm_vel, p5.Vector.cross(molec.omega, collided_point_pos));
    let v_rel = p5.Vector.sub(atom.velocity, collided_point_vel);
    //e = 0
    let j = -v_rel.dot(n) / (1 / atom.m + 1 / molec.m_total + collided_point_pos.cross(n).magSq() / molec.I);
    atom.velocity.add(p5.Vector.mult(n, j / atom.m));
    molec.cm_vel.sub(p5.Vector.mult(n, j / molec.m_total));
    molec.omega.sub(collided_point_pos.cross(n).mult(j / molec.I));

    //CM_new_molec é o centro de massa entre o atomo isolado colidindo e o atomo i da molecula
    let CM_new_molec = p5.Vector.add(p5.Vector.mult(molec.atoms[i].pos, molec.atoms[i].m),
        p5.Vector.mult(atom.pos, atom.m)).div(
            molec.atoms[i].m + atom.m);
    //velocidade do centro de massa entre o atomo isolado colidindo e o atomo i da molecula
    let new_vel = p5.Vector.add(p5.Vector.mult(molec.atoms[i].velocity, molec.atoms[i].m),
        p5.Vector.mult(atom.velocity, atom.m)).div(
            molec.atoms[i].m + atom.m);
    let new_ang = (molec.atoms[i].name == "X") ? p5.Vector.sub(molec.atoms[i].pos,
        atom.pos).heading() : p5.Vector.sub(atom.pos,
            molec.atoms[i].pos).heading();
    //em relação ao CM: w = r x v /|r|^2
    let new_omega = p5.Vector.cross(p5.Vector.sub(atom.pos, CM_new_molec),
        p5.Vector.sub(atom.velocity, new_vel)).div(
            p5.Vector.sub(atom.pos, CM_new_molec).magSq());
    return {
        cm_pos: CM_new_molec,
        cm_vel: new_vel,
        ang: new_ang,
        omega: new_omega
    }
}

function create_new(atom, molec, i, new_cond) {
    //atom e molec colidiram inelasticamente
    //a funcao remove o atomo e molecula que reagiram e cria um novo atomo e molécula
    molec.atom_centers();
    molec.atom_vels();
    return {
        new_atom: molec.atoms[1 - i],
        new_molec: reacts[b.name][a.atoms[0].name
            + a.atoms[1].name].molec_f(new_cond)
    }
}

function deltaH(atom, molec, i) {
    let collided_point_vel = p5.Vector.add(molec.cm_vel, p5.Vector.cross(molec.omega, collided_point_pos));
    let v_rel = p5.Vector.sub(atom.velocity, collided_point_vel);
    let collided_point_pos = p5.Vector.add(molec.n[i], p5.Vector.mult(n, molec.atoms[i].radius));
    //j = (1+e) jlinha, fazer bhaskara p achar e
    let jlinha = - v_rel.dot(n) / ((1 / atom.m) + (1 / molec.m_total) +
        (p5.Vector.cross(collided_point_pos, n).magSq() / molec.I));
}