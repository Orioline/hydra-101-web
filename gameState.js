/**
 * 游戏状态管理类
 * 管理Hydra游戏的完整状态和规则逻辑
 * 重构版本 - 直接使用ExpantaNum.js处理大数字
 */

// 导入ExpantaNum.js
// 使用全局 ExpantaNum 变量
const ExpantaNum = window.ExpantaNum;

// 添加错误检查
if (typeof ExpantaNum !== 'function') {
    throw new Error('ExpantaNum 未正确加载。请确保 ExpantaNum.js 已通过 script 标签引入。');
}

// 创建一些常用常量
const ZERO = new ExpantaNum(0);
const ONE = new ExpantaNum(1);
const TWO = new ExpantaNum(2);

/**
 * 格式化数字为可读字符串
 * @param {ExpantaNum|number|string} num - 要格式化的数字
 * @param {string} format - 格式类型：'auto', 'scientific', 'chinese', 'full'
 * @returns {string} 格式化后的字符串
 */
function formatNumber(num, format = 'auto') {
    try {
        // 确保是ExpantaNum实例
        let enNum;
        if (num instanceof ExpantaNum) {
            enNum = num;
        } else {
            enNum = new ExpantaNum(num);
        }
        
        // 根据格式选择格式化方法
        switch (format) {
            case 'scientific':
                return enNum.toExponential(4);
            case 'chinese':
                // 简单的中文单位转换实现
                return formatChinese(enNum);
            case 'full':
                return enNum.toString();
            case 'auto':
            default:
                return autoFormat(enNum);
        }
    } catch (e) {
        console.warn('格式化数字时出错:', e);
        return String(num);
    }
}

/**
 * 自动格式化：根据数字大小选择最佳格式
 */
function autoFormat(enNum) {
    try {
        // 尝试转换为JavaScript数字检查大小
        const num = enNum.toNumber();
        
        if (!isFinite(num)) {
            // 数字太大，无法用Number表示
            return enNum.toString();
        }
        
        if (Math.abs(num) >= 1e6) {
            return enNum.toExponential(4);
        }
        
        // 小数字直接显示
        return enNum.toString();
    } catch (e) {
        // 如果转换失败，使用科学计数法
        return enNum.toExponential(4);
    }
}

/**
 * 转换为中文单位表示（简化版本）
 */
function formatChinese(enNum) {
    try {
        const num = enNum.toNumber();
        if (!isFinite(num)) {
            return enNum.toExponential(4);
        }
        
        const absNum = Math.abs(num);
        if (absNum < 10000) {
            return num.toString();
        }
        
        const chineseUnits = ['', '万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载'];
        let unitIndex = 0;
        let scaled = absNum;
        
        while (scaled >= 10000 && unitIndex < chineseUnits.length - 1) {
            scaled /= 10000;
            unitIndex++;
        }
        
        const formatted = scaled.toFixed(2).replace(/\.?0+$/, '');
        const sign = num < 0 ? '-' : '';
        return `${sign}${formatted}${chineseUnits[unitIndex]}`;
    } catch (e) {
        return enNum.toExponential(4);
    }
}

// 数学运算函数 - 直接使用ExpantaNum的方法
function addBigInt(a, b) {
    try {
        const aNum = a instanceof ExpantaNum ? a : new ExpantaNum(a);
        return aNum.add(b);
    } catch (e) {
        console.warn('加法运算时出错:', e);
        return ZERO;
    }
}

function subtractBigInt(a, b) {
    try {
        const aNum = a instanceof ExpantaNum ? a : new ExpantaNum(a);
        return aNum.sub(b);
    } catch (e) {
        console.warn('减法运算时出错:', e);
        return ZERO;
    }
}

function multiplyBigInt(a, b) {
    try {
        const aNum = a instanceof ExpantaNum ? a : new ExpantaNum(a);
        return aNum.mul(b);
    } catch (e) {
        console.warn('乘法运算时出错:', e);
        return ZERO;
    }
}

function divideBigInt(a, b) {
    try {
        const aNum = a instanceof ExpantaNum ? a : new ExpantaNum(a);
        return aNum.div(b);
    } catch (e) {
        console.warn('除法运算时出错:', e);
        return ZERO;
    }
}

