var portalconfig = {};
var logoutconfig = {};
var local = {};
var groupFeeList = [];
var openClass = {};
var sec = 30;
var noticetime = {
    sumnoticetime: 0,
    listtime: []
};
var sendsmsflag = true;
var tryrelogintime = 0;
var tagFormat = {
    "ul": "<ul></ul>",
    "li": "<li></li>",
    "ol": "<li></li>",
    "div": "<div></div>",
    "p": "<p></p>",
    "span": "<span></span>",
    "dl": "<dl></dl>",
    "dt": "<dt></dt>",
    "a": "<a></a>"
};
var bindStep = 1;
(function ($) {
    $.fn.extend({
        'InitPortalConfig': function (opts) {
            var defaultVal = {
                "debug": false,
                "username": "#userid",
                "password": "#passwd",
                "sendMsg": "#gpass",
                "submit": "#submit",
                "wechatauth": "#wechatauth",
                "type": 1,
                "logintype": 1,
                "autoAd": true,
                "loginAD": "",
                "loginAD_type": "img",
                "loginAD_wrap": "",
                "loginAD_img_wrap": "",
                "centerAD": "",
                "centerAD_type": "img",
                "centerAD_wrap": "",
                "centerAD_img_wrap": "",
                "lateralFAD": "",
                "lateralFAD_type": "img",
                "lateralFAD_wrap": "",
                "lateralFAD_img_wrap": "",
                "wordInfoAD_url": "/portal/notice.html",
                "loginModal": "#loginModal",
                "logoutModal": "#logoutModal",
                "read": "#read",
                "readProtocol": "#readProtocol",
                "useLocal": false,
                "title": "#title",
                "copyright": "#copyright",
                "loginInfo": "#loginInfo",
                "serviceMsg": "#serviceMsg",
                "validateImage": "#validateImage",
                "validateCode": "#validateCode",
                "validateCtrl": ".validateCtrl",
                "portaltypeCtrl": ".portaltypeCtrl",
                "portaltype": "#portaltype",
                "checkCaptive": true,
                "checkInfo": false,
                "checkInfo_checkTemplatetype": false,
                "microAuth": ".microBtn",
                "microAuthUrl": ".microUrl",
                "loadmicro": false,
                "visitorname": "#username",
                "vistorpasswd": "#vistorpasswd",
                "visitorPhone": "#visitorPhone",
                "visitorCode": "#visitorCode",
                "visitorPassModal": "#visitor_pass_modal",
                "visitorSubmit": "#visitorLoginsubmit",
                "visitorRead": "#visitorRead",
                "vistorloginsubmit": "#vistorloginsubmit",
                "portaltypeDefaultVal": "0",
                "initLocal": function () {
                    initLocal()
                },
                "initBindModal": function (list) {
                    initBindModal(list)
                },
                "startbindStep": 1,
                'alertType': 'default',
                'customAlertFunc': function (msg, time) {
                    _alert(msg, time);
                },
                "showLoading": true,
                "serviceType": true,
                "validateType": "0",
                "skipTestPPPoE": false,
                "portalAppendBindModal": false,
                "sendFttrNotice":"0",
                "huashangeShowModal": function (msg) {
                    _alert(msg);
                },
                "initOAuthBtn": function () {

                }
            }
            portalconfig = $.extend(defaultVal, opts);
            return $(this).each(function () {
                // alert("inti");
                tryrelogintime = 0;
                initAlert();
                initSerivceModal();
                initloading();
                bindStep = portalconfig.startbindStep;
                if (portalconfig.checkInfo) {
                    initCheckInfo();
                }
                $.ajax({
                    url: '/PortalJsonAction.do',
                    type: 'get',
                    dataType: 'json',
                    data: window.location.search.substring(1) + "&viewStatus=1",
                    success: function (json) {
                        // debug("success,json:" + JSON.stringify(json));

                        if (json != null && json) {
                            portalconfig = $.extend(json, portalconfig);
                            if (portalconfig.checkCaptive) {
                                try {
                                    checkCaptive();
                                    // setInterval(checkCaptive, 2000);
                                } catch (e) {

                                }
                            }
                            initRasModel();
                            ipv6support();

                            local = portalconfig.local;
                            groupFeeList = portalconfig.groupFeeList || {};
                            openClass = portalconfig.openClass || {};
                            try {
                                if (portalconfig.initLocal && typeof portalconfig.initLocal == "function") {
                                    portalconfig.initLocal();
                                }
                                if (portalconfig.initGroupCharge && typeof portalconfig.initGroupCharge == "function") {
                                    portalconfig.initGroupCharge();
                                }

                                if (portalconfig.portalconfig.operatorBindingPolicy !== '2') {
                                    if (portalconfig.initBindModal && typeof portalconfig.initBindModal == "function") {
                                        console.log("init bind modal")
                                        portalconfig.initBindModal();
                                    } else {
                                        initBindModal();
                                    }

                                }

                                if (portalconfig.initOAuthBtn && typeof portalconfig.initOAuthBtn == "function") {
                                    portalconfig.initOAuthBtn();
                                }
                            } catch (e) {

                            }

                            if (portalconfig.alertMsg) {
                                _alert(portalconfig.alertMsg, 10000);
                            }
                            if (portalconfig.macChange && portalconfig.portalconfig.templatetype === "2") {

                                _confirm("温馨提示", portalconfig.useLocal && local && local.randomMacTrace ? local.randomMacTrace : "经系统检测,您当前系统可能开启无线随机MAC,导致无感知认证失败,如想在无线网络中获取更好的上网体验,请按以下指引关闭的无线随机MAC的功能,不便之处敬请谅解", "查看教程", "取消", function () {
                                    $("._confirm_btn__btn_confirm").attr("target", "_new").attr("href", "/portal/macTrace.html");
                                });
                            }
                            if (portalconfig.dropMacAuth) {
                                _confirm("温馨提示", "您好，该账号在线终端已达上限。登录后其他终端会被剔除，如确认登录，请输入账号和密码认证", "", "取消");
                            }

                            // alert(JSON.stringify(local));
                            // alert(portalconfig.portalconfig.logoutgourl);
                            InitAd();
                            $("#serviceMsg").bind('click', function () {
                                showService(portalconfig.portalconfig.message3);
                            });
                            if (portalconfig.portalconfig && portalconfig.portalconfig.listpasscode && portalconfig.portalconfig.listpasscode !== '0') {
                                $(portalconfig.validateImage).attr("src", portalconfig.portalconfig.validateImage + ".do");
                                $(portalconfig.validateImage).bind('click', function () {
                                    $(portalconfig.validateImage).attr("src", portalconfig.portalconfig.validateImage + "Refresh.do");
                                });
                            } else {
                                $(portalconfig.validateCtrl).hide();
                            }

                            if (portalconfig.portalconfig && portalconfig.portalconfig.list2Auth && portalconfig.portalconfig.list2Auth !== '0') {
                                $(portalconfig.portaltypeCtrl).show();
                            } else {
                                $(portalconfig.portaltypeCtrl).hide();
                            }
                            if (portalconfig.portalconfig && portalconfig.portalconfig.listgetpass !== '0') {
                                if (portalconfig.portalconfig.listgetpass === '1') {
                                    $(portalconfig.sendMsg).bind("click", getpass);
                                } else if (portalconfig.portalconfig.listgetpass === '2') {
                                    $(portalconfig.sendMsg).bind("click", getpass);
                                }
                            } else {
                                $(portalconfig.sendMsg).hide();
                                $(portalconfig.sendMsg).click(function () {
                                    _alert(portalconfig.useLocal && local ? local.noOpensms : "不开通短信服务");
                                });
                            }

                            if (portalconfig.listwxsysauth !== '0') {
                                // initWechatauth();
                                // $(portalconfig.wechatauth).bind('click', wechatauthfun);
                                if (portalconfig.weChatAuthModel != null && portalconfig.weChatAuthModel !== "") {
                                    if (portalconfig.weChatAuthModel.ismoblie) {
                                        if (getParam("formporatl") == 'true') {
                                            wechatauthfun();
                                        } else {
                                            if (portalconfig.weChatAuthModel.isiosportal) {
                                                $(portalconfig.wechatauth).bind('click', evokewechat);
                                            } else {
                                                $(portalconfig.wechatauth).bind('click', wechatauthfun);
                                            }
                                        }

                                    } else {
                                        wechatauthPcfun();
                                    }
                                } else {
                                    $(portalconfig.wechatauth).bind('click', function () {
                                        _alert("微信连WIFI功能未启用，请联系管理员");
                                    });
                                }
                            }
                            if (getParam('dropMaxOnline') && getParam('dropMaxOnline') !== '') {
                                checkInfoSumbit();
                            }

                            if ("1" == portalconfig.portalconfig.listwxmicroauth) {
                                // $(portalconfig.microAuth).bind("click", microAuthFunc)
                                if (portalconfig.loadmicro) {
                                    microAuthFunc();
                                }
                            }

                            if (portalconfig.portalconfig.checkOnlineFlag === 1) {
                                $(portalconfig.submit).bind("click",
                                    function () {
                                        throttle(checkInfoSumbit)
                                    });
                            } else {
                                $(portalconfig.submit).bind("click", function () {
                                    throttle(checkSubmit)
                                });
                            }

                            $(portalconfig.visitorSubmit).bind("click", visitorGetPass);
                            $(portalconfig.vistorloginsubmit).bind("click", function () {
                                throttle(vistorLoginSubmit)
                            });
                        } else {
                            _alert(portalconfig.useLocal && local ? local.noservice : "非法接入");
                            //	window.location.href = "http://www.baidu.com";
                        }
                    },
                    error: function () {
                        _alert(portalconfig.useLocal && local ? local.noservice : "非法接入");
                    }
                });
            })
        },
        "disconnconfig": function (opts) {
            var defaultVal = {
                "debug": false,
                "username": "#userid",
                "password": "#passwd",
                "sendMsg": "#gpass",
                "submit": "#submit",
                "smsContext": 1,
                "type": 1,
                "logintype": 1,
                "autoAd": true,
                "loginAD": "",
                "loginAD_type": "img",
                "loginAD_wrap": "",
                "loginAD_img_wrap": "",
                "centerAD": "",
                "centerAD_type": "img",
                "centerAD_wrap": "",
                "centerAD_img_wrap": "",
                "popAD": "",
                "popAD_type": "",
                "popAD_wrap": "",
                "popAD_img_wrap": "",
                "lateralFAD": "",
                "lateralFAD_type": "img",
                "lateralFAD_wrap": "",
                "lateralFAD_img_wrap": "",
                "lateralSAD": "",
                "lateralSAD_type": "img",
                "lateralSAD_wrap": "",
                "lateralSAD_img_wrap": "",
                "lateralTAD": "",
                "lateralTAD_type": "img",
                "lateralTAD_wrap": "",
                "lateralTAD_img_wrap": "",
                "wordInfoAD": "",
                "wordInfoAD_type": "word",
                "wordInfoAD_wrap": "",
                "wordInfoAD_item_wrap": "p",
                "loginModal": "#loginModal",
                "authMsg": "#authMsg",
                "useLocal": false,
                "title": "#title",
                "loginInfo": "#loginInfo",
                "logoutInfo": "#logoutInfo",
                "LogoutJumpPortalFlag": false,
                "LogoutJumpPortalUrl": "/portal.do",
                "LogoutJumpSleepFlag": false,
                "LogoutJumpSleepSecondsTime": 5,
                "initLocal": function () {
                    initLocal();
                },
                "logoutSSO": "#logoutSSO",
                'alertType': 'default',
                'customAlertFunc': function (msg, time) {
                    _alert(msg, time);
                },
                "serviceType": true,
                "clearOperator": 0,
                "showArea": 0,
                "showOnline": 0
            }
            logoutconfig = $.extend(defaultVal, opts);
            return $(this).each(function () {
                var groupId = '';
                if (window.localStorage) {
                    groupId = getParam("groupId") || window.localStorage.getItem("groupId") || '';
                } else {
                    groupId = getParam("groupId") || '';
                }
                var url = window.location.search.substring(1) + "&viewStatus=2";
                if (url.indexOf("groupId") == -1) {
                    if (groupId != '') {
                        url += "&groupId=" + groupId;
                    }
                }
                var logoutSsoUrl = getParam("logoutSsoUrl") || ''
                if (logoutSsoUrl) {
                    logoutSsoUrl = decodeURIComponent(logoutSsoUrl);
                    $(logoutconfig.logoutSSO).bind('click', function () {
                        window.open(logoutSsoUrl, '_blank');
                    });
                }

                $.ajax({
                    url: '/PortalJsonAction.do',
                    type: 'get',
                    dataType: 'json',
                    async: false,
                    data: url,
                    success: function (json) {
                        if (json != null && json) {
                            portalconfig = $.extend(json, portalconfig);
                            portalconfig = $.extend(portalconfig, logoutconfig);
                            local = portalconfig.local;
                            InitAd();
                        }
                    },
                    error: function (err) {
                    }
                });
                initAlert();
                if (getParam("dropLogCheck") && "1" == getParam("dropLogCheck")) {
                    _confirm("温馨提示", "您的上次登陆,因被其他设备登陆账号,被踢下线.请检查是否超出一台电脑一台手机的使用限制.若怀疑账号被盗用,请即使通过自助系统修改密码.", "修改密码", "忽略", function () {
                        $("._confirm_btn__btn_confirm").attr("target", "_new").attr("href", "/");
                    });

                }
                if (logoutconfig.initLocal && typeof logoutconfig.initLocal == "function") {
                    logoutconfig.initLocal();
                }
                $(logoutconfig.submit).bind("click",
                    function () {
                        throttle(disconnSubmit)
                    }
                );
                // _alert(urlDecode(getParam('msg')));
                if (getParam('msg')) {
                    $(logoutconfig.authMsg).html(urlDecode(getParam('msg')));
                }

                if (portalconfig.portalconfig && "1" === portalconfig.portalconfig.listwxmicroauth) {
                    // $(portalconfig.microAuth).bind("click", microAuthFunc)
                    if (portalconfig.loadmicro) {
                        microAuthFunc();
                    }
                }
            });
        }

    });

    $.fn.mask = function (noticetime) {
        var i = 0;
        var second = noticetime.sumnoticetime;
        $('form').hide();
        $(this).find('img').css('border', 0);
        $('body').append("<div id='time_tip_dialog'></div>");
        var maskstyle = {
            'font-size': '12px',
            color: '#F00',
            width: '300px',
            'margin-right': '5px',
            height: '20px',
            top: '10px',
            position: 'absolute',
            right: '0px',
            'text-align': 'right',
            'padding-right': '10px',
            'z-index': 2
        }
        $("#time_tip_dialog").css(maskstyle);

        $('body').append("<div id='bg_dialog'></div>");
        var bgstyle = {
            position: 'fixed',
            top: '0%',
            left: '0%',
            width: '100%',
            height: '100%',
            'background-color': 'black',
            'z-index': 0,
            '-moz-opacity': 0.7,
            opacity: .70,
            filter: 'alpha(opacity=70)'
        }
        $('#bg_dialog').css(bgstyle);

        $(this).removeAttr("style");
        var noticeStyle = {
            position: 'absolute',
            padding: 0,
            border: '2px solid #999999',
            'background-color': 'white',
            'z-index': 1,
            overflow: 'hidden',
            margin: '10px',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
        }
        $(this).css(noticeStyle);
        var notice = $(this);
        var count = 0;
        var avgtime = 0;
        debug('各个广告播放时长' + noticetime.listtime);
        if (noticetime.sumnoticetime > 60) {
            avgtime = (second / noticetime.listtime.length.toFixed(0));
            second = avgtime * noticetime.listtime.length;
        }
        debug('广告平均时长' + avgtime);

        var l = window.setInterval(function () {
            if (second > 0) {
                second--;
                count++;
            } else {
                clearInterval(l);
                notice.hide();
                $('#bg_dialog').remove();
                $("#time_tip_dialog").remove();
                $('form').show();
            }
            if (noticetime.sumnoticetime <= 60 && count == noticetime.listtime[i] && second != 0) {
                i++;
                show(this, 'img', i);
                count = 0;
            } else if (count == avgtime && second != 0) {
                i++;
                show(this, 'img', i);
                count = 0;
            }
            // show(notice,'img',i);
            $("#time_tip_dialog").html("广告显示时间" + second + "秒");
            debug('当前第' + (i + 1) + '个广告时长' + noticetime.sumnoticetime > 60 ? noticetime.listtime[i] : avgtime + '秒，剩余时长' + second + '秒');
        }, 1000);

    }

})(jQuery);

