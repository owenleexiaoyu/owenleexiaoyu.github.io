---
title: 剑指 Offer 系列（1）
tags: ["算法","剑指Offer"]
categories: 笔试面试
date: 2018-06-06 23:25:23
thumbnail: http://image.wufazhuce.com/Fu772E2deg7UAxpWL8C2qd3T5iDu
---
##### 1.二维数组中的查找

描述：在一个二维数组中，每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。

分析：注意到这个二维数组其实是部分有序的，每行中的数值依次增大，每列中数值依次增大。对于二维数组中的一个数，它上面的数比它小，右面一个数比它大。有了这个关系，可以联想到二叉搜索树的特性，从二叉搜索树的查找中可以找到这个问题比较适合的解法。

```
public class Solution {
    public boolean Find(int target, int [][] array) {
    	
    	int rowCount = array.length;
    	int colCount = array[0].length;
    	int i,j;
    	for(i=rowCount-1,j=0;i>=0&&j<colCount;){
    		//如果相等，直接返回true
    		if(target == array[i][j])
    			return true;
    		//如果target值小于array[i][j]的值，则向上查找
    		if(target < array[i][j]){
    			i--;
    			continue;
    		}
    		//如果target值大于array[i][j]的值，则向右查找
    		if(target > array[i][j]){
    			j++;
    			continue;
    		}
    	}
    	return false;
    }
}
```

##### 2. 替换空格

描述：请实现一个函数，将一个字符串中的空格替换成“%20”。例如，当字符串为We Are Happy.则经过替换之后的字符串为We%20Are%20Happy。

分析：
利用递归，判断传入的str是否包含空格，如果包含，找到第一个空格的位置，替换成“%20”，得到替换后的str，重复上述步骤，直到str中没有空格。

使用Java语言，String 类中的contains()可以判断字符串中是否有空格，indexOf() 可以定位到第一个空格的位置；使用StringBuffer类中的deleteCharAt()、insert()两个方法实现“%20”对空格的替换。

```
public class Solution {
    public String replaceSpace(StringBuffer str) {
        
    	String s = str.toString();
    	//判断字符串中是否包含空格
        if(s.contains(" ")){
	        //获得第一个空格的下标
            int index = s.indexOf(" ");
            //进行替换
            str = str.deleteCharAt(index);
            str = str.insert(index,"%20");
            //把替换后的字符串再传入这个方法，直至字符串中没有空格
            replaceSpace(str);
        }
        s = str.toString();
        return s;
    }
}
```

##### 3. 从尾到头打印链表

描述：输入一个链表，从尾到头打印链表每个节点的值。

分析：这道题比较简单，就是一个链表的遍历，由于链表是从头到尾进行遍历，要实现倒序的输出，这里是借助了ArrayList来进行实现，每次将遍历得到的新结点插入到ArrayList的首位，即可满足要求。

```
import java.util.ArrayList;

public class Solution {
    public ArrayList<Integer> printListFromTailToHead(ListNode listNode) {
        ArrayList<Integer> valueList = new ArrayList<>();
        ListNode n = listNode;
        while(n != null){
	        //将新节点的值插入列表的首位
            valueList.add(0, n.val);
            //正向遍历整个链表
            n = n.next;
        }
        return valueList;
    }
}

class ListNode {
    int val;
    ListNode next = null;
    ListNode(int val) {
        this.val = val;
    }
}
```

##### 4. 重建二叉树

描述：输入某二叉树的前序遍历和中序遍历的结果，请重建出该二叉树。假设输入的前序遍历和中序遍历的结果中都不含重复的数字。例如输入前序遍历序列{1,2,4,7,3,5,6,8}和中序遍历序列{4,7,2,1,5,3,8,6}，则重建二叉树并返回。

分析：这道题是利用二叉树的前序和中序序列重建二叉树。这里可以利用递归的方法，或者说分治的思想。

