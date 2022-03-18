import type { FastifyInstance } from "fastify";
import fastifySocketio from "fastify-socket.io";
import fastifySensible from "fastify-sensible";
import auth from "./auth";
import realtime from "./realtime";
import { failure } from "./utils";
import status from "statuses";

export default async function (app: FastifyInstance) {
  app.register(fastifySensible, { errorHandler: false })
  app.setNotFoundHandler((req, rep) => {
    rep.status(404).send(failure(`could not find ${req.url}`, null));
  });

  app.setErrorHandler(async (err, _req, rep) => {
    console.log(err)
    if (err.validation) {
      rep.status(400).send(failure("validation error", err.message))
      return
    }
    if (err.statusCode) {
      rep
        .status(err.statusCode)
        //.send(failure(status(err.statusCode) as string, err.message))
        .send(failure(status(err.statusCode) as string, err.cause ? err.cause : err.message ? err.message : null));

    } else {
      //rep.status(500).send(failure("internal server error", err.stack ? err.stack : null))
      rep.status(500).send(failure("internal server error", err.message))
    }
    // return rep.status(err.statusCode || 500).send(failure())
  });

  app.register(fastifySocketio, {
    path: "/rt",
  });

  app.register(realtime, { prefix: "/rt" });
  app.register(auth, { prefix: "/auth" });
}
