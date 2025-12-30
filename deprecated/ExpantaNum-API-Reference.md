# ExpantaNum.js API 参考文档

## 概述

ExpantaNum.js 是一个用于处理极大数字的JavaScript库，支持高达 {10,9e15,1,2} 级别的数字。它使用数组、层和符号的内部表示来处理超出常规JavaScript数字范围的数值。

## 快速开始

### 引入库

#### 在HTML中引入
```html
<script src="ExpantaNum.js"></script>
<script>
// 现在ExpantaNum全局可用
const x = new ExpantaNum(100);
console.log(x.toString());
</script>
```

#### 在模块化环境中
```javascript
// 假设ExpantaNum.js已通过适当方式引入
// 在CommonJS/Node.js环境中
// const ExpantaNum = require('./ExpantaNum.js');

// 在ES6模块中
// import ExpantaNum from './ExpantaNum.js';
```

### 创建ExpantaNum对象

有多种方式创建ExpantaNum实例：

```javascript
// 1. 使用构造函数
const num1 = new ExpantaNum(123);
const num2 = new ExpantaNum("1e100");
const num3 = new ExpantaNum("10^^10");

// 2. 使用工厂函数（推荐）
const num4 = ExpantaNum(456);
const num5 = ExpantaNum("1e1000");
const num6 = ExpantaNum("J^2 10^^^10");

// 3. 从各种格式创建
const num7 = ExpantaNum.fromNumber(789);
const num8 = ExpantaNum.fromString("1e10000");
const num9 = ExpantaNum.fromBigInt(12345678901234567890n);
const num10 = ExpantaNum.fromHyperE("E100#1#2");

// 4. 从JSON/对象创建
const num11 = ExpantaNum.fromJSON('{"array":[[0,100]],"sign":1,"layer":0}');
const num12 = ExpantaNum.fromArray([[0, 100], [1, 1]]);
```

### 典型函数调用示例

#### 基本数学运算
```javascript
const a = ExpantaNum("1e100");
const b = ExpantaNum("1e50");

// 加法
const sum = a.add(b); // 或 a.plus(b)
console.log("加法:", sum.toString());

// 减法
const diff = a.sub(b); // 或 a.minus(b)
console.log("减法:", diff.toString());

// 乘法
const product = a.mul(b); // 或 a.times(b)
console.log("乘法:", product.toString());

// 除法
const quotient = a.div(b); // 或 a.divide(b)
console.log("除法:", quotient.toString());

// 幂运算
const power = a.pow(2);
console.log("平方:", power.toString());

// 对数
const log10 = a.log10(); // 以10为底的对数
const ln = a.log();      // 自然对数
console.log("log10:", log10.toString());
console.log("ln:", ln.toString());
```

#### 比较运算
```javascript
const x = ExpantaNum("1e100");
const y = ExpantaNum("2e100");

// 比较
console.log("x < y?", x.lt(y));      // true
console.log("x > y?", x.gt(y));      // false
console.log("x = y?", x.eq(y));      // false
console.log("比较结果:", x.cmp(y));   // -1 (x < y)

// 带容差的比较（用于浮点数）
const tolerance = 1e-7;
console.log("带容差等于?", x.eq_tolerance(y, tolerance)); // false
```

#### 高级数学函数
```javascript
const n = ExpantaNum(100);

// 阶乘
const factorial = n.fact();
console.log("100的阶乘:", factorial.toString());

// 迭代幂运算（四则运算）
const tetration = ExpantaNum(10).tetr(3); // 10^^3 = 10^10^10
console.log("10^^3:", tetration.toString());

// Gamma函数
const gamma = n.gamma();
console.log("Gamma(100):", gamma.toString());

// Lambert W函数
const w = ExpantaNum(1).lambertw();
console.log("W(1):", w.toString());
```

#### 游戏相关示例（Hydra数游戏）
```javascript
// 假设游戏中的蛇HP使用ExpantaNum表示
let snakeHP = ExpantaNum(1);

// 攻击：HP-1，其他所有蛇HP上限+1
function attackSnake(currentHP) {
    // HP-1
    const newHP = currentHP.sub(1);
    
    // 检查是否死亡（HP <= 0）
    const isDead = newHP.lte(0);
    
    return {
        newHP: isDead ? ExpantaNum(0) : newHP,
        isDead: isDead,
        scalesDropped: isDead ? currentHP : ExpantaNum(1)
    };
}

// 分裂：N头蛇死亡时，产生"鳞片数量"的(N-1)头蛇
function splitSnake(headCount, scales) {
    if (headCount.lte(1)) {
        return ExpantaNum(0); // 1头蛇不分裂
    }
    return scales; // 产生scales条(headCount-1)头蛇
}

// 使用示例
const attackResult = attackSnake(snakeHP);
console.log("攻击后HP:", attackResult.newHP.toString());
console.log("是否死亡:", attackResult.isDead);
console.log("掉落鳞片:", attackResult.scalesDropped.toString());

if (attackResult.isDead) {
    const newSnakes = splitSnake(ExpantaNum(5), attackResult.scalesDropped);
    console.log("分裂出的新蛇数量:", newSnakes.toString());
}
```

