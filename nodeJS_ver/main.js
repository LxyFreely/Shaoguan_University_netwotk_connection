const http = require('http');
const path = require('path');
const iconPath = path.join(__dirname, 'icon.png');
const {app, BrowserWindow, Tray, Menu} = require('electron')
const server = require('./server/server');
const fs = require('fs');
const events = require("node:events");

const post_data = {
    'userid':'',
    'passwd':'',
    'wlanuserip':'',
    'wlanacname':'',
    'wlanacIp': '',
    'ssid':'',
    'vlan':'',
    'mac':'',
    'version':'',
    'portalpageid':'',
    'validateCode':'',
    'timestamp':'',
    'uuid':'',
    'portaltype':'0',
    'hostname':'',
    'bindCtrlId':'',
    'validateType':'0',
    'bindOperatorType':'2',
    'sendFttrNotice':'0'
};






function make_request() {
    const option = {
        host: '2.2.2.2',
        path: '/',
        method: 'GET'
    }

    const request = http.request(option, (res) => {
        let data = ''

        res.on('data', (chunk) => {
            console.log('>> Trying to get url from 2.2.2.2...')
            data += chunk;
        })
        res.on('end', () => {
            console.log('>> Succeed in getting url')
            handle_request(res.statusCode,data);
        })
        res.on('error', (err) => {
            console.error(`>> Facing error in getting data, please reported to developer: ${err}`)
        })


    })
    request.end();

    request.on('error', (err) => {
        console.error(err);
        if (err === Error.ECONNRESET) {
            console.error('>> Request fail! Please check your internet connection!');
        }
    })
}


async function handle_request(status_code, data){
    if(status_code === 302){
        console.log(`>> You are already login! [code: ${status_code}]`)
        let local_temp;
        local_temp = await new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, 'request_param.json'), 'utf-8', (err, data) => {
                resolve(data)
                if(err){
                    console.warn('>> Load file from local failed, this may not affect the program, please add file "request_param.json", below the dir')
                    reject(err)
                }
            });
        });

        local_temp = JSON.parse(local_temp);

        post_data.userid = '25122021076';
        post_data.passwd = '17881952248'
        post_data.wlanuserip = local_temp.portalForm.wlanuserip
        post_data.wlanacname = local_temp.portalForm.wlanacname;
        post_data.wlanacIp = local_temp.serverForm.serverip;
        post_data.vlan = local_temp.portalForm.vlan;
        post_data.mac = local_temp.portalForm.mac;
        post_data.version = local_temp.serverForm.portalVer;
        post_data.portalpageid = local_temp.portalconfig.id;
        post_data.timestamp = local_temp.portalconfig.timestamp;
        post_data.uuid = local_temp.portalconfig.uuid;


        //    off_line('172.16.253.121');

    } else if (status_code === 200){
        let url_ = ''
        let bl = true
        data.split('script').forEach(line => {
            line.split('\"').forEach(line => {
                if (line.startsWith('http') && bl) {
                    url_ += line;
                    bl = false
                }
            });
        })
        let end = url_.indexOf('&url=')
        url_ = url_.substring(0,end)
        const host = url_.substring(7,21)
        console.log(`>> Listened url: ${url_}`)



        const request = await http.request(url_,(res) => {
            let data = ''

            res.on('data', (chunk) => {
                data += chunk;
            })
            res.on('error', (err) => {
                console.log(`>> Error in connected to home page ${err}`)
            })
            res.on('end', () => {
                console.log('>> Home page loaded!');
                handle_post_data(host, url_.substring(38))
            })
        })
        request.end()

    }
}

async function handle_post_data(host, url){   //处理请求文件\
    let incoming_data = ''

    const option = {
        host: host,
        path: '/PortalJsonAction.do?'+ url,
        method: 'GET',
    }
    function handle_post_data() {
        return new Promise((resolve, reject) => {
            const get_request = http.request(option, (res) => {
                res.on('data', (chunk) => {
                    console.log('>> Now getting certificate data from main server...')
                    incoming_data += chunk;
                })
                res.on('end', () => {
                    resolve(incoming_data)
                })
                res.on('error', (err) => {
                    console.error('>> Getting certificate data fail')
                    reject(err)
                })
            })
            get_request.end()
        });
    }
    incoming_data = await handle_post_data();
    incoming_data = JSON.parse(incoming_data)
    fs.writeFile(path.join(__dirname,'request_param.json'), JSON.stringify(incoming_data),'utf-8',(err) =>{
        if (err) {
            console.warn('>> Download result fail, this may not affect the program, please add file "request_param.json ", below the dir')
        }
    })



    if(incoming_data){
        final_login(host, incoming_data, url)
    }

}



