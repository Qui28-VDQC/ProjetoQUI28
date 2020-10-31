import { Atom } from './Atom.js'
import { vec2, vec3 } from "gl-matrix"
import { Diatomic } from './Diatomic.js'
import { E_table } from './initial_conditions.js'

function test_mono_mono(atom1: Atom, atom2: Atom, E_bond: number, E_activation: number) {
  //r: vector that connects the atoms' centers
  let r: vec2 = [0.0, 0.0]; 
  vec2.sub(r, atom1.pos, atom2.pos);
  //Normalize r
  vec2.normalize(r, r); 
  //Verify if the energy of the system is greater than the activation energy
  let reduced_mass: number = atom1.m * atom2.m / (atom1.m + atom2.m);
  //Relative velocity
  let v_rel: vec2 = [0.0, 0.0]; 
  vec2.sub(v_rel, atom1.velocity, atom2.velocity); //v_rel = v1 - v2
  vec2.dot(v_rel, r);
  /* E_collision: Energy related to the approximation/relative velocity of the atoms
    The effective collision energy of the two atoms is given by the component
    of the relative velocity that is aligned to the direction which connects their centers(r).

    The 'tangent velocity'(i.e. the component perpendicular to r) does not contribute to this energy
  */
  let E_collision: number = 0.5 * reduced_mass * vec2.dot(v_rel, r) ** 2;
  return E_collision > E_activation;
}


//função calcula velocidade do centro de massa e velocidades angulares dada a energia de ligação e velocidades dos atomos
//This function calculates the Center of Mass(CM) velocity and the angular velocities
//given the bond energy and the velocities of each atom
function react_mono_mono(atom1: Atom, atom2: Atom, E_bond: number, E_activation: number) {
  //r: vector that connects the atoms' centers
  let r: vec2 = [0.0, 0.0]; 
  vec2.sub(r, atom1.pos, atom2.pos);
  //Verify if the energy of the system is greater than the activation energy
  let reduced_mass: number = atom1.m * atom2.m / (atom1.m + atom2.m);
  //Relative velocity
  let v_rel: vec2 = [0.0, 0.0]; 
  vec2.sub(v_rel, atom1.velocity, atom2.velocity); //v_rel = v1 - v2
  vec2.dot(v_rel, r);
  //Energy related to the approximation/relative velocity of the atoms
  let E_collision: number = 0.5 * reduced_mass * vec2.dot(v_rel, r) ** 2;

  //CM formula:
  //CM = (m1.r1 + m2.r2) / (m1 + m2)
  let CM: vec2 = [atom1.m * atom1.pos[0] + atom2.m * atom2.pos[0],
                 atom1.m * atom1.pos[1] + atom2.m * atom2.pos[1]];
  vec2.scale(CM, CM, 1/(atom1.m + atom2.m));

  //Angle theta
  let temp: vec2 = [0.0, 0.0];
  vec2.subtract(temp, atom1.pos, CM);
  let theta: number = vec2.angle(temp, [1.0, 0.0]);
  //deve se trocar o sinal devido a ordem dos vetores no "angleBetween"
  //TODO: Check if this is valid
  theta *= -1;
  // V_CM=(m1*v1+m2*v2)/(m1+m2)
  let V_CM: vec2 = [atom1.m * atom1.velocity[0] + atom2.m * atom2.velocity[0],
                    atom1.m * atom1.velocity[1] + atom2.m * atom2.velocity[1]];
  let r_a: vec2 = [0.0, 0.0];
  let r_b: vec2 = [0.0, 0.0];
  vec2.subtract(r_a, CM, atom1.pos);
  vec2.subtract(r_b, CM, atom1.pos);
  //a partir dos vetores de posicao, criaremos vetores de momento angular
  //TODO: Is it necessary to create an angular momentum vector?
  //isn't a scalar enough?
  let L_a: vec3 = [0.0, 0.0, 0.0];
  let L_b: vec3 = [0.0, 0.0, 0.0];
  vec2.cross(L_a, [atom1.m * atom1.velocity[0], atom1.m * atom1.velocity[1]], r_a);
  vec2.cross(L_b, [atom2.m * atom2.velocity[0], atom2.m * atom2.velocity[1]], r_b);

  //Moment of Inertia
  let I = vec2.sqrLen(r_a) * atom1.m + vec2.sqrLen(r_b) * atom2.m;
  //calculando o valor de omega por conservação de energia (Ecin1+Ecin2=E_rotacao+E_lig)
  vec3.add(L_a, L_a, L_b);
  vec3.scale(L_a, L_a, I);
  let omega = L_a[2];
  
  return new Diatomic(atom1, atom2, atom1.radius + atom2.radius,
    CM, V_CM, theta, omega, E_table(atom1.name+atom2.name).BOND, E_collision);
}