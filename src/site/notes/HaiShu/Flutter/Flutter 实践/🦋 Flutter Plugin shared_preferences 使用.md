---
{"dg-publish":true,"permalink":"/HaiShu/Flutter/Flutter 实践/🦋 Flutter Plugin shared_preferences 使用/","tags":["编程","Flutter"],"noteIcon":"","created":"2022-02-15","updated":"2026-07-02T10:43:24.471+08:00"}
---

在 Flutter 中如果想保存一些简单的数据，我们需要使用 [shared_preferences](https://pub.dev/packages/shared_preferences) 插件，它可以用来持久化 key-value 格式的数据。

`shared_preferences` 插件在 Android 上使用 SharedPreferences，iOS 上使用 NSUserDefaults，数据会异步地存到设备磁盘中。
## 使用方式

1.  在 pubspec.yaml 中添加 `shared_preferences` 的依赖。

```yaml
flutter:
	shared_preferences: ^2.0.8
```

2.  获取 SharedPreferences 实例，注意 getInstance() 返回的是 `Future<SharedPreferences>` 类型。如果在一个 Widget 中需要多次获取实例来调用时，可以在 initState 方法中获取到存到变量中。

```dart
SharedPreferences prefs = await SharedPreferences.getInstance();
```

3.  调用 SharedPreferences 的读写方法

```dart
/// 读方法
// 返回所有的key
Set<String> getKeys();
// 返回一个key的值，不确定类型
Object? get(String key);
bool? getBool(String key);
int? getInt(String key);
double? getDouble(String key);
String? getString(String key);
List<String>? getStringList(String key);

/// 写方法
Future<bool> setBool(String key, bool value);
Future<bool> setInt(String key, int value);
Future<bool> setDouble(String key, double value);
Future<bool> setString(String key, String value);
Future<bool> setStringList(String key, List<String> value);
Future<bool> remove(String key);
Future<bool> clear();
```

## 示例

我们写一个类似于 Flutter 官方模版的计数器示例，按下 FloatingButton 时，count 会增加 1，和模板不同的是，我们的示例中，count 会被保存到设备的磁盘中，下次打开这个计数器，依然会显示之前的 count。

```dart
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SpPluginLibPage extends StatefulWidget {
  @override
  _SpPluginLibPageState createState() => _SpPluginLibPageState();
}
class _SpPluginLibPageState extends State<SpPluginLibPage> {
  static const String KEY_COUNT = "sp_key_count";
  /// 计数值
  int count = 0;
  Future<SharedPreferences> spFuture = SharedPreferences.getInstance();

  @override
  void initState() {
    super.initState();
    readCount();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("SharedPreferences Demo"),
      ),
      body: Padding(
        padding: EdgeInsets.all(20),
        child: Center(
          child: Text(
            "你一共点击了 $count 次"
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          storeCount(count + 1);
        },
        child: Icon(Icons.add),
      ),
    );
  }

  void readCount() async {
    SharedPreferences sp = await spFuture;
    setState(() {
      count = sp.getInt(KEY_COUNT) ?? 0;
    });
  }

  void storeCount(int count) async {
    SharedPreferences sp = await spFuture;
    await sp.setInt(KEY_COUNT, count);
    setState(() {
      this.count = count;
    });
  }
}
```

## 源码解读

接下来来看看这个插件的相关源码，理解插件内部的工作机制。

先来看 `SharedPreferences.getInstance()` 方法：

```dart
static Future<SharedPreferences> getInstance() async {
  if (_completer == null) {
    final completer = Completer<SharedPreferences>();
    try {
      final Map<String, Object> preferencesMap =
          await _getSharedPreferencesMap();
      completer.complete(SharedPreferences._(preferencesMap));
    } on Exception catch (e) {
      completer.completeError(e);
      final Future<SharedPreferences> sharedPrefsFuture = completer.future;
      _completer = null;
      return sharedPrefsFuture;
    }
    _completer = completer;
  }
  return _completer!.future;
}
```

getInstance 方法中，先判断 *completer 是否为空，不为空时，直接返回它的 future；为空时，会调用 `_getSharedPreferencesMap` 方法，获取到 SP 中存储的所有 key-value，保存到 `_preferenceCache` 中，读取时，直接从内存 cache 中读取即可，速度更快，并将结果设置给* completer，方便下次直接获取实例。

再来看看 `_getSharedPreferencesMap` 方法：

```dart
static Future<Map<String, Object>> _getSharedPreferencesMap() async {
  final Map<String, Object> fromSystem = await _store.getAll();  // 1
  assert(fromSystem != null);
  // 2 Strip the flutter. prefix from the returned preferences.
  final Map<String, Object> preferencesMap = <String, Object>{};
  for (String key in fromSystem.keys) {
    assert(key.startsWith(_prefix));
    preferencesMap[key.substring(_prefix.length)] = fromSystem[key]!;
  }
  return preferencesMap;
}
```

注释 1 的位置调用了 `_store.getAll()` 从设备中获取到所有的 key-value，然后遍历这个 Map，所有前缀是 `flutter.` 的 key，去掉前缀，作为 preferencesMap 的 key，最终赋值给 \_preferenceCache，有不是 flutter. 前缀的 key，则会抛出异常。（插件会在我们自己写的 key 前面自动添加一个 flutter. 的前缀作为最终写入设备的 key）。

来看看 `_store` 是什么东西：

```dart
static SharedPreferencesStorePlatform get _store {
  
  if (_manualDartRegistrationNeeded) {
    // Only do the initial registration if it hasn't already been overridden
    // with a non-default instance.
    if (!kIsWeb &&
        SharedPreferencesStorePlatform.instance
            is MethodChannelSharedPreferencesStore) {
      if (Platform.isLinux) {
        SharedPreferencesStorePlatform.instance = SharedPreferencesLinux();
      } else if (Platform.isWindows) {
        SharedPreferencesStorePlatform.instance = SharedPreferencesWindows();
      }
    }
    _manualDartRegistrationNeeded = false;
  }

  return SharedPreferencesStorePlatform.instance;
}
```

可以看出 \_store 是个平台化的 Sp 实例，在不同的平台下，会创建不同类型的实例，如 linux 下，是 `SharedPreferencesLinux`,  windows 下，是 `SharedPreferencesWindows`，Android 和 iOS 下 是 `MethodChannelSharedPreferencesStore`，Web 里是 `SharedPreferencesPlugin`，它们都是 `SharedPreferencesStorePlatform` 的子类。

我们来看看各个平台下 `getAll` 方法的实现，以此来理解各个平台下实现持久化的机制：

**Android & iOS: MethodChannelSharedPreferencesStore**

```dart
@override
Future<Map<String, Object>> getAll() async {
  final Map<String, Object>? preferences =
      await _kChannel.invokeMapMethod<String, Object>('getAll');

  if (preferences == null) return <String, Object>{};
  return preferences;
}
```

可以看到是通过 MethodChannel 调用 Android 中 SharedPreferences 或者 iOS 中 NSUserDefaults 的相关 API 来实现的。

**Windows: SharedPreferencesWindows**

```dart
@override
Future<Map<String, Object>> getAll() async {
  return _readPreferences();
}

Future<Map<String, Object>> _readPreferences() async {
	// 如果有内存 cache，直接返回内存 cache
  if (_cachedPreferences != null) {
    return _cachedPreferences!;
  }
  Map<String, Object> preferences = {};
 	// 去读取文件 shared_preferences.json
  final File? localDataFile = await _getLocalDataFile();
  if (localDataFile != null && localDataFile.existsSync()) {
    String stringMap = localDataFile.readAsStringSync();
    if (stringMap.isNotEmpty) {
      preferences = json.decode(stringMap).cast<String, Object>();
    }
  }
  _cachedPreferences = preferences;
  return preferences;
}
```

Window 下 SharedPreferences 的数据是保存在软件数据目录下一个名为 `shared_preferences.json` 的文件中，这个方法就是去读取这个文件的内容，并解析成 Map 的格式。

**Linux: SharedPreferencesLinux**

```dart
@override
Future<Map<String, Object>> getAll() async {
  return _readPreferences();
}

Future<Map<String, Object>> _readPreferences() async {
  if (_cachedPreferences != null) {
    return _cachedPreferences!;
  }

  Map<String, Object> preferences = {};
  final File? localDataFile = await _getLocalDataFile();
  if (localDataFile != null && localDataFile.existsSync()) {
    String stringMap = localDataFile.readAsStringSync();
    if (stringMap.isNotEmpty) {
      preferences = json.decode(stringMap).cast<String, Object>();
    }
  }
  _cachedPreferences = preferences;
  return preferences;
}
```

可以看到 Linux 下代码和 Windows 基本是一致的，其实内容保存的文件名也是相同的，区别只是两个系统的文件路径有差异。

**Web: SharedPreferencesPlugin**

> 不知道为啥 Web 版本的类型名称是 SharedPreferencesPlugin 而不是 SharedPreferencesWeb，强迫症表示受不了了。

```dart
@override
Future<Map<String, Object>> getAll() async {
  final Map<String, Object> allData = {};
  for (String key in _storedFlutterKeys) {
    allData[key] = _decodeValue(html.window.localStorage[key]!);
  }
  return allData;
}
```

Web 版本下，SharedPreferences 的 Key-Value 是存在 `html.window.localStorage` 中的。

最后来看下 Android 平台下通过 MethodChannel 是如何调用平台 API 的。

```java
/** SharedPreferencesPlugin */
public class SharedPreferencesPlugin implements FlutterPlugin {
  private static final String CHANNEL_NAME = "plugins.flutter.io/shared_preferences";
  private MethodChannel channel;
  private MethodCallHandlerImpl handler;

  @SuppressWarnings("deprecation")
  public static void registerWith(io.flutter.plugin.common.PluginRegistry.Registrar registrar) {
    final SharedPreferencesPlugin plugin = new SharedPreferencesPlugin();
    plugin.setupChannel(registrar.messenger(), registrar.context());
  }

  @Override
  public void onAttachedToEngine(FlutterPlugin.FlutterPluginBinding binding) {
    setupChannel(binding.getBinaryMessenger(), binding.getApplicationContext());
  }
  
  @Override
  public void onDetachedFromEngine(FlutterPlugin.FlutterPluginBinding binding) {
    teardownChannel();
  }
  
  // 1
  private void setupChannel(BinaryMessenger messenger, Context context) {
    channel = new MethodChannel(messenger, CHANNEL_NAME);
    handler = new MethodCallHandlerImpl(context);
    channel.setMethodCallHandler(handler);
  }

  private void teardownChannel() {
    handler.teardown();
    handler = null;
    channel.setMethodCallHandler(null);
    channel = null;
  }
}
```

可以看到 `SharedPreferencesPlugin` 的核心是在注释 1 的 `setupChannel` 方法中，创建了一个 MethodChannel，名称是 `plugins.flutter.io/shared_preferences`，这个 channel 的处理器是 `MethodCallHandlerImpl`，我们来看看这个类里的代码：

```java
// 构造函数
MethodCallHandlerImpl(Context context) {
  // 1
  preferences = context.getSharedPreferences(SHARED_PREFERENCES_NAME, Context.MODE_PRIVATE);
  executor =
      new ThreadPoolExecutor(0, 1, 30L, TimeUnit.SECONDS, new LinkedBlockingQueue<Runnable>());
  handler = new Handler(Looper.getMainLooper());
}
```

在构造函数中的注释 1 的位置，创建了 Android 中的 SharedPreferences 对象。SP 的 Repo 名称是 `FlutterSharedPreferences`，所以 shared\_preferences 插件是不支持自己创建其他名字的 Repo 的，开发时需要注意 key 的唯一性，否则可能出现覆盖了其他人 key 的内容的问题。

```java
@Override
public void onMethodCall(MethodCall call, MethodChannel.Result result) {
  String key = call.argument("key");
  try {
    switch (call.method) {
      case "setBool":
        commitAsync(preferences.edit().putBoolean(key, (boolean) call.argument("value")), result);
        break;
      case "setDouble":
        double doubleValue = ((Number) call.argument("value")).doubleValue();
        String doubleValueStr = Double.toString(doubleValue);
        commitAsync(preferences.edit().putString(key, DOUBLE_PREFIX + doubleValueStr), result);
        break;
      case "setInt":
        Number number = call.argument("value");
        if (number instanceof BigInteger) {
          BigInteger integerValue = (BigInteger) number;
          commitAsync(
              preferences
                  .edit()
                  .putString(
                      key, BIG_INTEGER_PREFIX + integerValue.toString(Character.MAX_RADIX)),
              result);
        } else {
          commitAsync(preferences.edit().putLong(key, number.longValue()), result);
        }
        break;
      case "setString":
        String value = (String) call.argument("value");
        if (value.startsWith(LIST_IDENTIFIER)
            || value.startsWith(BIG_INTEGER_PREFIX)
            || value.startsWith(DOUBLE_PREFIX)) {
          result.error(
              "StorageError",
              "This string cannot be stored as it clashes with special identifier prefixes.",
              null);
          return;
        }
        commitAsync(preferences.edit().putString(key, value), result);
        break;
      case "setStringList":
        List<String> list = call.argument("value");
        commitAsync(
            preferences.edit().putString(key, LIST_IDENTIFIER + encodeList(list)), result);
        break;
      case "commit":
        // We've been committing the whole time.
        result.success(true);
        break;
      case "getAll":
        result.success(getAllPrefs());
        return;
      case "remove":
        commitAsync(preferences.edit().remove(key), result);
        break;
      case "clear":
        Set<String> keySet = getAllPrefs().keySet();
        SharedPreferences.Editor clearEditor = preferences.edit();
        for (String keyToDelete : keySet) {
          clearEditor.remove(keyToDelete);
        }
        commitAsync(clearEditor, result);
        break;
      default:
        result.notImplemented();
        break;
    }
  } catch (IOException e) {
    result.error("IOException encountered", call.method, e);
  }
}
```

这个类中最核心的就是 `onMethodCall` 方法了，通过 `call.method` 获取到具体的方法名，在对应的 case 分支中处理对应的逻辑。通过 `call.argument("key")` 获取到 key，通过 `call.argument("value")` 获取 value。iOS 下的逻辑也是类似的。

基本的逻辑就是这样了，其实还是比较清晰简单的，还有些细节的逻辑这里就不赘述了，可以看源码进行了解。