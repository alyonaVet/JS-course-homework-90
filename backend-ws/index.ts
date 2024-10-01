import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import config from "./config";
import {WebSocket} from "ws";

const app = express();
const port = 8000;

expressWs(app);
app.use(cors(config.corsOptions));

const router = express.Router();

const connectedClients: WebSocket[] = [];

router.ws('/draw', (ws, req) => {
    connectedClients.push(ws);
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log('Received message:', message);
        connectedClients.forEach(clientWs => {
            clientWs.send(message);
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        const index = connectedClients.indexOf(ws);
        connectedClients.splice(index, 1);
    });
});

app.use(router);

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});