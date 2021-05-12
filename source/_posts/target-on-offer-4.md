---
title: 剑指Offer系列（4）
tags: ["剑指Offer","算法"]
categories: 笔试面试
date: 2018-06-10 19:56:00
thumbnail: http://image.wufazhuce.com/FnYP0tkaMwoXPJ7UkTG3yVwRRGlk
---
##### 19. 顺时针打印矩阵 

描述：
输入一个矩阵，按照从外向里以顺时针的顺序依次打印出每一个数字，例如，如果输入如下矩阵： 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 则依次打印出数字1,2,3,4,8,12,16,15,14,13,9,5,6,7,11,10.

分析：
1. 将矩阵按照从外到里分为n层，每层的遍历步骤都是从左到右，从上到下，从右到左，从下到上。
2. 层数的计算方式是(Math.min(rowNum,colNum)-1)/2+1
3. 在每层中有上述四个循环，保证遍历元素不重复。

```
import java.util.ArrayList;
public class Solution {
    public ArrayList<Integer> printMatrix(int [][] matrix) {
    	ArrayList<Integer> list = null;
    	if(matrix == null || matrix.length == 0){
    		return list;
    	}
    	list = new ArrayList<>();
    	int rowNum = matrix.length;
    	int colNum = matrix[0].length;
    	if(colNum == 0){
    		return list;
    	}
    	//从外到里的圈数
    	int layer = (Math.min(rowNum, colNum) -1)/2+1;
    	//正在遍历的圈数
    	int turn = 0;
    	
    	while(turn <layer){
    		//从左向右
    		for(int i = turn;i < colNum-turn;i++){
    			list.add(matrix[turn][i]);
    		}
    		//从上到下
    		for(int j = turn+1; j <rowNum-turn;j++){
    			list.add(matrix[j][colNum-turn-1]);
    		}
    		//从右到左
    		for(int k = colNum-turn-2;(k>=turn) && (rowNum-turn-1!= turn);k--){
    			list.add(matrix[rowNum-turn-1][k]);
    		}
    		//从下到上
    		for(int l = rowNum-turn-2; (l>turn) && (colNum-turn -1!= turn);l--){
    			list.add(matrix[l][turn]);
    		}
    		turn++;
    	}
    	return list;
    }
}
```

##### 20. 包含min函数的栈

描述：定义栈的数据结构，请在该类型中实现一个能够得到栈最小元素的min函数。

分析：这道题比较简单，只需遍历栈中元素找出最小值即可，这里使用了迭代器。

```
import java.util.Stack;
import java.util.Iterator;

public class Solution {

    Stack<Integer> stack = null;
    public Solution(){
    	stack = new Stack<Integer>();
    }
    
    public void push(int node) {
    	stack.push(node);
    }
    
    public void pop() {
    	int topVal = stack.pop();
    }
    
    public int top() {
        return stack.peek();
    }
    
    public int min() {
    	int min = stack.peek();
    	Iterator<Integer> iterator = stack.iterator();
    	while(iterator.hasNext()){
    		int temp = iterator.next();
    		if(temp < min){
    			min = temp;
    		}
    	}
        return min;
    }
}
```

##### 21. 栈的压入、弹出序列

描述：
输入两个整数序列，第一个序列表示栈的压入顺序，请判断第二个序列是否为该栈的弹出顺序。假设压入栈的所有数字均不相等。例如序列1,2,3,4,5是某栈的压入顺序，序列4，5,3,2,1是该压栈序列对应的一个弹出序列，但4,3,5,1,2就不可能是该压栈序列的弹出序列。（注意：这两个序列的长度是相等的）

分析：
这道题的整体思路是，遍历弹出序列，如果当前元素不在栈内，则将压入序列中在这之前（包括这个元素本身）都压入栈内，再将栈顶元素弹出；同时将压入序列的起始位挪到这个元素的后一位；如果弹出序列中的元素已经在栈内，就从栈中弹出一个元素，如果与这个元素不匹配，就说明这个弹出序列是不正确的。如果弹出序列遍历结束后，栈为空，则说明这个弹出序列是正确的。

```
import java.util.Stack;

public class Solution {
    public boolean IsPopOrder(int [] pushA,int [] popA) {
    	Stack<Integer> stack = new Stack<>();
    	//每次压栈的起始元素下标
    	int index = 0;
    	for(int i = 0; i <popA.length;i++){
    		if(!stack.contains(popA[i])){
    			for(int j = index; j<pushA.length;j++){
        			stack.push(pushA[j]);
        			if(pushA[j] == popA[i]){
            			stack.pop();
            			index = j+1;
            			break;
            		}
        		}
    		}
    		//如果已经在栈内，则弹出一个元素与之比较，如果不相等，说明弹出序列错误，返回false
    		else{
    			if(popA[i] != stack.pop()){
    				return false;
    			}
    		}
    	}
    	//当弹出序列遍历完，栈为空，说明弹出序列正确，返回true
    	if(stack.isEmpty()){
    		return true;
    	}
    	return false;
    }
}
```

##### 22. 从上往下打印二叉树

描述：从上往下打印出二叉树的每个节点，同层节点从左至右打印。

分析：这道题是二叉树的广度优先遍历，需要借助于队列进行实现，这里使用ArrayList作为一个队列。