function show(obj, format, i) {
    var imgs = $(obj).find(format);
    $(imgs).hide();
    var img = $(obj).find(format)[i];
    $(img).show();
}

function smscallback(msg) {
    if (msg) {
        if (msg.state == 0) {
            _alert(local.sendSMSSuccee);
        } else if (msg.state == 1) {
            _alert(local.sendSMSFail + "  " + msg.redesc);

        } else {
            _alert(msg.redesc);
        }

    }

}

function getParam(paramName) {
    var url = window.location.search;
    // 正则筛选地址栏
    var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)");
    // 匹配目标参数
    var result = url.substr(1).match(reg);
    //返回参数值
    try {
        return result ? decodeURIComponent(result[2]) : '';
    } catch (e) {
        return result[2];
    }
}

function checkSubmit() {
    // _alert("上线");
    showLoading("正在认证..");
    if ($.trim($(portalconfig.username).val()) == "") {
        _alert(local.username + local.notnull);
        $(portalconfig.username).focus();
        hideLoading();
        return;
    }
    if ($.trim($(portalconfig.password).val()) == "") {
        _alert(local.passwd + local.notnull);
        $(portalconfig.password).focus();
        hideLoading();
        return;
    }
    // if ($.trim($(portalconfig.password).val()).length > 15) {
    //     _alert(local.passwd + '不支持15位以上的密码');
    //     $(portalconfig.password).focus();
    //     hideLoading();
    //     return;
    // }
    if (portalconfig.portalconfig && portalconfig.portalconfig.listpasscode && portalconfig.portalconfig.listpasscode != 0) {
        if ($(portalconfig.validateCode).val() == "") {
            _alert(local.validateCode + local.notnull);
            $(portalconfig.validateCode).focus();
            hideLoading();
            return;
        }
    }

    if ($(portalconfig.read)) {
        debug("read:" + $(portalconfig.read).is(":checked"));
        if (!$(portalconfig.read).is(":checked")) {
            _alert(local.readProtocol);
            hideLoading();
            return;
        }
    }

    var postdata = {
        'userid': $(portalconfig.username).val().replace(/\s*/g, ""),
        'passwd': $(portalconfig.password).val().replace(/\s*/g, ""),
        'wlanuserip': portalconfig.portalForm.wlanuserip ? portalconfig.portalForm.wlanuserip : getParam('wlanuserip') || portalconfig.wlanuserip,
        'wlanuseripv6': getParam('wlanuseripv6') || portalconfig.wlanuseripv6,
        'wlanacname': portalconfig.portalForm.wlanacname ? portalconfig.portalForm.wlanacname : getParam('wlanacname'),
        'wlanacIp': getParam('wlanacIp') || portalconfig.serverForm ? portalconfig.serverForm.serverip : "",
        'ssid': portalconfig.portalForm.ssid ? portalconfig.portalForm.ssid : getParam('ssid') || '',
        'vlan': portalconfig.portalForm.vlan ? portalconfig.portalForm.vlan : getParam('vlan') || '',
        'mac': portalconfig.portalForm.mac ? portalconfig.portalForm.mac : getParam('wlanstamac') || getParam('usermac') || getParam('mac') || '',
        "version": portalconfig.serverForm ? portalconfig.serverForm.portalVer : "",
        'portalpageid': portalconfig.portalconfig ? portalconfig.portalconfig.id : '',
        "validateCode": $(portalconfig.validateCode).val(),
        "timestamp": (portalconfig.portalconfig && portalconfig.portalconfig.timestamp) ? portalconfig.portalconfig.timestamp : "",
        "uuid": (portalconfig.portalconfig && portalconfig.portalconfig.uuid) ? portalconfig.portalconfig.uuid : "",
        "portaltype": $(portalconfig.portaltype).val() || portalconfig.portaltypeDefaultVal || "",
        "hostname": getParam("hostname") || '',
        "bindCtrlId": $("#choose_ctrl_select input[name='bindCtrlId']:checked").val() || $("#bind_ctrl_select input[name='bindCtrlId']:checked").val() || $("#bind_ctrl_select select[name='bindCtrlId'] option:selected").val() || '',
        "validateType": $("#validateType").val() || portalconfig.validateType,
        "bindOperatorType": portalconfig.skipTestPPPoE ? '1' : '2',
        "sendFttrNotice":portalconfig.sendFttrNotice?portalconfig.sendFttrNotice:'0'
    };

    encryptParam(postdata);
    portalconfig.skipTestPPPoE = false
    // console.log(JSON.stringify(postdata));
    $.ajax({
        url: '/quickauth.do',
        type: 'get',
        dataType: 'json',
        async: false,
        data: postdata,
        success: function (json) {
            hideLoading();
            debug("success:" + JSON.stringify(json));
            if (json.code == "0") {
                // _alert("认证成功");

                if (portalconfig.portalconfig && portalconfig.portalconfig.logoutgourl != "") {

                    if (portalconfig.portalconfig.logoutgourl.indexOf("logout") > -1) {
                        // _alert(portalconfig.portalParam.wlanacip);
                        // _alert(getParam(wlanacip));
                        // _alert(json.message);
                        if (window.localStorage) {
                            window.localStorage.setItem("userid", $(portalconfig.username).val());
                            window.localStorage.setItem("groupId", json.groupId);
                        }

                        var url = portalconfig.portalconfig.logoutgourl + "?wlanacip=" + postdata.wlanacIp + "&wlanuserip=" + postdata.wlanuserip + "&wlanacname=" + postdata.wlanacname + "&mac=" + postdata.mac + "&version=" + postdata.version + "&msg=" + (json.message ? encodeURIComponent(json.message) : "") + "&selfTicket=" + (json.selfTicket || '') + "&macChange=" + (json.macChange || "false") + "&dropLogCheck=" + json.dropLogCheck + "&vlan=" + postdata.vlan;
                        if (json.groupId && json.groupId !== '') {
                            url += "&groupId=" + json.groupId;
                        }
                        if (json.userId && json.userId != "") {
                            url += "&userId=" + json.userId;
                        } else {
                            url += "&userId=" + $(portalconfig.username).val();
                        }
                        // window.location.href=url;
                        checkPasswdPolicy(json, url);

                        // window.close();
                    } else {
                        // _alert(portalconfig.portalconfig.logoutgourl);

                        // window.location.href = portalconfig.portalconfig.logoutgourl;

                        checkPasswdPolicy(json, portalconfig.portalconfig.logoutgourl);
                        // window.close();

                    }

                } else {
                    if (json.logoutgourl) {

                        var url = json.logoutgourl + "?wlanacip=" + postdata.wlanacIp + "&wlanuserip=" + postdata.wlanuserip + "&wlanacname=" + postdata.wlanacname + "&mac=" + postdata.mac + "&version=" + postdata.version + "&msg=" + (json.message ? encodeURIComponent(json.message) : "") + "&selfTicket=" + (json.selfTicket || '') + "&macChange=" + (json.macChange || "false") + "&dropLogCheck=" + json.dropLogCheck;
                        if (json.groupId && json.groupId !== '') {
                            url += "&groupId=" + json.groupId;
                        }
                        if (json.userId && json.userId != "") {
                            url += "&userId=" + json.userId;
                        } else {
                            url += "&userId=" + $(portalconfig.username).val();
                        }
                        // window.location.href = url;
                        checkPasswdPolicy(json, url);

                    } else {

                        // window.location.href = getParam("url");
                        checkPasswdPolicy(json, getParam("url"));

                    }
                }
            } else if (json.code == "201") {
                window.location.href = json.logoutgourl;

            } else if (json.code === "235") {
                _confirm('温馨提示', json.message, '修改密码', '取消', function () {
                    $("._confirm_btn__btn_confirm").bind('click', function () {
                        window.location.href = "/";
                    })
                })
            } else if (json.code == "236") {
                hideLoading();
                _alert(json.message, 3000);
                setTimeout(function () {
                    $(".bind_only_modal").show();
                    $("#bindDxId").focus();
                }, 3000);
            } else if (json.code == "237") {
                hideLoading();
                _alert(json.message, 3000);
                if (portalconfig.initBindModal && typeof portalconfig.initBindModal == "function") {
                    console.log("init bind modal")
                    portalconfig.initBindModal(portalconfig.portalconfig.operatorBindingPolicy == '2' ? json.operatingBindCtrlList : []);

                } else {
                    initBindModal(portalconfig.portalconfig.operatorBindingPolicy == '2' ? json.operatingBindCtrlList : []);
                }
                setTimeout(function () {
                    bind_ctrl_modal_step_switch();
                    $("#bindCtrlDxId").val("")
                    $("#bindCtrlDxNo").val("")
                    $(".bind_mask,.bind_ctrl_modal").show();
                }, 3000);
            } else if (json.code == "238") {
                hideLoading();
                _alert(json.message, 3000);
                setTimeout(function () {
                    $(".bind_mask,.choose_ctrl_modal").show();
                }, 3000);
            } else if (json.code == '241') {
                hideLoading();
                portalconfig.skipTestPPPoE = true;
                _alert(json.message, 3000);
                if (portalconfig.portalconfig.operatorBindingPolicy == '2') {
                    if (portalconfig.initBindModal && typeof portalconfig.initBindModal == "function") {
                        console.log("init bind modal")
                        portalconfig.initBindModal(json.operatingBindCtrlList);

                    } else {
                        initBindModal(json.operatingBindCtrlList);
                    }
                }
                setTimeout(function () {
                    bind_ctrl_modal_step_switch();
                    $("#bindCtrlDxId").val("")
                    $("#bindCtrlDxNo").val("")
                    $(".bind_mask,.bind_ctrl_modal").show();
                }, 3000);
            } else if (json.code == '242') {
                if (portalconfig.huashangeShowModal && typeof portalconfig.huashangeShowModal == "function") {
                    portalconfig.huashangeShowModal(json.message);
                } else {
                    _alert(json.message, 5000);
                }

            } else if (json.code == "-1") {
                hideLoading();
                _alert(json.message, 5000);
                if (tryrelogintime < 2) {
                    setTimeout(function () {
                        tryrelogintime++;
                        checkSubmit();
                    }, 5000);
                } else {
                    _alert("认证失败,超过自动重试次数", 5000);
                }

            } else {
                $("#bind_ctrl_select input[name='bindCtrlId']").removeAttr('checked')
                _alert(json.message);
            }
        },
        error: function (json) {
            hideLoading();
            debug("error");
            _alert(portalconfig.useLocal && local && local.loginfail ? local.loginfail : "登陆失败，请稍后再试！");
        }

    });

}

function disconnSubmit() {
    // _alert("下线");
    if ((getParam("wlanacip") != "" && getParam("wlanuserip") != "") || (getParam("wlanacname") != "" && getParam("wlanuserip"))) {
        $.ajax({
            url: '/quickauthdisconn.do',
            type: 'post',
            dataType: 'json',
            data: {
                "wlanacip": getParam("wlanacip"),
                "wlanuserip": getParam("wlanuserip"),
                "wlanacname": getParam("wlanacname"),
                "version": getParam("version"),
                "portaltype": getParam("portaltype"),
                "userid": getParam("userId") || '',
                "mac": getParam("mac") || '',
                "groupId": getParam("groupId") || '',
                "clearOperator": ($("#clearOperator").is(":checked") ? "1" : "0") || portalconfig.clearOperator || '0'
            },
            success: function (json) {
                debug("success");
                if (json.code == '0') {
                    _alert(portalconfig.useLocal && local ? local.logoutSuccee : "下线成功！");
                    if (portalconfig.LogoutJumpPortalFlag) {
                        window.location.href = portalconfig.LogoutJumpPortalUrl + "?wlanacname=" + getParam("wlanacname") + "&wlanuserip=" + getParam("wlanuserip") + "&mac=" + (getParam("mac") || '') + "&vlan=" + getParam("vlan");

                    } else {
                        if (portalconfig.LogoutJumpSleepFlag) {
                            _alert(portalconfig.LogoutJumpSleepSecondsTime + "秒后自动跳转页面", portalconfig.LogoutJumpSleepSecondsTime * 1000);
                            setTimeout(function () {
                                window.location.href = LogoutRedirect();
                            }, portalconfig.LogoutJumpSleepSecondsTime * 1000 || 5000);


                        } else {
                            window.location.href = LogoutRedirect();
                        }
                    }
                } else {
                    _alert(portalconfig.useLocal && local ? local.logoutFail : "下线失败");
                }
            },
            error: function () {
                debug("error");
            }
        });

    } else {
        _alert("非法下线，缺少参数!");
    }
}


