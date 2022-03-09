FROM node:16-alpine

WORKDIR /usr/app

COPY . .

RUN yarn



#RUN npx prisma migrate deploy

#RUN npx prisma generate

#RUN yarn

#EXPOSE ${PORT}

#ENTRYPOINT ["yarn", "dev"]
