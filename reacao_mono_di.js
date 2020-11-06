function react_mono_di(atom, molec, i) {
    //faz a colisão ineslástica entre o átomo e a molécula,
    //sem criar o novo átomo e a nova molécula, nem incluir o deltaH
    //i é o indice do atomo da molécula que colidiu
    console.log(atom.get_energy() + molec.get_energy());
    let n = p5.Vector.sub(atom.pos, molec.atoms[i].pos);
    n.normalize();
    //há reação
    //INCLUIR VARIAÇÃO DE ENERGIA DA COLISÃO INELÁSTICA - E_int
    let new_molec_cond = inellastic_collision(atom, molec, i, n);
    console.log(atom.get_energy() + molec.get_energy());
    let new_particles = create_new(atom, molec, i, new_molec_cond);
    console.log(new_particles.new_atom.get_energy() +new_particles.new_molec.get_energy());
    //"colisão" superelástica p incluir o deltaH - age sobre as novas partículas
    deltaH(new_particles.new_atom, new_particles.new_molec, i, n, molec);
    console.log(new_particles.new_atom.get_energy() +new_particles.new_molec.get_energy());
    return new_particles;
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

    let E0 = atom.get_energy() + molec.get_energy();

    molec.cm_vel.sub(p5.Vector.mult(n, j / molec.m_total));
    molec.omega.sub(collided_point_pos.cross(n).mult(j / molec.I));

    let Ef = atom.get_energy() + molec.get_energy();

    //deltaE = Ef - E0 < 0
    molec.E_int += E0 - Ef;

    //CM_new_molec é o centro de massa entre o atomo isolado colidindo e o atomo i da molecula
    let CM_new_molec = p5.Vector.add(p5.Vector.mult(molec.atoms[i].pos, molec.atoms[i].m),
                                     p5.Vector.mult(atom.pos, atom.m)).div(molec.atoms[i].m + atom.m);
    //velocidade do centro de massa entre o atomo isolado colidindo e o atomo i da molecula
    let new_vel = p5.Vector.add(p5.Vector.mult(molec.atoms[i].velocity, molec.atoms[i].m),
                                p5.Vector.mult(atom.velocity, atom.m)).div(molec.atoms[i].m + atom.m);
    let new_ang = (molec.atoms[i].name == "H") ? p5.Vector.sub(molec.atoms[i].pos,
        atom.pos).heading() : p5.Vector.sub(atom.pos,
            molec.atoms[i].pos).heading();
    //em relação ao CM: w = r x v /|r|^2
    let new_omega = p5.Vector.cross(p5.Vector.sub(atom.pos, CM_new_molec),
        p5.Vector.sub(atom.velocity, new_vel)).div(
            p5.Vector.sub(atom.pos, CM_new_molec).magSq());
    //condição na qual será criada a nova molécula
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
    let n_molec = reacts[atom.name][molec.atoms[0].name
    + molec.atoms[1].name].molec_f(new_cond);
    n_molec.E_int = molec.E_int;
    return {
        new_atom: molec.atoms[1 - i],
        new_molec: n_molec
    };
}

function deltaH(atom, molec, i, n, old_molec) {
    //NÃO CALCULA O DELTAH CERTO!!!
    //i = índice do átomo que colidiu
    let collided_point_pos = p5.Vector.add(molec.n[i], p5.Vector.mult(n, molec.atoms[i].radius));

    let collided_point_vel = p5.Vector.add(molec.cm_vel, p5.Vector.cross(molec.omega, collided_point_pos));
    let v_rel = p5.Vector.sub(atom.velocity, collided_point_vel);

    //j = (1+e) jlinha, fazer bhaskara p achar e
    let jlinha = - v_rel.dot(n) / ((1 / atom.m) + (1 / molec.m_total) +
        (p5.Vector.cross(collided_point_pos, n).magSq() / molec.I));

    let fake_deltav_atom = jlinha/atom.m;
    fake_deltav_atom = p5.Vector.mult(n, fake_deltav_atom);
    let fake_deltav_molec = -jlinha/molec.m_total;
    fake_deltav_molec = p5.Vector.mult(n, fake_deltav_molec);
    
    let fake_delta_omega = -jlinha/molec.I;
    fake_delta_omega = p5.Vector.cross(collided_point_pos, n).normalize().mult(fake_delta_omega);
    //a (1+e)^2 + b (1+e) + c = 0
    let a = atom.m/2 * (fake_deltav_atom.magSq()) 
            + molec.m_total/2 * (fake_deltav_molec.magSq()) 
            + molec.I/2 * (fake_delta_omega.magSq());
    let b = atom.m*atom.velocity.dot(fake_deltav_atom)
            + molec.m_total*molec.cm_vel.dot(fake_deltav_molec)
            + molec.I*molec.omega.dot(fake_delta_omega);
    let deltaH = (E_table(molec.atoms[0].name+molec.atoms[1].name).BOND - E_table(old_molec.atoms[0].name+old_molec.atoms[1].name).BOND);
    let c = - deltaH;
    let E0 = atom.get_energy() + molec.get_energy();
    let E;
    //console.log(c);
    um_mais_e = Bhaskara(a, b, c)[0];
    let deltav_atom = p5.Vector.mult(fake_deltav_atom, um_mais_e);
    let deltav_molec = p5.Vector.mult(fake_deltav_molec, um_mais_e);
    let delta_omega = p5.Vector.mult(fake_delta_omega, um_mais_e);
    
    atom.velocity.add(deltav_atom);
    molec.cm_vel.add(deltav_molec);
    molec.omega.add(delta_omega);
    
    E = atom.get_energy() + molec.get_energy();
    //console.log(deltaH - (E-E0));
}

function check_energy(atom, molec, i) {
    //checa se há energia suficiente para reagir
    //clonando o atomo e molcula colidindo
    let cloned_atom = clone_atom(atom);
    let cloned_molec = clone_molec(molec);
    
    
    let n = p5.Vector.sub(cloned_atom.pos, cloned_molec.atoms[i].pos);
    n.normalize();
    
    let E0 = cloned_atom.m*cloned_atom.velocity.magSq()/2 
            + cloned_molec.m_total*cloned_molec.cm_vel.magSq()/2 
            + cloned_molec.I*cloned_molec.omega.magSq()/2;
    inellastic_collision(cloned_atom, cloned_molec, i, n);

    let Ef = cloned_atom.m*cloned_atom.velocity.magSq()/2 
            + cloned_molec.m_total*cloned_molec.cm_vel.magSq()/2 
            + cloned_molec.I*cloned_molec.omega.magSq()/2;
    //consulta à tabela (reacts)
    //E_int armazena a energia perdida na colisão inelástica
    return (cloned_molec.E_int > reacts[cloned_atom.name][cloned_molec.atoms[0].name+cloned_molec.atoms[1].name].ACTV);
}