function getpass() {
    // _alert(portalconfig.username);
    if (sendsmsflag) {

        var uid = $(portalconfig.username).val().replace(/\s*/g, "");
        var smsid = portalconfig.portalconfig.smsid;
        var portalid = portalconfig.portalconfig.id;
        debug("uid:" + uid + "   smsid:" + smsid + "  portalid:" + portalid);
        if (portalconfig.smsContext == '0') {
            smsid = portalid;
        }
        if (portalconfig.portalconfig != null) {
            if ($("input[name='memberType']").length > 0 && $("input[name='memberType']:checked").val() == null) {
                _alert("请选择您的用户类型");
                return;
            }

            if (uid != "") {
                if (portalconfig.type == "1") {
                    if (!checkPhone(uid)) {
                        _alert(local.phoneerror);
                        return;
                    }
                    //}
                }
                if (portalconfig.portalconfig && portalconfig.portalconfig.listpasscode && portalconfig.portalconfig.listpasscode != 0) {
                    if ($(portalconfig.validateCode).val() == "") {
                        _alert(local.validateCode + local.notnull);
                        $(portalconfig.validateCode).focus();
                        return;
                    }
                }

                $.ajax({
                    url: '/sms.do',
                    type: 'post',
                    dataType: 'json',
                    data: {
                        "phone": uid,
                        "portalId": portalconfig.portalconfig.id,
                        "timestamp": portalconfig.portalconfig.timestamp,
                        "sign": portalconfig.portalconfig.sign,
                        "wlanacname": getParam("wlanacname") || (portalconfig.serverForm && portalconfig.serverForm.servername ? portalconfig.serverForm.servername : ""),
                        'ssid': getParam('ssid') || '',
                        'vlanid': getParam('vlan') || '',
                        "validateCode": $(portalconfig.validateCode).val(),
                        "uuid": (portalconfig.portalconfig && portalconfig.portalconfig.uuid) ? portalconfig.portalconfig.uuid : "",
                        'wlanuserip': getParam('wlanuserip'),
                        "memberType": $("input[name='memberType']:checked").val() || ''
                    },
                    success: function (json) {
                        debug(json);
                        sendsmsflag = false;
                        setTimeout(function () {
                            sendsmsflag = true;
                        }, sec * 1000);
                        var _sec = sec;
                        var _text = $(portalconfig.sendMsg).text();
                        var countdown = setInterval(function () {
                            _sec--;
                            if (_sec == 0) {
                                $(portalconfig.sendMsg).text(_text);
                                clearInterval(countdown);
                            } else {
                                $(portalconfig.sendMsg).text(_sec + "s");
                            }

                        }, 1000);
                        smscallback(json);
                    },
                    error: function (e) {
                        _alert(local.sendSMSFail);
                    }
                });

                //}


            } else {
                if (portalconfig.portalconfig.listgetpass == "1") {
                    //_alert("请在账号处输入手机号码!");
                    // _alert(local.inputphone);
                    _alert(portalconfig.useLocal && local ? (local.username + "" + local.notnull) : "手机号不能为空");
                } else {
                    //_alert("请在账号处输入邮箱账号!");
                    _alert(local.inputemail);
                }
                // document.getElementById("useridtemp").focus();
            }
        } else {
            _alert(portalconfig.useLocal && local ? (local.username + "" + local.notnull) : "手机号不能为空");
        }
    } else {
        _alert(portalconfig.useLocal && local ? local.getPasswdTimeout : "30秒内不能再发短信");

    }
}

function getpassnosend() {
    if (sendsmsflag) {
        var uid = $(portalconfig.username).val().replace(/\s*/g, "");
        var smsid = portalconfig.portalconfig.smsid;
        var portalid = portalconfig.portalconfig.id;
        // debug("uid:" + uid + "   smsid:" + smsid + "  portalid:" + portalid);
        if (portalconfig.smsContext == '0') {
            smsid = portalid;
        }
        if (portalconfig.portalconfig != null) {
            if (uid != "") {
                if (portalconfig.type == "1") {
                    if (!checkPhone(uid)) {
                        _alert(local.phoneerror);
                        return;
                    }
                }
                $.ajax({
                    url: '/NosendsmsAction.do',
                    type: 'post',
                    dataType: 'json',
                    data: {
                        "userid": uid,
                        "group_id": portalconfig.portalconfig.groupid,
                        "class_id": "",
                        "smsContext": portalconfig.portalconfig.smsContext,
                        "smsid": smsid,
                        "usertype_value": "",
                        "wlanacname": "",
                        "ssid": "",
                        "vlan": "",
                        "listgetpass": portalconfig.type,
                        "getpasstype": "0",
                        "act": "get"
                    },
                    success: function (json) {
                        // debug(text);
                        // callback(text);
                        if (text == '1' || text == '0') {
                            smscallback(json);
                        } else {
                            $(portalconfig.password).val(text);
                            $("#passwordInfo").text("你的密码是:" + text);
                        }
                        // _alert(text);

                        // $("#passwd").val(text);
                        // $("#passdesc").text("获取成功，您的密码为：" + text);
                    },
                    error: function (e) {
                        _alert(local.sendSMSFail);
                    }
                });

                //}


            } else {
                if (portalconfig.type == "1") {

                    _alert(local.inputphone);
                } else {

                    _alert(local.inputemail);
                }
            }
        } else {
            _alert("不能获取短息！");
        }
    } else {
        _alert(local.getPasswdTimeout);
        setTimeout(function () {
            sendsmsflag = true;
        }, sec * 1000);
    }
}


function checkPhone(phone) {
    var checkphone = /^(1)\d{10}$/;
    if (!checkphone.exec(phone)) {
        //_alert("请输入正确的手机号");

        return false;
    } else {
        return true;
    }
}

function InitAd() {
    InitPortalAd();
    InitNoticeAd();
}

function InitPortalAd() {
    if (portalconfig.portalconfig != null && portalconfig.portalconfig != "") {
        if (portalconfig.portalconfig.picpath1 != null && portalconfig.portalconfig.picpath1 != "" && portalconfig.loginAD != null && portalconfig.loginAD != "") {
            appendPortalNotice("loginAD", portalconfig.loginAD, "1");
        }
        if (portalconfig.portalconfig.picpath2 != null && portalconfig.portalconfig.picpath2 != "" && portalconfig.centerAD != null && portalconfig.centerAD != "") {
            appendPortalNotice("centerAD", portalconfig.centerAD, "2");
        }
        if (portalconfig.portalconfig.picpath3 != null && portalconfig.portalconfig.picpath3 != "" && portalconfig.lateralFAD != null && portalconfig.lateralFAD != "") {
            appendPortalNotice("lateralFAD", portalconfig.lateralFAD, "3");
        }
    }
}