#### 数字格式化（用于游戏界面显示）
```javascript
function formatNumberForDisplay(num, format = 'auto') {
    const expNum = ExpantaNum(num);
    
    switch(format) {
        case 'scientific':
            return expNum.toExponential(2);
        case 'fixed':
            return expNum.toFixed(0);
        case 'hyper':
            return expNum.toHyperE();
        case 'auto':
        default:
            // 自动选择最佳显示格式
            if (expNum.lt(ExpantaNum("1e6"))) {
                return expNum.toFixed(0);
            } else if (expNum.lt(ExpantaNum("1e100"))) {
                return expNum.toExponential(2);
            } else {
                return expNum.toString();
            }
    }
}

// 使用示例
const bigNum = ExpantaNum("10^^5");
console.log("科学计数法:", formatNumberForDisplay(bigNum, 'scientific'));
console.log("自动格式:", formatNumberForDisplay(bigNum, 'auto'));
```

## 基本用法

```javascript
// 创建ExpantaNum实例
const x = new ExpantaNum(123);
const y = ExpantaNum("1e100");
const z = ExpantaNum.fromString("10^^10");

// 基本运算
const sum = x.add(y);
const product = x.mul(y);
const power = x.pow(y);
```

## 常量

| 常量 | 描述 | 值 |
|------|------|-----|
| `ExpantaNum.ZERO` | 零 | 0 |
| `ExpantaNum.ONE` | 一 | 1 |
| `ExpantaNum.E` | 自然对数的底 | Math.E |
| `ExpantaNum.LN2` | 2的自然对数 | Math.LN2 |
| `ExpantaNum.LN10` | 10的自然对数 | Math.LN10 |
| `ExpantaNum.LOG2E` | e的以2为底的对数 | Math.LOG2E |
| `ExpantaNum.LOG10E` | e的以10为底的对数 | Math.LOG10E |
| `ExpantaNum.PI` | 圆周率 | Math.PI |
| `ExpantaNum.SQRT1_2` | 1/2的平方根 | Math.SQRT1_2 |
| `ExpantaNum.SQRT2` | 2的平方根 | Math.SQRT2 |
| `ExpantaNum.MAX_SAFE_INTEGER` | 最大安全整数 | 9007199254740991 |
| `ExpantaNum.MIN_SAFE_INTEGER` | 最小安全整数 | Number.MIN_SAFE_INTEGER |
| `ExpantaNum.NaN` | 非数字 | Number.NaN |
| `ExpantaNum.NEGATIVE_INFINITY` | 负无穷 | Number.NEGATIVE_INFINITY |
| `ExpantaNum.POSITIVE_INFINITY` | 正无穷 | Number.POSITIVE_INFINITY |
| `ExpantaNum.E_MAX_SAFE_INTEGER` | e^MAX_SAFE_INTEGER | "e"+MAX_SAFE_INTEGER |
| `ExpantaNum.EE_MAX_SAFE_INTEGER` | 10^10^MAX_SAFE_INTEGER | "ee"+MAX_SAFE_INTEGER |
| `ExpantaNum.TETRATED_MAX_SAFE_INTEGER` | 10^^MAX_SAFE_INTEGER | "10^^"+MAX_SAFE_INTEGER |
| `ExpantaNum.GRAHAMS_NUMBER` | 葛立恒数 | "J^63 10^^^(10^)^7625597484984 3638334640023.7783" |

## 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `maxOps` | number | 1000 | 数组中存储的最大操作数 |
| `serializeMode` | number | 0 | JSON序列化模式 (0: JSON对象, 1: 字符串) |
| `debug` | number | 0 | 调试信息级别 (0: 无, 1: 显示操作, 2: 显示所有) |

## 方法分类

### 1. 基本数学运算
- `abs()` / `absoluteValue()` - 绝对值
- `neg()` - 取反
- `add()` / `plus()` - 加法
- `sub()` / `minus()` - 减法
- `mul()` / `times()` - 乘法
- `div()` / `divide()` - 除法
- `rec()` / `reciprocate()` - 倒数
- `mod()` / `modular()` - 取模
- `pow()` / `toPower()` - 幂运算
- `exp()` / `exponential()` - 指数函数（e^x）
- `sqrt()` / `squareRoot()` - 平方根
- `cbrt()` / `cubeRoot()` - 立方根
- `root()` - n次方根
- `log10()` / `generalLogarithm()` - 以10为底的对数
- `logBase()` / `logarithm()` - 指定底数的对数
- `log()` / `ln()` / `naturalLogarithm()` - 自然对数
- `gamma()` - Gamma函数
- `fact()` / `factorial()` - 阶乘

