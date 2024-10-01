import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import config from "./config";

const app = express();
const port = 8000;

expressWs(app);
app.use(cors(config.corsOptions));

const router = express.Router();

router.ws('/draw', (ws, req) => {
    console.log('Client connected');

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

app.use(router);

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});