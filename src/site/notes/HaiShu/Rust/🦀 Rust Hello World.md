---
{"dg-publish":true,"permalink":"/HaiShu/Rust/🦀 Rust Hello World/","tags":["Rust"],"noteIcon":"","created":"2024-01-10","updated":"2026-07-02T10:14:03.667+08:00"}
---

主要内容：
-   在 macOS 中安装 Rust
-   编写 Hello World 程序
-   使用 Rust 包管理和构建工具 cargo

## 安装 Rust

在 macOS 中，使用 `rustup` 进行安装。

```plain
$ curl https://sh.rustup.rs -sSf | sh
```

这条命令会下载并执行一个脚本来安装 rustup 工具，来安装最新的 Rust 稳定版本。

成功后会看到如下输出：

```python
Rust is installed now. Great!
```

这个安装会自动把 Rust 工具链添加到环境变量中，在下次打开终端时生效，如果想要在当前终端立即生效，可以输入下面命令：

```python
source "$HOME/.cargo/env"
```

检查 Rust 是否正确安装：

```python
rustc --version
```

正确安装的话，会输出如下格式的信息：最新稳定版本的版本号，版本的哈希码，版本提交日期

```python
rustc x.y.z (abcabcabc yyyy-mm-dd)
// 比如
rustc 1.67.1 (d5a82bbd2 2023-02-07)
```

安装工具执行时会在本地生成一份离线文档，可以通过以下命令在浏览器中打开：

```python
rustup doc
```

当不清楚某个函数的用途和使用方式时，可以通过该文档进行查询。

## Rust 的 Hello World

这节来编写第一个 Rust 程序，典中典的 Hello World。

可以使用 VS Code 这个 IDE 来编写 Rust，在扩展中搜索 Rust，选择 「rust-analyzer」这个插件，安装并启用。

