### appDir

App Router는 이제 안정적이기 때문에 이 옵션은 Next.js 13.4부터 더 이상 필요 X

### assetPrefix

Next.js 프로젝트는 Vercel에 배포 시 자동으로 글로벌 CDN이 설정되므로 수동으로 assetPrefix를 설정할 필요가 없다. 하지만 CDN을 직접 설정하려면 next.config.js에서 assetPrefix를 추가할 수 있다. 예를 들어, 프로덕션 환경에서 CDN을 사용하고 로컬 개발 시에는 기본 설정을 사용할 수 있다.

```js
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  assetPrefix: isProd ? "https://cdn.mydomain.com" : undefined,
};
```

이 설정은 /\_next/static/ 경로에 있는 자바스크립트 및 CSS 파일에만 적용되며, public 폴더의 파일은 별도로 프리픽스를 설정해야 CDN을 통해 제공

### basePath

Next.js 애플리케이션을 도메인의 하위 경로에 배포하려면 basePath 옵션을 사용할 수 있다. basePath를 설정하면 애플리케이션 경로에 접두사를 추가할 수 있고, 빌드 시 설정되므로 변경하려면 다시 빌드해야 한다.

```js
module.exports = {
  basePath: "/docs",
};
```

next/link와 next/router는 자동으로 basePath를 적용. 예를 들어, /about 경로는 /docs/about로 변환된다. 이미지를 표시할 때도 basePath를 src 앞에 추가해야 한다.

이 설정으로 모든 링크와 이미지를 수정할 필요 없이 basePath를 적용할 수 있다.

### compress

Next.js는 기본적으로 next start나 커스텀 서버를 사용할 때 gzip을 사용해 렌더링된 콘텐츠와 정적 파일을 압축한다. 이는 압축이 없는 애플리케이션을 최적화하기 위한 거다. 커스텀 서버에서 이미 압축을 구성한 경우 Next.js는 추가로 압축하지 않는다.

Vercel에 호스팅된 경우 brotli 압축을 우선 사용하고, 그다음 gzip을 사용한다. 압축이 활성화됐는지 확인하려면 Accept-Encoding과 Content-Encoding 헤더를 확인할 수 있다.

압축을 비활성화하려면 compress 옵션을 false로 설정하면 된다.

```js
module.exports = {
  compress: false,
};
```

서버에서 압축을 설정하지 않은 경우, 압축을 비활성화하지 않는 게 좋다. 압축은 대역폭 사용을 줄이고 성능을 향상시켜 주기 때문이다. 압축 알고리즘을 변경하려면 커스텀 서버를 사용하고 compress를 false로 설정해야 한다.

Vercel에서 호스팅된 Next.js 애플리케이션은 Vercel의 엣지 네트워크에서 압축을 처리하니 참고하면 된다.

### crossOrigin

crossOrigin 옵션을 사용하면 next/script 컴포넌트에서 생성된 모든 <script> 태그에 crossOrigin 속성을 추가해 크로스 오리진 요청을 어떻게 처리할지 정의할 수 있다.

```js
module.exports = {
  crossOrigin: "anonymous",
};
```

옵션으로는 두 가지가 있다:

- 'anonymous': crossOrigin="anonymous" 속성을 추가
- 'use-credentials': crossOrigin="use-credentials" 속성을 추가

### devIndicators

CSS Chunking은 웹 애플리케이션에서 CSS 파일을 청크로 나누어 필요한 CSS만 로드함으로써 성능을 향상시키는 전략이다. next.config.js 파일의 experimental.cssChunking 옵션을 사용해 이 동작을 제어할 수 있다.

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cssChunking: "loose", // 기본값
  },
};

