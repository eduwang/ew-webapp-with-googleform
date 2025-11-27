import './style.css'
import Swal from 'sweetalert2'

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeOPFks4Vz4mkWNg7jp8FH7e5bifkc-BNQa9F9ieCEZRBduKA/formResponse';
const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/1N9zCqZya4aGmEhqZyKDYshKldm_v6Olm8l3mYarRxHM/edit?usp=sharing';
const ENTRY_IDS = {
  name: 'entry.2126016565',
  grade: 'entry.1030713275',
  codingExperience: 'entry.384524503',
  chatbotConversation: 'entry.1887656647'
};

const PROGRAMMING_LANGUAGES = [
  'Python', 'JavaScript', 'Java', 'C++', 'C#', 'TypeScript',
  'Go', 'Rust', 'Swift', 'Kotlin', 'PHP', 'Ruby',
  'HTML/CSS', 'SQL', 'R', 'MATLAB', 'Shell', '기타'
];

let apiKey = '';
let conversationHistory = [];
let hasConversation = false;

document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1>🤖 Chatbot 샘플</h1>
    <p class="subtitle">
    Google Form과 연동하여 선택형, Chatbot과의 대화 데이터를 제출합니다.<br>
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
        <label for="grade">학년</label>
        <select id="grade" name="grade" required>
          <option value="">학년을 선택하세요</option>
          <option value="1">1학년</option>
          <option value="2">2학년</option>
          <option value="3">3학년</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="codingExperience">코딩 경험</label>
        <div class="checkbox-group">
          ${PROGRAMMING_LANGUAGES.map(lang => `
            <label class="checkbox-label">
              <input type="checkbox" name="codingExperience" value="${lang}">
              <span>${lang}</span>
            </label>
          `).join('')}
        </div>
      </div>
      
      <div class="form-group">
        <label for="apiKey">ChatGPT API Key</label>
        <div class="api-key-group">
          <input 
            type="password" 
            id="apiKey" 
            name="apiKey" 
            placeholder="OpenAI API Key를 입력하세요" 
            required
          />
          <button type="button" id="checkApiKeyBtn" class="check-api-btn">
            확인
          </button>
        </div>
        <small class="api-key-hint">API Key는 브라우저에 저장되지 않습니다.</small>
      </div>
    </form>
    
    <div id="chatbotSection" class="chatbot-section" style="display: none;">
      <div class="chatbot-header">
        <h2>💬 Chatbot과 대화하기</h2>
        <p class="chatbot-subtitle">코딩으로 무엇을 만들고 싶은지 물어보세요!</p>
      </div>
      
      <div id="chatMessages" class="chat-messages"></div>
      
      <div class="chat-input-group">
        <input 
          type="text" 
          id="chatInput" 
          placeholder="메시지를 입력하세요..." 
          class="chat-input"
        />
        <button type="button" id="sendChatBtn" class="send-chat-btn">
          전송
        </button>
      </div>
    </div>
    
    <button type="button" id="submitBtn" class="submit-btn" style="display: none;">
      <span class="btn-text">제출하기</span>
      <span class="btn-loading" style="display: none;">제출 중...</span>
    </button>
    
    <button type="button" id="viewResponsesBtn" class="view-responses-btn" style="display: none;">
      내가 제출한 응답 확인하기
    </button>
  </div>
