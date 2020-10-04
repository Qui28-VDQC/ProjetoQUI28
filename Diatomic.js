/*
Classe para moléculas diatômicas.
Depende da classe de átomo individual.
*/
const E_LIG_PADRAO = 500000;
const E_ATIV_PADRAO = 300000;

const energies = (bond, activation) => { return { BOND: bond, ACTV: activation }; };

const E_table = (molec_name) => {
    if (E_table_data[molec_name] == undefined) return false;
    else return E_table_data[molec_name];
}

const E_table_data = {
    //     XX: energies(0, 0),
    //     YY: energies(0, 0),
    //     XY: energies(500000, 300000),
    //     YX: energies(500000, 300000)
    // 
}


class Diatomic {
    constructor(atom1, atom2, dist, cm_pos, cm_vel, ang, omega, E_lig, E_int) {
        //atom1 e atom2: instâncias de Atom
        //dist: distância internuclear
        //cm_pos, cm_vel: vetores de posição e velocidade do centro de massa
        //ang: ângulo em sentido horário entre o Ox e o CM->atom1, em RAD
        //omega: vetor da velocidade angular, EM RAD/S
        //E_lig é o módulo da energia de ligação
        //E_int é a energia interna 
        this.atoms = [atom1, atom2];
        this.dist = dist;
        this.d_CM = [this.atoms[1].m * this.dist / (this.atoms[0].m + this.atoms[1].m)];
        this.d_CM.push(this.dist - this.d_CM[0]);
        this.cm_pos = cm_pos;
        this.cm_vel = cm_vel;
        //aponta do cm pro atom 1
        this.n = [p5.Vector.fromAngle(ang, this.d_CM[0]), p5.Vector.fromAngle(ang + PI, this.d_CM[1])];
        this.omega = omega;
        this.E_lig = (typeof E_lig !== undefined) ? E_lig : E_LIG_PADRAO;
        this.E_int = E_int;
        //colocar essas propriedades na função wall collide
        this.m_total = atom1.m + atom2.m;
        this.I = atom1.m * this.d_CM[0] ** 2 + atom2.m * this.d_CM[1] ** 2
    }
    translate(dt) {
        this.cm_pos.add(p5.Vector.mult(this.cm_vel, dt));
    }
    rotate(dt) {
        this.n[0].rotate(this.omega.z * dt);
        this.n[1].rotate(this.omega.z * dt);
    }
    atom_centers() {
        //TODO: alterar pos dos atomos
        //pos_atomo = posCM + d_atomo_CM*n
        this.atoms[0].pos = p5.Vector.add(this.cm_pos, this.n[0]);
        this.atoms[1].pos = p5.Vector.add(this.cm_pos, this.n[1]);
        return [this.atoms[0].pos, this.atoms[1].pos];
    }