前序序列的第一个元素是这棵二叉树的根节点，利用结点唯一的值，在中序序列中找到根节点的位置，左边的是根结点的左子树，右边是根节点的右子树。可以通过求左右两边的结点个数在前序序列中划分根节点的左右子树。这样可以得到左子树的前序和中序序列，右子树的前序和中序序列，把左子树前序和中序传入这个函数中得到的返回值是根节点的左孩子，右子树前序和中序传入这个函数中得到的返回值是根节点的右孩子。这样后面的子树就会越来越小，逐渐减小问题规模，分而治之。

```
public class Solution {
    public TreeNode reConstructBinaryTree(int [] pre,int [] in) {
    	TreeNode root = null;
    	//当前根节点左子树中结点个数
    	int leftSize = 0;
    	//当前根节点右子树中节点个数
    	int rightSize = 0;
    	if(pre != null && pre.length >0 || in != null && in.length > 0){
    		//利用前序找到当前的根节点的值
    		root = new TreeNode(pre[0]);
    		//通过根节点的值在中序序列中点位到根节点的位置
    		int index= findValue(pre[0], in);
    		//中序中根节点左边是根节点的左子树
    		leftSize = index;
    		//中序中根节点右边是根节点的右子树
    		rightSize = in.length - index -1;
    		int [] preLeft = null;
    		int [] inLeft = null;
    		int [] preRight = null;
    		int [] inRight = null;
    		//找出当前根节点左子树的前序和中序序列
    		if(leftSize != 0){
    			preLeft = new int[leftSize];
    			inLeft = new int[leftSize];
    			for(int i = 0; i<leftSize; i++){
    				preLeft[i] = pre[i+1];
    				inLeft[i] = in[i];
    			}
    		}
    		//找出当前根节点右子树的前序和中序序列
    		if(rightSize != 0){
    			preRight = new int[rightSize];
    			inRight = new int[rightSize];
    			for(int i = 0; i<rightSize; i++){
    				preRight[i] = pre[leftSize+1+i];
    				inRight[i] = in[leftSize+1+i];
    			}
    		}
    		//当前根节点的左孩子是其左子树的根节点
    		root.left = reConstructBinaryTree(preLeft, inLeft);
    		//当前根节点的右孩子是其右子树的根节点
    		root.right = reConstructBinaryTree(preRight, inRight);
    		return root;
    	}
        return root;
    }
    //简单的遍历算法，查找数组中的某个目标值
    public int findValue(int target, int[] arr){
    	int index = -1;
    	for(int i = 0; i<arr.length; i++){
    		if(target == arr[i]){
    			index = i;
    			break;
    		}
    	}
    	return index;
    }
}

/*
 * 二叉树节点定义
 */
class TreeNode {
	int val;
	TreeNode left;
	TreeNode right;
	TreeNode(int x) { val = x; }
}
```

##### 5. 用两个栈来实现队列

描述：用两个栈来实现一个队列，完成队列的Push和Pop操作。 队列中的元素为int类型。

分析：
压入，就直接压到第一个栈中；
弹出，先看第二个栈中是否为空，不为空，第二个栈弹出栈顶元素，为空，则将第一个栈中的所有元素弹出并压到第二个栈中，然后弹出第二个栈的栈顶元素。

```
import java.util.Stack;

public class Solution {
    Stack<Integer> stack1 = new Stack<Integer>();
    Stack<Integer> stack2 = new Stack<Integer>();
    
    public void push(int node) {
    	//压入，就直接压入到第一个栈中
        stack1.push(node);
    }
    
    public int pop() {
    	//判断第二个栈是否为空
    	if(stack2.isEmpty()){
    		//第二个栈为空时，将第一个栈里的元素全部弹出，压入第二个栈中
    		while(!stack1.isEmpty()){
    			stack2.push(stack1.pop());
    		}
    	}
    	//弹出第二个栈的栈顶元素
    	return stack2.pop();
    }
}
```

##### 6. 旋转数组的最小数字

