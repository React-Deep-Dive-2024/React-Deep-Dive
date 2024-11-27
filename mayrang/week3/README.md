먼저 한가지 전제를 깔고 가자면 제어 컴포넌트 vs 비제어 컴포넌트를 useState vs useRef를 생각하는 경우가 있는데 이 두개가 일치하는 개념은 아니다.
useState를 사용해서 비제어 컴포넌트를 아래와 같이 구현할 수도 있다.

```jsx
import { useState } from "react";

function Form() {
  const [input, setInput] = useState(null);
  const [select, setSelect] = useState(null);
  const [textArea, setTextArea] = useState(null);
  const [radio0, setRadio0] = useState(null);
  const [radio1, setRadio1] = useState(null);
  const [radio2, setRadio2] = useState(null);
  const [checkbox, setCheckbox] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(
      JSON.stringify({
        input: input?.value,
        select: select?.value,
        radio: [radio0, radio1, radio2].find((radio) => radio?.checked)?.value,
        textArea: textArea?.value,
        checkbox: checkbox?.checked,
      })
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        제목
        <input
          name="title"
          defaultValue=""
          ref={(element) => setInput(element)}
        />
      </label>

      <label>
        국가
        <select
          name="country"
          defaultValue="한국"
          ref={(element) => setSelect(element)}
        >
          <option>한국</option>
          <option>미국</option>
          <option>중국</option>
          <option>영국</option>
          <option>태국</option>
        </select>
      </label>

      <label>
        내용
        <textarea
          name="description"
          defaultValue="안녕하세요?"
          ref={(element) => setTextArea(element)}
        />
      </label>

      <fieldset>
        <legend>크기</legend>
        <label>
          <input
            type="radio"
            name="size"
            value="소"
            ref={(element) => setRadio0(element)}
          />
          소
        </label>
        <label>
          <input
            type="radio"
            name="size"
            value="중"
            defaultChecked
            ref={(element) => setRadio1(element)}
          />
          중
        </label>
        <label>
          <input
            type="radio"
            name="size"
            value="대"
            ref={(element) => setRadio2(element)}
          />
          대
        </label>
      </fieldset>

      <label>
        <input
          type="checkbox"
          name="terms"
          ref={(element) => setCheckbox(element)}
        />
        약관에 동의합니다.
      </label>

      <button type="submit">제출</button>
    </form>
  );
}
// 출처 https://www.daleseo.com/react-uncontrolled-components/
```

이런 식으로 사용을 할 수도 있고, 그냥 hook을 사용하지 않고 DOM api를 사용하여 비제어 컴포넌트를 만드는 경우도 있겠지만 보통 이렇게 사용하는 경우는 없고 보통은 useRef를 사용해서 비제어 컴포넌트를 만든다.

전제에 대해서는 여기까지 하고 본론으로 들어가자.
우선 제어 컴포넌트와 비제어 컴포넌트의 정의가 무엇일까?

웹에서 양식 UI를 구현할 때 input, select, textarea와 같은 HTML 요소를 사용하게 된다. 이러한 요소들은 value나 checked와 같은 내부 상태를 가지는데 기본적으로는 브라우저의 DOM이 상태를 제어한다.

React를 사용해서 양식 관련 HTML 요소들이 포함된 컴포넌트를 작성할 때는 이 상태 제어를 React에게 맡기는 경우가 많다. 이렇게 하면 브라우저를 통해서는 어려운 좀 더 섬세한 상태 제어가 가능하고 입력값 검증이 용이해지기 때문이다.

하지만 그렇다고 해서 반드시 React를 통해서 양식 관련 HTML 요소의 상태 관리를 해야하는 것은 아니며, React 외에도 다른 외부 자바스크립트 라이브러리가 혼용되서 사용되는 프로젝트에서는 이러한 방식을 사용하기 어려운 상황이 생길 수도 있다.

React에서는 React가 직접 상태 제어를 하는 컴포넌트를 제어 컴포넌트라고 부르며, 브라우저가 상태 제어를 하도록 자연스럽게 두는 컴포넌트를 비제어 컴포넌트라고 부른다.

그럼 우리가 form을 다룰 때 어떤 방식을 쓰는게 좋을까?
이거에 대해선 리서치해봤을 때 정말 사람마다 다 다른 의견이 있는데 원론적인 이야기부터 하면 이 주제에 대해 접근하고자 한다.

먼저 form tag elements들의 값은 value attribute를 통해서 값에 접근이 가능하다

즉 value atrribute를 통해 사용자가 입력한 값을 가져올 수 잇고, 이 말은 사용자가 입력한 값이 value atrribute에 저장된다고 생각할 수도 있다. 그리고 그 value atrribute는 dom에 있기 때문에 사용자가 입력한 값은 돔에 저장된다고 생각할 수도 있다.

그럼 이걸 바탕으로 좀 더 들어가게 되면 "신뢰 가능한 단일 출처"에 대한 얘기가 나오게 된다. "신뢰 가능한 단일 출처"를 한 마디로 정의하면 아래와 같다.

> 하나의 상태는 한 곳에 있어야 한다.

form tag element 들의 value attribute는 항상 최신화된 값을 가지고 있어야 하고, 하나의 tag의 value attribute는 하나 뿐이고, 신뢰가 가능하므로 value attribute는 "신뢰 가능한 단일 출처"임을 알 수 있다.

그럼 왜 신뢰 가능한 단일 출처가 왜 중요할까?
아래 코드를 보자

