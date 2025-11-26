# Aplicação isbet-forms - Back-end

Esse é o Back-end da aplicação isbet-forms.

## Tecnologias utilizadas

- Node.js para o codigo da aplicação no geral
- Framework Express
- MongoDB para o banco de dados
- JWT para geração de tokens utilizados na autenticação

## Como rodar a aplicação

1 - Será necessário o mongoDB estar rodando, pode ser o mongoDB local na sua máquina ou pelo mongoDB atlas.

2 - crie um arquivo chamado .env.local

3 - crie as seguintes variaveis no arquivo:

```
DB_URI=
PORT=
JWT_SECRET=
```

- **DB_URI**: o caminho para o seu banco de dados mongoDB
- **PORT**: a porta em que o back-end rodará
- **JWT_SECRET**: uma string que será utilizada na geração de tokens para o JWT

4 - Rode o comando npm install para instalar depedências

5 - Rode a aplicação com 

```
node index.js
```
ou
```
npm run dev
```