module.exports = nextConfig;
```

옵션은 다음 두 가지가 있다:

- 'loose' (기본값): Next.js가 CSS 파일을 병합하여 청크와 요청 수를 줄인다.
- 'strict': CSS 파일을 로드한 순서대로 정확히 로드하여 더 많은 청크와 요청이 발생할 수 있다.

> 예상치 못한 CSS 동작이 발생하는 경우, 'strict'를 사용하는 것이 좋으며, 대부분의 경우 'loose'가 성능 개선에 유리

### headers

Next.js의 next.config.js 파일에서 headers를 사용해 요청에 응답할 때 추가하거나 변경할 HTTP 헤더를 정의할 수 있다. 이때 사용되는 주요 옵션과 예제는 다음과 같다:

1. 기본적인 헤더 설정
   특정 경로에 대해 사용자 지정 HTTP 헤더를 설정.

```js
module.exports = {
  async headers() {
    return [
      {
        source: "/about",
        headers: [
          { key: "x-custom-header", value: "my custom header value" },
          {
            key: "x-another-custom-header",
            value: "my other custom header value",
          },
        ],
      },
    ];
  },
};
```

2. 경로 매칭 및 덮어쓰기
   두 개의 헤더가 동일한 경로와 일치할 경우, 마지막 헤더 값이 덮어씌워짐

```js
module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "x-hello", value: "there" }],
      },
      {
        source: "/hello",
        headers: [{ key: "x-hello", value: "world" }],
      },
    ];
  },
};
```

3. 와일드카드 경로 매칭
   경로 패턴에 와일드카드를 사용하여 동적 경로에 맞는 헤더를 설정

```js
module.exports = {
  async headers() {
    return [
      {
        source: "/blog/:slug*",
        headers: [{ key: "x-slug", value: ":slug*" }],
      },
    ];
  },
};
```

4. 정규식 경로 매칭
   정규식을 사용하여 특정 패턴의 경로와 일치하는 경우에 헤더를 설정

```js
module.exports = {
  async headers() {
    return [
      {
        source: "/blog/:post(\\d{1,})",
        headers: [{ key: "x-post", value: ":post" }],
      },
    ];
  },
};
```

5. has 및 missing을 사용한 헤더, 쿠키, 쿼리 값 매칭
   헤더, 쿠키 또는 쿼리가 있는 경우(has), 또는 없는 경우(missing)에 헤더를 적용

```js
module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        has: [{ type: "header", key: "x-add-header" }],
        headers: [{ key: "x-another-header", value: "hello" }],
      },
      {
        source: "/:path*",
        missing: [{ type: "header", key: "x-no-header" }],
        headers: [{ key: "x-another-header", value: "hello" }],
      },
    ];
  },
};
```

6. CORS 설정
   특정 경로에 대해 CORS 설정을 적용

```js
module.exports = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};
```

7. 보안 관련 헤더
   Strict-Transport-Security, X-Content-Type-Options, Permissions-Policy 등의 보안 헤더를 설정

```js
module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
```

### images

Next.js에서 내장 이미지 최적화 API 대신 클라우드 공급자(Akamai, AWS CloudFront, Cloudinary, Cloudflare, Contentful, Fastly)를 사용해 이미지를 최적화하려면 next.config.js에서 images 옵션을 설정하고 사용자 정의 이미지 로더를 만들어야 한다. 예시처럼 이미지 로더를 커스터마이징하면, 이미지 최적화를 외부 서비스로 넘길 수 있다.

next.config.js에서 loader 옵션과 loaderFile을 설정:

```javascript
module.exports = {
  images: {
    loader: "custom", // 커스텀 로더 사용
    loaderFile: "./my/image/loader.js", // 로더 파일 경로
  },
};
```

커스텀 이미지 로더 파일(my/image/loader.js)을 생성하여 클라우드 공급자의 이미지 최적화 서비스를 사용할 수 있다.

예시

```javascript
"use client";

