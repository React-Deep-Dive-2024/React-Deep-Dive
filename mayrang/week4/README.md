View Transition API를 이해하기 위해서는 웹 애니메이션의 역사와 발전 과정을 살펴볼 필요가 있다.
웹 애니메이션의 역사
과거에 웹에서 애니메이션을 구현하는 것은 매우 복잡한 작업. 개발자들은 주로 JavaScript와 CSS를 사용하여 화면 전환 효과나 UI 애니메이션을 만들었지만, 이는 성능과 호환성 측면에서 많은 문제가 있었다.
이러한 어려움을 해결하기 위해 웹 표준화 기구인 W3C에서는 CSS Animations, Transitions, Transforms 등의 기술을 도입하여 웹 애니메이션을 보다 쉽게 구현할 수 있도록 했다. 이를 통해 개발자들은 선언적인 방식으로 애니메이션을 정의할 수 있게 됨.
하지만 여전히 페이지 간 전환 애니메이션을 구현하는 것은 쉽지 않았다. 개발자들은 복잡한 JavaScript 로직과 DOM 조작을 통해 페이지 전환 효과를 구현해야 했다.

#### 핵심 철학

성능 최적화: 브라우저 렌더링 엔진 내부에서 전환 애니메이션을 처리함으로써 GPU 가속을 활용하고 성능 오버헤드를 최소화.
개발자 경험 향상: 복잡한 JavaScript 로직과 DOM 조작 없이도 선언적인 방식으로 페이지 전환 애니메이션을 구현
크로스 브라우저 일관성: 표준화된 API를 제공함으로써 개발자가 일관된 경험을 제공

#### 사용 방법

![](https://velog.velcdn.com/images/mayrang/post/e1754d4b-27cb-4f62-90e5-a36112733568/image.png)

startViewTransition 메서드는 브라우저가 페이지 또는 요소의 현재 상태를 캡처하고, DOM 상태를 업데이트하며, 애니메이션을 적용하는 전환 과정을 시작할 때 작동한다.

구체적으로 설명하면
사용자가 startViewTransition을 호출하면, 브라우저는 현재 DOM 상태를 스냅샷으로 캡처 -> 이 시점에서 화면의 현재 상태가 고정되며, 이후 DOM 업데이트가 사용자에게 바로 반영되지 않고 브라우저 내부에서만 처리

startViewTransition 내부 콜백의 실행 시점
startViewTransition에 전달된 콜백 함수는 브라우저가 현재 상태를 캡처한 후 실행된다.

현재 상태를 스냅샷으로 저장한 직후에 콜백이 호출 ->
이 시점에 콜백 함수 내부에서 DOM 조작 또는 업데이트를 수행 ->
브라우저는 캡처된 현재 상태와 DOM 업데이트 결과(새로운 상태)를 비교하여, 애니메이션을 위한 가상 레이어를 생성 ->
콜백 내부 작업 완료 후 브라우저는 두 상태 간 전환 애니메이션을 렌더링

css 부분

![](https://velog.velcdn.com/images/mayrang/post/d9bc614a-f1f0-410e-b96b-16080a430321/image.png)
**::view-transition-old(root)
::view-transition-new(root)**
View Transition API에서 브라우저가 화면 전환에 사용하기 위해 생성하는 가상 요소 두 요소는 이전 상태(old)와 새로운 상태(new)의 화면을 나타낸다.

위 요소는 브라우저가 View Transition API를 통해 화면 전환 애니메이션을 실행할 때 자동으로 생성된다. 이 가상 요소는 이전 상태와 새로운 상태를 각각 캡처하여 전환 애니메이션에 사용된다.

**(root)란?**

root는 가상 요소가 캡처된 루트 컨테이너 요소를 가리킨다. 예를 들어, document.startViewTransition()을 호출하면 화면 전체가 루트가 된다.

**전체 동작 흐름**

1. startViewTransition 호출
2. 브라우저는 현재 DOM 상태를 ::view-transition-old로 캡처.
3. DOM 변경 후 새로운 상태를 ::view-transition-new로 캡처.
4. 캡처된 ::view-transition-old와 ::view-transition-new를 사용해 애니메이션 실행.
5. 이전 상태(slide-to-left) → 새로운 상태(slide-from-right)로 화면 전환.

![](https://velog.velcdn.com/images/mayrang/post/054652c1-c294-485d-9781-9618a2df29d0/image.png)
![](https://velog.velcdn.com/images/mayrang/post/21f2a640-2e9f-4970-9828-1e4c9e0828b9/image.png)

> 최신 react-router 에서 view transition api 관련 유틸 기능을 제공
> ![](https://velog.velcdn.com/images/mayrang/post/8600e3d1-60b0-4799-a148-05b06f8217e4/image.png)

#### 주의 사항

![](https://velog.velcdn.com/images/mayrang/post/38dab354-acfb-402b-8204-a7876f6d6720/image.png)
