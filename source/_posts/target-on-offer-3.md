---
title: 剑指Offer系列（3）
tags: ["剑指Offer","算法"]
categories: 笔试面试
date: 2018-06-08 20:47:00
thumbnail: http://image.wufazhuce.com/FgL14C_rTVr1e-uEJeFPGRE1qFyp
---

##### 13. 调整数组顺序使奇数位于偶数前面

描述：
输入一个整数数组，实现一个函数来调整该数组中数字的顺序，使得所有的奇数位于数组的前半部分，所有的偶数位于位于数组的后半部分，并保证奇数和奇数，偶数和偶数之间的相对位置不变。

分析：
这道题的思路是不用管数组中的偶数，只看数组中的奇数，如果数组中某个元素是奇数，则把这个元素插入到前一个奇数的后一位。这样遍历整个数组，所有的奇数都会移到前面，偶数自然也就在数组的后半部分了。因为使用的是插入的形式（类似于插入排序），是稳定的，可以保证奇数与奇数，偶数与偶数之间的位置关系保持不变。

在函数中引入一个下标指针index，指向整理后的最后一个奇数，之后插入时就只需将奇数元素插入到index+1的位置即可。

这里可以分为两种情况，两个奇数相邻和两个奇数不相邻：
如果相邻，直接index++，不用进行元素的移动；
如果不相邻，在index和当前找到的奇数元素之间的（都是偶数）元素整体向后移动一位，然后将当前元素插入到index+1的位置。

还有一个问题是index的初始值应该为多少？一开始设为0，后来发现会导致逻辑错误，如果数组第一位为偶数，那么这个偶数将一直放在第一位不动。正确的初值应该为-1。假设在数组-1位有一个奇数，这样就可以将首位的偶数也变成一个普通场景（即-1位奇数与下一个奇数不相邻）。

（这里的思路有点像链表中增加一个空的头结点）

```
public class Solution {
    public void reOrderArray(int [] array) {
        int index = -1;
        int size = array.length;
        for(int i = 0;i<size;i++){
            //判断元素是否为奇数，不是就跳过
        	if(array[i] % 2 != 0){
                //判断两个奇数是否相邻，相邻index直接加1
        		if(i ==  index +1){
        			index = i;
        			continue;
        		}
                //不相邻进行偶数的移动和后一个奇数的向前插入
        		else{
        			int temp = array[i];
        			for(int j = i; j > index +1;j--){
        				array[j] = array[j-1];
        			}
        			array[index+1] = temp;
                    //index表示前半部分排列好的奇数中最后一个奇数的位置，所以插入后index要加1
        			index++;
        		}
        	}
        }
    }
}
```

##### 14. 链表中倒数第k个结点

描述：输入一个链表，输出该链表中倒数第k个结点。

分析：
这里最佳的解法只需要遍历一次链表即可实现。
因为要查找倒数第k个结点，这个结点与尾结点中间相距（k-1）个结点；
我们可以定义一前一后两个相距为k的两个指针p、q，当后面那个指针指向尾结点的next（null，null值是循环结束的条件）时，前面那个结点就正好指向倒数第k个结点。

一开始，p、q两个指针都是指向head，让q指针先往后走k次，然后让p指针开始往后走。这时候就要通过k的值来进行判断。
k的临界值是1，当k = 1时，表示倒数第一个结点，即尾结点。这时候需要q比p先走一次即可；
所以可以得到，让k每次自减1，当k的值小于1时，p和q就都开始往后走。

如果输入的k值大于链表的长度，这时应该返回一个null，基于上面的操作，当q遍历完一遍链表（为null），p还没有开始往后走，还指向head。所以针对这种情况，我们可以让它返回null值。当k大于链表的长度时，遍历完链表后，k的值最小为1；所以加上一个判断即可。

