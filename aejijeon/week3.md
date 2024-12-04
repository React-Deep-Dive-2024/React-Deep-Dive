## useState

- let variable = a; vs const [variable, setVariable] = useState(a)
  - 컴포넌트 내에서 상태 유지, 업데이트 기능 차이
    - let variable…
      렌더링 시 매번 초기화
    - useState…
      - 상태는.. 유지됨.
      - setVariable로 데이터 변경 + 렌더링 수행.
      - 관리할 상태 index 값을 클로저를 이용하여 setState 내부에서 유지.
      - 하나의 state마다 index 할당되어있음
      - 컴포넌트 매번 실행되더라도 이전의 값 정확히 꺼내어 쓸 수 있음.
      - index로 훅 실행 순서 관리.
        - useState, useState, useEffect 순서로 선언시, index 0, 1, 2
        - 리렌더링 시에도 각각 index 동일하게(0, 1, 2) 유지.
- 게으른 초기화
  - 언제 사용하나면
    - ls, ss접근, filter/map/.. 배열 접근 등의 작업
  - useRef 게으른 초기화
    ```jsx
    function Component() {
      const ref = useRef(null);
      if (ref.current === null) {
        ref.current = createInitialValue();
      }
      // ...
    }
    ```
    - [트러블 슈팅 경험함](https://aejizone.netlify.app/react%EC%97%90%EC%84%9C%20lazy%20initialization%EC%9D%84%20%EA%B3%A0%EB%A0%A4%ED%95%B4%EC%95%BC%20%ED%95%98%EB%8A%94%20%EC%9D%B4%EC%9C%A0/)

## useEffect

- 컴포넌트 내의 여러 값들을 활용해 동기적으로 부수효과를 만드는 매커니즘
- 어떻게 변경을 감지? ~~proxy, 옵저버 …~~ state와 props 변화 속에서 일어나는 렌더링 과정에서 실행되는 부수 효과 함수.
- 클린업 함수는?
  - 컴포넌트 리렌더링 될 때마다, 의존성이 변경된 값으로 callback 실행할 경우, 이전 값 기반으로 clear할 작업들을 실행하기 위한 함수.
  - 새로운값과 렌더링 된 후에 실행됨.
    - effect 실행 필요시, cleanup() ⇒ callback with 새로운값.
  - 언마운트 개념(class comonent에서 사용하는 개념)과는 조금 차이가 있음.
  - class component 메서드 동작 구현은 가능
    ```tsx
    function MyComponent() {
      useEffect(() => {
        // 마운트 시 실행되는 로직
        console.log("Component mounted");

        // 언마운트 시 실행되는 로직 (componentWillUnmount)
        return () => {
          console.log("Component unmounted");
        };
      }, []);
    ```
- 리액트에서는 값을 비교할 때 `Object.is()` 얕은 비교. 의존성 배열 비교 등.
- 클린업 함수 예시
  ```tsx
  import React from 'react';
  import { useState, useEffect } from 'react';
  export function App() {
    const [counter, setCounter] = useState(0);
    function handleClick() {
      console.log('handleClick!', counter);
      setCounter((prev) => prev + 1);
    }

    useEffect(() => {
      function addMouseEvent() {
        console.log('event handler!', counter);
      }
      window.addEventListener('click', addMouseEvent);
      // 클린업 함수
      return () => {
        console.log('클린업 함수 실행!', counter);
        window.removeEventListener('click', addMouseEvent);
      };
    }, [counter]);
    return (
      <>
        <h1>{counter}</h1>
        <button onClick={handleClick}>+</button>
      </>
    );
  }
  ```
- 실행순서
  1. handleClick
  2. Dom render
  3. cleanup
  4. addMouseEvent
- handleClick, addMouseEvent 실행 순서 차이나는 이유는 뭘까요..?
- 컴포넌트 렌더링됐는지 확인하기 위한 방법으로,
  `useEffect(()=>{console.log()})` 말고도 컴포넌트 내부에서 직접 console.log() 실행 하는건?
- react에서 차이 있음. ssr개념 연결지어서 생각해보면..
  - useEffect effect는 csr 이후 실행됨이 보장. ssr의 경우엔 실행x
  - 후자는 csr, ssr 경우 모두 수행됨.
- 단순 csr 기반 컴포넌트라면…
  - 로깅 횟수는 동일.
  - useEffect 사용 목적이 렌더링 부수효과를 수행하기 위함. 목적이 렌더링 로깅에 부합.
  - 후자는 렌더링 과정에서 수행하는 것. 렌더링 지연시킬 가능성 있음.
- eslint-disale-line react-hooks/exhaustive-deps 주석은 최대한 자제하기.
  - useEffect는 의존성 값 변경에 따라 부수효과 실행하는 목적.
  - 의존성으로 빈 배열 넘기고 있다면, “정말로 마운트 된 후에만 실행되어야 하나?” 확인
    - 그렇다면, 부수효과 실행 위치가 잘못될 가능성이 큼
  - useEffect 효과와 컴포넌트 내의 값들(state, props, ..)의 흐름이 맞아야 함.
- 불필요한 외부 함수 만들지 말기
  - useEffect 내부에서 사용할 부수효과는 useEffect 내부에서 정의해서 사용
- useEffect callback을 비동기로 넣으면 왜 안 될까?
  - state의 race condition 발생 가능성 때문에 막아놓음. cleanup 함수 실행 순서도 보장할 수 없기 떄문에 개발자 편의성을 위해 막아놓음.
    - callback 내부에서 비동기함수 정의 후 호출해도 race condition 발생 가능..
- useEffect 주의해서 사용하기
  - state의 경쟁 상태(race condition) 발생 가능.
    - cleanup 함수로 처리하기
      - cleanup을 통해 현재 작업 결과 반영 여부를 판단하는 flag 세팅
      - fetch의 경우, abortController 등으로 이전 요청 취소하기

## useMemo

- useMemo vs React.memo for component memoization

## useRef

- 컴포넌트 인스턴스 내에서 데이터 관리 목적. 변경하여도 컴포넌트 리렌더링 발생 x.
- 전역 변수로 사용하는 것과 다른 점
  - 컴포넌트 마운트 전부터 해당 변수 저장을 위한 메모리가 사용됨.
  - 동일한 컴포넌트의 여러 인스턴스는 동일한 데이터를 참조.
    - 보통 여러 인스턴스 내에서 각각의 데이터 관리하기 위한 목적으로 사용됨.
- useMemo 활용하여 구현되는듯.
- 원하는 시점의 값을 렌더링 영향 안 받고 넣어두고 싶을 때 사용
  - 예시. 이전 상태 값 보여주기.
    ```jsx

    function usePrevious (value) {
    const ref = useRef()
    useEffect(() => {
      console.log('value!', value)
    ref.current= value;
    }, [value]) // value가 변경되면 그 값을 ref에 넣어둔다.
    return ref.current
    }

    function SomeComponent() {
    const [counter, setCounter]
    =
    useState(0)
    const previousCounter = usePrevious (counter)
    function handleClick() {
    setCounter((prev) => prev + 1)
    }
    ```

## useContext

- 사용할 Provider를 모두 최상위로 끌어올려서 선언하면.. 불필요하게 리소스가 낭비됨
  - context 데이터 변경되면 모든 하위 컴포넌트 렌더링,, (부모 컴포넌트 렌더링 시, 자식 컴포넌트 렌더링되는 리액트 동작.)
  - 단순히 하위 컴포넌트에 상태 주입해주기 위한 용도.
  ⇒ context 범위는 필요한 환경에서 최대한 좁게 만들기!
  - memoization한다면..
    - state prop drilling 시, 중간 컴포넌트들 React.memo해도 해당 state를 props로 넘겨받기 때문에 리렌더링 발생
    - context를 useState로 정의, 중간 컴포넌트들 React.memo하면.. 하위 컴포넌트만 리렌더링
      - state prop drilling 인한 불필요한 리렌더링 해결
- context는 상태 관리를 위한 react api가 아님. 단순 상태 주입 용도.
  - 상태 관리 라이브러리는 최소한 “파생 상태 구성”, “필요에 따라 상태 변화를 최적화” 를 제공해주어야 함

## useReducer

## useImperativeHandle

## useLayoutEffect

- 실행 순서
  1. 리액트 DOM 업데이트
  2. useLayoutEffect callback 실행
  3. 브라우저에 업데이트 사항 반영
  4. useEffect callback 실행
- 브라우저 업데이트 사항 반영이 지연되기 때문에 사용자 경험에 악영향 미칠 수 있음
- 특정 요소에 애니메이션을 설정하거나 스크롤 위치 제어 등에 사용하면 자연스러운 ux 제공 가능

## 훅의 규칙

- 컴포넌트 내 최상위 선언. 실행 순서 중요
  - 훅에서 관리되는 데이터들은 global하게 저장, 각 훅에 지정된 index를 통해 조회,업데이트,이전 값과 비교 등을 수행
    - fiber는 훅 실행 순서에 따라 객체 linked list 구성하여 관리.
  - 조건 내에서 호출하는 등.. 실행 순서가 보장 안 되는 경우에 linked list구조가 깨짐. 리액트에서 에러 던짐

## 사용자훅 vs HOC

- HOC는 예측 어려움.
  - hoc 내부에서 어떤 로직을 처리하고 렌더링하는 지 직접 파악해야 예측 가능.
- 언제 HOC사용?
  - 공통 렌더링 로직이 필요한 경우.
    - 사용자 훅을 사용하면, 훅에서 반환한 데이터를 가지고 직접 렌더링. 전반적인 어플리케이션 내부에서 동일한 형태로 반복적으로 렌더링 구성해줘야 함.
