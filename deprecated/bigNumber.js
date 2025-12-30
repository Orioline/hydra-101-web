/**
 * 大数字处理库
 * 使用ExpantaNum.js处理Hydra游戏中可能出现的极大数字，提供格式化显示功能
 * 重构版本 - 基于expantaNumInterface.js
 */

// 导入expantaNumInterface.js的API
import { BigNumber, BigNumberUtils, formatBigNumber, compareNumbers, addNumbers, multiplyNumbers } from './expantaNumInterface.js';

// 中文单位系统（保留用于中文格式化）
const CHINESE_UNITS = [
    '', '万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载',
    '极', '恒河沙', '阿僧祇', '那由他', '不可思议', '无量大数'
];

// 科学计数法阈值
const SCIENTIFIC_THRESHOLD = 1e6;

/**
 * 格式化数字为可读字符串
 * @param {number|bigint|string|BigNumber} num - 要格式化的数字
 * @param {string} format - 格式类型：'auto', 'scientific', 'chinese', 'full'
 * @returns {string} 格式化后的字符串
 */
export function formatNumber(num, format = 'auto') {
    try {
        // 创建BigNumber实例
        let bigNum;
        if (num instanceof BigNumber) {
            bigNum = num;
        } else {
            bigNum = BigNumberUtils.create(num);
        }
        
        // 根据格式选择格式化方法
        switch (format) {
            case 'scientific':
                return bigNum.toExponential(4);
            case 'chinese':
                return formatChinese(bigNum);
            case 'full':
                return bigNum.toString();
            case 'auto':
            default:
                return autoFormat(bigNum);
        }
    } catch (e) {
        // 如果无法创建BigNumber，返回原始值的字符串表示
        console.warn('格式化数字时出错:', e);
        return String(num);
    }
}

/**
 * 自动格式化：根据数字大小选择最佳格式
 * @param {BigNumber} bigNum - BigNumber实例
 * @returns {string} 格式化后的字符串
 */
function autoFormat(bigNum) {
    try {
        // 尝试转换为JavaScript数字检查大小
        const num = bigNum.toNumber();
        
        if (!isFinite(num)) {
            // 数字太大，无法用Number表示
            return bigNum.toString();
        }
        
        if (Math.abs(num) >= SCIENTIFIC_THRESHOLD) {
            return bigNum.toExponential(4);
        }
        
        // 小数字直接显示
        return bigNum.toString();
    } catch (e) {
        // 如果转换失败，使用科学计数法
        return bigNum.toExponential(4);
    }
}

/**
 * 转换为中文单位表示
 * @param {BigNumber} bigNum - BigNumber实例
 * @returns {string} 中文单位格式的字符串
 */
function formatChinese(bigNum) {
    try {
        // 使用BigNumberUtils中的中文格式化
        return BigNumberUtils.formatChinese(bigNum);
    } catch (e) {
        // 如果格式化失败，尝试使用自定义实现
        try {
            const num = bigNum.toNumber();
            if (!isFinite(num)) {
                return bigNum.toExponential(4);
            }
            
            const absNum = Math.abs(num);
            if (absNum < 10000) {
                return num.toString();
            }
            
            let unitIndex = 0;
            let scaled = absNum;
            
            while (scaled >= 10000 && unitIndex < CHINESE_UNITS.length - 1) {
                scaled /= 10000;
                unitIndex++;
            }
            
            const formatted = scaled.toFixed(2).replace(/\.?0+$/, '');
            const sign = num < 0 ? '-' : '';
            return `${sign}${formatted}${CHINESE_UNITS[unitIndex]}`;
        } catch (e2) {
            // 如果所有方法都失败，返回科学计数法
            return bigNum.toExponential(4);
        }
    }
}

/**
 * 比较两个大数字
 * @param {number|string|BigNumber} a - 第一个数字
 * @param {number|string|BigNumber} b - 第二个数字
 * @returns {number} 比较结果：1 (a>b), 0 (a=b), -1 (a<b)
 */
export function compareBigInt(a, b) {
    try {
        const aNum = a instanceof BigNumber ? a : BigNumberUtils.create(a);
        const bNum = b instanceof BigNumber ? b : BigNumberUtils.create(b);
        return aNum.cmp(bNum);
    } catch (e) {
        console.warn('比较数字时出错:', e);
        return NaN;
    }
}

/**
 * 大数字加法
 * @param {number|string|BigNumber} a - 第一个加数
 * @param {number|string|BigNumber} b - 第二个加数
 * @returns {BigNumber} 和
 */
export function addBigInt(a, b) {
    try {
        const aNum = a instanceof BigNumber ? a : BigNumberUtils.create(a);
        return aNum.add(b);
    } catch (e) {
        console.warn('加法运算时出错:', e);
        return BigNumberUtils.ZERO;
    }
}

/**
 * 大数字减法
 * @param {number|string|BigNumber} a - 被减数
 * @param {number|string|BigNumber} b - 减数
 * @returns {BigNumber} 差
 */
