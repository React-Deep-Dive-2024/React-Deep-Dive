## 클로저의 정의

“함수와 함수가 선언된 어휘적 환경”

```jsx
function add() {
  const a = 10;
  function innerAdd() {
    const b = 20;
    console.log(a + b);
  }
}
```

a 변수의 유효 범위는 add 전체이고, b의 유효 범위는 innerAdd의 전체 innerAdd는 add 내부에서 선언돼 있어 a를 사용 가능하다.

“선언된 어휘적 환경”이라는 것은, 변수가 코드 내부에서 어디서 선언됐는지를 말하는 것이다.

호출되는 방식에 따라 동적으로 결정되는 this와는 다르게 코드가 작성된 순간에 정적으로 결정한다.

## 2. 변수의 유효 범위, 스코프

변수의 유효 범위

### 전역 스코프

전역 레벨에 선언하는 것을 전역 스코프

이 스코프에서 변수를 선언하면 어디서든 호출 가능

브라우저 환경에서 전역 객체는 window, Node.js 환경에서는 global

```jsx
var global = "global scope";
function hello() {
  console.log(global);
}
console.log(global); // global scope
hello(); // global scope
console.log(global === window.global);
```

### 함수 스코프

자바스크립트는 기본적으로 함수 레벨 스코프를 따름

즉, {} 블록이 스코프 범위를 결정하지 않는다.

```jsx
if (true) {
	var global = 'global scope'
{
console.log(global) // 'global scope'
console.log(global === window.global) // true
```

var global은 {} 내부에서 선언돼 있는데, {} 밖에서도 접근이 가능

기본적으로 자바스크립트는 함수 레벨 스코프를 가지고 있기 때문

```jsx
function hello() {
  var local = "local variable";
  console.log(local); // local variable
}
hello();
console.log(local); // Uncaught referenceError: local is not defined
```

단순한 if 블록과 다르게 함수 블록 내부에서는 스코프가 예상과 같이 결정된다.

```jsx
var x = 10;

function foo() {
  var x = 100;
  console.log(x); // 100
  function bar() {
    var x = 1000;
    console.log(x); // 1000
  }
  bar();
}

console.log(x); // 10
foo();
```

자스에서는 가장 가까운 스코프에서 변수가 존재하는지를 먼저 확인한다.

## 3. 클로저의 활용

```jsx
function outerFunction() {
  var x = "hello";
  function innerFunction() {
    console.log(x);
  }
  return innerFunction;
}

const innerFunction = outerFunction();
innerFunction(); // "hello"
```

위 예제에서 outerFunction은 innerFunction을 반환하며 실행이 종료 됐지만 반환된 함수에는 x라는 변수가 존재하지 않지만, 해당 함수가 선언된 어취적 환경, 즉 outerFunction에는 x라는 변수가 존재하면 접근할 수도 있다.

### 클로저의 활용

```jsx
function Couter() {
	var counter = 0

	return {
		increase: function () {
			return +=counter
		},
		decrease: function () {
			return --counter
		},
		counter: function () {
			console.log('counter에 접근!)
			return counter
		},
	}
}

var c = Counter()
console.log(c.increase()) // 1
console.log(c.decrease()) // 2
console.log(c.increase()) // 3
console.log(c.decrease()) // 2
console.log(c.counter()) // 2
```

위 예제에 보다시피 counter 변수를 직접적으로 노출하지 않음으로써 사용자가 직접 수정하는 것을 막았고, 접근하는 경우를 제한해 로그를 남기는 등의 부차적인 작업도 수행 가능하다. 또한 counter 변수의 업데이트를 increase와 decrease로 제한해 무분별하게 변경되는것을 막는다.

클로저를 활용하면 전역 스코프의 사용을 막고, 개발자가 원하는 정보만 개발자가 원하는 방향으로 노출시킬 수 있다.

### 리액트에서의 클로저

useState가 대표적이다.

```jsx
function Component() {
  const [state, setState] = useState();
  function handleClick() {
    // useState 호출은 위에서 끝났지만,
    // setState는 계속 내부의 최신값(prev)을 알고 있다.
    // 이는 클로저를 활용했기 때문에 가능
    setState((prev) => prev + 1);
  }
  // ...
}
```

useState 호출은 첫 줄에서 종료됐는데, setState는 useState 내부의 최신 값을 계속해서 확인 가능 → 외부 함수(useState)가 반환한 내부 함수(setState)는 외부 함수(useState)의 호출이 끝났음에도 자신이 선언된 외부 함수가 선언된 환경(state가 저장돼 있는 어딘가)을 기억하기 때문

보통 클로저는 렌더링할 때마다 재생성되고 이전 클로저는 가비지 컬렉션되어 메모리 관련 문제가 크게 발생하지 않는다.

### 사용 시 주의 사항

클로저를 사용하는 데는 비용이 든다.

클로저가 선언된 순간 내부 함수는 외부 함수의 선언적인 환경을 기억하고 있어야 하므로 이를 어디에서 사용하는지 여부에 관계 없이 저장해 둠. 반면 일반 함수의 경우에는 작업이 모두 스코프 내부에서 끝났기 때문에 메모리 용량에 영향을 미치지 않는다.

