const statusTextarea = document.getElementById('status') as HTMLTextAreaElement;

function updateStatus(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    statusTextarea.value += `${timestamp}: ${message}\n`;
    // 自动滚动到底部
    statusTextarea.scrollTop = statusTextarea.scrollHeight;
}

function clearStatus() {
    statusTextarea.value = '';
}

function makeRequestWithProgress(url: string, options: { signal?: AbortSignal } = {}): Promise<any> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        let hasReceivedData = false;
        let totalBytesReceived = 0;
        let responseStarted = false;
        let stateChanges: string[] = [];
        let lastValidStatus = 0;

        xhr.addEventListener('error', (event) => {
            reject(new Error(`Network error occurred: ${event}`));
        });

        xhr.addEventListener('readystatechange', () => {
            const currentStatus = xhr.status;
            if (currentStatus > 0) {
                lastValidStatus = currentStatus;
            }
            const state = `ReadyState: ${xhr.readyState}, Status: ${currentStatus}`;
            stateChanges.push(`${new Date().toLocaleTimeString()}: ${state}`);
            updateStatus(`状态变化: ${state}`);
            
            if (xhr.readyState >= 2) {
                responseStarted = true;
            }
        });

        xhr.addEventListener('abort', (event) => {
            if (hasReceivedData || responseStarted) {
                const status = lastValidStatus || xhr.status;
                const statusText = xhr.statusText || '<empty>';
                const responseHeaders = xhr.getAllResponseHeaders() || '<empty>';
                const stateInfo = `ReadyState: ${xhr.readyState}`;
                
                const errorMessage = [
                    `请求在接收 ${totalBytesReceived} 字节后被中断`,
                    `最后的有效状态码: ${status}`,
                    `状态文本: ${statusText}`,
                    `响应头: ${responseHeaders}`,
                    stateInfo,
                    '',
                    '状态变化历史:',
                    ...stateChanges.map(s => '  ' + s)
                ].join('\n');
                
                updateStatus(errorMessage);
                reject(new Error(errorMessage));
            } else {
                const message = '请求在收到响应之前被中断';
                updateStatus(message);
                reject(new Error(message));
            }
        });

        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(new Error(`HTTP error! status: ${xhr.status}`));
            }
        });

        xhr.addEventListener('progress', (event) => {
            hasReceivedData = true;
            totalBytesReceived = event.loaded;
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                updateStatus(`下载进度: ${percentComplete.toFixed(2)}%（已接收 ${event.loaded} 字节）`);
            } else {
                updateStatus(`已接收: ${event.loaded} 字节`);
            }
        });

        xhr.open('GET', url);
        xhr.withCredentials = true;
        xhr.send();

        if (options.signal) {
            options.signal.addEventListener('abort', () => xhr.abort());
        }
    });
}

document.getElementById('interruptedRequest')?.addEventListener('click', async () => {
    const controller = new AbortController();
    try {
        clearStatus();
        updateStatus('开始可能被中断的请求...');
        
        setTimeout(() => {
            controller.abort();
            updateStatus('请求被手动中断！');
        }, 5000);

        await makeRequestWithProgress('https://httpbin.org/drip?duration=20&numbytes=50000&delay=2&code=200', {
            signal: controller.signal
        });
        updateStatus('请求成功完成！');
    } catch (error) {
        updateStatus(`发生错误: ${error.message}`);
        console.log('Error object:', error);
    }
});
