const http = require('http');
const path = require('path');
const iconPath = path.join(__dirname, 'icon.png');
const {app, BrowserWindow, Tray, Menu, Notification} = require('electron')
const server = require('./server/server');
const fs = require('fs');
const Registry = require('winreg')
const bootstrap_maker = require('./bootstrap_maker')
const VER = 'ONLINE';   //开发者修改

require("node:events");
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

let time_index = 0;
let scheduleInterval = null;
let waiting = false;
let on_boot_check = true;



function make_request(login) {
    waiting = true;

    const option = {
        host: '2.2.2.2',
        path: '/',
        method: 'GET',

    }

    const request = http.request(option, (res) => {
        let data = ''

        res.on('data', (chunk) => {
            console.log('>> Trying to get url from 2.2.2.2...')
            data += chunk;
        })
        res.on('end', () => {
            console.log('>> Succeed in getting url')
            let location = res.headers.location;

            handle_request(res.statusCode,data,login,location);
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


async function handle_request(status_code, data, login, loc) {
    if(status_code === 302) {
        if(!loc) {
            let local_temp;
            local_temp = await new Promise((resolve, reject) => {
                fs.readFile(path.join(__dirname, 'request_param.json'), 'utf-8', (err, data) => {
                    resolve(data)
                    if (err) {
                        console.warn('>> Load file from local failed, this may not affect the program, please add file "request_param.json", below the dir')
                        reject(err)
                    }
                });
            });


            local_temp = JSON.parse(local_temp !== '' ? local_temp : '');

            post_data.userid = my_server.account.name
            post_data.passwd = my_server.account.password;
            post_data.wlanuserip = local_temp.portalForm.wlanuserip;
            post_data.wlanacname = local_temp.portalForm.wlanacname;
            post_data.wlanacIp = local_temp.serverForm.serverip;
            post_data.vlan = local_temp.portalForm.vlan;
            post_data.mac = '';
            post_data.version = local_temp.serverForm.portalVer;
            post_data.portalpageid = local_temp.portalconfig.id;
            post_data.timestamp = local_temp.portalconfig.timestamp;
            post_data.uuid = local_temp.portalconfig.uuid;


        }
        if (login) {
            console.log(`>> You have already login! [code: ${status_code}]`)
            http.get("http://localhost:3000/login-finish",(res) => {
                res.on("data",(chunk) => {
                    console.log("" + chunk)
                })
            })
            waiting = false;
            const NOTIFICATION_TITLE = '消息'
            const NOTIFICATION_BODY = '您已成功登录'
            new Notification({
                title: NOTIFICATION_TITLE,
                body:NOTIFICATION_BODY,
                icon:iconPath
            }).show()
            return
        }

    }

    let url_ = ''
    let bl = true

    if(status_code === 302) {
        url_ = loc
    } else {

        data.split('script').forEach(line => {
            line.split('\"').forEach(line => {
                if (line.startsWith('http') && bl) {
                    url_ += line;
                    bl = false
                }
            });
        })


        let end = url_.indexOf('&url=')
        url_ = url_.substring(0, end)

    }
    console.log(`>> Listened url: ${url_}`)
    const host = url_.substring(7, 21)

    const request =  http.request(url_,(res) => {
            let data = ''

            res.on('data', (chunk) => {
                data += chunk;
            })
            res.on('error', (err) => {
                console.log(`>> Error in connected to home page ${err}`)
            })
            res.on('end', () => {
                console.log('>> Home page loaded!');
                handle_post_data(host, url_.substring(38), login)
            })
        })
        request.end()

}

async function handle_post_data(host, url, login){   //处理请求文件
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
        final_process(host, incoming_data, url, login)

    } else {
        console.log(">> Get certificate data fail! request out")
        waiting = false;
    }

}



async function final_process(host, incoming_data, url, login){
    let confirm_data = ''
    let redirect_url
    //灌注数据
    post_data.userid = my_server.account.name;
    post_data.passwd = my_server.account.password;
    post_data.wlanuserip = incoming_data.portalForm.wlanuserip
    post_data.wlanacname = incoming_data.portalForm.wlanacname;
    post_data.wlanacIp = incoming_data.serverForm.serverip;
    post_data.vlan = incoming_data.portalForm.vlan;
    post_data.mac = url.substring(url.indexOf("mac=") + "mac".length, url.indexOf('&vlan'));
    post_data.version = incoming_data.serverForm.portalVer;
    post_data.portalpageid = incoming_data.portalconfig.id;
    post_data.timestamp = incoming_data.portalconfig.timestamp;
    post_data.uuid = incoming_data.portalconfig.uuid;
    post_data.hostname = url.substring(url.indexOf("hostname=") + "hostname=".length, url.indexOf('&rand'))


    redirect_url = new URLSearchParams(post_data).toString();
    redirect_url += '&viewStatus=1';
    console.log(`>> Making url for param... [url:${redirect_url}]`)   //超级拼装url

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
    if(login) {

        confirm_data = await final_req();
        confirm_data = JSON.parse(confirm_data);

        if (confirm_data['code'] === '0') {
            console.log(`>> Login succeed! [code:${confirm_data['code']}]`);
            http.get("http://localhost:3000/login-finish",(res) => {
                res.on("data",(chunk) => {
                    console.log("" + chunk)
                })
            });
            waiting = false;
            const NOTIFICATION_TITLE = '消息'
            const NOTIFICATION_BODY = '登录成功！'
            new Notification({
                title: NOTIFICATION_TITLE,
                body:NOTIFICATION_BODY,
                icon:iconPath
            }).show()

        } else if (confirm_data['code'] === '1') {
            console.error(`>> Login failed! Please check your username or password or report it to developer [message:${confirm_data["message"]}]`)
            http.get("http://localhost:3000/login-finish",(res) => {
                res.on("data",(chunk) => {
                    console.log("" + chunk)
                })
            });
            waiting = false;
            const NOTIFICATION_TITLE = '消息'
            const NOTIFICATION_BODY = '登录失败，请检查网络连接情况并核对账号密码是否正确'
            new Notification({
                title: NOTIFICATION_TITLE,
                body:NOTIFICATION_BODY,
                icon:iconPath
            }).show()

        }
    } else {
        off_line(host,redirect_url)
    }


}


async function off_line(host, param){
    let confirm_data = ''
    let offline_post_data = {
        "wlanacip": post_data.wlanacIp,
        "wlanuserip": post_data.wlanuserip,
        "wlanacname": post_data.wlanacname,
        "version": post_data.version,
        "portaltype": post_data.portaltype,
        "userid": post_data.userid,
        "mac": post_data.mac ? post_data.mac : '',
        "groupId": '',
        "clearOperator": '0'
    }
    let option = {
        host:host,
        path: '/quickauthdisconn.do?' + param,
        method:'POST',
        headers:{
            'Content-Length': (JSON.stringify(offline_post_data)).length,
            'Content-Type': 'application/json'

        }
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

            logout_res.on('error', (err) => {
                console.error(`>> Logout failed! [CONNECTION]${err}`)
                http.get("http://localhost:3000/logout-finish");
                waiting = false;
            })
            logout_res.write(JSON.stringify(offline_post_data));
            logout_res.end();

        })
    }
    console.log('>> Trying to offline...')
    confirm_data = await offline_request();
    confirm_data = JSON.parse(confirm_data);

    if(confirm_data['code'] === '0'){
        console.log(`>> Logout succeed! [code:${ confirm_data['code']}]`);
        http.get("http://localhost:3000/logout-finish",(res) => {
            res.on("data",(chunk) => {
                console.log("" + chunk)
            })
        });
        waiting = false;
        const NOTIFICATION_TITLE = '消息'
        const NOTIFICATION_BODY = '下线成功！'
        new Notification({
            title: NOTIFICATION_TITLE,
            body:NOTIFICATION_BODY,
            icon:iconPath
        }).show()
    } else if (confirm_data['code'] === '1'){
        console.error(`>> Logout failed! [code:${confirm_data['code']}]`)
        http.get("http://localhost:3000/logout-finish",(res) => {
            res.on("data",(chunk) => {
                console.log("" +chunk)
            })
        });
        waiting = false;
        const NOTIFICATION_TITLE = '消息'
        const NOTIFICATION_BODY = '下线失败！请检查账号密码是否正确'
        new Notification({
            title: NOTIFICATION_TITLE,
            body:NOTIFICATION_BODY,
            icon:iconPath
        }).show()
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
            icon: path.join(__dirname,'icon.png'),
            webPreferences : {    //网络安全问题导致这玩意不能自主发送请求
                webSecurity:false,
                contextIsolation:false
            }
        })

        /*
        session.defaultSession.clearStorageData({
            storages: ['localstorage']
        })

         */

        let host = my_server.host()
        mainWindows.loadURL(`http://${host}:3000`)

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

    app.on('before-quit', () => {
        console.log('>> program quit.')
        quit = true
        //my_server.close_server();
        if (scheduleInterval) clearInterval(scheduleInterval);
    })

    app.on("quit",() =>{
        my_server.close_server();
    });

}


function on_schedule(){
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedTime = `${hours}:${minutes}:${seconds}`;

    if(my_server.time_schedule.plan[time_index].time === formattedTime){
        console.log(`>> On schedule: ${formattedTime}, method:${my_server.time_schedule.plan[time_index].mode}`)
        if(my_server.time_schedule.plan[time_index].mode === 'online'){
            make_request(true);
        } else if (my_server.time_schedule.plan[time_index].mode === 'offline'){
            make_request(false);
        }
        time_index ++;
        if(time_index === my_server.time_schedule.plan.length - 1) {
            time_index = 0;
        }
    }

}

function set_start(){   //开机自启
    waiting = true
    const RegKey  = new Registry({
            hive: Registry.HKCU,
            key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',

    })
    if(VER === "ONLINE") {
        const boot = new bootstrap_maker();
        boot.build();
        RegKey.set('Campus_network_connection_start', Registry.REG_SZ, path.join(__dirname, "start.bat"), (err) => {
            if (err) {
                console.log(">> Error in make Registry:", err.message)
            } else {
                console.log(">> Set sys_boot success!")
            }
        });
    } else if (VER === "LOCAL") {
        RegKey.set('Campus_network_connection_start', Registry.REG_SZ, path.join(__dirname, "auto_campus_network_connect.exe"), (err) => {
            if (err) {
                console.log(">> Error in make Registry:", err.message)
            } else {
                console.log(">> Set sys_boot success!")
            }
        });
    }
    waiting = false;

}

function set_stop(){
    waiting = true;
    const RegKey  = new Registry({
        hive: Registry.HKCU,
        key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',

    })

    RegKey.remove("Campus_network_connection_start", (err) => {
        if (err) {
            console.log(">> Error in remove Registry:", err.message)
        } else {
            console.log(">> Remove sys_boot success!")
        }
    })
    waiting = false;
}



async function start() {
    console.log('>> Starting program...');
    console.log('>> Main server started');
    await my_server.start_server();
    make_form()
    setTimeout(() => {
        make_request(true)
    }, 2000)


    scheduleInterval = setInterval(() => {
        function listen() {
            if (!waiting) {
                on_schedule()
                if (my_server.is_login) {
                    make_request(true);
                } else if (my_server.is_logout) {
                    make_request(false);

                } else if (my_server.boot && on_boot_check){
                    set_start();
                    on_boot_check = false;
                } else if (!my_server.boot && !on_boot_check){
                    set_stop();
                    on_boot_check = true;
                }


                } else {

                }

        }

        listen()

    }, 1000);
}
const my_server = new server();

start();
