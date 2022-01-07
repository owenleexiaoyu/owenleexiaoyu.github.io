---
title: 秋招面试题汇总
tags: ["面经"]
categories: 笔试面试
date: 2018-11-09 23:23
thumbnail: http://image.wufazhuce.com/Fi4MSwyXsv34xgLDYmIWfBl7m_BY
---

### Bilibili（获得Offer）

#### Bilibili 一面

1. Activity的生命周期
2. Activity 内存不足被回收时的生命周期
3. Looper的工作原理
4. Android 程序执行的内存使用情况
5. GC是如何实现的
6. 涉及Native层的内存如何管理
7. JNI的工作原理
8. 编译原理：一个CPP文件如何变成汇编语言，变成机器码，Java的代码呢？
9. 拿到一个Jar包如何加log，用反射吗？反射了解过吗？
10. Android P的API了解过吗？
11. 面向切面编程？
12. Android 如何处理UI和耗时操作，有哪些方式并简述各自特点和原理
13. OOM产生的原因是什么？如何避免？

#### Bilibili 二面

1. 比较详细的聊项目经历
2. 如果你身边有个朋友想要学Android，你会建议他怎样来学。

后面比较玄学，没有聊技术，谈了一下人生，就过了，美滋滋。

#### 总结

B站的整个面试过程是比较玄学的，一面的时间是9月29号，那时候我还没怎么复习好，很多知识点都没看过去。一面时候的问题除了几个比较常见的，还有像Android P的新特性、Native层的内存管理等几个问题我其实都没答上来。当时面完就觉得凉了，也没抱希望。过了两个星期，突然发来二面的通知，当时觉得特别不可思议。二面的时候，面试官是B站整个移动端的架构负责人，先是和我聊项目，这一块聊的还是比较深入的，比如项目中讲到了一个迷宫类的游戏，就问到了一个就是如何用算法去实现一个迷宫，当然我对这些算法都不了解，也回答的似是而非。但是面试官好像特别看好我，对我这块卡得不严，就说让我回去了解了解这方面的算法。单纯技术的话，二面是基本没问，后面问了一些实习的事，做的项目，然后问能不能去B站实习。最后给了一个比较肯定的回复，说会尽快发offer。这过程我其实是比较蒙的，因为自己觉得B站这边并没有表现的很好。后面了薪资的时候，提到了大疆和头条两个package比较高的Offer，B站这边给的薪资也很可观，但是更想去头条就拒掉了这边。

### Keep

#### Keep 一面

1. Java 的集合类用过哪些？ArrayList 是用什么来实现的？添加一个元素有哪些操作？扩容会扩容到原来的多少？添加一个元素的时间复杂度是多少？
2. 如何判断一个链表是循环链表？如何计算循环链表的环的节点数？（快慢指针）
3. synchronized 关键字和volatile 关键字有什么区别？
4. ThreadLocal 的作用？
5. Android 的Thread、Handler、Looper是如何工作的？一个线程可以有几个Looper？可以没有Looper吗？一个线程可以有多少个Handler？
6. TCP 连接的三次握手和四次挥手的过程
7. Activity的生命周期有哪些？Activity A 跳转到 Activity B 的过程中，两个Activity的生命周期调用流程。
8. Service 有几种启动方式？如果一个Service既start，又bind，这时候调用stopService()，Service会不会销毁。
9. Activity 和Fragment 之间如何互相调用对方的方法。
10. 快速排序的时间复杂度是多少？写一个快速排序。

#### Keep 二面

1. 介绍项目经历
2. 讲一下 Java 的集合类
3. Activity的启动模式有哪些？
4. 自定义一个FrameLayout 来实现LinearLayout。
5. Android 中实现异步的方式有哪些？
6. Handler 出现内存泄漏的原因。
7. 什么是内存泄漏？
8. IntentService的使用场景，有什么好处？HandlerThread 的作用。
9. ListView 中的缓存机制。
10. 用到了哪些Android的图片加载库，之间有什么区别？

#### 总结

Keep 最后是止于二面，二面面完后我其实心里有点数，可能就到此为止了。一面的时候，所问到的问题其实都是比较常见的，答得很顺利。记得在编程题的环节，面试官让我手写一个快排，其实原理都懂，之前复习的时候也专门练过一次，但是有段时间没看了，在写的时候对边界条件一直没考虑清楚，写了挺久都没写出来。估计面试官也是看我其他问题答得比较顺畅才给我过的吧。二面时，有几个问题对我来说有点偏，平时都没怎么注意，在复习的时候也没好好看，比如那个如何自定义一个FrameLayout 来实现LinearLayout、ListView的缓存机制（现在面试问ListView的比较少了，所以一直没细看这部分）。所以二面有些问题回答的就比较糟糕，最后二面面试官没有一面面试官那么仁慈了，就没有过。据说今年Keep 给的薪资也是比较高的，遗憾。

