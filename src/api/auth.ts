import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import { success } from "./utils";
import jwt from "jsonwebtoken"
import { SECRET } from "../constants";

export default async function (app: FastifyInstance) {
  let prisma = app.prisma;

  let Create = Type.Object({
    username: Type.String({ maxLength: 13, minLength: 3 }),
    password: Type.String(),
  });

  type CreateType = Static<typeof Create>;

  let Login = Type.Object({
    username: Type.String(),
    password: Type.String(),
  });

  type LoginType = Static<typeof Login>;

  app.post<{ Body: CreateType }>(
    "/create",
    {
      schema: {
        body: Create,
      },
    },
    async (req, rep) => {
      let { username, password } = req.body;
      let test = await prisma.user.findUnique({
        where: { username },
      });

      // console.log(test)

      if (test) {
        rep.badRequest("Username already used");
        return;
      }
      password = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          username,
          password,
          role: "USER",
        },
      });
      rep.send(success("ok", null));
    }
  );

  app.post<{ Body: LoginType }>(
    "/login",
    {
      schema: {
        body: Login,
      },
    },
    async (req, rep) => {
      let { username, password } = req.body;
      let test = await prisma.user.findUnique({
        where: { username },
      });

      // console.log(test)

      if (!test) {
        rep.badRequest("No account found with that username");
        return;
      }

      let rightPasssword = await bcrypt.compare(password, test.password);

      if (rightPasssword) {
        let token = await jwt.sign({
          id: test.id,
        }, SECRET)
        rep.send(success("ok", token));
      } else {
        rep.badRequest("Invalid password")
      }
    }
  );

  // app.get('/list', async (_, rep) => {
  //   rep.send(await prisma.user.findMany({}))
  // })
}