描述：把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转。 输入一个非递减排序的数组的一个旋转，输出旋转数组的最小元素。 例如数组{3,4,5,1,2}为{1,2,3,4,5}的一个旋转，该数组的最小值为1。 NOTE：给出的所有元素都大于0，若数组大小为0，请返回0。

分析：
作为一个查找一维数组中最小值的题目，最暴力的方法就是依次遍历啦，但这样就和旋转数组没有任何联系了。从旋转数组的定义来看，不难找到这样的规律：因为是将一个非递减的数组的前几位移到数组最后，那么在数组中就会出现一个明显的分界线。即出现前一个元素的值大于后一个元素的值，那么这后一个元素就是我们要找的数组最小值。

基于这样的分析，我们可以直接使用顺序查找的方法来比较，得到第一种算法，这种算法的时间复杂度是O(n)。

如果想要改进，可以使用二分法来进行查找，这样时间复杂度可以缩到O(log(n))。

二分法的实现：
旋转之后的数组可以划分成前后两个有序的子数组：前面子数组的大小都大于后面子数组中的元素。（数组中没有重复的元素）

用low，high分别指向数组的第一个元素和最后一个元素，用mid指向low和high之间的中间元素。

如果mid所指的中间元素的值大于low所指的元素的值，说明这个中间元素位于前面的子数组中，这时候最小元素在中间元素的后面，可以让low指向mid；
如果mid所指的中间元素的值小于low所指的元素的值，说明这个中间元素位于后面的子数组中，这时候最小元素在中间元素的前面，可以让high指向mid。
这样可以逐渐缩小查找范围。

最终low将指向前面数组的最后一个元素，high指向后面数组中的第一个元素。即它们指向两个相邻的元素，而high指向的刚好是最小的元素，这就是循环的结束条件。

二分法在数组元素均不重复的情况下有很好的运用，但在元素有重复时会出现特殊情况：

> 链接：https://www.nowcoder.com/questionTerminal/9f3231a991af4f55b95579b44b7a01ba
来源：牛客网
我们看一组例子：｛1，0，1，1，1｝ 和 ｛1，1， 1，0，1｝ 都可以看成是递增排序数组｛0，1，1，1，1｝的旋转。
这种情况下我们无法继续用上一道题目的解法，去解决这道题目。因为在这两个数组中，第一个数字，最后一个数字，中间数字都是1。
第一种情况下，中间数字位于后面的子数组，第二种情况，中间数字位于前面的子数组。
因此当两个指针指向的数字和中间数字相同的时候，我们无法确定中间数字1是属于前面的子数组（绿色表示）还是属于后面的子数组（紫色表示）。
也就无法移动指针来缩小查找的范围。这时就需要使用顺序查找了。

第一种实现：

```
public class Solution {
    public int minNumberInRotateArray(int [] array) {
    	//如果数组为空或者长度为0时，直接返回0
    	if(array == null || array.length == 0){
    		return 0;
    	}
    	for(int i = 0; i<array.length - 1;i++){
    		if(array[i]>array[i+1]){
    			return array[i+1];
    		}
    	}
    	return 0;
    }
}
```

第二种实现：
```
public class Solution {
    public int minNumberInRotateArray(int [] array) {
    	//如果数组为空或者长度为0时，直接返回0
    	if(array == null || array.length == 0){
    		return 0;
    	}
    	int low = 0;
    	int high = array.length -1;
    	//当high等于low+1时，循环结束
    	while(high != low +1){
    		int mid = (low +high)/2;
    		if(array[mid] > array[low]){
    			low = mid;
    		}
    		if(array[mid] < array[low]){
    			high = mid;
    		}
    		if(array[mid] == array[low] && array[low] == array[high]){
    			//必须使用遍历法查找最小值
    			return findMin(low, high, array);
    		}
    	}
    	return 0;
    }
    private int findMin(int low, int high, int [] arr){
    	for(int i = low; i<high;i++){
    		if(arr[i]>arr[i+1]){
    			return arr[i+1];
    		}
    	}
    	return 0;
    }
}
```