import type { UserDocument } from "./database.types";

declare global {
  namespace Express {
    interface User extends UserDocument {
      _id?: any;
      password?: any;
    }
  }
}
