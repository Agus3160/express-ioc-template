import { JwtPayload as BaseJwtPayload } from "jsonwebtoken"

export type JwtPayload = BaseJwtPayload & {
  id: number
}

export type Payload = {
  id: number
}