### 2. 比较运算
- `cmp()` / `compareTo()` - 比较
- `gt()` / `greaterThan()` - 大于
- `gte()` / `greaterThanOrEqualTo()` - 大于等于
- `lt()` / `lessThan()` - 小于
- `lte()` / `lessThanOrEqualTo()` - 小于等于
- `eq()` / `equalsTo()` / `equal()` - 等于
- `neq()` / `notEqualsTo()` / `notEqual()` - 不等于
- `cmp_tolerance()` / `compareTo_tolerance()` - 带容差的比较
- `gt_tolerance()` / `greaterThan_tolerance()` - 带容差的大于
- `gte_tolerance()` / `greaterThanOrEqualTo_tolerance()` - 带容差的大于等于
- `lt_tolerance()` / `lessThan_tolerance()` - 带容差的小于
- `lte_tolerance()` / `lessThanOrEqualTo_tolerance()` - 带容差的小于等于
- `eq_tolerance()` / `equalsTo_tolerance()` / `equal_tolerance()` - 带容差的等于
- `neq_tolerance()` / `notEqualsTo_tolerance()` / `notEqual_tolerance()` - 带容差的不等于

### 3. 数值检查和类型判断
- `ispos()` / `isPositive()` - 是否为正数
- `isneg()` / `isNegative()` - 是否为负数
- `isNaN()` - 是否为NaN
- `isFinite()` - 是否为有限数
- `isInfinite()` - 是否为无穷大
- `isint()` / `isInteger()` - 是否为整数

### 4. 舍入函数
- `floor()` - 向下取整
- `ceiling()` / `ceil()` - 向上取整
- `round()` - 四舍五入

### 5. 高级数学函数
- `lambertw()` - Lambert W函数
- `tetr()` / `tetrate()` - 迭代幂运算（四则运算）
- `iteratedexp()` - 迭代指数函数
- `iteratedlog()` - 迭代对数函数
- `layeradd()` - 层加法
- `layeradd10()` - 以10为底的层加法
- `ssrt()` / `ssqrt()` - 超平方根
- `linear_sroot()` - 线性超根（已弃用？）
- `slog()` - 超对数
- `pent()` / `pentate()` - 五则运算
- `arrow()` - 高德纳箭号表示法
- `chain()` - 链式箭号
- `hyper()` - 超运算
- `expansion()` - 扩展运算

### 6. 序列和级数函数
- `affordGeometricSeries()` - 可负担的几何级数项数
- `affordArithmeticSeries()` - 可负担的算术级数项数
- `sumGeometricSeries()` - 几何级数和
- `sumArithmeticSeries()` - 算术级数和
- `choose()` - 二项式系数（n选k）

### 7. 转换函数
- `toNumber()` - 转换为JavaScript数字
- `toString()` - 转换为字符串
- `toStringWithDecimalPlaces()` - 转换为指定小数位的字符串
- `toExponential()` - 转换为科学计数法字符串
- `toFixed()` - 转换为固定小数位字符串
- `toPrecision()` - 转换为指定精度的字符串
- `toJSON()` - 转换为JSON
- `toHyperE()` - 转换为Hyper-E表示法
- `valueOf()` - 值转换（用于隐式转换）

### 8. 工具函数
- `min()` / `minimum()` - 最小值
- `max()` / `maximum()` - 最大值
- `clone()` - 克隆对象
- `normalize()` - 规范化内部表示
- `standardize()` - 标准化（已弃用，使用normalize）
- `getOperator()` - 获取操作符值
- `setOperator()` - 设置操作符值
- `operator()` - 获取或设置操作符值

## 详细方法说明

### 基本数学运算

#### `abs()` / `absoluteValue()`
- **描述**: 返回当前ExpantaNum的绝对值
- **参数**: 无
- **返回值**: `ExpantaNum` - 绝对值
- **示例**: `x.abs()` 或 `ExpantaNum.abs(x)`

#### `neg()` / `negate()`
- **描述**: 返回当前ExpantaNum的相反数
- **参数**: 无
- **返回值**: `ExpantaNum` - 相反数
- **示例**: `x.neg()` 或 `ExpantaNum.neg(x)`

#### `add()` / `plus()`
- **描述**: 将当前ExpantaNum与另一个值相加
- **参数**: `other` (ExpantaNum | number | string) - 要相加的值
- **返回值**: `ExpantaNum` - 和
- **示例**: `x.add(y)` 或 `ExpantaNum.add(x, y)`

#### `sub()` / `minus()`
- **描述**: 从当前ExpantaNum中减去另一个值
- **参数**: `other` (ExpantaNum | number | string) - 要减去的值
- **返回值**: `ExpantaNum` - 差
- **示例**: `x.sub(y)` 或 `ExpantaNum.sub(x, y)`

#### `mul()` / `times()`
- **描述**: 将当前ExpantaNum与另一个值相乘
- **参数**: `other` (ExpantaNum | number | string) - 要相乘的值
- **返回值**: `ExpantaNum` - 积
- **示例**: `x.mul(y)` 或 `ExpantaNum.mul(x, y)`

#### `div()` / `divide()`
- **描述**: 将当前ExpantaNum除以另一个值
- **参数**: `other` (ExpantaNum | number | string) - 除数
- **返回值**: `ExpantaNum` - 商
- **示例**: `x.div(y)` 或 `ExpantaNum.div(x, y)`

