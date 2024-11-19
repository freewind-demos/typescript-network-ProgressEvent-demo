# TypeScript Network ProgressEvent Demo

这个项目演示了如何在网络请求中捕获和处理 ProgressEvent。

## 项目目的

1. 演示在什么情况下会触发 ProgressEvent
2. 展示如何使用 XMLHttpRequest 正确捕获网络请求中的 ProgressEvent
3. 对比 fetch 和 XMLHttpRequest 在处理网络错误时的区别

## 关键发现

1. XMLHttpRequest 比 fetch 提供了更详细的错误信息
2. 在以下情况下会触发 ProgressEvent：
   - 请求被中断（abort）
   - 网络错误（error）
   - 网络连接不稳定

## 如何运行

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm start
```

3. 打开浏览器访问页面

4. 点击"模拟中断请求"按钮，等待2秒后请求会被自动中断

5. 在控制台中查看 ProgressEvent 的详细信息

## 技术栈

- TypeScript
- XMLHttpRequest
- AbortController

## 注意事项

1. 需要稳定的网络连接来运行演示
2. 建议打开浏览器的开发者工具查看详细的错误信息
3. 如果想测试网络不稳定的情况，可以在请求过程中：
   - 关闭 Wi-Fi
   - 切换网络
   - 或者等待请求自动中断
