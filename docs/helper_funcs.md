`helper_funcs.js`
------------------

Contém uma série de funções auxiliares, usadas nos outros arquivos. Talvez deva ser quebrado em vários arquivos. As seguintes funções são implementadas aqui:
 - `zero_cond()`: retorna um objeto que contém as propriedades pos e vel, que são vetores com x e y nulos. Criada exclusivamente por conveniência, para construir os átomos passados ao construtor da Diatomic;
 - `lin_interpol(v1, v2, frac)`:faz uma interpolação linear entre v1 e v2, que podem ser arrays (unidimensionais) ou números. frac é a fração de v2 no valor de retorno, e portanto deve ser um número entre 0 e 1. No caso de vetores, a interpolação é feita para cada coordenada. Fórmula usada: (1-frac) * v1 + frac * v2;
 - `rand_pos()`: retorna uma posição aleatória pertencente ao canvas, para uso na instanciação de átomos e moléculas. Não há verificação de colisão com a parede, por simplicidade. Contudo, os átomos e moléculas são capazes de imediatamente realizar uma colisão estática da parede, corrigindo este problema;
 - `rand_vel(max_mag)`: retorna um vetor aleatório, de magnitude máxima max_mag. Para geração de velocidades aleatórias. Note que, se a área delimitada pelos possíveis vetores gerados por rand_pos era um retângulo, a área delimitada pelos possíveis vetores dessa função é um círculo;
 - `eval_atom_init_cond(atom_cond, i)`:
 - `eval_molec_init_cond(molec_cond, i)`:
 - `project(v, a)`: projeta v em a. Ambos devem ser vetores do p5.
 - `Bhaskara(a, b, c)`: retorna as soluções da equação de ax^2+bx+c=0 em um array, ou null se não houver soluções reais. Se houver raíz dupla, o array tem 2 elementos iguais. Necessária para a colisão superelástica de moléculas com a parede.