즉 외부 함수를 기억하고 이를 내부 함수에서 가져다 쓰는 메커니즘은 성능에 영향을 미친다.

### useCallback과 클로저

아래와 같은 코드가 있다고 가정해보자

```jsx
function App() {
  const [count, setCount] = useState(0);
  const bigData = createBigData(); // 큰 데이터 생성

  // 클로저 1: count를 사용하는 함수
  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  // 클로저 2: bigData를 사용하는 함수
  const handleButtonClick = () => {
    console.log(bigData);
  };

  return (...)
}
```

위 코드는 아래와 같은 상황이 발생한다.

- 자바스크립트의 클로저는 마치 '사진을 찍는 것'과 비슷
- handleClick 함수가 생성될 때, 그 함수는 현재 환경의 '스냅샷'을 찍음
- 이 '스냅샷'에는 해당 시점의 모든 변수들이 포함. 이건 count가 변경되어 handleClick() 함수가 다시 생성될 때까지 유지.

```jsx
function App() {
  // 이 시점의 환경:
  // - count = 0
  // - bigData = 10MB의 데이터

  const handleClick = useCallback(() => {
    // 이 함수는 생성될 때의 환경을 '스냅샷'으로 저장
    // count와 bigData 모두 접근 가능한 상태로 저장됨
    setCount(count + 1);
  }, [count]);
}
```

이 코드의 메모리 상황을 코드로 간략하게 시각화하면 아래와 같다.

```javascript
// 메모리 상황
{
  환경스냅샷: {
    count: 0,
    bigData: [10MB 데이터], // 실제로 사용하지 않아도 메모리에 유지됨
    기타변수들: ...
  }
}
```

### 클로저 체이닝

위 상황을 이해하고 아래와 같은 코드가 있다고 가정해보자

```jsx
function App() {
  const [countA, setCountA] = useState(0);
  const [countB, setCountB] = useState(0);
  const bigData = createBigData(); // 10MB 크기의 데이터

  // 초기에 생성되는 함수들
  const handleClickA = useCallback(() => {
    setCountA(countA + 1);
  }, [countA]);

  const handleClickB = useCallback(() => {
    setCountB(countB + 1);
  }, [countB]);

  const handleClickBoth = () => {
    console.log(bigData);
    handleClickA();
    handleClickB();
  };
}
```

![](https://velog.velcdn.com/images/mayrang/post/dec385ff-dbf1-4d8b-ae9c-5b6933de9f00/image.png)

이 상황에서 초기 버전에서는 하나의 스코프(AppScope-0)만 존재한다.
모든 상태값은 0이고 handleClickA와 handleClickB는 각각의 초기 버전이 생성된다.

이런 상황에서 countA의 값이 변경되면 어떻게 될까?

- 그렇게 되면 countA의 값은 변경되어서 새로운 스코프(AppScope-1) 생성하고,
- handleClickA는 새로운 버전(handleClickA-1)으로 재생성하고,
- handleClickB는 여전히 이전 버전(handleClickB-0) 유지한다.
- 재생성된 handleClickBoth는 handleClickA-1, handleClickB-0

이럴 경우 handleClickB-0는 여전히 이전 스코프(AppScope-0)를 참조하게 되는 문제점이 발생하고 이를 시각화하면 아래와 같다.
![](https://velog.velcdn.com/images/mayrang/post/252ad332-c17e-4594-a978-0801047c2ec5/image.png)

이 상태에서 countB의 값이 또 변경되었다고 가정해보자.

- 그렇게 되면 countB의 값은 변경되어서 새로운 스코프(AppScope-2) 생성하고,
- handleClickB는 새로운 버전(handleClickB-1)으로 재생성한다.
- 하지만 handleClickA-1은 AppScope-1을 참조하고,
- handleClickB-1은 AppScope-2를 참조하고,
- 재생성된 handleClickBoth는 handleClickA-1, handleClickB-1
- 또 이전 AppScope-1에서 handleClickB-0는 AppScope-0을 참조하면서
  일종의 사슬처럼 이어져서 이전 스코프들이 계속 메모리에 남아있는 문제점이 발생하게 된다.
  ![](https://velog.velcdn.com/images/mayrang/post/2f88d866-b85f-487d-b482-8fc5d3c87b68/image.png)

![](https://velog.velcdn.com/images/mayrang/post/50b7ea48-9f43-4874-954a-1e58073ea0c7/image.png)

정리하면 단일 컴포넌트에 위와 같이 useCallback 함수가 여러 개 있으면 스코프와 메모리를 관리하기가 어려워지고 위와 같은 문제 겪을 가능성이 높아진다.

이를 해결하기 위해서는 아래와 같은 방법을 사용할 수 있다.

- 클로저 스코프를 가능한 작게 유지
- 메모제이션한 함수를 다른 함수에서 참조하지 않기
- 불필요한 메모이제이션 피하기
- 큰 객체에는 useRef 사용하기

참고
[React 메모리 누수 - useCallback과 클로저의 활용](https://velog.io/@woodong/React-메모리-누수-useCallback과-클로저의-활용)
