import fastify, { FastifyInstance } from "fastify";
import fastifyNext from "fastify-nextjs";
import { COOKIE_SECRET, isProd, PORT } from './constants';
import apiRouter from "./api/router"
//import fastifyHelmet from "fastify-helmet";
import { PrismaClient } from "@prisma/client";
import fastifyRoutes from "fastify-routes"
import EventEmitter from "events";
import { isAuthed, log } from "./api/utils";
import { InternalCommunicationTypes, InternalMessage } from "./api/parsing";
import { NextUrlWithParsedQuery } from "next/dist/server/request-meta";
import fastifyCookie from "fastify-cookie";

export default class {
  private app: FastifyInstance
  private prisma: PrismaClient;
  private events: EventEmitter
  private roster: string[]
  constructor() {
    this.roster = []
    this.events = new EventEmitter();
    this.events.on('error', (err: any) => {
      console.log('eventError', err);
    })
    require('dotenv').config()
    this.prisma = new PrismaClient({
      log: isProd ? undefined : ['warn']
    })
    this.app = fastify({
      logger: true,
      pluginTimeout: 1200000
    })
    this.app.decorate("prisma", this.prisma)
    this.app.decorate("roster", this.roster)
    this.app.decorate("events", this.events)
    this.setup()
    this.app.listen(PORT, '0.0.0.0', (err) => {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      this.app.log.info("server started...")
      //log(this.app.routes)
    })
    this.eventsSetup()
  }

  setup() {
    let app = this.app
    app.register(fastifyCookie, {
      secret: COOKIE_SECRET
    })
    app.register(fastifyRoutes)
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

      app.addHook('onRequest', async (req, _rep) => {
        req.raw.isAuthed = await isAuthed(req)
      })

      app.next('/', async (app, req, rep) => {
        app.render(req.raw, rep.raw, '/main', req.query as undefined, {} as NextUrlWithParsedQuery)
      })
      app.next('/login')
    })
    app.setNotFoundHandler((_req, rep) => {
      //log(_req)
      return rep.nextRenderError(undefined)
    })

    app.setErrorHandler((err, _req, rep) => {
      return rep.nextRender("/error")
    })

    app.register(apiRouter, { prefix: '/api' })
  }

  eventsSetup() {
    this.prisma.$use(async (params, next) => {
      //if (params.model === 'Chat' && params.action === 'create') {
      //  let chat = params.args.data.chatId
      //  let _people = await this.prisma.chat.findUnique({
      //    where: {
      //      id: chat
      //    },
      //    select: {
      //      members: {
      //        select: {
      //          id: true
      //        }
      //      }
      //    }
      //  })
      //  let people = _people?.members
      //  console.log("_people", _people)
      //  console.log("people", people)
      //}

      if (params.model == 'Message' && params.action == 'create') {
        log("newPrismaMessage", params)
        log(params.args.data.chat)
        let chatId = params.args.data.chatId
        let people = await this.prisma.chat.findMany({
          where: {
            id: chatId
          },
          select: {
            members: {
              select: {
                id: true
              }
            }
          }
        })

        let members: string[] = []
        //log(people)
        //log(people[0].members)
        people[0].members.forEach(x => members.push(x.id))
        members.forEach(x => {
          if (this.roster.includes(x)) {
            this.events.emit('msgAlert', {
              for: x,
              type: InternalCommunicationTypes.NewMessage,
              data: {
                sender: params.args.data.sender.connect.id,
                chat: params.args.data.chat.connect.id,
                msg: params.args.data.content
              }
            } as InternalMessage)
          }
        })
      }
      return next(params)
    })
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
    roster: string[]
    events: EventEmitter
  }
  interface FastifyRequest {
    userId: string
  }
}

declare module 'http' {
  interface IncomingMessage {
    isAuthed: boolean
  }
}
