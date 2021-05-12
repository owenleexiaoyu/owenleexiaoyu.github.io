---
title: 数据结构与算法——用 Java 实现排序算法
categories: 笔试面试
tags: ["数据结构与算法"]
date: 2018-09-12 21:06
thumbnail: http://image.wufazhuce.com/FlqR0LW7KiHs618Adnikw6XZQaXw
---

#### 1. 直接插入排序

直接插入排序由 n-1 趟排序组成。第 p 趟排序后保证第 0 个位置到第 p 个位置的元素为有序。第 p+1 趟是将第 p+1 个位置上的元素插入到前面的有序序列中。

**算法描述：**

进行第 p+1 趟排序时，要将 data[p+1] 插入到前面的有序序列中，首先用一个临时变量 temp 保存 data[p+1]，然后将 temp 和 data[p] 比较，如果 temp 更小，则将 data[p] 移动到 data[p+1]，继续将 temp 与 data[p-1] 进行比较，如果 temp 更小，则将 data[p-1] 移动到 data[p]，重复这个过程，直到 temp 不小于 data[i]（或者 data[0]...data[p] 都向后移动），则将temp的值赋给data[i+1]。

**图解示意：**

![img1.png](https://i.loli.net/2019/08/29/oqi4U2reG7sF9Bn.jpg)

**代码实现：**

```java
	/**
	 * 插入排序
	 * @param data
	 */
	public static void insertSort(int [] data){
		for(int i = 1; i< data.length;i++){
			int temp = data[i];
			int j;
			for(j = i - 1; j >= 0 && data[j] > temp;j--){
				data[j+1] = data[j];
			}
			data[j+1] = temp;
		}
	}
```

**复杂度与稳定性：**

直接插入排序主要应用比较和移动两种操作。

从空间上看，它需要 1 个元素的辅助空间，用于位置交换，空间复杂度为**O(1)**。

从时间上看，遍历一遍的时间复杂度是 O(n)，需要遍历 n-1 次，因此时间复杂度是 **O(n^2)**。

由于直接插入排序的元素移动是顺序的，所以该算法是**稳定**的。

#### 2. 折半插入排序

我们知道，在直接插入排序中，进行第 p+1 趟排序时，要将 data[p+1] 插入到前面的有序序列中。因为前面是排好序的有序序列，所以可以用折半查找（二分法）来确定最后 temp 所在的位置。

使用折半查找可以大大提高查找速度。

![img2.png](https://i.loli.net/2019/08/29/OkZqtpPTLchCjef.jpg)

**代码实现：**

```
	public static void halfInsertSort(int [] data){
		int left,right,mid;
		for(int i = 1;i<data.length;i++){
			int temp = data[i];
			left = 0;
			right = i -1;
			while(left <= right){
				mid = (left+right)/2;
				if(data[mid]>temp){
					right = mid - 1;
				}else{
					left = mid + 1;
				}
			}
			for(int j = i-1;j >= left;j--){
				data[j+1] = data[j];
			}
			data[left] = temp;
		}
	}
```

**复杂度与稳定性：**

空间复杂度为 **O(1)**。

折半查找只是减少了比较次数，但是元素的移动次数不变，折半插入排序平均时间复杂度为 **O(n^2)**。

是**稳定**的排序算法。

#### 3. 希尔排序

希尔排序的实质是分组插入排序。

该方法的基本思想是：先将整个待排元素序列分割成若干个子序列（由相隔某个「增量」的元素组成的）分别进行直接插入排序，然后依次缩减增量再进行排序，待整个序列中的元素基本有序（增量足够小）时，再对全体元素进行一次直接插入排序。因为直接插入排序在元素基本有序的情况下（接近最好情况），效率是很高的，因此希尔排序在时间效率上比前两种方法有较大提高。

**图解示意：**

![img3.png](https://i.loli.net/2019/08/29/gGP13NUp4METv5r.jpg)

**代码实现：**

```
	public static void shellSort(int [] data){
		int d = data.length / 2;
		while(d >= 1){
			for(int k = 0; k <d;k++){
				for(int i = k+d;i<data.length;i += d){
					int temp = data[i];
					int j = i - d;
					while(j>=k && data[j]>temp){
						data[j+d] = data[j];
						j -= d;
					}
					data[j+d] = temp;
				}
			}
			d = d/2;
		}
	}
```

**复杂度与稳定性：**

希尔排序的时间复杂度大致为 **O(n^1.3)**。

希尔排序**不是稳定的**。

#### 4. 冒泡排序

冒泡排序的基本思想是，对相邻的元素进行两两比较，顺序相反则进行交换，这样，每一趟会将最小或最大的元素“浮”到顶端，最终达到完全有序。

对于一个长度为n的序列，需要执行n-1趟排序。

**图解示意：**

![img4.png](https://i.loli.net/2019/08/29/yP9bGmDYNMxEofW.jpg)

**代码实现：**

在冒泡排序的过程中，如果某一趟执行完毕，没有做任何一次交换操作，比如数组[5,4,1,2,3]，执行了两次冒泡，也就是两次外循环之后，分别将5和4调整到最终位置[1,2,3,4,5]。此时，再执行第三次循环后，一次交换都没有做，这就说明剩下的序列已经是有序的，排序操作也就可以完成了。

```
	public static void bubbleSort(int [] data){
		int n = data.length;
		for(int i = 0; i<n-1;i++){
			//设定一个是否交换标记，若为false
			//则表示此次循环没有进行交换，也就是待排序列已经有序，排序已然完成。
			boolean flag = false;
			for(int j = 0;j<n-1-i;j++){
				if(data[j+1] < data[j]){
					int temp = data[j];
					data[j] = data[j+1];
					data[j+1] = temp;
					flag = true;
				}
			}
			if(!flag){
				break;
			}
		}
	}
```

**复杂度与稳定性：**

冒泡排序的效率和待排序列的初始顺序有关，如果若原数组本身就是有序的（这是最好情况），仅需 n-1 次比较就可完成，不用交换；若是倒序，比较次数为 n-1+n-2+...+1=n(n-1)/2，交换次数和比较次数等值。所以，其时间复杂度依然为 **O(n^2)**。

冒泡排序只进行元素间的顺序移动，所以是**稳定**的排序算法。

#### 5. 快速排序

快速排序和希尔排序一样，都是基于”分治法“思想的。快速排序可谓是名副其实，在实际应用中，它几乎是最快的排序算法。

**算法步骤：**

快速排序算法主要由以下 3 个步骤组成：

1. **分割：**取序列中的一个元素为轴元素，将序列分为 3 段，使得所有小于或等于轴的元素放在轴的左边，大于轴的元素放在轴的右边。此时，轴元素已经在序列的正确位置了。

2. **分治：**对轴元素左边和右边的序列递归调用1过程，分别对左边和右边元素进行排序。
3. **合并：**对于快排来说，所有元素都已被放在正确的位置，因此合并过程不需要其他操作。

**图解示意：**

![img5.png](https://i.loli.net/2019/08/29/pEdwLciCBg6bJYl.jpg)

**算法实现1：**

快排可以有两种具体的实现方式，一种是左右交替赋值，一种是左右同时交换。下面分别来看看：

左右交替赋值是，首先用一个临时变量对轴元素进行备份。取 i，j 两个指针，初始值是待排序列两端的下标，i 指向序列最左端下标，j 指向序列最右端下标。在整个排序过程中保证 i 不大于 j。

然后开始移动：

首先从 j 所指位置向左搜索，找到第一个小于或等于轴的元素，把这个元素移动到 i 的位置上。

再从 i 所指位置向右搜索，找到第一个大于轴的元素，把这个元素移动到 j 的位置上。

（这就是左右交替赋值）

重复上述过程，直到 i = j，最后把轴元素放在 i 所指位置。
这时，i 位置就是轴元素的正确位置，之后对 i 位置左右两边使用递归，对左右序列分别排序。

![img6.png](https://i.loli.net/2019/08/29/PRypaem4iLC2uHJ.jpg)

**代码实现1：**

```
	/**
	 * 快速排序算法实现1：左右交替赋值
	 * @param data
	 * @param left
	 * @param right
	 * @return
	 */
	public static void quickSort1(int [] data, int left, int right){
		//递归结束条件
		if(left >= right){
			return;
		}
		//存储轴元素的值
		int temp = data[left];
		int i = left;
		int j = right;
		
		while(i < j){
			while(i < j && data[j] > temp){
				j--;
			}
			data[i] = data[j];
			while(i < j && data[i] <= temp){
				i++;
			}
			data[j] = data[i];
		}
		//将轴元素移动到正确的位置
		data[i] = temp;
		//使用递归分别对轴元素左右两边的序列进行快速排序
		quickSort1(data, left, i-1);
		quickSort1(data, i+1, right);
	}
```

**算法实现2：**

第二种实现，是左右同时交换。

先从右往左找一个小于或等于轴的元素，再从左往右找一个大于轴的元素，然后交换他们。

具体过程如下图所示，非常清晰易懂：

![img7.png](https://i.loli.net/2019/08/29/WZwQyTMlvXh3igG.jpg)

![img8.png](https://i.loli.net/2019/08/29/jsu18adweGP2RgJ.jpg)

![img9.png](https://i.loli.net/2019/08/29/KvVwtNAhl164y9E.jpg)

![img10.png](https://i.loli.net/2019/08/29/Tz3rAgDCFLx9owH.jpg)

上面过程完成后，轴元素放在正确的位置上了，之后就和方法 1 一样，使用递归对轴左右两边进行排序。

**代码实现2：**

```	
	/**
	 * 快速排序算法实现2：左右同时交换
	 * @param data
	 * @param left
	 * @param right
	 */
	public static void quickSort2(int [] data, int left, int right){
		//如果left指针大于right指针，则已经有序，直接返回
		if(left > right){
			return;
		}
		//存储轴元素
		int temp = data[left];
		int i = left;
		int j = right;
		while(i != j){
			while(i < j && data[j]>temp)
				j--;
			while(i < j && data[i] <= temp)
				i++;
			if(i < j){
				int t = data[i];
				data[i] = data[j];
				data[j] = t;
			}
		}
		//将轴元素移动到正确的位置
		data[left] = data[i];
		data[i] = temp;
		//使用递归分别对轴元素左右两边的序列进行快速排序
		quickSort2(data, left, i-1);
		quickSort2(data, i+1, right);
	}
```

**复杂度与稳定性：**

快速排序的最坏情况是输入序列有序时，每次分割都将轴元素划分在序列的一端。最坏情况下，快速排序和直接插入排序、冒泡排序一样差，最坏的时间复杂度是 **O(n^2)**。

最好情况是每次分割都是最平衡的，也就是每次分割后左右两个序列的长度基本一致，最好的时间复杂度是 **O(nlogn)**。

快速排序算法的空间开销主要是递归调用时所使用的栈，与递归调用的栈的深度成正比，故最好的空间复杂度为 **O(logn)**，最坏的空间复杂度为 **O(n)**。

快速排序是一种**不稳定**的算法。

#### 6. 简单选择排序

简单选择排序是最简单直观的一种排序算法，基本思想是**在当前待排序列中选取最小的元素作为待排序列的第 1 个元素**。对于 n 个元素的序列，需要经过 n-1 次的选择。

**图解示意：**

![img11.png](https://i.loli.net/2019/08/29/bzQDNUXaLGdFP2R.jpg)

**代码实现：**

```
	public static void selectSort(int [] data){
		for(int i = 0;i < data.length - 1;i++){
			int minIndex = i;
			for(int j = i+1;j<data.length;j++){
				if(data[j] < data[minIndex]){
					minIndex = j;
				}
			}
			if(minIndex != i){
				int temp = data[i];
				data[i] = data[minIndex];
				data[minIndex] = temp;
			}
		}
	}
```

**复杂度与稳定性：**

简单选择排序的时间复杂度是 O(n^2)，空间复杂度为 O(1)。

简单选择排序算法是**不稳定**的。

#### 7. 堆排序

堆排序是利用**堆**这种数据结构而设计的一种排序算法，堆排序是一种选择排序。

堆是具有以下性质的完全二叉树：每个结点的值都大于或等于其左右孩子结点的值，称为最大堆（大顶堆）；或者每个结点的值都小于或等于其左右孩子结点的值，称为最小堆（小顶堆）。

![351.png](https://i.loli.net/2019/08/30/F7mDHpOTnILhyYb.png)

完全二叉树可以使用数组来进行存储。对堆中的结点按层进行编号，将这种逻辑结构映射到数组中。

![355.png](https://i.loli.net/2019/08/30/WhrSIBcaTP34Qfd.png)

堆排序算法就是用最大堆来得到最大元素，也就是堆根节点的值。

具体步骤为：

**1. 将给定无序序列构造成一个最大堆（一般升序采用最大堆，降序采用最小堆)。**                                               

a. 假设给定无序序列结构如下

![365.png](https://i.loli.net/2019/08/30/1m3RixuCTEsdDF4.png)

b. 从最后一个非叶子结点开始（叶结点自然不用调整）从左至右，从下至上进行调整。

![369.png](https://i.loli.net/2019/08/30/3eClOvGwKmAWcQJ.png)

![img13.png](https://i.loli.net/2019/08/29/GnaCDu9YNr2RicL.jpg)

![img14.png](https://i.loli.net/2019/08/29/HwjiBW9KuD8Pskc.jpg)

此时，我们就将一个无序序列构造成了一个最大堆，最大堆的根节点的值是序列中的最大值。

**2. 将堆顶元素与末尾元素进行交换，使末尾元素最大。然后继续调整堆，再将堆顶元素与末尾元素交换，得到第二大元素。**

![img15.png](https://i.loli.net/2019/08/29/IWNLEtOBHhPfday.jpg)

![img16.png](https://i.loli.net/2019/08/29/ZuQf3L8etRy54DE.jpg)

![img17.png](https://i.loli.net/2019/08/29/nfDOkwHGeqhzpoY.jpg)

**3. 继续进行调整，交换，如此反复进行，最终使得整个序列有序。**

![img18.png](https://i.loli.net/2019/08/29/rD5WMRysnxhZzvi.jpg)

**代码实现：**

```
	/**
	 * 堆排序算法
	 * @param data
	 */
	public static void heapSort(int [] data){
		buidHeap(data);
		for(int i = data.length-1;i>0;i--){
			int temp = data[0];
			data[0] = data[i];
			data[i] = temp;
			adjustHeap(data, 0, i);
		}
	}
	
	/**
	 * 构建最大堆
	 * @param data
	 */
	public static void buidHeap(int [] data){
		for(int i = data.length/2 -1;i >= 0;i--){
			adjustHeap(data, i, data.length);
		}
	}
	/**
	 * 调整堆
	 * @param data
	 * @param i
	 * @param length
	 */
	public static void adjustHeap(int [] data, int i, int length){
		int left = 2*i+1;
		int right = 2*i+2;
		int minIndex = i;
		//和左孩子进行比较
		if(left < length && data[minIndex] <data[left]){
			minIndex = left;
		}
		//和右孩子进行比较
		if(right < length && data[minIndex] < data[right]){
			minIndex = right;
		}
		//判断是否需要调整
		if(minIndex != i){
			int temp = data[minIndex];
			data[minIndex] = data[i];
			data[i] = temp;
			adjustHeap(data, minIndex, length); //递归对子节点进行调整
		}
	}
```

**复杂度与稳定性：**

堆排序的最坏，最好，平均时间复杂度均为 **O(nlogn)**。

堆排序是**不稳定**排序。

**海量数据的 Top N 排序中可以使用堆排序**

#### 8. 归并排序

归并排序和快速排序类似，都是利用分治思想设计的排序算法。与快排不同的是，归并排序使问题的划分策略尽可能简单，着重于合并两个已排好序的序列。

如果一个序列只有一个元素，则它是有序的，不用执行任何操作。否则，归并排序按照如下递归步骤进行排序：

1. 先把序列划分为长度基本相等的子序列
2. 对每个子序列归并排序
3. 把排好序的子序列合并为最后的结果

第3步将两个子序列合并为一个有序序列，就是归并过程。假设有子序列 A、B，将其合并为序列 C。用到的方法很简单：把 A、B 的最小元素进行比较，把其中较小的作为 C 的第一个元素；在 A、B 剩余元素中继续挑选最小的元素进行比较，确定 C 的第二个元素，依次类推，直到 A 或 B 的所有元素都被添加到 C 中，此时将余下的元素直接添加到 C 的最后面，就可以完成对 A、B 的归并。
 
由于 A 和 B 都已经排好序了，每次挑选最小元素时，只需要比较 A 和 B 最前面的元素即可。

**图解示意：**

![img19.png](https://i.loli.net/2019/08/29/P3xHcnkJwzOXuhV.jpg)

![img20.png](https://i.loli.net/2019/08/29/ArkjwRGN6MyBtIq.jpg)

**代码实现：**

```
	/**
	 * 归并排序
	 * @param data
	 */
	public static void mergeSort(int [] data){
		mergeSort(data, 0, data.length - 1);
	}
	
	/**
	 * 利用递归进行序列划分
	 * @param data
	 * @param left
	 * @param right
	 */
	private static void mergeSort(int [] data, int left, int right){
		if(left < right){
			int mid = (left + right)/2;
			mergeSort(data, left, mid);
			mergeSort(data, mid+1, right);
			merge(data, left, mid, right);
		}
	}

	/**
	 * 将两个子序列归并
	 * @param data
	 * @param left
	 * @param mid
	 * @param right
	 */
	private static void merge(int[] data, int left, int mid, int right) {
		int len1 = mid - left + 1;
		int len2 = right - mid;
		
		int [] a = new int [len1];      //临时数组用于存放左边数据
		int [] b = new int [len2];      //临时数据用于存放左边数据
		
		for(int i = 0; i<len1;i++){
			a[i] = data[left+i];
		}
		for(int i = 0;i<len2;i++){
			b[i] = data[mid+1+i];
		}
		int i = 0;
		int j = 0;
		int k;
		for(k = left; k < right;k++){
			if(i == len1 || j == len2){
				break;
			}
			if(a[i] <= b[j]){
				data[k] = a[i++];
			}else{
				data[k] = b[j++];
			}
		}
		//如果左边还有数据，则加到data的后面
		while(i < len1){
			data[k++] = a[i++];	
		}
		//如果右边还有数据，则加到data的后面
		while(j < len2){
			data[k++] = b[j++];
		}
	}
```

**复杂度与稳定性：**

归并排序的最坏情况下的时间复杂度为 **O(nlogn)**，在执行归并过程中，需要额外 **O(n)** 的辅助空间。

归并排序是一个**稳定**的算法。

由于需要额外申请辅助空间，实际应用中，归并排序的效果往往没有快速排序好。

#### 各类排序算法性能比较

![img21.png](https://i.loli.net/2019/08/29/71KCpWDkFOL9MNs.jpg)

#### 参考资料

[经典排序算法（4）——折半插入排序算法详解](https://blog.csdn.net/guoweimelon/article/details/50904206)

[图解排序算法(二)之希尔排序](https://www.cnblogs.com/chengxiao/p/6104371.html)

[白话经典算法系列之三 希尔排序的实现](https://blog.csdn.net/MoreWindows/article/details/6668714)

[图解排序算法(一)之3种简单排序(选择，冒泡，直接插入)](https://www.cnblogs.com/chengxiao/p/6103002.html)

[图解排序算法(三)之堆排序](https://www.cnblogs.com/chengxiao/p/6129630.html) 

[图解排序算法(四)之归并排序](https://www.cnblogs.com/chengxiao/p/6194356.html)

