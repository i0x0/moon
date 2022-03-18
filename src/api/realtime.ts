import { FastifyInstance } from "fastify";

export default async function(app: FastifyInstance) {
  app.get("/", async (_req, res) => {
    res.send("hi")
  })
}