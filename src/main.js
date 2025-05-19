import express from "express"
import { senator_router } from './routers/senator_routers.js'

export const app = express()

app.use("/", senator_router);
