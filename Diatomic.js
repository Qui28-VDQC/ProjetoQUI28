/*
Classe para moléculas diatômicas.
Depende da classe de átomo individual.
*/

function project(v, a) {
    //projeta v em a
    //<v, a>/||a||^2 * a
    return p5.Vector.mult(a, v.dot(a) / (a.magSq()));
}

class Diatomic {
    constructor(atom1, atom2, dist, cm_pos, cm_vel, ang, omega) {
        //atom1 e atom2: instâncias de Atom
        //dist: distância internuclear
        //cm_pos, cm_vel: vetores de posição e velocidade do centro de massa
        //ang: ângulo em sentido horário entre o Ox e o CM->atom1, em RAD
        //omega: vetor da velocidade angular, EM RAD/S
        this.atoms = [atom1, atom2];
        this.dist = dist;
        this.d_CM = [this.atoms[1].m * this.dist / (this.atoms[0].m + this.atoms[1].m)];
        this.d_CM.push(this.dist - this.d_CM[0]);
        this.cm_pos = cm_pos;
        this.cm_vel = cm_vel;
        //aponta do cm pro atom 1
        this.n = p5.Vector.fromAngle(ang);
        this.omega = omega;
    }
    translate(dt) {
        this.cm_pos.add(p5.Vector.mult(this.cm_vel, dt));
    }
    rotate(dt) {
        this.n.rotate(this.omega.z * dt);
    }
    atom_centers() {
        //pos_atomo = posCM + d_atomo_CM*n
        let pos_atom1 = p5.Vector.add(this.cm_pos, p5.Vector.mult(this.n, this.d_CM[0]));
        let pos_atom2 = p5.Vector.sub(this.cm_pos, p5.Vector.mult(this.n, this.d_CM[1]));
        return [pos_atom1, pos_atom2];
    }
    wall_collide(i, normal) {
        //ERRADO!!! não conserva energia
        //tentar com deltaL
        //i é índice do átomo que colidiu com a parede
        //collide com a parede
        //velocidade inicial do ponto que colidiu
        //v = vCM + w x (dCM + (centro do átomo até ponto colisão)
        normal.normalize()
        let CM_point = p5.Vector.mult(this.n, ((i == 0) ? 1 : -1) * this.d_CM[i]).add(
            p5.Vector.mult(normal, -this.atoms[i].radius));
        let collided_point_vel = p5.Vector.add(this.cm_vel,
            p5.Vector.cross(this.omega, CM_point));
        let m_tot = this.atoms[0].m + this.atoms[1].m;
        let inertia = this.atoms[0].m * this.d_CM[0] ** 2 + this.atoms[1].m * this.d_CM[1] ** 2;
        let e = m_tot * this.cm_vel.magSq() / 2 + inertia * this.omega.magSq() / 2;
        let delta_p = normal;
        //módulo do delta_p
        let j = -2 * collided_point_vel.dot(normal)
            / (1 / m_tot + p5.Vector.cross(CM_point, normal).magSq() / inertia);
        delta_p.mult(j);
        this.cm_vel.add(p5.Vector.div(delta_p, m_tot));
        //se for o átomo 0, this.n já tá na direção certa
        this.omega.add(p5.Vector.div(p5.Vector.cross(
            p5.Vector.mult(CM_point, delta_p), inertia)));
        e = m_tot * this.cm_vel.magSq() / 2 + inertia * this.omega.magSq() / 2 - e;
        console.log(e);
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