FROM node:16-alpine

ARG DATABASE_URL
ARG PORT

WORKDIR /usr/app

COPY package.json ./

RUN yarn

COPY . .

#RUN npx prisma migrate deploy

RUN npx prisma generate

RUN yarn next build

#EXPOSE ${PORT}

ENTRYPOINT ["yarn", "prod:start"]
