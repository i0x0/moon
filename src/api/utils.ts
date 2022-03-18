import { FastifyReply as Reply, FastifyRequest as Request } from "fastify"
import jwt from "jsonwebtoken"
import { SECRET } from "../constants"

export interface Response<T> {
  ok: boolean
  message: string
  data: T
}

const failure = <T>(message: string, data: T): Response<T> => {
  return {
    ok: false,
    message,
    data
  }
}

const success = <T>(message: string, data: T): Response<T> => {
  return {
    ok: true,
    message,
    data
  }
}

const forceAuth = async (req: Request, rep: Reply) => {
  const token = req.headers["authorization"]

  !token ? rep.unauthorized() : undefined
  let decoded = await jwt.verify(token as string, SECRET)
  if (decoded) {
    req.userId = decoded as string
  }
}

export {
  failure,
  success,
  forceAuth
}