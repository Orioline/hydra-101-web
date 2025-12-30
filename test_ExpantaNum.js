/**
 * ExpantaNum.js 测试用例
 * 测试大数加法、乘法、次方等运算的正确性
 * 使用原生JavaScript方法，不引入外部测试框架
 */

// 测试配置
const TEST_CONFIG = {
    verbose: true,      // 详细输出
    stopOnError: false  // 遇到错误是否停止
};

// 测试统计
let testStats = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
};

// 测试辅助函数
function test(description, testFunction) {
    testStats.total++;
    try {
        testFunction();
        testStats.passed++;
        if (TEST_CONFIG.verbose) {
            console.log(`✓ ${description}`);
        }
    } catch (error) {
        testStats.failed++;
        testStats.errors.push({
            description,
            error: error.message
        });
        console.error(`✗ ${description}`);
        console.error(`  错误: ${error.message}`);
        if (TEST_CONFIG.stopOnError) {
            throw error;
        }
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "断言失败");
    }
}

function assertEqual(actual, expected, message) {
    const actualStr = actual.toString();
    const expectedStr = expected.toString();
    if (actualStr !== expectedStr) {
        throw new Error(`${message || "值不相等"}\n  实际: ${actualStr}\n  期望: ${expectedStr}`);
    }
}

function assertApprox(actual, expected, tolerance, message) {
    // 对于大数，使用容差比较
    const diff = actual.sub(expected).abs();
    const max = actual.abs().max(expected.abs());
    if (diff.gt(max.mul(tolerance))) {
        throw new Error(`${message || "值超出容差范围"}\n  实际: ${actual}\n  期望: ${expected}\n  差异: ${diff}`);
    }
}

// 测试用例：基本运算
function runBasicTests() {
    console.log("\n=== 基本运算测试 ===");
    
    // 测试1: 创建和基本属性
    test("创建数字对象", () => {
        const n1 = new ExpantaNum(123);
        const n2 = new ExpantaNum("456");
        const n3 = new ExpantaNum("1e100");
        
        assert(n1 instanceof ExpantaNum, "应该是ExpantaNum实例");
        assert(n2 instanceof ExpantaNum, "应该是ExpantaNum实例");
        assert(n3 instanceof ExpantaNum, "应该是ExpantaNum实例");
    });
    
    // 测试2: 加法
    test("普通数字加法", () => {
        const a = new ExpantaNum(123);
        const b = new ExpantaNum(456);
        const result = a.add(b);
        assertEqual(result, new ExpantaNum(579), "123 + 456 应该等于 579");
    });
    
    test("大数加法", () => {
        const a = new ExpantaNum("1e100");
        const b = new ExpantaNum("2e100");
        const result = a.add(b);
        assertEqual(result, new ExpantaNum("3e100"), "1e100 + 2e100 应该等于 3e100");
    });
    
    test("零值加法", () => {
        const a = new ExpantaNum("1e50");
        const zero = new ExpantaNum(0);
        const result1 = a.add(zero);
        const result2 = zero.add(a);
        
        assertEqual(result1, a, "x + 0 应该等于 x");
        assertEqual(result2, a, "0 + x 应该等于 x");
    });
    
    // 测试3: 乘法
    test("普通数字乘法", () => {
        const a = new ExpantaNum(12);
        const b = new ExpantaNum(34);
        const result = a.mul(b);
        assertEqual(result, new ExpantaNum(408), "12 * 34 应该等于 408");
    });
    
    test("大数乘法", () => {
        const a = new ExpantaNum("1e50");
        const b = new ExpantaNum("2e50");
        const result = a.mul(b);
        assertEqual(result, new ExpantaNum("2e100"), "1e50 * 2e50 应该等于 2e100");
    });
    
    test("零值乘法", () => {
        const a = new ExpantaNum("1e100");
        const zero = new ExpantaNum(0);
        const result = a.mul(zero);
        assertEqual(result, zero, "x * 0 应该等于 0");
    });
    
    // 测试4: 次方
    test("整数次方", () => {
        const a = new ExpantaNum(2);
        const b = new ExpantaNum(10);
        const result = a.pow(b);
        assertEqual(result, new ExpantaNum(1024), "2^10 应该等于 1024");
    });
    
    test("小数次方", () => {
        const a = new ExpantaNum(4);
        const b = new ExpantaNum(0.5);
        const result = a.pow(b);
        assertEqual(result, new ExpantaNum(2), "4^0.5 应该等于 2");
    });
    
    test("大数次方", () => {
        const a = new ExpantaNum(10);
        const b = new ExpantaNum(100);
        const result = a.pow(b);
        assertEqual(result, new ExpantaNum("1e100"), "10^100 应该等于 1e100");
    });
}

