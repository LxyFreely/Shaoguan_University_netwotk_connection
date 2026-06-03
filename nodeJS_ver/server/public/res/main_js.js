let on_plan = false;
let auto = false;
let judge = false;
let have_param = true;
let a = 0;


console.log('>> 正在加载');
const username = localStorage.getItem('username');
const password = localStorage.getItem('password');
const checkbox = localStorage.getItem('on_boot');

document.getElementById('username').value = username;
document.getElementById('password').value = password;
if(checkbox === 'true'){
    document.getElementById('boot').checked = true;
} else if (checkbox === 'false'){
    document.getElementById('boot').checked = false;
}
read_time_plan();



function search(context) {
    console.log(context)
    const url = JSON.stringify({
        "url":context
    })
    fetch("http://localhost:3000/open_link", {method:"POST", headers : {
        'Content-Type': 'application/json'},body:url
    }).then(() => {
        console.log(">> 成功发送外部url")
        }
    )
}


// 简单的标签页切换逻辑
function switchTab(panelId, menuItem) {
    // 1. 隐藏所有内容面板
    const panels = document.querySelectorAll('.content-panel');
    panels.forEach(panel => panel.classList.remove('active'));

    // 2. 移除所有菜单项的激活状态
    const menuItems = document.querySelectorAll('.menu-item');
    const item_credit =document.querySelectorAll('.credit-div');
    menuItems.forEach(item => item.classList.remove('active'));
    item_credit.forEach((item) =>item.classList.remove('active'));

    // 3. 显示目标面板
    document.getElementById(panelId).classList.add('active');
    if (on_plan) {
        if (panelId === 'timer-settings'){
            document.getElementById('plan').classList.add('active');
        }
    }
    if(panelId === 'credit'){
        document.getElementById('ZX_RAYER').classList.add('active');
        document.getElementById('LXY_FREELY').classList.add('active');
    }


    if(panelId === 'credit'){
        document.getElementById('ZX_RAYER').classList.add('active');
    }



    // 4. 激活当前点击的菜单项
    menuItem.classList.add('active');
}

function onLoginOrOutButtonClick(){

    const enterbutton = document.getElementById('login');
    const closebutton = document.getElementById('logout');

    if(enterbutton.classList.contains('active')){



        let login = document.getElementById('login_banner');
        //login.classList.add('show');
        login.classList.add('move');

        enterbutton.classList.remove('active')
        closebutton.classList.add('active');
        make_login()

        setTimeout(()=>{login.classList.remove('move')},1000)
    } else {
        let logout = document.getElementById('logout_banner');
        logout.classList.add('move');

        closebutton.classList.remove('active')
        enterbutton.classList.add('active');
        make_logout()


        setTimeout(()=>{logout.classList.remove('move')},1000)


    }

    function make_login(){
        fetch("http://localhost:3000/login", {method:"GET"}).then(
            data => {
                console.log(`>> 登入请求发送成功 [${data}]`)
            }
        ).catch(
            err => {
                console.log(`>> 登入请求发送失败 [${err}]`)
            }
        )
    }
    function make_logout(){
        fetch("http://localhost:3000/logout", {method:"GET"}).then(
            data => {
                console.log(`>> 登出请求发送成功 [${data}]`)
            }
        ).catch(
            err => {
                console.log(`>> 登出请求发送失败 [${err}]`)
            }
        )
    }


}

function set_local_storage(){
    //set local storage
    localStorage.setItem('username', document.getElementById('username').value);
    localStorage.setItem('password', document.getElementById('password').value);
    localStorage.setItem('on_boot', document.getElementById('boot').checked ? 'true' : 'false');
    const boot = document.getElementById('boot');
    if(boot.checked){
        fetch("http://localhost:3000/boot", {method:'GET'}).then(
            data => {
                console.log(">> 成功设置开机自启")
            }
        )
    } else {
        fetch("http://localhost:3000/unboot", {method:'GET'}).then(
            data => {
                console.log(">> 成功取消开机自启")
            }
        )
    }

    console.log('>> 配置已保存');

    const banner = document.getElementById('top-banner');
    banner.classList.add('move');
    banner.textContent = '配置保存成功'
    setTimeout(() => {banner.classList.remove('move')},1000);

    read_account();

}