function powerBigInt(base, exponent) {
    try {
        const baseNum = base instanceof ExpantaNum ? base : new ExpantaNum(base);
        return baseNum.pow(exponent);
    } catch (e) {
        console.warn('幂运算时出错:', e);
        return ZERO;
    }
}

function minBigInt(a, b) {
    try {
        return ExpantaNum.min(a, b);
    } catch (e) {
        console.warn('获取最小值时出错:', e);
        return ZERO;
    }
}

// BigNumberUtils.create的替代
function createBigNumber(value) {
    return new ExpantaNum(value);
}

// 为兼容性保留BigNumberUtils名称
const BigNumberUtils = {
    create: createBigNumber,
    ZERO: ZERO,
    ONE: ONE
};

// BigNumber类不再需要，直接使用ExpantaNum
const BigNumber = ExpantaNum;

export class GameState {
    constructor(initialHeads = 5) {
        // 游戏状态
        this.initialHeads = parseInt(initialHeads) || 5;
        this.reset();
    }
    
    /**
     * 重置游戏状态
     */
    reset() {
        // 当前攻击的蛇
        this.currentHeads = this.initialHeads;
        this.currentHP = BigNumberUtils.create(2);
        this.maxHP = BigNumberUtils.create(2);
        this.scales = BigNumberUtils.create(0); // 当前蛇掉落的鳞片数
        this.currentSnakeFixedMaxHP = BigNumberUtils.create(2); // 新增：当前蛇的固定最大HP（被选中时的maxHP值），同时也代表下一轮蛇分裂的条数（从1开始）
        
        // 蛇群计数（使用Map存储：头数 -> 数量）
        this.snakeCounts = new Map();
        // 初始只有一条N头蛇
        this.snakeCounts.set(this.currentHeads, BigNumberUtils.create(1));
        
        // 游戏统计
        this.totalAttacks = BigNumberUtils.create(0);
        this.totalScales = BigNumberUtils.create(0);
        this.totalKilledSnakes = BigNumberUtils.create(0);  // 新增：击杀蛇总数
        this.gameOver = false;
        this.victory = false;
        this.startTime = Date.now();
        this.lastAttackTime = Date.now();
        
        // 攻击力系统
        this.attackLevel = 1;  // 攻击力等级
        this.attackPower = BigNumberUtils.create(1); // 当前攻击力
        this.gold = BigNumberUtils.create(0);        // 玩家金币
        this.upgradeCost = BigNumberUtils.create(1); // 下一次升级所需金币
        this.autoUpgrade = false; // 自动升级开关
        
        // 武器系统
        this.weaponType = 'sword'; // 默认武器：剑 ('sword'/'hammer')
        
        // 历史记录
        this.maxHeads = this.currentHeads;
        this.maxHPValue = BigNumberUtils.create(1);
        
        // 游戏日志
        this.logEntries = [];
        this.addLog(`游戏开始！初始为一条${this.currentHeads}头蛇。`);
        this.addLog(`初始攻击力：${formatNumber(this.attackPower)} `);
        this.addLog(`当前武器：${this.getWeaponName()}（${this.getWeaponDescription()}）`);
    }
    
    /**
     * 执行攻击操作
     * 按照规则：计算伤害 → 掉落鳞片 → 获得金币 → 增加HP上限 → 判定死亡
     */
    attack() {
        if (this.gameOver) return false;
        
        this.totalAttacks = addBigInt(this.totalAttacks, 1);
        this.lastAttackTime = Date.now();
        
        // 根据武器类型调用相应的攻击函数
        if (this.weaponType === 'hammer') {
            this.hammerAttack();
        } else {
            this.swordAttack();
        }
        
        // 检查游戏是否胜利（所有蛇死亡）- 公用逻辑
        if (this.checkVictory()) {
            this.gameOver = true;
            this.victory = true;
            this.addLog(`🎉 游戏胜利！所有蛇已被消灭！总攻击次数：${formatNumber(this.totalAttacks)}`);
            return true;
        }
        
        // 更新最大头数记录
        if (this.currentHeads > this.maxHeads) {
            this.maxHeads = this.currentHeads;
        }
        
        return true;
    }
    
