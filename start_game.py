#!/usr/bin/env python3
"""
Hydra数游戏 - 启动脚本 (Python版本)
支持多种方式启动HTTP服务器
"""

import os
import sys
import subprocess
import webbrowser
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading

def clear_screen():
    """清屏"""
    os.system('cls' if os.name == 'nt' else 'clear')

def print_header():
    """打印标题"""
    print("=" * 50)
    print("      Hydra数游戏 - 启动脚本")
    print("=" * 50)
    print()

def check_python():
    """检查Python版本"""
    try:
        version = sys.version_info
        print(f"✓ Python {version.major}.{version.minor}.{version.micro}")
        return True
    except:
        print("✗ Python: 未找到")
        return False

def check_node():
    """检查Node.js"""
    try:
        result = subprocess.run(['node', '--version'], 
                              capture_output=True, text=True)
        print(f"✓ Node.js {result.stdout.strip()}")
        return True
    except:
        print("✗ Node.js: 未安装")
        return False

def check_npm():
    """检查npm"""
    try:
        result = subprocess.run(['npm', '--version'], 
                              capture_output=True, text=True)
        print(f"✓ npm {result.stdout.strip()}")
        return True
    except:
        print("✗ npm: 未安装")
        return False

def check_http_server():
    """检查http-server"""
    try:
        result = subprocess.run(['http-server', '--version'], 
                              capture_output=True, text=True)
        print(f"✓ http-server 已安装")
        return True
    except:
        print("✗ http-server: 未安装 (可使用 npm install -g http-server 安装)")
        return False

def check_environment():
    """检查环境"""
    clear_screen()
    print_header()
    print("检查环境:")
    print("-" * 30)
    
    python_ok = check_python()
    node_ok = check_node()
    npm_ok = check_npm() if node_ok else False
    http_server_ok = check_http_server() if npm_ok else False
    
    print()
    print("当前目录:", os.getcwd())
    print()
    print("文件列表:")
    for file in os.listdir('.'):
        if file.endswith(('.html', '.css', '.js', '.md')):
            print(f"  {file}")
    
    print()
    input("按Enter键继续...")

def start_python_server(port=8000):
    """启动Python HTTP服务器"""
    clear_screen()
    print_header()
    print(f"启动Python HTTP服务器 (端口: {port})")
    print(f"访问地址: http://localhost:{port}")
    print()
    print("按 Ctrl+C 停止服务器")
    print("-" * 50)
    
    # 切换到当前目录
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # 尝试打开浏览器
    def open_browser():
        time.sleep(1)
        webbrowser.open(f'http://localhost:{port}')
    
    threading.Thread(target=open_browser, daemon=True).start()
    
    # 启动服务器
    try:
        server = HTTPServer(('localhost', port), SimpleHTTPRequestHandler)
        print(f"服务器已启动，正在监听端口 {port}...")
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止")
    except Exception as e:
        print(f"启动服务器失败: {e}")
        input("按Enter键继续...")

def start_node_server(port=8080):
    """启动Node.js http-server"""
    clear_screen()
    print_header()
    print(f"启动Node.js http-server (端口: {port})")
    print(f"访问地址: http://localhost:{port}")
    print()
    print("按 Ctrl+C 停止服务器")
    print("-" * 50)
    
    # 检查http-server是否安装
    if not check_http_server():
        print("\n正在安装http-server...")
        try:
            subprocess.run(['npm', 'install', '-g', 'http-server'], 
                         check=True, capture_output=True)
            print("✓ http-server 安装成功")
        except subprocess.CalledProcessError as e:
            print(f"✗ 安装失败: {e}")
            input("按Enter键继续...")
            return
    
    # 尝试打开浏览器
    def open_browser():
        time.sleep(2)
        webbrowser.open(f'http://localhost:{port}')
    
    threading.Thread(target=open_browser, daemon=True).start()
    
    # 启动http-server
    try:
        subprocess.run(['http-server', '-p', str(port), '-c-1'])
    except KeyboardInterrupt:
        print("\n服务器已停止")
    except Exception as e:
        print(f"启动服务器失败: {e}")
        input("按Enter键继续...")

def main_menu():
    """主菜单"""
    while True:
        clear_screen()
        print_header()
        print("请选择启动方式:")
        print()
        print("1. 使用Python HTTP服务器 (端口 8000)")
        print("2. 使用Node.js http-server (端口 8080)")
        print("3. 检查环境")
        print("4. 退出")
        print()
        
        choice = input("请选择 (1-4): ").strip()
        
        if choice == '1':
            start_python_server()
        elif choice == '2':
            start_node_server()
        elif choice == '3':
            check_environment()
        elif choice == '4':
            print("\n再见！")
            break
        else:
            print("\n无效选择，请重新输入")
            time.sleep(1)

if __name__ == '__main__':
    try:
        main_menu()
    except KeyboardInterrupt:
        print("\n\n程序已退出")
    except Exception as e:
        print(f"程序出错: {e}")
        input("按Enter键退出...")
