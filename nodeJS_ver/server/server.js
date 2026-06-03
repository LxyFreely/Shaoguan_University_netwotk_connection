const express = require('express');
const path = require("path");
const os = require('os')

class server {
    constructor() {
        this.name = 'server';
        this.on_listen = undefined;
        this.port = 3000;
        this.boot = false;
        this.openlink = "";
        this.on_link = false;
        this.time_schedule = {
            "plan":[
                {
                "time": "08:00",
                    "node": "none"
                }
            ]
        };
        this.account = {
            "name":"",
            "password": ""
        };
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

        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(express.json())    //使用json作为返回一定要加上！！！！
        this.app.use(express.urlencoded({ extended: true }));


        this.app.get( '/', (req, res) => {
            res.sendFile(path.join(__dirname + '\\public\\res', 'index.html'))
        });

        this.app.post('/PushTimeData', (req, res) => {
            console.log(">> [server] receive time plan ")
            this.time_schedule = req.body;
            console.log(req.body);
            res.end();
        });

        this.app.post('/PushAccount', (req, res) => {
            console.log(">> [server] receive account ");
            this.account = req.body;
            console.log(req.body)
            res.end();
        });
        this.app.get('/login',(req,res) => {
            console.log(">> [server] receive login")
            this.is_login = true;
            res.send("success")
            res.end();


        });
        this.app.get('/login-finish',(req,res) => {
            console.log(">> [server][login] finish request,calling back...")
            this.is_login = false;
            res.send(">> process end.")
            res.end();


        });
        this.app.get('/logout',(req,res) => {
            console.log(">> [server] receive logout")
            this.is_logout = true;
            res.send("success")
            res.end();


        });
        this.app.get('/logout-finish',(req,res) => {
            console.log(">> [server][logout] finish request,calling back...")
            this.is_logout = false;
            res.send(">> process end.")
            res.end();

        });

        this.app.get('/boot',(req,res) => {
            console.log(">> [server][boot] receive boot")
            console.log(">> [server][boot] finish request,calling back...")
            this.boot = true;
            res.end();

        });
        this.app.get('/unboot',(req,res) => {
            console.log(">> [server][unboot] receive unboot")
            console.log(">> [server][unboot] finish request,calling back...")
            this.boot = false;
            res.end();

        });
        this.app.post('/open_link',(req,res) => {
            console.log(">> [server][open_link] receive open_link")
            this.openlink = req.body.url;
            this.openlink = this.openlink.substring(this.openlink.indexOf("https://"), this.openlink.length);
            this.on_link = true;
            console.log(">> [server][open_link] finish request,calling back...")
            res.end();
        })

    }

    start_server() {
        this.on_listen = this.app.listen(this.port, this.host,() => {
            console.log('>> Server is running on port 3000');
        });

    }

    close_server(){
        this.on_listen.close(() => {
            console.log('>> Server is closed');

        })

    }



}

module.exports = server;