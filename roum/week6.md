# React 19에서 동시성 렌더링(Concurrent Rendering)

: 이전버전에서는 명시적으로 동시성 렌더링을 활성화해야 했음

```
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [count, setCount] = useState(0);
  const [list, setList] = useState([]);

  const handleClick = () => {
    setCount((prev) => prev + 1);

    // 긴 작업
    const newList = Array(5000)
      .fill(null)
      .map((_, i) => `Item ${i + 1}`);
    setList(newList);
  };

  return (
    <div>
      <button onClick={handleClick}>Count: {count}</button>
      <ul>
        {list.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')); // 기본적으로 동시성 렌더링 활성화
root.render(<App />);
```


# React19 Client Api


```js
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

## createRoot
- react 18이상에서 동시성 렌더링을 지원하기 위해 도입된 api
- 개발자가 우선순위 작업 관리할 필요 X
- UI가 반응성을 유지할 수 있도록 렌더링 작업 일시 중지 가능
- Strict Mode 호환성 : 자동으로 루트 내에서 렌더링된 모든 컴포넌트에 Strict Mode 활성화


c.f. ReactDOM.render

- React18 이전 버전에서 사용
- 동시성 렌더링, 자동 배칭(Automatic Batching) 등의 기능 사용 불가

```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```


```js

export interface RootOptions {
    /**
     * Prefix for `useId`.
     */
    identifierPrefix?: string;
    onRecoverableError?: (error: unknown, errorInfo: ErrorInfo) => void;
}

export interface Root {
    render(children: React.ReactNode): void;
    unmount(): void;
}

export interface DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_CREATE_ROOT_CONTAINERS {}

export type Container =
    | Element
    | DocumentFragment
    | DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_CREATE_ROOT_CONTAINERS[
        keyof DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_CREATE_ROOT_CONTAINERS
    ];


export function createRoot(container: Container, options?: RootOptions): Root;
```

c.f. identifierPrefix : 멀티 루트 환경/동일 페이지에 여러 React 루트를 사용하는 경우, ID 충돌을 방지.
c.f. onRecoverableError : React가 "복구 가능한 에러"를 감지했을 때 호출되는 콜백 함수. 여기서 복구 가능한 에러는 React가 렌더링 트리에서 스킵하고 계속 렌더링을 진행할 수 있는 에러를 말한다.



## root.unmount()
: createRoot로 생성한 루트를 제거하는 메서드. 이를 호출하면 해당 React 루트에 렌더링된 모든 컴포넌트와 React의 내부 상태가 정리(clean-up)

- 이벤트 핸들러, 타이머, 비동기 작업 등을 정리하고 메모리 누수를 방지해야 할 때 사용


## Automatic Batching
: **자동 배칭(Automatic Batching)**은 React에서 여러 상태 업데이트를 한 번의 렌더링 사이클에 묶어 처리(batch)하여, 불필요한 추가 렌더링을 방지하고 성능을 최적화하는 기능


```js
// React17버전 이하
import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1); // 첫 번째 업데이트
    setCount(count + 2); // 두 번째 업데이트
    // React 17: 두 업데이트가 하나로 배치되어 한 번만 렌더링.
  };

  setTimeout(() => {
    setCount(count + 3); // 첫 번째 업데이트
    setCount(count + 4); // 두 번째 업데이트
    // React 17: 비동기 작업에서는 각각 별도로 렌더링됨.
  }, 1000);

  return <button onClick={handleClick}>Count: {count}</button>;
}
```

```js
import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    setCount(count + 2);
    // React 18: 두 상태 업데이트가 자동으로 배칭되어 한 번만 렌더링.
  };

  setTimeout(() => {
    setCount(count + 3);
    setCount(count + 4);
    // React 18: 비동기 작업에서도 두 상태 업데이트가 배칭됨.
  }, 1000);

  return <button onClick={handleClick}>Count: {count}</button>;
}
```



## hydrateRoot
: 서버에서 미리 렌더링된 HTML을 클라이언트에서 React 컴포넌트로 **활성화(hydrate)**하기 위해 사용되는 React 18 이상 API.

```js
export function hydrateRoot(
    container: Element | Document,
    initialChildren: React.ReactNode,
    options?: HydrationOptions,
): Root;

```

1. SSR과 클라이언트 렌더링 연결
: 서버에서 생성된 HTML을 React의 내부 상태와 연결.
2. 효율적인 DOM 재사용
: React는 서버에서 생성된 DOM을 재사용하므로 클라이언트에서 처음부터 다시 렌더링하지 않음. 이로 인해 초기 로딩 성능이 향상
3. 동시성 렌더링 지원

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 서버에서 전달된 초기 데이터 가져오기
const initialData = window.__INITIAL_DATA__;

const container = document.getElementById('root');
const root = ReactDOM.hydrateRoot(container, <App data={initialData} />);

```

```js
import ReactDOMServer from 'react-dom/server';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import App from './App';

const app = express();

app.get('/', (req, res) => {
  // 서버 사이드 렌더링된 HTML
  const html = ReactDOMServer.renderToString(<App />);
  const initialData = { message: 'Hello from Server!' };

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>React App</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
        </script>
        <script src="/client.js"></script>
      </body>
    </html>
  `);
});

app.listen(3000, () => console.log('Server is running on http://localhost:3000'));

```


### Hydration 불일치 문제
: 서버에서 렌더링된 HTML과 클라이언트에서 생성된 React 트리가 서로 다를 때 발생

```js
// 서버에서 렌더링된 HTML
<div id="root"><p>Hello from Server!</p></div>

// 클라이언트에서 렌더링된 React 컴포넌트
function App({ data }) {
  return <p>{data.message}</p>;
}

// 클라이언트 초기 데이터
const initialData = { message: 'Hello from Client!' };

// hydrateRoot 사용
const root = ReactDOM.hydrateRoot(container, <App data={initialData} />);

```

- 증상: 브라우저 콘솔에 아래와 같은 경고가 표시됨:
```
Warning: Text content does not match server-rendered HTML.
```

