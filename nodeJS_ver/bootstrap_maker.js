const fs = require('fs');
const path = require('path');

class bootstrap_maker {
    constructor() {
        this.file_name =  'start.bat'
        this.path = path.join(__dirname, this.file_name)
        this.disk = __dirname.substring(0, __dirname.indexOf('\\'))
    }
    build(){
        let text = `echo off\n${this.disk}\ncd ${__dirname}\nnpm start electron .\necho on`
        fs.writeFile(this.path, text,'utf-8', (err) => {
            if (err){
                console.error('>> Make start file FAIL, you need to prepare a copy version of start script from Github and put it under the dir of program'
                ,"https://github.com/ZX-RAY1124/Shaoguan_University_network_connection")
            }
        })
    }

}

module.exports = bootstrap_maker;