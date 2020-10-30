`Diatomic.js`
--------------

Contém: 
 - Classe de molécula diatômica
 - Checagem de colisão e colisão entre átomos e moléculas diatômicas
 - Checagem de colisão e colisão entre duas moléculas diatômicas
 - Colisão com as paredes, conservando energia e momento

A classe `Diatomic` possui as seguintes propriedades:
 - `atom1` e `atom2`: são classes de átomos que irão formar as moléculas, para elas valem todas as propriedades da classe átomo, já citada.
 - `dist`: é um escalar que guarda a distancia entre os centros dos átomos. No geral, aqui, quer-se que dist = atom1.radius+ atom2.radius, para que os átomos fiquem "juntos" dando a real impressão de que realmente há uma ligação entre elas.
 - `cm_pos`: é um vetor que guarda a posição do centro de massa do conjunto atom1 e atom2.
 - `cm_vel`: é um vetor que guarda a velocidade do centro de massa do conjunto atom1 e atom2.
 - `n`: é um vetor que aponta do centro de massa até o atom1.
 - `ang`: é um número que armazena o angulo entre o eixo Ox e o vetor do centro de massa ao átomo 1 no sentido horário. Valor em RAD.
 - `omega`: é um vetor que guarda a velocidade angular do conjunto atom1 e atom2. Lembre-se que, pelo movimento estar restrito no plano xy, omega tem coordenadas x e y nulas.
 - `E_lig`: é um número. Representa a energia de ligação entre os átomos atom1 e atom2 na molécula.
 - `E_int`: é um número. Representa a energia interna do sistema atom1 e atom2
 - `translate(dt)`: método que a cada frame atualiza a posição do centro de massa (cm_pos) através da equação S=S_0+ V.dt, em que V é o vetor cm_vel.
 - `rotate(dt)`: faz o mesmo que translate, porém com o movimento de rotação. Utilizou-se aqui o vetor n, para mudar sua orientação a cada frame.
 - `atom_centers()`: método que altera e retorna a posição dos átomos numa lista
 - `atom_vels()`: metodo que atualiza a velocidade como v=omega x r, em que "x" representa a operação de produto vetorial. Retorna as novas velocidades numa lista