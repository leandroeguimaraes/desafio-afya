FROM node:19-alpine as base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM base as production

ENV NODE_ENV=production

CMD ["npm", "run", "start:prod"]

FROM base as development

ENV NODE_ENV=development

CMD ["npm", "run", "start:dev"]