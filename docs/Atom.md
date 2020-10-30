`Atom.js`
----------------

Contém:
 - classe de átomo isolado
 - checagem de colisão átomo-átomo
 - execução da colisão átomo átomo
    
A classe `Atom` possui as **propriedades**:
 - `pos`: um vetor (p5.Vector) que indica  a posição do centro do átomo no canvas. Vale ressaltar que a origem do sistema de coordenadas está no canto superior esquerdo, e o eixo y aponta para baixo;
 - `velocity`: um p5.Vector que representa a velocidade do átomo. É  utilizada para atualizar a posição do átomo, de acordo com o método de Euler (com passos iguais ao intervalo de tempo em um frame). Assume-se idealidade, portanto a velocidade só muda em colisões;
 - `radius`: número, raio do átomo em questão;
 - `m`: massa do átomo. Utilizada para o cálculo de colisões. Note que a massa é completamente independente do raio do átomo;
 - `name`: nome do átomo, seu identificador. Utilizado para verificar se há reação entre dois átomos, e também para acessar propriedades das moléculas (como detalhado mais a frente).

A classe `Atom` possui os seguintes **métodos**:
 - `draw`: desenha um círculo no canvas, com o raio e posição atual do átomo. Deve ser chamado apenas na função draw do Simulador.
 - `update(dt)`: atualiza a posição do átomo de acordo com a sua velocidade. Recebe um intervalo de tempo, que será utilizado no cálculo do deslocamento. Também verifica se ocorrem colisões com a parede, verificando se há uma extremidade do átomo que ultrapassa a parede. Caso haja colisão, ocorre uma colisão elástica perfeitamente normal, isto, é a componente tangencial da velocidade é inalterada.

Neste arquivo temos também mais duas funções:
 - `check_collision(atom1, atom2)`: calcula o tempo necessário para que haja contato superficial entre os átomos passados como parâmetro. Usa o método explicado em Molecular dynamics simulation: elementary methods (J. M. HAILE), pág 125 do pdf que tá no nosso drive. Esse tempo é então usado no Simulador para verificar se há colisão entre os átomos em questão no frame atual, isto é, em um tempo menor que o tempo até o próximo frame. Nota-se também que a função retorna valores negativos de delta-t caso haja sobreposição entre os átomos ou eles estejam se afastando;
 - `collide(atom1, atom2)`: executa a colisão entre 2 átomos, utilizando noções simples de colisões bidimensionais de massas pontuais. Essa função se aproveita da passagem de objetos por referência para alterar diretamente a velocidade dos átomos colididos. Só é invocada no Simulador caso haja colisão, mas não reação, entre os dois átomos.