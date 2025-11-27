import './style.css'
import Swal from 'sweetalert2'

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSd_YlT-liO3GiU4DCPq11C_TS_KLOfR5oxO5mbrAS0mT3bjgA/formResponse';
const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/1eE9wClU6mxMDJ5Ajtfp0YANkck6ktpWHMVFLhES2V9Y/edit?usp=sharing';
const ENTRY_IDS = {
  name: 'entry.1660765622',
  studentId: 'entry.1865490549',
  question: 'entry.612620041'
};

document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1><span class="emoji">📝</span><span class="title-text"> Google Form 연동 예시</span></h1>
    <p class="subtitle">
    Google Form과 연동하여 데이터를 제출합니다.<br>
    입력한 데이터는 예시용으로만 사용되며, 주기적으로 삭제됩니다.
    </p>
    
    <form id="surveyForm" class="form">
      <div class="form-group">
        <label for="name">이름</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          placeholder="이름을 입력하세요" 
          required
        />
      </div>
      
      <div class="form-group">
        <label for="studentId">학번</label>
        <input 
          type="text" 
          id="studentId" 
          name="studentId" 
          placeholder="학번을 입력하세요" 
          required
        />
      </div>
      
      <div class="form-group">
        <label for="question">궁금한 점 또는 하고 싶은 말</label>
        <textarea 
          id="question" 
          name="question" 
          placeholder="궁금한 점이나 하고 싶은 말을 입력하세요" 
          rows="5"
          required
        ></textarea>
      </div>
      
      <button type="submit" class="submit-btn">
        <span class="btn-text">제출하기</span>
        <span class="btn-loading" style="display: none;">제출 중...</span>
      </button>
    </form>
    
    <button type="button" id="viewResponsesBtn" class="view-responses-btn">
      내가 제출한 응답 확인하기
    </button>
    
    <button type="button" id="chatbotBtn" class="chatbot-nav-btn">
      🤖 챗봇 샘플로 이동
    </button>
  </div>
`

const form = document.querySelector('#surveyForm');
const submitBtn = form.querySelector('button[type="submit"]');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // UI 업데이트
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';
  
  // 폼 데이터 수집
  const formData = new FormData(form);
  const name = formData.get('name');
  const studentId = formData.get('studentId');
  const question = formData.get('question');
  
  // Google Form 형식에 맞게 데이터 준비
  const params = new URLSearchParams();
  params.append(ENTRY_IDS.name, name);
  params.append(ENTRY_IDS.studentId, studentId);
  params.append(ENTRY_IDS.question, question);
  
  try {
    // no-cors 모드로 제출
    const response = await fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });
    
    // no-cors 모드에서는 응답을 읽을 수 없지만, 제출은 성공한 것으로 간주
    form.reset();
    
    // SweetAlert2로 제출 완료 메시지 표시
    await Swal.fire({
      icon: 'success',
      title: '제출 완료',
      text: '제출은 완료되었으나 정상 제출되었는지 확인하려면 실제 Google Form을 확인해야 합니다.',
      confirmButtonText: '확인',
      confirmButtonColor: '#6B9DFF',
      customClass: {
        popup: 'swal-popup',
        title: 'swal-title',
        text: 'swal-text'
      }
    });
    
  } catch (error) {
    console.error('제출 오류:', error);
    await Swal.fire({
      icon: 'error',
      title: '제출 오류',
      text: '제출 중 오류가 발생했습니다. 다시 시도해주세요.',
      confirmButtonText: '확인',
      confirmButtonColor: '#FF6B9D'
    });
  } finally {
    // UI 복원
    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
  }
});

// 응답 확인 버튼 클릭 이벤트
const viewResponsesBtn = document.querySelector('#viewResponsesBtn');
viewResponsesBtn.addEventListener('click', () => {
  window.open(GOOGLE_SHEETS_URL, '_blank');
});

// 챗봇 샘플 버튼 클릭 이벤트
const chatbotBtn = document.querySelector('#chatbotBtn');
chatbotBtn.addEventListener('click', () => {
  window.location.href = 'chatbot-sample.html';
});
