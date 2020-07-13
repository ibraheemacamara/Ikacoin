import express from 'express';
import bodyParser from 'body-parser';
import { generateNextBlock, getBlockchain } from './blockchain';
const httpPort = 3000;
const initHttpServer = (myHttpPort) => {
    const app = express();
    app.use(bodyParser.json());
    app.get('/blocks', (req, res) => {
        res.send(getBlockchain());
    });
    app.get('/mineBlock', (req, res) => {
        const block = generateNextBlock(req.body.data);
        res.send(block);
    });
    // app.get('/peers', (req, res) => {
    //     res.send(getSockets().map(( s: any ) => s._socket.remoteAddress + ':' + s._socket.remotePort));
    // });
    // app.post('/addPeer', (req, res) => {
    //     connectToPeers(req.body.peer);
    //     res.send();
    // });
    app.listen(myHttpPort, () => {
        console.log('Listening http on port: ' + myHttpPort);
    });
};
initHttpServer(httpPort);
//# sourceMappingURL=app.js.map