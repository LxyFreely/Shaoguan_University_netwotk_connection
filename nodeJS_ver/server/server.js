const express = require('express');
const fs = require('fs');
const path = require("path");

class server {
    constructor() {
        this.name = 'server';
        this.port = 3000;
        this.host = '127.0.0.1';
        this.app = express();

        this.app.get( '/', (req, res) => {
            res.sendFile(path.join(__dirname, 'index.html'))
        });

    }

    start_server() {
        this.app.listen(this.port, this.host,() => {
            console.log('>> Server is running on port 3000');
        });

    }

    close_server(){
        this.app().close(() => {
            console.log('>> Server is closed');
        })
    }
}

module.exports = server;