# 4장 서버 사이드 렌더링

[4.1 서버사이드 렌더링이란](#41-서버사이드-렌더링이란)

- [1. 개념](#411-개념)
- [2. 장단점](#412-장단점)

[4.2 서버 사이드 렌더링을 위한 리액트 API 살펴보기](#42-서버-사이드-렌더링을-위한-리액트-api-살펴보기)

## 4.1 서버사이드 렌더링이란

### 4.1.1. 개념

SPA) <br>
렌더링과 라우팅에 필요한 대부분의 기능을 서버가 아닌 브라우저의 자바스크립에 의존하는 방식 <br>
최초의 첫 페이지에서 데이터를 모두 불러온 이후에는 서버에서 HTML을 내려받지 않고 하나의 페이지에서 모든 작업을 처리해 페이지 전환이 부드러움

크롬 소스보기를 하면 index.html 파일 body 내부에 아무 내용이 없고 이후 자바스크립트 코드를 삽입 후 렌더링함

이런 작동 방 식은 최초에 로딩하는 자바스크립트 리소스가 커지는 단점이 있지만 한번 로딩된 후에는 서버에 추가로 html을 받아올 일이 없어 UI/UX가 좋음.

SSR) <br>
최초에 사용자에게 보여줄 페이지를 서버에서 렌더링해 빠르게 사용자에게 화면을 제공하는 방식.

### 4.1.2. 장단점

SSR 장점) <BR>
(1) 최초 페이지 진입이 비교적 빠르다 <BR>
SPA는 사용자가 페이지에 진입하고, 자바스크립트를 다운로드하고, HTTP요청 후 응답한 결과를 화면에 렌더링한다. <BR>
위 작업을 서버에서 하면 보다 빠르게 렌더링 될 수 있다. <BR>
(2) 검색엔진 최적화 (SEO) <BR>
body가 비어있는 SPA와 달리,
자바스크립트 파일등을 모두 HTML로 파싱해 검색엔진이 필요한 정보를 가져갈 수 있다.

SSR 단점) <BR>
(1) 코드 작성 시 서버를 고려해야함
브라우저 전역 객체인 window or sessionStorage 같은 브라우저에만 있는 전역 객체는 서버에서 실행이 안됨

```
window is not defined // 브라우저 전역 객체 사용 시 에러 발생
```

(2) 서버가 필요함 (진입장벽 있음)

SPA SSR 비교) <br>
웹페이지 렌더링의 책임을 클라이언트(브라우저 or 모바일 등등)에서 담당하는지 서버에서 담당하는지의 차이 <br>
SPA의 경우 브라우저의 성능에 따라 UX 차이가 심하게 나기 때문에 일반적으로 (서버의 리소스가 충분한 경우) SSR이 UX가 좋다 <BR>
요즈음의 SSR은 SPA와 SSR의 장점을 섞어서 최초 웹사이트 진입 시에는 SSR 방식으로 서버에서 완성된 HTML을 제공하고 <BR>
이후 라우팅에서는 서버에서 받은 js파일을 바탕으로 SPA처럼 작동한다.

## 4.2 서버 사이드 렌더링을 위한 리액트 API 살펴보기

### 4.2.1 renderToString

- 리액트 컴포넌트를 렌더링해 HTML로 반환하는 함수

```
function Home() {
  const onClick = () => {
    console.log('click!')
  }

  return (
    <ul>
      ['hello', 'world'].map(item => (
        <li onClick={onClick}>{item}</;>
      ))
    </ul>
  )
}

const result = ReactDOMServer.renderToString(       // <--
  React.createElement('div', {id: 'root'}, <Home />)
)
```

위 result는 아래 문자열을 반환한다

```
// data-reatroot="" 가 hydrate 될때 root element를 식별할 수 있게해준다.

<div id="root" data-reatroot="">
  <ul>
    <li>hello</li>
    <li>world</li>
  </ul>
</div>
```

