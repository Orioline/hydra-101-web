/**
 * ExpantaNum.js 封装接口
 * 为Hydra游戏提供统一的大数字处理API
 * 
 * 功能包括：
 * 1. 基本数学运算（加减乘除、幂运算、对数）
 * 2. 高级大数运算（指数塔、箭头表示法、超运算）
 * 3. 特殊函数（伽马函数、阶乘、Lambert W函数）
 * 4. 数字格式化和显示
 * 5. 游戏特定辅助函数
 * 
 * 使用示例：
 * const n1 = BigNumber.create(10);
 * const n2 = BigNumber.create("1e100");
 * const tetration = n1.tetr(3); // 10^^3
 * console.log(tetration.toString('scientific'));
 */

// 确保ExpantaNum.js已加载
if (typeof ExpantaNum === 'undefined') {
    console.error('ExpantaNum.js未加载，请确保在引入本文件前加载ExpantaNum.js');
}

/**
 * 大数字类 - 封装ExpantaNum的核心功能
 */
class BigNumber {
    /**
     * 构造函数
     * @param {number|string|BigInt|Array|Object|BigNumber} value - 输入值
     */
    constructor(value) {
        if (value instanceof BigNumber) {
            this._internal = value._internal.clone();
        } else {
            this._internal = new ExpantaNum(value);
        }
    }

    // ==================== 基本运算 ====================

    /**
     * 加法
     * @param {number|string|BigNumber} other - 加数
     * @returns {BigNumber} 和
     */
    add(other) {
        const otherNum = other instanceof BigNumber ? other._internal : other;
        return new BigNumber(this._internal.add(otherNum));
    }

    /**
     * 减法
     * @param {number|string|BigNumber} other - 减数
     * @returns {BigNumber} 差
     */
    sub(other) {
        const otherNum = other instanceof BigNumber ? other._internal : other;
        return new BigNumber(this._internal.sub(otherNum));
    }

    /**
     * 乘法
     * @param {number|string|BigNumber} other - 乘数
     * @returns {BigNumber} 积
     */
    mul(other) {
        const otherNum = other instanceof BigNumber ? other._internal : other;
        return new BigNumber(this._internal.mul(otherNum));
    }

    /**
     * 除法
     * @param {number|string|BigNumber} other - 除数
     * @returns {BigNumber} 商
     */
    div(other) {
        const otherNum = other instanceof BigNumber ? other._internal : other;
        return new BigNumber(this._internal.div(otherNum));
    }

    /**
     * 取模
     * @param {number|string|BigNumber} other - 模数
     * @returns {BigNumber} 余数
     */
    mod(other) {
        const otherNum = other instanceof BigNumber ? other._internal : other;
        return new BigNumber(this._internal.mod(otherNum));
    }

    /**
     * 幂运算
     * @param {number|string|BigNumber} exponent - 指数
     * @returns {BigNumber} 幂
     */
    pow(exponent) {
        const expNum = exponent instanceof BigNumber ? exponent._internal : exponent;
        return new BigNumber(this._internal.pow(expNum));
    }

    /**
     * 平方根
     * @returns {BigNumber} 平方根
     */
    sqrt() {
        return new BigNumber(this._internal.sqrt());
    }

    /**
     * 立方根
     * @returns {BigNumber} 立方根
     */
    cbrt() {
        return new BigNumber(this._internal.cbrt());
    }

    /**
     * n次方根
     * @param {number|string|BigNumber} n - 根指数
     * @returns {BigNumber} n次方根
     */
    root(n) {
        const nNum = n instanceof BigNumber ? n._internal : n;
        return new BigNumber(this._internal.root(nNum));
    }

    // ==================== 比较运算 ====================

    /**
     * 比较两个数字
     * @param {number|string|BigNumber} other - 要比较的数字
     * @returns {number} 1 (大于), 0 (等于), -1 (小于), NaN (无法比较)
     */
    cmp(other) {
        const otherNum = other instanceof BigNumber ? other._internal : other;
        return this._internal.cmp(otherNum);
    }

