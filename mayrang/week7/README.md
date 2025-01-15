### Airbnb

- 세미콜론 필수
  모든 구문 끝에 세미콜론을 반드시 추가

```jsx
const name = "Airbnb"; // 세미콜론 필수
```

- 탭 대신 스페이스 2칸 사용
  코드의 들여쓰기는 탭 대신 스페이스 2칸

```js
function sayHello() {
  console.log("Hello, Airbnb"); // 스페이스 2칸
}
```

- 화살표 함수 사용 권장
  익명 함수나 콜백 함수를 작성할 때 화살표 함수를 사용하는 것이 권장

```js
const numbers = [1, 2, 3];
const squared = numbers.map((n) => n * 2); // 화살표 함수 사용
```

- JSX 한 줄에 하나의 엘리먼트
  JSX에서 여러 엘리먼트를 작성할 때는 한 줄에 하나의 엘리먼트만 작성

```jsx
return (
  <div>
    <h1>Hello, Airbnb</h1>
    <p>This is a description.</p>
  </div>
); // 한 줄에 하나의 엘리먼트
```

- console.log 금지
  console.log는 일반적으로 금지되며, 디버깅을 위해서만 사용 ->
  development 환경에서는 허용, production에서만 warning/error

```js
console.log("Debugging only"); // console.log는 금지
```

- require 대신 import 사용
  CommonJS 방식(require) 대신 ES6 모듈 방식(import)을 사용

```js
import React from "react"; // import 사용
```

- export default 규칙 변화
  이전: export default 권장
  현재: named exports 선호 (tree-shaking 최적화를 위해)

```jsx
// 이전 방식
export default MyComponent;

// 현재 권장되는 방식
export { MyComponent };
```

- Trailing commas 허용
  객체나 배열의 마지막 요소 뒤에 쉼표를 허용

```js
const person = {
  name: "John",
  age: 30,
}; // trailing comma 허용
```

- prop-types 사용
  React 컴포넌트에서 prop-types를 사용해 props의 타입을 정의(현재는 필수 아님)

```jsx
import PropTypes from "prop-types";

const MyComponent = ({ name }) => <div>{name}</div>;

MyComponent.propTypes = {
  name: PropTypes.string.isRequired,
};
```

- Destructuring 사용
  객체나 배열의 값을 추출할 때는 destructuring을 사용

```js
const { name, age } = person;
```

- React import 규칙
  이전: import React from 'react' 필수
  현재: React 17 이후로는 JSX 변환이 자동으로 이루어져서 필수가 아님

```jsx
React 17 이전
import React from 'react';
const App = () => <div>Hello</div>;

// React 17 이후
const App = () => <div>Hello</div>;  // React import 필요 없음
```

- async/await 선호
  이전: Promise chain도 널리 사용
  현재: async/await 사용을 강력히 권장

```jsx
// 이전 방식
promise.then((result) => {}).catch((error) => {});

// 현재 권장되는 방식
try {
  const result = await promise;
} catch (error) {
  // error handling
}
```

- Optional Chaining 사용 권장
  이전: && 연산자로 체이닝
  현재: ?. 연산자 사용 권장

```jsx
// 이전 방식
const value = obj && obj.prop && obj.prop.value;

// 현재 권장되는 방식
const value = obj?.prop?.value;
```

### Triple

Airbnb 규칙들과 상이한 점 위주로 설명

- Import 순서 규칙이 더 엄격

```jsx
// Triple의 import 순서 규칙
import React from "react"; // 1. React/React Native 관련
import { useQuery } from "react-query"; // 2. 써드파티 라이브러리
import { api } from "@/services"; // 3. 절대 경로 불러오기
import { Button } from "../components"; // 4. 상대 경로 불러오기
import styles from "./styles"; // 5. 스타일 관련

// Airbnb는 이렇게까지 엄격한 순서를 요구하지 않음
```

- 스타일 관련 규칙

```tsx
// Triple의 스타일 규칙
// - styles 변수명 강제
// - 인라인 스타일 금지
const styles = {
  container: {
    padding: 16
  }
};
// 인라인 스타일 금지 (Triple)
<View style={{ padding: 16 }} /> // ❌
<View style={styles.container} /> // ✅
```

- 조건부 렌더링 규칙

```tsx
// Triple - 길이가 짧은 경우만 삼항 연산자 허용
// 길면 반드시 분기처리

// 짧은 경우 허용
{
  isLoggedIn ? <LogoutButton /> : <LoginButton />;
}

// 긴 경우는 분기처리 필수
const renderContent = () => {
  if (isLoggedIn) {
    return <ComplexLogoutSection />;
  }
  return <ComplexLoginSection />;
};
```

- 테스트 파일 네이밍과 위치

```
// Triple의 테스트 파일 규칙
Component.tsx
Component.test.tsx  // 반드시 같은 폴더에 위치
// Airbnb는 __tests__ 폴더 사용 허용
__tests__/
  Component.test.tsx
```

- 컴포넌트 props 순서

```tsx
// Triple의 props 순서
<Button
  // 1. spreading props
  {...props}
  // 2. 주요 props (required)
  title="제목"
  onPress={handlePress}
  // 3. 선택적 props (optional)
  disabled={isDisabled}
  // 4. 스타일 관련 props
  style={styles.button}
/>
```

- 상수 네이밍과 위치

```tsx
// constants/index.ts
export const MAX_LENGTH = 100;

// Airbnb는 컴포넌트 파일 내 선언 허용
const MAX_LENGTH = 100;
```

- 에러 바운더리 필수

```tsx
// Triple - 모든 주요 컴포넌트에 에러 바운더리 필수
const MainScreen = () => (
  <ErrorBoundary fallback={<ErrorPage />}>
    <MainContent />
  </ErrorBoundary>
);
```

컴포넌트 크기 제한

```tsx
// Triple - 한 컴포넌트 파일 최대 200줄 제한
// 초과 시 반드시 분리

// Airbnb는 명시적인 줄 수 제한 없음
```
