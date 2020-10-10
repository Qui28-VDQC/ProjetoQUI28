function react_mono_di(atom, molec, i) {
    //i é o indice do atomo da molécula que colidiu

    //cálculos preliminares (momentos inciais)
    //momento linear = atom.velocity*atom.m + molec.cm_vel*molec.m_tptal
    let p_atom = p5.Vector.mult(atom.velocity, atom.m);
    let p_molec = p5.Vector.mult(molec.cm_vel, molec.m_total);
    let p_tot = p5.Vector.add(p_atom, p_molec);
    //CM = (atom.pos*atom.m + molec.cm_pos*molec.m_total)/(atom.m+molec.m_total)
    let CM_sys = p5.Vector.add(p5.Vector.mult(atom.pos, atom.m),
        p5.Vector.mult(molec.cm_pos, molec.m_total)).div(atom.m + molec.m_total);
    //momento angular = atom.mass*atom.velocity x r1
    let L_atom = p5.Vector.cross(p_atom, p5.Vector.sub(atom.pos, CM_sys));
    //momento angular = w*I + p x (cm_pos - CM_sys)
    let L_molec = p5.Vector.add(p5.Vector.mult(molec.omega, molec.I),
        p5.Vector.cross(p_molec, p5.Vector.sub(molec.cm_pos, CM_sys)));
    let L_tot = p5.Vector.add(L_atom, L_molec);
    //variação de energia
    //E= E_cinetica
    let E_atom = atom.m * atom.velocity.magSq();
    //E= E_cinetica + E_rotação
    let E_molec = molec.m_total * molec.cm_vel.magSq() + molec.I * molec.omega.magSq();
    //há reação
    //a = atomo, b = molec, n de b pra a
    let n = p5.Vector.sub(atom.pos, molec.atoms[i].pos);
    n.normalize();
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

}