    /**
     * 是否大于
     * @param {number|string|BigNumber} other - 要比较的数字
     * @returns {boolean} 是否大于
     */
    gt(other) {
        const otherNum = other instanceof BigNumber ? other._internal : other;
        return this._internal.gt(otherNum);
    }

    /**
     * 是否小于
     * @param {number|string|BigNumber} other - 要比较的数字
     * @returns {boolean} 是否小于
     */
    lt(other) {
        const otherNum = other instanceof BigNumber ? other._internal : other;
        return this._internal.lt(otherNum);
    }

    /**
     * 是否等于
     * @param {number|string|BigNumber} other - 要比较的数字
     * @returns {boolean} 是否等于
     */
    eq(other) {
        const otherNum = other instanceof BigNumber ? other._internal : other;
        return this._internal.eq(otherNum);
    }

    /**
     * 是否大于等于
     * @param {number|string|BigNumber} other - 要比较的数字
     * @returns {boolean} 是否大于等于
     */
    gte(other) {
        const otherNum = other instanceof BigNumber ? other._internal : other;
        return this._internal.gte(otherNum);
    }

    /**
     * 是否小于等于
     * @param {number|string|BigNumber} other - 要比较的数字
     * @returns {boolean} 是否小于等于
     */
    lte(other) {
        const otherNum = other instanceof BigNumber ? other._internal : other;
        return this._internal.lte(otherNum);
    }

    // ==================== 基本函数 ====================

    /**
     * 绝对值
     * @returns {BigNumber} 绝对值
     */
    abs() {
        return new BigNumber(this._internal.abs());
    }

    /**
     * 取负
     * @returns {BigNumber} 负数
     */
    neg() {
        return new BigNumber(this._internal.neg());
    }

    /**
     * 向下取整
     * @returns {BigNumber} 向下取整后的值
     */
    floor() {
        return new BigNumber(this._internal.floor());
    }

    /**
     * 向上取整
     * @returns {BigNumber} 向上取整后的值
     */
    ceil() {
        return new BigNumber(this._internal.ceil());
    }

    /**
     * 四舍五入
     * @returns {BigNumber} 四舍五入后的值
     */
    round() {
        return new BigNumber(this._internal.round());
    }

    /**
     * 以10为底的对数
     * @returns {BigNumber} 以10为底的对数
     */
    log10() {
        return new BigNumber(this._internal.log10());
    }

    /**
     * 自然对数
     * @returns {BigNumber} 自然对数
     */
    log() {
        return new BigNumber(this._internal.log());
    }

    /**
     * 以指定底数的对数
     * @param {number|string|BigNumber} base - 底数
     * @returns {BigNumber} 对数
     */
    logBase(base) {
        const baseNum = base instanceof BigNumber ? base._internal : base;
        return new BigNumber(this._internal.logBase(baseNum));
    }

    /**
     * 指数函数 (e^x)
     * @returns {BigNumber} e的x次方
     */
    exp() {
        return new BigNumber(this._internal.exp());
    }

    // ==================== 高级大数运算 ====================

    /**
     * 指数塔运算 (Tetration)
     * @param {number|string|BigNumber} height - 指数塔的高度
     * @param {number|string|BigNumber} payload - 负载值（默认为1）
     * @returns {BigNumber} 计算结果
     * 
     * 示例：2^^3 = 2^(2^2) = 16
     */
    tetr(height, payload = 1) {
        const heightNum = height instanceof BigNumber ? height._internal : height;
        const payloadNum = payload instanceof BigNumber ? payload._internal : payload;
        return new BigNumber(this._internal.tetr(heightNum, payloadNum));
    }

    /**
     * 迭代指数
     * @param {number|string|BigNumber} iterations - 迭代次数
     * @param {number|string|BigNumber} payload - 负载值（默认为1）
     * @returns {BigNumber} 计算结果
     */
    iteratedexp(iterations, payload = 1) {
        const iterNum = iterations instanceof BigNumber ? iterations._internal : iterations;
        const payloadNum = payload instanceof BigNumber ? payload._internal : payload;
        return new BigNumber(this._internal.iteratedexp(iterNum, payloadNum));
    }

