import fastify, { FastifyInstance } from "fastify";

export default class Server {
  public api: FastifyInstance;

  constructor() {
    this.api = fastify();
    this.api
      .listen(3001, "0.0.0.0")
      .then(() => {
        console.log('api started...')
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