// 测试用例：循环自加运算（验证加法一致性）
function runAdditionLoopTests() {
    console.log("\n=== 循环自加运算测试 ===");
    
    test("循环自加验证乘法", () => {
        const base = new ExpantaNum(7);
        const count = new ExpantaNum(8);
        let sum = new ExpantaNum(0);
        
        // 通过循环加法计算 7 * 8
        for (let i = 0; i < 8; i++) {
            sum = sum.add(base);
        }
        
        const product = base.mul(count);
        assertEqual(sum, product, "7+7+...+7 (8次) 应该等于 7*8");
    });
    
    test("大数循环自加", () => {
        const base = new ExpantaNum("1e50");
        const iterations = 100;
        let sum = new ExpantaNum(0);
        
        for (let i = 0; i < iterations; i++) {
            sum = sum.add(base);
        }
        
        const product = base.mul(new ExpantaNum(iterations));
        assertEqual(sum, product, "1e50 自加100次应该等于 1e50 * 100");
    });
    
    test("自加交换律验证", () => {
        const a = new ExpantaNum("1e100");
        const b = new ExpantaNum("2e100");
        
        const result1 = a.add(b);
        const result2 = b.add(a);
        
        assertEqual(result1, result2, "加法应该满足交换律: a+b = b+a");
    });
    
    test("自加结合律验证", () => {
        const a = new ExpantaNum("1e50");
        const b = new ExpantaNum("2e50");
        const c = new ExpantaNum("3e50");
        
        const result1 = a.add(b).add(c);
        const result2 = a.add(b.add(c));
        
        assertEqual(result1, result2, "加法应该满足结合律: (a+b)+c = a+(b+c)");
    });
}

// 测试用例：循环自乘运算（验证次方一致性）
function runMultiplicationLoopTests() {
    console.log("\n=== 循环自乘运算测试 ===");
    
    test("循环自乘验证次方", () => {
        const base = new ExpantaNum(3);
        const exponent = 4;
        let product = new ExpantaNum(1);
        
        // 通过循环乘法计算 3^4
        for (let i = 0; i < exponent; i++) {
            product = product.mul(base);
        }
        
        const power = base.pow(new ExpantaNum(exponent));
        assertEqual(product, power, "3*3*3*3 应该等于 3^4");
    });
    
    test("大数循环自乘", () => {
        const base = new ExpantaNum(10);
        const exponent = 50;
        let product = new ExpantaNum(1);
        
        for (let i = 0; i < exponent; i++) {
            product = product.mul(base);
        }
        
        const power = base.pow(new ExpantaNum(exponent));
        assertEqual(product, power, "10自乘50次应该等于 10^50");
    });
    
    test("自乘交换律验证", () => {
        const a = new ExpantaNum("1e10");
        const b = new ExpantaNum("2e10");
        
        const result1 = a.mul(b);
        const result2 = b.mul(a);
        
        assertEqual(result1, result2, "乘法应该满足交换律: a*b = b*a");
    });
    
    test("自乘结合律验证", () => {
        const a = new ExpantaNum("1e5");
        const b = new ExpantaNum("2e5");
        const c = new ExpantaNum("3e5");
        
        const result1 = a.mul(b).mul(c);
        const result2 = a.mul(b.mul(c));
        
        assertEqual(result1, result2, "乘法应该满足结合律: (a*b)*c = a*(b*c)");
    });
    
    test("分配律验证", () => {
        const a = new ExpantaNum("1e10");
        const b = new ExpantaNum("2e10");
        const c = new ExpantaNum("3e10");
        
        const left = a.mul(b.add(c));
        const right = a.mul(b).add(a.mul(c));
        
        assertEqual(left, right, "乘法对加法应该满足分配律: a*(b+c) = a*b + a*c");
    });
}

