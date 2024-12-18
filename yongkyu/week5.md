# 5장 리액트와 상태 관리 라이브러리

[5.1 상태 관리는 왜 필요한가?](#51-상태-관리는-왜-필요한가)

- [5.1.1 리액트 상태 관리의 역사](#511-리액트-상태-관리의-역사)

[5.2 리액트 훅으로 시작하는 상태 관리](#52-리액트-훅으로-시작하는-상태-관리)

- [5.2.1 가장 기본적인 방법: useState와 useReducer](#521-가장-기본적인-방법-usestate와-usereducer)
- [5.2.2 지역 상태의 한계를 벗어나보자: useState의 상태를 바깥으로 분리하기](#522-지역-상태의-한계를-벗어나보자-usestate의-상태를-바깥으로-분리하기)
- [5.2.3 useState와 Context를 동시에 사용해 보기](#523-usestate와-context를-동시에-사용해-보기)
- [5.2.4 상태 관리 라이브러리 Recoil, Jotai, Zustand 살펴보기🎈](#524-상태-관리-라이브러리-recoil-jotai-zustand-살펴보기)
- [5.2.5 정리](#525-정리)

## 5.1 상태 관리는 왜 필요한가?

### 5.1.1 리액트 상태 관리의 역사

- Flux 패턴의 등장 (Action -> Dispatcher -> Model -> View)
- 리덕스 (Flux 구조 + Elm 아키텍쳐, but 많은 보일러플레이트)
- Context API (props 드릴링 문제 해결, but 상태 관리가 아닌 주입을 도와주는 기능, 불필요한 렌더링)
- React query, SWR (http 요청에 특화됨)
- Recoil, Zustand, Jotai, Valtio

## 5.2 리액트 훅으로 시작하는 상태 관리

### 5.2.1 가장 기본적인 방법: useState와 useReducer

- 커스텀 훅을 통한 지역 상태 관리

```
function useCounter(init: number = 0) {
  const [count, setCount] = useState(init);

  function increase() {
    setCount(prev => prev + 1);
  }

  return { counter, increase }
}
```

### 5.2.2 지역 상태의 한계를 벗어나보자: useState의 상태를 바깥으로 분리하기

- useState는 리액트가 만든 클로저 내부에서 관리되어 지역 상태로 생성되기 때문에 해당 컴포넌트에서만 사용할 수 있음. 전역 상태를 만들고 이를 참조하는 컴포넌트들이 랜더링되게 하려면 아래 3가지 조건을 만족해야함

1. 컴포넌트 외부 어딘가에 상태를 두고 여러 컴포넌트가 같이 사용할 수 있어야함
2. 이 외부의 상태를 사용하는 컴포넌트가 상태 변화를 알아챌 수 있어야되고 상태 변경 시에 리렌더링이 일어나 항상 최신 상태를 display 해야함
3. 상태가 객체인 경우 참조하지 않는 값이 바뀐 경우엔 리렌더링이 발생하면 안됨.

```
export const createStore = (initState) => {
  // state의 값은 스토어 내부에서 보관해야 하므로 변수로 선언
  let state = typeof initState !== "function" ? initState : initState();

  // callbacks는 자료형에 관계없이 유일한 값을 저장할 수 있는 Set을 사용
  const callbacks = new Set();

  // 언제든 get이 호출되면 최신값을 가져올 수 있도록 함수로 만든다.
  const get = () => state;
  const set = (nextState) => {
    // 인수가 함수라면 함수를 실행해 새로운 값을 받고,
    // 아니라면 새로운 값을 그대로 사용한다.
    state = typeof nextState === "function" ? nextState(state) : nextState;

    // 값의 설정이 발생하면 콜백 목록을 순회하면서 모든 콜백을 실행한다.
    callbacks.forEach((callback) => callback());

    return state;
  };

  // subscribe는 콜백을 인수로 받는다.
  const subscribe = (callback) => {
    // 받은 함수를 콜백 목록에 추가한다.
    callbacks.add(callback);
    // 클린업 실행 시 이를 삭제해서 반복적으로 추가되는 것을 막는다.
    return () => {
      callbacks.delete(callback);
    };
  };
  return { get, set, subscribe };
};

// createStore은 관리해야 하는 상태를 내부 변수로 갖고, get 함수로 상태의 최신값을 제공하며, set 함수로 내부 변수를 최신화하며, 이 과정에서 등록된 콜백을 전부 실행하는 구조이다.

추가로 useStore 라는 훅을 통해 store(전역 변수)를 참조하고 store가 변하면 컴포넌트를 리랜더링 시킨다.

export const useStore = (store) => {
  const [state, setState] = useState(() => store.get());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.get());
    });
    return unsubscribe;
  }, [store]);

  return [state, store.set];
};

// 사용
const store = createStore({ count: 0 });

function Counter1() {
  const [state, setState] = useStore(store);

  function handleClick() {
    setState((prev) => ({ count: prev.count + 1 }));
  }

  return (
    <>
      <h3>{state.count}</h3>
      <button onClick={handleClick}>+</button>
    </>
  );
}

function Counter2() {
  const [state, setState] = useStore(store);

  function handleClick() {
    setState((prev) => ({ count: prev.count + 1 }));
  }

  return (
    <>
      <h3>{state.count}</h3>
      <button onClick={handleClick}>+</button>
    </>
  );
}

export default function App() {
  return (
    <div>
      <Counter1 />
      <Counter2 />
    </div>
  );
}

```

### 5.2.3 useState와 Context를 동시에 사용해 보기

- 많은 상태 관리 라이브러리의 작동 방식

1. useState, useReducer의 한계는 결국 지역 상태관리이고 이를 극복하기 위해 외부 어딘가에 상태를 둔다. 이는 컴포넌트 최상단 이나, 격리된 자바스크립트 스코프 어딘가일 수도 있다.
2. 이 외부 상태 변경을 감지해 컴포넌트의 렌더링을 일으킨다.

### 5.2.4 상태 관리 라이브러리 Recoil, Jotai, Zustand 살펴보기

[🎈Recoil 톺아보기](https://fkawnltjsejdj.tistory.com/category/React)

### 5.2.5 정리

- 많은 상태 관리 라이브러리 중 현재 프로젝트에 어울리는 라이브러리를 사용하는 것이 효율적이고, 잘 관리되어 npm 에서 많이 다운받거나 git star가 많은 라이브러리를 선택 하는것이 보다 안정적이다. (recoil의 경우 몇년간 업데이트도 유지보수도 없으니 사용시 유의하자)
