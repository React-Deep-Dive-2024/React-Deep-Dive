### 섣부른 최적화는 독. 꼭 필요한 곳에만 메모이제이션

리액트와 자바스크립트 입장에서 생각했을 때, 메모이제이션도 비용이 든다. 값을 비교하고 렌더링 또는 재계산이 필요한지 확인하는 작업, 그리고 이전에 결과물을 저장해 두었다가 다시 꺼내와야 한다는 두 가지 비용이 있다. 따라서 메모이제이션은 항상 어느 정도의 트레이드 오프가 있는 기법이라고 봐야함.

리액트는 가능한 한 오랫동안 이 캐시 결과를 저장하려고는 하겠지만 미래의 어던 경우에 따라서는 캐시가 무효화되는 경우도 있을 것이다.

## 렌더링 비용은 비싸므로 다 메모이제이션

두 가지 주장에서 공통으로 깔고 가는 전제는 일부 컴포넌트에서는 메모이제이션을 하는 것이 성능에 도움이 된다.

그럼 두 가지 선택권이 있음

- memo를 컴포넌트의 사용에 따라 잘 살펴보고 일부에만 적용하는 방법
- memo를 일단 그냥 다 적용하는 방법

첫 번째 방법은 가장 이상적이나 현실의 상황에서 저 기조를 유지하기 쉽지가 않음. 따라서 일단 memo로 감싼 뒤에 생각해 보는 것도 좋을 수도 있음. 이게 괜찮은지 생각해 볼려면 렌더링 비용이 저렴하거나 사실 별로 렌더링이 안 되는 컴포넌트에 memo를 썼을 때 역으로 지불해야 하는 비용을 생각해보자. 잘못된 memo로 지불해야 하는 비용은 바로 props에 대한 얕은 비교가 발생하면서 지불해야 하는 비용. 메모이제이션을 위해서는 cpu와 메모리를 사용해 이전 렌더링 결과물을 저장해 둬야 하고, 리렌더링할 필요가 없다면 이전 결과물을 사용. 근데 이건 기본적인 리액트의 재조정 알고리즘과 같음. 어차피 리액트의 기본적인 알고리즘 때문에 이전 결과물은 어떻게든 저장. 따라서 우리가 memo로 지불해야 하는 비용은 props에 대한 얕은 비교뿐.

반면 memo를 하지 않았을 때 발생할 수 있는 문제

- 렌더링을 함으로써 발생하는 비용
- 컴포넌트 내부의 복잡한 로직의 재실행
- 그리고 위 두 가지 모두가 모든 자식 컴포넌트에서 반복해서 일어남
- 리액트가 구 트리와 신규 트리를 비교

그럼 useMemo와 useCallback은 어떨까?

저 둘은 의존성 배열을 비교하고, 필요에 따라 값을 재계산하는 과정과 이러한 처리 없이 값과 함수를 매번 재생성하는 비용 중에서 무엇이 더 저렴한지 매번 계산. 리렌더링이 발생할 대 메모이제이션과 같은 별도 조치가 없다면 모든 객체는 재쟁성 → 참조값이 달라짐.

이 참조값을 useEffect와 같은 의존성 배열에 쓰이면 문제가 됨.

그렇기 때문에 저 둘을 사용하면 자신의 리렌더링뿐 아니라 이를 사용하는 측에서도 고정된 값을 사용하게 된다는 믿음을 주게됨

## 메모이제이션에 대한 결론

리액트를 배우면서 시간적 여유가 있고 깊은 이해를 하고 싶을 때는 렌더링 결과를 비교하며 꼭 필요한 경우에만 최적화

리액트를 실제 사용하며 시간적 여유가 없을 때는 일단 메모이제이견 라는 것도 괜찮음.

props의 얕은 비교보단 리렌더링이 보통은 더 비용이 많이 들고, useCallback과 useMemo 역시 하위 컴포넌트의 props로 넘어가는 경우가 많기엔 참조값 안정성을 위해서도 일단 메모이제이션하는 방법도 괜찮음

## 그렇다면 19버전에서 compiler가 도입되면?

### React Compiler는 어떤 역할을 할까?

리액트 컴파일러는 애플리케이션을 최적화하기 위해 코드를 자동으로 메모이제이션함.
이미 useMemo, useCallback, React.memo와 같은 메모이제이션과 관련된 API를 사용하면 React에 입력이 변경되지 않았다면 특정 부분을 다시 계산할 필요가 없다고 알릴 수 있어 업데이트 시 작업을 줄일 수 있음. 하지만 위에 설명한 것과 같이 이 방법은 매우 강력하지만 메모이제이션을 잘못 적용할 수도 있음. 이 경우 react가 의미 있는 병경사항이 없는 UI 일부를 확인해야 하므로 효율적일지 않을 수 있음.

컴파일러는 자바스크립트와 리액트의 규칙에 대한 지식을 활용해 자동으로 컴포넌트와 hooks내의 값 또는 값 그룹을 메모이제이션 함. 규칙 위반을 감지할 경우 해당 컴포넌트 또는 hooks를 건너 뛰고 다른 코드를 안전하게 컴파일함.

결론적으로 리액트 개발자가 메모이제이션을 수동적으로 적용하는 과정에서 발생할 수 있는 문제들을 19버전에서는 리액트 컴파일러가 자바스크립트와 리액트 규칙에 따라 메모이제이션을 해줌.

