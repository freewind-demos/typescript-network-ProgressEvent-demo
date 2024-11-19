const statusDiv = document.getElementById('status') as HTMLDivElement;

function updateStatus(message: string) {
    statusDiv.innerHTML += `<div>${new Date().toLocaleTimeString()}: ${message}</div>`;
}

function makeRequestWithProgress(url: string, options: { signal?: AbortSignal } = {}): Promise<any> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.addEventListener('error', (event) => {
            reject(event);  // 直接reject ProgressEvent对象
        });

        xhr.addEventListener('abort', (event) => {
            reject(event);  // 直接reject ProgressEvent对象
        });

        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(new Error(`HTTP error! status: ${xhr.status}`));
            }
        });

        xhr.open('GET', url);
        xhr.send();

        if (options.signal) {
            options.signal.addEventListener('abort', () => xhr.abort());
        }
    });
}

document.getElementById('interruptedRequest')?.addEventListener('click', async () => {
    const controller = new AbortController();
    try {
        updateStatus('开始可能被中断的请求...');
        
        // 2秒后中断请求
        setTimeout(() => {
            controller.abort();
            updateStatus('请求被手动中断！');
        }, 2000);

        await makeRequestWithProgress('https://httpbin.org/delay/5', {
            signal: controller.signal
        });
        updateStatus('请求成功完成！');
    } catch (error) {
        updateStatus(`发生错误: ${error}`);
        console.log('Error object:', error);
    }
});
