function test_mono_mono(atom1, atom2, E_lig, E_ativacao) {
  let n = p5.Vector.sub(atom1.pos, atom2.pos);
  n.normalize();
  //verificando se a energia do sistema é maior que a energia de ativação
  let massa_reduzida = atom1.m * atom2.m / (atom1.m + atom2.m);
  //Energia de aproximação dos átomos
  let E_colisao = (p5.Vector.sub(atom1.velocity, atom2.velocity).dot(n) ** 2) * massa_reduzida / 2;
  return E_colisao > E_ativacao;
}


//função calcula velocidade do centro de massa e velocidades angulares dada a energia de ligação e velocidades dos atomos
function react_mono_mono(atom1, atom2, E_lig, E_ativacao) {

  let n = p5.Vector.sub(atom1.pos, atom2.pos);
  n.normalize();

  //verificando se a energia do sistema é maior que a energia de ativação
  let massa_reduzida = atom1.m * atom2.m / (atom1.m + atom2.m);
  //Energia de aproximação dos átomos
  let E_colisao = (p5.Vector.sub(atom1.velocity, atom2.velocity).dot(n) ** 2) * massa_reduzida / 2;
  //descrevendo o centro de massa
  // cm=(m1*r1+m2*r2)/(m1+m2)

  let centro_de_massa = p5.Vector.div(p5.Vector.add(p5.Vector.mult(atom1.pos, atom1.m),
    p5.Vector.mult(atom2.pos, atom2.m)), atom1.m + atom2.m);
  let angulo = p5.Vector.sub(atom1.pos, centro_de_massa).angleBetween(createVector(1, 0));
  //deve se trocar o sinal devido a ordem dos vetores no "angleBetween"
  angulo *= -1;
  // vcm=(m1*v1+m2*v2)/(m1+m2)
  let v_centro_de_massa = p5.Vector.div(p5.Vector.add(p5.Vector.mult(atom1.velocity, atom1.m),
    p5.Vector.mult(atom2.velocity, atom2.m)), atom1.m + atom2.m);
  let r_a = p5.Vector.sub(centro_de_massa, atom1.pos);
  let r_b = p5.Vector.sub(centro_de_massa, atom2.pos);
  //a partir dos vetores de posicao, criaremos vetores de momento angular
  let L_a = p5.Vector.cross(p5.Vector.mult(atom1.velocity, atom1.m), r_a);
  let L_b = p5.Vector.cross(p5.Vector.mult(atom2.velocity, atom2.m), r_b);
  let I = r_a.magSq() * atom1.m + r_b.magSq() * atom2.m;
  //calculando o valor de omega por conservação de energia (Ecin1+Ecin2=E_rotacao+E_lig)
  let w = p5.Vector.div(p5.Vector.add(L_a, L_b), I);
  
  return new Diatomic(atom1, atom2, atom1.radius + atom2.radius,
    centro_de_massa, v_centro_de_massa, angulo, w, E_table(atom1.name+atom2.name).BOND, E_colisao)
}