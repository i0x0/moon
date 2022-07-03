import { FastifyInstance } from "fastify";
import { forceAuth, success } from "./utils";

export default async function (app: FastifyInstance) {
  let prisma = app.prisma;
  app.get("/chats", { onRequest: await forceAuth }, async (req, rep) => {
    let data = await prisma.user.findUnique({
      where: {
        id: req.userId
      },
      select: {
        chats: {
          select: {
            name: true,
            color: true,
            img: true,
            id: true
          }
        }
      }
    })
    rep.send(success(null, data?.chats))
  });
}
