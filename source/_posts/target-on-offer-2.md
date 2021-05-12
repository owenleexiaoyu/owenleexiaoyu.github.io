---
title: 剑指Offer系列（2）
tags: ["剑指Offer", "算法"]
categories: 笔试面试
date: 2018-06-07 16:57:00
thumbnail: http://image.wufazhuce.com/Fs0VrR0of4GpJb1LGMIP7X7xQ0_G
---
 
##### 7. 斐波那契数列

描述：
大家都知道斐波那契数列，现在要求输入一个整数n，请你输出斐波那契数列的第n项。n<=39

分析：
这题就是常规的求斐波那契数列第n项的值，可以使用递归来求解。

```
public class Solution {
    public int Fibonacci(int n) {
    	if(n <1){
    		return 0;
    	}else if(n < 3){
    		return 1;
    	}else{
    		return Fibonacci(n -2) +Fibonacci(n-1);
    	}
    }
}
```

##### 8. 跳台阶

描述：
一只青蛙一次可以跳上1级台阶，也可以跳上2级。求该青蛙跳上一个n级的台阶总共有多少种跳法。

分析：
对于n = 1，只有一种跳法（1）
对于n = 2，有两种跳法（1，1；2）
对于n>2的情况，以n = 3为例，它要么选择从第2个台阶跳一个台阶到达，要么选择从第1个台阶跳两个台阶到达。所以n = 3时，应该是n = 1的跳法加上n = 2的跳法。
推广到其他>2的情况n，要么选择从第n-1个台阶跳一个台阶到达，要么选择从第n-2个台阶跳两个台阶到达。所以应该是n - 1的跳法加上n - 2的跳法。
即当n>2时，**JumpFloor(n) = JumpFloor(n -1) + JumpFloor(n-2)；**

```
public class Solution {
    public int JumpFloor(int target) {
        if(target <= 0){
        	return 0;
        }else if(target < 3){
        	return target;
        }else{
        	return JumpFloor(target -1) + JumpFloor(target -2);
        }
    }
}
```

##### 9. 变态跳台阶

描述：
一只青蛙一次可以跳上1级台阶，也可以跳上2级……它也可以跳上n级。求该青蛙跳上一个n级的台阶总共有多少种跳法。

**分析：**
这道题和上题条件上有了一点变化，青蛙一次可以跳1、2、、、n个台阶。
和上一题一样，从最简单的情况分析：
当n = 1时，只有1种跳法（1）
当n = 2时，它可以选择从第1个台阶跳1个台阶到达，也可以选择从第0个台阶（地面，便于理解）直接跳2个台阶到达。
当n = 3时，它可以选择从第2个台阶跳1个台阶到达，或者选择从第1个台阶跳2个台阶到达，或者选择从第0个台阶直接跳3个台阶到达。

由此可以找到规律：台阶数为n时，跳法是小于n的台阶的跳法之和，再加最后从地面直接跳n个台阶到达的1种。
即：f(n) = f(n-1)+f(n-2)+...+f(1) +1
由:
n = 1, f(n) = 1;
n = 2, f(n) = 2;
n = 3, f(n) = 4;
n = 4, f(n) = 8;
可以看出，f(n) = 2* f(n-1);
这样我们就可以使用递归来解决这道题了。

```
public class Solution {
    public int JumpFloorII(int target) {
        if(target <= 0){
        	return 0;
        }else if(target < 2){
        	return target;
        }else{
        	return JumpFloorII(target -1) *2;
        }
    }
}
```

##### 10. 矩阵覆盖

描述：
我们可以用2*1的小矩形横着或者竖着去覆盖更大的矩形。请问用n个2*1的小矩形无重叠地覆盖一个2*n的大矩形，总共有多少种方法？

**分析：**
这道题和跳台阶的题是一模一样的，同样是斐波那契数列的应用。

![](https://i.loli.net/2018/11/06/5be188bf702ab.jpg)

如图所示，一个红色的小矩形代表一个2*1的小矩阵，黑色的大矩形代表2*n的大矩阵。
如果将大矩阵如图所示放置，可以对照跳台阶中的n层的台阶；
一个横置小矩阵（第二个图形），就相当于跳台阶中，青蛙一次跳一个台阶；
将两个小矩阵并排竖置（第三个图形），就相当于跳台阶中，青蛙一次跳了两个台阶。

经过这样的对照，可以发现两个问题是一模一样的，那么解法同样是一样的。

```
public class Solution {
    public int RectCover(int target) {
        if(target <= 0){
        	return 0;
        }else if(target < 3){
        	return target;
        }else{
        	return RectCover(target -1) + RectCover(target -2);
        }
    }
}
```

##### 11. 二进制中1的个数

描述：
输入一个整数，输出该数二进制表示中1的个数。其中负数用补码表示。

分析：
> 思想：用1（1自身左移运算，其实后来就不是1了）和n的每位进行位与，来判断1的个数
> 
> 1的二进制是前面都是0，最后一位为1，也就是只有一个1，每次向左移位一下，使得flag的二进制表示中始终只有一个位为1，每次与n做位与操作，这样就相当于逐个检测n的每一位是否是1了。

```
public class Solution {
    public int NumberOf1(int n) {
    	int count = 0;
    	int flag = 1;
    	while(flag != 0){
    		if((n & flag) != 0){
    			count++;
    		}
    		flag = flag << 1;
    	}
    	return count;
    }
}
```

**最优解及分析：**

```
public class Solution {
    public int NumberOf1(int n) {
        int count = 0;
        while(n!= 0){
            count++;
            n = n & (n - 1);
         }
        return count;
    }
}
```

> 链接：https://www.nowcoder.com/questionTerminal/8ee967e43c2c4ec193b040ea7fbb10b8
来源：牛客网

>分析一下代码： 这段小小的代码，很是巧妙。
如果一个整数不为0，那么这个整数至少有一位是1。如果我们把这个整数减1，那么原来处在整数最右边的1就会变为0，原来在1后面的所有的0都会变成1(如果最右边的1后面还有0的话)。其余所有位将不会受到影响。
举个例子：一个二进制数1100，从右边数起第三位是处于最右边的一个1。减去1后，第三位变成0，它后面的两位0变成了1，而前面的1保持不变，因此得到的结果是1011.我们发现减1的结果是把最右边的一个1开始的所有位都取反了。这个时候如果我们再把原来的整数和减去1之后的结果做与运算，从原来整数最右边一个1那一位开始所有位都会变成0。如1100&1011=1000.也就是说，把一个整数减去1，再和原整数做与运算，会把该整数最右边一个1变成0.那么一个整数的二进制有多少个1，就可以进行多少次这样的操作。

##### 12. 数值的整数次方

描述：
给定一个double类型的浮点数base和int类型的整数exponent。求base的exponent次方。

分析：
这里要注意的是exponent可以为负值，比如(1.3)^-2就等价于1/(1.3)^2。所以可以先求出exponent的绝对值，先求出result = base^|exponent|，如果exponent为负数，result = 1/result。至于求一个数的正数次幂，可以使用循环来实现。

```
public class Solution {
    public double Power(double base, int exponent) {
    	double result = 1;
    	int exp = Math.abs(exponent);
    	if(exponent == 0){
    		return 1;
    	}
    	while(exp > 0){
    		result *= base;
    		exp--;
    	}
    	if(exponent > 0){
    		return result;
    	}else{
    		return 1/result;
    	}
    }
}
```

