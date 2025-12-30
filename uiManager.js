/**
 * 界面管理类
 * 负责更新游戏界面和用户交互
 */

import { formatNumber } from './bigNumber.js';

export class UIManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.autoAttackInterval = null;
        this.isAutoAttacking = false;
        this.logPaused = false;
        this.numberFormat = 'auto';
        this.currentSpeed = 100; // 默认速度：快 (0.1秒/次)
        
        // 初始化DOM元素引用
        this.initializeElements();
        
        // 绑定事件
        this.bindEvents();
        
        // 初始更新
        this.updateAll();

        // 初始化速度按钮状态
        this.updateSpeedButtonsActiveState(this.currentSpeed);
    }
    
    /**
     * 初始化DOM元素引用
     */
    initializeElements() {
        // 控制按钮
        this.attackBtn = document.getElementById('attack-btn');
        this.autoAttackBtn = document.getElementById('auto-attack-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.upgradeBtn = document.getElementById('upgrade-btn');
        this.autoUpgradeBtn = document.getElementById('auto-upgrade-btn');
        
        // 设置控件
        this.initialHeadsInput = document.getElementById('initial-heads');
        this.numberFormatSelect = document.getElementById('number-format');

        // 自动攻击速度控制
        this.currentSpeedDisplay = document.getElementById('current-speed-display');
        this.speedSlowBtn = document.getElementById('speed-slow-btn');
        this.speedMediumBtn = document.getElementById('speed-medium-btn');
        this.speedFastBtn = document.getElementById('speed-fast-btn');
        this.speedVeryFastBtn = document.getElementById('speed-veryfast-btn');
        
        // 状态显示
        this.currentSnakeStatus = document.getElementById('current-snake-status');
        this.totalSnakesStatus = document.getElementById('total-snakes-status');
        this.attackCountStatus = document.getElementById('attack-count-status');
        this.gameStateStatus = document.getElementById('game-state-status');
        
        // 当前蛇显示
        this.currentHeadsElement = document.getElementById('current-heads');
        this.currentHpElement = document.getElementById('current-hp');
        this.maxHpElement = document.getElementById('max-hp');
        this.currentScalesElement = document.getElementById('current-scales');
        this.hpBar = document.getElementById('hp-bar');
        this.attackEffectElement = document.getElementById('attack-effect'); // 修改：攻击效果显示
        this.snakesDeathInfo = document.getElementById('snakes-death-info'); // 新增：死亡信息显示
        this.currentTargetOrder = document.getElementById('current-target-order'); // 新增：当前目标序号
        this.otherSnakesMaxHpElement = document.getElementById('other-snakes-max-hp'); // 新增：其它蛇的最大HP
        
        // 蛇图标元素
        this.currentSnakeIcon = document.getElementById('current-snake-icon');
        this.currentHeadsIcon = document.getElementById('current-heads-icon');
        this.snakeHeadsBadge = document.getElementById('snake-heads-badge');
        this.slashEffectContainer = document.getElementById('slash-effect-container'); // 新增：斩击特效容器
        
        // 玩家信息显示
        this.playerAttackPower = document.getElementById('player-attack-power');
        this.playerGold = document.getElementById('player-gold');
        this.playerWeaponDisplay = document.getElementById('player-weapon-display');
        
        // 武器系统显示
        this.weaponSwordBtn = document.getElementById('weapon-sword-btn');
        this.weaponHammerBtn = document.getElementById('weapon-hammer-btn');
        this.currentWeaponDisplay = document.getElementById('current-weapon-display');
        this.weaponDescriptionDisplay = document.getElementById('weapon-description-display');
        
        // 攻击力升级显示
        this.currentAttackPower = document.getElementById('current-attack-power');
        this.nextAttackPower = document.getElementById('next-attack-power');
        this.upgradeCost = document.getElementById('upgrade-cost');
        this.currentGold = document.getElementById('current-gold');
        
        // 统计显示
        this.maxHeadsStat = document.getElementById('max-heads-stat');
        this.maxHpStat = document.getElementById('max-hp-stat');
        this.totalScalesStat = document.getElementById('total-scales-stat');
        this.totalKilledStat = document.getElementById('total-killed-stat');  // 新增：击杀蛇总数
        this.gameTimeStat = document.getElementById('game-time-stat');
        
        // 蛇群图标容器
        this.snakesIconsContainer = document.getElementById('snakes-icons-container');
        this.snakeTypesCount = document.getElementById('snake-types-count');
        this.totalSnakesCount = document.getElementById('total-snakes-count');
        this.minHeadsCount = document.getElementById('min-heads-count');
        this.totalKilledSummary = document.getElementById('total-killed-summary');  // 新增：蛇群摘要中的击杀总数
        
        // 游戏日志
        this.gameLog = document.getElementById('game-log');
        this.clearLogBtn = document.getElementById('clear-log-btn');
        this.pauseLogBtn = document.getElementById('pause-log-btn');
    }
    
    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 攻击按钮
        this.attackBtn.addEventListener('click', () => this.handleAttack());
        
        // 自动攻击按钮
        this.autoAttackBtn.addEventListener('click', () => this.toggleAutoAttack());
        
        // 重置按钮
        this.resetBtn.addEventListener('click', () => this.handleReset());
        
        // 升级按钮
        this.upgradeBtn.addEventListener('click', () => this.handleUpgrade());
        
        // 自动升级按钮
        this.autoUpgradeBtn.addEventListener('click', () => this.handleAutoUpgrade());
        
        // 武器切换按钮
        if (this.weaponSwordBtn) {
            this.weaponSwordBtn.addEventListener('click', () => this.handleWeaponSwitch('sword'));
        }
        if (this.weaponHammerBtn) {
            this.weaponHammerBtn.addEventListener('click', () => this.handleWeaponSwitch('hammer'));
        }
        
        // 设置变更
        this.initialHeadsInput.addEventListener('change', () => this.handleSettingsChange());
        this.numberFormatSelect.addEventListener('change', () => {
            this.numberFormat = this.numberFormatSelect.value;
            this.updateAll();
        });

        // 速度控制按钮
        if (this.speedSlowBtn) {
            this.speedSlowBtn.addEventListener('click', () => this.handleSpeedChange(1000, '慢 (1秒/次)'));
        }
        if (this.speedMediumBtn) {
            this.speedMediumBtn.addEventListener('click', () => this.handleSpeedChange(500, '中 (0.5秒/次)'));
        }
        if (this.speedFastBtn) {
            this.speedFastBtn.addEventListener('click', () => this.handleSpeedChange(100, '快 (0.1秒/次)'));
        }
        if (this.speedVeryFastBtn) {
            this.speedVeryFastBtn.addEventListener('click', () => this.handleSpeedChange(50, '极快 (0.05秒/次)'));
        }

        // 日志控制
        this.clearLogBtn.addEventListener('click', () => this.handleClearLog());
        this.pauseLogBtn.addEventListener('click', () => this.toggleLogPause());
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    /**
     * 处理速度变化
     * @param {number} speed - 速度值（毫秒）
     * @param {string} displayText - 显示文本
     */
    handleSpeedChange(speed, displayText) {
        this.currentSpeed = speed;

        // 更新显示
        if (this.currentSpeedDisplay) {
            this.currentSpeedDisplay.textContent = displayText;
        }

        // 更新按钮激活状态
        this.updateSpeedButtonsActiveState(speed);

        // 如果正在自动攻击，重新启动以应用新速度
        if (this.isAutoAttacking) {
            this.stopAutoAttack();
            this.startAutoAttack();
        }
    }

    /**
     * 更新速度按钮激活状态
     * @param {number} currentSpeed - 当前速度值
     */
    updateSpeedButtonsActiveState(currentSpeed) {
        // 移除所有按钮的active类
        if (this.speedSlowBtn) this.speedSlowBtn.classList.remove('active');
        if (this.speedMediumBtn) this.speedMediumBtn.classList.remove('active');
        if (this.speedFastBtn) this.speedFastBtn.classList.remove('active');
        if (this.speedVeryFastBtn) this.speedVeryFastBtn.classList.remove('active');

        // 根据当前速度激活对应按钮
        let activeBtn = null;
        switch (currentSpeed) {
            case 1000:
                activeBtn = this.speedSlowBtn;
                break;
            case 500:
                activeBtn = this.speedMediumBtn;
                break;
            case 100:
                activeBtn = this.speedFastBtn;
                break;
            case 50:
                activeBtn = this.speedVeryFastBtn;
                break;
        }

        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    /**
     * 处理武器升级
     */
    handleUpgrade() {
        if (this.gameState.gameOver) return;
        
        const success = this.gameState.upgradeAttack();
        if (success) {
            this.updateAll();
            // 触发升级特效
            this.triggerUpgradeEffect();
            this.upgradeBtn.classList.add('pulse');
            setTimeout(() => this.upgradeBtn.classList.remove('pulse'), 300);
        }
    }
    
    /**
     * 处理武器切换
     * @param {string} weaponType - 武器类型 ('sword'/'hammer')
     */
    handleWeaponSwitch(weaponType) {
        if (this.gameState.gameOver) return;
        
        const success = this.gameState.switchWeapon(weaponType);
        if (success) {
            this.updateAll();
            // 添加武器切换动画效果
            const btn = weaponType === 'sword' ? this.weaponSwordBtn : this.weaponHammerBtn;
            if (btn) {
                btn.classList.add('pulse');
                setTimeout(() => btn.classList.remove('pulse'), 300);
            }
        }
    }
    
    /**
     * 处理自动升级
     */
    handleAutoUpgrade() {
        if (this.gameState.gameOver) return;
        
        const isEnabled = this.gameState.toggleAutoUpgrade();
        this.updateAll();
        
        if (isEnabled) {
            this.autoUpgradeBtn.innerHTML = '<i class="fas fa-robot"></i> 自动升级中';
            this.autoUpgradeBtn.classList.remove('btn-info');
            this.autoUpgradeBtn.classList.add('btn-success');
        } else {
            this.autoUpgradeBtn.innerHTML = '<i class="fas fa-robot"></i> 自动升级';
            this.autoUpgradeBtn.classList.remove('btn-success');
            this.autoUpgradeBtn.classList.add('btn-info');
        }
    }
    
    /**
     * 处理攻击
     */
    handleAttack() {
        if (this.gameState.gameOver) return;
        
        const success = this.gameState.attack();
        if (success) {
            // 触发斩击特效
            this.triggerSlashEffect();
            
            // 检查并执行自动升级
            const upgraded = this.gameState.checkAndAutoUpgrade();
            if (upgraded) {
                // 自动升级成功，触发特效
                this.triggerSimpleUpgradeEffect();
            }
            this.updateAll();
            this.attackBtn.classList.add('pulse');
            setTimeout(() => this.attackBtn.classList.remove('pulse'), 300);
        }
    }
    
    /**
     * 触发斩击特效
     */
    triggerSlashEffect() {
        if (!this.slashEffectContainer) return;
        
        // 清空之前的特效
        this.slashEffectContainer.innerHTML = '';
        
        // 创建斩击特效元素
        const slashEffect = document.createElement('div');
        slashEffect.className = 'slash-effect';
        
        // 根据攻击力选择不同的颜色
        const state = this.gameState.getExtendedGameState();
        if (state.attackPower >= 10n) {
            // 高攻击力使用红色特效
            slashEffect.classList.add('red');
        } else if (state.attackPower >= 5n) {
            // 中等攻击力使用蓝色特效
            slashEffect.classList.add('blue');
        }
        // 默认使用金色特效
        
        // 添加到容器
        this.slashEffectContainer.appendChild(slashEffect);
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (slashEffect.parentNode === this.slashEffectContainer) {
                this.slashEffectContainer.removeChild(slashEffect);
            }
        }, 300);
    }
    
    /**
     * 触发升级特效
     */
    triggerUpgradeEffect() {
        // 1. 攻击力数字跳动特效
        if (this.currentAttackPower) {
            this.currentAttackPower.classList.add('upgrade-bounce');
            setTimeout(() => {
                this.currentAttackPower.classList.remove('upgrade-bounce');
            }, 500);
        }
        
        if (this.playerAttackPower) {
            this.playerAttackPower.classList.add('upgrade-bounce');
            setTimeout(() => {
                this.playerAttackPower.classList.remove('upgrade-bounce');
            }, 500);
        }
        
        // 2. 创建浮动文字特效
        this.createFloatTextEffect();
        
        // 3. 玩家图标光环特效
        if (this.upgradeBtn) {
            this.upgradeBtn.classList.add('glow-effect');
            setTimeout(() => {
                this.upgradeBtn.classList.remove('glow-effect');
            }, 800);
        }
    }
    
    /**
     * 触发简单升级特效（用于自动升级）
     */
    triggerSimpleUpgradeEffect() {
        // 1. 攻击力数字简单跳动特效
        if (this.currentAttackPower) {
            this.currentAttackPower.classList.add('upgrade-bounce');
            setTimeout(() => {
                this.currentAttackPower.classList.remove('upgrade-bounce');
            }, 300);
        }
        
        if (this.playerAttackPower) {
            this.playerAttackPower.classList.add('upgrade-bounce');
            setTimeout(() => {
                this.playerAttackPower.classList.remove('upgrade-bounce');
            }, 300);
        }
        
        // 2. 自动升级按钮简单闪烁
        if (this.autoUpgradeBtn) {
            this.autoUpgradeBtn.classList.add('pulse');
            setTimeout(() => {
                this.autoUpgradeBtn.classList.remove('pulse');
            }, 300);
        }
    }
    
    /**
     * 创建浮动文字特效
     */
    createFloatTextEffect() {
        // 在升级按钮上方创建浮动文字
        if (!this.upgradeBtn) return;
        
        const floatText = document.createElement('div');
        floatText.className = 'float-text';
        floatText.textContent = '+1';
        floatText.style.cssText = `
            position: absolute;
            color: gold;
            font-weight: bold;
            font-size: 1.2rem;
            text-shadow: 0 0 3px black;
            pointer-events: none;
            z-index: 1000;
        `;
        
        // 获取按钮位置
        const btnRect = this.upgradeBtn.getBoundingClientRect();
        floatText.style.left = `${btnRect.left + btnRect.width / 2 - 10}px`;
        floatText.style.top = `${btnRect.top - 20}px`;
        
        // 添加到body
        document.body.appendChild(floatText);
        
        // 动画结束后移除
        setTimeout(() => {
            if (floatText.parentNode) {
                floatText.parentNode.removeChild(floatText);
            }
        }, 1000);
    }
    
    /**
     * 切换自动攻击
     */
    toggleAutoAttack() {
        if (this.isAutoAttacking) {
            this.stopAutoAttack();
        } else {
            this.startAutoAttack();
        }
    }
    
    /**
     * 开始自动攻击
     */
    startAutoAttack() {
        if (this.gameState.gameOver) return;
        
        const speed = this.currentSpeed;
        this.isAutoAttacking = true;
        this.autoAttackBtn.innerHTML = '<i class="fas fa-stop"></i> 停止自动攻击';
        this.autoAttackBtn.classList.remove('btn-secondary');
        this.autoAttackBtn.classList.add('btn-danger');
        
        this.autoAttackInterval = setInterval(() => {
            if (this.gameState.gameOver) {
                this.stopAutoAttack();
                return;
            }
            this.handleAttack();
        }, speed);
    }
    
    /**
     * 停止自动攻击
     */
    stopAutoAttack() {
        this.isAutoAttacking = false;
        clearInterval(this.autoAttackInterval);
        this.autoAttackBtn.innerHTML = '<i class="fas fa-robot"></i> 自动攻击';
        this.autoAttackBtn.classList.remove('btn-danger');
        this.autoAttackBtn.classList.add('btn-secondary');
    }
    
    /**
     * 处理重置
     */
    handleReset() {
        this.stopAutoAttack();
        this.gameState.reset();
        this.updateAll();
        this.addLogEntry('游戏已重置');
    }
    
    /**
     * 处理设置变更
     */
    handleSettingsChange() {
        const initialHeads = parseInt(this.initialHeadsInput.value);
        if (initialHeads >= 2 && initialHeads <= 10) {
            this.gameState.updateSettings({ initialHeads });
            this.addLogEntry(`初始蛇头数已更改为：${initialHeads}`);
        }
    }
    
    /**
     * 处理清空日志
     */
    handleClearLog() {
        this.gameState.clearLogs();
        this.updateLog();
    }
    
    /**
     * 切换日志暂停
     */
    toggleLogPause() {
        this.logPaused = !this.logPaused;
        this.pauseLogBtn.innerHTML = this.logPaused ? 
            '<i class="fas fa-play"></i> 继续滚动' : 
            '<i class="fas fa-pause"></i> 暂停滚动';
    }

    /**
     * 处理箭头键速度变化
     * @param {string} arrowKey - 箭头键代码 ('ArrowLeft' 或 'ArrowRight')
     */
    handleArrowKeySpeedChange(arrowKey) {
        // 速度选项数组：从慢到快
        const speedOptions = [
            { speed: 1000, display: '慢 (1秒/次)' },
            { speed: 500, display: '中 (0.5秒/次)' },
            { speed: 100, display: '快 (0.1秒/次)' },
            { speed: 50, display: '极快 (0.05秒/次)' }
        ];

        // 找到当前速度的索引
        let currentIndex = speedOptions.findIndex(option => option.speed === this.currentSpeed);
        if (currentIndex === -1) {
            currentIndex = 2; // 默认到"快"
        }

        // 根据箭头方向调整索引
        if (arrowKey === 'ArrowLeft') {
            // 左箭头：减慢速度（向数组开头移动，减小索引）
            if (currentIndex > 0) {
                currentIndex--;
            }
        } else if (arrowKey === 'ArrowRight') {
            // 右箭头：加快速度（向数组末尾移动，增加索引）
            if (currentIndex < speedOptions.length - 1) {
                currentIndex++;
            }
        }

        // 应用新速度
        const newSpeed = speedOptions[currentIndex];
        this.handleSpeedChange(newSpeed.speed, newSpeed.display);
    }

    /**
     * 处理键盘事件
     */
    handleKeydown(e) {
        // 空格键攻击
        if (e.code === 'Space' && !e.target.matches('input, select, textarea')) {
            e.preventDefault();
            this.handleAttack();
        }
        
        // R键重置
        if (e.code === 'KeyR' && e.ctrlKey) {
            e.preventDefault();
            this.handleReset();
        }
        
        // A键切换自动攻击
        if (e.code === 'KeyA' && e.ctrlKey) {
            e.preventDefault();
            this.toggleAutoAttack();
        }

        // 左右箭头调整速度
        if ((e.code === 'ArrowLeft' || e.code === 'ArrowRight') && !e.target.matches('input, select, textarea')) {
            e.preventDefault();
            this.handleArrowKeySpeedChange(e.code);
        }
    }
    
    /**
     * 更新所有界面元素
     */
    updateAll() {
        const state = this.gameState.getExtendedGameState();
        
        this.updateStatusBar(state);
        this.updateCurrentSnake(state);
        this.updateStats(state);
        this.updateSnakesTable(state);
        this.updateAttackSystem(state);
        
        if (!this.logPaused) {
            this.updateLog();
        }
        
        this.updateControls(state);
    }
    
    /**
     * 更新武器系统显示
     */
    updateWeaponSystem(state) {
        // 更新武器显示
        if (this.currentWeaponDisplay) {
            this.currentWeaponDisplay.textContent = state.weaponName;
        }
        
        if (this.weaponDescriptionDisplay) {
            this.weaponDescriptionDisplay.textContent = state.weaponDescription;
        }
        
        // 更新玩家武器显示
        if (this.playerWeaponDisplay) {
            this.playerWeaponDisplay.textContent = state.weaponName;
        }
        
        // 更新武器按钮状态
        if (this.weaponSwordBtn) {
            if (state.weaponType === 'sword') {
                this.weaponSwordBtn.classList.add('btn-success');
                this.weaponSwordBtn.classList.remove('btn-outline-success');
                this.weaponSwordBtn.disabled = true;
            } else {
                this.weaponSwordBtn.classList.remove('btn-success');
                this.weaponSwordBtn.classList.add('btn-outline-success');
                this.weaponSwordBtn.disabled = false;
            }
        }
        
        if (this.weaponHammerBtn) {
            if (state.weaponType === 'hammer') {
                this.weaponHammerBtn.classList.add('btn-warning');
                this.weaponHammerBtn.classList.remove('btn-outline-warning');
                this.weaponHammerBtn.disabled = true;
            } else {
                this.weaponHammerBtn.classList.remove('btn-warning');
                this.weaponHammerBtn.classList.add('btn-outline-warning');
                this.weaponHammerBtn.disabled = false;
            }
        }
    }
    
    /**
     * 更新攻击力系统显示
     */
    updateAttackSystem(state) {
        // 更新玩家信息
        this.playerAttackPower.textContent = this.format(state.attackPower);
        this.playerGold.textContent = this.format(state.gold);
        
        // 更新攻击力升级信息
        this.currentAttackPower.textContent = this.format(state.attackPower);
        this.nextAttackPower.textContent = this.format(state.nextAttackPower);
        this.upgradeCost.textContent = this.format(state.upgradeCost);
        this.currentGold.textContent = this.format(state.gold);
        
        // 更新升级按钮状态
        this.upgradeBtn.disabled = !state.canUpgrade || state.gameOver;
        if (state.canUpgrade) {
            this.upgradeBtn.classList.remove('btn-disabled');
            this.upgradeBtn.classList.add('btn-success');
        } else {
            this.upgradeBtn.classList.remove('btn-success');
            this.upgradeBtn.classList.add('btn-disabled');
        }
        
        // 更新自动升级按钮状态
        if (state.autoUpgrade) {
            this.autoUpgradeBtn.innerHTML = '<i class="fas fa-robot"></i> 自动升级中';
            this.autoUpgradeBtn.classList.remove('btn-info');
            this.autoUpgradeBtn.classList.add('btn-success');
        } else {
            this.autoUpgradeBtn.innerHTML = '<i class="fas fa-robot"></i> 自动升级';
            this.autoUpgradeBtn.classList.remove('btn-success');
            this.autoUpgradeBtn.classList.add('btn-info');
        }
        
        // 更新武器系统显示
        this.updateWeaponSystem(state);
    }
    
    /**
     * 更新状态栏
     */
    updateStatusBar(state) {
        // 当前蛇状态
        if (state.currentHeads > 0) {
            this.currentSnakeStatus.innerHTML = `
                <i class="fas fa-crosshairs"></i>
                <span>攻击${state.currentHeads}头蛇 (HP: ${this.format(state.currentHP)}/${this.format(state.maxHP)})</span>
            `;
        } else {
            this.currentSnakeStatus.innerHTML = `
                <i class="fas fa-crosshairs"></i>
                <span>${state.gameOver ? '游戏结束' : '选择目标中...'}</span>
            `;
        }
        
        // 总蛇数
        this.totalSnakesStatus.innerHTML = `
            <i class="fas fa-snake"></i>
            <span>总蛇数: ${this.format(state.snakeStats.totalSnakes)}</span>
        `;
        
        // 攻击次数
        this.attackCountStatus.innerHTML = `
            <i class="fas fa-fist-raised"></i>
            <span>攻击次数: ${this.format(state.totalAttacks)}</span>
        `;
        
        // 游戏状态
        let gameStateText = '进行中';
        if (state.gameOver) {
            gameStateText = state.victory ? '胜利!' : '结束';
        }
        
        this.gameStateStatus.innerHTML = `
            <i class="fas fa-gamepad"></i>
            <span>游戏状态: ${gameStateText}</span>
        `;
    }
    
    /**
     * 更新当前蛇显示
     */
    updateCurrentSnake(state) {
        // 更新头部信息
        this.currentHeadsElement.textContent = state.currentHeads || '0';
        this.currentHpElement.textContent = this.format(state.currentHP);
        // 修改：max-hp字段显示当前蛇的固定最大HP，而不是全局maxHP
        this.maxHpElement.textContent = this.format(state.currentSnakeFixedMaxHP || state.maxHP);
        this.currentScalesElement.textContent = this.format(state.scales);
        
        // 更新其它蛇的最大HP（显示全局maxHP）
        if (this.otherSnakesMaxHpElement) {
            this.otherSnakesMaxHpElement.textContent = this.format(state.maxHP);
        }
        
        // 更新蛇图标
        this.updateSnakeIcon(state);
        
        // 更新HP条（使用当前蛇的固定最大HP计算百分比）
        const fixedMaxHP = state.currentSnakeFixedMaxHP || state.maxHP;
        if (fixedMaxHP > 0n) {
            const percentage = Number(state.currentHP * 100n / fixedMaxHP);
            this.hpBar.style.width = `${Math.max(0, percentage)}%`;
            
            // 根据HP百分比调整颜色
            if (percentage > 50) {
                this.hpBar.style.background = 'linear-gradient(to right, #51cf66, #ff922b)';
            } else if (percentage > 20) {
                this.hpBar.style.background = 'linear-gradient(to right, #ff922b, #ff6b6b)';
            } else {
                this.hpBar.style.background = '#ff6b6b';
            }
        } else {
            this.hpBar.style.width = '0%';
        }
        
        // 更新攻击效果显示
        this.updateAttackEffectDisplay(state);
        
        // 更新"第几个目标"显示
        this.updateTargetOrderDisplay(state);
        
        // 处理死亡时将产生的信息
        this.updateDeathInfoDisplay(state);
    }
    
    /**
     * 更新"第几个目标"显示
     */
    updateTargetOrderDisplay(state) {
        if (this.currentTargetOrder) {
            // 计算当前目标序号：击杀蛇总数 + 1
            // 注意：totalKilledSnakes是BigInt，需要转换为数字或直接使用
            const targetOrder = state.totalKilledSnakes + 1n;
            this.currentTargetOrder.textContent = this.format(targetOrder);
        }
    }
    
    /**
     * 更新死亡信息显示
     */
    updateDeathInfoDisplay(state) {
        // 确保元素引用有效
        if (!this.snakesDeathInfo) {
            this.snakesDeathInfo = document.getElementById('snakes-death-info');
        }
        
        // 如果无法获取元素，直接返回
        if (!this.snakesDeathInfo) {
            return;
        }
        
        // 处理没有当前蛇的情况（游戏重置或结束）
        if (!state.currentHeads || state.currentHeads <= 0) {
            // 显示默认值
            this.snakesDeathInfo.textContent = '不再分裂';
            return;
        }
        
        // 处理1头蛇的情况
        if (state.currentHeads === 1) {
            // 1头蛇死亡时不再分裂
            this.snakesDeathInfo.textContent = '不再分裂';
        } else {
            // 其他头数的蛇：显示预估的新蛇数量
            // 格式：将产生[X]条[Y]头蛇
            const snakesOnDeath = this.format(state.snakesOnDeath);
            const newHeadsOnDeath = state.newHeadsOnDeath;
            this.snakesDeathInfo.textContent = `将产生${snakesOnDeath}条${newHeadsOnDeath}头蛇`;
        }
    }
    
    /**
     * 更新攻击效果显示
     */
    updateAttackEffectDisplay(state) {
        if (!this.attackEffectElement) return;
        
        // 如果没有当前蛇，显示默认信息
        if (!state.currentHeads || state.currentHeads <= 0) {
            this.attackEffectElement.textContent = '无攻击目标';
            return;
        }
        
        // 根据武器类型计算攻击效果
        if (state.weaponType === 'hammer') {
            // 锤武器：攻击1头蛇时击杀y头1头蛇，攻击非1头蛇时秒杀当前蛇
            if (state.currentHeads === 1) {
                // 攻击1头蛇：击杀y头1头蛇，y = 攻击力
                const y = state.attackPower;
                this.attackEffectElement.textContent = `直接击杀${this.format(y)}头1头蛇`;
            } else {
                // 攻击非1头蛇：秒杀当前蛇
                this.attackEffectElement.textContent = '直接击杀当前蛇';
            }
        } else {
            // 剑武器：造成x点伤害，x = min(攻击力, 当前蛇HP)
            const damage = state.attackPower > state.currentHP ? state.currentHP : state.attackPower;
            this.attackEffectElement.textContent = `造成${this.format(damage)}点伤害`;
        }
    }
    
    /**
     * 更新蛇图标
     */
    updateSnakeIcon(state) {
        if (!state.currentHeads || state.currentHeads === 0) {
            // 没有当前蛇
            this.currentSnakeIcon.innerHTML = '<i class="fas fa-question fa-3x"></i>';
            this.currentHeadsIcon.textContent = '?';
            this.snakeHeadsBadge.style.display = 'none';
            return;
        }
        
        // 更新头数显示
        this.currentHeadsIcon.textContent = state.currentHeads;
        this.snakeHeadsBadge.style.display = 'block';
        
        // 根据蛇头数选择不同的图标
        let iconClass = 'fas fa-dragon';
        let bgColor = 'linear-gradient(135deg, #ff6b6b, #ff922b)';
        let iconSize = 'fa-3x';
        
        if (state.currentHeads === 1) {
            // 使用worm图标代替snake，因为fas fa-snake可能不存在
            iconClass = 'fas fa-worm';
            bgColor = 'linear-gradient(135deg, #51cf66, #339af0)';
            iconSize = 'fa-2x'; // 小一点的图标
        } else if (state.currentHeads === 2) {
            iconClass = 'fas fa-dragon';
            bgColor = 'linear-gradient(135deg, #ff6b6b, #ff922b)';
        } else if (state.currentHeads === 3) {
            iconClass = 'fas fa-dragon';
            bgColor = 'linear-gradient(135deg, #ff922b, #fcc419)';
        } else if (state.currentHeads >= 4 && state.currentHeads <= 5) {
            iconClass = 'fas fa-dragon';
            bgColor = 'linear-gradient(135deg, #fcc419, #ff6b6b)';
        } else {
            iconClass = 'fas fa-dragon';
            bgColor = 'linear-gradient(135deg, #ff6b6b, #cc5de8)';
        }
        
        // 根据HP百分比调整图标颜色
        if (state.maxHP > 0n) {
            const hpPercentage = Number(state.currentHP * 100n / state.maxHP);
            
            // 添加受伤效果
            if (hpPercentage < 30) {
                // 低血量效果
                this.currentSnakeIcon.style.animation = 'pulse 1s infinite';
            } else {
                this.currentSnakeIcon.style.animation = '';
            }
        }
        
        // 更新图标
        this.currentSnakeIcon.innerHTML = `<i class="${iconClass} ${iconSize}"></i>`;
        this.currentSnakeIcon.style.background = bgColor;
        
        // 添加攻击动画效果（如果刚刚被攻击）
        if (this.gameState.wasJustAttacked) {
            this.currentSnakeIcon.classList.add('pulse');
            setTimeout(() => {
                this.currentSnakeIcon.classList.remove('pulse');
            }, 300);
        }
    }
    
    /**
     * 更新统计信息
     */
    updateStats(state) {
        this.maxHeadsStat.textContent = state.maxHeads;
        this.maxHpStat.textContent = this.format(state.maxHPValue);
        this.totalScalesStat.textContent = this.format(state.totalScales);
        this.totalKilledStat.textContent = this.format(state.totalKilledSnakes);  // 新增：更新击杀蛇总数
        this.gameTimeStat.textContent = `${state.gameTime}秒`;
    }
    
    /**
     * 更新蛇群图标卡片
     */
    updateSnakesTable(state) {
        const stats = state.snakeStats;
        
        // 更新摘要
        this.snakeTypesCount.textContent = stats.snakeTypes;
        this.totalSnakesCount.textContent = this.format(stats.totalSnakes);
        this.minHeadsCount.textContent = stats.minHeads === Infinity ? '-' : stats.minHeads;
        this.totalKilledSummary.textContent = this.format(state.totalKilledSnakes);  // 新增：更新蛇群摘要中的击杀总数
        
        // 清空图标容器
        this.snakesIconsContainer.innerHTML = '';
        
        if (stats.byHeads.length === 0) {
            // 没有蛇的情况 - 显示空状态消息
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-snakes-message';
            emptyMessage.innerHTML = `
                <i class="fas fa-question-circle fa-2x"></i>
                <p>暂无蛇群数据</p>
            `;
            this.snakesIconsContainer.appendChild(emptyMessage);
            return;
        }
        
        // 添加蛇群图标卡片
        stats.byHeads.forEach(snake => {
            const card = document.createElement('div');
            card.className = 'snake-icon-card';
            card.setAttribute('data-heads', snake.heads);
            
            // 根据蛇头数选择图标
            let iconClass = 'fas fa-dragon';
            let iconSize = 'fa-2x';
            
            if (snake.heads === 1) {
                iconClass = 'fas fa-worm';
            } else if (snake.heads === 2) {
                iconClass = 'fas fa-dragon';
            } else if (snake.heads === 3) {
                iconClass = 'fas fa-dragon';
            } else if (snake.heads >= 4 && snake.heads <= 5) {
                iconClass = 'fas fa-dragon';
            } else {
                iconClass = 'fas fa-dragon';
            }
            
            card.innerHTML = `
                <div class="snake-icon-container">
                    <div class="snake-icon">
                        <i class="${iconClass} ${iconSize}"></i>
                    </div>
                    <div class="snake-heads-badge">${snake.heads}头</div>
                </div>
                <div class="snake-count">${this.format(snake.count)}</div>
            `;
            
            this.snakesIconsContainer.appendChild(card);
        });
    }
    
    /**
     * 更新游戏日志
     */
    updateLog() {
        const logs = this.gameState.getLogs(20);
        this.gameLog.innerHTML = '';
        
        logs.forEach(log => {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.innerHTML = `<span class="log-time">[${log.time}]</span> ${log.message}`;
            this.gameLog.appendChild(entry);
        });
        
        // 滚动到底部
        if (!this.logPaused) {
            this.gameLog.scrollTop = this.gameLog.scrollHeight;
        }
    }
    
    /**
     * 添加日志条目
     */
    addLogEntry(message) {
        this.gameState.addLog(message);
        if (!this.logPaused) {
            this.updateLog();
        }
    }
    
    /**
     * 更新控制按钮状态
     */
    updateControls(state) {
        // 攻击按钮状态
        this.attackBtn.disabled = state.gameOver;
        
        // 自动攻击按钮状态
        this.autoAttackBtn.disabled = state.gameOver;
        
        // 如果游戏结束，停止自动攻击
        if (state.gameOver && this.isAutoAttacking) {
            this.stopAutoAttack();
        }
    }
    
    /**
     * 格式化数字（使用当前选择的格式）
     */
    format(num) {
        return formatNumber(num, this.numberFormat);
    }
    
    /**
     * 销毁清理
     */
    destroy() {
        this.stopAutoAttack();
        // 移除事件监听器等清理工作
    }
}

export default UIManager;
