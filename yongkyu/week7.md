# 8장 좋은 리액트 코드 작성을 위한 환경 구축하기

[8.1 ESLint를 활용한 정적 코드 분석](#81-eslint를-활용한-정적-코드-분석)

- [8.1.1 ESLint 살펴보기](#811-eslint-살펴보기)
- [8.1.2 eslint-plugin과 eslint-config](#812-eslint-plugin과-eslint-config)
- [8.1.3 나만의 ESLint 규칙 만들기](#813-나만의-eslint-규칙-만들기)
- [8.1.4 주의할 점](#814-주의할-점)

[8.2 리액트 팀이 권장하는 리액트 테스트 라이브러리](#82-리액트-팀이-권장하는-리액트-테스트-라이브러리)

- [8.2.1 React Testing Library](#821-react-testing-library)
- [8.2.2 자바스크립트 테스트의 기초](#822-자바스크립트-테스트의-기초)
- [8.2.3 리액트 컴포넌트 테스트 코드 작성하기](#823-리액트-컴포넌트-테스트-코드-작성하기)

## 8.1 ESLint를 활용한 정적 코드 분석

- 버그를 줄이기 위해 가장 쉽게 할 수 있는 ESLint

### 8.1.1 ESLint 살펴보기

- ESLint 동작 방식

1. 자바스크립트 코드를 문자열로 읽는다.
2. 자바스크립트 코드를 분석할 수 있는 파서(parser)로 코드를 구조화한다.
3. 2번에서 구조화한 트리를 AST(Abstract Syntax Tree)라 하며, 이 구조화된 트리를 기준으로 각종 규칙과 대조한다.
4. 규칙과 대조했을 때 이를 위반한 코드를 알리거나(report) 수정한다(fix).

위 2번 과정에서 파서는 espree를 사용한다. 타입스크립트의 경우도 마찬가지로 @typescript-eslint/typescript-setree 라는 espree 기반 파서가 있으며, 이를 통해 타입스크립트 코드를 분석해 구조화한다.

```
debugger만 있는 코드를 espree로 분석한 모습
{
  "type": "Program",
  "body": [
    {
      "type": "DebuggerStatement",
      "range": [0,8]
    }
  ],
  "sourceType": "module",
  "range": [0, 8]
}
```

```
no-debugger 규칙

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow the use of `debugger`',
      recommended: true,
      url: 'https://eslint.org/docs/rules/no-debugger',
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: "Unexpected 'debugger' statement",
    },
  },
  create(context) {
    return {
      DebuggerStatement(node) {
        context.report({
          node,
          messageId: 'unexpected',
        })
      }
    }
  }
}
```

- 위의 용어를 살펴보자

1. meta : 해당 규칙과 관련된 메타 정보를 나타냄
2. messages : 규칙을 어겼을 때 반환하는 경고 문구
3. docs : 문서화에 필요한 정보
4. fixable : eslint --fix로 수정했을 떄 수정 가능한지 여부를 나타냄
5. create : 실제로 코드에서 문제점을 확인하는 곳. expree로 만들어진 AST트리를 실제로 순회해, 선언한 특정 조건을 만족하는 코드를 찾고, 이러한 작업을 코드 전체에서 반복.
   위 코드에선 DebuggerStatement를 만나면 해당 노드를 리포트한다.

### 8.1.2 eslint-plugin과 eslint-config

- eslint-plugin : 규칙을 모아놓은 패키지
- eslint-config : eslint-plugin을 한데 묶어서 한 세트로 제공하는 패키지
- eslint-config-airbnb : eslint-config 중 최고
- eslint-config-next : Next.js에서 사용할 수 있는 eslint -config 자바스크립트 코드를 정적 분석 & JSX 구문 및 \_app, \_document에서 작성돼 있는 HTML 코드도 정적 분석함.

### 8.1.3 나만의 ESLint 규칙 만들기

- 트리쉐이킹이란 : 번들러가 코드 어디에서도 사용하지 않는 코드를 삭제해서 최종 번들 크기를 줄이는 과정 (나뭇잎을 털어낸다는 의미에서 유래)

### 8.1.4 주의할 점

- Prettier 와의 충돌
- (해결법1) 서로 충돌하지 않게 규칙을 선언. Prettier에서는 제공하는 규칙을 어기지 않도록, ESLint에서는 해당 규칙을 끄는 방법
- (해결법2) 자바스크립트나 타입스크립트는 ESLint에, 그 외의 파일(마크다운, YAML, JSON 등)은 모두 Prettier에 맡기는 것것

## 8.2 리액트 팀이 권장하는 리액트 테스트 라이브러리

- 테스트란 개발자가 만든 프로그램이 코딩을 한 의도대로 작동하는지 확인하는 일련의 작업.

- 백엔드에 비해 프론트엔드는 사용자와 동일하거나 유사한 환경에서 테스트를 진행해 모든 경우를 테스트 하기는 사실상 불가능하다. (TDD X -> 필요한 부분만 테스트)

### 8.2.1 React Testing Library

- jsdom을 통해 js 환경에서 HTML을 사용할 수 있다.

```
const jsdom = require("jsdom")

const { JSDOM } = jsdom
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`)

console.log(dom.window.document.querySelector('p').textContext) // Hello world
```

### 8.2.2 자바스크립트 테스트의 기초

```
assert 모듈을 사용한 테스트
const assert = require('assert');

function sum(a, b) {
  return a + b
}

assert.equal(sum(1, 2), 3)
assert.equal(sum(2, 2), 4)
assert.equal(sum(2, 2), 5) // AssertionError [ERR_ASSERTION]: 4 == 5

```

```
jest를 이용한 테스트

test("두 인수를 덧셈한다", () => {
  expect(sum(1, 2)).toBe(3);
});

test("두 인수를 덧셈한다", () => {
  expect(sum(2, 2)).toBe(3); // 에러
});

위와 같이 테스트 코드 입력 후 npm run test 명령어로 jest 를 실행한다.
```

### 8.2.3 리액트 컴포넌트 테스트 코드 작성하기

- 리액트에서 컴포넌트 테스트는 다음의 순서로 진행한다.

1. 컴포넌트를 렌더링한다
2. 필요하면 컴포넌트에서 특정 액션을 수행한다
3. 컴포넌트 렌더링과 2번 액션을 통해 기대하는 결과와 실제 결과를 비교한다

```
import { render, screen } from '@testing-library/react';
import App from './App'

test('renders learn react link', () => {
  render(<App />)
  const linkElement = screen.getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
})
```

- 코드는 다음의 순서로 진행된다

1. <APP/>을 렌더링한다.
2. 렌더링하는 컴포넌트 내부에서 'learn react'라는 문자열을 가진 DOM 요소를 찾는다
3. expect(linkElement).toBeInTheDocument() 라는 어설션을 활용해 2번에서 찾은 요소가 document 내부에 있는지 확인한다

- 리액트 컴포넌트에서 테스트하는 일반적인 시나리오는 특정한 무언가를 지닌 HTML 요소가 있는지 여부