    /**
     * 迭代对数
     * @param {number|string|BigNumber} base - 底数（默认为10）
     * @param {number|string|BigNumber} iterations - 迭代次数（默认为1）
     * @returns {BigNumber} 计算结果
     */
    iteratedlog(base = 10, iterations = 1) {
        const baseNum = base instanceof BigNumber ? base._internal : base;
        const iterNum = iterations instanceof BigNumber ? iterations._internal : iterations;
        return new BigNumber(this._internal.iteratedlog(baseNum, iterNum));
    }

    /**
     * 箭头表示法 (Knuth's up-arrow notation)
     * @param {number|string|BigNumber} arrows - 箭头数量
     * @param {number|string|BigNumber} other - 另一个操作数
     * @returns {BigNumber} 计算结果
     * 
     * 示例：2↑↑3 = 2^^3 = 16
     *       2↑↑↑3 = 2^^^3
     */
    arrow(arrows, other) {
        const arrowsNum = arrows instanceof BigNumber ? arrows._internal : arrows;
        const otherNum = other instanceof BigNumber ? other._internal : other;
        return new BigNumber(this._internal.arrow(arrowsNum)(otherNum));
    }

    /**
     * 链式箭头表示法
     * @param {number|string|BigNumber} other - 另一个操作数
     * @param {number|string|BigNumber} arrows - 箭头数量
     * @returns {BigNumber} 计算结果
     */
    chain(other, arrows) {
        const otherNum = other instanceof BigNumber ? other._internal : other;
        const arrowsNum = arrows instanceof BigNumber ? arrows._internal : arrows;
        return new BigNumber(this._internal.chain(otherNum, arrowsNum));
    }

    /**
     * 超对数 (Super-logarithm)
     * @param {number|string|BigNumber} base - 底数（默认为10）
     * @returns {BigNumber} 超对数值
     * 
     * 定义：slog_b(x) = n 当且仅当 b^^n ≈ x
     */
    slog(base = 10) {
        const baseNum = base instanceof BigNumber ? base._internal : base;
        return new BigNumber(this._internal.slog(baseNum));
    }

    /**
     * 层加法 (Layer addition)
     * @param {number|string|BigNumber} amount - 要添加的层数
     * @param {number|string|BigNumber} base - 底数（默认为10）
     * @returns {BigNumber} 结果
     */
    layeradd(amount, base = 10) {
        const amountNum = amount instanceof BigNumber ? amount._internal : amount;
        const baseNum = base instanceof BigNumber ? base._internal : base;
        return new BigNumber(this._internal.layeradd(amountNum, baseNum));
    }

    /**
     * 层加法（以10为底）
     * @param {number|string|BigNumber} amount - 要添加的层数
     * @returns {BigNumber} 结果
     */
    layeradd10(amount) {
        const amountNum = amount instanceof BigNumber ? amount._internal : amount;
        return new BigNumber(this._internal.layeradd10(amountNum));
    }

    /**
     * 超平方根 (Super square root)
     * @returns {BigNumber} 超平方根
     * 
     * 定义：ssrt(x) = y 当且仅当 y^^2 = x
     */
    ssrt() {
        return new BigNumber(this._internal.ssrt());
    }

    /**
     * 扩展表示法 (Expansion)
     * @param {number|string|BigNumber} other - 另一个操作数
     * @returns {BigNumber} 计算结果
     * 
     * BEAF表示法的基础：{a,b,1,2} = a{{1}}b
     */
    expansion(other) {
        const otherNum = other instanceof BigNumber ? other._internal : other;
        return new BigNumber(this._internal.expansion(otherNum));
    }

    /**
     * 五级运算 (Pentration)
     * @param {number|string|BigNumber} other - 另一个操作数
     * @returns {BigNumber} 计算结果
     */
    pent(other) {
        const otherNum = other instanceof BigNumber ? other._internal : other;
        return new BigNumber(this._internal.pent(otherNum));
    }