### 腾讯

#### 腾讯提前批一面

1. JVM中的内存类型有哪些？
2. Object类中wait()、notify()、notifyAll()的区别联系。
3. Activity A 跳转到Activity B 时，如果A的onStop() 方法在B的onResume() 方法之前会发生什么。启动模式会不会对这个过程造成影响。
4. Handler 内存泄漏的原因是什么？
5. 询问学校项目的经历和实习中的任务。

#### 腾讯一面

腾讯的一面全程一个 Android 的问题都没问，问的基本上都是 C++ 和 Java 的知识。唉，心里苦啊。

1. 自我介绍，介绍项目。
2. C++ 和 Java 有什么区别？
3. C++ 中的 const 关键字有什么用法？static 关键字有什么用法？
4. 说一下 Java 的垃圾回收机制。
5. C++ 和 Java 在继承上有什么区别？
6. 用过哪些开源库？选择一个开源库的理由有哪些？
7. 一个算法题：找出一个字符串中不重复的最长子串。

#### 总结

还是太菜了，从实习到秋招，一共面了三次腾讯，就没有挺过一面的。而且有两次，都感觉很难受，因为面试问得大部分问题是 C++ 的问题，话说我面的是 Android  开发啊，这不是难为我这个彩笔吗。还有一次倒是集中于 Java 和 Android，但是问到的问题我答得都很差，也就没有后续了，想想还是很难受的。

### 今日头条（获得Offer，最终去向）

#### 头条一面

1. 计算机网络的整体结构
2. TCP 的建立连接和断开连接的过程，这个过程中的状态转换。
3. 介绍一下HTTP，有哪些方法？GET和POST有什么区别？使用场景有什么区别？有哪些Header？和缓存相关的Header的作用是什么？
4. 说一下 JVM 的内存模型。
5. 初学 Android 需要掌握哪些知识？
6. 说一下 Android 的事件分发机制。
7. Bitmap、Cannvas、Paint、Drawable有什么区别和联系？
8. 手写二叉树的中序遍历。
9. 对一个搜索关键字，进行高亮的需求，如何进行实现？如果有多个关键字重复高亮怎么处理？

#### 头条二面

1. HTTPS  的建立连接的过程？为什么后面用对称加密？
2. Java 的finalize 方法如何调用？为什么要设计这个方法。
3. Java 中的优先队列
4. Java 的HashMap的实现原理？如何扩容？和Hashtable的区别？CurrentHashMap的原理，有什么特点？
5. Android 的四大组件的介绍，Service是运行在主线程还是在子线程？Service可不可以有UI？四大组件中有哪些可以跨进程？进程的优先级有哪些？
6. Content Provider 如何设置访问权限？
7. 如何解决滑动冲突？
8. Android 跨进程通信的方式有哪些？Binder的实现原理是什么？AIDL和Binder有什么区别？
9. UI 卡顿如何进行优化？
10. 如何进行异步通信，了解过这方面的开源库吗？
11. 编程：二叉树的中序遍历
12. 死锁是怎么产生的？

#### 头条三面

1. 项目介绍，问了很多关于项目的细节。
2. Android Activity 的启动模式。
3. Android 开发者可以使用的异步处理方式有哪些？（Handler、AsyncTask、HandlerThread、IntentService）IntentService和Service有什么区别？
4. 项目中用到的网络库，RxVolley和Volley的区别。

#### 总结

头条这次能获得 Offer，其实也有一些运气成分在其中。首先是一位学长给了我一个白金内推码，免去了笔试，不然以头条的笔试难度，还真不一定能过。其次是面试时间比较晚，所以准备的时间比较充足。记得第一次通知我面试是在 9 月中旬，当时确实时间冲突，另外对自己也不自信，所以看到可以后延面试轮次，就换到了 9 月底。结果那天前面排的人很多，面试官面不过来，就把我调到了 10 月 13 号的场次，也是幸运地争取到了一些时间。很多的机缘巧合加在一起，我在 10 月 13 号参加了头条的面试。

