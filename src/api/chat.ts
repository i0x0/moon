import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { forceAuth, ok } from "./utils";

export default async function (app: FastifyInstance) {
  let prisma = app.prisma;

  let Create = Type.Object({
    name: Type.String(),
  });

  type CreateType = Static<typeof Create>;

  app.post<{ Body: CreateType }>(
    "/new",
    {
      schema: {
        body: Create,
      },
      onRequest: await forceAuth
    },
    async (req, rep) => {
      let { name } = req.body;
      //console.log(req.userId)
      await prisma.chat.create({
        data: { owner: { connect: { id: req.userId } }, name },
      });

      rep.send(ok())
    }
  );
}
