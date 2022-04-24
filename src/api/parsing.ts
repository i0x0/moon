import { Static, Type } from '@sinclair/typebox'

// inside

enum InternalCommunicationTypes {
  NewMessage = "newMsg"
}

interface InternalNewMessage {
  type: InternalCommunicationTypes.NewMessage,
  data: {
    sender: string,
    chat: number,
    msg: string
  }
}

type InternalTypes = InternalNewMessage

type InternalMessage = { for: string } & InternalTypes

// outside

enum OutsideResponseEnum {
  SendMessage = "sendMsg"
}

const OutsideNewMessageSchema = Type.Object({
  type: Type.String({
    default: OutsideResponseEnum.SendMessage
  }),
  chat: Type.Number(),
  msg: Type.String()
})

//const OutsideResponseSchema = Type.Union([
//  OutsideNewMessageSchema
//])

const OutsideResponseSchema = OutsideNewMessageSchema

type OutsideResponseSchemaType = Static<typeof OutsideResponseSchema>

export {
  OutsideResponseSchema,
  OutsideResponseEnum,
  InternalCommunicationTypes
}

export type { InternalMessage, OutsideResponseSchemaType }