#### `rec()` / `reciprocate()`
- **描述**: 返回当前ExpantaNum的倒数（1/x）
- **参数**: 无
- **返回值**: `ExpantaNum` - 倒数
- **示例**: `x.rec()` 或 `ExpantaNum.rec(x)`

#### `mod()` / `modular()`
- **描述**: 返回当前ExpantaNum除以另一个值的余数
- **参数**: `other` (ExpantaNum | number | string) - 除数
- **返回值**: `ExpantaNum` - 余数
- **示例**: `x.mod(y)` 或 `ExpantaNum.mod(x, y)`

#### `pow()` / `toPower()`
- **描述**: 返回当前ExpantaNum的指定次幂
- **参数**: `other` (ExpantaNum | number | string) - 指数
- **返回值**: `ExpantaNum` - 幂
- **示例**: `x.pow(y)` 或 `ExpantaNum.pow(x, y)`

#### `exp()` / `exponential()`
- **描述**: 返回e的当前ExpantaNum次幂（e^x）
- **参数**: 无
- **返回值**: `ExpantaNum` - e^x
- **示例**: `x.exp()` 或 `ExpantaNum.exp(x)`

#### `sqrt()` / `squareRoot()`
- **描述**: 返回当前ExpantaNum的平方根
- **参数**: 无
- **返回值**: `ExpantaNum` - 平方根
- **示例**: `x.sqrt()` 或 `ExpantaNum.sqrt(x)`

#### `cbrt()` / `cubeRoot()`
- **描述**: 返回当前ExpantaNum的立方根
- **参数**: 无
- **返回值**: `ExpantaNum` - 立方根
- **示例**: `x.cbrt()` 或 `ExpantaNum.cbrt(x)`

#### `root()`
- **描述**: 返回当前ExpantaNum的n次方根
- **参数**: `other` (ExpantaNum | number | string) - 根指数
- **返回值**: `ExpantaNum` - n次方根
- **示例**: `x.root(y)` 或 `ExpantaNum.root(x, y)`

#### `log10()` / `generalLogarithm()`
- **描述**: 返回当前ExpantaNum以10为底的对数
- **参数**: 无
- **返回值**: `ExpantaNum` - 以10为底的对数
- **示例**: `x.log10()` 或 `ExpantaNum.log10(x)`

#### `logBase()` / `logarithm()`
- **描述**: 返回当前ExpantaNum以指定底数为底的对数
- **参数**: `base` (ExpantaNum | number | string, 可选) - 底数，默认为e
- **返回值**: `ExpantaNum` - 对数
- **示例**: `x.logBase(2)` 或 `ExpantaNum.logBase(x, 2)`

#### `log()` / `ln()` / `naturalLogarithm()`
- **描述**: 返回当前ExpantaNum的自然对数（以e为底）
- **参数**: 无
- **返回值**: `ExpantaNum` - 自然对数
- **示例**: `x.log()` 或 `ExpantaNum.log(x)`

#### `gamma()`
- **描述**: 返回当前ExpantaNum的Gamma函数值
- **参数**: 无
- **返回值**: `ExpantaNum` - Gamma函数值
- **示例**: `x.gamma()` 或 `ExpantaNum.gamma(x)`

#### `fact()` / `factorial()`
- **描述**: 返回当前ExpantaNum的阶乘
- **参数**: 无
- **返回值**: `ExpantaNum` - 阶乘
- **示例**: `x.fact()` 或 `ExpantaNum.fact(x)`

### 比较运算

#### `cmp()` / `compareTo()`
- **描述**: 比较当前ExpantaNum与另一个值
- **参数**: `other` (ExpantaNum | number | string) - 要比较的值
- **返回值**: `number` - 比较结果（-1: 小于, 0: 等于, 1: 大于, NaN: 无法比较）
- **示例**: `x.cmp(y)` 或 `ExpantaNum.cmp(x, y)`

#### `gt()` / `greaterThan()`
- **描述**: 判断当前ExpantaNum是否大于另一个值
- **参数**: `other` (ExpantaNum | number | string) - 要比较的值
- **返回值**: `boolean` - 是否大于
- **示例**: `x.gt(y)` 或 `ExpantaNum.gt(x, y)`

#### `gte()` / `greaterThanOrEqualTo()`
- **描述**: 判断当前ExpantaNum是否大于或等于另一个值
- **参数**: `other` (ExpantaNum | number | string) - 要比较的值
- **返回值**: `boolean` - 是否大于或等于
- **示例**: `x.gte(y)` 或 `ExpantaNum.gte(x, y)`

#### `lt()` / `lessThan()`
- **描述**: 判断当前ExpantaNum是否小于另一个值
- **参数**: `other` (ExpantaNum | number | string) - 要比较的值
- **返回值**: `boolean` - 是否小于
- **示例**: `x.lt(y)` 或 `ExpantaNum.lt(x, y)`