async function final_login(host, incoming_data, url){
    let confirm_data = ''
    let redirect_url
    //灌注数据
    //测试用
    post_data.userid = '25122021076';
    post_data.passwd = '17881952248'
    post_data.wlanuserip = incoming_data.portalForm.wlanuserip
    post_data.wlanacname = incoming_data.portalForm.wlanacname;
    post_data.wlanacIp = incoming_data.serverForm.serverip;
    post_data.vlan = incoming_data.portalForm.vlan;
    post_data.mac = incoming_data.portalForm.mac;
    post_data.version = incoming_data.serverForm.portalVer;
    post_data.portalpageid = incoming_data.portalconfig.id;
    post_data.timestamp = incoming_data.portalconfig.timestamp;
    post_data.uuid = incoming_data.portalconfig.uuid;
    post_data.hostname = url.substring(url.indexOf("hostname=") + "hostname=".length, url.indexOf('&rand'))


    redirect_url = new URLSearchParams(post_data).toString();
    redirect_url += '&viewStatus=1';
    console.log(`>> Making url for login... [url:${redirect_url}]`)   //超级拼装url

    const option = {
        host: host,
        path: '/quickauth.do?' + redirect_url,
        method: 'GET',
    }

    function final_req() {
      return new Promise((resolve,reject) => {  const final_res = http.request(option, (res) => {
            res.on('data', (chunk) => {
                confirm_data += chunk;
            })


            res.on('end', () => {
                resolve(confirm_data);
            })

            res.on('error', (err) => {
                reject(err)
            })
        });

        final_res.on('error', (err) => {
            console.log(`>> Login failed! Please reported it to developer[error:${err}]`)
        })
        final_res.end();
    })}

    confirm_data = await final_req();
    confirm_data = JSON.parse(confirm_data);

    if (confirm_data['code'] === '0'){
        console.log(`>> Login succeed! code:${confirm_data['code']}`);
    } else if (confirm_data['code'] === '1'){
        console.error(`>> Login failed! Please check your username or password or report it to developer [message:${confirm_data["message"]}]`)
    }


}


async function off_line(host){
    let confirm_data = ''
    let offline_post_data = new URLSearchParams({
        "wlanacip": post_data.wlanacIp,
        "wlanuserip": post_data.wlanuserip,
        "wlanacname": post_data.wlanacname,
        "version": post_data.version,
        "portaltype": post_data.portaltype,
        "userid": post_data.userid,
        "mac": post_data.mac,
        "groupId": '',
        "clearOperator": '1'
    })
    console.log(`>> Making url for offline: ${offline_post_data.toString()}`)
    let option = {
        host:host,
        path: '/quickauthdisconn.do?' + offline_post_data.toString(),
        method:'GET',
    }


    function offline_request(){
        return new Promise((resolve, reject) => {
            const logout_res = http.request(option, (res) => {
                res.on('data', (chunk) => {
                    confirm_data += chunk;
                })
                res.on('end', () => {
                    resolve(confirm_data)
                })
                res.on('error', (err) => {
                    console.error(`>> Logout failed! [REQUEST]${err}`)
                    reject(err)
                })
            })
            logout_res.end();
            logout_res.on('error', (err) => {
                console.error(`>> Logout failed! [CONNECTION]${err}`)
            })
        })
    }
    console.log('>> Trying to offline...')
    confirm_data = await offline_request();
    confirm_data = JSON.parse(confirm_data);

    if(confirm_data['code'] === '0'){
        console.log(`>> Logout succeed! code:${ confirm_data['code']}`);
    }

}


function make_form(){    //程序主界面
    let mainWindows;
    let quit = false;
    app.whenReady().then(() => {
        mainWindows = new BrowserWindow({
            width:800,
            height:600,
            show: false,
            icon: path.join(__dirname,'icon.png')
        })

        mainWindows.loadURL('http://localhost:3000')

        let tray= new Tray(iconPath);

        tray.setToolTip('校园网自动连接系统')
        const contextMenu = Menu.buildFromTemplate([{
            label: '打开设置面板',
            click: () => {
                mainWindows.show()
            }
        },{
            label:'退出程序',
            click: () => {
                app.quit();
            }
        }])

        tray.on("right-click",() => {
            tray.setContextMenu(contextMenu)
        })


        tray.on('click', () => {
            if(mainWindows.isVisible()){
                mainWindows.hide()
            } else {
                mainWindows.show()
            }
        })

        mainWindows.on('close', (event) => {
            if (quit) {
                mainWindows.hide()
            } else {
                event.preventDefault()
                mainWindows.hide()
            }
        })


    })

    app.on('before-quit', (event) => {
        console.log('>> program quit.')
        quit = true
    })

}


function start() {
    console.log('>> Starting program...');
    const my_server = new server();
    console.log('>> Main server started')
    my_server.start_server();
    make_form()
    setTimeout(() => {
        make_request()
    }, 2000)


}

start()
