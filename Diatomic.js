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
        //velocidade inicial do átomo que colidiu
        let collided_atom_vel = p5.Vector.add(this.cm_vel, p5.Vector.cross(this.omega, p5.Vector.mult(this.n, this.d_CM[i])));
        //velociade inicial do outro átomo
        let other_atom_vel = p5.Vector.add(this.cm_vel, p5.Vector.cross(this.omega, p5.Vector.mult(this.n, -this.d_CM[1 - i])));
        let e = this.atoms[i].m * collided_atom_vel.magSq() / 2 + this.atoms[1 - i].m * other_atom_vel.magSq() / 2;
        console.log(e);
        //reflete a velocidade do átomo que colidiu na direção normal
        collided_atom_vel.sub(project(collided_atom_vel, normal).mult(2));
        //faz colisão inelástica entre os átomos
        other_atom_vel.sub(project(other_atom_vel, this.n)).add(project(collided_atom_vel, this.n).mult(this.atoms[i].m / (this.atoms[i].m + this.atoms[1 - i].m)));
        collided_atom_vel.sub(project(collided_atom_vel, this.n)).add(project(other_atom_vel, this.n));
        e = this.atoms[i].m * collided_atom_vel.magSq() / 2 + this.atoms[1 - i].m * other_atom_vel.magSq() / 2 - e;
        console.log(e);
        //calcula novo omega e vCM
        this.cm_vel = p5.Vector.add(collided_atom_vel, other_atom_vel).div(2);
        //omega = r x (v - vCM)
        this.omega = p5.Vector.cross(p5.Vector.mult(this.n, 1 / this.d_CM[i]), p5.Vector.sub(collided_atom_vel, this.cm_vel));
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
                normal = createVector(-1, 0);
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