#### `lte()` / `lessThanOrEqualTo()`
- **描述**: 判断当前ExpantaNum是否小于或等于另一个值
- **参数**: `other` (ExpantaNum | number | string) - 要比较的值
- **返回值**: `boolean` - 是否小于或等于
- **示例**: `x.lte(y)` 或 `ExpantaNum.lte(x, y)`

#### `eq()` / `equalsTo()` / `equal()`
- **描述**: 判断当前ExpantaNum是否等于另一个值
- **参数**: `other` (ExpantaNum | number | string) - 要比较的值
- **返回值**: `boolean` - 是否等于
- **示例**: `x.eq(y)` 或 `ExpantaNum.eq(x, y)`

#### `neq()` / `notEqualsTo()` / `notEqual()`
- **描述**: 判断当前ExpantaNum是否不等于另一个值
- **参数**: `other` (ExpantaNum | number | string) - 要比较的值
- **返回值**: `boolean` - 是否不等于
- **示例**: `x.neq(y)` 或 `ExpantaNum.neq(x, y)`

#### 容差比较函数
所有比较函数都有对应的容差版本（后缀`_tolerance`），接受一个额外的`tolerance`参数（默认1e-7）用于浮点数比较。

### 数值检查和类型判断

#### `ispos()` / `isPositive()`
- **描述**: 判断当前ExpantaNum是否为正数
- **参数**: 无
- **返回值**: `boolean` - 是否为正数
- **示例**: `x.ispos()` 或 `ExpantaNum.ispos(x)`

#### `isneg()` / `isNegative()`
- **描述**: 判断当前ExpantaNum是否为负数
- **参数**: 无
- **返回值**: `boolean` - 是否为负数
- **示例**: `x.isneg()` 或 `ExpantaNum.isneg(x)`

#### `isNaN()`
- **描述**: 判断当前ExpantaNum是否为NaN
- **参数**: 无
- **返回值**: `boolean` - 是否为NaN
- **示例**: `x.isNaN()` 或 `ExpantaNum.isNaN(x)`

#### `isFinite()`
- **描述**: 判断当前ExpantaNum是否为有限数
- **参数**: 无
- **返回值**: `boolean` - 是否为有限数
- **示例**: `x.isFinite()` 或 `ExpantaNum.isFinite(x)`

#### `isInfinite()`
- **描述**: 判断当前ExpantaNum是否为无穷大
- **参数**: 无
- **返回值**: `boolean` - 是否为无穷大
- **示例**: `x.isInfinite()` 或 `ExpantaNum.isInfinite(x)`

#### `isint()` / `isInteger()`
- **描述**: 判断当前ExpantaNum是否为整数
- **参数**: 无
- **返回值**: `boolean` - 是否为整数
- **示例**: `x.isint()` 或 `ExpantaNum.isint(x)`

### 舍入函数

#### `floor()`
- **描述**: 返回小于或等于当前ExpantaNum的最大整数
- **参数**: 无
- **返回值**: `ExpantaNum` - 向下取整的结果
- **示例**: `x.floor()` 或 `ExpantaNum.floor(x)`

#### `ceiling()` / `ceil()`
- **描述**: 返回大于或等于当前ExpantaNum的最小整数
- **参数**: 无
- **返回值**: `ExpantaNum` - 向上取整的结果
- **示例**: `x.ceil()` 或 `ExpantaNum.ceil(x)`

#### `round()`
- **描述**: 返回当前ExpantaNum四舍五入到最接近的整数
- **参数**: 无
- **返回值**: `ExpantaNum` - 四舍五入的结果
- **示例**: `x.round()` 或 `ExpantaNum.round(x)`

### 高级数学函数

#### `lambertw()`
- **描述**: 返回当前ExpantaNum的Lambert W函数值（满足 W(x) * e^W(x) = x）
- **参数**: `principal` (boolean, 可选) - 是否使用主分支，默认为true
- **返回值**: `ExpantaNum` - Lambert W函数值
- **示例**: `x.lambertw()` 或 `ExpantaNum.lambertw(x)`

#### `tetr()` / `tetrate()`
- **描述**: 返回当前ExpantaNum的迭代幂运算（四则运算）
- **参数**: 
  - `height` (ExpantaNum | number | string) - 迭代高度
  - `payload` (ExpantaNum | number | string, 可选) - 载荷，默认为1
- **返回值**: `ExpantaNum` - 迭代幂运算结果
- **示例**: `x.tetr(y)` 或 `ExpantaNum.tetr(x, y)`

#### `iteratedexp()`
- **描述**: 迭代指数函数（与tetrate相同）
- **参数**: 
  - `height` (ExpantaNum | number | string) - 迭代高度
  - `payload` (ExpantaNum | number | string, 可选) - 载荷，默认为1
- **返回值**: `ExpantaNum` - 迭代指数函数结果
- **示例**: `x.iteratedexp(y)` 或 `ExpantaNum.iteratedexp(x, y)`

