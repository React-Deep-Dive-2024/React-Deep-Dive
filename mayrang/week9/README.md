![](https://velog.velcdn.com/images/mayrang/post/84db1629-f536-406c-bca1-3c128f81f59d/image.png)

```jsx
<div style={{ padding: 50 }}>
  <img
    style={{ width: 600, height: 400, objectFit: "cover" }}
    src={"/penguin.jpg"}
  ></img>
</div>
```

이런 이미지를 띄운다고 했을 때 위와 같이 코드를 짰을 때 네트워크 탭을 보자
![](https://velog.velcdn.com/images/mayrang/post/6b8be947-d11b-4e26-93ad-48b34805b343/image.png)

이미지 크기가 3.0mb로 상당히 파일 크기가 큰 것을 볼 수 있다. 이렇게 이미지 사이즈가 크면 다운로드에 시간이 많이 걸리게 되고, 사이트 최적화의 악영향을 미치게 된다.
이럴 때 사용하는 기법이 이미지 사이즈 최적화이다.

이미지 사이즈 최적화는 이미지의 사이즈를 줄여 용량을 줄이고 그만큼 더 빠르게 다운로드하는 기법이다.

![](https://velog.velcdn.com/images/mayrang/post/0ab19df1-abaf-47a8-845a-366add630822/image.png)

위에서 사용했던 펭귄 이미지는 사이즈를 봤을 때 크기가 6048 x 4032로 매우 큰 것을 확인할 수 있다.
이 이미지의 사이즈를 작게 줄이고 이미지를 압축하는 방식으로 파일 크기를 줄여보자

이미지 사이즈를 최적화하기 전에 이미지 포멧을 먼저 알아보자

#### 이미지 포멧

가장 대중적으로 사용하는 이미지 포멧은 크게 세가지가 있다.

- jpg(jpeg)
- png
- webp

JPEG(Joint Photographic Experts Group) 파일은 디지털 사진을 저장하는 가장 일반적인 형식이다. JPEG는 압축을 통해 이미지 파일 크기를 줄여서 저장하고, 웹 페이지에 쉽게 업로드할 수 있게 한다. 다만 JPEG는 손실 압축 방식을 사용하므로 파일이 압축될 때 이미지의 일부 데이터가 영구적으로 삭제된다. 파일을 편집하고 저장할 때마다 더 많은 데이터가 손실되기 때문에 시간이 지나면 파일의 품질이 더욱 저하된다.

PNG(Portable Network Graphics) 파일은 무손실 압축 방식을 사용하므로 이미지가 압축될 때 손실되는 데이터가 없다. 하지만 JPEG보다 저장 공간을 더 많이 차지하기 때문에 고품질 사진보다는 웹 그래픽, 로고, 차트, 일러스트레이션에 사용되는 경우가 많다. JPEG와 달리 투명한 배경이 있는 그래픽을 처리할 수 있다는 장점이 있다.

WebP은 인터넷에서 이미지가 로딩되는 시간을 단축하기 위해 Google이 출시한 파일 포맷이다. WebP를 사용하면 웹 사이트에서 고품질 이미지를 표현할 수 있지만 PNG, JPEG 등 기존 포맷보다 파일 크기가 작아진다. 하지만 WebP 파일을 저장할 때 압축 방식(무손실 압축, 손실 압축)을 선택할 수 있으므로 데이터 손실 없이 또는 중요한 정보를 손실하지 않고 이미지를 압축할 수 있다. Google은 무손실 WebP 이미지가 PNG보다 최대 26%까지 줄어들 수 있다고 강조한다.
다만 요즘은 거의 대부분 지원하기는 하지만 구형 브라우저 일부에서는 지원을 안하는 문제가 있다.
![](https://velog.velcdn.com/images/mayrang/post/3cf2ec85-6564-467a-8842-99476ff17bec/image.png)

이미지 포멧을 정리하자면 아래와 같다.

- 사이즈: PNG > JPEG > WepP
- 화질: PNG = WebP > JPEB
- 호환성: PNG = JPG > WebP

이미지 포멧을 위와 같이 알아봤으니 기존 펭귄 이미지를 최적화 시켜보자
이미지 최적화를 위해 사용할 사이트는 [squoosh](https://www.squoosh.app)이다.
squoosh는 구글에서 만든 이미지 컨버터 웹으로 별도의 프로그램 설치 없이 웹에서 이미지를 손쉽게 여러 포멧으로 변환할 수 있다는 장점이 있다.

![](https://velog.velcdn.com/images/mayrang/post/84bf874a-9533-48dc-b959-e3a9d948b354/image.png)
사이트에 처음 진입하면 위와 같은 화면이 있는데 우리가 변환할 이미지를 넣어주자.

![](https://velog.velcdn.com/images/mayrang/post/160c7436-7645-4c73-abf3-bb1d1fb4534f/image.png)
이미지를 넣으면 위와 같은 화면이 보이는데 왼쪽은 원본 오른쪽은 변환될 이미지로 이미지 품질을 비교해볼 수 있다.

![](https://velog.velcdn.com/images/mayrang/post/08213fbe-34ef-424f-908f-7fe794e7a911/image.png)
오른쪽 하단에는 이미지를 어떤 식으로 변환할지 설정할 수 있는 도구가 있는데 우리는 webp로 하고 퀄리티는 75, 사이즈는 600 x 400의 두배인 1200 x 800으로 설정하겠다.(고해상도 디스플레이 대응)

![](https://velog.velcdn.com/images/mayrang/post/806ddcea-9320-4c24-9beb-730ae39b6773/image.png)
설정을 완료하면 우리가 변환한 이미지가 기존 이미지에 비해 얼마나 용량이 줄어드는지 확인할 수 있다.
![](https://velog.velcdn.com/images/mayrang/post/83a73062-ddd7-413e-a4ef-e8f50ef46e22/image.png)
또한 설정한 후 이미지를 비교해보면 약간의 화질 저하가 있었지만 압축 용량에 비해 크게 차이가 나지 않는 것을 확인할 수 있다.

이미지를 저장해서 아래와 같이 코드를 짜고 네트워크 탭을 확인해보자

```jsx
<div style={{ padding: 50 }}>
  <img
    style={{ width: 600, height: 400, objectFit: "cover" }}
    src={"/penguin.webp"}
  ></img>
</div>
```

![](https://velog.velcdn.com/images/mayrang/post/810e6eec-46b3-4854-9c4b-a6857e9cff05/image.png)

기존에 비해 파일 크기가 엄청나게 줄은 것을 확인할 수 있다.

다만 한 가지 문제가 있다. webp는 IE와 같은 일부 구형 브라우저에서 호환성 문제가 있다고 했다. 이를 해결하기 위해서는 picture 태그를 사용할 수 있다.
picture 태그는 다양한 타입의 이미지를 렌더링하는 컨테이너로 브라우저에 따라 지원되는 타입의 이미지를 찾아 렌더링하는 역할도 한다. 그렇기 때문에 기존 펭귄 이미지를 리사이즈를 해서 저장하고 아래와 같이 코드를 작성한다.

```jsx
<picture>
  <source srcSet="/penguin.webp" type="image/webp" />
  <img
    style={{ width: 600, height: 400, objectFit: "cover" }}
    src={"/penguin.jpg"}
  />
</picture>
```

![](https://velog.velcdn.com/images/mayrang/post/963e63a6-d1c3-4d57-a225-f129d957fa5f/image.png)
chrome 브라우저는 webp를 지원하기 때문에 webp 이미지만 로드한 것을 확인할 수 있다.

참고: 유동균. 웹 개발 스킬을 한 단계 높여 주는 프론트엔드 성능 최적화 가이드. 인사이트, 2022.
