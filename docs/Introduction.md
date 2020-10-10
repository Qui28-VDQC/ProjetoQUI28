# DOCUMENTAÇÃO

# MANUAL
    O arquivo initial_conditions, como o nome sugere, é o que guarda as informações sobre as condições iniciais da simulação. Tais condições são
    - Raio e massa de cada átomo isolado (X e Y), definidos nos objetos X e Y;
    - Número de átomos que aparecerão no início da simulação e qual o tipo deles (atom_num), definidos no objeto atom_num;
    - Número de moléculas que aparecerão no início da simulação e qual o tipo delas (molec_num), definidos no objeto molecule_num;
    - Posição e velocidades iniciais dos atomos isolados, definidos no objeto atom_initial_conditions.
    As convenções de valores para atomos são as seguintes:
    A propriedade 'pos' é uma array, cujos elementos podem ser arrays ou strings. Caso queira uma posição determinada, utilize uma array, com os componentes x e y da posição. Caso queira uma posição aleatória, escreva "random". 
    A propriedade 'vel' é uma array, que tem dentro dela arrays que contém a velocidade de cada átomo. Caso queira uma velocidade determinada, utilize uma array. Caso queira uma velocidade aleatória, use UM número, que representará o módulo máximo da velocidade.
    
    As convenções de valores para moléculas são as seguintes:
    As informações iniciais de moléculas estão guardadas pelo objeto molec_initial_conditions. 
    Aqui, caso queira utilizar uma molécula aleatória, faça all_random:true. Nesse caso, deve-se utilizar a seguinte formatação:
    - cm_pos :[]    
    - cm_vel: V_max , isto é, a maior magnitude que se queira da velocidade
    - ang : []
    - omega : Omega_max, isto é, a maior magnitude que se queira da velocidade angular
    * cm_pos e ang não são acessados em momento algum (nesse caso), portanto seu valor é irrelevante
    Caso se queira utilizar parâmetros determinados, utilize uma array contendo as condições iniciais que se queira.   
 
 # FUNCIONAMENTO INTERNO
        Aspectos gerais
As condições iniciais da simulação são definidas no arquivo initial_conditions.js. Todos os outros arquivos contém definições de classes e funções que serão usados na simulação. O arquivo Simulador.js contém as funções setup e draw, chamadas pelo p5. É o arquivo que de fato executa a simulação.

        Atom.js
Contém:
    - classe de átomo isolado
    - checagem de colisão átomo-átomo
    - execução da colisão átomo átomo
    
A classe Atom possui as propriedades:
    - pos: um vetor (p5.Vector) que indica  a posição do centro do átomo no canvas. Vale ressaltar que a origem do sistema de coordenadas está no canto superior esquerdo, e o eixo y aponta para baixo;
    - velocity: um p5.Vector que representa a velocidade do átomo. É  utilizada para atualizar a posição do átomo, de acordo com o método de Euler (com passos iguais ao intervalo de tempo em um frame). Assume-se idealidade, portanto a velocidade só muda em colisões;
    - radius: número, raio do átomo em questão;
    - m: massa do átomo. Utilizada para o cálculo de colisões. Note que a massa é completamente independente do raio do átomo;
    - name: nome do átomo, seu identificador. Utilizado para verificar se há reação entre dois átomos, e também para acessar propriedades das moléculas (como detalhado mais a frente).
A classe Atom possui os seguintes métodos:
    - draw: desenha um círculo no canvas, com o raio e posição atual do átomo. Deve ser chamado apenas na função draw do Simulador.
    - update(dt): atualiza a posição do átomo de acordo com a sua velocidade. Recebe um intervalo de tempo, que será utilizado no cálculo do deslocamento. Também verifica se ocorrem colisões com a parede, verificando se há uma extremidade do átomo que ultrapassa a parede. Caso haja colisão, ocorre uma colisão elástica perfeitamente normal, isto, é a componente tangencial da velocidade é inalterada.
Neste arquivo temos também mais duas funções:
    - check_collision(atom1, atom2): calcula o tempo necessário para que haja contato superficial entre os átomos passados como parâmetro. Usa o método explicado em Molecular dynamics simulation: elementary methods (J. M. HAILE), pág 125 do pdf que tá no nosso drive. Esse tempo é então usado no Simulador para verificar se há colisão entre os átomos em questão no frame atual, isto é, em um tempo menor que o tempo até o próximo frame. Nota-se também que a função retorna valores negativos de delta-t caso haja sobreposição entre os átomos ou eles estejam se afastando;
    - collide(atom1, atom2): executa a colisão entre 2 átomos, utilizando noções simples de colisões bidimensionais de massas pontuais. Essa função se aproveita da passagem de objetos por referência para alterar diretamente a velocidade dos átomos colididos. Só é invocada no Simulador caso haja colisão, mas não reação, entre os dois átomos.

        Diatomic.js
        Contém: 
        - classe de molécula diatômica
        - Checagem de colisão e colisão entre átomos e moléculas diatômicas
        - Checagem de colisão e colisão entre duas moléculas diatômicas
        - Colisão com as paredes, conservando energia e momento

        A classe Diatomic possui as seguintes propriedades:
        - atom1 e atom2: são classes de átomos que irão formar as moléculas, para elas valem todas as propriedades da classe átomo, já citada.
        - dist: é um escalar que guarda a distancia entre os centros dos átomos. No geral, aqui, quer-se que dist = atom1.radius+ atom2.radius, para que os átomos fiquem "juntos" dando a real impressão de que realmente há uma ligação entre elas.
        - cm_pos: é um vetor que guarda a posição do centro de massa do conjunto atom1 e atom2.
        - cm_vel: é um vetor que guarda a velocidade do centro de massa do conjunto atom1 e atom2.
        - n: é um vetor que aponta do centro de massa até o atom1.
        - ang: é um número que armazena o angulo entre o eixo Ox e o vetor do centro de massa ao átomo 1 no sentido horário. Valor em RAD.
        - omega: é um vetor que guarda a velocidade angular do conjunto atom1 e atom2. Lembre-se que, pelo movimento estar restrito no plano xy, omega tem coordenadas x e y nulas.
        - E_lig: é um número. Representa a energia de ligação entre os átomos atom1 e atom2 na molécula.
        - E_int: é um número. Representa a energia interna do sistema atom1 e atom2
        - translate (dt): método que a cada frame atualiza a posição do centro de massa (cm_pos) através da equação S=S_0+ V.dt, em que V é o vetor cm_vel.
        - rotate (dt): faz o mesmo que translate, porém com o movimento de rotação. Utilizou-se aqui o vetor n, para mudar sua orientação a cada frame.
        - atom_centers(): método que altera e retorna a posição dos átomos numa lista
        - atom_vels(): metodo que atualiza a velocidade como v=omega x r, em que "x" representa a operação de produto vetorial. Retorna as novas velocidades numa lista
    
        Simulador.js
