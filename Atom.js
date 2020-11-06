//arquivo com a classe do átomo isolado, check de colisão entre átomos isolados
//já incluso no run.html

class Atom {
    constructor(pos, velocity, radius, mass, name, color, text_color) {
        this.pos = pos;
        this.velocity = velocity;
        this.radius = radius;
        this.m = mass;
        //usado p checar reação
        this.name = name;
        this.color = color;
        this.text_color = text_color;
    }
    get_energy() {
        return this.m*this.velocity.magSq()/2;
    }
    draw() {
        fill(this.color);
        circle(this.pos.x, this.pos.y, 2 * this.radius);
        fill(this.text_color);
        textSize(this.radius/3);
        text(this.name, this.pos.x, this.pos.y);
    }
    update(dt) {
        this.pos.add(p5.Vector.mult(this.velocity, dt))
        if (this.pos.x > width - this.radius) {
            this.velocity.x *= -1;
            //reflete o que ele ultrapassou
            this.pos.x = width - this.radius - (this.pos.x - (width - this.radius));
        }
        else if (this.pos.x < this.radius) {
            this.velocity.x *= -1;
            this.pos.x = this.radius - (this.pos.x - this.radius);
        }

        if (this.pos.y > height - this.radius) {
            this.velocity.y *= -1;
            this.pos.y = height - this.radius - (this.pos.y - (height - this.radius));
        }
        else if (this.pos.y < this.radius) {
            this.velocity.y *= -1;
            this.pos.y = this.radius - (this.pos.y - this.radius);
        }
    }
}

function check_collision(atom1, atom2) {
    //checagem explicada no drive dos livros: COlisão?
    //subtrai, sem alterar nenhum
    let dpos = p5.Vector.sub(atom1.pos, atom2.pos)
    let deltaV = p5.Vector.sub(atom1.velocity, atom2.velocity);
    let beta = -p5.Vector.dot(deltaV, dpos) / deltaV.mag();
    let deltaT = beta - sqrt(sq(atom1.radius + atom2.radius) - sq(dpos.mag()) + sq(beta));
    deltaT /= deltaV.mag();
    return deltaT
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