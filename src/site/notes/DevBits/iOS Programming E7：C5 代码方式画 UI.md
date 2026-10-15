---
{"dg-publish":true,"permalink":"/DevBits/iOS Programming E7：C5 代码方式画 UI/","tags":["编程笔记","iOS"],"noteIcon":"","created":"2026-09-16","updated":"2026-09-16T23:16:40.586+08:00","dg-note-properties":{"date":"2026-09-16","tags":["编程笔记","iOS"]}}
---


这一章学习了：
- 在 ViewController 中添加 View，并通过 **Auto Layout** 给 View 添加约束。
- iOS 里 Location 相关 API 的使用

---

重写 loadView() 方法，在其中添加 View

```swift
class MapViewController: UIViewController{

	private var mapView: MKMapView!
	
	override func loadView() {
		// Create a map view
        mapView = MKMapView()
        // Set it as the view of this view controller
        self.view = mapView
	}

	override func viewDidLoad() {
        super.viewDidLoad()

        print("MapViewController viewDidLoad")
        
    }
}
```

再就是给 View 添加约束。实现如下效果

![image.png](https://img.lixiaoyu.life/blog-res/2025/08/8d402616efc03abf8f8384ac112f2568.png)

步骤如下：
- 创建并初始化 UISegmentedControl 控件，通过 view.addSubview 添加到页面上
- 定义 UISegmentedControl 控件的约束
	- segmentedControl.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor) 表示 UISegmentedControl 的顶部和 SafeArea 顶部对齐。可以通过 view.safeAreaLayoutGuide 来获取 SafeArea 控件
	- segmentedControl.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 12) 表示 UISegmentedControl 的 Leading 和父容器的 Leading 对齐，constant = 12 表示再加 12 point 的边距。
	- segmentedControl.trailingAnchor.constraint(equalTo: view.trailingAnchor) 表示 UISegmentedControl 的 Trailing 和父容器的 Trailing 对齐
- 激活约束
	- topConstraint.isActive = true

```swift
class MapViewController: UIViewController, CLLocationManagerDelegate {
    
    private var mapView: MKMapView!
    
    override func loadView() {
        // Create a map view
        mapView = MKMapView()
        // Set it as the view of this view controller
        self.view = mapView
        
        let segmentedControl = UISegmentedControl(items: ["Standard", "Hybrid", "Satellite"])
        segmentedControl.backgroundColor = UIColor.systemBackground
        segmentedControl.selectedSegmentIndex = 0
        segmentedControl.translatesAutoresizingMaskIntoConstraints = false
        
        segmentedControl.addTarget(self, action: #selector(mapTypeChanged(_:)), for: .valueChanged)
        view.addSubview(segmentedControl)
        
        // define constraints
        let topConstraint = segmentedControl.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor)
//        let leadingConstraint = segmentedControl.leadingAnchor.constraint(equalTo: view.leadingAnchor)
//        let trailingConstraint = segmentedControl.trailingAnchor.constraint(equalTo: view.trailingAnchor)
        
        let margins = view.layoutMarginsGuide
        let leadingConstraint = segmentedControl.leadingAnchor.constraint(equalTo: margins.leadingAnchor)
        let trailingConstraint = segmentedControl.trailingAnchor.constraint(equalTo: margins.trailingAnchor)
        
        // active constraints
        topConstraint.isActive = true
        leadingConstraint.isActive = true
        trailingConstraint.isActive = true
    }

}
```


layoutMargins：View 的内边距（Android 的 padding），是一个 `UIEdgeInsets` 结构体（包含 `top`、`left`、`bottom`、`right` 四个方向的距离），决定了子视图在布局时与父视图边缘保持的最小距离。
layoutMargins 的核心作用是 **简化 AutoLayout 约束的编写**，让子 View 自动与父 View 保持统一的边距，避免手动为每个子视图设置相同的边缘约束（如 `leading`、`trailing` 等）。

比如 当父视图的 `layoutMargins` 设为 `UIEdgeInsets(top: 20, left: 20, bottom: 20, right: 20)` 时，子视图若与父视图的 `layoutMarginsGuide` 对齐，会自动与父视图边缘保持 20pt 的间距。

使用方式：借助 layoutMarginsGuide（一个 `UILayoutGuide` 对象），用于快速将子视图与父视图的 `layoutMargins` 对齐

- segmentedControl.leadingAnchor.constraint(equalTo: view.layoutMarginsGuide.leadingAnchor)  表示 Leading 和 View leading 的内边距所在位置对齐


