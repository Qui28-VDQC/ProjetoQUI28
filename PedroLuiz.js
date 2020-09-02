//função calcula velocidade do centro de massa e velocidades angulares dada a energia de ligação e velocidades dos atomos
function conservacao (atom1, atom2, E_lig){
  let n = p5.Vector.sub(a.pos, b.pos);
  n.normalize();
  //descrevendo o centro de massa
  let centro_de_massa=p5.Vector.div(p5.Vector.add(p5.Vector.div(p5.Vector.mult(a.pos,a.m)),p5.Vector.div(p5.Vector.mult(b.pos,b.m)), a.m+b.m));
  let v_centro_de_massa=p5.Vector.div(p5.Vector.add(p5.Vector.div(p5.Vector.mult(a.velocity,a.m)),p5.Vector.divp5.Vector.mult(b.velocity,b.m)), a.m+b.m);
  let r_a=p5.Vector.sub(centro_de_massa,a.pos);
  let r_b=p5.Vector.sub(centro_de_massa,a.pos);
  //a partir dos vetores de posicao, criaremos vetores de momento angular
  let L_a=p5.Vector.cross(p5.Vector.mult(a.velocity,a.m),r_a);
  let L_b=p5.Vector.cross(p5.Vector.mult(a.velocity,b.m),r_b);  
  //let I_a=p5.Vector.magSq(r_a)*a.m;
  //let w_a=p5.Vector.div(L_a,I_a);
  //let I_b=p5.Vector.magSq(r_b)*b.m;
  //let w_b=p5.Vector.div(L_b,I_b);
  let I=p5.Vector.magSq(r_a)*a.m + p5.Vector.magSq(r_b)*b.m;
  let E_cin1= p5.Vector.magSq(a.velocity)*a.m;
  let E_cin2= p5.Vector.magSq(b.velocity)*b.m;
  //calculando o valor de omega por conservação de energia (Ecin1+Ecin2=E_rotacao+E_lig)
  let w= Math.sqrt(2*I*(E_cin1+E_cin2-E_lig));
  return[v_centro_de_massa,w];
}