---
title: 毕业一周年小结
date: 2020-06-30 20:00
tags: ["年终总结"]
categories: 想法
thumbnail: http://image.wufazhuce.com/FhxXky3U1ziPU-Hql-rC_nylfsYa
---

### 前言

时间过得真的飞快，不知不觉就毕业一年了。去年的这个时候，我把宿舍中的东西一部分寄回家，一部分寄到上海，然后提拎着点行李来到上海找房子。不由得感慨光阴似箭，时光如梭。在上半年的最后一天，来回顾下毕业一年经历的一些事情，为这一年稍作总结。

### 工作状态

从7月份进入字节的抖音部门，刚开始在国际化，做一些海外 TikTok 的综合需求，后面业务变化，转到安全合规，做抖音和 TikTok 的合规向需求。还搬了一次办公楼，疫情期间经历了四十来天的远程工作（Work from home）。

业务上的变化不由得自己决定，只能是拥抱变化，这就不谈了。总结来说，在字节工作还是有成就感、有挑战性、有压迫感的。做的事情从简单到复杂，从被安排，到自己 cover 一些工作，从对企业开发一脸蒙蔽，到也能给新进同学提供一些指导，都是成长。

可能最主要的收获是对这个行业和对 Android 开发有了更深的了解。比如 CI、比如多仓开发（这个还和感情生活有点牵扯，之后再说），比如 Kotlin，比如参与组件化的相关工作。同时也切身体会一个服务数十亿用户的大型项目的代码复杂度。到现在比较熟悉的代码可能只有所有代码的百分之 5。理解项目架构，理解业务框架，理解基础 sdk，理解工程效率提升（增量编译、多仓协作等），都是可以持续成长的地方。

然后在团队中，之前在国际化时，不算技术最突出的，所做的需求不算很大；后来因为接手过几个合规向的需求，就转到了合规线，刚转过去时，人力较少，也就比较忙，整个合规涉及的业务都要了解，后面在团队中也慢慢熟悉了新的业务，开始 cover 一些业务。包括负责合规业务代码的组件化，算是设计了合规代码的组件框架，当然这块做的也不是特别好，主要是囿于技术实力不够。目前算是新团队里的小骨干（maybe，自认为），最近团队的人数也有所扩充，有些新进同学也是有两三年开发经验的，所以之后也是有很大挑战摆在面前，如何在大家对业务熟悉程度接近的情况下，补齐技术和开发经验上的差距，甚至处在技术前列。

### 技术成长

这一趴在我这其实算是老生常谈了，谈到自己都快吐了。总得来说是不满意，技术成长太慢了。即使在大公司见识了这么多技术黑科技，也没有深入去研究它们。刚到公司时，写了一份 [职业成长规划](https://lixiaoyu.cc/2019/07/28/my-career-plan/)，列了第一年要学的技术知识。然后前一阵子 [复盘学习状态](https://lixiaoyu.cc/2020/04/21/learning-state-replay/) 时发现做到的寥寥无几，和计划相距甚远。具体原因在那篇文章里也说过了，这里就不另外说，然后工作第二年就暂不立啥技术 Flag 了，怕脸疼，只能说每双月制定可落地可实现的技术 Objects，按时按量地达成 Key Results。这样就肯定会有可观的进步。

### 感情生活

这部分和毕业最大的不同是 I‘m in a relationship，而这也是这一年来最美好的事情。

和小萌在网上认识大半年多，从寻常聊天到互相有意思，再到捅破窗户纸把事情说开，再到现在恋爱状态，以及未来的路怎么走。这个过程，我想到和多仓开发的流程很相像，和她说了这个事情，她也挺喜欢这个比喻。

两个人相识就像两个代码仓库，各自创建了分支，在这分支上写自己的代码，过自己的生活，同时还有对方的参与。

当两个人坦白情愫，考虑以后如何相处时，就像在 CI 集成系统中，创建了一个多仓的 merge request，要把与对方认识相处的改动合到自己主分支中去，成为今后人生的一部分。

当坦白的结果是把关系进一步深入时，像是把冲突解完，开始 part merge 的过程。part marge 是指两个代码仓库中，其中一个仓库依赖另一个仓库，在代码合入时，需要被依赖的仓库（子仓）先完成 merge，这里不算特别贴切，毕竟感情不是一个人单独依赖另一个人，只是引用了它有实质上进展的含义。

part merge 之后，是 intergate（集成）阶段，子仓分支完成 merge 之后，进行发版，依赖仓库（主仓）将新的版本写入自己的分支中并完成构建。这个过程可以分为写入和构建两部分，通常从 part merged 到完成集成写入这个过程不会很长，事实上我们两人的这一过程也很短暂，经历了一次分手和好后，就进入了集成构建过程。这个过程就是我们现在的状态，关键词或许是了解，网恋+异地的情况或许让人深感艰难，但是我们是从低处往高处走，在向着更亲密、更实际的未来发展，所以还是值得期待。下个阶段是 merge，即主仓也完成分支的 merge，这或许指代这我们线下见面，确立关系那一步，综合种种现实因素，到 merge 阶段或许还需要一些时日。

这或许就是程序猿的浪漫思维？我记得 part merge 时和小萌说，我对我自己成为一个厉害的程序员有信心了，因为连表白（不算，两人坦露心迹）都能想到代码开发。

### 结语

这一年这么匆匆而过，我算的上收获良多。下一个工作年，要更自律、更成熟、更开心。