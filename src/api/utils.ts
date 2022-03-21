import { FastifyReply as Reply, FastifyRequest as Request } from "fastify";
import jwt from "jsonwebtoken";
import { SECRET } from "../constants";

export interface Response<T> {
  ok: boolean;
  message: string;
  data: T;
}

const failure = <T>(message: string, data: T): Response<T> => {
  return {
    ok: false,
    message,
    data,
  };
};

const success = <T>(message: string, data: T): Response<T> => {
  return {
    ok: true,
    message,
    data,
  };
};

const forceAuth = async (req: Request, rep: Reply) => {
  const token = req.headers["authorization"];

  if (!token) {
    console.log("uhh no token?");
    return rep.unauthorized();
  } else {
    // token ? rep.unauthorized() : undefined
    let decoded: any = await jwt.verify(token, SECRET);
    if (decoded) {
      req.userId = decoded.id;
    }
  }
};

const ok = () => {
  return success("ok", null);
};

export { failure, success, forceAuth, ok };