#### `iteratedlog()`
- **描述**: 迭代对数函数
- **参数**: 
  - `base` (ExpantaNum | number | string, 可选) - 底数，默认为10
  - `times` (ExpantaNum | number | string, 可选) - 迭代次数，默认为1
- **返回值**: `ExpantaNum` - 迭代对数结果
- **示例**: `x.iteratedlog(base, times)` 或 `ExpantaNum.iteratedlog(x, base, times)`

#### `layeradd()`
- **描述**: 层加法
- **参数**: 
  - `other` (ExpantaNum | number | string, 可选) - 要加的值，默认为1
  - `base` (ExpantaNum | number | string, 可选) - 底数，默认为10
- **返回值**: `ExpantaNum` - 层加法结果
- **示例**: `x.layeradd(y)` 或 `ExpantaNum.layeradd(x, y)`

#### `layeradd10()`
- **描述**: 以10为底的层加法
- **参数**: `other` (ExpantaNum | number | string, 可选) - 要加的值，默认为1
- **返回值**: `ExpantaNum` - 层加法结果
- **示例**: `x.layeradd10(y)` 或 `ExpantaNum.layeradd10(x, y)`

#### `ssrt()` / `ssqrt()`
- **描述**: 超平方根函数（满足 ssrt(x) ^^ 2 = x）
- **参数**: 无
- **返回值**: `ExpantaNum` - 超平方根
- **示例**: `x.ssrt()` 或 `ExpantaNum.ssrt(x)`

#### `slog()`
- **描述**: 超对数函数（满足 base ^^ slog(base, x) = x）
- **参数**: `base` (ExpantaNum | number | string, 可选) - 底数，默认为10
- **返回值**: `ExpantaNum` - 超对数
- **示例**: `x.slog(base)` 或 `ExpantaNum.slog(x, base)`

#### `pent()` / `pentate()`
- **描述**: 五则运算（箭头表示法中的3个箭头）
- **参数**: `other` (ExpantaNum | number | string) - 另一个操作数
- **返回值**: `ExpantaNum` - 五则运算结果
- **示例**: `x.pent(y)` 或 `ExpantaNum.pent(x, y)`

#### `arrow()`
- **描述**: 返回一个函数，该函数执行高德纳箭号表示法运算
- **参数**: `arrows` (ExpantaNum | number | string) - 箭头数量
- **返回值**: `function` - 执行箭号运算的函数
- **示例**: `x.arrow(3)(y)` 执行 x ↑↑↑ y

#### `chain()`
- **描述**: 链式箭号运算（与arrow相同）
- **参数**: 
  - `other` (ExpantaNum | number | string) - 另一个操作数
  - `arrows` (ExpantaNum | number | string) - 箭头数量
- **返回值**: `ExpantaNum` - 链式箭号运算结果
- **示例**: `x.chain(y, 3)` 或 `ExpantaNum.chain(x, y, 3)`

#### `hyper()`
- **描述**: 返回一个函数，该函数执行超运算
- **参数**: `z` (ExpantaNum | number | string) - 超运算级别
- **返回值**: `function` - 执行超运算的函数
- **示例**: `ExpantaNum.hyper(3)(x, y)` 执行 x ↑↑ y

#### `expansion()`
- **描述**: 扩展运算（BEAF表示法中的 {x,y,1,2}）
- **参数**: `other` (ExpantaNum | number | string) - 另一个操作数
- **返回值**: `ExpantaNum` - 扩展运算结果
- **示例**: `x.expansion(y)` 或 `ExpantaNum.expansion(x, y)`

### 序列和级数函数

#### `affordGeometricSeries()`
- **描述**: 计算在给定资源下可以购买的几何级数项数
- **参数**: 
  - `resourcesAvailable` (ExpantaNum | number | string) - 可用资源
  - `priceStart` (ExpantaNum | number | string) - 起始价格
  - `priceRatio` (ExpantaNum | number | string) - 价格比率
  - `currentOwned` (ExpantaNum | number | string) - 当前已拥有数量
- **返回值**: `ExpantaNum` - 可购买的项数
- **示例**: `ExpantaNum.affordGeometricSeries(resources, start, ratio, owned)`

#### `affordArithmeticSeries()`
- **描述**: 计算在给定资源下可以购买的算术级数项数
- **参数**: 
  - `resourcesAvailable` (ExpantaNum | number | string) - 可用资源
  - `priceStart` (ExpantaNum | number | string) - 起始价格
  - `priceAdd` (ExpantaNum | number | string) - 每次购买增加的价格
  - `currentOwned` (ExpantaNum | number | string) - 当前已拥有数量
- **返回值**: `ExpantaNum` - 可购买的项数
- **示例**: `ExpantaNum.affordArithmeticSeries(resources, start, add, owned)`

#### `sumGeometricSeries()`
- **描述**: 计算几何级数的和
- **参数**: 
  - `numItems` (ExpantaNum | number | string) - 项数
  - `priceStart` (ExpantaNum | number | string) - 起始价格
  - `priceRatio` (ExpantaNum | number | string) - 价格比率
  - `currentOwned` (ExpantaNum | number | string) - 当前已拥有数量