    /**
     * 剑武器攻击逻辑
     * 蛇每受到x点伤害掉落x片鳞片，其它蛇HP上限增加x
     * 包含完整的攻击效果：减少HP、增加鳞片、增加金币
     * 修改：maxHP仅在击杀蛇时增加
     */
    swordAttack() {
        const actualDamage = minBigInt(this.attackPower, this.currentHP);
        const scalesIncrease = actualDamage;
        const hpIncrease = actualDamage;
        
        // 创建日志消息
        let logMessage = `攻击${this.currentHeads}头蛇，造成${formatNumber(actualDamage)}点伤害，`;
        logMessage += `HP降至${formatNumber(addBigInt(this.currentHP, -actualDamage))}/${formatNumber(this.maxHP)}，`;
        logMessage += `鳞片+${formatNumber(scalesIncrease)}，获得${formatNumber(scalesIncrease)}金币`;
        this.addLog(logMessage);
        
        // 减少当前蛇HP
        this.currentHP = addBigInt(this.currentHP, -actualDamage);
        
        // 增加鳞片
        this.scales = addBigInt(this.scales, scalesIncrease);
        this.totalScales = addBigInt(this.totalScales, scalesIncrease);
        
        // 增加金币（每鳞片1金币）
        this.gold = addBigInt(this.gold, scalesIncrease);
        
        // 检查当前蛇是否死亡（剑类武器专用）
        if (this.currentHP.lte(BigNumberUtils.create(0))) {
            // 处理蛇死亡，包括增加maxHP
            this.handleSnakeDeath(hpIncrease);
            
            // 选择下一条蛇
            this.selectNextSnake();
        }
    }
    
    /**
     * 锤武器攻击逻辑
     * 攻击1头蛇：击杀y头1头蛇，其它蛇HP翻2^y倍
     * 攻击非1头蛇：秒杀当前蛇
     * 包含完整的攻击效果：减少HP、增加鳞片、增加金币、增加所有蛇HP上限
     */
    hammerAttack() {
        if (this.currentHeads === 1) {
            // 锤武器攻击1头蛇：击杀y头1头蛇，其它蛇HP翻2^y倍
            const y = this.attackPower; // y = 攻击力 = 击杀1头蛇的数量
            
            // 计算鳞片数量：每击杀一头1头蛇获得1片鳞片
            const scalesIncrease = y;
            
            // 计算HP增长：2^y倍，使用powerBigInt函数
            const hpMultiplier = powerBigInt(2, y); // 2^y
            const currentMaxHP = this.maxHP;
            const newMaxHP = multiplyBigInt(currentMaxHP, hpMultiplier);
            const hpIncrease = addBigInt(newMaxHP, -currentMaxHP); // 增长量 = 新值 - 旧值
            
            // 从蛇群计数中移除y头1头蛇
            const currentOneHeadCount = this.snakeCounts.get(1) || BigNumberUtils.create(0);
            const snakesToRemove = minBigInt(y, currentOneHeadCount);
            if (snakesToRemove.gt(BigNumberUtils.create(0))) {
                this.removeSnakeFromCounts(1, snakesToRemove);
                this.totalKilledSnakes = addBigInt(this.totalKilledSnakes, snakesToRemove);
                
                // 增加所有蛇的HP上限（包括未来新生蛇）- 仅在击杀时增加
                this.maxHP = addBigInt(this.maxHP, hpIncrease); // TODO: add or mul?
                if (this.maxHP.gt(this.maxHPValue)) {
                    this.maxHPValue = this.maxHP;
                }
            }
            
            // 创建日志消息
            let logMessage = `锤击1头蛇，击杀${formatNumber(y)}头！`;
            logMessage += `鳞片+${formatNumber(scalesIncrease)}，获得${formatNumber(scalesIncrease)}金币`;
            if (snakesToRemove.gt(BigNumberUtils.create(0))) {
                logMessage += `，其它蛇最大HP增长${formatNumber(hpMultiplier)}倍`;
            }
            this.addLog(logMessage);
            
            // 直接杀死当前蛇（锤武器秒杀）
            this.currentHP = BigNumberUtils.create(0);
            
            // 增加鳞片
            this.scales = addBigInt(this.scales, scalesIncrease);
            this.totalScales = addBigInt(this.totalScales, scalesIncrease);
            
            // 增加金币（每鳞片1金币）
            this.gold = addBigInt(this.gold, scalesIncrease);
            
            // 锤类武器攻击1头蛇后，需要选择下一条蛇
            // 注意：当前蛇已经在removeSnakeFromCounts中被移除，不需要再次移除
            this.selectNextSnake();
            
        } else {
            // 锤武器攻击非1头蛇：秒杀当前蛇
            const scalesIncrease = this.currentHP; // 鳞片增加量等于当前蛇的HP
            const hpIncrease = this.currentHP; // HP上限增加量等于当前蛇的HP
            
            // 创建日志消息
            let logMessage = `锤击${this.currentHeads}头蛇，直接击杀！`;
            logMessage += `鳞片+${formatNumber(scalesIncrease)}，获得${formatNumber(scalesIncrease)}金币`;
            this.addLog(logMessage);
            
            // 直接杀死当前蛇（锤武器秒杀）
            this.currentHP = BigNumberUtils.create(0);
            
            // 增加鳞片
            this.scales = addBigInt(this.scales, scalesIncrease);
            this.totalScales = addBigInt(this.totalScales, scalesIncrease);
            
            // 增加金币（每鳞片1金币）
            this.gold = addBigInt(this.gold, scalesIncrease);
            
            // 处理非1头蛇的死亡逻辑（类似handleSnakeDeath但不重复计数）
            this.handleHammerSnakeDeath(hpIncrease);
        }
    }
    