function InitNoticeAd() {

    if (portalconfig.noticeconfig != null && portalconfig.noticeconfig) {
        debug(portalconfig.autoAd);
        if (portalconfig.autoAd == true) {
            debug(portalconfig.noticeconfig.noticeList);
            var hasWrapEl = [];
            $.each(portalconfig.noticeconfig.noticeList, function (i, v) {
                if (v && v.adElementTarget && v.adElementTarget != '') {
                    var itemwrapKey = v.adElementTarget.replace(/[#.]/g, "") + "_item_wrap";
                    var parentwrapKey = v.adElementTarget.replace(/[#.]/g, "") + "_wrap";
                    debug("itemwrapKey:" + itemwrapKey + " parentwrapKey:" + parentwrapKey)
                    if (v.adType == '0') {
                        appendImgNotice($(v.adElementTarget), v, itemwrapKey);
                    } else {

                        var _target = $(v.adElementTarget);
                        appendwordNotice(_target, v, portalconfig[itemwrapKey]);
                        if (portalconfig[parentwrapKey]) {
                            var hasWrapElItem = [{
                                obj: v.adElementTarget,
                                wrap: portalconfig[parentwrapKey]
                            }]
                            hasWrapEl = $.extend(hasWrapElItem, hasWrapEl);
                        }
                    }
                }
            });
            debug(hasWrapEl);
            $.each(hasWrapEl, function (i, v) {
                $(v.obj).children().wrap(v.wrap);
            });
        }
    }
}

function checkShowType(obj) {
    debug("type : " + portalconfig[obj + "_type"]);
    if (portalconfig[obj + "_type"] != null && (portalconfig[obj + "_type"] == "img") || (portalconfig[obj + "_type"] == "word")) {
        return true;
    } else {
        return false;
    }
}


function appendPortalNotice(key, obj, picindex) {
    if (checkShowType(key)) {
        appendPortalImgNotice(key, obj, picindex);
    } else {
        appendPortalCssNotice(key, obj, picindex);
    }
}

function appendPortalCssNotice(key, obj, picindex) {
    $(obj).css({
        "background-image": "url(" + portalconfig.portalconfig['picpath' + picindex] + ")"
    });
}

function appendPortalImgNotice(key, obj, picindex) {
    $(obj).children().remove();
    var checkherf = false;
    var _append = "<img src=\"" + portalconfig.portalconfig['picpath' + picindex] + "\" width=\"" + ($(obj).attr('width') || '100%') + "\"/>";
    debug(portalconfig.portalconfig['picpathurl' + picindex]);
    if (portalconfig.portalconfig['picpathurl' + picindex] && portalconfig.portalconfig['picpathurl' + picindex] != null && portalconfig.portalconfig['picpathurl' + picindex] != "") {
        _append = "<a href=\"" + portalconfig.portalconfig['picpathurl' + picindex] + "\">" + _append + "</a>";
    }
    $(obj).append(_append);
    if (portalconfig[key + '_img_wrap'] != null && portalconfig[key + '_img_wrap'] != "") {
        if (checkherf) {
            $(obj).find("a").wrap(getTagFormat(portalconfig[key + '_img_wrap']));
        } else {
            debug("warp")
            $(obj).find("img").wrap(getTagFormat(portalconfig[key + '_img_wrap']));
        }
    } else {
        debug("no warp");
    }
    wrapParent(obj, portalconfig[key + '_wrap']);
}


// function eachImgNotice(obj, list) {
//     $(obj).html("");
//     $.each(list, function (notice_i, notice) {
//         appendImgNotice(obj, notice, portalconfig[obj + '_img_wrap']);
//     });
//     wrapParent(obj, portalconfig[obj + '_wrap']);
//     if (obj == portalconfig.popAD) {
//         $(obj).mask(noticetime);
//     }
// }

// function eachWordNotice(obj, list) {
//     $(obj).html("");
//     $.each(list, function (notice_i, notice) {
//         appendwordNotice(obj, notice, portalconfig[obj + '_img_wrap']);
//     });
//     wrapParent(obj, portalconfig[obj + '_wrap']);


// }

// function eachCssNotice(obj, list) {
//     debug("css:" + list[0].message);
//     $(obj).css({
//         "background-image": "url(" + list[0].message + ")"
//     });
// }

function appendImgNotice(obj, notice, format) {
    debug(obj + ":" + notice.message);
    var _append = "";
    var checkherf = false;
    var _tmpId = "__img_ad__" + notice.id;
    var _atmpId = "__a_img_ad__" + notice.id;
    _append = "<img src=\"" + notice.message + "\" title=\"" + notice.title + "\" width=\"100%\" id=\"" + _tmpId + "\"/>";


    if (notice.url && notice.url != null && notice.url != '') {

        _append = "<a href=\"" + notice.url + "\" target='_blank' id=\"" + _atmpId + "\">" + _append + "</a>";
        checkherf = true;
    }

    $(obj).append(_append);

    if (format != null && format != "") {
        if (checkherf) {
            $(obj).find('#' + _atmpId).wrap(format);
        } else {
            $(obj).find('#' + _tmpId).wrap(format);
        }
    }
}

function appendwordNotice(obj, notice, format) {
    // debug(obj + ":" + notice.message);
    var _append = "";
    var _tmpId = "__word_ad__" + notice.id;
    if ($(obj).data("type") && $(obj).data("type") == 'context') {
        _append = notice.message;
    } else {
        if (!notice.url) {
            _append = "<a href=\"" + portalconfig.noticeconfig.templateUrl + "?id=" + notice.id + "\" id=\"" + _tmpId + "\"><p>" + notice.title + "</p></a>";
        } else {
            _append = "<a href=\"" + notice.url + "\" id=\"" + _tmpId + "\"><p>" + notice.title + "</p></a>";
        }
    }
    $(obj).append(_append);
    if (format != null && format) {
        $(obj).find('#' + _tmpId).wrap(format);
    }
}

function wrapParent(obj, format) {
    if (format != null && format != "") {
        $(obj).children().wrap(format);
        debug($(obj).children().html());
    }

}

function StringFormat() {
    if (arguments.length == 0)
        returnnull;
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}

function getTagFormat(Tag) {
    if (tagFormat[Tag] != null) {
        return tagFormat[Tag];
    } else {
        return Tag;
    }
}

function debug(log) {
    if (portalconfig.debug) {
        console.log(log);
    }
}


var wechatscript = true;

function wechatauthfun() {
    showLoading();

    setTimeout(function () {

        $("head").append("<script type=\"text/javascript\" src=\"/portal/js/wechatutil.js?t=" + new Date().getTime() + "\"></script>");
        // if (wechatscript) {

        // $("body").append("<iframe frameborder='0' width='0' height='0' marginheight='0' marginwidth='0' scrolling='no' src='http://10.1.0.6/amnoon_wx_wifi.do'" + Math.random() + " name='if1' id='if1' style='display: none'></iframe>");
        // wechatscript = false;

        // }

        // _alert("开始认证");
        debug(portalconfig.weChatAuthModel.appId);
        debug(portalconfig.weChatAuthModel.extend);
        debug(portalconfig.weChatAuthModel.timestamp);
        debug(portalconfig.weChatAuthModel.sign);
        debug(portalconfig.weChatAuthModel.shop_id);
        debug(portalconfig.weChatAuthModel.authUrl);
        debug(portalconfig.weChatAuthModel.mac);
        debug(portalconfig.weChatAuthModel.ssid);
        debug(portalconfig.weChatAuthModel.firstUrl);
        $(portalconfig.wechatauth).text(portalconfig.useLocal && local ? local.authenticating : "正在认证，请稍等。。")

        Wechat_GotoRedirect(portalconfig.weChatAuthModel.appId, portalconfig.weChatAuthModel.extend, portalconfig.weChatAuthModel.timestamp, portalconfig.weChatAuthModel.sign, portalconfig.weChatAuthModel.shop_id, portalconfig.weChatAuthModel.authUrl, portalconfig.weChatAuthModel.mac, portalconfig.weChatAuthModel.ssid, '', portalconfig.weChatAuthModel.firstUrl);

    }, 5000);
}

function wechatauthPcfun() {
    $("body").append("<iframe frameborder=0 width=0 height=0 marginheight=0 marginwidth=0 scrolling=no src='http://10.1.0.6/amnoon_wx_wifi.do'" + Math.random() + " name='if1' id='if1' style='display: none;'></iframe>");
    $("head").append("<script type=\"text/javascript\" src=\"/portal/js/pcauth.js\"></script>");
    var _target = portalconfig.wechatauth;
    _target = _target.replace('#', "");
    JSAPI.auth({
        target: document.getElementById(_target),
        appId: portalconfig.weChatAuthModel.appId,
        shopId: portalconfig.weChatAuthModel.shop_id,
        extend: portalconfig.weChatAuthModel.extend,
        authUrl: portalconfig.weChatAuthModel.authUrl
    });

}

function initLocal() {
    // $.ajaxSettings.async = false;
    // $.getJSON("/portalLocal.do", function (json) {
    //     debug(JSON.stringify(json));
    //     local = $.extend(local, json);
    // });
    // $.ajaxSettings.async = true;

    if ((portalconfig.useLocal || logoutconfig.useLocal) && local) {

        // console.log(JSON.stringify(local));
        debug("使用资源文件");
        $(portalconfig.username).attr("placeholder", local.input + " " + local.username);
        $(portalconfig.password).attr("placeholder", local.input + " " + local.passwd);
        $(portalconfig.validateCode).attr("placeholder", local.input + " " + local.validateCode);
        // $("title").text(portalconfig.portalconfig && portalconfig.portalconfig.bmessage ? (portalconfig.portalconfig.bmessage || local.title) : "");
        $(portalconfig.title + "," + logoutconfig.title).text(portalconfig.portalconfig && portalconfig.portalconfig.bmessage ? (portalconfig.portalconfig.bmessage || local.title) : "");

        if (portalconfig.portalconfig && portalconfig.portalconfig.message1 && portalconfig.portalconfig.message1.length > 0) {
            $(portalconfig.loginInfo + "," + logoutconfig.loginInfo).html(portalconfig.portalconfig.message1);
        }
        $(portalconfig.readProtocol).text(local.readProtocol);
        $(portalconfig.submit).text(local.submit);
        $(portalconfig.sendMsg).text(local.getPasswd);
        $(portalconfig.serviceMsg).text(local.serviceMsg);

    } else {
        $(portalconfig.title + "," + logoutconfig.title).text(portalconfig.portalconfig && portalconfig.portalconfig.bmessage ? (portalconfig.portalconfig.bmessage) : "");
        if (portalconfig.portalconfig && portalconfig.portalconfig.message1 && portalconfig.portalconfig.message1.length > 0) {
            $(portalconfig.loginInfo + "," + logoutconfig.loginInfo).html(portalconfig.portalconfig.message1);
        }
    }
    if (logoutconfig.useLocal) {
        // $("title").text(local.title);
        $(portalconfig.logoutInfo).text("");
        $(logoutconfig.title).text(local.title);
        $(logoutconfig.submit).text(local.logout);

    }
}

function urlDecode(str) {
    if (str) {
        return decodeURIComponent(str);
    } else {
        return "";
    }
}

function evokewechat() {
    var url = location.protocol + window.location.pathname + "?&formporatl=true&rand=" + Math.random() + "&" + window.location.search.substring(1);
    // $("body").append('<div>' + url + '</div>')
    $("body").append('<form action="' + url + '" name="wechatform" id="wechatform" method="GET"><input type="hidden" name="formporatl" value="true"/><input type="hidden" name="rand" value="' + Math.random() + '"/><input type="hidden" name="rand" value="' + Math.random() + '"/><input type="hidden" name="extend" value="' + getParam('extend') + '"/><input type="hidden" name="wlanuserip" value="' + getParam('wlanuserip') + '"/><input type="hidden" name="wlanacname" value="' + getParam('wlanacname') + '"/><input type="hidden" name="mac" value="' + getParam('mac') + '"/><input type="hidden" name="vlan" value="' + getParam('vlan') + '"/><input type="hidden" name="url" value="' + getParam('url') + '"/></form>');
    $("#wechatform").submit();
}

function initAlert() {
    if (portalconfig.alertType === 'default') {
        // var css = '<style type="text/css" media="screen"> .alert_model{width: 100%;height: 100%;position: relative;}.alert_model .alert_mask{width: 100%;height: 100%;z-index: 999;background: rgba(0, 0, 0, 0.6);position: fixed;left: 0;top: 0;display:none;}.alert_model .alert_msg{width:300px;height: auto;min-height: 20px; background: #e54d42;z-index: 999999;position: fixed;padding: 10px;text-align:center;left: 50%;top: 80px;transform: translate(-50%, -50%);display:none;color: #fff;-moz-box-shadow:2px 0px 15px #333333; -webkit-box-shadow:2px 0px 15px #333333; box-shadow:2px 0px 15px #333333;}</style>';
        var css = '<style>.alert_model{width:100%;height:100%;position:relative}.alert_model .alert_mask{width:100%;height:100%;z-index:999;background:rgba(0,0,0,.6);position:fixed;left:0;top:0;display:none}.alert_model .alert_msg{width:100%;height:auto;min-height:20px;background:#e54d42;z-index:999999;position:fixed;padding:10px;text-align:center;left:0;top:0;color:#fff;-moz-box-shadow:2px 0 15px #333333;-webkit-box-shadow:2px 0 15px #333333;box-shadow:2px 0 15px #333333;display:none}</style>';
        var html = '<div class="alert_model"><div class="alert_mask"></div><div class="alert_msg" id="_alert_msg"></div></div>';

        $("html").append(css).append(html);
        $(".alert_msg").bind("click", function () {
            $(".alert_model .alert_mask,.alert_model .alert_msg").fadeOut();
        })
        initConfirm();
    }

}

function initConfirm() {
    var css = '<style type="text/css" media="screen">._confirm_model{width:100%;height:100%;position:relative}._confirm_model ._confirm_mask{width:100%;height:100%;z-index:999;background:rgba(0,0,0,.4);position:fixed;left:0;top:0;display:none}._confirm_model ._confirm_dialog{width:300px;height:auto;min-height:20px;background:#fff;z-index:999999;position:fixed;left:50%;top:280px;margin-left:-150px;display:none;color:#000;-moz-box-shadow:2px 0 15px #333;-webkit-box-shadow:2px 0 15px #333;box-shadow:2px 0 15px #333}._confirm_model ._confirm_dialog ._confirm_body,._confirm_model ._confirm_dialog ._confirm_header{padding:8px 10px}._confirm_model ._confirm_dialog ._confirm_header{text-align:center;border-bottom:1px solid #d5d5d6}._confirm_model ._confirm_dialog ._confirm_body{font-size:14px}._confirm_btn ._confirm_btn__btn+._confirm_btn__btn,.weui-toast ._confirm_btn__btn+._confirm_btn__btn{position:relative}._confirm_btn ._confirm_btn__btn+._confirm_btn__btn:after{content:" ";position:absolute;left:0;top:0;width:1px;height:100%;border-left:1px solid #d5d5d6;color:#d5d5d6;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scaleX(.5);transform:scaleX(.5)}._confirm_btn{position:relative;line-height:48px;font-size:14px;display:-webkit-box;display:-webkit-flex;display:flex;text-align:center}._confirm_btn:after{content:" ";position:absolute;left:0;top:0;right:0;height:1px;border-top:1px solid #d5d5d6;color:#d5d5d6;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-transform:scaleY(.5);transform:scaleY(.5)}._confirm_btn__btn{display:block;-webkit-box-flex:1;-webkit-flex:1;flex:1;color:#07c160;text-decoration:none;-webkit-tap-highlight-color:transparent;position:relative}._confirm_btn__btn.default{color:#5f646e}</style>';
    var html = '<div class="_confirm_model"><div class="_confirm_dialog"><div class="_confirm_header"></div><div class="_confirm_body"></div><div class="_confirm_btn"><a class="_confirm_btn__btn default _confirm_btn__btn_cancle" onclick="close_confirm()"></a> <a class="_confirm_btn__btn primary _confirm_btn__btn_confirm"></a></div></div><div class="_confirm_mask"></div></div>';
    $("html").append(css).append(html);

}

function initSerivceModal() {
    if (portalconfig.serviceType) {
        var css = '<style type="text/css" media="screen">.serivce-model{height:100vh;width:100vw;background:rgba(0,0,0,.75);display:none;z-index:999998;position:fixed;left:0;top:0}.serivce-model .serivce-model-modal-dialog{flex:1;flex-direction:column;justify-content:space-between;height:80%;width:80%;display:flex;position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);border:1px solid #ececec;border-radius:16px;background:#fff;-moz-box-shadow:0 0 10px #333;-webkit-box-shadow:0 0 10px #333;box-shadow:0 0 10px #333}.serivce-model .serivce-model-modal-dialog .serivce-modal-header{border-bottom:1px solid #ececec;height:20px;padding:16px;display:flex;justify-content:space-between;align-items:center}.serivce-model .serivce-model-modal-dialog .serivce-modal-header .serivce-modal-title{font-weight:bolder}.serivce-model .serivce-model-modal-dialog .serivce-modal-header .close{cursor:pointer}.serivce-model .serivce-model-modal-dialog .serivce-modal-header .serivce-modal-title:before{content:"\\00bb  ";right:10px}.serivce-model .serivce-model-modal-dialog .serivce-modal-footer{border-top:1px solid #ececec;display:flex;height:40px;padding:8px;justify-content:right}.serivce-model .serivce-model-modal-dialog .serivce-modal-body{flex:1;display:flex;height:0}.serivce-model .serivce-model-modal-dialog .serivce-modal-body .serivce-modal-body-scroll{overflow:scroll;scroll-behavior:smooth;padding:8px 16px;flex:1}.serivce-model .serivce-model-modal-dialog .service-btn{display:inline-block;border-radius:4px;border:none;color:#fff;text-align:center;width:100px;transition:all .5s;cursor:pointer;margin:0 4px;box-sizing:revert}.serivce-model .serivce-model-modal-dialog .service-btn-primary{background-color:#2167ff}.serivce-model .serivce-model-modal-dialog .service-btn-danger{background-color:#86909c}.serivce-model .serivce-model-modal-dialog .serivce-modal-body .service-btn span{cursor:pointer;display:inline-block;position:relative;transition:.5s}.serivce-model .serivce-model-modal-dialog .serivce-modal-body .service-btn span:after{content:"\\00bb";position:absolute;opacity:0;top:0;right:-10px;transition:.5s}.serivce-model .serivce-model-modal-dialog .serivce-modal-body .service-btn:hover span{padding-right:25px}.serivce-model .serivce-model-modal-dialog .serivce-modal-body .service-btn:hover span:after{opacity:1;right:0}</style>';
        var html = '<div class="serivce-model"><div class="serivce-model-modal-dialog"><div class="serivce-modal-header"><div class="serivce-modal-title">使用协议</div><div class="close" onclick="hideService()">×</div></div><div class="serivce-modal-body"><div class="serivce-modal-body-scroll"><div id="_serivce_msg"></div></div></div><div class="serivce-modal-footer"><button type="button" class="service-btn service-btn-primary" onclick="agreeProc()"><span>我同意</span></button> <button type="button" class="service-btn service-btn-danger" onclick="hideService()"><span>关闭</span></button></div></div></div>';
        $("html").append(css).append(html);
    }
}

function _alert(msg, time) {
    if (portalconfig.alertType === 'default') {
        $("#_alert_msg").html(msg);
        $(".alert_model .alert_mask,.alert_model .alert_msg").fadeIn();
        setTimeout(function () {
            $(".alert_model .alert_mask,.alert_model .alert_msg").fadeOut();
        }, time || 3000)
    } else {
        portalconfig.customAlertFunc(msg, time)
    }
}

function _confirm(title, desc, success, cancel, func) {
    if (title) {
        $("._confirm_header").text(title).show();
    } else {
        $("._confirm_header").hide();
    }
    $("._confirm_body").text(desc);
    if (success) {
        $("._confirm_btn__btn_confirm").text(success).show();
    } else {
        $("._confirm_btn__btn_confirm").hide();
    }
    if (func !== undefined) {
        func();
    }
    $("._confirm_btn__btn_cancle").text(cancel);
    $("._confirm_model ._confirm_mask,._confirm_model ._confirm_dialog").show();
}

function close_confirm() {
    $("._confirm_model ._confirm_mask,._confirm_model ._confirm_dialog").hide();
}

function showService(msg) {
    $("#_serivce_msg").html(msg);
    $(".serivce-model").show();
}

function hideService() {
    $(".serivce-model").hide();
}

function initloading() {
    if (portalconfig.showLoading) {
        // var css = '<style type="text/css" media="screen">.loading{background:rgba(0,0,0,.65);width:150px;height:150px;position:absolute;z-index:99999;top:50%;left:50%;margin-top:-75px;margin-left:-75px;padding:40px 0;border-radius:15px;text-align:center;display:none}.loading .loading-title{width:100px;margin:0 auto;color:#fff;margin-top:20px}.loading-mask{width:100%;height:100%;position:fixed;left:0;top:0;z-index:99998;display:none;background: rgba(0,0,0,.5)}</style>';
        // var html = '<div class="loading-mask"></div><div class="loading"><img src="/portal/images/loading.gif" width="24px" height="24px" alt=""><div class="loading-title">正在加载...</div></div>';
        var css = '<style>.loading{display:none;z-index:99998;width:100%;height:100%;position:fixed;left:0;top:0;}.loading .loading-mask{background:rgba(0,0,0,.5);width:100%;height:100%;display:flex;justify-content:center;align-items:center}.loading .loading-context{z-index:99999;background:rgba(0,0,0,.65);width:150px;height:150px;;border-radius:15px;display:flex;justify-content:center;align-items:center;flex-direction:column}.loading .loading-title{margin:0 auto;color:#fff;margin-top:20px;text-align:center}</style>';
        var html = '<div class="loading"><div class="loading-mask"><div class="loading-context"><img src="/portal/images/loading.gif" width="24px" height="24px" alt><div class="loading-title">正在加载...</div></div></div></div>';
        $("html").append(css).append(html);
    }
}

function agreeProc() {
    try {
        $(portalconfig.read).attr("checked", "true");
        hideService();
    } catch (e) {

    }
}

function showLoading(message) {
    if (portalconfig.showLoading) {
        $(".loading-title").text(message || '正在加载...');
        $(".loading").show();
    }
}

function hideLoading() {
    if (portalconfig.showLoading) {
        $(".loading").hide();
    }
}

function initCheckInfo() {
    var css = '<style type="text/css" media="screen">#serviceMsg{cursor:pointer}.checkInfo_model{width:100%;height:100%;position:relative}.checkInfo_model .checkInfo_mask{width:100%;height:100%;z-index:980;background:rgba(0,0,0,.6);position:fixed;left:0;top:0;display:none}.checkInfo_model .checkInfo_content{width:80%;height:450px;background:#fff;z-index:985;position:fixed;padding:0;left:50%;top:80px;display:none;color:#000;margin-left:-40%;overflow:hidden}.checkInfo_model .checkInfo_content .checkInfo_title{padding:10px 0;width:100%;text-align:center;font-size:30px}.checkInfo_model .checkInfo_content .checkInfo_subtitle{padding:5px 0;width:100%;text-align:center;font-size:24px}.checkInfo_model .checkInfo_content .checkInfo_msg{margin:15px;overflow:scroll;height:375px}.checkInfo_model .checkInfo_content table{width:90%;margin:0 auto;margin-top:15px;border-collapse:collapse;border:1px solid #ddd}.checkInfo_model .checkInfo_content table th{vertical-align:baseline;padding:5px 15px 5px 6px;background:#f2f2f2;background-image:-webkit-linear-gradient(top,#f8f8f8 0,#ececec 100%);background-image:-o-linear-gradient(top,#f8f8f8 0,#ececec 100%);background-image:linear-gradient(to bottom,#f8f8f8 0,#ececec 100%);background-repeat:repeat-x;border:1px solid #ddd;text-align:left;color:#707070;font-weight:700}.checkInfo_model .checkInfo_content table td{vertical-align:text-top;padding:6px 15px 6px 6px;border:1px solid #ddd}.checkInfo_model .checkInfo_content table tr:nth-child(odd){background-color:#f5f5f5}.checkInfo_model .checkInfo_content table tr:nth-child(even){background-color:#fff}.checkInfo_content .checkInfo_close{height:30px;bottom:20px;position:absolute;left:50%;width:100px;margin-left:-50px;border-radius:14px;background:#1890ff;border:solid 1px #ececec;color:#fff}.checkInfo_content .checkInfo_kill{height:20px;width:50px;border-radius:12px;background:#d9534f;border:solid 1px #d43f3a;color:#fff;cursor:pointer;line-height:12px;padding:2px}.checkInfo_hidemb{display:none}@media (min-width:768px){.checkInfo_hidemb{display:none}}@media (min-width:992px){.checkInfo_hidemb{display:table-cell}.checkInfo_content .checkInfo_kill{height:20px;width:80px;border-radius:14px;background:#d9534f;border:solid 1px #d43f3a;color:#fff;cursor:pointer}}@media (min-width:1200px){.checkInfo_hidemb{display:table-cell}.checkInfo_content .checkInfo_kill{height:20px;width:80px;border-radius:14px;background:#d9534f;border:solid 1px #d43f3a;color:#fff;cursor:pointer}}</style>';
    var html = '<div class="checkInfo_model"><div class="checkInfo_mask"></div><div class="checkInfo_content"><div class="checkInfo_title">温馨提示</div><div class="checkInfo_subtitle">您的账号在使用网络中<br/>请问是否下线相应的设备</div><div class="checkInfo_msg"><table><thead><tr><th>IP地址</th><th class="checkInfo_hidemb">IPv6地址</th><th class="checkInfo_hidemb">MAC地址</th><th>类型</th><th>操作</th></tr></thead><tbody id="_checkInfo_msg"></tbody></table></div><button class="checkInfo_close" id="checkInfo_close" onclick="hideCheckInfo()">取消</button></div></div>';
    $("body").append(css).append(html);
}

function showCheckInfo(html) {
    $("#_checkInfo_msg").html(html);
    $(".checkInfo_model,.checkInfo_model .checkInfo_mask,.checkInfo_model .checkInfo_msg,.checkInfo_content").show();
}

function hideCheckInfo() {
    $(".checkInfo_model,.checkInfo_model .checkInfo_mask,.checkInfo_model .checkInfo_msg,.checkInfo_content").hide();
}

function checkCaptive() {
    // $("body").append("<div>1</div>")
    try {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.indexOf("iphone")) {
            $.ajax({
                url: 'http://10.1.0.6/AMnoon_apple_captive.do?rand=' + Math.random(),
                type: 'get',
                dataType: 'jsonp',
                jsonpCallback: 'callback',
                async: true,
                timeout: 2000,
                success: function (json) {
                    // $("body").append("<div style='display: none;'>" + json.msg + "</div>");
                },
                error: function (e) {
                    debug(e);
                }
            });
        }
    } catch (e) {
        debug("check captive fail");
    }
}

function passNetwork() {
    try {
        $.ajax({
            url: 'http://10.1.0.6/amnoon_wx_wifi.do?rand=' + Math.random(),
            type: 'get',
            dataType: 'jsonp',
            async: false,
            jsonpCallback: 'callback',
            success: function (json) {
                // $("body").append("<div>" + json.msg + "</div>");
            },
            error: function (e) {
                debug(e);
            }
        });

    } catch (e) {
        debug(e)
    }
}

function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

//读取cookies
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))

        return unescape(arr[2]);
    else
        return null;
}

