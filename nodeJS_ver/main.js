const http = require('http');
const path = require('path');
const iconPath = path.join(__dirname, 'icon.png');
const {app, BrowserWindow, Tray, Menu} = require('electron')
const server = require('./server/server');

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
            console.log('>> trying to get url from 2.2.2.2...')
            data += chunk;
        })
        res.on('end', () => {
            console.log('>> succeed in getting url')
            handle_request(res.statusCode,data);
        })
        res.on('error', (err) => {
            console.error(`>> facing error in getting data, please reported to developer: ${err}`)
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
            //记得改回去
    if(status_code === 302){
        console.log(`>> You are already login! [code: ${status_code}]`)

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
        console.log(`>> listened url: ${url_}`)



        const request = await http.request(url_,(res) => {
            let data = ''

            res.on('data', (chunk) => {
                data += chunk;
            })
            res.on('error', () => {
                console.log('>> error in connected to home page')
            })
            res.on('end', () => {
                console.log('>> home page loaded!');
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
                    console.log('>> now getting certificate data from main server...')
                    incoming_data += chunk;
                })
                res.on('end', () => {
                    resolve(incoming_data)
                })
                res.on('error', (err) => {
                    console.error('>> getting certificate data fail')
                    reject(err)
                })
            })
            get_request.end()
        });
    }
    incoming_data = await handle_post_data();
    incoming_data = JSON.parse(incoming_data)



    if(incoming_data){
        final_login(host, incoming_data, url)
    }

}



async function final_login(host, incoming_data, url){
    let confirm_data = ''
    let redirect_url = ''
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
    console.log(`>> making url for login... [url:${redirect_url}]`)   //超级拼装url

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
            console.log(`>> login failed! ${err}`)
        })
        final_res.end();
    })}

    confirm_data = await final_req();
    confirm_data = JSON.parse(confirm_data);
    if (confirm_data['code'] === '0'){
        console.log('>> login succeed!')
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
    let option = {
        host:host,
        path: '/quickauthdisconn.do',
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(offline_post_data.toString())
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
                    console.error(`>> logout failed! [${err}]`)
                    reject(err)
                })
            })
            logout_res.end();
            logout_res.on('error', (err) => {
                console.error(`>> logout failed! ${err}`)
            })
        })
    }

    confirm_data = await offline_request();
    confirm_data = JSON.parse(confirm_data);
    console.log(confirm_data)


}


function make_form(){    //程序主界面
    let mainWindows;
    app.whenReady().then(() => {
        mainWindows = new BrowserWindow({
            width:800,
            height:600,
            show: false
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
            mainWindows.hide()
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


    })
}


function start() {

    console.log('>> start program...');
    const my_server = new server();
    console.log('>> program server start')
    my_server.start_server();
    make_form()
    setTimeout(() => {
        make_request()
    }, 1000)
    setTimeout(() => console.log('divider'),3000)

    setTimeout(()=>{
        off_line('172.16.253.121')
        },2000)

}

start()
