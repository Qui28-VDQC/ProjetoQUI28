/*
Classe para moléculas diatômicas.
Depende da classe de átomo individual.
*/

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
        this.E_lig = E_lig;
        this.E_int = E_int;
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
        let pos_atom1 = p5.Vector.add(this.cm_pos, this.n[0]);
        let pos_atom2 = p5.Vector.add(this.cm_pos, this.n[1]);
        return [pos_atom1, pos_atom2];
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
    //dt é o tempo entre 2 frames
    let fake_atom1 = new Atom(molec1.cm_pos, molec1.cm_vel,
        (molec1.atoms[0].radius + molec1.atoms[1].radius), 5, "tebbv");
    let fake_atom2 = new Atom(molec2.cm_pos, molec2.cm_vel,
        (molec2.atoms[0].radius + molec2.atoms[1].radius), 5, "evrb");
    let deltaT = check_collision(fake_atom1, fake_atom2);
    if (deltaT > 0 && deltaT < dt) {
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

            //checagem de sobreposição
            for (let i = 0; i < 2; i++) {
                atom1 = fake_molec1.atoms[i];
                for (let j = 0; j < 2; j++) {
                    atom2 = fake_molec2.atoms[j];
                    if (atom1.pos.dist(atom2.pos) <= atom1.radius + atom2.radius) {
                        //há colisão
                        return t;
                    }
                }
            }
            t += dt_dyn
            fake_molec1.update(dt_dyn);
            fake_molec2.update(dt_dyn);
        } while (t < dt)
        return null;
    }
    else {
        return null;
    }
}

