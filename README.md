# Google Form 연동 웹 애플리케이션

Google Form과 연동하여 데이터를 제출할 수 있는 모던한 웹 애플리케이션입니다. Vite를 사용하여 구축되었으며, 두 가지 주요 기능을 제공합니다.

## 📋 프로젝트 개요

이 프로젝트는 Google Form API를 활용하여 웹 애플리케이션에서 직접 폼 데이터를 제출할 수 있도록 하는 예시 애플리케이션입니다. 사용자 친화적인 UI와 함께 두 가지 주요 페이지를 제공합니다.

## ✨ 주요 기능

### 1. 기본 폼 페이지 (`index.html`)
- **이름, 학번, 질문** 입력 폼
- Google Form으로 데이터 제출
- 제출된 응답 확인 (Google Sheets 링크)
- 챗봇 샘플 페이지로 이동

### 2. 챗봇 샘플 페이지 (`chatbot-sample.html`)
- **이름, 학년, 코딩 경험** 입력 폼
- **OpenAI ChatGPT API** 연동
- 실시간 챗봇 대화 기능
- 대화 내용을 Google Form으로 제출

## 🛠️ 기술 스택

- **빌드 도구**: Vite 7.2.4
- **스타일링**: CSS3 (파스텔 톤 디자인, 그라데이션, 애니메이션)
- **알림 라이브러리**: SweetAlert2 11.26.3
- **API 연동**: 
  - Google Forms API
  - OpenAI ChatGPT API (챗봇 샘플)

## 📁 프로젝트 구조

```
ew-webapp-with-googleform/
├── index.html                 # 메인 페이지 (기본 폼)
├── chatbot-sample.html        # 챗봇 샘플 페이지
├── package.json               # 프로젝트 의존성 및 스크립트
├── vite.config.js             # Vite 빌드 설정 (멀티 페이지)
├── .gitignore                 # Git 무시 파일 목록
├── public/
│   └── vite.svg              # 파비콘
└── src/
    ├── main.js               # 메인 페이지 로직
    ├── chatbot-sample.js     # 챗봇 샘플 페이지 로직
    ├── style.css             # 공통 스타일시트
    ├── counter.js            # 미사용 파일 (템플릿 잔여)
    └── javascript.svg        # 미사용 파일 (템플릿 잔여)
```

## 🚀 시작하기

### 사전 요구사항

- Node.js (v14 이상 권장)
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   개발 서버가 실행되면 브라우저에서 `http://localhost:5173`으로 접속할 수 있습니다.

3. **프로덕션 빌드**
   ```bash
   npm run build
   ```
   빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

4. **프로덕션 미리보기**
   ```bash
   npm run preview
   ```

## 📝 사용 방법

### 기본 폼 페이지

1. 메인 페이지에서 이름, 학번, 질문을 입력합니다.
2. "제출하기" 버튼을 클릭하여 Google Form으로 데이터를 제출합니다.
3. "내가 제출한 응답 확인하기" 버튼으로 Google Sheets에서 제출된 데이터를 확인할 수 있습니다.

### 챗봇 샘플 페이지

1. 이름, 학년, 코딩 경험을 선택합니다.
2. OpenAI API Key를 입력하고 "확인" 버튼을 클릭합니다.
3. API Key가 확인되면 챗봇 섹션이 활성화됩니다.
4. 챗봇과 대화를 나눕니다.
5. 대화 후 "제출하기" 버튼을 클릭하여 모든 데이터를 Google Form으로 제출합니다.

## ⚙️ 설정

### Google Form 연동

각 페이지의 JavaScript 파일에서 다음 설정을 수정해야 합니다:

**`src/main.js`**:
```javascript
const GOOGLE_FORM_URL = 'YOUR_GOOGLE_FORM_URL';
const GOOGLE_SHEETS_URL = 'YOUR_GOOGLE_SHEETS_URL';
const ENTRY_IDS = {
  name: 'entry.XXXXX',
  studentId: 'entry.XXXXX',
  question: 'entry.XXXXX'
};
```

**`src/chatbot-sample.js`**:
```javascript
const GOOGLE_FORM_URL = 'YOUR_GOOGLE_FORM_URL';
const GOOGLE_SHEETS_URL = 'YOUR_GOOGLE_SHEETS_URL';
const ENTRY_IDS = {
  name: 'entry.XXXXX',
  grade: 'entry.XXXXX',
  codingExperience: 'entry.XXXXX',
  chatbotConversation: 'entry.XXXXX'
};
```

### Entry ID 찾는 방법

1. Google Form을 열고 "응답" 탭으로 이동합니다.
2. "스프레드시트에 연결"을 클릭하여 Google Sheets를 생성합니다.
3. 브라우저 개발자 도구를 열고 Network 탭을 확인합니다.
4. 폼을 제출하면 네트워크 요청에서 Entry ID를 확인할 수 있습니다.

## 🎨 디자인 특징

- **파스텔 톤 색상 팔레트**: 부드럽고 현대적인 UI
- **그라데이션 배경**: 시각적으로 매력적인 디자인
- **반응형 디자인**: 모바일 및 데스크톱 환경 지원
- **애니메이션 효과**: 부드러운 전환 및 상호작용
- **글래스모피즘**: 반투명 효과와 블러 처리

## ⚠️ 주의사항

1. **API Key 보안**: 챗봇 샘플에서 사용하는 OpenAI API Key는 브라우저에 저장되지 않지만, 프로덕션 환경에서는 서버 사이드에서 처리하는 것을 권장합니다.

2. **CORS 제한**: Google Form 제출은 `no-cors` 모드로 실행되므로 응답을 확인할 수 없습니다. 실제 제출 여부는 Google Sheets에서 확인해야 합니다.

3. **데이터 보안**: 이 프로젝트는 예시용으로 제작되었으며, 실제 프로덕션 환경에서는 적절한 보안 조치가 필요합니다.

## 📦 의존성

- **vite**: ^7.2.4 (빌드 도구)
- **sweetalert2**: ^11.26.3 (알림 라이브러리)

## 🔧 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm run preview`: 빌드된 파일 미리보기

## 📄 라이선스

이 프로젝트는 예시용으로 제작되었습니다.

## 🤝 기여

이슈나 개선 사항이 있다면 언제든지 제안해주세요!

---

**참고**: 이 프로젝트는 Google Form과의 연동 예시를 보여주기 위한 교육용 프로젝트입니다. 실제 사용 시에는 보안 및 데이터 처리에 주의하시기 바랍니다.

