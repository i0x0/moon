import { FastifyReply as Reply, FastifyRequest, FastifyRequest as Request } from "fastify";
import jwt from "jsonwebtoken";
import { isProd, SECRET } from "../constants";

export interface Response<T> {
  ok: boolean;
  message: string | null;
  data: T;
}

const failure = <T>(message: string | null, data: T): Response<T> => {
  return {
    ok: false,
    message,
    data,
  };
};

const success = <T>(message: string | null, data: T): Response<T> => {
  return {
    ok: true,
    message,
    data,
  };
};

const forceAuth = async (req: Request, rep: Reply) => {
  const token = req.cookies.id || req.headers["authorization"];
  //log(token)
  if (!token) {
    log("uhh no token?");
    rep.unauthorized();
  } else {
    // token ? rep.unauthorized() : undefined
    let decoded: any = await jwt.verify(token, SECRET);
    if (decoded) {
      req.userId = decoded.id;
    }
  }
};

const isAuthed = async (req: FastifyRequest): Promise<boolean> => {
  let token = req.cookies.id || req.headers["authorization"]
  //log(token)
  let res: boolean = false;
  if (!token) {
    res = false
  } else {
    let decoded: any = await jwt.verify(token, SECRET);
    if (decoded) {
      res = true
    }
  }
  return res
}

const ok = () => {
  return success("ok", null);
};

// https://stackoverflow.com/a/5767357/10908941
function removeItem<T>(arr: Array<T>, value: T): Array<T> {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

const log = (...data: any[]): void => {
  !isProd ? console.log(...data) : undefined;
}

function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}
export { failure, success, forceAuth, ok, removeItem, log, isAuthed, toTitleCase };
