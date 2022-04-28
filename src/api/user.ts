import { FastifyInstance } from "fastify";
import { forceAuth } from "./utils";

export default async function (app: FastifyInstance) {
  let prisma = app.prisma;
  app.get("/chats", { onRequest: await forceAuth }, async (req, rep) => {
    
  });
}