export default function myImageLoader({ src, width, quality }) {
  // 클라우드 이미지 서비스의 URL을 사용
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`;
}
```

이렇게 하면 next/image를 사용할 때 이미지가 https://example.com/ 경로로 최적화 요청을 보내며, 이 경로는 클라우드에서 이미지를 처리하도록 설정된다. 각 이미지를 불러올 때 src, width, quality 매개변수를 전달하며, 기본 품질은 75로 설정할 수 있다.

또한 각 next/image 인스턴스에 대해 loader prop을 따로 지정하여 이미지 로더를 커스터마이징할 수도 있다.

### outputs

1. 파일 추적(Output File Tracing)
   Next.js는 페이지와 그 페이지가 사용하는 파일들을 자동으로 추적하여, 프로덕션 환경에 필요한 파일들만 선택해 배포에 포함한다. 이렇게 하면 배포 크기를 줄일 수 있고, 필요한 파일만 Docker나 서버에 배포할 수 있다.

기존에는 next start를 위해 모든 node_modules를 설치했어야 했지만, Next.js 12부터는 필요한 파일만 선택해 .next 폴더에 복사할 수 있다.

2. 자동 복사(Automatically Copying Traced Files)
   Next.js는 배포에 필요한 파일을 자동으로 복사하는 standalone 폴더를 생성할 수 있다. 이를 활성화하려면 next.config.js 파일에서 다음과 같이 설정:

```javascript
module.exports = {
  output: "standalone",
};
```

이 설정을 하면 .next/standalone 폴더가 만들어지고, node_modules에서 필요한 파일만 복사된다. 이 폴더를 이용해 배포하면, node_modules를 설치하지 않아도 바로 배포 가능하다.

3. 모노레포(Monorepo)에서 파일 추적 설정
   모노레포 구조에서는 파일 추적 경로를 직접 설정해야 할 수도 있다. 이때 next.config.js에서 outputFileTracingRoot를 설정하여 프로젝트 외부의 파일까지 추적할 수 있다.

```javascript
module.exports = {
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
};
```

4. 추가 최적화(Turbotrace)
   종속성 추적이 복잡해질 경우, 속도를 높이기 위해 Rust로 작성된 turbotrace를 사용할 수 있다. 이 기능을 활성화하려면 next.config.js에 추가 설정을 하면 된다.

```javascript
코드 복사
module.exports = {
  experimental: {
    turbotrace: {
      logLevel: 'error', // 로그 레벨을 설정
      memoryLimit: 6000, // 메모리 제한 설정 (단위: MB)
    },
  },
}
```

이 기능을 사용하면 빌드 속도가 빨라질 수 있습니다.

### optimizePackageImports

optimizePackageImports 옵션은 모듈이 많은 패키지를 사용할 때, 성능을 개선하는 기능다. 예를 들어, lodash 같은 라이브러리에는 수백 개의 모듈이 포함되어 있어 이를 전부 로드하면 성능에 영향을 줄 수 있다. 이 옵션을 사용하면 실제로 사용하는 모듈만 로드하여 성능을 최적화할 수 있다.

> **어떻게 동작할까?**
> 패키지를 optimizePackageImports에 추가하면 해당 패키지에서 실제로 사용되는 모듈만 로드된다. 이렇게 하면 불필요한 모듈이 로드되지 않으므로 개발 환경과 프로덕션에서 성능이 향상된다.

예시:

```javascript
module.exports = {
  experimental: {
    optimizePackageImports: ["lodash-es", "date-fns"], // 실제 사용하는 모듈만 로드
  },
};
```

기본 최적화되는 라이브러리
Next.js는 이미 몇몇 주요 라이브러리에 대해 기본적인 최적화를 지원. 그중에는 lucide-react, lodash-es, antd, rxjs 등 자주 사용되는 라이브러리가 포함.

### pageExtenstions

pageExtensions 옵션을 사용하면 Next.js가 페이지로 처리할 파일 확장자를 설정할 수 있다. 기본적으로는 .tsx, .ts, .jsx, .js 확장자를 사용하지만, 이를 수정하여 추가적인 확장자도 허용할 수 있다. 예를 들어, 마크다운 파일(.md, .mdx)을 페이지로 사용할 때 이 설정을 변경하면 된다.

예시:

```javascript
const withMDX = require("@next/mdx")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"], // 허용할 확장자 설정
};

module.exports = withMDX(nextConfig);
```

- withMDX: Next.js에서 마크다운 파일을 처리하기 위해 MDX 플러그인을 사용.

### Partial Prerendering (experimental)

Partial Prerendering은 Next.js의 실험적인 기능으로, 경로의 정적 부분은 사전 렌더링하여 캐시에서 제공하고, 동적 부분은 스트리밍하여 단일 HTTP 요청으로 처리할 수 있게 한다. 이 기능은 특히 애플리케이션의 성능을 개선하고, 서버에서의 부담을 줄이는 데 유용할 수 있다.

활성화 방법
next.config.js에서 ppr 플래그를 사용하여 Partial Prerendering을 활성화

예시:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: "incremental", // 점진적 활성화
  },
};

