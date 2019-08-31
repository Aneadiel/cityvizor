import express from "express";

const router = express.Router();

export const Routers = router;

import { ApiRouter } from "./api";
import { SearchRouter } from "./search";
import { StaticRouter } from "./static";
import { ImportRouter } from "./import";

router.use("/api", ApiRouter);

router.use("/import", ImportRouter)

router.use("/api/search", SearchRouter);

router.use(StaticRouter);