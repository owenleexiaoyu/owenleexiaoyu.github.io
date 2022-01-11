---
layout: post
title: Kotlin 修炼手册（18）注解处理器（APT）
date: 2021-03-31 12:00
tags: ["Kotlin"]
categories: 技术
---

上一篇文章介绍了注解，这篇文章我们来看下注解处理器，看看如何利用这个工具在编译期做一些骚操作。

## 章节大纲

* 注解处理器的基本实现
* 注解处理器的语法
* 模仿思路实现一个山寨版 ButterKnife

## 基本实现

实现一个自定义的注解处理器有两个步骤：

1. 实现 Processor 接口处理注解
2. 注册 1 中创建的注解处理器

依次看看每个步骤如何实现：

### 实现 Processor 接口

通过实现 Processor 接口可以自定义注解处理器，我们也可以采用更简单的方法：通过继承 AbstractProcessor 类实现自定义注解处理器。实现抽象方法 process 处理我们想要的功能。

```java
class MyProcessor: AbstractProcessor() {
    override fun process(set: MutableSet<out TypeElement>?, 
                         roundEnvironment: RoundEnvironment?): Boolean {
        return false
    }
}
```
另外，还需要通过重写 getSupportedAnnotationTypes 方法和 getSupportedSourceVersion 方法来指定支持的注解类型以及支持的 Java 版本。
```java
class MyProcessor: AbstractProcessor() {
    override fun process(set: MutableSet<out TypeElement>?,
                         roundEnvironment: RoundEnvironment?): Boolean {
        return false
    }
    // 指定支持的注解类型
    override fun getSupportedAnnotationTypes(): MutableSet<String> {
        return mutableSetOf(MyAnnotation::javaClass.javaClass.canonicalName)
    }
    // 指定支持的Java版本
    override fun getSupportedSourceVersion(): SourceVersion {
        return SourceVersion.latestSupported()
    }
}
```
Java7 之后还可以通过注解的方式进行指定：
```java
// 指定支持的注解类型
@SupportedAnnotationTypes("cc.lixiaoyu.complier.MyAnnotation")
// 指定支持的Java版本，这里指定了Java 8
@SupportedSourceVersion(SourceVersion.RELEASE_8)
class MyProcessor: AbstractProcessor() {
    override fun process(set: MutableSet<out TypeElement>?,
                         roundEnvironment: RoundEnvironment?): Boolean {
        return false
    }
}
```
>因为 Android 平台可能会有兼容问题，建议使用重写 getSupportedAnnotationTypes 方法指定支持的注解类型。
### 注册注解处理器

最后我们还需要将我们自定义的注解处理器进行注册。新建 resources 文件夹，目录下新建META-INF 文件夹，目录下新建 services 文件夹，目录下新建`javax.annotation.processing.Processor`文件，然后将我们自定义注解处理器的全类名写到此文件：

```plain
// javax.annotation.processing.Processor
cc.lixiaoyu.complier.MyProcessor
```
这样的做法还是比较麻烦的，谷歌帮我们写了一个注解处理器来生成这个文件。

