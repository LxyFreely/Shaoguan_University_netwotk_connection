import os.path
import time
import os
import threading
import winreg
import sys
from tkinter import messagebox

import pystray
from pystray import MenuItem as item
from PIL import Image,ImageDraw


import pannal
import wang as net


def create_icom_image():
    img=Image.new('RGB',(32,32))
    draw=ImageDraw.Draw(img)
    draw.rectangle((0,0,32,32),fill=(255,0,0))
    return img

def make_sub():
    icon = Image.open("icon.png").resize((32,32))
    menu = pystray.Menu(
        pystray.MenuItem('打开配置文件', lambda: os.startfile('properties.prop')),
        pystray.MenuItem('创建计时任务', lambda : threading.Thread(target=lambda : make_time_process()).start()),
        pystray.MenuItem('退出程序', lambda: sub.stop())
    )
    sub = pystray.Icon('sub_level', icon, menu=menu)

    sub.run_detached()


def make_time_process():
    tk =  pannal.pannal()
    tk.start()


def main():
    try:
        f = open(get_file_dir("properties.prop"), "r", encoding="utf-8")
        identify = f.readlines()
        ans = []
        for line in identify:
            ans.append(line.strip('\n').split("="))
        dir_app = get_file_dir('make_connection.exe')

        #判断是否需要开机自启动
        if ans[3][1] == 'true':
            if registry_method('r'):
                pass
            else:
                registry_method('w',dir_app)
        else:
            if registry_method('r'):
                registry_method('d')
            else:
                pass
        print(dir_app)
    except Exception as e:
        messagebox.showerror("提示", f"读取配置文件出错: {e}")
        return
    

    try:
        suc = net.login(ans[0][1],ans[1][1])
    except Exception as e:
        messagebox.showerror("提示", f"登录过程出错: {e}")
        return False
    if suc == False:
        messagebox.showerror("提示", "校园网已登录")
        return False
    else:
        messagebox.showinfo("提示", "登录成功")
        return True


#开机启动/关闭开机启动
def registry_method(status,dir = ""):
    key = winreg.OpenKey(winreg.HKEY_CURRENT_USER,r'Software\Microsoft\Windows\CurrentVersion\Run',0,winreg.KEY_SET_VALUE)
    if status == 'r':
        try:
            key_r = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r'Software\Microsoft\Windows\CurrentVersion\Run', 0)
            value, regtype = winreg.QueryValueEx(key_r, 'Campus_network_connection')
            if value:
                winreg.CloseKey(key_r)
                return True
            else:
                winreg.CloseKey(key_r)
                return False
        except:
            return False

    if status == 'w':
        winreg.SetValueEx(key,"Campus_network_connection",0,winreg.REG_SZ, dir)
        winreg.CloseKey(key)
        return True
    if status == 'd':
        winreg.DeleteValue(key, "Campus_network_connection")
        return True
    else:
        return False


#获取文件目录
def get_file_dir(file=''):
    if getattr(sys, 'frozen', False):
        return os.path.join(os.path.dirname(sys.executable),file)
    else:
        return os.path.join(os.path.dirname(os.path.abspath(__file__)),file)



def registry():
    pass

def unregistry():
    pass

def detectopen():
    pass

def detectclose():
    pass


menu=pystray.Menu(
    item('退出',lambda:icon.stop()),
    item('登录',lambda:main()),
    item('开启开机启动',lambda:registry()),
    item('关闭开机启动',lambda:unregistry()),
    item('开启网络检测',lambda:detectopen()),
    item('关闭网络检测',lambda:detectclose())
)


if __name__ == '__main__':
    icon=pystray.Icon(
        name='Campus_network_connection',
        icon=create_icom_image(),
        title='校园网连接助手',
        menu=menu,
    )
    make_sub()
    main()