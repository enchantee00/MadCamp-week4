## Today’s Mood

---

<img src="https://github.com/user-attachments/assets/73d8a5bd-52df-431d-b153-8727fda43f94" width="30%">

> 똑똑한 일기장 Today’s Mood입니다!
> 
- 작성한 일기를 바탕으로 자신의 감정상태를 확인하세요!
- 월별로 제공되는 감정 통계를 확인해보세요!
- 챗봇과 대화하며 일기를 써보세요!

<br>
<br>


### Team

---

|      정인호       |          정지윤         |                                                                                                       
| :------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------: |
|   <img width="100px" src="https://github.com/user-attachments/assets/f3e52481-5ff4-4e0d-9c2d-c8abf02a9597" />    |                      <img width="100px" src="https://github.com/enchantee00/MadCamp-week1/assets/62553866/67b24f11-2c48-4704-ac34-6c3be41c9982" />    |
|   [@inho9899](https://github.com/inho9899)   |    [@enchantee00](https://github.com/enchantee00)  |
| 카이스트 전산학부 4학년 | 부산대학교 정보컴퓨터공학부 3학년 |


<br>
<br>


### Tech Stack

---

**Frontend :** React

**Backend** : Flask

**AI :** Python

- **Model**: KoBERT, KoBART
- **API**: Chat GPT

**Database :** SQLite3

**IDE :** VSCode

<br>
<br>


### Introduction

---

> **Background**
> 

---

미국의 심리학자 로버트 플루치크는 “감정의 바퀴”라는 모델을 제시해 큰 업적을 남겼습니다.

이 모델은 인간의 감정을 8가지로 나누고, 이 감정들이 결합하여 더 복잡한 감정을 형성하는 방식을 설명하는데요, 이 8가지 감정을 분류해주는 감정분석 모델을 만들고 서비스에 적용시켰습니다.


<p align="center">
  <img src="https://github.com/user-attachments/assets/37210d20-5d4c-4105-9824-2edd176c0b47" width="40%">
</p>



<br>
<br>


### Details

---

<aside>
  
🤖 **AI**

</aside>

> **Model**
> 

---

### SK T-Brain KoBERT [🔗GitHub](https://github.com/SKTBrain/KoBERT)

Google BERT 기반 범용 NLP 모델

한국어 분석 성능 개량

한국어 Wikipedia 기반 tokenizer

→ 문장 입력 후 8가지 감정 라벨에 대한 확률 값 예측

### SK T-Brain KoBART [🔗GitHub](https://github.com/SKT-AI/KoBART)

Google BART 기반 범용 NLP 모델

한국어 분석 성능 개량

한국어 Wikipedia 기반 tokenizer

→ 채팅이 종료된 후 유저의 대답을 모아서 요약

```
두 가지 사전학습 모델 중 KoBERT는 8가지 감정 데이터를 이용해 파인튜닝 하여 사용하였고,
KoBART는 사전학습 모델로도 성능이 준수해 그대로 사용하였습니다.
```

<br>

> **Dataset**
> 

---

### 감성 대화 말뭉치 데이터 [🔗AI Hub](https://aihub.or.kr/aihubdata/data/view.do?currMenu=116&topMenu=100&aihubDataSe=ty&dataSetSn=86)

```
- 1개 상황당 4개~8개 대화와 1개 감정으로 구성
- 발화자(인간)와 응답자(시스템)의 대화로 구성
- 6가지 감정(분노, 당황, 슬픔, 기쁨, 상처, 불안)으로 분휴
```

### 감정 분류를 위한 대화 음성 데이터셋 [🔗AI Hub](https://aihub.or.kr/aihubdata/data/view.do?currMenu=116&topMenu=100&aihubDataSe=ty&dataSetSn=86)

```
- 감성대화 어플리케이션을 이용한 수집
- 일정 기간동안 사용자들이 어플리케이션과 자연스럽게 대화하고, 수집된 데이터를 정제 작업을 거쳐 선별
- 7가지 감정(happiness, angry, disgust, fear, neutral, sadness, surprise)에 대해 5명이 라벨링
```

로버트 플루치크가 정의한 ‘신뢰’에 대한 감정 라벨 데이터가 없어 두 가지 데이터를 합쳐 기쁨, 슬픔, 불안, 공포, 놀람, 혐오, 중립 8가지 감정으로 학습시켰습니다.

<br>


> **Performance**
> 

---

### Parameter

```
max_len = 64
batch_size = 64
warmup_ratio = 0.1
num_epochs = 20
max_grad_norm = 1
log_interval = 200
learning_rate =  5e-5
```

<img width="610" alt="%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-07-25_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_5 09 48" src="https://github.com/user-attachments/assets/72ba2aee-0b4e-4105-9966-f9dee245fcce">


8가지 감정 라벨에 대해 파인튜닝한 KoBERT의 분류 성능입니다.

> **Colorize**
> 

---

분류한 8가지 감정에 대해 색채화를 적용시켜 일기장에 나타냈습니다.

<img src="https://github.com/user-attachments/assets/8523fb2f-700e-405e-9338-518070e58e95" width="23%">
다음과 같이 감정을 각각 해당 색깔로 나타냈고, 
작성한 글의 감정에 대한 확률 값을 토대로 색깔을 섞어 나타냈습니다.

Softmax layer를 거친 output이 나오기 때문에, 감정에 대한 확률값의 합은 1입니다. 
이를 이용해 색깔을 나타내는 rgb 값에 각각의 확률 값을 곱하여 더해주었습니다.

색깔 선정 기준은 영화 인사이드 아웃을 참고했습니다 😊

<br>
<br>


<aside>
  
🌐 **Front**

</aside>

> **Login Page**
> 

---

<img width="1552" alt="%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-07-25_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_5 17 35" src="https://github.com/user-attachments/assets/d6a428b2-f5a3-49eb-afac-4828d1313a1f">


로그인 화면입니다. 

<br>


> **Main Page**
> 

---

<img width="1552" alt="%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-07-25_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_5 20 28" src="https://github.com/user-attachments/assets/45f63004-0be1-4566-97b5-747119fccabc">



로그인 후 바로 메인 페이지로 이동됩니다.
각 날짜에 해당하는 일기를 바탕으로 혼합된 색상으로 표현됩니다.

또한 해당 달의 감정 통계를 색깔을 통해 보여줍니다.

통계 화면에 원형 화면이 돌아가는 interaction을 적용시켰습니다. 8개 감정의 element에 대해서 아래와 같은 수식을 사용했습니다.

$$
let \text{ } \psi_k = (\text{percentage of emomtion})
\\
let \text{ } f_{i} = \frac{\pi}{50}(progress - \sum_{k=1}^{i}{100\psi_k})
\\
Then, \text{ } (transparency)_i = min(max(0, f_i), 2 \pi R \psi_i)
$$


<p align="center">
  <img src="https://github.com/user-attachments/assets/1cef286a-cfda-447b-8e8a-5575ae3f3570" width="30%">
</p>

<br>


> **Read Diary**
> 

---

![KakaoTalk_Photo_2024-07-25-20-13-34](https://github.com/user-attachments/assets/e44173ae-34fa-45f8-a3cd-38181380c321)


작성한 일기를 볼 수 있는 페이지입니다. 

각 날짜에서 가장 우세한 감정을 나타냈고, 웹을 로드할 때마다 애니매이션을 넣어 재미를 주었습니다.

또한 일기를 챗봇으로 쓴 경우, 문장 요약 모델(KoBART)을 사용하여 요약한 일기를 preview에 보여줍니다.

![KakaoTalk_Photo_2024-07-25-20-13-54](https://github.com/user-attachments/assets/a4ea192c-a19d-4d0a-a788-af114c0c8495)



해당 일기를 클릭하면 본인이 쓴 일기 내역을 확인할 수 있고, 이를 삭제하거나 수정할 수 있게 했습니다.

<br>

> **Write Diary**
> 

---

![KakaoTalk_Photo_2024-07-25-20-13-40](https://github.com/user-attachments/assets/6029757d-98c5-4cf2-a119-3adf442860ea)


![KakaoTalk_Photo_2024-07-25-20-13-44](https://github.com/user-attachments/assets/de334a6c-a5f2-41e0-892a-e73d5644f5aa)

메인 화면에서 “Add” 버튼을 클릭하면 일반적인 일기를 작성할 수 있는 페이지로 넘어갑니다.

완료 버튼을 누르면 일기에 대한 감정분석을 하고 이를 색깔로 표현해 DB에 저장하게 됩니다.

<br>

> **Chat with Diary**
> 

---

![KakaoTalk_Photo_2024-07-25-20-13-47](https://github.com/user-attachments/assets/26c6a93d-5d84-4ca2-aacc-0a049584b64a)



또한 커스텀 챗봇과 대화를 나누며 일기를 작성할 수도 있습니다.

챗봇은 작성자의 감정에 집중하며 어떤 상황인 물어보도록 설정 돼 있으며, 사용자는 Chat GPT API를 사용하여 대화를 나눌 수 있습니다.

![KakaoTalk_Photo_2024-07-25-20-13-51](https://github.com/user-attachments/assets/813ebf24-60e5-4190-a1cc-ac34f54f92c0)



대화가 종료되면 챗봇과 대화를 나눈 내역 중 사용자가 답한 문장만 모아서 어떤 감정의 분포도를 보여줍니다.

해당 정보와 색채 정보는 DB에 저장돼 일기 목록에 반영됩니다.

<br>
<br>


<aside>
  
💽 **Server**

</aside>

<br>

> **Database Diagram**
> 

---

![Untitled-7](https://github.com/user-attachments/assets/55d7a419-1fc5-45dd-a8e8-f85d8eda148b)


DB는 총 2개의 테이블로 이루어져 있습니다. 유저 정보를 관리하기 위한 “user” 테이블, 일기 정보를 관리하기 위한 “diary” 테이블입니다.

<br>

<br>

> **API**
> 

---

<img width="296" alt="%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2024-07-25_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_5 32 48" src="https://github.com/user-attachments/assets/703ba8f7-6b0d-4c55-961a-4d346a0caf5c">


서비스에 사용한 API입니다.

**Diary**: 일반적인 일기를 작성할 때의 일기 CRUD 기능을 구현했습니다.

**Chat**: 일기 쓰기에 적합하게 커스텀 챗봇을 사용하여 대화하는 API를 구현했습니다.

일기를 작성하고 챗봇과 대화를 종료하면 감정분석을 해, 어떤 감정에 가까운 글인지 분석해줍니다.