    /**
     * 处理蛇死亡
     * @param {BigNumber} hpIncrease - 需要增加的HP上限值
     */
    handleSnakeDeath(hpIncrease = BigNumberUtils.create(0)) {
        const heads = this.currentHeads;
        
        // 计算分裂的小蛇数量 - 统一使用当前蛇的固定最大HP
        const scalesForSplitting = this.currentSnakeFixedMaxHP || this.maxHP;
        this.addLog(`${heads}头蛇死亡，分裂为 ${formatNumber(scalesForSplitting)} 条小蛇`);
        
        // 从蛇群计数中移除当前蛇
        this.removeSnakeFromCounts(heads, BigNumberUtils.create(1));
        
        // 增加击杀蛇总数（包括1头蛇）
        this.totalKilledSnakes = addBigInt(this.totalKilledSnakes, 1);
        
        // 增加所有蛇的HP上限（包括未来新生蛇）- 仅在击杀时增加
        if (hpIncrease.gt(BigNumberUtils.create(0))) {
            this.maxHP = addBigInt(this.maxHP, hpIncrease);
            if (this.maxHP.gt(this.maxHPValue)) {
                this.maxHPValue = this.maxHP;
            }
        }
        
        // 1头蛇死亡不分裂
        if (heads === 1) {
            this.addLog("1头蛇死亡，不分裂");
            return;
        }
        
        // N头蛇死亡，分裂为(N-1)头蛇
        const newHeads = heads - 1;
        const newCount = scalesForSplitting;
        
        if (newCount.gt(BigNumberUtils.create(0))) {
            this.addSnakeToCounts(newHeads, newCount);
            this.addLog(`分裂出${formatNumber(newCount)}条${newHeads}头蛇`);
        }
        
        // 重置当前蛇状态（将在selectNextSnake中更新）
        this.currentHeads = 0;
        this.currentHP = BigNumberUtils.create(0);
        this.scales = BigNumberUtils.create(0);
    }
    
    /**
     * 处理锤类武器攻击非1头蛇的死亡逻辑
     * 与handleSnakeDeath类似，但不重复增加击杀计数（因为锤类武器秒杀时已经处理了鳞片和金币）
     * @param {BigNumber} hpIncrease - 需要增加的HP上限值
     */
    handleHammerSnakeDeath(hpIncrease = BigNumberUtils.create(0)) {
        const heads = this.currentHeads;
        
        // 计算分裂的小蛇数量 - 统一使用当前蛇的固定最大HP
        const scalesForSplitting = this.currentSnakeFixedMaxHP || this.maxHP;
        this.addLog(`${heads}头蛇死亡，分裂为 ${formatNumber(scalesForSplitting)} 条小蛇`);
        
        // 从蛇群计数中移除当前蛇
        this.removeSnakeFromCounts(heads, BigNumberUtils.create(1));
        
        // 注意：不增加totalKilledSnakes，因为锤类武器秒杀时已经通过鳞片数量计算了击杀
        
        // 增加所有蛇的HP上限（包括未来新生蛇）- 仅在击杀时增加
        if (hpIncrease.gt(BigNumberUtils.create(0))) {
            this.maxHP = addBigInt(this.maxHP, hpIncrease);
            if (this.maxHP.gt(this.maxHPValue)) {
                this.maxHPValue = this.maxHP;
            }
        }
        
        // 1头蛇死亡不分裂（但锤类武器不会攻击1头蛇进入这个分支）
        if (heads === 1) {
            this.addLog("1头蛇死亡，不分裂");
            // 选择下一条蛇
            this.selectNextSnake();
            return;
        }
        
        // N头蛇死亡，分裂为(N-1)头蛇
        const newHeads = heads - 1;
        const newCount = scalesForSplitting;
        
        if (newCount.gt(BigNumberUtils.create(0))) {
            this.addSnakeToCounts(newHeads, newCount);
            this.addLog(`分裂出${formatNumber(newCount)}条${newHeads}头蛇`);
        }
        
        // 选择下一条蛇
        this.selectNextSnake();
    }
    
