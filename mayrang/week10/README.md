1. 시맨틱 HTML 사용
   시맨틱 HTML을 사용하면 웹 페이지의 구조가 명확해지고, 보조 기술(스크린 리더 등)이 콘텐츠의 의미를 쉽게 파악 가능하다.

```html
<header>
  <h1>웹사이트 제목</h1>
  <nav>
    <ul>
      <li><a href="#home">홈</a></li>
      <li><a href="#about">소개</a></li>
      <li><a href="#contact">연락처</a></li>
    </ul>
  </nav>
</header>

<main>
  <section>
    <h2>소개</h2>
    <p>소개 섹션입니다.</p>
  </section>
  <section>
    <h2>서비스</h2>
    <p>나나나난</p>
  </section>
</main>

<footer>
  <p>&copy; 2025 이름</p>
</footer>
```

시맨틱 HTML은 페이지의 구조와 의미를 명확하게 전달한다. 예를 들어서, header는 페이지 상단의 내비게이션을 포함하며, main은 페이지의 주요 콘텐츠를 포함한다. 이와 같은 태그는 스크린 리더가 페이지의 구조를 이해하고 사용자에게 더 나은 경험을 제공한다.

2. 대체 텍스트 제공
   이미지에는 대체 텍스트(alt)를 제공해야 시각적으로 이미지를 볼 수 없는 사용자들이 콘텐츠를 이해할 수 있다. 또한, 이미지가 장식적인 용도일 경우에는 alt=""로 빈 텍스트를 제공하여 스크린 리더가 해당 이미지를 무시하게 할 수도 있다.

```html
<img src="logo.png" alt="웹사이트 로고" />
```

alt 속성은 이미지를 설명하는 텍스트로, 화면을 볼 수 없는 사용자에게 이미지를 이해할 수 있는 기회를 제공한다. 예를 들어, 로고 이미지를 사용할 때는 "웹사이트 로고"와 같은 설명을 alt 속성에 추가한다. 장식적인 이미지의 경우 alt=""로 비워두면 스크린 리더가 이미지를 무시한다.

3. 폼 요소와 라벨
   폼 필드에는 항상 label 태그를 사용하여 필드에 대한 명확한 설명을 제공해야 한다. 라벨은 for 속성으로 특정 입력 요소와 연결되며, 사용자가 해당 폼 필드의 목적을 쉽게 알 수 있게 도와준다.

```html
<form>
  <label for="username">사용자 이름:</label>
  <input type="text" id="username" name="username" aria-required="true" />

  <label for="password">비밀번호:</label>
  <input type="password" id="password" name="password" aria-required="true" />

  <button type="submit">로그인</button>
</form>
```

label 요소는 입력 필드와 연결되어 있어, 스크린 리더가 해당 필드의 목적을 사용자에게 설명한다. 또한, aria-required="true" 속성은 필드가 필수 항목임을 명확히 알리는 데 사용된다. label의 for 속성과 input의 id 속성이 일치해야 한다.

4. 키보드 내비게이션
   웹 페이지는 키보드만으로도 충분히 탐색할 수 있어야 한다. tabindex 속성은 요소의 탭 순서를 제어하고, 키보드 탐색을 통해 사용자 경험을 향상시킨다.

```html
<button tabindex="1">버튼 1</button>
<button tabindex="2">버튼 2</button>
<button tabindex="3">버튼 3</button>
```

tabindex 속성을 사용하면, 사용자가 Tab 키로 웹 페이지를 탐색할 때 순서를 제어할 수 있다. tabindex="1"부터 시작해 원하는 순서대로 설정할 수 있다. 이는 특히 대화형 요소들(버튼, 링크 등)에 유용

5. ARIA 속성 활용
   ARIA(Accessible Rich Internet Applications)는 복잡한 UI 요소들에 대해 보조 기술이 이해할 수 있도록 추가적인 정보를 제공한다. 특히 동적 콘텐츠와 상호작용하는 요소에는 aria-\* 속성이 필수적

```html
<button aria-label="닫기">X</button>
```

aria-label 속성은 버튼에 표시된 텍스트 없이 기능을 설명하는 데 사용된다다. 예를 들어, X 아이콘만 있는 버튼에는 aria-label="닫기"를 추가하여 스크린 리더 사용자가 이를 이해할 수 있도록 도와준다.

6. 실시간 콘텐츠 알림 (aria-live)
   aria-live 속성은 실시간으로 변경되는 콘텐츠를 사용자에게 알리는 데 사용된다. 예를 들어, 새 메시지가 도착했을 때 스크린 리더 사용자에게 이를 알려줄 수 있다.

```html
<div aria-live="polite">
  <p>새로운 알림이 도착했습니다!</p>
</div>
```

aria-live="polite"는 콘텐츠가 변경될 때, 사용자에게 큰 방해 없이 알림을 제공한다. assertive로 설정하면 중요한 알림을 즉시 사용자에게 알리게 되는데, 이 속성은 실시간 알림, 채팅 시스템, 상태 변경 등을 처리하는 데 유용하다.

7. 동적 콘텐츠 (모달 창)
   모달 창이나 드롭다운 메뉴와 같은 동적 요소는 보조 기술이 이를 처리할 수 있도록 포커스를 잘 관리해야 한다. 포커스가 모달 창 내부로만 제한되도록 해야 한다.

```html
<button id="openModal" onclick="openModal()">모달 열기</button>

<div id="modal" role="dialog" aria-labelledby="modalTitle" tabindex="-1">
  <h2 id="modalTitle">모달 제목</h2>
  <p>모달 내용이 여기에 들어갑니다.</p>
  <button onclick="closeModal()">닫기</button>
</div>

<script>
  function openModal() {
    document.getElementById("modal").style.display = "block";
    document.getElementById("modal").focus();
  }

  function closeModal() {
    document.getElementById("modal").style.display = "none";
  }
</script>
```

role="dialog"를 사용하여 이 요소가 대화형 요소임을 명시하고, aria-labelledby로 모달의 제목을 정의하는데, 모달을 열 때 tabindex="-1"을 사용하여 스크린 리더가 포커스를 맞추도록 하며, 포커스가 모달 창 내부에만 남도록 관리해야 한다.

8. 자막 및 오디오 설명
   비디오 콘텐츠에 자막이나 오디오 설명을 추가하는 것은 접근성 향상에 큰 도움이 된다. 오디오 설명은 시각적으로 콘텐츠를 볼 수 없는 사용자를 위해 화면에서 일어나는 중요한 시각적 요소를 설명한다.

```html
<video controls>
  <source src="movie.mp4" type="video/mp4" />
  <track kind="subtitles" srclang="en" label="English" src="subtitles_en.vtt" />
  <track
    kind="descriptions"
    srclang="en"
    label="Audio Descriptions"
    src="audio_descriptions_en.vtt"
  />
</video>
```

track 태그를 사용하여 비디오에 자막(subtitles)과 오디오 설명(descriptions)을 추가한다.
