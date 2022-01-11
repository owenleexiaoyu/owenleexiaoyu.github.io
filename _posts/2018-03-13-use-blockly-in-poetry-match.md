---
layout: post
title: 利用 Blockly 实现诗歌匹配场景
tag: ["Blockly4Android"]
categories: 技术
date: 2018-03-13 17:37
cover: http://image.wufazhuce.com/FqIXhl149Pj1AftgRFBOxiC2MXwz
---

### 前言

在 KidProgramming 这个项目中，第一模块适用于儿童启蒙，我们设计一些知识主题，如动物百科、古诗阅读等，让小朋友了解一些知识。在学习过一些知识后，我们给他们设计了挑战环节，这个环节中就将 Blockly 运用进来，从学过的知识中抽取一些，做成一些 Blockly 的块，让儿童拖拽这些块进行拼接，比如将一首诗的正确诗句以正确的顺序拼到相应的诗名里。

刚刚进入这个 Activity 是这样的：

![img1.png](https://i.loli.net/2019/08/29/c8sNagF5XmzDWQo.jpg)

拼好后，点击运行，是这样的：

![img2.png](https://i.loli.net/2019/08/29/OliM8I12Y9SNBgX.jpg)

### 实现流程

#### 1. 定义所需的块

在 Blockly 中有许多已经定义好的内置块，比如：

![img3.png](https://i.loli.net/2019/08/29/zZaQgD6AHtYbF8B.jpg)

而我们要实现自己设计的场景，就需要我们自己去定义需要的块。从演示图中可以看出，这里一共有三种不同的块。有左凸的诗名块（下图第二个），有上下连接点诗句块（下图第三个）和放置诗名和诗句的框架块（下图第一个）

![img4.png](https://i.loli.net/2019/08/29/A8rGYRcq6PSuXdy.jpg)

定义一个块有两种形式，一种是 Json，一种是 JS 代码，因为 Json 具有跨平台的特点，所以是首选的块定义形式，也是 Android 中唯一的定义方式。

下面是第一个块定义的 Json文本：

```
{
    "type": "poetry",
    "message0": "诗名： %1 内容： %2",
    "args0": [
      {
        "type": "input_value",
        "name": "TITLE"
      },
      {
        "type": "input_statement",
        "name": "CONTENT"
      }
    ],
    "colour": 120,
    "tooltip": "",
    "helpUrl": ""
  }
```

关于 Json代码中各个属性的含义，请参考官方文档中的块定义部分。

进行块的定义时，可以直接写 Json 代码（有点难），也可以借助一个网站（需要翻墙）——「[Blockly开发者工具](https://blockly-demo.appspot.com/static/demos/blockfactory/index.html)」，在这里可以用可视化的方式来创建一个块，可以直接看到块的预览形状。我们最后只需要将自动形成的 Json 代码复制下来，应用到项目中去即可。

具体的操作方法见官方文档「Blockly 开发者工具」篇， 去网站上练习几次即可掌握。

将所有用到的块的 Json 代码写在一个 .json 类型的文件中，放在项目的 assets 目录下。

#### 2. 创建 Toolbox（工具栏）文件

在这个场景中我们的块都是直接生成在工作区中，Toolbox 中并没有放置块。所以我们直接创建一个名为 toolbox.xml 的文件，放在 assets 目录下，内容为：
```
<toolbox></toolbox>
```

就可以满足需要了。在其他的场景中如果需要用到工具栏，则需要在 toolbox.xml 文件中填入相应块的引用，便于用户可以直接从工具栏中拖出想要的块。具体如何写 Toolbox 文件，请看官方文档 Toolbox 相关内容。

#### 3. 创建生成器函数

每个块都对应一个用 JS 编写的生成器函数，在这个函数中将这个块转化为一段字符串类型的代码。这个代码我们将在 Activity 的回调中用到，判断是否匹配正确。如果我们使用 「Blockly开发者工具」，我们可以在网页上直接复制一个块的生成器函数模版，然后再自定义。一个 type 为 poetry 的块的生成器函数如下：

```
Blockly.JavaScript['poetry'] = function(block) {
    var title = Blockly.JavaScript.statementToCode(block, 'TITLE').substring(2);
    var content = Blockly.JavaScript.statementToCode(block, 'CONTENT').substring(2);
    
    return title+'='+content;
};
```

上面的代码表示，获取到这个块接收的古诗的标题和内容，用等号进行拼接，返回拼接后的字符串。将所有块的生成器函数写在一个 JS 文件中，放在 assets 目录下。

#### 4. 建立数据实体类和数据库

在这个场景中，我们会有很多的古诗，所以需要一个数据库。我们在这个项目中使用 Litepal 这个第三方库来帮助创建数据库。关于 Litepal 的使用在这里不赘述，重点在于数据实体类的创建。下面是诗歌实体类中的成员变量：

```
private int id;
private String title;//标题
private String writor;//作者
private List<String> contents;//内容
private String dynasty;//作者朝代
private int level; //根据诗歌的难易程度所划分的等级，分为1-6,1最简单，6最难。
```

我们将收集的古诗素材按照一定的规则整理成一个文件，然后在应用启动时将这个文件中的所有古诗都加载到数据库中，便于之后的出题和判断匹配正误。

这里我们写了一个数据工具类 DataUtil，定义了一个抽象方法，遍历这个古诗素材文件，按照规则提取出每首诗的标题、作者等信息，保存进数据库中：
```
public static void initPoetryDataBase(Context context) {
    //先清空该数据库中所有的古诗
    DataSupport.deleteAll(Poetry.class);
    try{
        InputStream is = context.getAssets().open("poetry/poetry.txt");
        BufferedReader br=new BufferedReader(new InputStreamReader(is));
        String line="";
        while ((line=br.readLine())!=null) {
            String[] arrs=null;//备用数组
            Poetry p=new Poetry();
            arrs=line.split(">");
            p.setLevel(Integer.parseInt(arrs[0]));
            p.setTitle(arrs[1]);
            p.setWritor(arrs[2]);
            p.setDynasty(arrs[3]);
            List<String> contents = new ArrayList<>();
            for(int i = 4; i<arrs.length;i++){
                contents.add(arrs[i]);
            }
            p.setContents(contents);
            p.save();
        }
        br.close();
        is.close();
    } catch (FileNotFoundException e) {
        e.printStackTrace();
    } catch(IOException e){
        e.printStackTrace();
    }
}
```

#### 5.  初始化Activity

新建一个 Activity 继承自 AbstractBlocklyActivity 或者 BlocklySectionsActivity（继承这个用于实现关卡）。这里就继承 AbstractBlocklyActivity。覆盖父类的抽象方法。

```
	//添加js生成器函数路径
	private static final List<String> JAVASCRIPT_GENERATORS = Arrays.asList(
            "generator.js"              
    );
    //点击run后的回调
    CodeGenerationRequest.CodeGeneratorCallback mCodeGeneratorCallback = 
            new CodeGenerationRequest.CodeGeneratorCallback() {
        @Override
        public void onFinishCodeGeneration(String generatedCode) {
           //这里面写匹配是否正确的判断逻辑 
        }
    };
	/**
     * 工具栏
     * @return toolbox的路径
     */
    @Override
    protected String getToolboxContentsXmlPath() {
        return "poetry/toolbox.xml";
    }

    /**
     * 此函数用于添加定义block块的路径，路径为json文件
     * @return block块的集合
     */
    @Override
    protected List<String> getBlockDefinitionsJsonPaths() {
        List<String> assetPaths = new ArrayList<>();
        assetPaths.add("poetry/poetry.json");
        return assetPaths;
    }
	//添加js生成器函数路径
    @Override
    protected List<String> getGeneratorsJsPaths() {
        return JAVASCRIPT_GENERATORS;
    }

    @Override
    protected CodeGenerationRequest.CodeGeneratorCallback getCodeGenerationCallback() {
        return mCodeGeneratorCallback;
    }
```

在这步中，我们将一个 Activity 初始化成了一个具有 Blockly 工具栏、工作区等组件的 BlocklyActivity。接下来就是实现场景的具体功能。

#### 6. 从数据库中提取数据封装成工作区中的块

在第二步中提到我们这个场景中没有用到 Toolbox，因为我们所有的块都是在 Activity 初始化的时候直接加载到工作区中的。

实现随机出题的思路是：根据指定的古诗难度，从数据库中随机选取两首对应难度的古诗，使用一个工具类将这两首古诗的标题、所有诗句都封装成我们定义好的 Blockly 块，写入一个临时文件中。在 Activity 初始化时，从这个临时文件中加载所有的块，填充到工作区中，具体的代码如下：

```
/**
     * 针对整诗匹配场景来生成XML文件
     * 根据传入的level的值从数据库中随机选择响应level的诗歌来生成XML文件，写入fos流所在的文件中
     * @param fos
     * @param level
     */
    public static void generateWholePoetryXML(FileOutputStream fos, int level){
        List<Poetry> poetryList = DataSupport.where("level = ?",level+"").find(Poetry.class);
        Random random = new Random(System.currentTimeMillis());
        try {
            //获取XmlSerializer对象
            XmlPullParserFactory factory = XmlPullParserFactory.newInstance();
            XmlSerializer xmlSerializer = factory.newSerializer();
            //设置输出流对象
            xmlSerializer.setOutput(fos, "utf-8");
            //文档开始
            xmlSerializer.startDocument("utf-8", true);
            //开始一个标签
            xmlSerializer.startTag(null,"toolbox");
            for(int i = 0; i< 2;i++){
                int index = random.nextInt(poetryList.size());
                Poetry p = poetryList.get(index);
                xmlSerializer.startTag(null,"block");
                xmlSerializer.attribute(null, "type","poetry");
                xmlSerializer.startTag(null,"value");
                xmlSerializer.attribute(null, "name","TITLE");
                xmlSerializer.startTag(null,"block");
                xmlSerializer.attribute(null, "type","poetry_title");
                xmlSerializer.startTag(null,"field");
                xmlSerializer.attribute(null,"name","TITLE");
                xmlSerializer.text(p.getTitle());
                xmlSerializer.endTag(null,"field");
                xmlSerializer.endTag(null,"block");
                xmlSerializer.endTag(null,"value");
                xmlSerializer.endTag(null,"block");
                for(String c : p.getContents()){
                    xmlSerializer.startTag(null,"block");
                    xmlSerializer.attribute(null,"type","poetry_contents");
                    xmlSerializer.startTag(null,"field");
                    xmlSerializer.attribute(null,"name","CONTENT");
                    xmlSerializer.text(c);
                    xmlSerializer.endTag(null,"field");
                    xmlSerializer.endTag(null,"block");
                }
            }
            //每一个endTag对应的startTag
            xmlSerializer.endTag(null,"toolbox");
            xmlSerializer.endDocument();

        } catch (XmlPullParserException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
```

这是 Util 工具类中的一个静态方法，本质上是依照一个 Toolbox 的书写形式来用动态生成一个 XML 文件，以达到写入动态数据的目的。

```
/**
     * 根据不同的level加载不同难度的诗歌。
     * @param level
     */
    private void reLoadPoetrys(int level) {
        //重置工作空间
        getController().resetWorkspace();
        //进行动态权限申请
        if (ContextCompat.checkSelfPermission(PoetryBlocklyActivity.this,
                Manifest.permission.WRITE_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(PoetryBlocklyActivity.this,
                    new String[] {Manifest.permission.WRITE_EXTERNAL_STORAGE},1);
        } else {
            load(level);
        }
    }
    /**
     * 初始化工作区时将块散乱排列
     */
    public void load(int level){
        File directory = Environment.getExternalStorageDirectory();
        File file = new File(directory,"poetry_workspace.xml");
        if(file.exists()){
            file.delete();

        }
        try {
            file.createNewFile();
        } catch (IOException e) {
            e.printStackTrace();
        }
        try {
            FileOutputStream fos = new FileOutputStream(file);
            Util.generateWholePoetryXML(fos,level);
            fos.close();
            FileInputStream fis = new FileInputStream(file);
            //加载指定XML文件中的块
            List<Block> blocks = BlocklyXmlHelper.loadFromXml(fis,
                    getController().getBlockFactory());

            //将块打乱排列
            for (int i = 0; i < blocks.size(); i++) {
                Block copiedModel = blocks.get(i).deepCopy();
                copiedModel.setPosition((int) (Math.random() * CARPET_SIZE) - CARPET_SIZE / 2,
                        (int) (Math.random() * CARPET_SIZE) - CARPET_SIZE / 2);
                getController().addRootBlock(copiedModel);
            }
            fis.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (BlockLoadingException e) {
            e.printStackTrace();
        }

    }

    /**
     * 动态权限申请结果回调
     * @param requestCode
     * @param permissions
     * @param grantResults
     */
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        switch (requestCode){
            case 1:
                if(grantResults.length > 0 &&
                        grantResults[0] == PackageManager.PERMISSION_GRANTED){
                    Toast.makeText(this, "允许了权限", Toast.LENGTH_SHORT).show();
                    load(currentLevel);
                }else{
                    Toast.makeText(PoetryBlocklyActivity.this, "你拒绝了权限申请", Toast.LENGTH_SHORT).show();
                }
                break;
        }
    }
```

上面代码中一共是三个方法，reLoadPoetrys() 方法主要是进行一个动态权限的申请，因为我们会在手机的储存卡中生成一个临时的文件，所以需要进行权限申请。

load() 方法是真正实现在工作区中加载指定的块并且支持随机散乱排列的一个方法。首先在手机储存卡中创建一个临时的文件，然后使用之前的工具类往这个文件中写入动态的内容，之后使用 **List< Block > blocks = BlocklyXmlHelper.loadFromXml(fis, getController().getBlockFactory());** 这行代码将这个文件中的对块的引用转化成一个一个 Block 实体类。这个方法是在 Blockly 的核心库中实现好的，我们可以直接拿来用。之后对返回的列表中的每个块进行一个深拷贝，然后为拷贝对象指定一个随机的工作区位置。这样就实现了块在工作区中散乱排列。最后使用 **getController().addRootBlock(copiedModel);** 这行代码将所有的块加入到工作区中，实现最终的出题效果。

onRequestPermissionsResult（）是权限申请的回调方法，这里不多说。

最后，我们只需要在 Activity 初始化的时候或者变换当前关卡时，调用 reLoadPoetrys() 这个方法即可。

```
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        reLoadPoetrys(currentLevel);
    }
```

#### 7. 实现多重关卡

其实通过上面这些方法的铺垫，实现多重关卡非常简单，只需要修改 reLoadPoetrys() 这个方法的传入参数即可。（这个方法的参数是当前的关卡数，也是要所选古诗的难度，两者是一一对应的）

修改我们的 Activity，让它继承自 BlocklySectionsActivity，这时需要多覆盖两个父类的抽象方法，之前覆盖的抽象方法都不用做修改，因为 BlocklySectionsActivity 也是 AbstractBlocklyActivity 的一个子类。

```
    /**
     * 创建等级不同的section，实现诗歌难易递进闯关
     * @return
     */
    @NonNull
    @Override
    protected ListAdapter onCreateSectionsListAdapter() {
        String[] levelNames = new String[6];
        for (int i = 0; i < 6; ++i) {
            levelNames[i] = "关卡 " + (i + 1);
        }
        return new ArrayAdapter<>(this,
                android.R.layout.simple_list_item_activated_1,
                android.R.id.text1,
                levelNames);
    }

    /**
     * section改变时的回调
     * @param oldSection
     * @param newSection
     * @return
     */
    @Override
    protected boolean onSectionChanged(int oldSection, int newSection) {
        currentLevel = newSection+1;
        Log.i(TAG, "onSectionChanged: oldsection="+oldSection+",newsection="+newSection);
        reLoadPoetrys(currentLevel);
        return true;
    }
```

在 onCreateSectionsListAdapter（）这个方法里面创建了六个关卡，然后在点击了不同的 section 时调用 reLoadPoetrys（）方法，传入当前的 level 值即可。

#### 8. 编写匹配判断逻辑

经过之前的这些工作，我们已经可以得到一个比较完美的界面，在工作区中可以随机排列两首古诗的标题和句子等待着拼接匹配。但是我们还没有说最为关键的一步，就是编写判断逻辑。即如何判断这些块是拼对了还是拼错了，只有将这个逻辑写出来，这个场景才算真正活过来。在第五步初始化 Activity 时，有一个 CodeGeneratorCallback 我们一直没有理会，我们的判断逻辑其实就是写在这个匿名内部类中。

```
//点击run后的回调
    CodeGenerationRequest.CodeGeneratorCallback mCodeGeneratorCallback = 
            new CodeGenerationRequest.CodeGeneratorCallback() {
        @Override
        public void onFinishCodeGeneration(String generatedCode) {
           //这里面写匹配是否正确的判断逻辑 
        }
    };
```
上面这个 mCodeGeneratorCallback 是一个匿名内部类的引用，这个匿名内部类实现了 CodeGeneratorCallback 这个接口，onFinishCodeGeneration（）是一个回调，当点击运行按钮时，这个回调方法就会被触发。这个回调方法所携带的参数是各个块的生成器函数的返回值拼接成的一个字符串。我们就是通过分离这个字符串来取得相关信息，以此来进行逻辑的编写。

```
public final CodeGenerationRequest.CodeGeneratorCallback mCodeGeneratorCallback =
            new CodeGenerationRequest.CodeGeneratorCallback() {//用户按下运行按钮式打出一个toast,打出的是转换的js代码
                @Override
                public void onFinishCodeGeneration(final String generatedCode) {
                    Log.i(TAG, "generatedCode:\n" + generatedCode);
                    String[] codes = generatedCode.split("\n");
                    String finalResult = "";//存放结果集toast语句
                    for (int i = 0; i < codes.length; i++) {
                        if (codes[i].equals("")) {//发现题的题目脱出后，返回的generationCode会多空出一行
                            continue;
                        }
                        if (!codes[i].contains("=")) {//没有等号证明不是一首具体的诗
                            finalResult += (codes[i] + " 不能构成一首诗歌\n");
                            continue;
                        }
                        String[] result = codes[i].split("=");
                        if (result.length == 1) {//只有一个空的框架，题目和内容都没有填
                            finalResult += ("这个框架什么都没有\n");
                            continue;
                        }
                        String title = result[1];
                        List<Poetry> ps = DataSupport.where("title = ?", title).find(Poetry.class);
                        if (ps == null || ps.size() == 0) {
                            Log.i(TAG, "执行第几次循环？" + i);
                            finalResult += (title + "没有这首诗\n");
                            // Toast.makeText(MyBlocklyActivity.this, "没有这首诗", Toast.LENGTH_SHORT).show();
                            Log.i(TAG, "此时的finalrusult为？" + finalResult);
                        } else {
                            //查找到这首诗歌
                            Poetry p = ps.get(0);
                            StringBuffer sb = new StringBuffer();
                            //查询这首诗歌的所有内容
                            List<String> cts = p.getContents();
                            //将list形式的内容转化成字符串形式。
                            for (String c : cts) {
                                sb.append(c);
                            }
                            String content = sb.toString();
                            if (result.length < 3) {//判断出是否是没有填内容的
                                finalResult += (title + "这首诗并没有完成\n");
                            } else if (content.equals(result[2])) {
                                finalResult += (title + "匹配正确\n");
                            } else {
                                finalResult += (title + "匹配错误\n");
                            }

                        }

                    }
                    Toast.makeText(PoetryBlocklyActivity.this, finalResult, Toast.LENGTH_SHORT).show();
                }
            };
```

每个场景的设计不同，它所需要的判断逻辑也不相同，所以需要根据实际的场景来编写相应的逻辑，并且在编写逻辑的过程中要尽量考虑到各种可能的情形，要具备一定的容错性。

#### 结语

上述就是利用 Blockly 进行一个实际的场景开发的实例，其实熟知了 Android 平台下 Blockly 的整体执行逻辑后，你会发现所有场景开发的步骤都是类似的。当然，要想实现一些比较复杂的功能，比如这个例子中的随机出题和块在工作区中散乱排列，还是需要多研究官方给的 demo 和底层的源码。