import express from "express";

export const router = express.Router();

import { ApiRouter } from "./api";
import { SearchRouter } from "./search";
import { StaticRouter } from "./static";

router.use("/api", ApiRouter);

router.use("/api/search", SearchRouter);

router.use(StaticRouter);