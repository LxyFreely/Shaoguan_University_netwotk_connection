const express = require('express');
const fs = require('fs');
const path = require("path");
const os = require('os')

class server {
    constructor() {
        this.name = 'server';
        this.port = 3000;
        this.host = () => {
            const interfaces =  os.networkInterfaces();
            for(const name of Object.keys(interfaces)){
                for (const iface of interfaces[name]){
                    if(iface.family === 'IPv4' && !iface.internal){
                        return iface.address;
                    }
                }
            }
            return "127.0.0.1"
        };
        this.app = express();

        this.is_login = false;
        this.is_logout = false;


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


    get_data(){

    }

}

module.exports = server;