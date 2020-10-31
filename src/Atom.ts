//arquivo com a classe do átomo isolado, check de colisão entre átomos isolados
//já incluso no run.html
import { vec2 } from "gl-matrix"
import { Drawing } from './Drawing'

class Atom {
    public pos;
    public velocity;
    public radius;
    public m;
    public name;
    constructor(pos: vec2, velocity: vec2, radius: number, mass: number, name: string) {
        this.pos = pos;
        this.velocity = velocity;
        this.radius = radius;
        this.m = mass;
        //usado p checar reação
        this.name = name;
    }
    get_energy() {
        return 0.5*this.m*vec2.sqrLen(this.velocity);
    }
    draw(draw: Drawing) {
        draw.circle(this.pos, 2 * this.radius);
    }
    update(dt: number) {
        vec2.add(this.pos, this.pos, [dt * this.velocity[0], dt * this.velocity[1]]);
        // if (this.pos.x > width - this.radius) {
        //     this.velocity.x *= -1;
        //     //reflete o que ele ultrapassou
        //     this.pos.x = width - this.radius - (this.pos.x - (width - this.radius));
        // }
        // else if (this.pos.x < this.radius) {
        //     this.velocity.x *= -1;
        //     this.pos.x = this.radius - (this.pos.x - this.radius);
        // }

        // if (this.pos.y > height - this.radius) {
        //     this.velocity.y *= -1;
        //     this.pos.y = height - this.radius - (this.pos.y - (height - this.radius));
        // }
        // else if (this.pos.y < this.radius) {
        //     this.velocity.y *= -1;
        //     this.pos.y = this.radius - (this.pos.y - this.radius);
        // }
    }
}

function check_collision(atom1: Atom, atom2: Atom) {
    //TODO: Rename this function
    //Returns time until two atoms will collide
    //checagem explicada no drive dos livros: COlisão?
    //subtrai, sem alterar nenhum
    let r: vec2 = vec2.create();
    vec2.sub(r, atom1.pos, atom2.pos);
    let V_rel: vec2 = vec2.create();
    vec2.sub(V_rel, atom1.velocity, atom2.velocity);
    //let V_rel_dir: vec2 = vec2.create();
    //vec2.normalize(V_rel_dir, V_rel);
    let dotP = vec2.dot(V_rel, r);
    let sqrLen_V_rel = vec2.sqrLen(V_rel);
    let beta = dotP / sqrLen_V_rel; //-p5.Vector.dot(V_rel, dpos) / V_rel.mag();
    let deltaT = beta - Math.sqrt(dotP*dotP - sqrLen_V_rel*(vec2.dot(r, r) - (atom1.radius + atom2.radius)**2));
    //let deltaT = beta - sqrt(sq(atom1.radius + atom2.radius) - sq(dpos.mag()) + sq(beta));
    return deltaT;
}

function collide(atom1, atom2) {
    //testar let n = p5.Vector.normalize(sub...)
    let n = p5.Vector.sub(atom1.pos, atom2.pos);
    n.normalize()
    /*atom1.x += 0.5*n.x;
    atom1.y += 0.5*n.y;
    b.x -= 0.5*n.x;
    atom2.y -= 0.5*n.y;*/
    //Velocities in relationship to the normal axis
    let va_n = p5.Vector.dot(atom1.velocity, n);
    let vb_n = p5.Vector.dot(atom2.velocity, n);
    //Scalars
    let a_esc = ((atom1.m - atom2.m) * va_n + 2 * atom2.m * vb_n) / (atom1.m + atom2.m);
    let b_esc = (2 * atom1.m * va_n + (atom2.m - atom1.m) * vb_n) / (atom1.m + atom2.m);
    //Final velocities
    atom1.velocity.add(p5.Vector.mult(n, a_esc - va_n));
    atom2.velocity.add(p5.Vector.mult(n, b_esc - vb_n));
}

function static_collide_mono_mono(atom1, atom2) {
    let n = p5.Vector.sub(atom2.pos, atom1.pos);
    n.normalize()
    n.mult(atom1.radius + atom2.radius);
    atom2.pos = p5.Vector.add(atom1.pos, n);

    //evita que o atom2 seja empurrado pra dentro da parede
    let went_through_wall = false;
    if (atom2.pos.x > width - atom2.radius) {
        //reflete o que ele ultrapassou
        atom2.pos.x = width - atom2.radius;
        went_through_wall =true;
        
    }
    else if (atom2.pos.x < atom2.radius) {
        atom2.pos.x = atom2.radius;
        went_through_wall =true;
    }

    if (atom2.pos.y > height - atom2.radius) {
        atom2.pos.y = height;
        went_through_wall =true;
    }
    else if (atom2.pos.y < atom2.radius) {
        atom2.pos.y = atom2.radius;
        went_through_wall =true;
    }
    if (went_through_wall) {
        n = p5.Vector.sub(atom2.pos, atom1.pos);
        n.normalize()
        n.mult(atom1.radius + atom2.radius);
        atom1.pos = p5.Vector.sub(atom2.pos, n);
    }
}

export {
    check_collision, collide, static_collide_mono_mono, Atom
}