- **返回值**: `ExpantaNum` - 几何级数和
- **示例**: `ExpantaNum.sumGeometricSeries(items, start, ratio, owned)`

#### `sumArithmeticSeries()`
- **描述**: 计算算术级数的和
- **参数**: 
  - `numItems` (ExpantaNum | number | string) - 项数
  - `priceStart` (ExpantaNum | number | string) - 起始价格
  - `priceAdd` (ExpantaNum | number | string) - 每次增加的价格
  - `currentOwned` (ExpantaNum | number | string) - 当前已拥有数量
- **返回值**: `ExpantaNum` - 算术级数和
- **示例**: `ExpantaNum.sumArithmeticSeries(items, start, add, owned)`

#### `choose()`
- **描述**: 计算二项式系数（n选k）
- **参数**: 
  - `n` (ExpantaNum | number | string) - 总数
  - `k` (ExpantaNum | number | string) - 选择数
- **返回值**: `ExpantaNum` - 二项式系数 C(n, k)
- **示例**: `ExpantaNum.choose(n, k)` 或 `x.choose(k)`

### 转换函数

#### `toNumber()`
- **描述**: 将当前ExpantaNum转换为JavaScript数字
- **参数**: 无
- **返回值**: `number` - JavaScript数字（可能为Infinity或NaN）
- **示例**: `x.toNumber()`
- **注意**: 对于超出JavaScript数字范围的数值，返回Infinity

#### `toString()`
- **描述**: 将当前ExpantaNum转换为字符串表示
- **参数**: 无
- **返回值**: `string` - 字符串表示
- **示例**: `x.toString()`

#### `toStringWithDecimalPlaces()`
- **描述**: 将当前ExpantaNum转换为指定小数位的字符串
- **参数**: 
  - `places` (number) - 小数位数
  - `applyToOpNums` (boolean, 可选) - 是否将小数位应用到操作数，默认为false
- **返回值**: `string` - 格式化后的字符串
- **示例**: `x.toStringWithDecimalPlaces(5)`

#### `toExponential()`
- **描述**: 将当前ExpantaNum转换为科学计数法字符串
- **参数**: 
  - `places` (number, 可选) - 小数位数
  - `applyToOpNums` (boolean, 可选) - 是否将小数位应用到操作数，默认为false
- **返回值**: `string` - 科学计数法字符串
- **示例**: `x.toExponential(3)`

#### `toFixed()`
- **描述**: 将当前ExpantaNum转换为固定小数位字符串
- **参数**: 
  - `places` (number) - 小数位数
  - `applyToOpNums` (boolean, 可选) - 是否将小数位应用到操作数，默认为false
- **返回值**: `string` - 固定小数位字符串
- **示例**: `x.toFixed(2)`

#### `toPrecision()`
- **描述**: 将当前ExpantaNum转换为指定精度的字符串
- **参数**: 
  - `places` (number) - 精度位数
  - `applyToOpNums` (boolean, 可选) - 是否将精度应用到操作数，默认为false
- **返回值**: `string` - 指定精度的字符串
- **示例**: `x.toPrecision(5)`

#### `toJSON()`
- **描述**: 将当前ExpantaNum转换为JSON表示
- **参数**: 无
- **返回值**: `object` 或 `string` - JSON表示（取决于serializeMode配置）
- **示例**: `x.toJSON()` 或 `JSON.stringify(x)`

#### `toHyperE()`
- **描述**: 将当前ExpantaNum转换为Hyper-E表示法字符串
- **参数**: 无
- **返回值**: `string` - Hyper-E表示法字符串
- **示例**: `x.toHyperE()`
- **注意**: 仅支持小于10{MSI}10的数字

#### `valueOf()`
- **描述**: 返回字符串表示（用于隐式类型转换）
- **参数**: 无
- **返回值**: `string` - 字符串表示
- **示例**: `String(x)` 或 `x + ""`

### 工具函数

#### `min()` / `minimum()`
- **描述**: 返回当前ExpantaNum和另一个值中的较小值
- **参数**: `other` (ExpantaNum | number | string) - 要比较的值
- **返回值**: `ExpantaNum` - 较小值
- **示例**: `x.min(y)` 或 `ExpantaNum.min(x, y)`

#### `max()` / `maximum()`
- **描述**: 返回当前ExpantaNum和另一个值中的较大值
- **参数**: `other` (ExpantaNum | number | string) - 要比较的值
- **返回值**: `ExpantaNum` - 较大值
- **示例**: `x.max(y)` 或 `ExpantaNum.max(x, y)`

#### `clone()`
- **描述**: 创建当前ExpantaNum的副本
- **参数**: 无
- **返回值**: `ExpantaNum` - 副本
- **示例**: `x.clone()`

#### `normalize()`
- **描述**: 规范化内部表示（确保数组格式正确）
- **参数**: 无
- **返回值**: `ExpantaNum` - 规范化后的对象
- **示例**: `x.normalize()`
- **注意**: 通常不需要直接调用，内部使用

