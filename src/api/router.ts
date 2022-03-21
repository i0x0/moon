import type { FastifyInstance } from "fastify";
import fastifySensible from "fastify-sensible";
import fastifySocketio from "fastify-socket.io";
import fastifyAuth from "fastify-auth";
import auth from "./auth";
import realtime from "./realtime";
import { failure } from "./utils";
import status from "statuses";
import chat from "./chat";

export default async function (app: FastifyInstance) {
  app.register(fastifySensible, { errorHandler: false })
  app.register(fastifyAuth)
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
        .send(failure((status(err.statusCode) as string).toLowerCase(), err.cause ? err.cause : err.message ? err.message : null));

    } else {
      //rep.status(500).send(failure("internal server error", err.stack ? err.stack : null))
      rep.status(500).send(failure("internal server error", err.message))
    }
    // return rep.status(err.statusCode || 500).send(failure())
  });


  app.register(fastifySocketio, {
    path: "/rt/"
  }).after((err) => {
    if (err) {
      console.error(err)
    }
  });
  app.register(realtime, { prefix: "/rt" });
  app.register(auth, { prefix: "/auth" });
  app.register(chat, { prefix: "/chat" })
}
