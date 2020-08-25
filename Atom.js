//arquivo com a classe do átomo isolado, check de colisão entre átomos isolados
//já incluso no run.html

class Atom {
    constructor(pos, velocity, radius, mass, name) {
        this.pos = pos;
        this.velocity = velocity;
        this.radius = radius;
        this.m = mass;
        //usado p checar reação
        this.name = name;
    }
    draw() {
        circle(this.pos.x, this.pos.y, 2 * this.radius);
    }
    update(dt) {
        this.pos.add(this.velocity.mult(dt))
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
    let deltaV = p5.Vector.sub(a.velocity, b.velocity);
    let beta = -p5.Vector.dot(deltaV, dpos) / deltaV.mag();
    let deltaT = beta - sqrt(sq(a.radius + b.radius) - sq(mag(dpos)) + sq(beta));
    deltaT /= deltaV.mag();
    return deltaT
}

function collide(atom1, atom2) {
    //testar let n = p5.Vector.normalize(sub...)
    let n = p5.Vector.sub(atom1.pos, atom2.pos);
    n.normalize()
    /*a.x += 0.5*n.x;
    a.y += 0.5*n.y;
    b.x -= 0.5*n.x;
    b.y -= 0.5*n.y;*/
    //Velocities in relationship to the normal axis
    let va_n = p5.Vector.dot(a.velocity, n);
    let vb_n = p5.Vector.dot(b.velocity, n);
    //Scalars
    let a_esc = ((a.m - b.m) * va_n + 2 * b.m * vb_n) / (a.m + b.m);
    let b_esc = (2 * a.m * va_n + (b.m - a.m) * vb_n) / (a.m + b.m);
    //Final velocities
    a.velocity.add(p5.Vector.mult(n, a_esc - va_n));
    b.velocity.add(p5.Vector.mult(n, b_esc - vb_n));
}