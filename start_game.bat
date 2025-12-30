@echo off
echo ========================================
echo   Hydra数游戏 - 启动脚本
echo ========================================
echo.
echo 请选择启动方式：
echo.
echo 1. 使用Python HTTP服务器 (端口 8000)
echo 2. 使用Node.js http-server (端口 8080)
echo 3. 检查环境
echo 4. 退出
echo.

set /p choice="请选择 (1-4): "

if "%choice%"=="1" goto python_server
if "%choice%"=="2" goto node_server
if "%choice%"=="3" goto check_env
if "%choice%"=="4" goto exit

echo 无效选择，请重新运行脚本。
pause
exit

:python_server
echo.
echo 正在启动Python HTTP服务器...
echo 服务器将在 http://localhost:8000 启动
echo 按 Ctrl+C 停止服务器
echo.
python --version >nul 2>&1
if errorlevel 1 (
    echo 错误：未找到Python，请先安装Python或选择其他选项。
    pause
    exit /b 1
)

echo 正在启动服务器...
python -m http.server 8000
goto exit

:node_server
echo.
echo 正在启动Node.js http-server...
echo 服务器将在 http://localhost:8080 启动
echo 按 Ctrl+C 停止服务器
echo.
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误：未找到Node.js，请先安装Node.js或选择其他选项。
    pause
    exit /b 1
)

http-server --version >nul 2>&1
if errorlevel 1 (
    echo 正在安装http-server...
    npm install -g http-server
    if errorlevel 1 (
        echo 错误：安装http-server失败。
        pause
        exit /b 1
    )
)

echo 正在启动服务器...
http-server -p 8080 -c-1
goto exit

:check_env
echo.
echo 检查环境...
echo.

echo 检查Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo Python: 未安装
) else (
    python --version
)

echo.
echo 检查Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js: 未安装
) else (
    node --version
)

echo.
echo 检查npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo npm: 未安装
) else (
    npm --version
)

echo.
echo 当前目录：%cd%
echo.
echo 文件检查：
dir /b *.html *.css *.js 2>nul
echo.
pause
goto exit

:exit
echo.
echo 脚本结束。
pause
