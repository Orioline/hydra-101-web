# ![ExpantaNum.js]

A huge number library holding up to {10,9e15,1,2}.

This reaches level f<sub>ω+1</sub>, which the operation [expansion](https://googology.wikia.org/wiki/Expansion) also is at, hence the name.

Internally, it is represented as an sign, array, and layer. Sign is 1 or -1. Array is \[\[a<sub>0</sub>,b<sub>0</sub>],\[a<sub>1</sub>,b<sub>1</sub>],\[a<sub>2</sub>,b<sub>2</sub>],\[a<sub>3</sub>,b<sub>3</sub>],...]. Layer is a non-negative integer. They together represents sign\*J<sup>layer</sup>topLayer, where Jx is 10{x}10 (PsiCubed2's Letter notation), and topLayer is:

* (...(10↑<sup>a<sub>3</sub></sup>)<sup>b<sub>3</sub></sup>(10↑<sup>a<sub>2</sub></sup>)<sup>b<sub>2</sub></sup>(10↑<sup>a<sub>1</sub></sup>)<sup>b<sub>1</sub></sup>b<sub>0</sub>) if a<sup>0</sup>=0.
* (...(10↑<sup>a<sub>3</sub></sup>)<sup>b<sub>3</sub></sup>(10↑<sup>a<sub>2</sub></sup>)<sup>b<sub>2</sub></sup>(10↑<sup>a<sub>1</sub></sup>)<sup>b<sub>1</sub></sup>(10↑<sup>a<sub>0</sub></sup>)<sup>b<sub>0</sub></sup>10) otherwise.

Functions are as follows: `abs, neg, cmp, gt, gte, lt, lte, eq, neq, cmp_tolerance, gt_tolerance, gte_tolerance, lt_tolerance, lte_tolerance, eq_tolerance, neq_tolerance, min, max, ispos, isneg, isNaN, isFinite, isint, floor, ceiling, round, add, sub, mul, div, rec, mod, gamma, fact, pow, exp, sqrt, cbrt, root, log10, logBase, log(alias ln), lambertw, tetr, iteratedexp, iteratedlog, layeradd, layeradd10, ssrt, linear_sroot, slog, pent, arrow, chain, hyper, expansion, affordGeometricSeries, affordArithmeticSeries, sumGeometricSeries, sumArithmeticSeries, choose`. Of course, there are `toNumber()`, `toString()` (`toValue`, `toStringWithDecimalPlaces`, `toExponential`, `toFixed`, `toPrecision`), and `toJSON()`. Add ~~one of a kind~~ `toHyperE()`.

If you are using built-in constants: Constants can not be replaced directly, however **the properties of it can. As the constants are also used inside ExpantaNum.js, modifying them could CAUSE SERIOUS ISSUES AND POTENTIALLY RENDER THE LIBRARY UNUSABLE.**
