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
  let deltaV = p5.Vector.sub(a.velocity, b.velocity);
  let beta = -p5.Vector.dot(deltaV, dpos) / deltaV.mag();
  let deltaT = beta - sqrt(sq(a.radius + b.radius) - sq(dpos.mag()) + sq(beta));
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
function colisao_inelastica (atom1, atom2){
  let n = p5.Vector.sub(atom1.pos, atom2.pos);
  n.normalize();
  let centro_de_massa=p5.Vector.div(p5.Vector.add(p5.Vector.div(p5.Vector.mult(a.pos,a.m)),p5.Vector.divp5.Vector.mult(b.pos,b.m)), a.m+b.m);
  let v_centro_de_massa=p5.Vector.div(p5.Vector.add(p5.Vector.div(p5.Vector.mult(a.velocity,a.m)),p5.Vector.divp5.Vector.mult(b.velocity,b.m)), a.m+b.m);
  let r_a=p5.Vector.sub(centro_de_massa,atom1.pos);
  let r_b=p5.Vector.sub(centro_de_massa,atom2.pos);
  let L_a=p5.Vector.cross(p5.Vector.mult(a.velocity,a.m),r_a);
  let L_b=p5.Vector.cross(p5.Vector.mult(a.velocity,b.m),r_b);  
  let I_a=p5.Vector.magSq(r_a)*a.m;
  let w_a=p5.Vector.div(L_a,I_a);
  let I_b=p5.Vector.magSq(r_b)*b.m;
  let w_b=p5.Vector.div(L_b,I_b);
  
  
}

  /*código que pega todas as classes e funções definidas nos
outros arquivos e de fato executa. Variáveis do começo devem
ser alteradas dependendo do propósito da simulação*/

//tipos de átomo isolado
//vetor de strings
//melhorar tipos de átomos: herança?
let atom_types = ["a", "b"];

//tipos de molécula
//pares de átomos
let molec_types = [["a", "a"], ["b", "b"], ["a", "b"]]

//colchetes apenas ilustrativos por enquanto
//depois tirar e preencher no setup

//quantidades
let atom_num = [1, 1];
let molec_num = [0, 0, 0];

//lista dos átomos
//array 2d com as instâncias de cada tipo, em ordem
//dimensões (número de tipos) x max(número de átomos)
//posições não ocupadas devem estar no fim e serem null
let atoms = [[], []];
let molecules = [[], [], []];

function flatten(list) {
    let v = [];
    //funciona pra 2D
    for (el of list) {
        v = v.concat(el);
    }
    return v;
}

function setup() {
    createCanvas(600, 600);
    //cuidado!! atom_types e atom_num tem que ter mesmo compriemnto
    for (let i = 0; i < atom_types.length; i++) {
        for (let j = 0; j < atom_num[i]; j++) {
            //assumindo tela quadrada só por simplicidade
            atoms[i].push(new Atom(p5.Vector.random2D().mult(width),
                p5.Vector.random2D().mult(50),
                (atom_types[i] == "a") ? 10 : 30,
                (atom_types[i] == "a") ? 50 : 500,
                atom_types[i]
            ));
        }
    }

}

function draw() {
    background(150);
    dt = min(1, 1 / frameRate());
    for (a of flatten(atoms)) {
        for (b of flatten(atoms)) {
            if (a != b) {
                let deltaT = check_collision(a, b);
                if (deltaT > 0 && deltaT < dt) {
                    //adicionar reação aqui
                    colisao_inelastica(a, b);
                }
            }
        }
    }
    //desenha
    for (a of flatten(atoms)) {
        a.update(dt);
        a.draw();
    }
    
}
  
  
