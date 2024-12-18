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