    /**
     * 选择下一条要攻击的蛇（头数最少的）
     */
    selectNextSnake() {
        // 获取所有有蛇的头数
        const availableHeads = Array.from(this.snakeCounts.keys())
            .filter(heads => this.snakeCounts.get(heads).gt(BigNumberUtils.create(0)))
            .sort((a, b) => a - b);
        
        if (availableHeads.length === 0) {
            // 没有蛇了
            this.currentHeads = 0;
            this.currentHP = BigNumberUtils.create(0);
            this.maxHP = BigNumberUtils.create(0);
            this.scales = BigNumberUtils.create(0);
            this.currentSnakeFixedMaxHP = BigNumberUtils.create(0);
            return;
        }
        
        // 选择头数最少的蛇
        const nextHeads = availableHeads[0];
        this.currentHeads = nextHeads;
        
        // 设置当前蛇的HP（从蛇群中取出一条）
        this.currentHP = this.maxHP; // 满HP
        this.scales = BigNumberUtils.create(1);
        this.currentSnakeFixedMaxHP = this.maxHP; // 新增：记录当前蛇被选中时的maxHP作为固定值
        
        // 蛇群计数中不移除这条蛇，击杀时移除
        // this.removeSnakeFromCounts(nextHeads, BigNumberUtils.create(1));
        
        this.addLog(`选择下一条攻击目标：${nextHeads}头蛇（HP：${formatNumber(this.currentHP)}/${formatNumber(this.maxHP)}）`);
    }
    
