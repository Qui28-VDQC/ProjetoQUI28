# Introdução
O arquivo `initial_conditions.js`, como o nome sugere, é o que guarda as informações sobre as condições iniciais da simulação. Tais condições são
 - Raio e massa de cada átomo isolado (X e Y), definidos nos objetos `X` e `Y`;
 - Número de átomos que aparecerão no início da simulação e qual o tipo deles (`atom_num`), definidos no objeto `atom_num`;
 - Número de moléculas que aparecerão no início da simulação e qual o tipo delas (`molec_num`), definidos no objeto `molecule_num`;
 - Posição e velocidades iniciais dos atomos isolados, definidos no objeto `atom_initial_conditions`.

**As convenções de valores para átomos são as seguintes:**

 - A propriedade `pos` é um array, cujos elementos podem ser arrays ou strings. 
   - Caso queira uma posição determinada, utilize um array, com os componentes `x` e `y` da posição. Caso queira uma posição aleatória, escreva `"random"`. 
 - A propriedade `vel` é um array, que tem dentro dela arrays que contém a velocidade de cada átomo. 
   - Caso queira uma velocidade determinada, utilize um array. Caso queira uma velocidade aleatória, use UM número, que representará o módulo máximo da velocidade.

**As convenções de valores para moléculas são as seguintes:**

As informações iniciais de moléculas estão guardadas pelo objeto `molec_initial_conditions`. 

Aqui, caso queira utilizar uma molécula aleatória, faça `all_random:true`. Nesse caso, deve-se utilizar a seguinte formatação:
- `cm_pos` :[]    
- `cm_vel`: V_max , isto é, a maior magnitude que se queira da velocidade
- `ang` : []
- `omega` : Omega_max, isto é, a maior magnitude que se queira da velocidade angular

Obs.: `cm_pos` e `ang` não são acessados em momento algum (nesse caso), portanto seu valor é irrelevante

Caso se queira utilizar parâmetros determinados, utilize um array contendo as condições iniciais que se queira.   
 
# FUNCIONAMENTO INTERNO
## Aspectos gerais
As condições iniciais da simulação são definidas no arquivo `initial_conditions.js`. Todos os outros arquivos contém definições de classes e funções que serão usados na simulação. O arquivo `Simulator.js` contém as funções `setup` e `draw`, chamadas pelo p5. É o arquivo que de fato executa a simulação.

**Classes**
 - [Simulador](Simulator.md)
 - [Atom](Atom.md)
 - [Diatomic](Diatomic.md)

**Auxiliares**
 - [helper_funcs](helper_funcs.md)
 - `initial_conditions.js`
   - Arquivo com as condições iniciais do simulador. Explicado em detalhes no **MANUAL**
 - `reacao_mono.js` A FAZER









LÓGICA DA REAÇÃO
------------------

A2 -> A + A deltaH = Elig(A2)

A + B -> AB deltaH = -Elig(AB)

-------------
A2 + B -> AB + A DELTA H Elig(A2) - Elig(AB)
