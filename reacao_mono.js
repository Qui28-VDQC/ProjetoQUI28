//função calcula velocidade do centro de massa e velocidades angulares dada a energia de ligação e velocidades dos atomos
function react (atom1, atom2, E_lig, E_ativacao){
  let n = p5.Vector.sub(atom1.pos, atom2.pos);
  n.normalize();
  //verificando se a energia do sistema é maior que a energia de ativação
  let massa_reduzida=atom1.m*atom2.m/(atom1.m+atom2.m);
  //Energia de aproximação dos átomos
  let E_colisao=(p5.Vector.sub(atom1.velocity,atom2.velocity).dot(n)**2)*massa_reduzida/2;
  if (E_colisao<E_ativacao || E_colisao>E_ativacao+E_lig){
    return null;
  }
  //descrevendo o centro de massa
  // cm=(m1*r1+m2*r2)/(m1+m2)
  let centro_de_massa=p5.Vector.div(p5.Vector.add(p5.Vector.mult(atom1.pos,atom1.m),
  p5.Vector.mult(atom2.pos,atom2.m)),atom1.m+atom2.m);
  let angulo= p5.Vector.sub(atom1.pos, centro_de_massa).angleBetween(createVector(1,0));
  //deve se trocar o sinal devido a ordem dos vetores no "angleBetween"
  angulo*=-1;
  // vcm=(m1*v1+m2*v2)/(m1+m2)
  let v_centro_de_massa=p5.Vector.div(p5.Vector.add(p5.Vector.mult(atom1.velocity,atom1.m),
  p5.Vector.mult(atom2.velocity,atom2.m)),atom1.m+atom2.m);
  let r_a=p5.Vector.sub(centro_de_massa,atom1.pos);
  let r_b=p5.Vector.sub(centro_de_massa,atom2.pos);
  //a partir dos vetores de posicao, criaremos vetores de momento angular
  let L_a=p5.Vector.cross(p5.Vector.mult(atom1.velocity,atom1.m),r_a);
  let L_b=p5.Vector.cross(p5.Vector.mult(atom2.velocity,atom2.m),r_b);  
  //let I_a=p5.Vector.magSq(r_a)*a.m;
  //let w_a=p5.Vector.div(L_a,I_a);
  //let I_b=p5.Vector.magSq(r_b)*atom2.m;
  //let w_b=p5.Vector.div(L_b,I_b);
  let I=r_a.magSq()*atom1.m + r_b.magSq()*atom2.m;
  let E_cin1= atom1.velocity.magSq()*atom1.m/2;
  let E_cin2= atom2.velocity.magSq()*atom2.m/2;
  //calculando o valor de omega por conservação de energia (Ecin1+Ecin2=E_rotacao+E_lig)
  let w= p5.Vector.div(p5.Vector.add(L_a,L_b),I);
  return[centro_de_massa, v_centro_de_massa,angulo, w, E_colisao];
}