import express from 'express';
import bodyParser from 'body-parser';
import { Block, generateNextBlock, getBlockchain } from './blockchain';
import { getSockets, connectToPeers, initP2PServer} from './peer2peer';

const httpPort: number = parseInt(process.env.HTTP_PORT) || 3001;
const p2pPort: number = parseInt(process.env.P2P_PORT) || 6001;

const initHttpServer = (myHttpPort: number) => {
    const app =  express();
    app.use(bodyParser.json());

    app.get('/blocks', (req, res) => {
        res.send(getBlockchain());
    });
    app.get('/mineBlock', (req, res) =>{
        const block: Block = generateNextBlock(req.body.data);
        res.send(block);
    });
    app.get('/peers', (req, res) => {
        res.send(getSockets().map(( s: any ) => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    app.post('/addPeer', (req, res) => {
        console.log(req.body);
        connectToPeers(req.body.peer);
        res.send();
    });

    app.listen(myHttpPort, () => {
        console.log('Listening http on port: '+ myHttpPort);
    });

    app.post('/stop', (req, res) => {
        res.send({'msg' : 'stopping server'});
        process.exit();
    });
};

initHttpServer(httpPort);
initP2PServer(p2pPort);