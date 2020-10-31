# Projeto-QUI-28

## Novidades
Esta branch é dedicada a **refatorar** o código, deixando essa reta final de desenvolvimento ainda mais rápida e robusta.

Para isso, o projeto foi transformado em um **pacote** do Node.js. Ele é empacotado com o webpack, permitindo modularidade no código(através da sintaxe padronizada por ES6).
Além disso, o compilador do typescript faz uma análise estática dos tipos das variáveis. Assim, fica garantido que erros relacionados a tipos não aconteçam.

Para desenvolver, você precisa de:
 - [Node.js](https://nodejs.org/en/)
 - [npm](https://www.npmjs.com/)

Assim que clonar o repositório, você só precisa rodar 
```shell script
$ npm ci
$ npm run build
```

e, com isso, seus arquivos finais vão ficar em `dist/`. Daí é só abrir `dist/index.html` no seu navegador!

Ferramentas:
 - Node
 - npm
 - Typescript
 - webpack

## Observações

Por padrão, a configuração do webpack está em modo de **desenvolvimento**, **para facilitar a depuração/debugging**, principalmente através do [source map](https://webpack.js.org/guides/development/#using-source-maps).

Isso produzirá arquivos `.js` muito grandes! Então, assim que você for fazer uma versão final, ou simplesmente quando quiser aumentar a performance,
remova as seguintes linhas:

`webpack.config.js`

```js
mode: 'development', //Mude para mode: 'production' ou remova esta linha
devtool: 'inline-source-map', //Remova esta linha
```

`tsconfig.json`

```json
"sourceMap": true, //Remova esta linha
```

## Avisos

### Cuidado ao adicionar arquivos ao repositório.

### NÃO USE GIT ADD ., GIT COMMIT -A, etc.

Dê um git add em cada arquivo (se tiver vários use git add -i). Isso vai evitar que o repositório fique cheio de lixo. 
Lembre que não tem como apagar o lixo do repositório, ele sempre vai ficar no histórico, então enviar binários por 
exemplo é estritamente proibido.

### NÃO FAÇA COMMITS NA MASTER

A branch principal de desenvolvimento é a **master**, onde ocorrem as integrações entre feature branches que desenvolvem 
features específicas. Dessa maneira, **só são permitidos merges na master por pull requests**.

Não necessariamente a versão mais recente é a mais estável ou a que possui melhor desempenho, então guardamos 
a **versão final** na branch **VX.Y**(por exemplo, versão final 1.0 = **final-V1.0**). Também só é possível modificar a versão final
com pull requests e de preferência **somente após exaustivamente testados e aprovados**.
    
Quaisquer outras branches são auxiliares e devem ser nomeadas "prefixo"-"nome da branch". O prefixo é utilizado pra
identificar a função da branch e pode ser:
- "fix"
- "refactor"
- "feature"
- "document"
- "other"

## Alguns exemplos de uso:

* fix-energy-leak: Branch pra corrigir algum problema de falta de conservação de energia.
* refactor-tree-node: Branch para reestruturar classes ligadas aos nós de umar árvore.
* feature-atomic-bohr: Branch para implementar átomos segundo o modelo de Bohr.
* document-simulation-singleton: Branch para documentar a classe do simulador.
* other-cute-cat-pics: Branch com algum propósito carteado que não se encaixe nos anteriores. **Evite esse prefixo se possível**. 