    // ==================== 特殊函数 ====================

    /**
     * 伽马函数
     * @returns {BigNumber} 伽马函数值
     */
    gamma() {
        return new BigNumber(this._internal.gamma());
    }

    /**
     * 阶乘
     * @returns {BigNumber} 阶乘值
     */
    fact() {
        return new BigNumber(this._internal.fact());
    }

    /**
     * Lambert W函数
     * @param {boolean} principal - 是否使用主分支（默认为true）
     * @returns {BigNumber} Lambert W函数值
     */
    lambertw(principal = true) {
        return new BigNumber(this._internal.lambertw(principal));
    }

    /**
     * 二项式系数
     * @param {number|string|BigNumber} k - k值
     * @returns {BigNumber} 二项式系数 C(n,k)
     */
    choose(k) {
        const kNum = k instanceof BigNumber ? k._internal : k;
        return new BigNumber(this._internal.choose(kNum));
    }

    // ==================== 属性和检查 ====================

    /**
     * 是否为NaN
     * @returns {boolean} 是否为NaN
     */
    isNaN() {
        return this._internal.isNaN();
    }

    /**
     * 是否为有限数
     * @returns {boolean} 是否为有限数
     */
    isFinite() {
        return this._internal.isFinite();
    }

    /**
     * 是否为无限数
     * @returns {boolean} 是否为无限数
     */
    isInfinite() {
        return this._internal.isInfinite();
    }

    /**
     * 是否为正数
     * @returns {boolean} 是否为正数
     */
    ispos() {
        return this._internal.ispos();
    }

    /**
     * 是否为负数
     * @returns {boolean} 是否为负数
     */
    isneg() {
        return this._internal.isneg();
    }

    /**
     * 是否为整数
     * @returns {boolean} 是否为整数
     */
    isint() {
        return this._internal.isint();
    }

    /**
     * 转换为JavaScript数字
     * @returns {number} JavaScript数字
     * @warning 对于非常大的数字可能返回Infinity
     */
    toNumber() {
        return this._internal.toNumber();
    }

    // ==================== 格式化输出 ====================

    /**
     * 转换为字符串
     * @param {string} format - 格式类型：'auto', 'scientific', 'chinese', 'hyperE', 'full'
     * @returns {string} 格式化后的字符串
     */
    toString(format = 'auto') {
        if (format === 'scientific') {
            return this._internal.toExponential(4);
        } else if (format === 'chinese') {
            // 调用工具函数进行中文单位转换
            return BigNumberUtils.formatChinese(this);
        } else if (format === 'hyperE') {
            return this._internal.toHyperE();
        } else if (format === 'full') {
            return this._internal.toString();
        } else {
            // 自动选择格式
            const num = this.toNumber();
            if (!isFinite(num) || Math.abs(num) >= 1e6) {
                return this._internal.toHyperE();
            } else {
                return this._internal.toString();
            }
        }
    }

    /**
     * 转换为科学计数法字符串
     * @param {number} places - 小数位数
     * @returns {string} 科学计数法字符串
     */
    toExponential(places = 4) {
        return this._internal.toExponential(places);
    }

    /**
     * 转换为固定小数位字符串
     * @param {number} places - 小数位数
     * @returns {string} 固定小数位字符串
     */
    toFixed(places = 2) {
        return this._internal.toFixed(places);
    }

    /**
     * 转换为指定精度的字符串
     * @param {number} precision - 精度
     * @returns {string} 指定精度的字符串
     */
    toPrecision(precision = 10) {
        return this._internal.toPrecision(precision);
    }

    /**
     * 克隆当前对象
     * @returns {BigNumber} 克隆后的新对象
     */
    clone() {
        return new BigNumber(this);
    }

    /**
     * 获取内部ExpantaNum对象（高级使用）
     * @returns {ExpantaNum} 内部ExpantaNum对象
     */
    getInternal() {
        return this._internal;
    }
}

// ==================== 工具类 ====================

/**
 * 大数字工具类 - 提供静态工具函数
 */