    atom_vels() {
        let v1 = p5.Vector.add(this.cm_vel, p5.Vector.cross(this.omega, this.n[0]));
        let v2 = p5.Vector.add(this.cm_vel, p5.Vector.cross(this.omega, this.n[1]));
        return [v1, v2];
    }
    wall_collide(i, normal) {
        //ERRADO!!! não conserva energia
        //tentar com deltaL
        //i é índice do átomo que colidiu com a parede
        //collide com a parede
        //velocidade inicial do ponto que colidiu
        //v = vCM + w x (dCM + (centro do átomo até ponto colisão)
        if (p5.Vector.add(this.cm_vel, p5.Vector.cross(this.omega, this.n[i])).dot(normal) >= 0) {
            return;
        }
        normal.normalize();
        //CM_point = cm_pos + cm-átomo[i] + -raio * normal
        const CM_point = p5.Vector.add(this.n[i], p5.Vector.mult(normal, -this.atoms[i].radius));
        // CP_vel = cm_vel + omega x r
        const collided_point_vel = p5.Vector.add(this.cm_vel,
            p5.Vector.cross(this.omega, CM_point));
        const m_tot = this.atoms[0].m + this.atoms[1].m;
        const inertia = this.atoms[0].m * this.d_CM[0] ** 2 + this.atoms[1].m * this.d_CM[1] ** 2;
        //energia pré colisão
        let E = m_tot * this.cm_vel.magSq() / 2 + inertia * this.omega.magSq() / 2;
        //e é o coeficiente de restituição
        let e;
        //----------------------------------------------------------------------------------------------
        //CÓDIGO TESTE (FOTO NA CONVERSA DO ZAP ZAP)
        if (this.E_int > -this.E_lig) {
            let fake_deltav = -(collided_point_vel.dot(normal)
                / ((1 / m_tot) + (p5.Vector.cross(CM_point, normal).magSq() / inertia))) / m_tot;
            fake_deltav = p5.Vector.mult(normal, fake_deltav);
            let fake_delta_omega = -(collided_point_vel.dot(normal)
                / ((1 / m_tot) + (p5.Vector.cross(CM_point, normal).magSq() / inertia))) / inertia;
            fake_delta_omega = p5.Vector.cross(CM_point, normal).mult(fake_delta_omega);
            let a = fake_deltav.magSq() * m_tot / 2 + fake_delta_omega.magSq() * inertia / 2;
            let b = m_tot * this.cm_vel.dot(fake_deltav) + inertia * this.omega.dot(fake_delta_omega);
            let c = -(this.E_int + this.E_lig) / 5; //TESTE
            this.E_int -= (this.E_int + this.E_lig) / 5;
            e = Bhaskara(a, b, c)[0] - 1;
        }
        else
            e = 1;
        //---------------------------------------------------------------------------------------------
        let delta_p = normal;
        //módulo do delta_p
        //−(1 + e) collided_point_vel · n / (1/ma + (CM_point × n)2 ⁄ Ia)
        const j = -(1 + e) * collided_point_vel.dot(normal)
            / ((1 / m_tot) + (p5.Vector.cross(CM_point, normal).magSq() / inertia));
        delta_p.mult(j);
        //cm_vel = cm_vel + j *n* / m_tot
        this.cm_vel.add(p5.Vector.div(delta_p, m_tot));
        //omega = omega + (CM_point x j *n*) / inertia
        this.omega.add(p5.Vector.div(p5.Vector.cross(CM_point, delta_p), inertia));
        E *= -1;
        E += m_tot * this.cm_vel.magSq() / 2 + inertia * this.omega.magSq() / 2;
    }
    update(dt) {
        this.translate(dt);
        this.rotate(dt);
        //checa colisão com as paredes
        let poss = this.atom_centers();
        let i;
        let normal = null;
        for (i = 0; i < 2; i++) {
            //corrigir "ultrapassagem"
            if (poss[i].x + this.atoms[i].radius > width) {
                //o centro do átomo ultrapassou a parede em 
                //poss[i].x+this.atoms[i].radius-width
                this.cm_pos.sub([poss[i].x + this.atoms[i].radius - width, 0, 0]);
                normal = createVector(-1, 0);
                break;
            }
            else if (poss[i].x - this.atoms[i].radius < 0) {
                this.cm_pos.sub([poss[i].x - this.atoms[i].radius, 0, 0]);
                normal = createVector(1, 0);
                break;
            }
            if (poss[i].y + this.atoms[i].radius > height) {
                this.cm_pos.sub([0, poss[i].y + this.atoms[i].radius - height, 0]);
                normal = createVector(0, -1);
                break;
            }
            else if (poss[i].y - this.atoms[i].radius < 0) {
                this.cm_pos.sub([0, poss[i].y - this.atoms[i].radius, 0]);
                normal = createVector(0, 1);
                break;
            }
        }
        if (normal != null) {
            this.wall_collide(i, normal);
        }
    }
    draw() {
        let centers = this.atom_centers();
        circle(centers[0].x, centers[0].y, 2 * this.atoms[0].radius);
        circle(centers[1].x, centers[1].y, 2 * this.atoms[1].radius);
    }
}


function clone_molec(molec) {
    let atom1 = new Atom(createVector(molec.atoms[0].pos.x, molec.atoms[0].pos.y),
        createVector(0, 0),
        molec.atoms[0].radius, molec.atoms[0].m, molec.atoms[0].name);
    let atom2 = new Atom(createVector(molec.atoms[1].pos.x, molec.atoms[1].pos.y),
        createVector(0, 0),
        molec.atoms[1].radius, molec.atoms[1].m, molec.atoms[1].name);

    let fake_molec = new Diatomic(atom1, atom2, molec.dist,
        createVector(molec.cm_pos.x, molec.cm_pos.y),
        createVector(molec.cm_vel.x, molec.cm_vel.y), molec.n[0].heading(), createVector(0, 0, molec.omega.z));
    return fake_molec;
}

