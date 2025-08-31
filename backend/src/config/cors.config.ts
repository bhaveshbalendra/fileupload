import { CorsOptions } from "cors";
import { Env } from "./env.config";

//CORS options
const options: CorsOptions = {
  origin:
    Env.NODE_ENV === "production" ? Env.ALLOWED_ORIGIN : Env.ALLOWED_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  exposedHeaders: ["Authorization"],
};
export default options;
