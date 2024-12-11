## 데이터 스트리밍과 브라우저 및 Node.js에서의 스트림 처리

### 1. 데이터 스트리밍 (Data Streaming)

- 데이터 스트리밍은 데이터를 실시간으로 연속적으로 전송하는 방식
- 데이터를 청크 단위로 나누어 보내며, 수신 측에서는 데이터를 수신하는 즉시 실시간으로 처리할 수 있다
    
    ⇒ 지연시간을 줄이고, 데이터를 빠르게 받아 처리할 수 있음
    
- 대용량 데이터를 효율적으로 전송할 수 있는데, 대표적인 예시로는 유튜브 영상 스트리밍과 Spotify 음악 스트리밍 서비스

*** 전체 파일**을 처리해야 하는 경우에는 모든 데이터를 받은 후에야 처리가 가능하다. 예를 들어, 압축 파일을 처리할 때는 파일을 모두 수신한 후 압축을 풀어야 하므로, 스트리밍 방식으로는 실시간 처리 불가능

### 2. 브라우저에서의 스트림 처리

- 브라우저에서 데이터를 스트리밍하려면 **Streams API**를 사용해야 한다
- 기존 JavaScript에서는 스트리밍 처리가 불가능했으며, 전체 파일을 다운로드한 후 알맞은 포맷으로 변환하여야 데이터를 처리 가능
- Streams API를 활용하면 **버퍼**, **문자열**, **Blob** 없이 **원시 데이터(raw data)**를 직접 처리 가능

### ReadableStream과 WritableStream

- **ReadableStream**
    - JavaScript에서 스트리밍 데이터를 만들고, 이를 청크 단위로 연속적으로 읽어서 처리할 수 있음
    - 예를 들어, 외부 리소스에서 데이터를 읽어오는 스트림을 만들고, 해당 데이터를 점진적으로 처리할 수 있습다. 또한, 스트림 전송이 완료되었는지 여부도 확인 가능
    - 인터페이스
- **WritableStream**
    - 데이터를 스트림 형태로 작성할 수 있다
    - 파일에 데이터를 쓰거나, 네트워크 전송, 메모리 저장 등에 사용됨
    - 이 작업은 비동기적으로 이루어지며, 데이터 소비보다 생산 속도가 빠를 경우 **backpressure**를 사용해 데이터 흐름을 제어 가능
        - 쓰기 작업이 처리 중일 때 추가 데이터가 들어오면, 대기열에 쌓여 순차적으로 처리
- 브라우저에서 스트림 처리 시, 메모리를 절약하면서 실시간으로 데이터를 다룰 수 있기 때문에, 대용량 파일이나 실시간 데이터 처리에 유리

### 3. Node.js에서 스트리밍 처리

- Node.js에서 스트림 처리 시 **`stream` 모듈**을 사용
- 이미지, 비디오, HTML과 같은 데이터를 실시간으로 스트리밍
- Node.js 서버에서 이미지나 비디오를 스트리밍할 때, 데이터가 브라우저로 실시간으로 전송되며 브라우저는 수신하는 즉시 데이터를 처리
- 또한, **React SSR (Server-Side Rendering)**을 사용할 때, `renderToNodeStream`을 활용하여 전체 HTML을 기다리지 않고 점진적으로 스트리밍하여 렌더링 가능
    - 이 방식은 서버의 지연을 줄이고 메모리 사용을 최적화하는데 유리하다. 스트리밍을 통해 서버는 동시 사용자 요청을 더 효율적으로 처리할 수 있음
- 구현해보기
    - server.js
    ```javascript
    const express = require('express');
    const fs = require('fs');
    const path = require('path');
    const axios = require('axios');

    const app = express();
    const port = 3000;

    // HTML 스트리밍
    app.get('/stream-html', (req, res) => {
      // 사이즈 큰 html로 준비
      const htmlPath = path.join(__dirname, 'sample.html');
      const stat = fs.statSync(htmlPath);
      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': stat.size
      });
      const htmlStream = fs.createReadStream(htmlPath);
      htmlStream.pipe(res);
    });

    // 이미지 스트리밍
    app.get('/stream-image', (req, res) => {
      // 사이즈 큰 image로 준비
        const imagePath = path.join(__dirname, 'image.jpg');
        const stat = fs.statSync(imagePath);
        res.writeHead(200, {
          'Content-Type': 'image/jpeg',
          'Content-Length': stat.size
        });
        const imageStream = fs.createReadStream(imagePath);
        imageStream.pipe(res);
      });

    // 비디오 스트리밍 (외부 URL)
    app.get('/stream-video', async (req, res) => {
      const videoUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'; 
      try {
        const response = await axios({
          method: 'get',
          url: videoUrl,
          responseType: 'stream'
        });
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Accept-Ranges', 'bytes');
        response.data.pipe(res);
      } catch (error) {
        console.error('비디오 스트리밍 오류:', error);
        res.status(500).send('비디오를 불러오는 데 실패했습니다.');
      }
    });


    app.listen(port, () => {
      console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
    });
    ```
### HTML 스트리밍
  ![html](./assets/1.gif)
### 이미지 스트리밍
  ![image](./assets/2.gif)
### 비디오 스트리밍
  ![video](./assets/3.gif)