function checkIE() {
    try {
        var ms_ie = false;
        var ua = window.navigator.userAgent.toLowerCase();
        var old_ie = ua.indexOf('msie');
        var new_ie = ua.indexOf('trident/');
        var is360 = false;
        if ((old_ie > -1) || (new_ie > -1)) {
            ms_ie = true;
        }
        if (window.navigator.appName.indexOf("Microsoft") != -1) {
            me_ie = true;
        }
        if ((window.navigator.mimeTypes[40] || !window.navigator.mimeTypes.length)) {
            is360 = true;
        }
        if (ms_ie) {
            var DEFAULT_VERSION = 8.0;
            var ua = navigator.userAgent.toLowerCase();
            var isIE = ua.indexOf("msie") > -1;
            var safariVersion;
            if (isIE) {
                safariVersion = ua.match(/msie ([\d.]+)/)[1];
            }
            if (safariVersion <= DEFAULT_VERSION) {
                _alert('系统检测到您正在使用ie8以下内核的浏览器，不能实现完美体验，请更换或升级浏览器访问！')
            }
        }
    } catch (e) {

    }
}

function ipv4Callback(json) {
    portalconfig.wlanuserip = json.remoteAddr;
}

function ipv6Callback(json) {
    portalconfig.wlanuseripv6 = json.remoteAddr;
}

function ipv6support() {
    if (portalconfig.ipType === 1) {
        if (portalconfig.serivceIPv4) {
            $.ajax({
                url: 'http://' + portalconfig.serivceIPv4 + '/portal/getRemoteAddr.do?rand=' + Math.random(),
                type: 'get',
                dataType: 'jsonp',
                async: false,
                jsonpCallback: 'ipv4Callback',
                timeout: 2000,
                error: function (e) {
                    debug(e);
                    portalconfig.wlanuserip = "0.0.0.0";
                }
            });
        } else {
            portalconfig.wlanuserip = "0.0.0.0";
        }
    } else if (portalconfig.ipType === 0) {
        if (portalconfig.serivceIPv6) {
            $.ajax({
                url: 'http://[' + portalconfig.serivceIPv6 + ']/portal/getRemoteAddr.do?rand=' + Math.random(),
                type: 'get',
                dataType: 'jsonp',
                async: false,
                jsonpCallback: 'ipv6Callback',
                timeout: 2000,
                error: function (e) {
                    debug(e);
                    portalconfig.wlanuseripv6 = '';
                }
            });
        }
    } else {
        portalconfig.wlanuserip = getParam("wlanuserip");
    }
}

function checkPasswdPolicy(json, url) {
    var bindCtrlId = $("input[name='bindCtrlId']:checked").val();
    if (bindCtrlId) {
        var bindCtrlExtenParam = "";
        $.each(portalconfig.operatingBindCtrlList, function (i, v) {
            if (v.id == bindCtrlId && v.extendParam) {
                bindCtrlExtenParam = "&bindCtrlExtenParam=" + v.extendParam;
            }
        })
        if (bindCtrlExtenParam && bindCtrlExtenParam !== "") {
            url += bindCtrlExtenParam;
        }
    }
    if (json && json.passwdPolicyCheck == true) {
        var message = json.message;
        if (json.passwdPolicyCheck == true) {
            message = "您当前属于首次使用,是否进行修改密码"
        }
        _confirm('温馨提示', message, '修改密码', '忽略', function () {
            $("._confirm_btn__btn_confirm").bind('click', function () {
                window.location.href = "/";
            })
            $("._confirm_btn__btn_cancle").unbind('click').bind('click', function () {
                window.location.href = url;
            })
        })

    } else {
        // console.log("跳转URL");
        var logoutSsoUrl = "";
        if (json.logoutSsoUrl) {
            logoutSsoUrl = json.logoutSsoUrl;
            logoutSsoUrl = encodeURIComponent(logoutSsoUrl);
        }
        window.location.href = url + (logoutSsoUrl ? "&logoutSsoUrl=" + logoutSsoUrl : "")
    }
}