이벤트 핸들러는(onClick) 결과물에 포함되지 않는다 (react hooks등도 포함x) <br>

### 4.2.2 renderToStaticMarkup

- renderToString과 유사 but, 리액트에서만 사용하는 추가적인 DOM 속성을 만들지 않는다 (data-reatroot 추가X) 따라서 완전히 순수한 HTML 문자열이 반환된다. <BR>
  즉, renderToStaticMarkup은 리액트의 이벤트 리스너가 필요 없는 완전히 순수한 HTML을 만들 때만 사용됨. (브라우저 액션이 없는 정적인 페이지에 유용)

### 4.2.3 renderToNodeStream

- renderToString과 type은 다른 동알한 결과물 반환 (renderToString -> string, renderToNodeStream -> 바이트 스트림)
- 브라우저에서 사용 불가
- HTML 크기가 큰 경우 큰 문자열을 한번에 메모리에 올려두고 응답을 수행해야 해서 서버에 부담이 될 수있을 때 스트림을 사용하면 큰 크기의 데이터를 chunk 단위로 분리해 순차적으로 처리할 수 있음.

### 4.2.4 renderToStaticNodeStream

- renderToNodeStream과 결과물은 동일하나 renderToStaticMarkup과 동일하게 자바스크립트에 필요한 리액트 속성 제공x 순수한 HTML 결과물이 필요할 때 사용하는 메서드

### 4.2.5 hydrate

- HTML 콘텐츠에 이벤트 핸들러를 붙인다
- 앞서 [4.2.1 renderToString](#421-rendertostring) 예시에서 얻은 HTML 결과물에 이벤트 핸들러를 붙여 사용자와 상호작용 할 수 있게 해준다.

### 4.2.6 정리

- 어느 정도 성능이 보장된 SSR을 하려면 매우 복잡하다. 무엇보다 SSR을 하려면 서버가 있어야한다. <BR> 리액트기반 프레임워크인 Next.js는 이러한 SSR의 진입장벽을 많이 낮춰줘 많은 개발자들에게 각광받고있다.

## 4.3 Next.js 톺아보기

### 4.3.1 Next.js 란?

- 풀스택 웹 애플리케이션을 구축하기 위한 리액트 기반 프레임워크, SSR 기능을 사용하기 쉽다.

### 4.3.2 Next.js 시작하기

(1) pages/\_app.tsx <br>

- 전체 페이지의 시작점
- error 바운더리를 사용해 애플리케이션 전역에서 발생하는 에러 처리
- global css 선언
- 모든 페이지에 공통으로 사용되는 데이터 제공 (ex. 인증)

(2) pages/\_document.tsx

- \_app.tsx가 애플리케이션 페이지 전체 초기화라면, \_document.tsx는 HTML을 초기화 하는 곳
- \_app.tsx는 서버나 클라이언트에서 실행될 수 있지만, \_document는 서버에서만 실행

(3) 서버 라우팅과 클라이언트 라우팅의 차이

- Next.js는 서버 사이드 렌더링을 수행하고 동시에 SPA 같이 클라이언트 라우팅도 수행한다.
- Next.js에서 제공하는 Link 태그로 SPA 라우팅이 가능하다.
- 즉, Next.js 는 SSR의 장점, 사용자가 최초 페이지를 빠르게 볼 수 있고 SPA 라우팅을 통해 SPA 장점을 모두 가져왔다.

### 4.3.3 Data Fetching

(1) getStaticPaths와 getStaticProps

- getStaticPaths는 접근 가능한 주소를 정의
- getStaticProps는 getStaticPaths에서 정의한 페이지를 기준으로 해당 페이지 요청이 왔을 때 제공할 props를 반환
- 즉, getStaticPaths를 통해 생성된 주소 만큼의 HTML을 빌드 시점에 미리 데이터를 불러온 다음 만들어 놓는다. (해당 주소로 접근 시 SSR을 통해 사용자가 빠르게 볼 수 있음)

(2) getServerSideProps
