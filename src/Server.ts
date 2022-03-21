import fastify, { FastifyInstance } from "fastify";
import fastifyNext from "fastify-nextjs";
import { isProd, PORT } from './constants';
import apiRouter from "./api/router"
//import fastifyHelmet from "fastify-helmet";
import { PrismaClient } from "@prisma/client";

export default class {
  private app: FastifyInstance
  private prisma: PrismaClient;

  constructor() {
    require('dotenv').config()
    this.prisma = new PrismaClient({
      log: isProd ? undefined : ['warn']
    })
    this.app = fastify({
      logger: true,
      pluginTimeout: 1200000
    })
    this.app.decorate("prisma", this.prisma)
    this.setup()
    this.app.listen(PORT, '0.0.0.0', (err) => {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      this.app.log.info("server started...")
    })
  }

  setup() {
    let app = this.app
    //app.register(fastifyHelmet, { contentSecurityPolicy: false })
    app.register(fastifyNext, {
      dev: !isProd,
      logLevel: 'debug',
      noServeAssets: false
    }).after((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      app.next('/')
      app.next('/main')
    })
    app.setNotFoundHandler((_req, rep) => {
      return rep.nextRenderError(undefined)
    })

    app.setErrorHandler((err, _req, rep) => {
      return rep.nextRenderError(err)
    })
    app.register(apiRouter, { prefix: '/api' })
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
  interface FastifyRequest {
    userId: string
  }
}
