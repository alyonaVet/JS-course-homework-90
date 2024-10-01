import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import config from "./config";
import {WebSocket} from "ws";
import {Pixel} from "./types";

const app = express();
const port = 8000;

expressWs(app);
app.use(cors(config.corsOptions));

const router = express.Router();

const connectedClients: WebSocket[] = [];
const drawingData: Pixel[] = [];

router.ws('/draw', (ws, req) => {
    connectedClients.push(ws);

    ws.send(JSON.stringify({type: 'EXISTING_PIXELS', payload: drawingData}));

    ws.on('message', (clientPixel) => {
        try {
            const pixel = JSON.parse(clientPixel.toString()) as Pixel;
            drawingData.push(pixel);

            connectedClients.forEach(clientWs => {
                clientWs.send(JSON.stringify({type: 'DRAW', payload: pixel}));
            });
        } catch (error) {
            ws.send(JSON.stringify({error: error}));
        }
    });

    ws.on('close', () => {
        const index = connectedClients.indexOf(ws);
        connectedClients.splice(index, 1);
    });
});
app.use(router);

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});