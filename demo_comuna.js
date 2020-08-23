/* Programa de colisão de partículas
Instituto Tecnológico de Aeronáutica, 2020

Aperte o botão 'play'(ícone no canto superior esquerdo)
e crie "bolinhas" com o clicar do mouse no quadro(à direita)
*/

//NÃO MEXER NESSE CÓDIGO
//pegar partes dele e colocar nos arquivos apropriados
class Atom {
    constructor(x, y, velocity, radius) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.radius = radius;
        this.m = sq(radius);
    }
    draw() {
        circle(this.x, this.y, 2 * this.radius);
    }
    update(dt) {
        this.x += this.velocity.x * dt;
        this.y += this.velocity.y * dt;
        if (this.x > width - this.radius) {
            this.velocity.x *= -1;
            this.x = width - this.radius;
        }
        else if (this.x < this.radius) {
            this.velocity.x *= -1;
            this.x = this.radius;
        }

        if (this.y > height - this.radius) {
            this.velocity.y *= -1;
            this.y = height - this.radius;
        }
        else if (this.y < this.radius) {
            this.velocity.y *= -1;
            this.y = this.radius;
        }


    }
}

let atoms = [];
let dt = 0;

function setup() {
    createCanvas(600, 600);
}

function draw() {
    background(255);
    dt = 1 / frameRate();
    for (let a of atoms) {
        for (let b of atoms) {
            if (b != a) {
                //Determine the normal direction
                let dx = a.x - b.x;
                let dy = a.y - b.y;
                let distance = mag(dx, dy);
                let n = createVector(dx, dy);
                let deltaV = p5.Vector.sub(a.velocity, b.velocity);
                let beta = -p5.Vector.dot(deltaV, n) / deltaV.mag();

                let deltaT = beta - sqrt(sq(a.radius + b.radius) - sq(distance) + sq(beta));
                deltaT /= deltaV.mag();
                if (deltaT > 0 && deltaT < dt) {
                    n.mult(1 / distance);
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
            }
        }
    }
    for (let a of atoms) {
        a.update(dt);
        a.draw();
    }
}

function mouseClicked() {
    let a = new Atom(mouseX, mouseY, createVector(50 * Math.random(), 50 * Math.random()), random(5, 35));

    atoms.push(a);
}