import time
import winreg
import os
import sys
import ctypes
dir = os.path.dirname(os.path.abspath(__file__)) + r'\test_registry.py'

def registry_method(status):
    dir = os.path.dirname(os.path.abspath(__file__)) + "/make_connect.exe"   #注意这里写入需要权限
    key = winreg.OpenKey(winreg.HKEY_CURRENT_USER,r'Software\Microsoft\Windows\CurrentVersion\Run',0,winreg.KEY_SET_VALUE)

    if status == 'r':
        try:
            value, regtype = winreg.QueryValueEx(key, 'Campus_network_connection')
            if value:
                winreg.CloseKey(key)
                return True
            else:
                winreg.CloseKey(key)
                return False
        except:
            return False
            

    if status == 'w':
        winreg.SetValueEx(key,"Campus_network_connection",0,winreg.REG_SZ, dir)
        winreg.CloseKey(key)
        return True
    if status == 'd':
        winreg.DeleteKeyEx(key, "Campus_network_connection",0,winreg.REG_SZ, dir)
        return False
    else:
        return False
        


def run_as_admin(script_path):
    script = str(script_path)
    params = ' '.join([script] + sys.argv[1:])
    ret = ctypes.windll.shell32.ShellExecuteW(None, "runas", sys.executable, params, None, 1)
    if int(ret) <= 32:
        raise RuntimeError(f"Failed to run as admin. Return code: {ret}")
    else:
        print("Script will restart with admin privileges.")

if not ctypes.windll.shell32.IsUserAnAdmin():
    run_as_admin(sys.argv[0])
else:
    try:
        print(registry_method('w'))
    except Exception as e:
        print(str(e))
        time.sleep(10)

