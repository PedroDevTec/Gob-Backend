import { Request } from "express";
import { ITokenPayload } from "./userTypes";

declare module "express" {
  export interface Request {
    user?: ITokenPayload;
  }
}
