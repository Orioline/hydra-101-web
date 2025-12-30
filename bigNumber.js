/**
 * 大数字处理库
 * 用于处理Hydra游戏中可能出现的极大数字，提供格式化显示功能
 */

// 中文单位系统
const CHINESE_UNITS = [
    '', '万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载',
    '极', '恒河沙', '阿僧祇', '那由他', '不可思议', '无量大数'
];

// 科学计数法阈值
const SCIENTIFIC_THRESHOLD = 1e6;
const SCIENTIFIC_PRECISION = 4;

/**
 * 格式化数字为可读字符串
 * @param {number|bigint|string} num - 要格式化的数字
 * @param {string} format - 格式类型：'auto', 'scientific', 'chinese', 'full'
 * @returns {string} 格式化后的字符串
 */
export function formatNumber(num, format = 'auto') {
    // 转换为BigInt处理大数字
    let bigNum;
    try {
        bigNum = BigInt(num);
    } catch (e) {
        // 如果无法转换为BigInt，返回原始值
        return String(num);
    }
    
    // 根据格式选择格式化方法
    switch (format) {
        case 'scientific':
            return toScientific(bigNum);
        case 'chinese':
            return toChinese(bigNum);
        case 'full':
            return toFullString(bigNum);
        case 'auto':
        default:
            return autoFormat(bigNum);
    }
}

/**
 * 自动格式化：根据数字大小选择最佳格式
 */
function autoFormat(bigNum) {
    // 转换为数字检查大小
    const num = Number(bigNum);
    
    if (!isFinite(num)) {
        // 数字太大，无法用Number表示，使用科学计数法
        return toScientific(bigNum);
    }
    
    if (num >= SCIENTIFIC_THRESHOLD) {
        return toScientific(bigNum);
    }
    
    // 小数字直接显示
    return toFullString(bigNum);
}

/**
 * 转换为科学计数法
 */
function toScientific(bigNum) {
    if (bigNum === 0n) return '0';
    
    const numStr = bigNum.toString();
    const length = numStr.length;
    
    if (length <= 1) return numStr;
    
    // 获取前几位数字
    let mantissa = numStr.slice(0, SCIENTIFIC_PRECISION);
    if (mantissa.length > 1) {
        // 插入小数点
        mantissa = mantissa.slice(0, 1) + '.' + mantissa.slice(1);
    }
    
    // 移除末尾的零
    mantissa = mantissa.replace(/\.?0+$/, '');
    if (mantissa.endsWith('.')) {
        mantissa = mantissa.slice(0, -1);
    }
    
    const exponent = length - 1;
    return `${mantissa}×10^${exponent}`;
}

/**
 * 转换为中文单位表示
 */
function toChinese(bigNum) {
    if (bigNum === 0n) return '0';
    
    const numStr = bigNum.toString();
    const length = numStr.length;
    
    // 每4位一组
    const groups = Math.ceil(length / 4);
    
    if (groups === 1) {
        return numStr;
    }
    
    // 最多支持到无量大数
    if (groups > CHINESE_UNITS.length) {
        return toScientific(bigNum);
    }
    
    // 从最低位开始分组
    let result = '';
    let remaining = numStr;
    
    for (let i = 0; i < groups; i++) {
        if (remaining.length === 0) break;
        
        // 取最后4位
        const groupDigits = remaining.slice(-4);
        remaining = remaining.slice(0, -4);
        
        // 去除前导零
        const groupNum = parseInt(groupDigits, 10);
        if (groupNum > 0) {
            let groupStr = groupNum.toString();
            
            // 如果不是最高位组，且数字小于1000，需要补零
            if (i > 0 && groupNum < 1000) {
                const zeros = 4 - groupDigits.length;
                groupStr = '0'.repeat(zeros) + groupStr;
            }
            
            result = groupStr + CHINESE_UNITS[i] + result;
        } else if (i === 0) {
            // 最低位组为0，但整个数字不为0，说明是像10000这样的数字
            if (bigNum > 0n) {
                result = CHINESE_UNITS[i] + result;
            }
        }
    }
    
    return result || '0';
}

/**
 * 完整字符串表示
 */
function toFullString(bigNum) {
    return bigNum.toString();
}

/**
 * 比较两个大数字
 */
export function compareBigInt(a, b) {
    const bigA = BigInt(a);
    const bigB = BigInt(b);
    
    if (bigA < bigB) return -1;
    if (bigA > bigB) return 1;
    return 0;
}

/**
 * 大数字加法
 */
export function addBigInt(a, b) {
    return BigInt(a) + BigInt(b);
}

/**
 * 大数字减法
 */
export function subtractBigInt(a, b) {
    return BigInt(a) - BigInt(b);
}

/**
 * 大数字乘法
 */
export function multiplyBigInt(a, b) {
    return BigInt(a) * BigInt(b);
}

/**
 * 获取两个BigInt中的最小值
 */
export function minBigInt(a, b) {
    const bigA = BigInt(a);
    const bigB = BigInt(b);
    return bigA < bigB ? bigA : bigB;
}

/**
 * 检查是否为有效数字
 */
export function isValidNumber(num) {
    try {
        BigInt(num);
        return true;
    } catch {
        return false;
    }
}

/**
 * 获取数字的近似数量级
 */
export function getMagnitude(num) {
    try {
        const bigNum = BigInt(num);
        if (bigNum === 0n) return 0;
        
        const numStr = bigNum.toString();
        return numStr.length - 1;
    } catch {
        return 0;
    }
}

/**
 * 格式化带单位的数字（如：1.23K, 4.56M等）
 */
export function formatWithUnits(num) {
    const bigNum = BigInt(num);
    const numStr = bigNum.toString();
    const length = numStr.length;
    
    if (length <= 3) return numStr;
    
    const units = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No'];
    const unitIndex = Math.min(Math.floor((length - 1) / 3), units.length - 1);
    const divisor = 10n ** BigInt(unitIndex * 3);
    
    const wholePart = bigNum / divisor;
    const fractionalPart = bigNum % divisor;
    
    let result = wholePart.toString();
    
    // 如果有小数部分且数字不太大，显示小数
    if (fractionalPart > 0n && unitIndex > 0 && length <= 15) {
        const fractionalStr = fractionalPart.toString().padStart(3, '0').slice(0, 2);
        if (fractionalStr !== '00') {
            result += '.' + fractionalStr.replace(/0+$/, '');
        }
    }
    
    return result + units[unitIndex];
}

// 导出默认对象
export default {
    formatNumber,
    compareBigInt,
    addBigInt,
    subtractBigInt,
    multiplyBigInt,
    isValidNumber,
    getMagnitude,
    formatWithUnits
};