    /**
     * 检查是否胜利（所有蛇死亡）
     */
    checkVictory() {
        for (const count of this.snakeCounts.values()) {
            if (count.gt(BigNumberUtils.create(0))) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * 向蛇群计数中添加蛇
     */
    addSnakeToCounts(heads, count) {
        const currentCount = this.snakeCounts.get(heads) || BigNumberUtils.create(0);
        this.snakeCounts.set(heads, addBigInt(currentCount, count));
    }
    
    /**
     * 从蛇群计数中移除蛇
     */
    removeSnakeFromCounts(heads, count) {
        const currentCount = this.snakeCounts.get(heads) || BigNumberUtils.create(0);
        const newCount = addBigInt(currentCount, -count);
        
        if (newCount.lte(BigNumberUtils.create(0))) {
            this.snakeCounts.delete(heads);
        } else {
            this.snakeCounts.set(heads, newCount);
        }
    }
    
    /**
     * 获取蛇群统计信息
     */
    getSnakeStats() {
        const stats = {
            totalSnakes: BigNumberUtils.create(0),
            snakeTypes: 0,
            minHeads: Infinity,
            maxHeads: 0,
            byHeads: []
        };
        
        // 首先计算总蛇数
        for (const [heads, count] of this.snakeCounts.entries()) {
            if (count.gt(BigNumberUtils.create(0))) {
                stats.totalSnakes = addBigInt(stats.totalSnakes, count);
                stats.snakeTypes++;
                
                if (heads < stats.minHeads) stats.minHeads = heads;
                if (heads > stats.maxHeads) stats.maxHeads = heads;
            }
        }
        
        // 然后计算百分比（使用最终的总蛇数）
        for (const [heads, count] of this.snakeCounts.entries()) {
            if (count.gt(BigNumberUtils.create(0))) {
                let percentage = 0;
                if (stats.totalSnakes.gt(BigNumberUtils.create(0))) {
                    // 计算百分比：count / totalSnakes * 100
                    // 使用BigNumber进行精确计算，然后转换为Number
                    const percentageBigNum = multiplyBigInt(count, 10000);
                    const divided = divideBigInt(percentageBigNum, stats.totalSnakes);
                    percentage = divided.toNumber() / 100;
                }
                
                stats.byHeads.push({
                    heads,
                    count,
                    percentage
                });
            }
        }
        
        // 按头数排序
        stats.byHeads.sort((a, b) => a.heads - b.heads);
        
        // 如果没有蛇，重置最小值
        if (stats.snakeTypes === 0) {
            stats.minHeads = 0;
        }
        
        return stats;
    }
    
    /**
     * 获取当前游戏状态摘要
     */
    getGameState() {
        const now = Date.now();
        const gameTime = Math.floor((now - this.startTime) / 1000);
        
        return {
            // 当前蛇状态
            currentHeads: this.currentHeads,
            currentHP: this.currentHP,
            maxHP: this.maxHP,
            scales: this.scales,
            currentSnakeFixedMaxHP: this.currentSnakeFixedMaxHP || this.maxHP, // 新增：当前蛇的固定最大HP
            
            // 攻击信息
            attacksToKill: this.currentHP,
            snakesOnDeath: this.getSnakesOnDeath(),
            newHeadsOnDeath: this.currentHeads > 1 ? this.currentHeads - 1 : 0,
            
            // 游戏统计
            totalAttacks: this.totalAttacks,
            totalScales: this.totalScales,
            totalKilledSnakes: this.totalKilledSnakes,  // 新增：击杀蛇总数
            gameTime,
            gameOver: this.gameOver,
            victory: this.victory,
            
            // 记录
            maxHeads: this.maxHeads,
            maxHPValue: this.maxHPValue,
            
            // 蛇群统计
            snakeStats: this.getSnakeStats()
        };
    }
    
    /**
     * 获取游戏设置
     */
    getSettings() {
        return {
            initialHeads: this.initialHeads
        };
    }
    
    /**
     * 更新游戏设置
     */
    updateSettings(settings) {
        if (settings.initialHeads !== undefined) {
            this.initialHeads = parseInt(settings.initialHeads) || 5;
        }
    }
    
    /**
     * 添加日志条目
     */
    addLog(message) {
        const timestamp = new Date().toLocaleTimeString('zh-CN');
        this.logEntries.push({
            time: timestamp,
            message,
            id: Date.now() + Math.random()
        });
        
        // 限制日志数量
        if (this.logEntries.length > 100) {
            this.logEntries = this.logEntries.slice(-50);
        }
    }
    
    /**
     * 获取日志
     */
    getLogs(count = 20) {
        return this.logEntries.slice(-count);
    }
    
    /**
     * 清空日志
     */
    clearLogs() {
        this.logEntries = [];
        this.addLog("日志已清空");
    }
    
    /**
     * 获取蛇死亡时将产生的新蛇数量
     */
    getSnakesOnDeath() {
        if (this.currentHeads <= 1) return BigNumberUtils.create(0);
        return this.currentSnakeFixedMaxHP;
    }
    
    /**
     * 获取攻击次数直到死亡
     */
    getAttacksToKill() {
        // 计算需要多少次攻击才能杀死当前蛇
        if (this.attackPower.eq(BigNumberUtils.create(0))) return BigNumberUtils.create(0);
        
        // 使用BigNumber的除法
        const attacksNeeded = divideBigInt(this.currentHP, this.attackPower).floor();
        const remainder = this.currentHP.mod(this.attackPower);
        
        if (remainder.gt(BigNumberUtils.create(0))) {
            return addBigInt(attacksNeeded, 1);
        } else {
            return attacksNeeded;
        }
    }
    
    /**
     * 升级攻击力
     * @returns {boolean} 升级是否成功
     */
    upgradeAttack() {
        // 升级不再需要金币！
        const freeUpdate = true;
        if(!freeUpdate) {
            if (this.gold.lt(this.upgradeCost)) {
                this.addLog(`金币不足！升级需要${formatNumber(this.upgradeCost)}金币，当前只有${formatNumber(this.gold)}金币`);
                return false;
            }
            
            // 扣除金币
            this.gold = addBigInt(this.gold, -this.upgradeCost);
        }
        
        // 升级攻击力（翻倍）
        this.attackLevel++;
        this.attackPower = powerBigInt(2, this.attackLevel - 1);
        
        // 更新升级成本（翻倍）
        this.upgradeCost = multiplyBigInt(this.upgradeCost, 2);
        
        this.addLog(`🎯 攻击力升级！当前等级：${this.attackLevel}，攻击力：${formatNumber(this.attackPower)} `);
        return true;
    }
    
    /**
     * 检查是否可以升级
     */
    canUpgrade() {
        return this.gold.gte(this.upgradeCost);
    }
    
    /**
     * 获取攻击力相关信息
     */
    getAttackInfo() {
        const nextAttackPower = powerBigInt(2, this.attackLevel); // 下一级攻击力
        return {
            attackLevel: this.attackLevel,
            attackPower: this.attackPower,
            nextAttackPower: nextAttackPower,
            upgradeCost: this.upgradeCost,
            gold: this.gold,
            canUpgrade: this.canUpgrade()
        };
    }
    
    /**
     * 切换武器
     * @param {string} weaponType - 武器类型 ('sword'/'hammer')
     * @returns {boolean} 切换是否成功
     */
    switchWeapon(weaponType) {
        if (weaponType !== 'sword' && weaponType !== 'hammer') {
            return false;
        }
        
        if (this.weaponType === weaponType) {
            return false; // 已经是该武器
        }
        
        const oldWeaponName = this.getWeaponName();
        this.weaponType = weaponType;
        const newWeaponName = this.getWeaponName();
        
        this.addLog(`武器切换：${oldWeaponName} → ${newWeaponName}（${this.getWeaponDescription()}）`);
        return true;
    }
    
    /**
     * 获取武器名称
     */
    getWeaponName() {
        return this.weaponType === 'hammer' ? '锤' : '剑';
    }
    
    /**
     * 获取武器描述
     */
    getWeaponDescription() {
        if (this.weaponType === 'hammer') {
            return '攻击1头蛇：击杀y头1头蛇，其它蛇HP翻2^y倍；攻击非1头蛇：秒杀当前蛇';
        } else {
            return '蛇每受到x点伤害掉落x片鳞片，其它蛇HP上限增加x';
        }
    }
    
    /**
     * 获取武器信息
     */
    getWeaponInfo() {
        return {
            weaponType: this.weaponType,
            weaponName: this.getWeaponName(),
            weaponDescription: this.getWeaponDescription()
        };
    }
    
    /**
     * 获取扩展的游戏状态（包含攻击力和武器信息）
     */
    getExtendedGameState() {
        const baseState = this.getGameState();
        const attackInfo = this.getAttackInfo();
        const weaponInfo = this.getWeaponInfo();
        
        return {
            ...baseState,
            // 攻击力系统
            attackLevel: attackInfo.attackLevel,
            attackPower: attackInfo.attackPower,
            nextAttackPower: attackInfo.nextAttackPower,
            upgradeCost: attackInfo.upgradeCost,
            gold: attackInfo.gold,
            canUpgrade: attackInfo.canUpgrade,
            autoUpgrade: this.autoUpgrade,
            // 武器系统
            weaponType: weaponInfo.weaponType,
            weaponName: weaponInfo.weaponName,
            weaponDescription: weaponInfo.weaponDescription,
            // 重新计算攻击次数直到死亡（考虑攻击力）
            attacksToKill: this.getAttacksToKill()
        };
    }
    
    /**
     * 切换自动升级开关
     */
    toggleAutoUpgrade() {
        this.autoUpgrade = !this.autoUpgrade;
        this.addLog(`自动升级${this.autoUpgrade ? '已启用' : '已禁用'}`);
        return this.autoUpgrade;
    }
    
    /**
     * 检查并执行自动升级
     * @returns {boolean} 是否执行了升级
     */
    checkAndAutoUpgrade() {
        if (!this.autoUpgrade || this.gameOver) return false;
        
        // 每次只升级1级（如果金币足够）
        if (this.canUpgrade()) {
            return this.upgradeAttack(); // 返回升级结果
        }
        
        return false;
    }
}

// 导出默认实例
export default GameState;