function check_collision_di_di(molec1, molec2, dt) {
    // //dt é o tempo entre 2 frames
    // let atom1_radius=Math.max(molec1.n[0].mag()+molec1.atoms[0].radius,
    // molec1.n[1].mag()+molec1.atoms[1].radius );
    // let atom2_radius=Math.max(molec2.n[0].mag()+molec2.atoms[0].radius,
    // molec2.n[1].mag()+molec2.atoms[1].radius );
    // let fake_atom1 = new Atom(molec1.cm_pos, molec1.cm_vel,
    //     (atom1_radius), 5, "tebbv");
    // let fake_atom2 = new Atom(molec2.cm_pos, molec2.cm_vel,
    //     (atom2_radius), 5, "evrb");
    // let deltaT = check_collision(fake_atom1, fake_atom2);
    // if ((deltaT > 0 && deltaT < dt) || (fake_atom1.pos.dist(fake_atom2.pos) <= 
    // fake_atom1.radius+fake_atom2.radius)) {
    //resto da checagem
    let fake_molec1 = clone_molec(molec1);
    let fake_molec2 = clone_molec(molec2);
    //t é um contador de tempo
    let t = 0;
    do {
        //maxima velocidade? tolerância de deslocamento entre frames?
        let v_list = [];
        let vec_list = fake_molec1.atom_vels().concat(fake_molec2.atom_vels());
        vec_list.forEach(el => v_list.push(el.mag()))
        let max_vel = Math.max(...v_list);
        //dt_dyn é um intervalo de tempo tal que o átomo mais rápido 
        //percorre menos que tol (menor raio / 2)
        let radius_list = [];
        let atom_list = fake_molec1.atoms.concat(fake_molec2.atoms);
        atom_list.forEach(el => radius_list.push(el.radius / 2))
        let tol = Math.min(...radius_list);
        let dt_dyn = Math.min(tol / max_vel, dt);
        fake_molec1.atom_centers();
        fake_molec2.atom_centers();
        //checagem de sobreposição
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                if (fake_molec1.atoms[i].pos.dist(fake_molec2.atoms[j].pos) <=
                    fake_molec1.atoms[i].radius + fake_molec2.atoms[j].radius) {
                    //há colisão

                    return [i, j];
                }
            }
        }
        t += dt_dyn
        fake_molec1.update(dt_dyn);
        fake_molec2.update(dt_dyn);
    } while (t < dt)
    return null;
    // }
    // else {
    //     return null;
    // }
}

function collide_di_di(molec1, i, molec2, j) {
    //definindo a normal (n aponta do 2 pro 1)
    let colided_atom1_pos = molec1.atom_centers()[i];
    let colided_atom2_pos = molec2.atom_centers()[j];
    let n = p5.Vector.sub(colided_atom1_pos, colided_atom2_pos);
    n.normalize();
    //colided_point_pos é a posição relativa do ponto de contato ao centro de massa
    let colided_point1_pos = p5.Vector.sub(molec1.n[i], p5.Vector.mult(n, molec1.atoms[i].radius));
    let colided_point2_pos = p5.Vector.add(molec2.n[j], p5.Vector.mult(n, molec2.atoms[j].radius));
    //calculando a velocidade dos pontos de contato;
    //v_p=v_cm + w x (colided_atom_pos1 - n.r )
    let colided_point1_vel = p5.Vector.add(molec1.cm_vel,
        p5.Vector.cross(molec1.omega, colided_point1_pos));
    let colided_point2_vel = p5.Vector.add(molec2.cm_vel,
        p5.Vector.cross(molec2.omega, colided_point2_pos));
    let v_rel = p5.Vector.sub(colided_point1_vel, colided_point2_vel);
    //definindo o j do site my physics lab como delta_p
    let delta_p = -2 * v_rel.dot(n) / (1 / molec1.m_total + 1 / molec2.m_total +
        colided_point1_pos.cross(n).magSq() / molec1.I + colided_point2_pos.cross(n).magSq() / molec2.I);

    delta_p = p5.Vector.mult(n, delta_p);

    //v_cm_final1=v_cm_inicial1+delta_p/m1
    // let cm_vel1_f= p5.Vector.add(molec1.cm_vel,p5.Vector.div(delta_p, molec1.m_total));
    // let cm_vel2_f= p5.Vector.sub(molec2.cm_vel,p5.Vector.div(delta_p, molec2.m_total));
    // let omega1_f=p5.Vector.add(molec1.omega,p5.Vector.cross(colided_point1_pos,p5.Vector.div(delta_p,molec1.I)));
    // let omega2_f=p5.Vector.sub(molec2.omega,p5.Vector.cross(colided_point2_pos,p5.Vector.div(delta_p,molec2.I)));
    molec1.cm_vel = p5.Vector.add(molec1.cm_vel, p5.Vector.div(delta_p, molec1.m_total));
    molec2.cm_vel = p5.Vector.sub(molec2.cm_vel, p5.Vector.div(delta_p, molec2.m_total));
    //omega_final=omega_inicial+ colided_point1 x delta_p/I
    molec1.omega = p5.Vector.add(molec1.omega, p5.Vector.cross(colided_point1_pos, p5.Vector.div(delta_p, molec1.I)));
    molec2.omega = p5.Vector.sub(molec2.omega, p5.Vector.cross(colided_point2_pos, p5.Vector.div(delta_p, molec2.I)));

    //return [cm_vel1_f, cm_vel2_f, omega1_f, omega2_f];
}

