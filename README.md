<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->


# Instalação

```bash
$ npm install
```

# Configuração

  ## Variaveis de ambiente

Crie um arquivo .env e development.env e siga os modelos de exemplo (.env.example e .development.env.example)

.env

```bash
NODE_ENV=production
PORT=3000
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=desafio-afya
JWT_SECRET=secret
JWT_EXPIRES=1h 
REFRESH_TOKEN_EXPIRES=7d
PGADMIN_DEFAULT_EMAIL=[seu email]
PGADMIN_DEFAULT_PASSWORD=[sua senha] 
```
.development.env

```bash
NODE_ENV=development
PORT=3000
POSTGRES_HOST=db_dev
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=desafio-afya
JWT_SECRET=secret
JWT_EXPIRES=7d 
REFRESH_TOKEN_EXPIRES=7d
PGADMIN_DEFAULT_EMAIL=[seu email]
PGADMIN_DEFAULT_PASSWORD=[sua senha] 
```

# Rodar a aplicação

  ## Em modo desenvolvimento

```bash
$ docker compose up dev
```
  ## Em modo produção 

```bash
$ docker compose up prod
```
  ## Para alguns casos de erros ao rodar docker compose:
  
  Erro 1:

  sh: nest: not found

  Solução:

  ```bash
  npm install -g @nestjs/cli
  ```

  Erro 2:

  ```bash
  npm ERR! path /app
  desafio-afya-dev-1  | npm ERR! command failed
  desafio-afya-dev-1  | npm ERR! signal SIGTERM
  desafio-afya-dev-1  | npm ERR! command sh -c NODE_ENV=development nest start --watch
  ```
  Solução:

  Rode os comandos:

  ```bash
  npm cache clean --force
  ```
  ```bash
  npm install -g npm@latest
  ```

  ## Banco de dados

Configure seu o banco de dados postgres utilizando com as configurações usadas nessas variaveis, para rodar o banco localmente:

```bash
POSTGRES_HOST=db_dev
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=desafio-afya
```
Caso tenha sido em modo production, use essas:

```bash
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=desafio-afya
```
# ATENÇÃO: CRIAR USUÁRIO ROLE:ADMIN e USUÁRIO ROLE:DOCTOR

Para testar o fluxo da a aplicação, é necessário criar um usuário com role admin.

A forma mais fácil é desabilitando as guards da rota: {URL_API}/admin/users - method POST

No código:

Comente esses decorators no arquivo "users.controller.ts"

```bash
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(EnumRole.ADMIN)
```
E realize as requisições:

Para criar usuário com role:ADMIN

```bash
curl --request POST \
  --url {URL_API}/admin/users \
  --header 'Content-Type: application/json' \
  --data '{
	"name":"admin",
	"email":"admin@gmail.com",
	"password":"!Teste123",
	"role":"admin"
}'
```

Desfaça o comentário esses decorators no arquivo "users.controller.ts"

```bash
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(EnumRole.ADMIN)
```

Depois basta fazer o login para receber o token de acesso.

Para testar um usuário com role doctor, basta criá-lo com seu token de acesso de admin na mesma rota, {URL_API}/admin/users - method POST

E agora assim, é possível testar a aplicação com os dois roles ;)

# Comandos

## Teste

```bash
# unit tests
$ npm run test

```

## Lint

```bash
# lint
$ npm run lint
```

## Migration

```bash
# migration
$ npm migration:run
```

# Diagram ER

O diagrama está localizado na raiz do projeto "ER_Diagram.png"

# CI Pipeline

Foi adicionado as etapas de CI:
  - install, lint, tests, build e sonar cloud

Gatilho: develop branch
Diretório no projeto: .github/workflows/ci.yaml

```bash
name: CI - Development

on:
  pull_request:
    branches: 
      - develop 

jobs:
  check-app:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '19.x'

      - name: Install dependencies
        run: npm install

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm run test

      - name: Build
        run: npm run build

      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}  
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
  ```

# CD Pipeline

Foi adicionado as etapas de CD:
  - ci, lint, test, build.

Gatilho: main branch
Diretório no projeto: buildspec.yml

```bash
version: 0.2

phases:
  build:
    commands:
      - npm ci
      - npm run lint
      - npm run test
      - npm run build

artifacts:
  files:
    - '**/*'
```

# Documentação

  Foi utlizado Swagger:

    URL: {URL_API}/api

# Hospedagem

  ## Aplicação:

    Aplicação hospedada na AWS BeanStalk se comunicando com o Banco de dados Postgres na AWS RDS

    URL: http://desafio-afya-api-prod.sa-east-1.elasticbeanstalk.com/

  ## Banco de dados:
    
    Banco dedados Postgres hospedado na AWS RDS:

    POSTGRES_HOST=db-pg-prod.cpd6bgckqpiu.sa-east-1.rds.amazonaws.com

  ## CI/CD

    Foi utilizado Aws Code Pipeline e Aws Code Build

  ## Usuário admin 
  
  Usuário admin registrado no banco de produção:

  ```bash
      {
        "name":"admin",
        "email":"admin@gmail.com",
        "password":"!Teste123",
        "role":"admin"
      }
  ```
   
## License

Nest is [MIT licensed](LICENSE).