```javascript
const form = document.querySelector('form');

let inputValue = '';
let textareaValue = '';
let selectValue = '';

const onsubmit = (e) => {
  e.preventDefualt();
  inputValue = e.target.elements['input-elem'].value;
  textareaValue = e.target.elements['textarea-elem'].value;
  selectValue = e.target.elements['selet-elem'].value;
 );
```

이 코드 블럭으나의 상태를 value attribute와 vaiable 이 두 가지 출처로 나눠갖게 된다.
이를 그림으로 나타내면 아래와 같다
![출처: https://www.youtube.com/watch?v=PBgQKK6nelo&t=164s](https://velog.velcdn.com/images/mayrang/post/b243ff0b-807a-495b-af48-da6e02eb82c1/image.png)
출처: https://www.youtube.com/watch?v=PBgQKK6nelo&t=164s

value atrribute는 user input에 대해 계속 최신화가 되고, 그 값을 variable이 가지고 있다.
만약 A 컴포넌트는 value attribute를 사용하고 있고, B 컴포넌트는 variable를 사용하고 있다고 가정했을 때 어떠한 이유로 value attribute와 variable 사이의 연결이 끊어지게 되면 variable를 사용하고 있는 B 컴포넌트는 더 이상 use input의 값 갱신을 받아올 수 없게 된다. 이렇듯 하나의 상태를 두 가지 출처로 나누게 되면 이러한 문제가 생길 수 있기 때문에 "신뢰 가능한 단일 출처"가 중요한 것이다.

하지만 리액트에서 매번 value attribute를 가져올 수도 없고, 리액트의 철학적인 측면에서 봐도 이러한 방식을 원하지 않기 때문에 아래 방법을 사용했다.

#### 제어 컴포넌트

```jsx
export default function App() {
  const [value, setValue] = useState("");

  return (
    <form>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
    </form>
  );
}
```

위 코드를 보면 value state를 onChage 이벤트가 발생할 때마다 setValue 해주면서 그 value state를 value attribute에 할당하면서 value attribute와 value state를 결합하고 있다.
이런 과정을 통해서 value state를 신뢰 가능한 단일 출처로 만들고 있다. 이것을 리액트에서의 제어 컴포넌트라고 하고 위와 같이 form의 사용자 입력 값을 리액트가 제어한다고 볼 수 있다.

#### 비제어 컴포넌트

```jsx
export default function App() {
  const valueRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(valueRef.current.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={valueRef} />
    </form>
  );
}
```

이 코드를 보면 valueRef를 input의 ref attribute에 직접 연결하고 있다. valueRef가 직접적으로 inputElement에 접근하게 되고, 함수형 컴포넌트의 리렌더링 조건에 따라 ref의 값이 변하더라도 리렌더링이 발생하지 않게 된다. 또한 위 과정에서 리액트가 별로 관여하는 것 없이 ref를 통해 직접적으로 form element 에 접근하는 것이기 때문에 단일 출처를 가지게 된다.

제어 컴포넌트와 비제어 컴포넌트를 비교하면 아래와 같다.

- 데이터 관리 주체
  - 제어 컴포넌트: react
    - 비제어 컴포넌트: DOM
- 데이터 갱신 시점
  - 제어 컴포넌트: 사용자가 값을 입력할 때마다 갱신
    - 비제어 컴포넌트: 특정 시점에서 DOM에서 pull하여 갱신
- 리렌더링 여부
  - 제어 컴포넌트: 값을 입력할 때마다 발생
    - 비제어 컴포넌트: 값을 입력할 때는 발생X

위 비교를 종합해서 결론적으로 정리하면 아래와 같다.
**제어 컴포넌트**
장점

- React의 상태를 통해 폼 데이터를 완전히 제어
- 실시간으로 입력값을 검증하고 조작할 수 있어 사용자 입력을 더 정교하게 관리 가능
- 컴포넌트의 상태와 UI를 완벽하게 동기화
- 폼 데이터의 변화를 즉각적으로 추적하고 처리

단점

- 모든 상태 변화에 대해 이벤트 핸들러를 작성해야 하므로 코드가 약간 더 길어질 수 있음.
- 간단한 폼의 경우 불필요하게 복잡해 보임
- 상태 관리로 인한 추가적인 메모리 사용이 발생하고 리렌더링이 더 많이 발생

아래 상황에서 사용하면 좋음

- 실시간 폼 검증이 필요한 경우
- 복잡한 폼 로직을 구현해야 할 때
- 즉각적인 사용자 입력 피드백이 중요한 경우
- 동적으로 입력값을 조작해야 하는 경우

**비제어 컴포넌트**
장점

- 코드가 더 간결하고 작성하기 쉬움
- DOM에 직접 접근하여 값을 처리하므로 추가적인 상태 관리가 필요 없음
- 성능상 약간의 이점이 있을 수 있음

단점

- 폼 데이터의 실시간 검증이 어려움
- 동적인 입력 처리나 복잡한 폼 로직 구현이 제한적
- React의 단방향 데이터 흐름 철학과 선언형 프로그래밍 철학에서 벗어남
- 폼 상태를 완전히 제어하기 어려움

아래 상황에서 사용하면 좋음

- 간단한 폼 구현
- 빠르게 프로토타이핑을 해야 하는 경우
- 외부 라이브러리와 통합할 때
- 성능이 매우 중요하고 복잡한 검증이 필요 없는 경우

참고 문헌
https://www.daleseo.com/react-uncontrolled-components/
https://www.youtube.com/watch?v=PBgQKK6nelo&t=164s