export function subtractBigInt(a, b) {
    try {
        const aNum = a instanceof BigNumber ? a : BigNumberUtils.create(a);
        return aNum.sub(b);
    } catch (e) {
        console.warn('减法运算时出错:', e);
        return BigNumberUtils.ZERO;
    }
}

/**
 * 大数字乘法
 * @param {number|string|BigNumber} a - 第一个乘数
 * @param {number|string|BigNumber} b - 第二个乘数
 * @returns {BigNumber} 积
 */
export function multiplyBigInt(a, b) {
    try {
        const aNum = a instanceof BigNumber ? a : BigNumberUtils.create(a);
        return aNum.mul(b);
    } catch (e) {
        console.warn('乘法运算时出错:', e);
        return BigNumberUtils.ZERO;
    }
}

/**
 * 获取两个数字中的最小值
 * @param {number|string|BigNumber} a - 第一个数字
 * @param {number|string|BigNumber} b - 第二个数字
 * @returns {BigNumber} 最小值
 */
export function minBigInt(a, b) {
    try {
        return BigNumberUtils.min(a, b);
    } catch (e) {
        console.warn('获取最小值时出错:', e);
        return BigNumberUtils.ZERO;
    }
}

/**
 * 检查是否为有效数字
 * @param {any} num - 要检查的值
 * @returns {boolean} 是否为有效数字
 */
export function isValidNumber(num) {
    try {
        // 尝试创建BigNumber实例
        BigNumberUtils.create(num);
        return true;
    } catch {
        return false;
    }
}

/**
 * 获取数字的近似数量级
 * @param {number|string|BigNumber} num - 要检查的数字
 * @returns {number} 数量级（10的指数）
 */
export function getMagnitude(num) {
    try {
        const bigNum = num instanceof BigNumber ? num : BigNumberUtils.create(num);
        
        if (bigNum.eq(BigNumberUtils.ZERO)) {
            return 0;
        }
        
        // 使用log10获取数量级
        const log10 = bigNum.log10();
        const magnitude = log10.floor();
        return magnitude.toNumber();
    } catch (e) {
        console.warn('获取数量级时出错:', e);
        return 0;
    }
}

/**
 * 格式化带单位的数字（如：1.23K, 4.56M等）
 * @param {number|string|BigNumber} num - 要格式化的数字
 * @returns {string} 格式化后的字符串
 */
export function formatWithUnits(num) {
    try {
        const bigNum = num instanceof BigNumber ? num : BigNumberUtils.create(num);
        
        // 转换为数字检查大小
        const numValue = bigNum.toNumber();
        
        if (!isFinite(numValue)) {
            // 数字太大，使用科学计数法
            return bigNum.toExponential(4);
        }
        
        const absNum = Math.abs(numValue);
        if (absNum < 1000) {
            return numValue.toString();
        }
        
        const units = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No'];
        const unitIndex = Math.min(Math.floor((Math.log10(absNum)) / 3), units.length - 1);
        const divisor = Math.pow(10, unitIndex * 3);
        
        const scaled = absNum / divisor;
        let formatted = scaled.toFixed(2).replace(/\.?0+$/, '');
        
        // 如果小数部分为0，移除小数点和尾随零
        if (formatted.includes('.') && formatted.endsWith('00')) {
            formatted = formatted.slice(0, -3);
        }
        
        const sign = numValue < 0 ? '-' : '';
        return `${sign}${formatted}${units[unitIndex]}`;
    } catch (e) {
        console.warn('格式化带单位数字时出错:', e);
        try {
            const bigNum = num instanceof BigNumber ? num : BigNumberUtils.create(num);
            return bigNum.toString();
        } catch {
            return String(num);
        }
    }
}

/**
 * 除法运算（新增功能）
 * @param {number|string|BigNumber} a - 被除数
 * @param {number|string|BigNumber} b - 除数
 * @returns {BigNumber} 商
 */
export function divideBigInt(a, b) {
    try {
        const aNum = a instanceof BigNumber ? a : BigNumberUtils.create(a);
        return aNum.div(b);
    } catch (e) {
        console.warn('除法运算时出错:', e);
        return BigNumberUtils.ZERO;
    }
}

/**
 * 幂运算（新增功能）
 * @param {number|string|BigNumber} base - 底数
 * @param {number|string|BigNumber} exponent - 指数
 * @returns {BigNumber} 幂
 */
export function powerBigInt(base, exponent) {
    try {
        const baseNum = base instanceof BigNumber ? base : BigNumberUtils.create(base);
        return baseNum.pow(exponent);
    } catch (e) {
        console.warn('幂运算时出错:', e);
        return BigNumberUtils.ZERO;
    }
}

// 导出BigNumber和BigNumberUtils以供其他模块使用
export { BigNumber, BigNumberUtils };

// 导出默认对象
export default {
    formatNumber,
    compareBigInt,
    addBigInt,
    subtractBigInt,
    multiplyBigInt,
    divideBigInt,
    powerBigInt,
    minBigInt,
    isValidNumber,
    getMagnitude,
    formatWithUnits,
    
    // 导出BigNumber和BigNumberUtils以供高级使用
    BigNumber,
    BigNumberUtils
};