![rust-analyzer](https://img.lixiaoyu.life/blog-res/2026/07/3a65f4470060012caec02fadf680291e.png)

创建一个文件夹，比如叫做 `rust_learning`，在 VS Code 中打开，并在这个文件夹下新建一个 Rust 程序文件，Rust 文件的后缀是 `.rs`，比如 `hello.rs`，如果名字使用多个单词，规范是在单词间用下划线 `_` 分隔，比如 `hello_world.rs`。

在 `hello.rs` 中写下如下代码：

```rust
fn main() {
    println!("Hello World!");
}
```

通过下面的命令来编译并运行这个程序：

```rust
// 编译
rustc hello.rs

// 运行
./hello

// 运行结果
Hello World!
```

### 分析这个程序

-   `fn main() {}` 定义了一个 Rust 的函数，`main` 函数是 Rust 程序的入口函数
-   花括号 `{}` 用来包裹函数体，Rust 要求所有的函数都要被花括号包裹，推荐把左花括号和函数声明写在同一行，并用空格分隔。
-   `println!` 是调用了一个宏，Rust 中所有以 `!` 结尾的调用都是在调用宏而不是普通函数。
-   标准 Rust 风格使用 4 个空格而不是 Tab 来缩进
-   大部分 Rust 代码行会以分号 `;` 来结尾

### 编译和运行

编译和运行是两个不同的步骤。

在运行 Rust 程序之前，需要使用 `rustc` 命令及源文件名作为参数来编译它：

```rust
rustc hello.rs
```

这和 C 或 C++ 的编译十分类似，一旦编译成功，会获得一个二进制的可执行文件。

查看生成的可执行文件：

```rust
$ ls
hello hello.rs
```

接下来，通过如下方式运行可执行文件：

```rust
./hello
```

仅仅使用 `rustc` 编译简单的程序不麻烦，但随着项目规模的变大，开发成员变多，我们最好使用构建工具来简化这些复杂的工作。也就是 `cargo`。

## cargo

`cargo` 是 Rust 工具链中内置的构建系统及包管理器。它可以用来构建代码，下载依赖库等。

使用 `rustup` 工具下载安装 Rust，cargo 已经内置了。

可以通过下面命令来检查 cargo 是否正确安装：

```rust
$ cargo --version
```

当输出是形如 `cargo 1.67.1 (8ecd4f20a 2023-01-10)` 这样的一串版本号时，说明 cargo 可以正常使用，如果输出是类似 `command not found` 这样的错误信息，则需要单独安装 cargo。

### 使用 cargo 创建项目

```rust
$ cargo new hello_cargo
// 输出
Created binary (application) `hello_cargo` package

$ cd hello_cargo
```

创建出来的项目结构如下所示：

```rust
├── hello_cargo
│   ├── .gitignore      // cargo 会初始化 Git 仓库，生成默认的 .gitignore 文件
│   ├── Cargo.toml      // 包含程序包配置及依赖等信息
│   └── src             // 放置源代码的目录
│       └── main.rs     // 源码文件
```

### Cargo.toml 的内容

```rust
[package]
name = "hello_cargo"
version = "0.1.0"
authors = ""
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
```

Cargo 使用 `TOML(Tom's Obvious, Minimal Language)` 作为标准配置格式。

`package` 是个区域标签，表明接下来的语句是配置当前的程序包

-   `name` 程序名
-   `version` 版本号
-   `authors` 作者信息
-   `edition`

`dependencies` 也是个区域标签，声明项目的依赖。在 Rust 中，把代码的集合称为 `包（create）`。

按照惯例，Cargo 会默认把所有源代码文件放在 `src` 目录下，项目根目录只用来放置 `README 文档`、`许可声明`、`配置文件` 等与源码无关的文件。

### 使用 Cargo 构建和运行项目

-   `cargo build`

Cargo 可以通过如下命令完成构建：

```rust
$ cargo build
// 运行结果
Compiling hello_cargo v0.1.0 (/Users/owen/Workspace/VSCodeProjects/rust_learning/hello_cargo)
Finished dev [unoptimized + debuginfo] target(s) in 0.78s
```

这个命令会将可执行程序生成在路径 `./target/debug/hello_cargo` 下，可以用下面的命令来运行：

```rust
$ ./target/debug/hello_cargo
// 运行结果
Hello, world!
```

`cargo build` 还会在项目根目录下创建一个名为 `Cargo.lock` 的新文件，这个文件记录了当前项目所有依赖库的具体版本号。不要手动编辑其中的内容，Cargo 会自动维护。

-   `cargo run`

也可以直接使用 `cargo run` 命令来一次性完成编译和运行：

```rust
$ cargo run
// 运行结果
    Finished dev [unoptimized + debuginfo] target(s) in 0.01s
     Running `target/debug/hello_cargo`
Hello, world!
```

这次的输出没有提示编译信息，这是因为 Cargo 发现源码没有修改，所以直接运行了生成的可执行文件，如果修改的源码，Cargo 会在运行前重新构建项目：

```rust
$ cargo run
// 运行结果
   Compiling hello_cargo v0.1.0 (/Users/owen/Workspace/VSCodeProjects/rust_learning/hello_cargo)
    Finished dev [unoptimized + debuginfo] target(s) in 0.12s
     Running `target/debug/hello_cargo`
Hello, Rust and Cargo!
```

-   `cargo check`

Cargo 还提供了 check 命令来快速检查当前代码是否可以通过编译，而不需要花费额外的时间生成可执行程序，运行速度远远快于 build 命令。

```rust
$ cargo check
// 运行结果
Finished dev [unoptimized + debuginfo] target(s) in 0.00s
```

### 以 Release 模式进行构建

当准备发布自己的项目时，可以使用 `cargo build --release` 或 `cargo run --release` 在优化模式下构建并生成可执行程序。生成的可执行文件会放在 `target/release` 目录下，而非 `target/debug`。这个模式会以更长的编译时间来优化代码，使代码拥有更好的运行时性能。

如果需要对代码的运行效率进行基准测试，请确保使用 `cargo run --release` 进行构建并使用 `target/release` 目录下的可执行文件进行测试。

```rust
$ cargo run --release
// 运行结果
    Finished release [optimized] target(s) in 0.00s
     Running `target/release/hello_cargo`
Hello, Cargo!
```