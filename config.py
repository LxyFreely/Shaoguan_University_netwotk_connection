import tkinter
from tkinter import messagebox
import os

class config:
    def __init__(self):
        self.GUI = tkinter.Tk()
        self.GUI.title("属性配置程序")
        self.center_window(self.GUI, 400, 300)

        # 创建标签和输入框
        self.tip_name = tkinter.Label(self.GUI, text="用户名(name)")
        self.tip_password = tkinter.Label(self.GUI, text="密码(password)")
        self.tip_waiting = tkinter.Label(self.GUI, text="等待(waiting)")
        self.tip_poweron = tkinter.Label(self.GUI, text="开机启动(power_on_start)")

        self.name_entry = tkinter.Entry(self.GUI, width=15)
        self.password_entry = tkinter.Entry(self.GUI, width=15, show="*")
        self.waiting_var = tkinter.BooleanVar()
        self.waiting_checkbox = tkinter.Checkbutton(self.GUI, text="启用", variable=self.waiting_var)
        self.poweron_var = tkinter.BooleanVar()
        self.poweron_checkbox = tkinter.Checkbutton(self.GUI, text="开机启动", variable=self.poweron_var)

        # 加载现有配置
        self.load_properties()

        # 创建按钮
        self.save_button = tkinter.Button(self.GUI, text="保存配置", command=self.save_properties)
        self.cancel_button = tkinter.Button(self.GUI, text="取消", command=self.GUI.destroy)
        
        # 布局设置
        self.setup_layout()

    def setup_layout(self):
        # 标签和输入框布局
        self.tip_name.grid(row=0, column=0, sticky="w", padx=10, pady=10)
        self.name_entry.grid(row=0, column=1, padx=10, pady=10)
        
        self.tip_password.grid(row=1, column=0, sticky="w", padx=10, pady=10)
        self.password_entry.grid(row=1, column=1, padx=10, pady=10)
        
        self.tip_waiting.grid(row=2, column=0, sticky="w", padx=10, pady=10)
        self.waiting_checkbox.grid(row=2, column=1, sticky="w", padx=10, pady=10)
        
        self.tip_poweron.grid(row=3, column=0, sticky="w", padx=10, pady=10)
        self.poweron_checkbox.grid(row=3, column=1, sticky="w", padx=10, pady=10)
        
        # 按钮布局
        self.save_button.grid(row=4, column=0, padx=10, pady=20)
        self.cancel_button.grid(row=4, column=1, padx=10, pady=20)

    def center_window(self, root, width, height):
        screenwidth = root.winfo_screenwidth()
        screenheight = root.winfo_screenheight()
        size = '%dx%d+%d+%d' % (width, height, (screenwidth - width) / 2, (screenheight - height) / 2)
        root.geometry(size)

    def load_properties(self):
        """加载properties.prop文件中的配置"""
        try:
            with open('properties.prop', 'r', encoding='utf-8') as f:
                lines = f.readlines()
                
            # 解析每一行
            for line in lines:
                line = line.strip()
                if '=' in line:
                    key, value = line.split('=', 1)
                    if key == 'name':
                        self.name_entry.insert(0, value)
                    elif key == 'password':
                        self.password_entry.insert(0, value)
                    elif key == 'waiting':
                        self.waiting_var.set(value.lower() == 'true')
                    elif key == 'power_on_start':
                        self.poweron_var.set(value.lower() == 'true')
        except FileNotFoundError:
            # 如果文件不存在，显示提示
            messagebox.showwarning("警告", "properties.prop 文件不存在，将创建新文件")
        except Exception as e:
            messagebox.showerror("错误", f"加载配置文件时发生错误: {e}")

    def save_properties(self):
        """保存配置到properties.prop文件"""
        try:
            with open('properties.prop', 'w', encoding='utf-8') as f:
                f.write(f"name={self.name_entry.get()}\n")
                f.write(f"password={self.password_entry.get()}\n")
                f.write(f"waiting={'true' if self.waiting_var.get() else 'false'}\n")
                f.write(f"power_on_start={'true' if self.poweron_var.get() else 'false'}\n")
                f.write('\n使用说明：\n')
                f.write('请在name和password后面替换为您的账号密码\n')
                f.write('waiting选项已经弃用，可以随便发电，之后会删除此选项\n')
                f.write('power_on_start是开机启动\n')
            
            messagebox.showinfo("成功", "配置已保存到properties.prop文件")
            self.GUI.destroy()
        except Exception as e:
            messagebox.showerror("错误", f"保存配置文件时发生错误: {e}")

    def start(self):
        self.GUI.mainloop()