Executa a simulação. Contém:
    - construtores para os diferentes tipos de átomos;
    - uma lista de todas as partículas da simulação, um buffer para adição de partículas e outro para sua remoção;
    -as funções setup e draw.

Os construtores visam mitigar possíveis erros na construção de novos átomos ou moléculas. Deseja-se criar dois tipos distintos de átomos, que podem ser instanciados diversas vezes. Assim, para cada tipo, temos que o raio, a massa e o nome são constantes. O construtor apenas garante que toda vez que um átomo de tal tipo for construído, ele terá as propriedades corretas. O mesmo vale para moléculas, que se restringem a 3 tipos (combinações dos átomos). Note que o parâmetro desses construtores é o valor de retorno das funções eval_atom_init_cond e eval_molec_init_cond, descritas no arquivo helper_funcs.

A lista de partículas reúne átomos e moléculas de todos os tipos. Como deve haver verificação de colisão entre quaisquer par de partículas, é conveniente reuni-las todas em um único array. Já os buffers de adição e remoção servem para lidar com reações. Reações são executadas no loop de colisões, que percorre todas os pares de partículas. Em uma reação, há partículas criadas e destruídas. No entanto, não é conveniente alterar uma lista durante um loop que a percorre. Portanto, estes buffers guardam a informação das adições e remoções até o fim deste loop. O loop de adições contém as novas partículas, isto é, objetos; já o buffer de remoções contém os índices das partículas a serem removidas.

Na função setup, basicamente consulta-se o arquivo de condições iniciais e popula-se a lista de partículas. Na função draw, há um loop de verificação de colisões, que verifica se há colisão entre cada par de partículas, apenas uma vez (através de um loop por todas as partículas, dentro do qual há um loop pelas partículas seguintes). Se houver colisão, verifica-se se há reação (no momento implementado apenas para reação átomo-átomo) ou apenas colisão elástica. Em seguida, atualizam-se as posições das partículas através de seus métodos update. Por fim, as partículas são desenhadas no canvas.
        initial_conditions.js
Arquivo com as condições iniciais do simulador. Explicado em detalhes no MANUAL

        reacao_mono.js

        helper_funcs.js
Contém uma série de funções auxiliares, usadas nos outros arquivos. Talvez deva ser quebrado em vários arquivos. As seguintes funções são implementadas aqui:
    - zero_cond(): retorna um objeto que contém as propriedades pos e vel, que são vetores com x e y nulos. Criada exclusivamente por conveniência, para construir os átomos passados ao construtor da Diatomic;
    - lin_interpol(v1, v2, frac):faz uma interpolação linear entre v1 e v2, que podem ser arrays (unidimensionais) ou números. frac é a fração de v2 no valor de retorno, e portanto deve ser um número entre 0 e 1. No caso de vetores, a interpolação é feita para cada coordenada. Fórmula usada: (1-frac) * v1 + frac * v2;
    - rand_pos(): retorna uma posição aleatória pertencente ao canvas, para uso na instanciação de átomos e moléculas. Não há verificação de colisão com a parede, por simplicidade. Contudo, os átomos e moléculas são capazes de imediatamente realizar uma colisão estática da parede, corrigindo este problema;
    - rand_vel(max_mag): retorna um vetor aleatório, de magnitude máxima max_mag. Para geração de velocidades aleatórias. Note que, se a área delimitada pelos possíveis vetores gerados por rand_pos era um retângulo, a área delimitada pelos possíveis vetores dessa função é um círculo;
    - eval_atom_init_cond(atom_cond, i):
    - eval_molec_init_cond(molec_cond, i):
    - project(v, a): projeta v em a. Ambos devem ser vetores do p5.
    - Bhaskara(a, b, c): retorna as soluções da equação de ax^2+bx+c=0 em um array, ou null se não houver soluções reais. Se houver raíz dupla, o array tem 2 elementos iguais. Necessária para a colisão superelástica de moléculas com a parede.
