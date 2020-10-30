`Simulator.js`
--------------

Executa a simulação. Contém:
 - Construtores para os diferentes tipos de átomos;
 - Uma lista de todas as partículas da simulação, um buffer para adição de partículas e outro para sua remoção;
 - As funções setup e draw.

Os construtores visam mitigar possíveis erros na construção de novos átomos ou moléculas. Deseja-se criar dois tipos distintos de átomos, que podem ser instanciados diversas vezes. Assim, para cada tipo, temos que o raio, a massa e o nome são constantes. O construtor apenas garante que toda vez que um átomo de tal tipo for construído, ele terá as propriedades corretas. O mesmo vale para moléculas, que se restringem a 3 tipos (combinações dos átomos). Note que o parâmetro desses construtores é o valor de retorno das funções eval_atom_init_cond e eval_molec_init_cond, descritas no arquivo helper_funcs.

A lista de partículas reúne átomos e moléculas de todos os tipos. Como deve haver verificação de colisão entre quaisquer par de partículas, é conveniente reuni-las todas em um único array. Já os buffers de adição e remoção servem para lidar com reações. Reações são executadas no loop de colisões, que percorre todas os pares de partículas. Em uma reação, há partículas criadas e destruídas. No entanto, não é conveniente alterar uma lista durante um loop que a percorre. Portanto, estes buffers guardam a informação das adições e remoções até o fim deste loop. O loop de adições contém as novas partículas, isto é, objetos; já o buffer de remoções contém os índices das partículas a serem removidas.

Na função setup, basicamente consulta-se o arquivo de condições iniciais e popula-se a lista de partículas. Na função draw, há um loop de verificação de colisões, que verifica se há colisão entre cada par de partículas, apenas uma vez (através de um loop por todas as partículas, dentro do qual há um loop pelas partículas seguintes). Se houver colisão, verifica-se se há reação (no momento implementado apenas para reação átomo-átomo) ou apenas colisão elástica. Em seguida, atualizam-se as posições das partículas através de seus métodos update. Por fim, as partículas são desenhadas no canvas.