class BigNumberUtils {
    /**
     * 零值常量
     */
    static ZERO = new BigNumber(0);
    
    /**
     * 一值常量
     */
    static ONE = new BigNumber(1);
    
    /**
     * 十值常量
     */
    static TEN = new BigNumber(10);
    
    /**
     * 创建大数字
     * @param {number|string|BigInt|Array|Object|BigNumber} value - 输入值
     * @returns {BigNumber} 大数字实例
     */
    static create(value) {
        return new BigNumber(value);
    }

    /**
     * 从数字创建大数字
     * @param {number} num - 数字
     * @returns {BigNumber} 大数字实例
     */
    static fromNumber(num) {
        return new BigNumber(num);
    }

    /**
     * 从字符串创建大数字
     * @param {string} str - 字符串
     * @returns {BigNumber} 大数字实例
     */
    static fromString(str) {
        return new BigNumber(str);
    }

    /**
     * 从BigInt创建大数字
     * @param {BigInt} bigint - BigInt
     * @returns {BigNumber} 大数字实例
     */
    static fromBigInt(bigint) {
        return new BigNumber(bigint);
    }

    /**
     * 格式化数字显示
     * @param {BigNumber|number|string} num - 要格式化的数字
     * @param {string} format - 格式类型：'auto', 'scientific', 'chinese', 'hyperE', 'full'
     * @returns {string} 格式化后的字符串
     */
    static format(num, format = 'auto') {
        const bigNum = num instanceof BigNumber ? num : new BigNumber(num);
        return bigNum.toString(format);
    }

    /**
     * 中文单位格式化
     * @param {BigNumber} num - 要格式化的数字
     * @returns {string} 中文单位格式的字符串
     */
    static formatChinese(num) {
        // 简单的中文单位转换实现
        // 注意：这是一个简化版本，完整的实现可以参考bigNumber.js
        const bigNum = num instanceof BigNumber ? num : new BigNumber(num);
        const numValue = bigNum.toNumber();
        
        if (!isFinite(numValue)) {
            return bigNum.toString();
        }
        
        const absNum = Math.abs(numValue);
        const chineseUnits = ['', '万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载'];
        
        if (absNum < 10000) {
            return numValue.toString();
        }
        
        let unitIndex = 0;
        let scaled = absNum;
        
        while (scaled >= 10000 && unitIndex < chineseUnits.length - 1) {
            scaled /= 10000;
            unitIndex++;
        }
        
        const formatted = scaled.toFixed(2).replace(/\.?0+$/, '');
        const sign = numValue < 0 ? '-' : '';
        return `${sign}${formatted}${chineseUnits[unitIndex]}`;
    }

    /**
     * 计算二项式系数 n choose k
     * @param {number|string|BigNumber} n - n值
     * @param {number|string|BigNumber} k - k值
     * @returns {BigNumber} 二项式系数 C(n,k)
     */
    static choose(n, k) {
        const nNum = n instanceof BigNumber ? n._internal : n;
        const kNum = k instanceof BigNumber ? k._internal : k;
        return new BigNumber(ExpantaNum.choose(nNum, kNum));
    }

    /**
     * 计算几何级数总和
     * @param {number|string|BigNumber} numItems - 项目数量
     * @param {number|string|BigNumber} priceStart - 起始价格
     * @param {number|string|BigNumber} priceRatio - 价格比率
     * @param {number|string|BigNumber} currentOwned - 当前已拥有数量
     * @returns {BigNumber} 几何级数总和
     */
    static sumGeometricSeries(numItems, priceStart, priceRatio, currentOwned) {
        const numItemsNum = numItems instanceof BigNumber ? numItems._internal : numItems;
        const priceStartNum = priceStart instanceof BigNumber ? priceStart._internal : priceStart;
        const priceRatioNum = priceRatio instanceof BigNumber ? priceRatio._internal : priceRatio;
        const currentOwnedNum = currentOwned instanceof BigNumber ? currentOwned._internal : currentOwned;
        
        return new BigNumber(ExpantaNum.sumGeometricSeries(numItemsNum, priceStartNum, priceRatioNum, currentOwnedNum));
    }