module.exports = nextConfig;
```

옵션

- incremental: 애플리케이션의 특정 경로와 레이아웃에 대해 Partial Prerendering을 점진적으로 활성. 각 경로에서 experimental_ppr 설정을 사용해 PPR을 명시적으로 선택해야 함.
- true: 모든 경로에 대해 Partial Prerendering을 활성화. 이 옵션을 사용하려면 먼저 incremental을 사용하여 점진적으로 적용한 후, 최종적으로 true로 설정하는 것이 권장.

참고 사항

- 클라이언트 측 탐색: 현재 Partial Prerendering은 클라이언트 측 탐색에는 적용 X
- Node.js 런타임: Partial Prerendering은 Node.js 런타임을 위해 설계되었음. Edge Runtime에서 즉시 정적 셸을 제공할 수 있는 경우에는 사용할 필요가 없음.
- 경로별 선택: incremental을 사용할 때, experimental_ppr 옵션이 없는 경로는 기본적으로 PPR이 비활성화. 이를 활성화하려면 각 경로에 대해 명시적으로 설정.

Partial Prerendering이란?
해당 링크 참조
https://kidongg.github.io/posts/partial-prerendering/

### reactCompiler(experimental)

eactCompiler는 Next.js 15에서 도입된 실험적 기능으로, React 컴포넌트의 렌더링을 자동으로 최적화하여 성능을 향상시킨다. 이 컴파일러는 useMemo, useCallback과 같은 API를 통해 개발자가 수동으로 메모이제이션을 하는 부담을 줄여준다.

사용 방법
Next.js 15로 업그레이드하고, babel-plugin-react-compiler를 설치해야한다.

```bash
npm install babel-plugin-react-compiler
```

next.config.js에 reactCompiler 옵션을 추가하여 활성화

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
};

module.exports = nextConfig;
```

옵트인 모드 설정
React Compiler를 "옵트인" 모드로 설정하여, 컴파일러의 동작을 세밀하게 제어할 수 있다. 예를 들어, compilationMode를 annotation으로 설정할 수 있다.

```javascript
const nextConfig = {
  experimental: {
    reactCompiler: {
      compilationMode: "annotation", // 옵트인 모드 활성화
    },
  },
};

module.exports = nextConfig;
```

> 참고 사항
> Babel 플러그인을 통해 React Compiler가 활성화됩니다. 현재는 Next.js의 기본 Rust 기반 컴파일러 대신 Babel을 사용해야 하므로 빌드 시간이 다소 느려질 수 있습니다.
> 향후 업데이트에서 React Compiler를 Next.js의 기본 컴파일러로 지원할 계획입니다.
> 이 기능을 활성화하면 컴포넌트의 렌더링 최적화가 자동으로 이루어지며, 성능 개선을 기대할 수 있습니다. 다만, 실험적인 기능이기 때문에 향후 변경될 수 있음을 유의해야 합니다.

### redirects

Next.js에서 redirects를 사용하면 특정 경로에 대한 요청을 다른 경로로 리디렉션할 수 있다. 리디렉션은 요청 경로와 일치하는 패턴을 기반으로 수행되며, 이를 통해 URL을 변경하거나 페이지 이동을 쉽게 처리할 수 있다.

사용법
next.config.js 파일에서 redirects 키를 사용하여 리디렉션을 설정

예시:

```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: "/about",
        destination: "/",
        permanent: true,
      },
    ];
  },
};
```

**리디렉션 설정**
리디렉션 객체는 다음과 같은 속성을 가짐:

- source: 요청 경로를 정의하는 패턴. 경로에서 :를 사용하여 동적인 부분을 캡처할 수 있다.
- destination: 리디렉션할 대상 경로. source에서 캡처된 값을 destination에서 사용할 수 있.
- permanent: true 또는 false로, 영구 리디렉션(301, 308)인지 일시적 리디렉션(302, 307)인지를 정의다.
  true: 영구 리디렉션 (예: 308 상태 코드 사용)
  false: 일시적 리디렉션 (예: 307 상태 코드 사용)

> 왜 Next.js는 307과 308을 사용하나요? 전통적으로 302는 일시적 리디렉션에, 301은 영구적 리디렉션에 사용되었지만, 많은 브라우저가 리디렉션의 요청 메서드를 원래 메서드와 상관없이 GET으로 변경했습니다. 예를 들어, 브라우저가 POST /v1/users 요청을 하고 상태 코드 302와 함께 위치 /v2/users를 반환하면, 이후 요청은 POST /v2/users 대신 GET /v2/users가 될 수 있습니다. Next.js는 307 일시적 리디렉션과 308 영구적 리디렉션 상태 코드를 사용하여 사용된 요청 메서드를 명시적으로 유지합니다.