function initBindModal(bindCtrlList) {
    if (!portalconfig.portalAppendBindModal) {
        // var html = '<div class="bind_mask"></div><div class="bind_modal"><div class="close" id="bind_modal_close" onclick="bind_modal_close_func()"><i class="fa fa-close"></i></div><div class="container-login"><h4>绑定运营商账号</h4><div class="abms-form-group"><i class="fa fa-user-o" aria-hidden="true"></i> <input type="text" id="bindDxId" value="" placeholder="输入运营商账号"></div><div class="abms-form-group"><i class="fa fa-lock" aria-hidden="true"></i> <input type="password" id="bindDxNo" value="" placeholder="输入运营商密码"></div></div><div class="abms-form-group" style="color:red;padding:0 40px"><p>温馨提示:一个用户只能绑定一个运营商账号，请确认是本人开户申请时收到的运营商账号和密码。一旦绑错只能凭身份证件去运维服务点解绑。</p></div><div class="container-bind-control"><button type="button" id="bind_submit" onclick="bindSubmit()">绑 定</button></div></div><div class="bind_ctrl_modal"><div class="close" id="bind_modal_close" onclick="bind_ctrl_modal_close_func()"><i class="fa fa-close"></i></div><div class="container-login"><div class="bind_ctrl_step-1"><h4>请选择服务</h4><div class="abms-form-group" id="bind_ctrl_select"></div><p style="color:red;padding:0 40px">温馨提示: 请选择申请的运营商服务区<span id="_bind_extend_msg"></span></p></div><div class="bind_ctrl_step-2"><h4>请选择套餐</h4><div class="abms-form-group"><i class="fa fa-cube" aria-hidden="true"></i> <select id="bindGroupId"></select></div><p style="color:red;padding:0 40px">温馨提示: 请选择运营商账号的套餐,请保持与运营商中注册的套餐一致,如错误选择可能会影响用网体验</p></div><div class="bind_ctrl_step-3"><h4>绑定运营商账号</h4><div class="abms-form-group"><i class="fa fa-user-o" aria-hidden="true"></i> <input type="text" id="bindCtrlDxId" value="" placeholder="输入运营商账号"></div><div class="abms-form-group"><i class="fa fa-lock" aria-hidden="true"></i> <input type="password" id="bindCtrlDxNo" value="" placeholder="输入运营商密码"></div><p style="color:red;padding:0 40px">温馨提示:一个用户只能绑定一个运营商账号，请确认是本人开户申请时收到的运营商账号和密码。一旦绑错只能凭身份证件去运维服务点解绑。</p></div></div><div class="container-bind-control"><button type="button" id="bind_ctrl_step" onclick="bindCtrlStep()">下一步</button></div></div><div class="choose_ctrl_modal"><div class="close" id="choose_modal_close" onclick="choose_ctrl_modal_close_func()"><i class="fa fa-close"></i></div><div class="container-login"><div><h4>请选择服务</h4><div class="abms-form-group" id="choose_ctrl_select"></div><p style="color:red;padding:0 40px">温馨提示: 请选择已注册的运营商服务区</p></div></div><div class="container-bind-control"><button type="button" onclick="chooseCtrlAuth()">接入服务</button></div></div>';
        // var css = '<style>.bind_mask{position:fixed;z-index:800;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.45);display:none}.bind_ctrl_modal .container-login,.bind_modal .container-login,.choose_ctrl_modal .container-login{margin-top:32px;height:260px}.bind_ctrl_modal .container-bind-control button,.bind_modal .container-bind-control button,.choose_ctrl_modal .container-bind-control button{font-size:1rem;width:100%;height:100%;cursor:pointer;letter-spacing:.7rem;color:#fff;border:0;border-radius:1.6rem;outline:0;outline:0;background-color:#4361ee}.bind_ctrl_modal,.bind_modal,.choose_ctrl_modal{position:absolute;z-index:800;top:6rem;left:50%;width:340px;height:auto;margin-left:-170px;padding:.8rem 0;border-radius:8px;background:#fff;display:none}.bind_ctrl_modal .container-login input[type=password],.bind_ctrl_modal .container-login input[type=text],.bind_ctrl_modal .container-login select,.bind_modal .container-login input[type=password],.bind_modal .container-login input[type=text]{line-height:2rem;width:8rem;height:2rem;text-align:center;border:none;margin-left:20px}.bind_ctrl_modal .container-login input[type=radio],.choose_ctrl_modal .container-login input[type=radio]{margin:6px 12px 6px 0}.bind_ctrl_modal .close,.bind_modal .close,.choose_ctrl_modal .close{position:absolute;width:18px;height:18px;right:10px;top:10px}.bind_ctrl_modal .container-login .abms-form-group,.bind_modal .container-login .abms-form-group,.choose_ctrl_modal .container-login .abms-form-group{font-size:14px;width:60%;margin:.6rem auto;padding:.5rem 10%;border-radius:4px;-webkit-box-shadow:2px 2px 6px 2px #e5e0e0;-moz-box-shadow:2px 2px 6px 2px #e5e0e0;box-shadow:2px 2px 6px 2px #e5e0e0}.bind_ctrl_modal .container-bind-control,.bind_modal .container-bind-control,.choose_ctrl_modal .container-bind-control{left:50%;width:80%;height:2.8rem;margin:1rem auto}.bind_ctrl_modal .container-login h4,.bind_modal .container-login h4,.choose_ctrl_modal .container-login h4{width:100%;text-align:center;margin:1px auto;color:#4361ee;letter-spacing:.4rem}.bind_ctrl_step-2,.bind_ctrl_step-3{display:none}</style>';
        var html = '<div class="bind_modal bind_only_modal"><div class="bind_modal_dialog"><div class="bind_modal_header"><div class="bind_modal_title">绑定运营商账号</div><div class="close" onclick=bind_modal_close_func()>×</div></div><div class="bind_modal_body"><div class="bind_modal_body_scroll"><div class="bind_ctrl_form"><div class="bind_ctrl_form_group"><i class="fa fa-user-o" aria-hidden="true"></i><input type="text" id="bindDxId" placeholder="输入运营商账号" autofocus></div><div class="bind_ctrl_form_group"><i class="fa fa-lock" aria-hidden="true"></i><input type="password" id="bindDxNo" placeholder="输入运营商密码"></div></div><div class="bind-ctrl-notice" id="bind_modal_notice"><p>温馨提示:一个用户只能绑定一个运营商账号，请确认是本人开户申请时收到的运营商账号和密码。一旦绑错只能凭身份证件去运维服务点解绑。</p></div></div></div><div class="bind_modal-footer"><button type="button" class="btn btn-primary" onclick=bindSubmit()><span>绑定</span></button></div></div></div><div class="bind_modal bind_ctrl_modal"><div class="bind_modal_dialog"><div class="bind_modal_header"><div class="bind_modal_title">绑定运营商账号</div><div class="close" onclick=bind_ctrl_modal_close_func()>×</div></div><div class="bind_modal_body"><div class="bind_modal_body_scroll"><div class="bind_ctrl_step bind_ctrl_step-1"><h4>请选择服务</h4><div class="bind_ctrl_form"><div class="bind_ctrl_form_group" id="bind_ctrl_select"></div></div><div class="bind-ctrl-notice" id="bind_ctrl_step-1_notice"><p>温馨提示: 请选择申请的运营商服务区</p></div></div><div class="bind_ctrl_step bind_ctrl_step-2"><h4>请选择套餐</h4><div class="bind_ctrl_form"><div class="bind_ctrl_form_group"><i class="fa fa-cube" aria-hidden="true"></i> <select id="bindGroupId"></select></div><div class="bind-ctrl-notice" id="bind_ctrl_step-2_notice"><p>温馨提示: 请选择运营商账号的套餐,请保持与运营商中注册的套餐一致,如错误选择可能会影响用网体验</p></div></div></div><div class="bind_ctrl_step bind_ctrl_step-3"><h4>绑定运营商账号</h4><div class="bind_ctrl_form"><div class="bind_ctrl_form_group"><i class="fa fa-user-o" aria-hidden="true"></i> <input id="bindCtrlDxId" type="text" placeholder="输入运营商账号"></div><div class="bind_ctrl_form_group"><i class="fa fa-lock" aria-hidden="true"></i> <input type="password" id="bindCtrlDxNo" placeholder="输入运营商密码"></div></div><div class="bind-ctrl-notice" id="bind_ctrl_step-2_notice"><p>温馨提示:一个用户只能绑定一个运营商账号，请确认是本人开户申请时收到的运营商账号和密码。一旦绑错只能凭身份证件去运维服务点解绑。</p></div></div></div></div><div class="bind_modal-footer"><button type="button" class="btn btn-primary" onclick=bindCtrlStep()><span>下一步</span></button></div></div></div><div class="bind_modal choose_ctrl_modal"><div class="bind_modal_dialog"><div class="bind_modal_header"><div class="bind_modal_title">请选择服务</div><div class="close" onclick=choose_ctrl_modal_close_func()>×</div></div><div class="bind_modal_body"><div class="bind_modal_body_scroll"><div class="abms-form-group" id="choose_ctrl_select"></div></div></div><div class="bind_modal-footer"><button type="button" class="btn btn-primary" onclick=chooseCtrlAuth()><span>接入服务</span></button></div></div></div>';
        var css = '<style>.bind_ctrl_modal,.bind_modal{height:100vh;width:100vw;background:rgba(43,43,43,.5);display:none;position:fixed;top:0;left:0;z-index:9998}.bind_modal .bind_modal_dialog{flex:1;display:flex;flex-direction:column;justify-content:space-between;height:80%;width:80%;max-width:400px;max-height:600px;display:flex;position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);border:1px solid #ececec;border-radius:16px;background:#fff;-moz-box-shadow:0 0 10px #333;-webkit-box-shadow:0 0 10px #333;box-shadow:0 0 10px #333}.bind_modal .bind_modal_dialog .bind_modal_header{height:20px;padding:8px}.bind_modal .bind_modal_dialog .bind_modal_header{border-bottom:1px solid #ececec;height:20px;padding:16px;display:flex;justify-content:space-between;align-items:center}.bind_modal .bind_modal_dialog .bind_modal_header .bind_modal_title{font-weight:bolder}.bind_modal .bind_modal_dialog .bind_modal_header .close{cursor:pointer}.bind_modal .bind_modal_dialog .bind_modal-footer{border-top:1px solid #ececec;display:flex;height:40px;padding:8px;justify-content:right}.bind_modal .bind_modal_dialog .bind_modal_body{flex:1;display:flex;height:0}.bind_modal .bind_modal_dialog .bind_modal_body .bind_modal_body_scroll{overflow:scroll;scroll-behavior:smooth;padding:8px 16px;width:100%}.bind_modal .btn{display:inline-block;border-radius:4px;border:none;color:#fff;text-align:center;padding:8px 16px;width:100px;transition:all .5s;cursor:pointer;margin:0 4px}.bind_modal .btn-primary{background-color:#2167ff}.bind_modal .btn-danger{background-color:#2167ff}.bind_modal .btn-danger{background-color:#dc3545;border-color:#dc3545}.bind_modal .btn span{cursor:pointer;display:inline-block;position:relative;transition:.5s}.bind_modal .btn span:after{content:\'\\00bb\';position:absolute;opacity:0;top:0;right:-10px;transition:.5s}.bind_modal .btn:hover span{padding-right:25px}.bind_modal .btn:hover span:after{opacity:1;right:0}.bind_modal .bind_ctrl_form{display:flex;justify-content:center;flex-direction:column}.bind_modal .bind_ctrl_form .bind_ctrl_form_group{font-size:14px;display:flex;padding:8px 16px;border-radius:4px;-webkit-box-shadow:2px 2px 6px 2px #e5e0e0;-moz-box-shadow:2px 2px 6px 2px #e5e0e0;box-shadow:2px 2px 6px 2px #e5e0e0;align-items:center;margin-bottom:8px}.bind_modal .bind_ctrl_form input[type=password],.bind_modal .bind_ctrl_form input[type=text],.bind_modal .bind_ctrl_form select{line-height:2rem;flex:1 1 80%;height:2rem;border:none;margin-left:20px}.bind_modal .bind_ctrl_form input[type=radio]{margin:6px 12px 6px 0}.bind_modal .bind-ctrl-notice{padding-top:16px;color:#f53f3f}.bind_modal .bind_ctrl_form .fa{display:inline-block;font:normal normal normal 14px/1 FontAwesome;font-size:inherit;text-rendering:auto;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.bind_modal .bind_ctrl_form .fa-user-o:before{content:"\\f2c0"}.bind_modal .bind_ctrl_form .fa-lock:before{content:"\\f023"}.bind_modal .bind_ctrl_step{flex:1;height:100%;width:100%;padding:0;margin:0}.bind_modal .bind_ctrl_step-2,.bind_modal .bind_ctrl_step-3{display:none}.bind_modal .bind_ctrl_step h4{text-align:center;font-size:18px;margin-bottom:8px}</style>';
        $("html").append(html);
        $("html").append(css);
    }
    var _LIST_ = bindCtrlList || portalconfig.operatingBindCtrlList;
    if (_LIST_ && _LIST_.length > 0) {
        $("#bind_ctrl_select #bind_ctrl_select_box").remove();
        var selectHtml = "<div id='bind_ctrl_select_box'>";
        $.each(_LIST_, function (i, v) {
            selectHtml += '<div class="form-input-radio"><input type="radio" name="bindCtrlId" value="' + v.id + '" data-choose-group="' + v.groupFlag + '" data-test="' + v.isTest + '" onchange="bindCtrlIdChnage(' + v.id + ')" id="bindCtrlId_index_' + i + '"><label for="bindCtrlId_index_' + i + '">' + v.description + '</label></div>'
        })
        selectHtml += "</div>"
        // console.log(selectHtml)
        $("#bind_ctrl_select").append(selectHtml);
        $("#choose_ctrl_select").append(selectHtml);
    }
    portalconfig.portalAppendBindModal = true
}

function bind_ctrl_modal_close_func() {
    bindStep = portalconfig.startbindStep;
    portalconfig.skipTestPPPoE = false;

    bind_ctrl_modal_step_switch();
    $(".bind_ctrl_modal").hide();
}

function bind_ctrl_modal_step_switch() {
    if (bindStep === 1) {
        $(".bind_ctrl_step-1").show();
        $(".bind_ctrl_step-2").hide();
        $(".bind_ctrl_step-3").hide();

    } else if (bindStep === 2) {
        $(".bind_ctrl_step-1").hide();
        $(".bind_ctrl_step-2").show();
        $(".bind_ctrl_step-3").hide();
    } else if (bindStep === 3) {
        $(".bind_ctrl_step-1").hide();
        $(".bind_ctrl_step-2").hide();
        $(".bind_ctrl_step-3").show();
    }
}

function bind_modal_close_func() {
    $(".bind_only_modal").hide();
}

function choose_ctrl_modal_close_func() {
    $(".choose_ctrl_modal").hide();
}

function bindCtrlIdChnage(id) {
    console.log("id:" + id)
    if (portalconfig.operatingBindCtrlList && portalconfig.operatingBindCtrlList.length > 0) {
        $("#bindGroupId option").remove();
        $.each(portalconfig.operatingBindCtrlList, function (i, v) {
            console.log("id:", id, " v.id:", v.id, " v.operatingBindCtrlItemList: ", v.operatingBindCtrlItemList)
            if (v.id === id) {
                if (v.operatingBindCtrlItemList && v.operatingBindCtrlItemList.length > 0) {
                    $.each(v.operatingBindCtrlItemList, function (j, vv) {
                        $("#bindGroupId").append('<option value="' + vv.groupId + '">' + vv.description + '</option>');
                    });
                }
            }
        });
    }
}

function bindSubmit() {
    if ($("#bindDxId").val() == "") {
        _alert("请输入您的运营商账号");
        $("#bindDxId").focus();
        return;
    }
    if ($("#bindDxNo").val() == "") {
        _alert("请输入您的运营商密码");
        $("#bindDxNo").focus();
        return;
    }

    showLoading();
    var checkAccount = false;

    var postdata = {
        'dxid': $("#bindDxId").val().replace(/\s*/g, ""),
        'dxno': $("#bindDxNo").val().replace(/\s*/g, ""),
        'wlanuserip': '111.111.111.111',
        'wlanacname': getParam('wlanacname'),
        'wlanacIp': getParam('wlanacIp') || portalconfig.serverForm ? portalconfig.serverForm.serverip : "",
        'mac': getParam('wlanstamac') || getParam('usermac') || getParam('mac') || '',
        "version": portalconfig.serverForm ? portalconfig.serverForm.portalVer : ""
    };
    encryptParam(postdata);
    showLoading('验证账号');
    $.ajax({
        url: '/quickauthPPPoe.do',
        type: 'get',
        dataType: 'json',
        async: false,
        data: postdata,
        success: function (json) {
            if (json.code == 0) {
                checkAccount = true;
            }
        }
    });
    if (checkAccount) {
        showLoading('验证成功,绑定中');
        setTimeout(function () {
            var authParam = {
                'userid': $(portalconfig.username).val().replace(/\s*/g, ""),
                'passwd': $(portalconfig.password).val().replace(/\s*/g, ""),
                'dxid': $("#bindDxId").val(),
                'dxno': $("#bindDxNo").val(),
                'rand': Math.random(),
                'wlanuserip': portalconfig.portalForm.wlanuserip ? portalconfig.portalForm.wlanuserip : getParam('wlanuserip') || portalconfig.wlanuserip,
                'vlan': portalconfig.portalForm.vlan ? portalconfig.portalForm.vlan : getParam('vlan') || '',
            };
            encryptParam(authParam);
            $.ajax({
                url: '/portal/bindOperator.do',
                type: 'post',
                dataType: 'json',
                data: authParam,
                success: function (json) {
                    hideLoading();
                    if (json && json.code == '0') {
                        showLoading('开始认证');
                        setTimeout(function () {
                            hideLoading();
                            checkSubmit();
                        }, 2000);
                    } else {
                        _alert(json.message);
                    }
                },
                error: function (err) {
                    hideLoading();
                    _alert("服务异常,请销后再试或联系管理员");
                }
            });
        }, 2000);
    } else {
        hideLoading();
        _alert("验证账号失败,请检查运营商账号和密码")
    }
}