github地址：[https://github.com/google/auto](https://github.com/google/auto?fileGuid=XWhXYTHXC88xPXwj)

模块中添加依赖：

```plain
compile 'com.google.auto.service:auto-service:1.0-rc7'
```
在注解处理器上添加注解：
```java
@AutoService(Processor.class)
class MyProcessor: AbstractProcessor() {
    //...
}
```
这样就可以了，我们只需关注注解处理器中的处理逻辑即可，从这也能看出注解处理器的强大和实用。
## Processor 语法概念

上一小节了解了实现一个自定义 Processor 的整体步骤，已经可以搭建出一个自己的 Processor 了，但是要实现我们具体的功能，还需要知道 Processor 中的一些语法的元素，这样我们才有工具可以用来构建我们自己的功能。

### init 方法

AbstractProcessor 中有一个 init 方法，是 Processor 接口提供的，当编译程序时，注解处理器工具会调用这个方法并提供一个实现了 ProcessingEnvironment 接口的实例作为参数。

```plain
override fun init(environment: ProcessingEnvironment?) {
    super.init(environment)
}
```
我们可以通过 ProcessingEnvironment 获取一些实用类以及获取选项参数等：

|方法|说明|
|:----|:----|
|Elements getElementUtils()|返回实现Elements接口的对象，用于操作元素的工具类。|
|Filer getFiler()|返回实现Filer接口的对象，用于创建文件、类和辅助文件。|
|Messager getMessager()|返回实现Messager接口的对象，用于报告错误信息、警告提醒。|
|Map<String,String> getOptions()|返回指定的参数选项。|
|Types getTypeUtils()|返回实现Types接口的对象，用于操作类型的工具类。|
|Locale	getLocale()|返回当前语言环境；如果没有有效的语言环境，则返回 null。|
|SourceVersion	getSourceVersion()|返回任何生成的源和类文件应该符合的源版本。|

### 元素 Element

Element（元素）是一个接口，表示一个程序元素，比如包、类或者方法。以下元素类型接口全部继承自Element接口：

|类型|说明|
|:----|:----|
|ExecutableElement|表示某个类或接口的方法、构造方法或初始化程序（静态或实例），包括注解类型元素。|
|PackageElement|表示一个包程序元素。提供对有关包及其成员的信息的访问。|
|TypeElement|表示一个类或接口程序元素。提供对有关类型及其成员的信息的访问。注意，枚举类型是一种类，而注释类型是一种接口。|
|TypeParameterElement|表示一般类、接口、方法或构造方法元素的形式类型参数。|
|VariableElement|表示一个字段、enum 常量、方法或构造方法参数、局部变量或异常参数。|

我们通过一个代码示例看一下：

```java
package com.example;	// PackageElement
public class Foo {		// TypeElement
	private int a;		// VariableElement
	private Foo other; 	// VariableElement
	public Foo () {} 	// ExecuteableElement
	public void setA ( 	// ExecuteableElement
	                 int newA	// TypeParameterElement
	                 ) {}
}
```
如果我们要判断一个元素的类型，应该使用`Element.getKind()`方法配合`ElementKind`枚举类进行判断，不要使用 instanceof 进行判断，因为比如 TypeElement 既表示类又表示一个接口。例如我们判断一个元素是不是一个类：
```java
// 错误，也有可能是一个接口
if (element instanceof TypeElement) { 
}
// 正确
if (element.getKind() == ElementKind.CLASS) { 
    //doSomething
}
```
下表为 ElementKind 枚举类中的部分常量：

|类型|说明|
|:----|:----|
|PACKAGE|一个包|
|ENUM|一个枚举类型|
|CLASS|没有用更特殊的种类（如 ENUM）描述的类|
|ANNOTATION_TYPE|一个注解类型|
|INTERFACE|没有用更特殊的种类（如 ANNOTATION_TYPE）描述的接口|
|ENUM_CONSTANT|一个枚举常量|
|FIELD|没有用更特殊的种类（如 ENUM_CONSTANT）描述的字段|
|PARAMETER|方法或构造方法的参数|
|LOCAL_VARIABLE|局部变量|
|METHOD|一个方法|
|CONSTRUCTOR|一个构造方法|
|TYPE_PARAMETER|一个类型参数|

### 类型 TypeMirror

TypeMirror 是一个接口，表示 Java 编程语言中的类型。这些类型包括基本类型、声明类型（类和接口类型）、数组类型、类型变量和 null 类型。还可以表示通配符类型参数、executable 的签名和返回类型，以及对应于包和关键字 void 的伪类型。以下类型接口全部继承自 TypeMirror 接口：

|类型|说明|
|:----|:----|
|ArrayType|表示一个数组类型。多维数组类型被表示为组件类型也是数组类型的数组类型。|
|DeclaredType|表示某一声明类型，是一个类 (class) 类型或接口 (interface) 类型。这包括参数化的类型（比如 java.util.Set<String>）和原始类型。TypeElement 表示一个类或接口元素，而 DeclaredType 表示一个类或接口类型，后者将成为前者的一种使用（或调用）。|
|ErrorType|表示无法正常建模的类或接口类型。|
|ExecutableType|表示 executable 的类型。executable 是一个方法、构造方法或初始化程序。|
|NoType|在实际类型不适合的地方使用的伪类型。|
|NullType|表示 null 类型。|
|PrimitiveType|表示一个基本类型。这些类型包括 boolean、byte、short、int、long、char、float 和 double。|
|ReferenceType|表示一个引用类型。这些类型包括类和接口类型、数组类型、类型变量和 null 类型。|
|TypeVariable|表示一个类型变量。|
|WildcardType|表示通配符类型参数。|

同样，如果我们想判断一个 TypeMirror 的类型，应该使用`TypeMirror.getKind()`方法配合`TypeKind`枚举类进行判断。尽量避免使用 instanceof 进行判断，因为比如 DeclaredType 既表示类 (class) 类型又表示接口 (interface) 类型，使用 instanceof 判断的结果可能不对。

TypeKind 枚举类中的部分常量，详细信息请查看官方文档。

|类型|说明|
|:----|:----|
|BOOLEAN|基本类型 boolean。|
|INT|基本类型 int。|
|LONG|基本类型 long。|
|FLOAT|基本类型 float。|
|DOUBLE|基本类型 double。|
|VOID|对应于关键字 void 的伪类型。|
|NULL|null 类型。|
|ARRAY|数组类型。|
|PACKAGE|对应于包元素的伪类型。|
|EXECUTABLE|方法、构造方法或初始化程序。|

### 创建文件 Filer

Filer接口支持通过注解处理器创建新文件。可以创建三种文件类型：源文件、类文件和辅助资源文件。

1. 创建源文件
```java
// 创建一个新的源文件，返回一个对象且允许写入它。
JavaFileObject createSourceFile(CharSequence name,
                                Element... originatingElements)
                                throws IOException
```
2. 创建类文件
```java
// 创建一个新的类文件，返回一个对象且允许写入它。
JavaFileObject createClassFile(CharSequence name,
                               Element... originatingElements)
                               throws IOException
```
3. 创建辅助资源文件
```java
// 创建一个用于写入的辅助资源文件，并为它返回一个文件对象。
FileObject createResource(JavaFileManager.Location location,
                          CharSequence pkg,
                          CharSequence relativeName,
                          Element... originatingElements)
                          throws IOException
```
对于生成 Java 文件，还可以使用 Square 公司的开源类库[JavaPoet](https://github.com/square/javapoet?fileGuid=XWhXYTHXC88xPXwj)，感兴趣的同学可以了解下。

### 打印错误信息 Messager

Messager 接口提供注解处理器用来报告错误消息、警告和其他通知的方式。

>注意：我们应该**对在处理过程中可能发生的异常进行捕获**，通过 Messager 接口提供的方法通知用户。此外，使用带有 Element 参数的方法连接到出错的元素，用户可以直接点击错误信息跳到出错源文件的相应行。如果你在 process() 中抛出一个异常，那么运行注解处理器的 JVM 将会崩溃（就像其他 Java 应用一样），这样用户会从 javac 中得到一个非常难懂出错信息。

|方法|说明|
|:----|:----|
|void printMessage(Diagnostic.Kind kind, CharSequence msg)|打印指定种类的消息。种类类似于 Android 中 log 的 level，有ERROR、WARNING等。|
|void printMessage(Diagnostic.Kind kind, CharSequence msg, Element e)|在元素的位置上打印指定种类的消息。有 Element 时，出错可以从错误信息直接跳到对应的位置，方便定位问题。|

### 配置选项参数

我们可以通过 getOptions() 方法获取选项参数，在gradle文件中配置选项参数值。例如我们配置了一个名为 customAnnotation的参数值。

```javascript
android {
    defaultConfig {
        javaCompileOptions {
            annotationProcessorOptions {
                arguments = [ customAnnotation: 'cc.lixiaoyu.CustomAnnotation' ]
            }
        }
    }
}
```
在注解处理器中重写 getSupportedOptions 方法指定支持的选项参数名称。通过 getOptions 方法获取选项参数值。
```java
public static final String CUSTOM_ANNOTATION = "customAnnotation";
@Override
public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
   try {
       String resultPath = processingEnv.getOptions().get(CUSTOM_ANNOTATION);
       if (resultPath == null) {
           ...
           return false;
       }
       ...
   } catch (Exception e) {
       e.printStackTrace();
       ...
   }
   return true;
}
@Override
public Set<String> getSupportedOptions() {
   Set<String> options = new LinkedHashSet<String>();
   options.add(CUSTOM_ANNOTATION);
   return options;
}
```

### 处理过程

Java 官方文档给出的注解处理过程的定义：注解处理过程是一个有序的循环过程。在每次循环中，一个处理器可能被要求去处理那些在上一次循环中产生的源文件和类文件中的注解。第一次循环的输入是运行此工具的初始输入。这些初始输入，可以看成是虚拟的第 0 次的循环的输出。这也就是说我们实现的 process 方法有可能会被调用多次，因为我们生成的文件也有可能会包含相应的注解。例如，我们的源文件为 SourceActivity.class，生成的文件为Generated.class，这样就会有三次循环：第一次输入为SourceActivity.class，输出为Generated.class；第二次输入为Generated.class，输出并没有产生新文件；第三次输入为空，输出为空。

|次数|输入|输出|
|:----|:----|:----|
|0|SourceActivity.class|Generated.class|
|1|Generated.class|null|
|2|null|null|

每次循环都会调用 process 方法，process 方法提供了两个参数，第一个是我们请求处理注解类型的集合（也就是我们通过重写 getSupportedAnnotationTypes 方法所指定的注解类型），第二个是有关当前和上一次循环的信息的环境。

process 方法的返回值表示这些注解是否由此 Processor 声明，如果返回 true，则这些注解已声明并且不要求后续 Processor 处理它们；如果返回 false，则这些注解未声明并且可能要求后续 Processor 处理它们。

```java
public abstract boolean process(Set<? extends TypeElement> annotations,
                                RoundEnvironment roundEnv)
```

### 获取注解元素

我们可以通过 RoundEnvironment 接口获取注解元素。process 方法会提供一个实现 RoundEnvironment 接口的对象。

|方法|说明|
|:----|:----|
|Set<? extends Element> getElementsAnnotatedWith(Class<? extends Annotation> a)|返回被指定注解类型注解的元素集合。|
|Set<? extends Element> getElementsAnnotatedWith(TypeElement a)|返回被指定注解类型注解的元素集合。|

了解了这些语法知识，我们就可以上手开始写代码了，我们来山寨一个Android 开发中非常常用的框架 —— ButterKnife。

## 示例：仿 ButterKnife

ButterKnife 是Android 开发者经常会使用到的一个View注入框架，可以让开发者少写很多 findViewById 的模板代码，它就用到了注解和注解处理器。这一小节我们仿照它的思路用 Kotlin 语言来实现一个简易版的 View 注入框架，命名为 CakeKnife（蛋糕刀）。在 CakeKnife 中，我们仅仅实现 @BindView 这个注解的功能，如何使用如下面代码所示，和 ButterKnife 是一样的：

```java
class MainActivity {
  @BindView(R.id.button)
  Button btnAdd;
  
  public void onCreate() {
    // 对应 ButterKnife.bind(this);
    CakeKnife.bind(this);
    btnAdd.setText("Add task");
  }
}
```

### ButterKnife 的实现拆解

既然想要仿制一个简易的 ButterKnife，我们就需要先看看 ButterKnife 是怎么实现的。

我们简略地来讲，比如对于上面这个 MainActivity，里面有一个 Button 类型的变量 btnAdd，对应 XML 中 id 为 button 的按钮。ButterKnife 会利用 APT 生成下面这样一个 Java 类：

```plain
public class MainActivity_ViewBinding {
  
  public MainActivity_ViewBinding(MainActivity target) {
    target.btnAdd = target.findViewById(R.id.button);
  }
}
```
可以看到，其实原理还是去调用 findViewById，只不过这些 findViewById 的代码是利用 APT 工具自动生成的，不需要我们去做了。
同时，生成了这个 MainActivity_ViewBinding 这个类，我们还需要去调用它，否则也不可能会生效，这里的调用其实就是去 new 一个 MainActivity_ViewBinding 对象，这样就可以执行到构造函数里的代码了，也就会进行 findViewById。这一步是通过在 onCreate 方法中调用 ButterKnife.bind(this) 来实现的。

ButterKnife.bind 中的流程如下：

* 通过参数传入的 Class，获取到当前类的类名，比如 MainActivity
* 拼接出这个类的ViewBinding类的合法类名，比如 packagename.MainActivity_ViewBinding
* 通过 ClassLoader 去加载 MainActivity_ViewBinding 类，获取到他的 Class 对象后，反射实例化一个 MainActivity_ViewBinding 对象。

框架肯定还有很多功能和细节，比如其他注解、UnBinder 接口、生成 R2 文件以便能在 Android library 中使用等， 这里就不展开，我们了解了主要实现思路就可以开始我们的山寨之旅了。

### 项目整体结构

我们来看下项目代码的整体结构：

* CakeKnife
    * app（是个 Android 的 Application，是写demo来验证的）
    * cakeknife（是个 Android Library，用来初始化 CakeKnife）
    * annotations（是个 Java 模块，用来放置所有的注解，把注解和注解处理器放在不同的库中会更合理）
    * processor（是个 Java 模块，用来放置注解处理器相关的代码）

### 定义 @BindView 注解

首先第一步我们在`annotations`模块中先定义`@BindView`这个注解：

```java
@Target(AnnotationTarget.FIELD)
@Retention(AnnotationRetention.BINARY)
annotation class BindView(val value: Int = -1)
```

### 创建 BindViewProcessor

然后，我们在 processor 模块中写一个类，叫做 BindViewProcessor，用来处理 @BindView 这个注解（processor 模块需要依赖 annotations 模块，这样才能引用到 @BindView 这个类），按照第一小节基本实现里的内容，我们可以写出以下代码：

```java
@AutoService(Processor::class)
class BindViewProcessor : AbstractProcessor() {
    private lateinit var elementUtils: Elements // 对 Element 的工具类
    private lateinit var typeUtils: Types  // 对 TypeMirror 的工具类
    private lateinit var filer: Filer  // 用来创建文件
    private lateinit var messager: Messager  // 用来打印错误信息
    override fun init(processingEnv: ProcessingEnvironment?) {
        super.init(processingEnv)
        if (processingEnv == null) {
            return
        }
        elementUtils = processingEnv.elementUtils
        typeUtils = processingEnv.typeUtils
        filer = processingEnv.filer
        messager = processingEnv.messager
    }
    override fun process(set: MutableSet<out TypeElement>?,
                         roundEnv: RoundEnvironment?): Boolean {
        return true
    }
    override fun getSupportedAnnotationTypes(): MutableSet<String> {
        val annotations = mutableSetOf<String>()
        annotations.add(BindView::class.java.canonicalName)
        return annotations
    }
    override fun getSupportedSourceVersion(): SourceVersion {
        return SourceVersion.latestSupported()
    }
}
```

### 扫描收集注解信息

在 process 方法中我们需要做以下几件事：

1. 对代码进行扫描，收集到所有使用 @BindView 注解的元素。参考前文，我们使用`roundEnvironment.getElementsAnnotatedWith(BindView::class.java)`来获取。
2. 对所有收集到的被注解修饰的元素按照所在类来分组，比如 AActivity 中有两个变量用 @BindView 修饰，BActivity 中有三个变量用 @BindView 修饰，我们需要把 AActivity 和 BActivity 中的 5 个变量分组处理。
3. 每一组对应一个类，里面有多个 @BindView 注解修饰的元素，给每个类生成 ViewBinding  类，比如，给 AActivity 和 BActivity 生成 AActivity_ViewBinding、 BActivity_ViewBinding 类。

代码如下所示：

```java
class BindViewProcessor : AbstractProcessor() {
    
    override fun process(set: MutableSet<out TypeElement>?,
                         roundEnv: RoundEnvironment?): Boolean {
        if (roundEnv == null) {
            error(null, "roundEnv is null")
        }
        processBindView(roundEnv!!)
        return true
    }
    /*
     * 处理 @BindView 注解
     */
    private fun processBindView(roundEnv: RoundEnvironment) {
        // 获取所有使用了BindView注解的元素
        val bindViewElements = roundEnv.getElementsAnnotatedWith(BindView::class.java)
        // 根据不同的类来对使用了注解的元素进行分组，每一个类创建一个ViewBinding类
        val groupedElement = groupingElementWithType(bindViewElements)
        // 生成ViewBinding类的Java代码
        generateViewBindingClasses(groupedElement)
    }
    /**
     * 打印错误信息的方法
     */
    private fun error(element: Element?, msg: String, vararg args: Any?) {
        messager.printMessage(Diagnostic.Kind.ERROR, String.format(msg, args), element)
    }
}
```
先来看看分组的代码，都添加了比较详细的注释：
```java
/**
 * 对所有加了注解的元素按类名进行分组
 */
private fun groupingElementWithType(eleSet: Set<Element>): Map<TypeElement, ArrayList<Element>> {
    // 定义了一个 <Class, List<Element>> 的map，属于同一个类的被 @BindView 修饰的元素都会被添加到list中
    val groupedElement = HashMap<TypeElement, ArrayList<Element>>()
    // 遍历所有被 @BindView 修饰的元素
    for (item in eleSet) {
        // 检查使用注解元素的合法性（只能是变量，不能加private和final修饰符）
        checkAnnotationLegal(item)
        // 获取到这个元素所在类元素信息
        val enclosingElement = item.enclosingElement as TypeElement
        // 如果这个类已经在map中有了，就直接添加到对应的list中
        if (groupedElement.containsKey(enclosingElement)) {
            groupedElement[enclosingElement]?.add(item)
        } else {
            // 如果这个类在map中没有，就put到map中，并新建一个list用来存放这个元素
            val list = ArrayList<Element>()
            list += item
            groupedElement[enclosingElement] = list
        }
    }
    // 返回这个分组结果
    return groupedElement
}
```
里面有个 checkAnnotationLegal 方法，这个方法的作用就是检查我们 @BindView 用的对不对，我们知道 @BindView 只能用来修饰成员变量，并且这个成员变量不能是 private（如果是 private，在 ViewBinding 类中就无法直接获取并赋值了），不能是 final 的（如果是 final 的，在定义这个变量的时候就已经赋了初始值 null，不能再次赋值了）。
```java
/**
 * 检查@BindView注解修饰的变量进行合法检查
 * @param element
 */
private fun checkAnnotationLegal(element: Element) {
    // 首先看注解修饰的是不是变量
    if (element.kind != ElementKind.FIELD) {
        throw RuntimeException("@BindView must in filed! Current kind is " + element.kind)
    }
    // 获取元素的修饰符
    val modifiers = element.modifiers
    // 看修饰符中有没有 final
    if (modifiers.contains(Modifier.FINAL)) {
        throw RuntimeException("@BindView filed can not be final")
    }
    // 看修饰符中有没有 private
    if (modifiers.contains(Modifier.PRIVATE)) {
        throw RuntimeException("@BindView filed can not be private")
    }
}
```
给所有元素进行合法性检查和分组后，我们就完成了收集注解信息的步骤，接下来就是来利用这些信息生成 Java 代码，也就是生成对应的 XXX_ViewBinding 类。

### 生成 ViewBinding 类

我们可以参考前文使用 Filer 的原生 API 来直接生成 Java 代码，不过现在用的最广泛的还是[Javapoat](https://github.com/square/javapoet?fileGuid=XWhXYTHXC88xPXwj)库，这是 Square 公司开源的 Java 代码生成框架，同样有 Jake Wharton 的参与。Javapoat  可以用面向对象的方式来生成 Java 代码，非常的 Amazing。Javapoat 的用法参见这篇文章：[JavaPoet 看这一篇就够了](https://juejin.cn/post/6844903475776585741?fileGuid=XWhXYTHXC88xPXwj)

我们来看看 generateViewBindingClasses 方法中的代码：

```java
private fun generateViewBindingClasses(groupedElement: Map<TypeElement, ArrayList<Element>>) {
    // 遍历每一个类
    val keySet = groupedElement.keys
    for (classItem in keySet) {
        // 创建一个XXActivity_ViewBinding辅助类
        val typeBuilder = makeTypeSpecBuilder(classItem)
        // 创建辅助类的构造函数
        val constructorBuilder = makeConstructor(classItem)
        // 生成构造函数中的代码
        buildConstructorCode(constructorBuilder, groupedElement[classItem])
        // 把构造函数加到创建的辅助类中
        typeBuilder.addMethod(constructorBuilder.build())
        // 生成一个Java文件
        val file = JavaFile.builder(getPackageName(classItem), typeBuilder.build()).build()
        // 写入该Java文件
        file.writeTo(this.processingEnv.filer)
    }
}
```
思路非常清晰，我们遍历 map，拿到分组的每一个类，给这个类（比如叫 MainActivity），生成如下的代码，注释也写的比较清楚：
```java
public class MainActivity_ViewBinding {
  public MainActivity_ViewBinding(MainActivity target) {
    target.btnAdd = target.findViewById(R.id.button);
  }
}
```
依次看看创建 ViewBinding 类对象、构造函数对象、构造函数代码的方法：
```java
/**
 * 创建一个XXActivity_ViewBinding辅助类，生成的代码如下所示：
 *
 * public class MainActivity_ViewBinding {
 *
 * }
 */
private fun makeTypeSpecBuilder(classItem: TypeElement): TypeSpec.Builder {
    return TypeSpec.classBuilder("${classItem.simpleName}_ViewBinding")
            .addModifiers(Modifier.PUBLIC)
}
/**
 * 创建一个构造函数，传入一个类型是目标Activity的形参target，生成的代码如下所示：
 *
 * public XXActivity_ViewBinding(MainActivity target) {
 *  
 * }
 */
private fun makeConstructor(classItem: TypeElement): MethodSpec.Builder {
    val typeMirror = classItem.asType()
    return MethodSpec.constructorBuilder()
            .addModifiers(Modifier.PUBLIC)
            .addParameter(TypeName.get(typeMirror), "target")
}
/**
 * 生成构造函数中的代码
 * 对这个类中每个加了注解的控件属性进行findViewById的初始化
 * 生成的代码如下所示：
 *
 * target.mTextView = target.findViewById(2131165289);
 */
private fun buildConstructorCode(bindMethodBuilder: MethodSpec.Builder, elements: ArrayList<Element>?) {
    elements?.let {
        for (itemView in elements) {
            bindMethodBuilder.addStatement("target.$itemView = " +
                    "target.findViewById(${itemView.getAnnotation(BindView::class.java).value})")
        }
    }
}
/**
 * 获取类的包名
 */
private fun getPackageName(typeElement: Element): String {
    var ele = typeElement
    while(ele.kind != ElementKind.PACKAGE){
        ele = ele.enclosingElement
    }
    return (ele as PackageElement).qualifiedName.toString()
}
```
到这里，我们的处理 @BindView 的注解处理器就写完了，下一步就是实现 CakeKnife 的绑定部分逻辑。

### CakeKnife.bind()

我们在 cakeknife 模块中创建一个名为 CakeKnife 的单例类，提供 bind 方法，在 bind 方法中查找 XXXActivity 的 ViewBinding 类，并实例化这个类：

```java
package cc.lixiaoyu.cakeknife
import android.app.Activity
import java.lang.RuntimeException
import java.lang.reflect.Constructor
object CakeKnife {
    @JvmStatic
    fun bind(activity: Activity) {
        // 拿到当前绑定的类
        val targetClass = activity::class.java
        // 通过类名找到APT生成的XXActivity_ViewBinding类的构造函数
        val constructor = findBindingConstructorForClass(targetClass)
        // 通过反射来创建一个实例，在构造函数中调用findViewById来绑定控件。
        constructor?.newInstance(activity)
    }
    private fun findBindingConstructorForClass(cls: Class<*>?) : Constructor<*>?{
        cls?.let {
            // 获取到类名
            val clsName = cls.name
            return try {
                // 通过ClassLoader来加载这个APT生成的类
                val bindingClass = cls.classLoader?.loadClass(clsName + "_ViewBinding")
                // 获取到这个类的构造函数
                bindingClass?.getConstructor(cls)
            } catch (e: ClassNotFoundException) {
                // 如果没有找到这个类，则传入父类继续查找
                findBindingConstructorForClass(cls.superclass)
            } catch (e: NoSuchMethodException) {
                // 如果这个类没有构造方法，则抛出异常
                throw RuntimeException("Unable to find binding constructor for $clsName")
            }
        }
        return null
    }
}
```
findBindingConstructorForClass 方法就是传入待绑定的类，拿到类名，然后拼上固定的 _ViewBinding 的固定后缀确定 ViewBinding 类的完整类名，通过 ClassLoader 来查找这个类，并获取到这个类的构造函数，如果没有找到，就一直用它的父类来找，直到找到 Object。如果找到的话，调用 newInstance 方法来创建一个 ViewBinding 类的实例，执行 findViewById 的代码。
大功告成，我们终于完成了一个自己的 View 注入框架，虽然它很简略，但不妨碍它确实可以实现 ButterKnife 一样的 BindView 的功能。

### 测试

现在我们就实际来测试一下 CakeKnife 是否可用，在 app 模块的 build.gradle 文件中添加以下几个依赖：

```java
dependencies {
    // 添加这个依赖，可以调用 CakeKnife.bind()
    implementation project(path: ':cakeknife')
    // 添加这个依赖，可以引用到@BindView注解
    implementation project(path: ':annotations')
    // 添加这个依赖，注解处理器BindViewProcessor就可以工作了
    annotationProcessor project(path: ':processor')
}
```
在 app 模块中创建一个 MainActivity：
```java
public class MainActivity extends AppCompatActivity {
    @BindView(R.id.main_textview)
    public TextView mTextView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        CakeKnife.bind(this);
        mTextView.setText("Owen");
    }
}
```
代码非常简单，和ButterKnife的用法是一样的，想必大家都不陌生。

对应的 XML文件（activity_main.xml）内容如下，一个 TextView 居中放置：

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context="cc.lixiaoyu.demo.MainActivity">
    <TextView
        android:id="@+id/main_textview"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello World!"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />
</androidx.constraintlayout.widget.ConstraintLayout>
```
运行一下，效果如下：
![image](https://i.loli.net/2021/03/31/zwsHWCEoUrI3ZFn.png)

可以看到，TextView 的 setText 被正确执行了，证明我们的 CakeKnife 确实生效了。

项目的完整代码放在了 github 上，链接：[https://github.com/owenleexiaoyu/CakeKnife](https://github.com/owenleexiaoyu/CakeKnife?fileGuid=XWhXYTHXC88xPXwj)

## 参考资料

* 注解处理器

[[推荐] Annotation Processing 101](http://hannesdorfmann.com/annotation-processing/annotationprocessing101/?fileGuid=XWhXYTHXC88xPXwj)

[[译] Java注解处理器](https://www.race604.com/annotation-processing/?fileGuid=XWhXYTHXC88xPXwj)

[自定义Java注解处理器](https://www.jianshu.com/p/50d95fbf635c/?fileGuid=XWhXYTHXC88xPXwj)

* 仿制 ButterKnife

[注解处理器（APT）了解一下](https://mp.weixin.qq.com/s/U0STkNpcCO21OXfOkjuybg?fileGuid=XWhXYTHXC88xPXwj)

* Javapoat 用法

[JavaPoet 看这一篇就够了](https://juejin.cn/post/6844903475776585741?fileGuid=XWhXYTHXC88xPXwj)

[暴力突破 Android 编译插桩（四）- APT 之 JavaPoet 使用](https://blog.csdn.net/u010289802/article/details/103280110?fileGuid=XWhXYTHXC88xPXwj)

