const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
    let url = req.url;

    // Route HTTP based on the URL path
    if (url.startsWith('/world-instance/')) {
        // Remove /world-instance from the path
        req.url = url.replace('/world-instance', '');
        proxy.web(req, res, { target: 'http://localhost:7457' });
    } else if (url.startsWith('/16bit-front/')) {
        // Remove /16bit-front from the path
        req.url = url.replace('/16bit-front', '');
        proxy.web(req, res, { target: 'http://localhost:8081' });
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
        proxy.ws(req, socket, head, { target: 'ws://localhost:7455' });
    } else if (url.startsWith('/real-ws/')) {
        // Remove /real-ws from the path
        req.url = url.replace('/real-ws', '');
        proxy.ws(req, socket, head, { target: 'ws://localhost:7456' });
    }
});

server.listen(9000);

console.log('Reverse proxy running on port 9000');