现将二叉树的根节点放入队列中，然后取出队首结点，将其值加入结果列表中，如果这个结点有左右孩子结点，则分别加入队尾，如此循环，直至队列为空。

```
import java.util.ArrayList;

public class Solution {
    public ArrayList<Integer> PrintFromTopToBottom(TreeNode root) {
    	ArrayList<Integer> resultList = new ArrayList<>();
    	if(root == null){
    		return resultList;
    	}
    	ArrayList<TreeNode> queue = new ArrayList<>();
    	queue.add(root);
    	while(!queue.isEmpty()){
    		TreeNode n = queue.remove(0);
    		resultList.add(n.val);
    		if(n.left != null){
    			queue.add(n.left);
    		}
    		if(n.right != null){
    			queue.add(n.right);
    		}
    	}
        return resultList;
    }
}

class TreeNode {
    int val = 0;
    TreeNode left = null;
    TreeNode right = null;

    public TreeNode(int val) {
        this.val = val;
    }
}
```

##### 23. 二叉搜索树的后序遍历序列

描述：
输入一个整数数组，判断该数组是不是某二叉搜索树的后序遍历的结果。如果是则输出Yes,否则输出No。假设输入的数组的任意两个数字都互不相同。

分析：首先明确二叉搜索树的特点，左子树值<根结点值<右子树值
后序遍历：左子树->右子树->根

1. 在序列中找到根结点，即这个序列的最后一个元素（后序遍历）
2. 在这个序列中找到第一个大于根结点的元素N，这个元素前面的都是根结点左子树的结点，值都比根结点的值小；从这个元素开始到根结点前一个元素，都是根结点右子树中的结点，值**应该**都比根节点值大。
3. 从元素N开始遍历，到根结点的前一个元素，这些元素中如果有值小于根结点，说明这个序列不满足二叉搜索树的特点，直接返回false。
4. 根结点的左右子树都同时满足二叉搜索树的特点，对根结点的左右子树进行递归，得到最终结果。

```
public class Solution {
    public boolean VerifySquenceOfBST(int [] sequence) {
        if(sequence == null ||sequence.length == 0){
        	return false;
        }
        if(sequence.length == 1){
        	return true;
        }
        return judge(sequence,0,sequence.length-1);
    }
    public boolean judge(int [] seq, int start, int end){
    	//如果分解到只有一个节点，说明已经到了叶子结点，返回true
    	if(start >= end){
    		return true;
    	}
    	//当前根结点右子树的起始下标
    	int rightStart = end;
    	for(int i = start;i<end;i++){
        	if(seq[i]>seq[end]){
        		rightStart = i;
        		break;
        	}
        }
    	//如果右子树中有比根结点的值小的，则说明不是二叉搜索树，返回false
    	for(int i = rightStart;i<end;i++){
    		if(seq[i]<seq[end]){
    			return false;
    		}
    	}
    	return judge(seq,start,rightStart -1) && judge(seq,rightStart,end-1);
    }
}
```

##### 24. 二叉树中和为某一值的路径

描述：
输入一棵二叉树和一个整数，打印出二叉树中结点值的和为输入整数的所有路径。路径定义为从树的根结点开始往下一直到叶结点所经过的结点形成一条路径。

分析：
首先先找到最左的一条路径，将这条路径上的结点都压入栈中，如果这条路径上结点值之和为目标值，则将这条路径加入结果列表中（一定要用深拷贝）；

弹出栈顶结点，修复当前路径以及目标值。 如果此时栈顶元素还有右孩子没有访问，则将其右孩子加入路径中，如果它的右孩子已访问过，就回溯到它的父节点处。直至栈为空。

> 链接：https://www.nowcoder.com/questionTerminal/b736e784e3e34731af99065031301bca
来源：牛客网
/*
非递归法：后序遍历
1.进栈时候，把值同时压入路径的向量数组，修正路径的和
2.出栈时候，先判断和是否相等，且该节点是否是叶节点，
判断完成后保持和栈一致，抛出路径，修改路径的和
3.向量数组和栈的操作要保持一致
*/

```
import java.util.ArrayList;
import java.util.Stack;

public class Solution {
     public ArrayList<ArrayList<Integer>> FindPath(TreeNode root,int target) {
    	ArrayList<ArrayList<Integer>> resultList = new ArrayList<>();
    	ArrayList<Integer> list = new ArrayList<>();
    	Stack<TreeNode> stack = new Stack<>();
    	

    	while(root != null || !stack.isEmpty()){
    		while(root!= null){
    			stack.push(root);
    			list.add(root.val);
    			target -= root.val;
    			//能左就左，否则向右
    			root = root.left != null ? root.left:root.right;
    		}
    		root = stack.peek();
    		if(target == 0 && root.left == null && root.right == null){
    			ArrayList<Integer> ls = (ArrayList<Integer>) list.clone();
    			resultList.add(ls);
    		}
    		stack.pop();
    		int size = list.size();
			list.remove(size-1);
			target += root.val;
			//右子数没遍历就遍历，如果遍历就强迫出栈
    		if(!stack.isEmpty() && stack.peek().left == root){
    			root = stack.peek().right;
    		}
    		else{
    			//强迫出栈
    			root = null;
    		}
    	}
        return resultList;
    }
}

class TreeNode {
    int val = 0;
    TreeNode left = null;
    TreeNode right = null;

    public TreeNode(int val) {
        this.val = val;
    }
}
```

