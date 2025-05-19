import express from 'express';

import { enviar_html, enviar_reservacion, ver_reservaciones} from '../functions/senator_functions.js';

export const senator_router = express.Router();

senator_router.get("/restaurante", enviar_html);

senator_router.get("/restaurante/:restaurante/:nombre/:cantidad/:hora",enviar_reservacion);

senator_router.get("/restaurante/ver/:restaurante/:hora", ver_reservaciones)
