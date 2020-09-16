/*
Classe para moléculas diatômicas.
Depende da classe de átomo individual.
*/

function project(v, a) {
    //projeta v em a
    //<v, a>/||a||^2 * a
    return p5.Vector.mult(a, v.dot(a) / (a.magSq()));
}
function Bhaskara(a, b , c){
    //função que resolve equações de segundo grau
    if (b**2-4*a*c<0)
        return null;
    else
    return [(-b+Math.sqrt(b**2-4*a*c))/(2*a),(-b-Math.sqrt(b**2-4*a*c))/(2*a)];
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
        this.n = [p5.Vector.fromAngle(ang,this.d_CM[0]), p5.Vector.fromAngle(ang+PI, this.d_CM[1])];
        this.omega = omega;
        this.E_lig= E_lig;
        this.E_int= E_int;
    }
    translate(dt) {
        this.cm_pos.add(p5.Vector.mult(this.cm_vel, dt));
    }
    rotate(dt) {
        this.n[0].rotate(this.omega.z * dt);
        this.n[1].rotate(this.omega.z * dt);
    }
    atom_centers() {
        //pos_atomo = posCM + d_atomo_CM*n
        let pos_atom1 = p5.Vector.add(this.cm_pos, this.n[0]);
        let pos_atom2 = p5.Vector.add(this.cm_pos, this.n[1]);
        return [pos_atom1, pos_atom2];
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
        if (this.E_int>-this.E_lig){
        let fake_deltav= -(collided_point_vel.dot(normal)
        / ((1 / m_tot) + (p5.Vector.cross(CM_point, normal).magSq() / inertia)))/m_tot;
        fake_deltav=p5.Vector.mult(normal,fake_deltav);
        let fake_delta_omega=-(collided_point_vel.dot(normal)
        / ((1 / m_tot) + (p5.Vector.cross(CM_point, normal).magSq() / inertia)))/inertia;
        fake_delta_omega=p5.Vector.cross(CM_point, normal).mult(fake_delta_omega);
        let a=fake_deltav.magSq()*m_tot/2+fake_delta_omega.magSq()*inertia/2;
        let b=m_tot*this.cm_vel.dot(fake_deltav)+inertia*this.omega.dot(fake_delta_omega);
        let c= -(this.E_int+this.E_lig)/5; //TESTE
        this.E_int-=(this.E_int+this.E_lig)/5;
        e=Bhaskara(a, b, c)[0]-1;
        }
        else
            e=1;
        //---------------------------------------------------------------------------------------------
        let delta_p = normal;
        //módulo do delta_p
        //−(1 + e) collided_point_vel · n / (1/ma + (CM_point × n)2 ⁄ Ia)
        const j = -(1+e) * collided_point_vel.dot(normal)
            / ((1 / m_tot) + (p5.Vector.cross(CM_point, normal).magSq() / inertia));
        delta_p.mult(j);
        //cm_vel = cm_vel + j *n* / m_tot
        this.cm_vel.add(p5.Vector.div(delta_p, m_tot));
        //omega = omega + (CM_point x j *n*) / inertia
        this.omega.add(p5.Vector.div(p5.Vector.cross(CM_point, delta_p), inertia));
        E *= -1;
        E += m_tot * this.cm_vel.magSq() / 2 + inertia * this.omega.magSq() / 2;
        console.log(E);
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