> **리디렉션의 동작**
> 리디렉션은 파일 시스템(페이지 및 /public 파일)을 처리하기 전에 적용.
> Pages Router를 사용할 경우, 리디렉션은 클라이언트 측 라우팅(예: Link, router.push)에는 적용되지 않는다.
> 리디렉션 시 쿼리 문자열은 리디렉션 대상에 그대로 전달.

### rewrites

Next.js에서 rewrites를 사용하면 요청 경로를 다른 목적지 경로로 매핑할 수 있다. Rewrites는 사용자가 요청한 URL을 변경하지 않고, 백엔드에서 URL을 매핑하여 다른 경로로 요청을 전달하는 방식다. 이는 Redirects와는 달리 URL이 변경되지 않으며, 사용자에게는 사이트의 위치가 변경되지 않은 것처럼 보이게 한다.

사용법
next.config.js 파일에서 rewrites 키를 사용하여 요청 경로를 재매핑할 수 있다.

예시:

```javascript
module.exports = {
  async rewrites() {
    return [
      {
        source: "/about",
        destination: "/",
      },
    ];
  },
};
```

**동작 방식**

- source: 요청 경로를 정의하는 패턴. 사용자가 요청하는 경로.
- destination: 요청을 리디렉션할 경로. 실제로 처리되는 경로.

**클라이언트 측 라우팅에서의 동작**
Link 컴포넌트를 사용한 클라이언트 측 라우팅에도 적용

```jsx
<Link href="/about">Go to About Page</Link>
```

위의 링크를 클릭하면 /about로 요청이 가고, 실제로는 / 경로로 매핑.
**rewrites와 라우팅 순서**

1. headers: 먼저 헤더가 확인되고 적용.
2. redirects: 리디렉션이 확인되고 적용.
3. beforeFiles rewrites: 파일 시스템에서 파일을 제공하기 전에 재작성된 경로가 확인되고 적용.
4. 정적 파일 제공: public 디렉토리의 정적 파일과 \_next/static 파일이 제공.
5. afterFiles rewrites: 파일 시스템에서 동적 페이지 또는 정적 파일을 제공한 후, 재작성된 경로가 적용.
6. fallback rewrites: 404 페이지 렌더링 전에 마지막으로 적용. 이 단계는 동적 경로를 처리하며, getStaticPaths에서 fallback: true 또는 fallback: 'blocking'을 사용하는 경우에는 실행되지 않는다.

### serverActions

Next.js에서 Server Actions는 서버 측에서 데이터를 처리하는 기능으로, 클라이언트에서 서버로 데이터를 전송하고 서버에서 이를 처리하는 로직을 구현할 수 있게 해준다. 이를 통해 더 안전하게 API와 서버 처리를 관리할 수 있다.

**Server Actions 설정 옵션**
allowedOrigins:
이 옵션은 Server Actions가 호출할 수 있는 안전한 출처(도메인)의 목록을 정의한다. 기본적으로 Server Action 요청의 출처와 호스트 도메인을 비교하여 일치하는지 확인하며, 이를 통해 CSRF 공격을 방지한다.제공되지 않으면 동일한 출처만 허용된다.
예시:

```javascript
/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    serverActions: {
      allowedOrigins: ["my-proxy.com", "*.my-proxy.com"],
    },
  },
};
```

bodySizeLimit:
기본적으로 Server Action으로 전송되는 요청 본문의 최대 크기는 1MB이다. 이는 과도한 서버 리소스 소비를 방지하고, 잠재적인 DDoS 공격을 예방하기 위한 설정이다.
serverActions.bodySizeLimit 옵션을 사용하여 이 한도를 변경할 수 있다. 값은 바이트 수 또는 1000, '500kb', '3mb'와 같은 문자열 형식으로 설정할 수 있다.
예시:

```javascript
/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};
```

Server Actions 활성화:

Next.js 14에서 Server Actions는 기본적으로 활성화되어 있지만, 이전 버전의 Next.js에서는 이를 활성화하려면 experimental.serverActions를 true로 설정해야 한다.
예시:

```javascript
/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    serverActions: true,
  },
};

module.exports = config;
```

**사용 예시**
Server Actions를 사용하면 클라이언트에서 서버로 데이터를 보내고 처리할 수 있는 기능을 간단하게 구현할 수 있다. 예를 들어, 데이터베이스에 저장하거나 외부 API와 통신하는 작업을 서버 측에서 처리할 수 있다.

참고
[nextjs 한글 문서](https://nextjs-ko.org/)
