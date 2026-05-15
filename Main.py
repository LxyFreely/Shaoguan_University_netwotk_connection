import os.path
import time

import threading
import winreg
import sys
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from tkinter import messagebox

options = webdriver.EdgeOptions()
driver = webdriver.Edge(options=options)


def main():
    suc = False
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

        #核心
        driver.get("http://2.2.2.2")
        WebDriverWait(driver, 10)
        Button = driver.find_element(By.ID, "formSumbit")
        name_input = driver.find_element(By.ID, "userid")
        password_input = driver.find_element(By.ID, "passwd")

        try:
            threading.Thread(target=lambda:messagebox.showinfo("info",message="正在登录...\n" + "账号：" + ans[0][1] + "\n密码：" + ans[1][1])).start()
            if ans[2][1] == 'true':
                time.sleep(1)
                name_input.send_keys(ans[0][1])
                time.sleep(1)
                password_input.send_keys(ans[1][1])
                time.sleep(1)
                Button.click()
            else:
                name_input.send_keys(ans[0][1])
                password_input.send_keys(ans[1][1])
                Button.click()
            try:
                driver.find_element(By.ID, "formSumbit")
            except Exception as e:
                f.close()
                driver.quit()
                print('[success]登录成功')
                suc = True
                threading.Thread(target=lambda: messagebox.showinfo("info", message="登录成功！")).start()

            finally:
                if suc:
                    time.sleep(1)
                    sys.exit()
                else:
                    print('[error]账号密码错误')
                    messagebox.showerror("错误", "账号密码错误")

        except Exception as e:
            print('[Fail]出现错误，请检查校园网连接情况或上报开发者'+ str(e))


    except Exception as e:
        if suc:
            pass
        else:
            print(str(e))
            print('[Already login]检测到您已经登录，若未登录成功请提交开发者')
            messagebox.showerror("已登录","检测到您已经登录，若未登录成功请提交问题给开发者")
            sys.exit()


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


def get_file_dir(file=''):
    if getattr(sys, 'frozen', False):
        return os.path.join(os.path.dirname(sys.executable),file)
    else:
        return os.path.join(os.path.dirname(os.path.abspath(__file__)),file)

if __name__ == '__main__':
    main()