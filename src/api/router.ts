import type { FastifyInstance } from "fastify";
import fastifySensible from "fastify-sensible";
import fastifyWebsocket from "fastify-websocket"
import fastifyAuth from "fastify-auth";
import auth from "./auth";
import realtime from "./realtime";
import { failure } from "./utils";
import status from "statuses";
import chat from "./chat";
import { isProd } from "../constants";

export default async function (app: FastifyInstance) {
  app.register(fastifySensible, { errorHandler: false })
  app.register(fastifyAuth)
  app.register(fastifyWebsocket)
  app.setNotFoundHandler((req, rep) => {
    rep.status(404).send(failure(`could not find ${req.url}`, null));
  });

  app.setErrorHandler(async (err, _req, rep) => {
    !isProd ? console.log(err) : undefined;
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

  app.register(realtime, { prefix: "/rt" });
  app.register(auth, { prefix: "/auth" });
  app.register(chat, { prefix: "/chat" })
}