function onCreateTimeEventClick(){
    const delbutton = document.getElementById('del-button');
    const del_single = document.getElementById('del-button-single');
    delbutton.classList.add('active');
    del_single.classList.add('active');
    /*
    const new_panel = document.createElement('div');
    new_panel.textContent = "Hello, World!";
    new_panel.classList.add('content-panel active');

    document.getElementById('main-content').appendChild(new_panel);

     */

    document.getElementById('plan').classList.add('active');
    on_plan = true;

    if(judge){
        judge = false;

    } else {
        copy_step(false,{});
        console.log(a)
    }

}

function onDelAll(){
    document.getElementById('plan').classList.remove('active');
    on_plan = false;
    document.getElementById('del-button').classList.remove('active');
    document.getElementById('del-button-single').classList.remove('active');
    const target = document.querySelectorAll('.plan-step');
    const frame = document.getElementById('plan');
    const time = target[0]
    const clone = time.cloneNode(true);
    judge = true;

    target.forEach((item) => {
        item.remove();
    })
    frame.append(clone)

    a = 1;
}
function DelSingle(){
    let target = document.querySelectorAll('.plan-step');
    const frame = document.getElementById('plan');
    const time = target[0];
    const clone = time.cloneNode(true);
    target[target.length-1].remove();
    target = document.querySelectorAll('.plan-step');
    a --

    if(target.length === 0){
        document.getElementById('plan').classList.remove('active');
        on_plan = false;
        document.getElementById('del-button').classList.remove('active');
        document.getElementById('del-button-single').classList.remove('active');
        judge = true;
        frame.append(clone);
        a = 1;
    }
}

function copy_step(auto,data){
    const time = document.querySelector('.plan-step');
    let clone = time.cloneNode(true);

    const frame = document.getElementById('plan');
    clone.id = "plan-step" + (a).toString();
    let clone_name = clone.querySelector('label');
    clone_name.textContent = (++a).toString() + ".";


    if(!have_param){   //用于第一次检测是否有localstorage
        time.remove()
        have_param = true;
    }


    if(auto){


        let set_time = data.time;
        let set_mode = data.mode;

        let get_time = clone.querySelector(".time-input");
        let get_mode = clone.querySelector('.mode-selector');

        get_mode.value = set_mode;
        get_time.value = set_time;

    } else {

    }

    frame.appendChild(clone);

}

function save_time_plan(){
    const plan = document.querySelectorAll('.plan-step');
    const plan_banner = document.getElementById('plan')
    let schedule = {
        "plan": []
    }
    plan.forEach(item => {
        let time = item.querySelector('.time-input');
        let mode = item.querySelector('.mode-selector')
        let node = {
            "time": time.value,
            "mode": mode.value
        }
        schedule.plan.push(node)
        localStorage.setItem('schedule', JSON.stringify(schedule));



    })
    if(plan_banner.classList.contains('active')) {
        read_schedule(schedule);

        console.log(">> 时间配置已保存")

        const banner = document.getElementById('top-banner');
        banner.textContent = "时间配置已保存"
        banner.classList.add('move');
        setTimeout(() => {banner.classList.remove('move');},1000);
    } else {
        console.log(">> 请创建时间计划")
        const banner = document.getElementById('top-banner');
        banner.textContent = "请创建时间计划"
        banner.classList.add("err");
        banner.classList.add('move');
        setTimeout(() => {banner.classList.remove('move')},1000);
        setTimeout(() => {banner.classList.remove("err")}, 1200);


    }

}


function read_time_plan(){
    const param = localStorage.getItem('schedule');
    console.log(param)
    if(param !== null){
        const schedule = JSON.parse(localStorage.getItem('schedule'));
        schedule.plan.forEach((data) => {

            copy_step(true,data)
        })

        const time = document.getElementById('step');
        time.remove();
        on_plan = true;
        auto = true;
        document.getElementById('del-button').classList.add('active');
        document.getElementById('del-button-single').classList.add('active');


        console.log(JSON.stringify(schedule))

        setTimeout(() => {read_schedule(schedule);
            read_account();},1000);
    } else {

        have_param = false;
        return 0
    }


}

function read_schedule(schedule){
    fetch("http://localhost:3000/PushTimeData", {method:'POST',
        headers : {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },body: JSON.stringify(schedule)}).then(
        data => {
            console.log(">> 发送时间计划成功")

        }
    )
}

function read_account(){
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    const data = {
        "name":username,
        "password": password
    }
    fetch("http://localhost:3000/PushAccount", {method:"POST", headers : {
            'Content-Type': 'application/json'},body:JSON.stringify(data)}).then(
        data => {
            console.log(">> 账号数据发送成功")
        }
    )

}