面试过程总的来说要求还是比较严的，特别是三面，后面会细说。在面头条的前几天，刚和大疆那边聊完薪资，给的挺多的，超出了我原本的预期，答应了大疆的Offer。所以面试那天的心态是很放松的，我觉得这也是其中一个因素。记得更早前面美团时，因为是第一次线下面试，紧张的不得了，很多明明知道的东西也没有很好地回答上，最后毫无疑问被淘汰了。而这次算是抱着试试即可的心态，没过还有大疆呢，在回答问题的时候比较放松，思路、逻辑包括表达可能会更好一些。

还有一个比较意外的小插曲是一面二面都有一道编程题，巧的是竟然考到了同一个知识点：二叉树的遍历。一面面试官让我写一个非递归形式的二叉树中序遍历，这个当时还是思考了一会，还好思路都还是记得，花了五六分钟写出来。二面的时候面试官让我写一个二叉树的深度遍历，那我当然是要发挥代码复用的优良传统啊，所以在假装深思一下后，很快就写出来了，二面也就过了。

二面其实有些问题我觉得是挺深入的了，都问到了跨进程通信的实现方式了，其实这个问题我也不怎么会，只答上来几种实现的方式，但对于底层原理也回答不上来，好在面试官也没特别揪着这个问题。

头条的三面是我经历过最严格的也是最惊险的一次终面了。之前面过的美团、大疆，之后面的B站、百度，终面的时候虽说会对项目的细节包括自己对计算机领域的认知、个人的规划等等展开提问，但都没有一次想头条的三面这样给我这么大的压力。原因在于他对项目的细节抠的太细了。我简历上写了两个在学校做的项目，说实话，这两个项目委实没有什么亮点，并且由于时间久远，一些细节都记不清了。但是面试官非常仔细地让我介绍了项目，并且对项目一些点展开提问，关键是问到的这些点正是这个项目本身的局限之处，我也不能很好的解释，这让我真的非常紧张，只能是尽量去解释当时的考虑。总之，三面的项目提问真的是我遇过的最细致的。所以，**在制作简历的时候，一定要保证对简历上写的每项内容都有十足的把握**，不会被面试官一深挖就崩。不要追求简历的丰富好看而强加没有把握的内容。后面的问到技术的时候，因为还是在Android开发这一块，反而压力小了很多，回答的也还好。三面结束过了一会，接到HR的电话说三面过了，心里非常开心。

### 百度（获得Offer）

#### 百度一面

1. 自我介绍，介绍项目经历。
2. Activity的生命周期，各个生命周期的作用是什么？可以在onCreate中弹出一个Dialog吗？Dialog是被添加到哪里呢？弹出 Dialog 后生命周期会怎么变化？Activity之间是怎么传递数据的？可不可以传图片数据？Fragment怎么传数据？
3. Android 的事件传递（拦截）机制是怎样的？
4. 自定义View的步骤？如何让TextView的文字居中，如何在TextView中添加图片？添加了图片后图片是否会居中呢？如何实现让图片也居中？自己实现过哪些自定义控件？实现的思路是怎样的？
5. Broadcast Recevicer是做什么的？它的底层是如何实现的？如果让你写一个本地的广播系统你会怎么实现？
6. Java 的集合类用过哪些？LinkedHashMap用过吗？HashMap是如何实现的？介绍一下CurrentHashMap，TreeMap。
7. Http 302 的状态码表示什么意思？你在项目中是如何实现网络连接的？有用到什么开源库吗？
8. 编程题：如何判断一个字符是一个合法的IP地址？
9. 你觉得你还有什么方面比较突出的可以跟我说的？

#### 百度二面

1. 接触Android多久了？介绍一下你做的项目？你在里面做了什么？
2. 自定义控件需要注意哪些问题？
3. Java中final的使用场景有哪些？作用分别是什么？
4. 面向对象的特性有哪些？Java如何实现这些特性？
5. 有几种创建线程的方式？之间有什么区别？
6. 线程的同步如何来实现？
7. 死锁是怎么形成的？如何来预防死锁的发生？
8. 计算机网络中OSI七层模型是哪七层？应用层的协议有哪些？（HTTP、FTP、SMTP、POP3）POP3和SMTP是什么协议？（邮件）HTTP和HTTPS的区别是什么？SSL协议是什么样的协议？HTTPS中用到了哪几种加密方式？
9. 用过哪些开源库？（答了Volley、Picasso、OKhttp、Retrofit）了解过源码吗？（答看过Volley的）画一下Volley的整体结构。OkHttp为什么这么多人用？优点在哪里？
10. HashMap的实现原理？

