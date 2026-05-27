"""
校园网自动登录模块
用法：
    import campus_login
    campus_login.login("学号", "密码")

也可以直接运行：
    python campus_login.py 学号 密码
"""

import requests
import re
import time
import sys
from urllib.parse import urlparse, parse_qs, urlunparse

# ================= 核心函数 =================

def check_online():
    """
    检测是否已登录校园网
    返回: True(已登录) / False(未登录) / None(无法判断)
    """
    try:
        resp = requests.get("http://2.2.2.2", allow_redirects=False, timeout=5)
        if 300 <= resp.status_code <= 399:
            return True
        elif resp.status_code == 200:
            return False
        else:
            return None
    except Exception:
        return None



def login(username, password):
    """
    执行校园网认证
    参数:
        username: 学号/账号
        password: 密码
    返回:
        True:  登录成功
        False: 已经登录校园网
        Error: 登录失败
    """
    print(f"开始登录，账号: {username}")

    try:
        # 1. 从未登录拦截页面获取服务器地址和网络参数
        try:
            base_url, net_params = _fetch_portal_info()
        except Exception as e:
            if e=="校园网已登录":
                return False
            raise Exception(f"_fetch_portal_info失败:{e}")
        print(f"Portal 服务器: {base_url}")
        print(f"网络参数: {net_params}")

        # 2. 获取认证配置（timestamp, uuid 等）
        session = requests.Session()#创建会话对象,用于保持登录状态

        #接下来就是构造第一次请求（拉取服务端的json配置）
        config_params = {
            **net_params,#合并网络参数,包括wlanuserip,wlanacname,mac,vlan,hostname
            "rand": str(int(time.time() * 1000)),#防止缓存随机数
            "viewStatus": "1"
        }
        resp = session.get(f"{base_url}/PortalJsonAction.do", params=config_params)#获取认证配置
        if resp.status_code != 200:
            raise Exception(f"获取认证配置失败:{resp.status_code}")


        config = resp.json()
        #响应示例在响应.json文件中
        pc = config["portalconfig"]
        sf = config["serverForm"]
        pf = config["portalForm"]

        confignormallist={"authByRas": False}
        pcnormallist={
            "listqqauth": "0",
            "listwbauth": "0",
            "listwxauth": "0",
            "listwxmicroauth": "0"
        }
        #判断config和pc中的部分值是否和上面字典的一样，如果不一样就是太老了
        old=False
        for k,v in confignormallist.items():
            if config.get(k) != v:
                old=True
                break
        for k,v in pcnormallist.items():
            if pc.get(k) != v:
                old=True
                break
        if old:
            raise Exception("自动登录核心版本过老，请更新或上github反馈")

        # 3. 构造认证请求（明文，无验证码）
        auth_params = {
            "userid": username,
            "passwd": password,
            "wlanuserip": pf["wlanuserip"],
            "wlanuseripv6": "",
            "wlanacname": pf["wlanacname"],
            "wlanacIp": sf["serverip"],
            "ssid": "",
            "vlan": pf["vlan"],
            "mac": pf["mac"],
            "version": sf["portalVer"],
            "portalpageid": pc["id"],
            "validateCode": "",
            "timestamp": pc["timestamp"],
            "uuid": pc["uuid"],
            "portaltype": "0",
            "hostname": net_params["hostname"],
            "bindCtrlId": "",
            "validateType": "0",
            "bindOperatorType": "2",
            "sendFttrNotice": "0"
        }

        # 4. 提交认证
        print("提交认证...")
        resp = session.get(f"{base_url}/quickauth.do", params=auth_params)
        result = resp.json()

        if result.get("code") == "0":
            print("登录成功！")
            # 访问下线页（部分系统需要此步完成上线）
            session.get(f"{base_url}{pc['logoutgourl']}")
            return True
        else:
            raise Exception(f"登录失败: {result.get('message', result)}")


    except Exception as e:
        raise Exception(f"登录过程出错: {e}")



def _fetch_portal_info():
    """(内部函数) 从拦截页面提取服务器地址和网络参数"""
    resp = requests.get("http://2.2.2.2", allow_redirects=False, timeout=10)
    if 300 <= resp.status_code <= 399:
        raise Exception("校园网已登录")
    elif resp.status_code != 200:
        raise Exception("获取拦截页面失败")
    
    html = resp.text

    # 找到包含 portalScript.do 或 portal.do 的链接
    urls = re.findall(r'(http://[^\s"\'<>]+)', html)#这一段代码用于提取所有HTTP链接
    redirect_url = None
    for url in urls:
        url = url.rstrip("',)")
        if "portalScript.do" in url or "portal.do" in url:
            redirect_url = url
            break
    if not redirect_url:
        raise Exception("未找到 Portal 跳转链接")


    # 提取 base_url 和查询参数
    parsed = urlparse(redirect_url)#解析URL
    base_url = urlunparse((parsed.scheme, parsed.netloc, '', '', '', ''))#构建基础URL
    params = parse_qs(parsed.query)#解析查询参数,返回一个字典,键是参数名,值是URL编码后的参数值
    needed = ["wlanuserip", "wlanacname", "mac", "vlan", "hostname"]#需要的参数
    for k in needed:
        if k not in params:
            raise Exception(f"参数缺失: {k}")
    net_params = {k: params[k][0] for k in needed}
    return base_url, net_params

# ================= 直接运行入口 =================





if __name__ == "__main__":
    # 支持命令行传参: python campus_login.py 学号 密码
    if len(sys.argv) >= 3:
        user = sys.argv[1]
        pwd = sys.argv[2]
    else:
        # 未提供参数时，询问用户输入
        user = input("请输入学号: ")
        pwd = input("请输入密码: ")

    # 检测当前状态
    online = check_online()
    if online:
        print("✅ 已登录，无需重复认证。")
    elif online is False:
        print("❌ 未登录，开始认证...")
        success = login(user, pwd)
        if success:
            print("🎉 认证完成！")
        else:
            print("❌ 认证失败，请检查账号密码或网络。")
    else:
        print("⚠️ 无法判断网络状态，尝试强制登录...")
        success = login(user, pwd)