    /**
     * 计算算术级数总和
     * @param {number|string|BigNumber} numItems - 项目数量
     * @param {number|string|BigNumber} priceStart - 起始价格
     * @param {number|string|BigNumber} priceAdd - 价格增量
     * @param {number|string|BigNumber} currentOwned - 当前已拥有数量
     * @returns {BigNumber} 算术级数总和
     */
    static sumArithmeticSeries(numItems, priceStart, priceAdd, currentOwned) {
        const numItemsNum = numItems instanceof BigNumber ? numItems._internal : numItems;
        const priceStartNum = priceStart instanceof BigNumber ? priceStart._internal : priceStart;
        const priceAddNum = priceAdd instanceof BigNumber ? priceAdd._internal : priceAdd;
        const currentOwnedNum = currentOwned instanceof BigNumber ? currentOwned._internal : currentOwned;
        
        return new BigNumber(ExpantaNum.sumArithmeticSeries(numItemsNum, priceStartNum, priceAddNum, currentOwnedNum));
    }

    /**
     * 计算可负担的几何级数项目数量
     * @param {number|string|BigNumber} resourcesAvailable - 可用资源
     * @param {number|string|BigNumber} priceStart - 起始价格
     * @param {number|string|BigNumber} priceRatio - 价格比率
     * @param {number|string|BigNumber} currentOwned - 当前已拥有数量
     * @returns {BigNumber} 可负担的项目数量
     */
    static affordGeometricSeries(resourcesAvailable, priceStart, priceRatio, currentOwned) {
        const resourcesNum = resourcesAvailable instanceof BigNumber ? resourcesAvailable._internal : resourcesAvailable;
        const priceStartNum = priceStart instanceof BigNumber ? priceStart._internal : priceStart;
        const priceRatioNum = priceRatio instanceof BigNumber ? priceRatio._internal : priceRatio;
        const currentOwnedNum = currentOwned instanceof BigNumber ? currentOwned._internal : currentOwned;
        
        return new BigNumber(ExpantaNum.affordGeometricSeries(resourcesNum, priceStartNum, priceRatioNum, currentOwnedNum));
    }

    /**
     * 计算可负担的算术级数项目数量
     * @param {number|string|BigNumber} resourcesAvailable - 可用资源
     * @param {number|string|BigNumber} priceStart - 起始价格
     * @param {number|string|BigNumber} priceAdd - 价格增量
     * @param {number|string|BigNumber} currentOwned - 当前已拥有数量
     * @returns {BigNumber} 可负担的项目数量
     */
    static affordArithmeticSeries(resourcesAvailable, priceStart, priceAdd, currentOwned) {
        const resourcesNum = resourcesAvailable instanceof BigNumber ? resourcesAvailable._internal : resourcesAvailable;
        const priceStartNum = priceStart instanceof BigNumber ? priceStart._internal : priceStart;
        const priceAddNum = priceAdd instanceof BigNumber ? priceAdd._internal : priceAdd;
        const currentOwnedNum = currentOwned instanceof BigNumber ? currentOwned._internal : currentOwned;
        
        return new BigNumber(ExpantaNum.affordArithmeticSeries(resourcesNum, priceStartNum, priceAddNum, currentOwnedNum));
    }

    /**
     * 获取最小值
     * @param {...(number|string|BigNumber)} values - 要比较的值
     * @returns {BigNumber} 最小值
     */
    static min(...values) {
        if (values.length === 0) return new BigNumber(0);
        
        let min = values[0] instanceof BigNumber ? values[0] : new BigNumber(values[0]);
        for (let i = 1; i < values.length; i++) {
            const current = values[i] instanceof BigNumber ? values[i] : new BigNumber(values[i]);
            if (current.lt(min)) {
                min = current;
            }
        }
        return min;
    }

