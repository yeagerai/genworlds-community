const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const WORLD_INSTANCE_NAME = process.env.VUE_APP_IS_DEV ? 'world-instance' : 'localhost';
const REAL_WS_NAME = process.env.VUE_APP_IS_DEV ? 'real-ws' : 'localhost';
const MOCKED_WS_NAME = process.env.VUE_APP_IS_DEV ? 'mocked-ws' : 'localhost';
const BIT_FRONT_NAME = process.env.VUE_APP_IS_DEV ? '16bit-front' : 'localhost';
const BIT_BACK_NAME = process.env.VUE_APP_IS_DEV ? '16bit-back' : 'localhost';

const server = http.createServer((req, res) => {
    let url = req.url;

    // Route HTTP based on the URL path
    if (url.startsWith('/world-instance/')) {
        // Remove /world-instance from the path
        req.url = url.replace('/world-instance', '');
        proxy.web(req, res, { target: `http://${WORLD_INSTANCE_NAME}:7457` });
    } else if (url.startsWith('/16bit-front/')) {
        // Remove /16bit-front from the path
        req.url = url.replace('/16bit-front', '');
        proxy.web(req, res, { target: `http://${BIT_FRONT_NAME}:8081` });
    } else if (url.startsWith('/16bit-back/')) {
        // Remove /16bit-front from the path
        req.url = url.replace('/16bit-back', '');
        proxy.web(req, res, { target: `http://${BIT_BACK_NAME}:5000` });
    }else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
    }
});

// Handle WebSocket upgrading
server.on('upgrade', (req, socket, head) => {
    let url = req.url;

    // Route WebSockets based on the URL path
    if (url.startsWith('/mocked-ws/')) {
        // Remove /mocked-ws from the path
        req.url = url.replace('/mocked-ws', '');
        proxy.ws(req, socket, head, { target: `ws://${MOCKED_WS_NAME}:7455` });
    } else if (url.startsWith('/real-ws/')) {
        // Remove /real-ws from the path
        req.url = url.replace('/real-ws', '');
        proxy.ws(req, socket, head, { target: `ws://${REAL_WS_NAME}:7456` });
    } else if (url.startsWith('/16bit-back')) {
    // Remove /real-ws from the path
    req.url = url.replace('/16bit-back', '');
    proxy.ws(req, socket, head, { target: `ws://${BIT_BACK_NAME}:5000` });
    }
});

server.listen(9000);

console.log('Reverse proxy running on port 9000');
