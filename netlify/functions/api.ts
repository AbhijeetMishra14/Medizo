import serverless from "serverless-http";

import { createServer } from "../../backend/server/index";

export const handler = serverless(createServer());
