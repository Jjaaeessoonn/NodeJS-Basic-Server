const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 5000;
const server = http.createServer((req, res) => {
    // non REST API server

    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html':req.url);
    let extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.json':
            contentType = 'application/json';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code == 'ENOENT') {
                // 404 error
                fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(content, 'utf8');
                });
            } else {
                // 500 error
                console.log(`Server Error: ${err.code}`);
                fs.readFile(path.join(__dirname, 'public', '500.html'), (err, content) => {
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end(content, 'utf8');
                });
            }
        } else {
            // 200 content served
            res.writeHead(200, {'Content-Type': contentType});
            res.end(content, 'utf8');
        }
    });
});
server.listen(PORT, () => console.log(`Serving on port ${PORT}`));
