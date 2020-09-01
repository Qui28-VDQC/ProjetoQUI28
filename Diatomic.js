/*
Classe para moléculas diatômicas.
Depende da classe de átomo individual.
*/

class Diatomic {
    constructor(atom1, atom2, dist, cm_pos, cm_vel, ang, omega) {
        //atom1 e atom2: instâncias de Atom
        //dist: distância internuclear
        //cm_pos, cm_vel: vetores de posição e velocidade do centro de massa
        //ang: ângulo em sentido horário entre o Ox e o atom1
        //omega: vetor da velocidade angular, convertido p escalar EM RAD/S
        this.atom1 = atom1;
        this.atom2 = atom2;
        this.dist = dist;
        this.cm_pos0 = cm_pos;
        this.cm_pos = cm_pos;
        this.cm_vel = cm_vel;
        this.ang = ang;
        this.omega = omega.z;
    }
    translate(dt) {
        this.cm_pos.add(p5.Vector.mult(this.cm_vel, dt));
    }
    rotate(dt) {
        this.ang += this.omega * dt;
        //evitar que ang fique muito grande?
    }
    atom_centers() {
        let d_atom1_CM = this.atom2.m * this.dist / (this.atom1.m + this.atom2.m);
        let d_atom2_CM = this.dist - d_atom1_CM;
        //pos_atomo = posCM + d_atomo_CM*cis(ang)
        let pos_atom1 = p5.Vector.add(this.cm_pos, p5.Vector.fromAngle(this.ang, d_atom1_CM));
        let pos_atom2 = p5.Vector.add(this.cm_pos, p5.Vector.fromAngle(this.ang + PI, d_atom2_CM));
        return [pos_atom1, pos_atom2];
    }
    update(dt) {
        this.translate(dt);
        this.rotate(dt);
        //checa colisão com as paredes
    }
    draw() {
        let centers = this.atom_centers();
        circle(centers[0].x, centers[0].y, 2 * this.atom1.radius);
        circle(centers[1].x, centers[1].y, 2 * this.atom2.radius);
    }
}