`

const form = document.querySelector('#surveyForm');
const apiKeyInput = document.querySelector('#apiKey');
const checkApiKeyBtn = document.querySelector('#checkApiKeyBtn');
const chatbotSection = document.querySelector('#chatbotSection');
const chatMessages = document.querySelector('#chatMessages');
const chatInput = document.querySelector('#chatInput');
const sendChatBtn = document.querySelector('#sendChatBtn');
const submitBtn = document.querySelector('#submitBtn');
const viewResponsesBtn = document.querySelector('#viewResponsesBtn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');

// API Key 확인
checkApiKeyBtn.addEventListener('click', async () => {
  const key = apiKeyInput.value.trim();
  
  if (!key) {
    await Swal.fire({
      icon: 'warning',
      title: 'API Key 필요',
      text: 'API Key를 입력해주세요.',
      confirmButtonText: '확인',
      confirmButtonColor: '#6B9DFF'
    });
    return;
  }
  
  checkApiKeyBtn.disabled = true;
  checkApiKeyBtn.textContent = '확인 중...';
  
  try {
    const isValid = await checkApiKeyValidity(key);
    
    if (isValid) {
      apiKey = key;
      apiKeyInput.disabled = true;
      checkApiKeyBtn.textContent = '✓ 확인됨';
      checkApiKeyBtn.style.background = '#4CAF50';
      checkApiKeyBtn.style.borderColor = '#4CAF50';
      
      chatbotSection.style.display = 'block';
      
      // 초기 메시지 추가
      addChatMessage('assistant', '안녕하세요! 코딩으로 무엇을 만들고 싶은지 물어보세요. 도와드리겠습니다! 😊');
      
      await Swal.fire({
        icon: 'success',
        title: 'API Key 확인 완료',
        text: 'Chatbot을 사용할 수 있습니다!',
        confirmButtonText: '확인',
        confirmButtonColor: '#6B9DFF'
      });
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'API Key 오류',
        text: '유효하지 않은 API Key입니다. 다시 확인해주세요.',
        confirmButtonText: '확인',
        confirmButtonColor: '#FF6B9D'
      });
    }
  } catch (error) {
    console.error('API Key 확인 오류:', error);
    await Swal.fire({
      icon: 'error',
      title: '확인 실패',
      text: 'API Key 확인 중 오류가 발생했습니다. 다시 시도해주세요.',
      confirmButtonText: '확인',
      confirmButtonColor: '#FF6B9D'
    });
  } finally {
    checkApiKeyBtn.disabled = false;
    if (!apiKey) {
      checkApiKeyBtn.textContent = '확인';
    }
  }
});

// API Key 유효성 검사
async function checkApiKeyValidity(key) {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
}

// 채팅 메시지 추가
function addChatMessage(role, content) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message chat-message-${role}`;
  
  const roleLabel = role === 'user' ? '나' : 'Chatbot';
  const roleIcon = role === 'user' ? '👤' : '🤖';
  
  messageDiv.innerHTML = `
    <div class="chat-message-header">
      <span class="chat-role-icon">${roleIcon}</span>
      <span class="chat-role-label">${roleLabel}</span>
    </div>
    <div class="chat-message-content">${content}</div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // 대화 기록 저장
  conversationHistory.push({ role, content });
}

// 채팅 전송
sendChatBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

async function sendMessage() {
  const message = chatInput.value.trim();
  
  if (!message || !apiKey) {
    return;
  }
  
  // 사용자 메시지 표시
  addChatMessage('user', message);
  chatInput.value = '';
  sendChatBtn.disabled = true;
  chatInput.disabled = true;
  
  // 로딩 표시
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'chat-message chat-message-assistant';
  loadingDiv.innerHTML = `
    <div class="chat-message-header">
      <span class="chat-role-icon">🤖</span>
      <span class="chat-role-label">Chatbot</span>
    </div>
    <div class="chat-message-content">답변을 생성하고 있습니다...</div>
  `;
  chatMessages.appendChild(loadingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '당신은 코딩 프로젝트에 대해 도움을 주는 친절한 어시스턴트입니다. 사용자가 코딩으로 무엇을 만들고 싶은지 물어보고, 친절하고 도움이 되는 답변을 제공하세요.'
          },
          ...conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error('API 요청 실패');
    }
    
    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;
    
    // 로딩 메시지 제거
    loadingDiv.remove();
    
    // 어시스턴트 메시지 표시
    addChatMessage('assistant', assistantMessage);
    
    // 첫 대화 후 제출 버튼 표시
    if (!hasConversation) {
      hasConversation = true;
      submitBtn.style.display = 'block';
      viewResponsesBtn.style.display = 'block';
    }
    
  } catch (error) {
    console.error('Chatbot 오류:', error);
    loadingDiv.remove();
    addChatMessage('assistant', '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.');
    
    await Swal.fire({
      icon: 'error',
      title: '대화 오류',
      text: 'Chatbot과의 대화 중 오류가 발생했습니다. API Key를 확인해주세요.',
      confirmButtonText: '확인',
      confirmButtonColor: '#FF6B9D'
    });
  } finally {
    sendChatBtn.disabled = false;
    chatInput.disabled = false;
    chatInput.focus();
  }
}

// 제출하기
submitBtn.addEventListener('click', async () => {
  const formData = new FormData(form);
  const name = formData.get('name');
  const grade = formData.get('grade');
  const codingExperience = Array.from(form.querySelectorAll('input[name="codingExperience"]:checked'))
    .map(cb => cb.value)
    .join(', ');
  const chatbotConversation = conversationHistory
    .map(msg => `${msg.role === 'user' ? '나' : 'Chatbot'}: ${msg.content}`)
    .join('\n');
  
  if (!name || !grade || !codingExperience || !chatbotConversation) {
    await Swal.fire({
      icon: 'warning',
      title: '입력 확인',
      text: '모든 필드를 입력하고 Chatbot과 대화를 나눠주세요.',
      confirmButtonText: '확인',
      confirmButtonColor: '#6B9DFF'
    });
    return;
  }
  
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';
  
  // Google Form 형식에 맞게 데이터 준비
  const params = new URLSearchParams();
  params.append(ENTRY_IDS.name, name);
  params.append(ENTRY_IDS.grade, grade);
  params.append(ENTRY_IDS.codingExperience, codingExperience);
  params.append(ENTRY_IDS.chatbotConversation, chatbotConversation);
  
  try {
    // no-cors 모드로 제출
    await fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });
    
    // no-cors 모드에서는 응답을 읽을 수 없지만, 제출은 성공한 것으로 간주
    // 폼 필드만 초기화 (대화 내용과 버튼은 유지)
    form.reset();
    
    // SweetAlert2로 제출 완료 메시지 표시
    await Swal.fire({
      icon: 'success',
      title: '제출 완료',
      text: '제출은 완료되었으나 정상 제출되었는지 확인하려면 실제 Google Form을 확인해야 합니다.',
      confirmButtonText: '확인',
      confirmButtonColor: '#6B9DFF'
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
    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
  }
});

// 응답 확인 버튼
viewResponsesBtn.addEventListener('click', () => {
  window.open(GOOGLE_SHEETS_URL, '_blank');
});