#### 百度三面

1. 自我介绍。详细介绍项目，在其中的工作。在项目中投入的精力、时间等。项目的立意是怎么来的？为什么要做这个项目？有老师介入项目吗？
2. 你最近看了什么书，和技术有关的？给你印象最深的是什么？有哪些收获？
3. 学过哪几种语言？如果让你学一门新的语言，你多久能掌握它？（答两周掌握语法结构）如果我给你一周时间，让你去学习Go这门语言，一周后写线上业务，你会怎么学？
4. 讲一下Android中的消息机制。它有哪些优缺点？
5. 设计模式了解过吗？用过哪些设计模式？工厂模式的类图画一下？
6. 在开发中有遇到过OOM的问题吗？如何来避免OOM的出现？（答到了使用缓存）缓存是用在什么样的场景中，是为了解决什么问题？LRU算法是一个什么算法？
7. Java的GC了解过吗？虚拟机是如何实现垃圾回收的？有哪些回收方式？
8. 你觉得你在开发的哪些层面表现比较好？是UI层、还是逻辑层？你最近做过的自定义控件有哪些？最有难度的是哪个？
9. 了解过哪些开源库？（答的Volley）有看过源码吗？它的设计里有哪些优秀的地方？
10. 对百度有哪些了解？对魏则西事件怎么看？（后来主管还对这个事件做了一些解释）
11. 在哪里实习？实习主要做哪些工作？公司有给你发offer吗？
12. 还参加了哪些公司的招聘？手里有哪些offer？如果我们这边也给你offer，你会怎么选？
13. 有什么问题想问我的？

#### 总结

收到百度面试通知是在10月10日，面试安排在10月21日。这期间，收到了头条、B站的Offer，最后选择了头条，和头条签了两方。之后，拒掉了之前海投的一些公司的面试，像贝壳、快手，但还是决定来试试百度。毕竟BAT是每个IT人的梦想，阿里错过了内推网申，腾讯不管是提前批还是正式流程都倒在了一面上，百度是最后一个机会。其实有点衡量衡量自己的水平的意思，看看能不能够得到BAT的门槛。

百度的面试流程也是三轮，并且是现场随机分配空闲的面试官。每个面试官有自己专门负责的方向和轮次，比如IOS一面，Android二面这些。一面过了就去看哪位二面的面试官空闲，然后直接开始面。

一面二面大部分问题都还是比较常见的，这里就不细说了，值得一提的是三轮面试都提到了一个内容：开源库。三位面试官都问了我平常开发中用过哪些开源库，像一面二面的面试官是很明显的想问我OkHttp的内容，但是我OkHttp原理的东西不懂，还停留在用的阶段，所以没有正面的回答他们，重点说了自己看过源码的Volley这个网络库。然后像三面的时候就问到有没有看过开源库的源码，能从中学到哪些优秀的东西，要求还是有点的。

在一面的时候，面试官问我“你觉得你还有哪些方面比较突出的可以和我说的”，三面的时候，面试官问：你觉得你在Android 开发的哪个方面比较有优势？为什么？这两个问题我觉得其实难度比那些技术问题还要难上一些，因为它是一个半主观的问题，要如何表达自己的优势，同时避免过度吹嘘，又如何证明自己具备这些优势。就感觉既考验你的实际水平，又考验你的表达能力。

还想说一下三面的过程，三面的面试官真的是非常Nice。上来先自我介绍，说了自己的名字，工作的部门（百度网盘的技术主管），是我面试这么多次第一次知道面试官的名字，感觉还是很不一样的。在比如OOM的问题上，我本来对这块不熟悉的，如果他深究下去是肯定会很尴尬的。但是后面他给我一些引导，就慢慢回答到缓存，包括LRU算法，还给我循序渐进的解释LRU算法。后面面试官问我怎么看待魏则西事件，说实话我是绝对没想过会被问到这个问题，因为它无疑是百度的一个软肋，而现在面试官直接摊开来问我怎么看，让我着实感到意外。我对于这个事件确实也有一些想要说的实话吧，反正就一股脑的说出来了，大意是搜索对于现在的人们过于重要，百度既然做了这个领域，就必须有这个社会责任感。说完后，面试官非常认可，也和我非常开诚布公吧，说道这个事件确实是百度的一个痛点，他们也非常正视这个事情，解释了这些事情背后的一些原因。百度的三面和B站的二面算是体验最好的终面了。