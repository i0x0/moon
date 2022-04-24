import { FastifyInstance } from "fastify";
import { InternalMessage, OutsideResponseEnum, OutsideResponseSchema, OutsideResponseSchemaType } from "./parsing";
import { failure, forceAuth, ok, removeItem } from "./utils";
import jsonschema from "jsonschema";
import { log } from "./utils";

let validate = jsonschema.validate
let { stringify } = JSON
export default async function (app: FastifyInstance) {
  let { roster, prisma } = app

  app.get('/', { websocket: true, onRequest: await forceAuth }, async (conn, req) => {
    let { userId } = req
    roster.push(userId)
    app.events.on('msgAlert', (data: InternalMessage) => {
      if (data.for === userId) {
        log("msgAlert", data)
        conn.socket.send(stringify({ type: data.type, ...data.data }))
      } else {
        return
      }
    })

    conn.socket.on('close', () => {
      roster = removeItem(roster, userId)
    })
    conn.socket.on('message', async message => {
      log("new msg")
      //console.log(message)
      //console.log(message.toString('utf-8'))
      let msg = message.toString('utf-8')
      let res: any;
      try {
        res = JSON.parse(msg)
      } catch {
        conn.socket.close()
      }

      let result = await validate(res, OutsideResponseSchema)
      log(result)
      log(result.valid)
      if (result.valid === false) {
        let _errors: string[] = []
        result.errors.forEach(x => _errors.push(x.message))
        let errors = _errors.join(', ')
        log("errors", errors)
        log("hi")
        //conn.socket.send("hi")
        conn.socket.send(stringify(failure("failed to parse data", _errors)), (err => log(err)))
        return
      }
      //conn.socket.send(stringify(ok()))
      let data: OutsideResponseSchemaType = result.instance
      switch (data.type) {
        case OutsideResponseEnum.SendMessage:
          let chat = await prisma.chat.findMany({
            where: {
              id: data.chat,
              AND: {
                members: {
                  some: {
                    id: userId
                  }
                }
              }
            },
          })
          if (chat.length === 0) {
            conn.socket.send(stringify(failure("no chat found or not in specified chat", null)),)
            return
          } else {
            log(chat)
            await prisma.message.create({
              data: {
                chat: {
                  connect: {
                    id: chat[0].id,
                  }
                },
                sender: {
                  connect: {
                    id: userId
                  }
                },
                content: data.msg
              }
            })
          }
          break;

      }

      // message.toString() === 'hi from client'
    })
    conn.socket.send('hi from server')
  })
}

