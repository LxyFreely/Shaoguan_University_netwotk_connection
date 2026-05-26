import requests
import re
import time
from urllib.parse import urlparse, parse_qs

BASE_URL = "http://172.16.253.121"
USERNAME = "user"
PASSWORD = "password"

def get_portal_params():
    session = requests.Session()
    print(">>> 正在请求 http://2.2.2.2 ...")
    try:
        resp = session.get("http://2.2.2.2", allow_redirects=False, timeout=10)
    except Exception as e:
        print(">>> 请求异常:", e)
        raise

    print(f">>> 响应状态码: {resp.status_code}")
    print(f">>> 响应体前 800 字符:\n{resp.text[:800]}")

    html = resp.text
    redirect_url = None

    # 提取所有完整 http 链接
    urls = re.findall(r'(http://[^\s"\'<>]+)', html)
    print(f">>> 从 HTML 中找到的所有链接: {urls}")

    for url in urls:
        url = url.rstrip("',)")
        if "portalScript.do" in url or "portal.do" in url:
            redirect_url = url
            print(">>> 选定为 Portal 跳转链接:", redirect_url)
            break

    if not redirect_url and "Location" in resp.headers:
        redirect_url = resp.headers["Location"]
        print(">>> 从 Location 头获取:", redirect_url)

    if not redirect_url:
        raise Exception("无法获取 Portal 重定向地址，请确保设备未认证，并检查上面打印的链接")

    parsed = urlparse(redirect_url)
    params = parse_qs(parsed.query)
    print(f">>> 解析到的参数: {params}")

    needed = ["wlanuserip", "wlanacname", "mac", "vlan", "hostname"]
    missing = [k for k in needed if k not in params]
    if missing:
        raise Exception(f"参数缺失: {missing}")

    return {k: params[k][0] for k in needed}

def login():
    print("\n=== 开始自动登录流程 ===\n")
    
    print("--- 步骤1: 获取网络参数 ---")
    try:
        net_params = get_portal_params()
    except Exception as e:
        print("!!! 获取参数失败:", e)
        return
    print("获取到参数:", net_params, "\n")
    
    print("--- 步骤2: 获取 Portal 配置 ---")
    session = requests.Session()
    config_params = {
        **net_params,
        "rand": str(int(time.time() * 1000)),
        "viewStatus": "1"
    }
    print("请求参数:", config_params)
    resp = session.get(f"{BASE_URL}/PortalJsonAction.do", params=config_params)
    if resp.status_code != 200:
        print("获取配置失败，响应体:", resp.text[:200])
        return
    config = resp.json()
    print("Portal 配置获取成功")
    
    portal_conf = config["portalconfig"]
    server_form = config["serverForm"]
    portal_form = config["portalForm"]
    
    print("--- 步骤3: 提交认证 ---")
    auth_params = {
        "userid": USERNAME,
        "passwd": PASSWORD,
        "wlanuserip": portal_form["wlanuserip"],
        "wlanuseripv6": "",
        "wlanacname": portal_form["wlanacname"],
        "wlanacIp": server_form["serverip"],
        "ssid": "",
        "vlan": portal_form["vlan"],
        "mac": portal_form["mac"],
        "version": server_form["portalVer"],
        "portalpageid": portal_conf["id"],
        "validateCode": "",
        "timestamp": portal_conf["timestamp"],
        "uuid": portal_conf["uuid"],
        "portaltype": "0",
        "hostname": net_params["hostname"],
        "bindCtrlId": "",
        "validateType": "0",
        "bindOperatorType": "2",
        "sendFttrNotice": "0"
    }
    print("认证参数（密码隐藏）:", {**auth_params, "passwd": "******"})
    
    resp = session.get(f"{BASE_URL}/quickauth.do", params=auth_params)
    print("响应状态码:", resp.status_code)
    print("响应体:", resp.text)
    
    try:
        result = resp.json()
    except:
        print("响应不是 JSON")
        return
    
    if result.get("code") == "0":
        print("\n🎉 登录成功！现在应该可以上网了。")
        session.get(f"{BASE_URL}{portal_conf['logoutgourl']}")
    else:
        print(f"\n❌ 登录失败：{result.get('message', result)}")

if __name__ == "__main__":
    login()