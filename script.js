/**
 * Hydra数游戏 - 主脚本文件
 * 整合所有模块并初始化游戏
 */

import GameState from './gameState.js';
import UIManager from './uiManager.js';

class HydraGame {
    constructor() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }
    
    initialize() {
        try {
            // 创建游戏状态实例
            const initialHeads = parseInt(document.getElementById('initial-heads').value) || 5;
            this.gameState = new GameState(initialHeads);
            
            // 创建界面管理器
            this.uiManager = new UIManager(this.gameState);
            
            // 设置游戏循环（每秒更新一次时间等）
            // this.setupGameLoop();
            
            // 添加初始化完成日志
            this.gameState.addLog('游戏初始化完成！使用空格键快速攻击，Ctrl+R重置，Ctrl+A切换自动攻击。');
            
            console.log('Hydra数游戏初始化完成！');
        } catch (error) {
            console.error('游戏初始化失败:', error);
            this.showError('游戏初始化失败: ' + error.message);
        }
    }
    
    setupGameLoop() {
        // 每秒更新一次游戏时间
        setInterval(() => {
            if (!this.gameState.gameOver) {
                this.uiManager.updateAll();
            }
        }, 1000);
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ff6b6b;
                color: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 1000;
                max-width: 400px;
            ">
                <strong>错误:</strong> ${message}
                <button onclick="this.parentElement.remove()" style="
                    background: none;
                    border: none;
                    color: white;
                    float: right;
                    cursor: pointer;
                ">×</button>
            </div>
        `;
        document.body.appendChild(errorDiv);
    }
    
    // 公开API（用于调试）
    getGameState() {
        return this.gameState;
    }
    
    getUIManager() {
        return this.uiManager;
    }
}

// 初始化游戏
const game = new HydraGame();

// 导出到全局作用域以便调试
window.HydraGame = game;

// 添加一些全局辅助函数
window.debugGame = () => {
    console.log('当前游戏状态:', game.getGameState().getGameState());
    console.log('蛇群计数:', Array.from(game.getGameState().snakeCounts.entries()));
};

window.resetGame = () => {
    game.getUIManager().handleReset();
};

window.autoAttack = (speed = 100) => {
    const ui = game.getUIManager();
    if (!ui.isAutoAttacking) {
        ui.autoSpeedSelect.value = speed;
        ui.startAutoAttack();
    }
};
