import { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken"
import { SECRET } from "../constants";

export default async function (app: FastifyInstance) {

  // https://stackoverflow.com/a/36821359/10908941
  app.get("/", async (_req, _res) => {
    //res.send("hi")
    app.io.use(async (socket, next) => {
      if (socket.handshake.query && socket.handshake.query.token) {
        try {
          let token: any = jwt.verify(socket.handshake.query.token as string, SECRET)
          socket.userId = token.id
          next()
        } catch (err) {
          next(new Error("auth error"))
        }
      }
    }).on('connection', async socket => {
      socket.emit("hi")
    })
  })
}

declare module "socket.io" {
  interface Socket {
    userId: string;
  }
}