```
public class Solution {
    public ListNode FindKthToTail(ListNode head,int k) {
    	ListNode p = head;
    	ListNode q = head;
    	while(q != null){
    		q = q.next;
    		if(k < 1){
    			p = p.next;
    		}
    		k--;
    	}
    	//k值大于链表长度的情况
    	if(k >= 1){
    		return null;
    	}
    	return p;
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

##### 15. 反转链表

描述：输入一个链表，反转链表后，输出链表的所有元素。

分析：
这道题的关键在于，结点指针域的多次变换。
current代表当前结点，一开始指向头结点；
pre代表当前结点的前一个结点，即链表反转后的下一个结点，一开始为空（原头结点反转后是尾结点）；
tmp用来临时保存原链表中当前结点的下一个结点；
从头遍历这个链表，当current为空时结束循环。
1. 记录下current的下一个结点，保存在tmp中；
2. 让current的next域指向pre所指的结点，即进行反转
3. 让pre指向current所指结点
4. 让current指向tmp所指结点，跳到原链表的下一个结点处。
5. 最后把current作为新链表的头结点，用newHead指向它

```
public class Solution {
    public ListNode ReverseList(ListNode head) {
    	ListNode current = head;
    	ListNode temp = null;
    	ListNode pre = null;
    	ListNode newHead = null;
    	while(current != null){
    		temp = current.next;
    		current.next = pre;
    		pre = current;
    		current = temp;
    		if(temp == null){
    			newHead = pre;
    		}
    	}
    	return newHead;
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

##### 16. 合并两个排序的链表

描述： 
输入两个单调递增的链表，输出两个链表合成后的链表，当然我们需要合成后的链表满足单调不减规则。

分析：
合并两个有序的链表，让其中一个链表的头指针作为合并后链表的头指针，定义一个合并后的当前指针np指向该头指针。

思路是分别从两个链表的当前指针所指结点取出值，进行比较，np指针指向值较小的那个结点。如此一直循环，直到两个链表的当前指针均为空，结束循环。


```
public class Solution {
    public ListNode Merge(ListNode list1,ListNode list2) {
    	ListNode newp = list1;
    	if(list1 == null){
    		return list2;
    	}
    	ListNode p1 = list1.next;
    	ListNode p2 = list2;
    	
    	while(p1 != null || p2 != null){
    		
    		if(p2 == null || p1 != null && p1.val <= p2.val){
    			newp.next = p1;
    			p1 = p1.next;
    			newp = newp.next;
    		}
    		else if(p1 == null || p2 != null && p1.val > p2.val){
    			newp.next = p2;
    			p2 = p2.next;
    			newp = newp.next;
    		}
    	}
        return list1;
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

##### 17. 树的子结构

描述：
输入两棵二叉树A，B，判断B是不是A的子结构。（ps：我们约定空树不是任意一个树的子结构）

分析：
这道题看上去比较复杂，如果用递归的思路来想，则不是很难。

步骤：
1. 遍历A，在A中找到与B根节点的值相同的结点。
2. 如果找到一个这样的节点n，则调用一个判断函数F()，判断以结点n为根节点的树C是否包含B
3. 如果某个结点的值与B根结点值相同，则用递归的方式依次将这个结点的左孩子和右孩子代入，查找符合1条件的结点。

在F() 中，我们需要判断以结点n为根节点的树C是否包含B，这里同样是使用递归的思想，在B遍历完之前，B中的每个结点都与C中的结点一一对应，这就要求两棵树的遍历是同步的。具体请看代码中注释。

```
public class Solution {
    public boolean HasSubtree(TreeNode root1,TreeNode root2) {
    	boolean result = false;
    	//如果二叉树B或者二叉树A为空树，直接返回false，无需比较
    	if(root2 == null || root1 == null){
    		return false;
    	}
    	//当两棵树都不为空时，首先在A中找到与B根节点值相同的结点
    	//从这个结点开始比较这个结点以下部分是否对B形成包含关系
    	if(root1.val == root2.val){
    		result = doesTree1HasTree2(root1, root2);
    	}
    	//如果这个结点不包含B，则递归，用A的左孩子代替A，进行比较
    	if(!result){
    		result = HasSubtree(root1.left, root2) ;
    	}
    	//如果左孩子以下不包含B，则再次递归，用A的右孩子代替A，进行比较
    	if(!result){
    		result = HasSubtree(root1.right, root2);
    	}
    	return result;
    }
    /**
     * 判断两个根节点相同的树，是否包含其中小的那一棵，即B中每个结点都能与A中一一对应
     * @param n1
     * @param n2
     * @return
     */
    public boolean doesTree1HasTree2(TreeNode n1, TreeNode n2){
    	//表示B遍历完了，所以是能够在A中一一对应的，返回true
    	if(n2 == null){
    		return true;
    	}
    	//B还没遍历完，A就已经遍历完了，说明A比B还要小，不可能包含B，返回false
    	if(n1 == null){
    		return false;
    	}
    	//如果有一个子结点的值不相同，直接返回false
    	if(n1.val != n2.val){
    		return false;
    	}
    	//严格保证每个结点的值都是相同的
    	return doesTree1HasTree2(n1.left, n2.left) && 
				doesTree1HasTree2(n1.right, n2.right);
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

##### 18. 二叉树的镜像

描述：操作给定的二叉树，将其变换为源二叉树的镜像。

分析：
这道题比较简单，很容易就看出应该使用递归来做，先交换根结点的左右子树，然后把根节点的左右孩子分别也代入这个函数，进行交换。

```
public class Solution {
    public void Mirror(TreeNode root) {
        //传入一个空树，直接返回
    	if(root == null){
    		return;
    	}
        //交换根节点的左右子树
    	TreeNode tmp = root.left;
		root.left = root.right;
		root.right = tmp;
        //有左孩子，进行左孩子递归
    	if(root.left != null){
    		Mirror(root.left);
    	}
        //有右孩子，进行右孩子递归
    	if(root.right != null){
    		Mirror(root.right);
    	}
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