### 그럼 React Compiler는 어떤 것을 메모이제이션을 할까?

먼저 react 컴파일러의 초기 릴리즈는 업데이트 성능 개선에 초점을 맞추었으므로 다음 두 가지 사용사례에 중점을 두고 있음.

1. 불필요한 연쇄 리렌더링 방지

- 기존: 부모 컴포넌트가 업데이트되면 모든 자식 컴포넌트도 리렌더링
- 개선: 실제로 변경된 부분과 관련된 컴포넌트만 리렌더링

2. 비용이 큰 계산 최적화

- 컴포넌트나 Hook 내부의 무거운 계산 자동 메모이제이션
- 동일한 입력값에 대해 이전 계산 결과 재사용
- 불필요한 재계산 방지

#### 리렌더링 최적화

```jsx
javascriptCopyfunction ParentComponent() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Counter count={count} />
      <ExpensiveList items={someItems} />
      <StaticComponent />
    </div>
  );
}
```

- 기존 동작:
  -> count가 변경되면 전체 ParentComponent가 리렌더링
  -> 모든 자식 컴포넌트도 리렌더링 검사 대상

- 컴파일러 최적화 후:
  -> count 변경이 Counter에만 영향을 미친다는 것을 컴파일 타임에 감지
  -> ExpensiveList와 StaticComponent의 리렌더링 검사 자체를 건너뜀
  -> 실제 DOM 업데이트가 필요한 부분만 선택적으로 처리

#### 비용이 많이 드는 계산 메모이제이션

컴파일러는 렌더링 도중 비용이 많이 드는 계산에 대해 자동으로 메모이제이션을 적용할 수도 있다.

```jsx
// 컴포넌트나 Hook이 아니기 때문에 React 컴파일러에 의해 메모이제이션되지 않음
function expensivelyProcessAReallyLargeArrayOfObjects() {
  /* ... */
}

// 컴포넌트이기 때문에 React 컴파일러에 의해 메모이제이션
function TableContainer({ items }) {
  // 이 함수 호출은 메모이제이션 될 것
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```

그러나 외부 함수가 실제로 비용이 많이 드는 함수라면 다음과 같은 이유로 React 외부에서 해당 함수의 별도 메모이제이션을 고려해야 할 수도 있음.

- React 컴파일러는 React 컴포넌트와 Hooks만 메모이제이션 하며, 모든 함수를 메모이제이션 하지 않음
- React 컴파일러의 메모이제이션은 여러 컴포넌트나 Hooks 사이에서 공유되지 않음

좀 더 깊게 설명하면

```jsx
// 비용이 많이 드는 외부 함수
function expensiveCalculation(items) {
  return items.map(item => /* 무거운 계산 */)
         .filter(/* 복잡한 필터링 */)
         .sort(/* 정렬 */);
}

// 케이스 1: 단일 컴포넌트에서 사용
function TableA({ items }) {
  // 컴파일러가 자동으로 메모이제이션
  const data = expensiveCalculation(items);
  return <div>{data.map(item => <div>{item}</div>)}</div>;
}

// 케이스 2: 여러 컴포넌트에서 사용
function TableB({ items }) {
  // 동일한 items여도 다시 계산됨
  const data = expensiveCalculation(items);
  return <div>{data.map(item => <div>{item}</div>)}</div>;
}
```

위와 같은 기본 개념을 이해하고 아래와 같이 컴파일러의 한계점을 보여주는 예시코드를 보자

```jsx
// 문제가 되는 상황
const SomeContext = createContext();

function ParentComponent() {
  const items = useData(); // 데이터 fetch

  return (
    <>
      <TableA items={items} /> // 계산 1번
      <TableB items={items} /> // 동일한 items로 계산 또 실행
      <TableC items={items} /> // 또 실행...
    </>
  );
}
```

이를 해결하려면 아래와 같은 방법이 있을 수 있다.

```jsx
// 방법 1: 상위에서 메모이제이션
function ParentComponent() {
  const items = useData();
  // 부모에서 한 번만 계산
  const processedData = useMemo(() => {
    return expensiveCalculation(items);
  }, [items]);

  return (
    <>
      <TableA data={processedData} />
      <TableB data={processedData} />
      <TableC data={processedData} />
    </>
  );
}

// 방법 2: 외부 함수 자체를 메모이제이션
const memoizedExpensiveCalculation = memoize(expensiveCalculation);

function TableComponent({ items }) {
  // 이제 동일한 items에 대해서는 재사용
  const data = memoizedExpensiveCalculation(items);
  return <div>{/* ... */}</div>;
}
```

마지막으로 리액트 컴파일러가 어떤 규칙을 따를까?

1. 올바르고 의미 있는 JavaScript 코드로 작성.
1. nullable/optional 값과 속성에 접근하기 전에 그 값이 정의되어 있는지 테스트합니다. TypeScript를 사용하는 경우 strictNullChecks을 활성화하여 수행합니다. 예를 들어 if (object.nullableProperty) { object.nullableProperty.foo }와 같이 처리하거나, 옵셔널 체이닝을 사용하여 object.nullableProperty?.foo와 같이 처리.
1. [React의 규칙](https://ko.react.dev/reference/rules)을 따름.
