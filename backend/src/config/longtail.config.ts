import { Logtail } from "@logtail/node";
import { Env } from "./env.config";

export const createLogtail = (): Logtail | null => {
  if (!Env.LOGTAIL_SOURCE_TOKEN) {
    return null;
  }
  const opts = Env.LOGTAIL_INGESTING_HOST
    ? { endpoint: Env.LOGTAIL_INGESTING_HOST }
    : (undefined as unknown as { endpoint?: string });
  return new Logtail(Env.LOGTAIL_SOURCE_TOKEN, opts);
};