// 测试用例：混合运算和边界情况
function runMixedAndEdgeTests() {
    console.log("\n=== 混合运算和边界情况测试 ===");
    
    test("加法与乘法混合", () => {
        const a = new ExpantaNum(2);
        const b = new ExpantaNum(3);
        const c = new ExpantaNum(4);
        
        const result = a.add(b).mul(c);
        const expected = new ExpantaNum(20); // (2+3)*4 = 20
        
        assertEqual(result, expected, "(2+3)*4 应该等于 20");
    });
    
    test("次方与乘法混合", () => {
        const a = new ExpantaNum(2);
        const b = new ExpantaNum(3);
        const c = new ExpantaNum(4);
        
        const result = a.pow(b).mul(c);
        const expected = new ExpantaNum(32); // 2^3 * 4 = 8 * 4 = 32
        
        assertEqual(result, expected, "2^3 * 4 应该等于 32");
    });
    
    test("极大数运算", () => {
        // 测试极大数的基本运算
        const huge1 = new ExpantaNum("10^^3"); // 迭代幂次: 10^10^10
        const huge2 = new ExpantaNum("10^^3");
        
        // 极大数加法
        const sum = huge1.add(huge2);
        assert(sum.gt(huge1), "极大数相加应该大于原数");
        
        // 极大数乘法
        const product = huge1.mul(new ExpantaNum(2));
        assert(product.gt(huge1), "极大数乘以2应该大于原数");
    });
    
    test("特殊值处理", () => {
        // NaN 测试
        const nan = new ExpantaNum(NaN);
        assert(nan.isNaN(), "NaN 应该被识别为 NaN");
        
        // Infinity 测试
        const inf = new ExpantaNum(Infinity);
        assert(inf.isInfinite(), "Infinity 应该被识别为无穷大");
        
        // 零值测试
        const zero = new ExpantaNum(0);
        assert(zero.eq(new ExpantaNum(0)), "0 应该等于 0");
    });
    
    test("负数运算", () => {
        const a = new ExpantaNum(-5);
        const b = new ExpantaNum(3);
        
        // 负数加法
        const sum = a.add(b);
        assertEqual(sum, new ExpantaNum(-2), "-5 + 3 应该等于 -2");
        
        // 负数乘法
        const product = a.mul(b);
        assertEqual(product, new ExpantaNum(-15), "-5 * 3 应该等于 -15");
        
        // 负负得正
        const negProduct = a.mul(new ExpantaNum(-1));
        assertEqual(negProduct, new ExpantaNum(5), "-5 * -1 应该等于 5");
    });
}

// 性能测试：循环运算性能
function runPerformanceTests() {
    console.log("\n=== 性能测试 ===");
    
    test("循环加法性能", () => {
        const startTime = performance.now();
        let sum = new ExpantaNum(0);
        const base = new ExpantaNum("1e100");
        const iterations = 1000;
        
        for (let i = 0; i < iterations; i++) {
            sum = sum.add(base);
        }
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        console.log(`  循环加法 ${iterations} 次耗时: ${duration.toFixed(2)}ms`);
        assert(duration < 5000, `性能测试应在5秒内完成，实际耗时: ${duration}ms`);
    });
    
    test("循环乘法性能", () => {
        const startTime = performance.now();
        let product = new ExpantaNum(1);
        const base = new ExpantaNum(2);
        const iterations = 100;
        
        for (let i = 0; i < iterations; i++) {
            product = product.mul(base);
        }
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        console.log(`  循环乘法 ${iterations} 次耗时: ${duration.toFixed(2)}ms`);
        assert(duration < 5000, `性能测试应在5秒内完成，实际耗时: ${duration}ms`);
    });
}

// 主测试函数
function runAllTests() {
    console.log("开始 ExpantaNum.js 测试...");
    console.log("=".repeat(50));
    
    const startTime = performance.now();
    
    try {
        runBasicTests();
        runAdditionLoopTests();
        runMultiplicationLoopTests();
        runMixedAndEdgeTests();
        runPerformanceTests();
    } catch (error) {
        console.error("测试过程中发生未捕获的错误:", error);
    }
    
    const endTime = performance.now();
    const totalDuration = endTime - startTime;
    
    // 输出测试结果
    console.log("\n" + "=".repeat(50));
    console.log("测试完成!");
    console.log(`总测试数: ${testStats.total}`);
    console.log(`通过: ${testStats.passed}`);
    console.log(`失败: ${testStats.failed}`);
    console.log(`总耗时: ${totalDuration.toFixed(2)}ms`);
    
    if (testStats.failed > 0) {
        console.log("\n失败详情:");
        testStats.errors.forEach((error, index) => {
            console.log(`${index + 1}. ${error.description}`);
            console.log(`   错误: ${error.error}`);
        });
        console.log("\n❌ 测试未完全通过");
    } else {
        console.log("\n✅ 所有测试通过!");
    }
    
    return testStats.failed === 0;
}

// 如果直接运行此文件，则执行测试
if (typeof window !== 'undefined' && window.document) {
    // 浏览器环境
    console.log("在浏览器环境中运行测试...");
    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAllTests);
    } else {
        runAllTests();
    }
} else {
    // Node.js 环境
    console.log("在Node.js环境中运行测试...");
    runAllTests();
}