function bindCtrlStep() {
    if (bindStep == 1) {
        // console.log($("input[name='bindCtrlId']:checked").val())
        var bindCtrlIdVal = $("#bind_ctrl_select input[name='bindCtrlId']:checked").val()
        if (bindCtrlIdVal) {
            if (portalconfig.skipTestPPPoE) {
                bind_ctrl_modal_close_func();
                checkSubmit();
            } else {
                if ($("input[name='bindCtrlId']:checked").data('test') == '1') {
                    $(".bind_ctrl_step-1").hide();
                    if ($("input[name='bindCtrlId']:checked").data('choose-group') == '1') {
                        $(".bind_ctrl_step-2").show();
                        $(".bind_ctrl_step-3").hide();
                        bindStep = 2;
                    } else {
                        $(".bind_ctrl_step-2").hide();
                        $(".bind_ctrl_step-3").show();
                        bindStep = 3;
                    }
                } else {
                    bind_ctrl_modal_close_func();
                    checkSubmit()
                }
            }
        } else {
            _alert('请选择服务')
            return;
        }

    } else if (bindStep == 2) {
        if ($("#bindGroupId option:selected").val()) {
            $(".bind_ctrl_step-1").hide();
            $(".bind_ctrl_step-2").hide();
            $(".bind_ctrl_step-3").show();
            bindStep = 3;
        } else {
            _alert('请选择套餐')
            return;
        }

    } else if (bindStep == 3) {
        if ($("#bindCtrlDxId").val() == "") {
            _alert("请输入您的运营商账号");
            $("#bindCtrlDxId").focus();
            return;
        }
        if ($("#bindCtrlDxNo").val() == "") {
            _alert("请输入您的运营商密码");
            $("#bindCtrlDxNo").focus();
            return;
        }
        showLoading();
        var checkAccount = false;

        var postdata = {
            'dxid': $("#bindCtrlDxId").val(),
            'dxno': $("#bindCtrlDxNo").val(),
            'wlanuserip': '111.111.111.111',
            'wlanacname': getParam('wlanacname'),
            'wlanacIp': getParam('wlanacIp') || portalconfig.serverForm ? portalconfig.serverForm.serverip : "",
            'mac': getParam('wlanstamac') || getParam('usermac') || getParam('mac') || '',
            "version": portalconfig.serverForm ? portalconfig.serverForm.portalVer : "",
            "bindCtrlId": $("input[name='bindCtrlId']:checked").val() || '',
            'bindGroupId': $("#bindGroupId").val() || '',
            'userid': $(portalconfig.username).val().replace(/\s*/g, ""),
        };
        encryptParam(postdata);
        showLoading('验证账号');
        $.ajax({
            url: '/quickauthPPPoe.do',
            type: 'get',
            dataType: 'json',
            async: false,
            data: postdata,
            success: function (json) {
                if (json.code == 0) {
                    checkAccount = true;
                }
            }
        });
        if (checkAccount) {
            showLoading('验证成功,绑定中');
            setTimeout(function () {
                var authParam = {
                    'userid': $(portalconfig.username).val(),
                    'passwd': $(portalconfig.password).val(),
                    'dxid': $("#bindCtrlDxId").val(),
                    'dxno': $("#bindCtrlDxNo").val(),
                    'rand': Math.random(),
                    'bindCtrlId': $("input[name='bindCtrlId']:checked").val() || '',
                    'bindGroupId': $("#bindGroupId").val() || '',
                    'wlanuserip': portalconfig.portalForm.wlanuserip ? portalconfig.portalForm.wlanuserip : getParam('wlanuserip') || portalconfig.wlanuserip,
                    'vlan': portalconfig.portalForm.vlan ? portalconfig.portalForm.vlan : getParam('vlan') || '',
                };
                encryptParam(authParam);
                $.ajax({
                    url: '/portal/bindOperator.do',
                    type: 'post',
                    dataType: 'json',
                    data: authParam,
                    success: function (json) {
                        hideLoading();
                        if (json && json.code == '0') {
                            showLoading('开始认证');
                            setTimeout(function () {
                                hideLoading();
                                checkSubmit();
                            }, 2000);
                        } else {
                            _alert(json.message);
                        }
                    },
                    error: function (err) {
                        hideLoading();
                        _alert("服务异常,请销后再试或联系管理员");
                    }
                });
            }, 2000);
        } else {
            hideLoading();
            _alert("验证账号失败,请检查运营商账号和密码")
        }
    }
}

function chooseCtrlAuth() {
    var bindCtrlIdVal = $("#choose_ctrl_select input[name='bindCtrlId']:checked").val()
    if (bindCtrlIdVal) {
        checkSubmit();
    } else {
        _alert('请选择接入服务')
        return;
    }
}

function checkInfoSumbit() {
    showLoading("正在认证..");
    if ($.trim($(portalconfig.username).val()) == "") {
        _alert(local.username + local.notnull);
        $(portalconfig.username).focus();
        hideLoading();
        return;
    }
    if ($.trim($(portalconfig.password).val()) == "") {
        _alert(local.passwd + local.notnull);
        $(portalconfig.password).focus();
        hideLoading();
        return;
    }
    if (portalconfig.portalconfig && portalconfig.portalconfig.listpasscode && portalconfig.portalconfig.listpasscode != 0) {
        if ($(portalconfig.validateCode).val() == "") {
            _alert(local.validateCode + local.notnull);
            $(portalconfig.validateCode).focus();
            hideLoading();
            return;
        }
    }

    if ($(portalconfig.read)) {
        debug("read:" + $(portalconfig.read).is(":checked"));
        if (!$(portalconfig.read).is(":checked")) {
            _alert(local.readProtocol);
            hideLoading();
            return;
        }
    }

    var postdata = {
        'userid': $(portalconfig.username).val().replace(/\s*/g, ""),
        'passwd': $(portalconfig.password).val().replace(/\s*/g, ""),
        'other1': getParam('dropMaxOnline') || ''
    };
    // console.log(JSON.stringify(postdata));
    $.ajax({
        url: '/portal/checkOnlineInfo.do',
        type: 'get',
        dataType: 'json',
        async: false,
        data: postdata,
        success: function (json) {
            hideLoading();
            debug("success:" + JSON.stringify(json));
            if (json.code == "0") {
                if (json.data.type == 1) {
                    if (json.data.max > json.data.onlineList.length) {
                        checkSubmit();
                    } else {
                        hideLoading();
                        var html = "";
                        var checkMb = false;
                        if (json.data.maxMb > 0) {
                            checkMb = true;
                        }
                        $.each(json.data.onlineList, function (i, v) {
                            // alert("checkMb:" + checkMb + "check:" + (v.accessTerminalType !== json.data.templateType))
                            // if (checkMb) {
                            //     if (v.accessTerminalType !== json.data.templateType) {
                            //         return true;
                            //     }
                            // }else {
                            html += "<tr" +
                                "><td>" + v.userip + "</td>" +
                                "<td class=\"checkInfo_hidemb\">" + (v.useripv6 || '') + "</td>" +
                                "<td class=\"checkInfo_hidemb\">" + v.mac + "</td>" +
                                "<td>" + (v.accessTerminalType === '0' ? '电脑' : '手机') + "</td>" +
                                "<td><button type=\"button\" class=\"checkInfo_kill\" onclick=\"killOnline('" + v.wlanacname + "','" + v.nasIp + "','" + v.userip + "','" + v.groupId + "')\">下线</button></td></tr>"
                            // }
                        });
                        showCheckInfo(html);
                    }

                } else {
                    checkSubmit();
                }
            } else {
                _alert(json.message, 3000)
            }
        },
        error: function (json) {
            debug("error");
            _alert(portalconfig.useLocal && local && local.loginfail ? local.loginfail : "登陆失败，请稍后再试！");
        }

    });
}

function killOnline(wlanacname, nasip, userip, groupId) {
    _confirm('下线提示', '您确定要下线IP为"' + userip + '"的设备吗?', '确定', '取消', function () {
        $("._confirm_btn__btn_confirm").bind('click', function () {
            $.ajax({
                url: '/quickauthdisconn.do',
                type: 'post',
                dataType: 'json',
                async: false,
                data: {
                    "wlanacip": nasip,
                    "wlanuserip": userip,
                    "groupId": groupId,
                    'wlanacname': wlanacname,
                    "rand": Math.random()
                },
                success: function (json) {
                    debug("success");
                    if (json.code == '0') {
                        _alert(portalconfig.useLocal && local ? local.logoutSuccee : "下线成功");
                        window.location.href = LogoutRedirect();
                    } else {
                        _alert(portalconfig.useLocal && local ? local.logoutFail : "下线失败");
                    }
                    hideCheckInfo();
                },
                error: function () {
                    debug("error");
                }
            });
        })
    })
}

function microAuthFunc() {
    $.ajax({
        url: "/portal/getMicroUrl.do?id=" + portalconfig.portalconfig.id,
        type: "get",
        dataType: 'json',
        success: function (json) {
            if (json.type == "1") {
                // window.location.href = json.openlink
                // console.log($(portalconfig.microAuthUrl))
                $(portalconfig.microAuthUrl + "," + portalconfig.microAuth).attr('href', json.openlink)
            }
        }
    })
}

function visitorGetPass() {
    if ($(portalconfig.visitorname).val() == "") {
        _alert("请输入访客名字");
        return;
    }
    if ($(portalconfig.visitorPhone).val() == "") {
        _alert("请输入访客手机号");
        return;
    }
    if ($(portalconfig.visitorCode).val() == "") {
        _alert("请输入访客授权码");
        return;
    }
    if ($(portalconfig.visitorRead)) {
        debug("read:" + $(portalconfig.visitorRead).is(":checked"));
        if (!$(portalconfig.visitorRead).is(":checked")) {
            _alert(local.readProtocol);
            hideLoading();
            return;
        }
    }
    $.ajax({
        url: '/vistorSms.do',
        type: 'post',
        dataType: 'json',
        async: false,
        data: {
            "phone": $(portalconfig.visitorPhone).val(),
            "portalId": portalconfig.portalconfig.id,
            "timestamp": portalconfig.portalconfig.timestamp,
            "sign": portalconfig.portalconfig.sign,
            "wlanacname": getParam("wlanacname") || (portalconfig.serverForm && portalconfig.serverForm.servername ? portalconfig.serverForm.servername : ""),
            'ssid': getParam('ssid') || '',
            'vlanid': getParam('vlan') || '',
            "validateCode": $(portalconfig.validateCode).val(),
            "uuid": (portalconfig.portalconfig && portalconfig.portalconfig.uuid) ? portalconfig.portalconfig.uuid : "",
            'wlanuserip': getParam('wlanuserip'),
            "memberType": $("input[name='memberType']:checked").val() || '',
            "visitorCode": $(portalconfig.visitorCode).val() || '',
            "rand": Math.random()
        },
        success: function (json) {
            if (json.state === 0) {
                $(portalconfig.visitorPassModal).modal('show');
            } else {
                _alert(json.redesc);
            }
        }
    });
}