#### `standardize()`
- **描述**: 标准化内部表示（已弃用，使用normalize）
- **参数**: 无
- **返回值**: `ExpantaNum` - 标准化后的对象
- **示例**: `x.standardize()`
- **注意**: 已弃用，将在未来版本中移除

#### `getOperator()`
- **描述**: 获取指定索引的操作符值
- **参数**: `index` (number) - 操作符索引
- **返回值**: `number` - 操作符值
- **示例**: `x.getOperator(1)`
- **注意**: 内部使用，用于访问数组表示

#### `setOperator()`
- **描述**: 设置指定索引的操作符值
- **参数**: 
  - `index` (number) - 操作符索引
  - `value` (number) - 操作符值
- **返回值**: 无（修改当前对象）
- **示例**: `x.setOperator(1, 100)`
- **注意**: 内部使用，用于修改数组表示

#### `operator()`
- **描述**: 获取或设置操作符值
- **参数**: 
  - `index` (number) - 操作符索引
  - `value` (number, 可选) - 要设置的值（如果提供则设置，否则获取）
- **返回值**: `number` 或 `undefined` - 操作符值或undefined（设置时）
- **示例**: `x.operator(1)` 获取，`x.operator(1, 100)` 设置
- **注意**: 内部使用

## 静态方法

### 创建和转换方法

#### `ExpantaNum.fromNumber()`
- **描述**: 从JavaScript数字创建ExpantaNum
- **参数**: `input` (number) - 输入数字
- **返回值**: `ExpantaNum` - 创建的ExpantaNum实例
- **示例**: `ExpantaNum.fromNumber(123)`

#### `ExpantaNum.fromBigInt()`
- **描述**: 从BigInt创建ExpantaNum
- **参数**: `input` (bigint) - 输入BigInt
- **返回值**: `ExpantaNum` - 创建的ExpantaNum实例
- **示例**: `ExpantaNum.fromBigInt(123n)`

#### `ExpantaNum.fromString()`
- **描述**: 从字符串创建ExpantaNum
- **参数**: `input` (string) - 输入字符串
- **返回值**: `ExpantaNum` - 创建的ExpantaNum实例
- **示例**: `ExpantaNum.fromString("1e100")`

#### `ExpantaNum.fromArray()`
- **描述**: 从数组创建ExpantaNum
- **参数**: 
  - `array` (Array) - 数组表示
  - `sign` (number, 可选) - 符号，默认为1
  - `layer` (number, 可选) - 层，默认为0
- **返回值**: `ExpantaNum` - 创建的ExpantaNum实例
- **示例**: `ExpantaNum.fromArray([[0, 100], [1, 1]])`

#### `ExpantaNum.fromObject()`
- **描述**: 从对象创建ExpantaNum
- **参数**: `input` (object) - 输入对象（包含array, sign, layer属性）
- **返回值**: `ExpantaNum` - 创建的ExpantaNum实例
- **示例**: `ExpantaNum.fromObject({array: [[0, 100]], sign: 1, layer: 0})`

#### `ExpantaNum.fromJSON()`
- **描述**: 从JSON字符串或对象创建ExpantaNum
- **参数**: `input` (string | object) - JSON字符串或对象
- **返回值**: `ExpantaNum` - 创建的ExpantaNum实例
- **示例**: `ExpantaNum.fromJSON('{"array":[[0,100]],"sign":1,"layer":0}')`

#### `ExpantaNum.fromHyperE()`
- **描述**: 从Hyper-E表示法字符串创建ExpantaNum
- **参数**: `input` (string) - Hyper-E表示法字符串
- **返回值**: `ExpantaNum` - 创建的ExpantaNum实例
- **示例**: `ExpantaNum.fromHyperE("E100#1#2")`

### 配置方法

#### `ExpantaNum.config()` / `ExpantaNum.set()`
- **描述**: 配置全局设置
- **参数**: `obj` (object) - 配置对象（包含maxOps, serializeMode, debug等属性）
- **返回值**: `ExpantaNum` - ExpantaNum构造函数
- **示例**: `ExpantaNum.config({maxOps: 2000})`

#### `ExpantaNum.clone()`
- **描述**: 创建具有相同配置的新ExpantaNum构造函数
- **参数**: `obj` (object, 可选) - 可选的配置覆盖
- **返回值**: `function` - 新的ExpantaNum构造函数
- **示例**: `const MyExpantaNum = ExpantaNum.clone()`

## 注意事项

1. **性能考虑**: 对于极大数字，操作可能较慢，建议合理设置maxOps
2. **内存使用**: 内部数组表示可能占用较多内存
3. **精度损失**: 极大数字的运算可能存在精度损失
4. **兼容性**: 需要支持ES6+的浏览器或Node.js环境
5. **调试**: 可以通过设置debug级别来查看操作日志

## 版本信息

基于ExpantaNum.js库（版本信息见原始文件头注释）

---
*文档最后更新: 2025-12-29*