constraint() 方法会创建出一个 NSLayoutConstraint 对象，看下这个对象的构造函数：
```swift
init(
	item view1: Any,
	attribute attr1: NSLayoutAttribute,
	relatedBy relation: NSLayoutRelation,
	toItem view2: Any?,
	attribute attr2: NSLayoutAttribute,
	multiplier: CGFloat,
	constant c: CGFloat
)
```

layout attributes 有如下这些：

- NSLayoutAttribute.left
- NSLayoutAttribute.right
- NSLayoutAttribute.leading
- NSLayoutAttribute.trailing
- NSLayoutAttribute.top
- NSLayoutAttribute.bottom
- NSLayoutAttribute.width
- NSLayoutAttribute.height
- NSLayoutAttribute.centerX
- NSLayoutAttribute.centerY
- NSLayoutAttribute.firstBaseline
- NSLayoutAttribute.lastBaseline

![image.png](https://img.lixiaoyu.life/blog-res/2025/08/bd4934650f2ecf42f52908647fd3b1e1.png)





在 AutoLayout 之前，iOS 还有一套布局系统：autoresizing masks
会和 AutoLayout 冲突，所以一般要把 view.translatesAutoresizingMaskIntoConstraints = false 来禁用 autoresizing masks。


实现获取用户的当前位置并在 Map 上展示出来。

实现步骤：
- 在 Info.plist 添加 「Privacy – Location When In Use Usage Description」 Key，用来说明收集 Location 权限的用途
	- 在 Info.plist 空白处，右键，选择 Add Row，然后有个下拉栏展示所有的，选择 「Privacy – Location When In Use Usage Description」 即可
- 在 MapViewController 中，添加一个 CLLocationManager 类型的成员变量，并在 viewDidLoad 中初始化 CLLocationManager 并请求 Location 权限
	- 初始化时，需要设置 CLLocationManager 的 delegate 为 MapViewController 对象，让 MapViewController 实现 CLLocationManagerDelegate 协议
- 重写 CLLocationManagerDelegate 中的 locationManagerDidChangeAuthorization 方法，这是 Location 权限申请结果的回调，当用户同意了 Location 权限，则开始定位；当用户拒绝 Location 权限，则弹一个弹窗解释权限用途，点击按钮跳转到应用设置，让用户在设置页打开权限
- 重写 `func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation])` 方法，在获取到定位时回调，在这个方法中获取到用户的当前位置，然后设置给 MapView

```swift
class MapViewController: UIViewController, CLLocationManagerDelegate {
    
    private var mapView: MKMapView!
    
    private var locationManager = CLLocationManager()
    
    override func loadView() {
        // Create a map view
        mapView = MKMapView()
        mapView.pointOfInterestFilter = .excludingAll
        // 显示用户位置（蓝色圆点）
        mapView.showsUserLocation = true
        // Set it as the view of this view controller
        self.view = mapView
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        print("MapViewController loaded its view")
        
        setupLocationManager()
        requestLocationPermission()
        
    }
    
    private func setupLocationManager() {
        locationManager.delegate = self
        // 设置位置精度（越高越耗电，根据需求调整）
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
    }
    
    private func requestLocationPermission() {
        // 请求前台使用位置权限
        locationManager.requestWhenInUseAuthorization()
    }
    
    // 权限请求的回调处理
    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        switch manager.authorizationStatus {
        case .authorizedWhenInUse, .authorizedAlways:
            // 已授权，开始获取位置
            locationManager.startUpdatingLocation()
        case .denied, .restricted:
            // 权限被拒绝，可提示用户去设置开启
            showLocationPermissionAlert()
        case .notDetermined:
            // 尚未决定，等待用户选择
            break
        default:
            break
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        // 获取最新的位置（数组最后一个是最新的）
        guard let userLocation = locations.last else { return }
        
        // 缩放地图到用户位置
        zoomToLocation(userLocation)
        
        // 只需要一次定位，停止更新位置
        locationManager.stopUpdatingLocation()
    }
    
    private func zoomToLocation(_ location: CLLocation) {
        let regionRadius: CLLocationDistance = 1000
        let coordinateRegion = MKCoordinateRegion(
            center: location.coordinate,
            latitudinalMeters: regionRadius,
            longitudinalMeters: regionRadius
        )
        mapView.setRegion(mapView.regionThatFits(coordinateRegion), animated: true)
    }
    
    private func showLocationPermissionAlert() {
        let alert = UIAlertController(
            title: "需要位置权限", message: "请在设置中开启位置权限，以便显示您当前的位置", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "取消", style: .cancel))
        alert.addAction(UIAlertAction(title: "设置", style: .default) {_ in
            // 跳转到应用设置页面
            guard let settingsURL = URL(string: UIApplication.openSettingsURLString) else {
                return
            }
            UIApplication.shared.open(settingsURL)
        })
        present(alert, animated: true)
    }
    
}

```