    /**
     * 获取最大值
     * @param {...(number|string|BigNumber)} values - 要比较的值
     * @returns {BigNumber} 最大值
     */
    static max(...values) {
        if (values.length === 0) return new BigNumber(0);
        
        let max = values[0] instanceof BigNumber ? values[0] : new BigNumber(values[0]);
        for (let i = 1; i < values.length; i++) {
            const current = values[i] instanceof BigNumber ? values[i] : new BigNumber(values[i]);
            if (current.gt(max)) {
                max = current;
            }
        }
        return max;
    }
}

// ==================== 导出函数 ====================

/**
 * 创建大数字
 * @param {number|string|BigInt|Array|Object} value - 输入值
 * @returns {BigNumber} 大数字实例
 */
export function createBigNumber(value) {
    return new BigNumber(value);
}

/**
 * 指数塔运算
 * @param {number|string|BigNumber} base - 底数
 * @param {number|string|BigNumber} height - 高度
 * @param {number|string|BigNumber} payload - 负载值（默认为1）
 * @returns {BigNumber} 计算结果
 */
export function tetrate(base, height, payload = 1) {
    const baseNum = base instanceof BigNumber ? base : new BigNumber(base);
    return baseNum.tetr(height, payload);
}

/**
 * 箭头表示法运算
 * @param {number|string|BigNumber} base - 底数
 * @param {number|string|BigNumber} arrows - 箭头数量
 * @param {number|string|BigNumber} other - 另一个操作数
 * @returns {BigNumber} 计算结果
 */
export function arrowNotation(base, arrows, other) {
    const baseNum = base instanceof BigNumber ? base : new BigNumber(base);
    return baseNum.arrow(arrows, other);
}

/**
 * 超对数运算
 * @param {number|string|BigNumber} x - 输入值
 * @param {number|string|BigNumber} base - 底数（默认为10）
 * @returns {BigNumber} 超对数值
 */
export function superLogarithm(x, base = 10) {
    const xNum = x instanceof BigNumber ? x : new BigNumber(x);
    return xNum.slog(base);
}

/**
 * 格式化大数字
 * @param {BigNumber|number|string} num - 要格式化的数字
 * @param {string} format - 格式类型：'auto', 'scientific', 'chinese', 'hyperE', 'full'
 * @returns {string} 格式化后的字符串
 */
export function formatBigNumber(num, format = 'auto') {
    return BigNumberUtils.format(num, format);
}

/**
 * 比较两个数字
 * @param {number|string|BigNumber} a - 第一个数字
 * @param {number|string|BigNumber} b - 第二个数字
 * @returns {number} 比较结果：1 (a>b), 0 (a=b), -1 (a<b)
 */
export function compareNumbers(a, b) {
    const aNum = a instanceof BigNumber ? a : new BigNumber(a);
    const bNum = b instanceof BigNumber ? b : new BigNumber(b);
    return aNum.cmp(bNum);
}

/**
 * 加法运算
 * @param {number|string|BigNumber} a - 第一个加数
 * @param {number|string|BigNumber} b - 第二个加数
 * @returns {BigNumber} 和
 */
export function addNumbers(a, b) {
    const aNum = a instanceof BigNumber ? a : new BigNumber(a);
    return aNum.add(b);
}

/**
 * 乘法运算
 * @param {number|string|BigNumber} a - 第一个乘数
 * @param {number|string|BigNumber} b - 第二个乘数
 * @returns {BigNumber} 积
 */
export function multiplyNumbers(a, b) {
    const aNum = a instanceof BigNumber ? a : new BigNumber(a);
    return aNum.mul(b);
}

// ==================== 导出 ====================

// 导出类
export { BigNumber, BigNumberUtils };

// 导出默认对象
export default {
    BigNumber,
    BigNumberUtils,
    createBigNumber,
    tetrate,
    arrowNotation,
    superLogarithm,
    formatBigNumber,
    compareNumbers,
    addNumbers,
    multiplyNumbers,
    
    // 别名
    create: createBigNumber,
    format: formatBigNumber,
    cmp: compareNumbers,
    add: addNumbers,
    mul: multiplyNumbers,
};