function vistorLoginSubmit() {
    if ($(portalconfig.vistorpasswd).val() == "") {
        _alert("请输入验证码");
        return;
    }
    var postdata = {
        'userid': $(portalconfig.visitorPhone).val().replace(/\s*/g, ""),
        'passwd': $(portalconfig.vistorpasswd).val().replace(/\s*/g, ""),
        'wlanuserip': portalconfig.portalForm.wlanuserip ? portalconfig.portalForm.wlanuserip : getParam('wlanuserip') || portalconfig.wlanuserip,
        'wlanuseripv6': getParam('wlanuseripv6') || portalconfig.wlanuseripv6,
        'wlanacname': portalconfig.portalForm.wlanacname ? portalconfig.portalForm.wlanacname : getParam('wlanacname'),
        'wlanacIp': getParam('wlanacIp') || portalconfig.serverForm ? portalconfig.serverForm.serverip : "",
        'ssid': portalconfig.portalForm.ssid ? portalconfig.portalForm.ssid : getParam('ssid') || '',
        'vlan': portalconfig.portalForm.vlan ? portalconfig.portalForm.vlan : getParam('vlan') || '',
        'mac': portalconfig.portalForm.mac ? portalconfig.portalForm.mac : getParam('wlanstamac') || getParam('usermac') || getParam('mac') || '',
        "version": portalconfig.serverForm ? portalconfig.serverForm.portalVer : "",
        'portalpageid': portalconfig.portalconfig ? portalconfig.portalconfig.id : '',
        "validateCode": $(portalconfig.validateCode).val(),
        "timestamp": (portalconfig.portalconfig && portalconfig.portalconfig.timestamp) ? portalconfig.portalconfig.timestamp : "",
        "uuid": (portalconfig.portalconfig && portalconfig.portalconfig.uuid) ? portalconfig.portalconfig.uuid : "",
        "portaltype": $(portalconfig.portaltype).val() || "",
        "hostname": getParam("hostname") || '',
        "rand": Math.random()
    };
    // console.log(JSON.stringify(postdata));
    $.ajax({
        url: '/quickauth.do',
        type: 'get',
        dataType: 'json',
        async: false,
        data: postdata,
        success: function (json) {
            hideLoading();
            debug("success:" + JSON.stringify(json));
            if (json.code == "0") {
                // _alert("认证成功");

                if (portalconfig.portalconfig && portalconfig.portalconfig.logoutgourl != "") {

                    if (portalconfig.portalconfig.logoutgourl.indexOf("logout") > -1) {
                        // _alert(portalconfig.portalParam.wlanacip);
                        // _alert(getParam(wlanacip));
                        // _alert(json.message);
                        if (window.localStorage) {
                            window.localStorage.setItem("userid", $(portalconfig.username).val());
                            window.localStorage.setItem("groupId", json.groupId);
                        }

                        var url = portalconfig.portalconfig.logoutgourl + "?wlanacip=" + postdata.wlanacIp + "&wlanuserip=" + postdata.wlanuserip + "&wlanacname=" + postdata.wlanacname + "&mac=" + postdata.mac + "&version=" + postdata.version + "&msg=" + (json.message ? encodeURIComponent(json.message) : "") + "&selfTicket=" + (json.selfTicket || '') + "&macChange=" + (json.macChange || "false") + "&userId=" + $(portalconfig.username).val() + "&dropLogCheck=" + json.dropLogCheck + "&vlan=" + postdata.vlan;
                        if (json.groupId) {
                            url += "&groupId=" + json.groupId;
                        }
                        // window.location.href=url;
                        checkPasswdPolicy(json, url);

                        // window.close();
                    } else {
                        // _alert(portalconfig.portalconfig.logoutgourl);

                        // window.location.href = portalconfig.portalconfig.logoutgourl;

                        checkPasswdPolicy(json, portalconfig.portalconfig.logoutgourl);
                        // window.close();

                    }

                } else {
                    if (json.logoutgourl) {

                        var url = json.logoutgourl + "?wlanacip=" + postdata.wlanacIp + "&wlanuserip=" + postdata.wlanuserip + "&wlanacname=" + postdata.wlanacname + "&mac=" + postdata.mac + "&version=" + postdata.version + "&msg=" + (json.message ? encodeURIComponent(json.message) : "") + "&selfTicket=" + (json.selfTicket || '') + "&macChange=" + (json.macChange || "false") + "&userId=" + $(portalconfig.username).val() + "&dropLogCheck=" + json.dropLogCheck;
                        if (json.groupId) {
                            url += "&groupId=" + json.groupId;
                        }
                        // window.location.href = url;
                        checkPasswdPolicy(json, url);

                    } else {

                        // window.location.href = getParam("url");
                        checkPasswdPolicy(json, getParam("url"));

                    }
                }
            } else if (json.code == "201") {
                window.location.href = json.logoutgourl;

            } else if (json.code === "235") {
                _confirm('温馨提示', json.message, '修改密码', '取消', function () {
                    $("._confirm_btn__btn_confirm").bind('click', function () {
                        window.location.href = "/";
                    })
                })
            } else if (json.code == "236") {
                hideLoading();
                _alert(json.message, 3000);
                setTimeout(function () {
                    // $(".bind_mask,.bind_modal").show();
                    $(".bind_only_modal").show();
                    $("#bindDxId").focus();
                }, 3000);
            } else if (json.code == "-1") {
                hideLoading();
                _alert(json.message, 5000);
                if (tryrelogintime < 2) {
                    setTimeout(function () {
                        tryrelogintime++;
                        checkSubmit();
                    }, 5000);
                } else {
                    _alert("认证失败,超过自动重试次数", 5000);
                }

            } else {
                _alert(json.message);
            }
        },
        error: function (json) {
            debug("error");
            _alert(portalconfig.useLocal && local && local.loginfail ? local.loginfail : "登陆失败，请稍后再试！");
        }

    });
}

function initRasModel() {
    console.log("portalconfig.authByRas:", portalconfig.authByRas)
    if (portalconfig.authByRas) {
        console.log("append script")
        $("html").append("<script src=\"/assets/js/rsa/RSA.js\"></script>\n" +
            "<script src=\"/assets/js/rsa/Barrett.js\"></script>\n" +
            "<script src=\"/assets/js/rsa/BigInt.js\"></script>")
    }
}

function encryptParam(param) {
    if (portalconfig.authByRas && portalconfig.rsa && portalconfig.rsa.modulus && portalconfig.rsa.publicExponent) {
        try {
            param.modulus = portalconfig.rsa.modulus;
            setMaxDigits(130);
            var key = new RSAKeyPair(portalconfig.rsa.publicExponent, "", portalconfig.rsa.modulus);
            if (param.userid && param.userid != '') {
                param.userid = encryptedString(key, param.userid);
            }
            if (param.passwd && param.passwd != '') {
                param.passwd = encryptedString(key, param.passwd);
            }
            if (param.dxid && param.dxid != '') {
                param.dxid = encryptedString(key, param.dxid);
            }
            if (param.dxno && param.dxno != '') {
                param.dxno = encryptedString(key, param.dxno);
            }
        } catch (e) {
            _alert("加密失败,请刷新页面后重新认证")
        }
    }
}

let timer, flag;

function throttle(func, wait, immediate) {
    if (immediate) {
        if (!flag) {
            flag = true;
            // 如果是立即执行，则在wait毫秒内开始时执行
            typeof func === 'function' && func();
            timer = setTimeout(function () {
                flag = false;
            }, wait || 500)
        }
    } else {
        if (!flag) {
            flag = true
            // 如果是非立即执行，则在wait毫秒内的结束处执行
            timer = setTimeout(function () {
                flag = false
                typeof func === 'function' && func();
            }, wait || 500);
        }

    }
}


function ReAuthSubmit() {
    // _alert("上线");
    showLoading("正在认证..");
    var postdata = {
        'wlanuserip': portalconfig.portalForm.wlanuserip ? portalconfig.portalForm.wlanuserip : getParam('wlanuserip') || portalconfig.wlanuserip,
        'wlanuseripv6': getParam('wlanuseripv6') || portalconfig.wlanuseripv6,
        'wlanacname': portalconfig.portalForm.wlanacname ? portalconfig.portalForm.wlanacname : getParam('wlanacname'),
        'wlanacIp': getParam('wlanacIp') || portalconfig.serverForm ? portalconfig.serverForm.serverip : "",
        'ssid': portalconfig.portalForm.ssid ? portalconfig.portalForm.ssid : getParam('ssid') || '',
        'vlan': portalconfig.portalForm.vlan ? portalconfig.portalForm.vlan : getParam('vlan') || '',
        'mac': portalconfig.portalForm.mac ? portalconfig.portalForm.mac : getParam('wlanstamac') || getParam('usermac') || getParam('mac') || '',
        "version": portalconfig.serverForm ? portalconfig.serverForm.portalVer : "",
        'portalpageid': portalconfig.portalconfig ? portalconfig.portalconfig.id : '',
        "validateCode": $(portalconfig.validateCode).val(),
        "timestamp": (portalconfig.portalconfig && portalconfig.portalconfig.timestamp) ? portalconfig.portalconfig.timestamp : "",
        "uuid": (portalconfig.portalconfig && portalconfig.portalconfig.uuid) ? portalconfig.portalconfig.uuid : "",
        "portaltype": $(portalconfig.portaltype).val() || portalconfig.portaltypeDefaultVal || "",
        "hostname": getParam("hostname") || '',
        "bindCtrlId": $("#choose_ctrl_select input[name='bindCtrlId']:checked").val() || $("#bind_ctrl_select input[name='bindCtrlId']:checked").val() || '',
        "rand": Math.random()
    };

    encryptParam(postdata);
    // console.log(JSON.stringify(postdata));
    $.ajax({
        url: '/portal/reauth.do',
        type: 'post',
        dataType: 'json',
        async: false,
        data: postdata,
        success: function (json) {
            hideLoading();
            debug("success:" + JSON.stringify(json));
            if (json.code == "0") {
                // _alert("认证成功");

                if (portalconfig.portalconfig && portalconfig.portalconfig.logoutgourl != "") {

                    if (portalconfig.portalconfig.logoutgourl.indexOf("logout") > -1) {
                        // _alert(portalconfig.portalParam.wlanacip);
                        // _alert(getParam(wlanacip));
                        // _alert(json.message);
                        if (window.localStorage) {
                            window.localStorage.setItem("userid", $(portalconfig.username).val());
                            window.localStorage.setItem("groupId", json.groupId);
                        }

                        var url = portalconfig.portalconfig.logoutgourl + "?wlanacip=" + postdata.wlanacIp + "&wlanuserip=" + postdata.wlanuserip + "&wlanacname=" + postdata.wlanacname + "&mac=" + postdata.mac + "&version=" + postdata.version + "&msg=" + "Account " + $(portalconfig.username).val() + " " + (json.message ? encodeURIComponent(json.message) : "") + "&selfTicket=" + (json.selfTicket || '') + "&macChange=" + (json.macChange || "false") + "&userId=" + $(portalconfig.username).val() + "&dropLogCheck=" + json.dropLogCheck + "&vlan=" + postdata.vlan;
                        if (json.groupId && json.groupId !== '') {
                            url += "&groupId=" + json.groupId;
                        }
                        // window.location.href=url;
                        checkPasswdPolicy(json, url);

                        // window.close();
                    } else {
                        // _alert(portalconfig.portalconfig.logoutgourl);

                        // window.location.href = portalconfig.portalconfig.logoutgourl;

                        checkPasswdPolicy(json, portalconfig.portalconfig.logoutgourl);
                        // window.close();

                    }

                } else {
                    if (json.logoutgourl) {

                        var url = json.logoutgourl + "?wlanacip=" + postdata.wlanacIp + "&wlanuserip=" + postdata.wlanuserip + "&wlanacname=" + postdata.wlanacname + "&mac=" + postdata.mac + "&version=" + postdata.version + "&msg=" + "Account " + $(portalconfig.username).val() + " " + (json.message ? encodeURIComponent(json.message) : "") + "&selfTicket=" + (json.selfTicket || '') + "&macChange=" + (json.macChange || "false") + "&userId=" + $(portalconfig.username).val() + "&dropLogCheck=" + json.dropLogCheck;
                        if (json.groupId && json.groupId !== '') {
                            url += "&groupId=" + json.groupId;
                        }
                        // window.location.href = url;
                        checkPasswdPolicy(json, url);

                    } else {

                        // window.location.href = getParam("url");
                        checkPasswdPolicy(json, getParam("url"));

                    }
                }
            } else {
                _alert(json.message);
            }
        },
        error: function (json) {
            debug("error");
            _alert(portalconfig.useLocal && local && local.loginfail ? local.loginfail : "登陆失败，请稍后再试！");
        }

    });

}

function rujieTestIp() {
    var postdata = {
        'wlanuserip': portalconfig.portalForm.wlanuserip ? portalconfig.portalForm.wlanuserip : getParam('wlanuserip') || portalconfig.wlanuserip,
        'wlanuseripv6': getParam('wlanuseripv6') || portalconfig.wlanuseripv6,
        'wlanacname': portalconfig.portalForm.wlanacname ? portalconfig.portalForm.wlanacname : getParam('wlanacname'),
        'wlanacIp': getParam('wlanacIp') || portalconfig.serverForm ? portalconfig.serverForm.serverip : "",
        'ssid': portalconfig.portalForm.ssid ? portalconfig.portalForm.ssid : getParam('ssid') || '',
        'vlan': portalconfig.portalForm.vlan ? portalconfig.portalForm.vlan : getParam('vlan') || '',
        'mac': portalconfig.portalForm.mac ? portalconfig.portalForm.mac : getParam('wlanstamac') || getParam('usermac') || getParam('mac') || '',
        "version": portalconfig.serverForm ? portalconfig.serverForm.portalVer : "",
        'portalpageid': portalconfig.portalconfig ? portalconfig.portalconfig.id : '',
        "validateCode": $(portalconfig.validateCode).val(),
        "timestamp": (portalconfig.portalconfig && portalconfig.portalconfig.timestamp) ? portalconfig.portalconfig.timestamp : "",
        "uuid": (portalconfig.portalconfig && portalconfig.portalconfig.uuid) ? portalconfig.portalconfig.uuid : "",
        "portaltype": $(portalconfig.portaltype).val() || portalconfig.portaltypeDefaultVal || "",
        "hostname": getParam("hostname") || '',
        "bindCtrlId": $("#choose_ctrl_select input[name='bindCtrlId']:checked").val() || $("#bind_ctrl_select input[name='bindCtrlId']:checked").val() || '',
        "rand": Math.random()
    };

    encryptParam(postdata);
    // console.log(JSON.stringify(postdata));
    $.ajax({
        url: '/portal/reauth.do',
        type: 'post',
        dataType: 'json',
        async: false,
        data: postdata,
        success: function (json) {
            if (json.code == "0") {
                if (getParam("url")) {
                    window.location.href = decodeURIComponent(getParam("url"))
                }
            }
        }
    });
}

function getOnlineUserId(id, error) {
    var userId = getParam("userId");
    if (!userId) {
        $.ajax({
            url: '/portal/getOnlineUserName.do',
            type: 'get',
            dataType: 'json',
            data: window.location.search.substring(1),
            success: function (json) {
                if (json.code == '0') {
                    $("#" + id).text(json.data)
                } else {
                    $("#" + error).text(json.message)
                }
            }
        })
    }
}

function getUserDetail(userId) {
    return new Promise(function (resolve, reject) {
        var temp = {
            "className": "未知",
            "groupName": "未知",
            "memberType": "未知",
            "onlineList": [],
            "userId": "未知",
            "username": "未知",
            "areaDesc": "未知",
            "lineType": "未知",
            "canUpdateGroup": false,
            "rand": Math.random()
        }
        $.ajax({
            url: '/portal/getUserDetail.do',
            type: 'get',
            dataType: 'json',
            async: false,
            data: {
                wlanacip: getParam('wlanacip') || '',
                wlanuserip: getParam("wlanuserip") || '',
                wlanacname: getParam('wlanacname') || '',
                mac: getParam('mac') || '',
                vlan: getParam('vlan') || '',
                selfTicket: getParam('selfTicket') || '',
                userId: userId || getParam('userId') || getParam('username') || '',
                showArea: portalconfig.showArea || '0',
                showOnline: portalconfig.showOnline || '0',
                rand: Math.random()
            },
            success: function (json) {
                if (json.code == '0') {
                    temp = Object.assign(temp, json.data)
                } else {
                    _alert("获取登录信息失败,原因:" + json.message)
                }
                resolve(temp);
            },
            error: function () {
                reject('请求错误')
            }
        })
    })
}

function LogoutRedirect() {
    var ip = [];
    for (var i = 0; i < 4; i++) {
        if (i < 3) {
            ip = ip + Math.floor(Math.random() * 256) + "."
        } else {
            ip = ip + Math.floor(Math.random() * 256)
        }
    }
    return "http://" + ip + "?rand=" + Math.random();
}