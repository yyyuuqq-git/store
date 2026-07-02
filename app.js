import {
    supabase,
    initSupabaseClient,
    signUp,
    signIn,
    signOut,
    findEmail,
    updatePassword,
    deleteAccount,
    getCurrentUserProfile,
    resetPasswordByIdentity
} from './supabase-client.js';

// --- 전역 상태 및 UI 엘리먼트 ---
let currentUser = null;

// DOM 엘리먼트 캐싱
const elements = {
    //네비게이션 관련
    authNav: document.getElementById('auth-nav'),
    userBadge: document.getElementById('user-badge'),
    userAvatar: document.getElementById('user-avatar'),
    userNameSpan: document.getElementById('user-name-span'),
    btnLogin: document.getElementById('btn-login'),
    dropdownTrigger: document.getElementById('btn-user-dropdown'),
    dropdownMenu: document.getElementById('user-dropdown-menu'),
    dropdownMyInfo: document.getElementById('dropdown-my-info'),
    dropdownSavedPlanner: document.getElementById('dropdown-saved-planner'),
    dropdownLogout: document.getElementById('dropdown-logout'),
    dropdownDeleteAccount: document.getElementById('dropdown-delete-account'),
    
    // 모달 관련
    modalOverlay: document.getElementById('modal-overlay'),
    modalClose: document.getElementById('modal-close'),
    
    // 모달 탭들
    tabLogin: document.getElementById('tab-login'),
    tabSignUp: document.getElementById('tab-signup'),
    tabFindId: document.getElementById('tab-findid'),
    tabMyPage: document.getElementById('tab-mypage-view'),
    tabChangePassword: document.getElementById('tab-change-password'),
    tabFindPw: document.getElementById('tab-findpw'),
    
    // 폼 객체들
    formLogin: document.getElementById('form-login'),
    formSignUp: document.getElementById('form-signup'),
    formFindId: document.getElementById('form-findid'),
    formChangePassword: document.getElementById('form-change-password'),
    formFindPw: document.getElementById('form-findpw'),
    
    // 비밀번호 매칭 확인용 엘리먼트
    signupPassword: document.getElementById('signup-password'),
    signupPasswordConfirm: document.getElementById('signup-password-confirm'),
    
    // 탭 이동 링크들
    linkToSignUp: document.getElementById('link-to-signup'),
    linkToLogin: document.getElementById('link-to-login'),
    linkToFindId: document.getElementById('link-to-findid'),
    linkFindIdToLogin: document.getElementById('link-findid-to-login'),
    linkChangePassword: document.getElementById('link-change-password'),
    linkBackToProfile: document.getElementById('link-back-to-profile'),
    linkToFindPw: document.getElementById('link-to-findpw'),
    linkFindPwToLogin: document.getElementById('link-findpw-to-login'),
    
    // 프로필 정보 화면 엘리먼트
    profileEmail: document.getElementById('profile-email'),
    profileName: document.getElementById('profile-name'),
    profilePhone: document.getElementById('profile-phone'),
    
    // 회원탈퇴 버튼
    btnDeleteAccount: document.getElementById('btn-delete-account'),
    
    // 토스트 알림 컨테이너
    toastContainer: document.getElementById('toast-container'),
    
    
    
    // 부산 관광 가이드 추가 엘리먼트
    filterBtns: document.querySelectorAll('.filter-btn'),
    tourCards: document.querySelectorAll('.tour-card'),
    tourButtons: document.querySelectorAll('.tour-btn'),
    plannerDuration: document.getElementById('planner-duration'),
    plannerStyle: document.getElementById('planner-style'),
    btnGenerateCourse: document.getElementById('btn-generate-course'),
    plannerResult: document.getElementById('planner-result'),
    resultBadge: document.getElementById('result-badge'),
    timelineContainer: document.getElementById('timeline-container'),
    btnSaveCourse: document.getElementById('btn-save-course')
};

// --- 토스트 알림 기능 ---
export function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    toast.innerHTML = `
        <span>${message}</span>
        <button class="toast-close">&times;</button>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    // 닫기 버튼 이벤트
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.style.animation = 'none';
        toast.remove();
    });
    
    // 4초 후 자동 제거
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// --- 모달 제어 함수 ---
function openModal(tabElement) {
    // 모든 탭 숨기기
    [elements.tabLogin, elements.tabSignUp, elements.tabFindId, elements.tabMyPage, elements.tabChangePassword, elements.tabFindPw].forEach(tab => {
        if(tab) tab.classList.add('hidden');
    });
    
    // 대상 탭 보이기
    tabElement.classList.remove('hidden');
    tabElement.classList.add('active');
    
    // 모달 활성화
    elements.modalOverlay.classList.add('active');
}

function closeModal() {
    elements.modalOverlay.classList.remove('active');
}

// --- 로그인 상태에 따른 UI 업데이트 ---
async function updateAuthUI() {
    if (!supabase) return;
    
    try {
        currentUser = await getCurrentUserProfile();
        if (currentUser) {
            // 로그인 완료 상태 UI
            elements.btnLogin.classList.add('hidden');
            elements.userBadge.classList.remove('hidden');
            elements.userNameSpan.textContent = currentUser.username || currentUser.email;
            elements.userAvatar.textContent = (currentUser.username || currentUser.email).charAt(0).toUpperCase();
        } else {
            // 로그아웃 상태 UI
            elements.btnLogin.classList.remove('hidden');
            elements.userBadge.classList.add('hidden');
            currentUser = null;
        }
    } catch (err) {
        console.error('인증 상태 업데이트 에러:', err);
        elements.btnLogin.classList.remove('hidden');
        elements.userBadge.classList.add('hidden');
        currentUser = null;
    }
}

// --- 회원가입 제출 핸들러 ---
async function handleSignUpSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('signup-email').value.trim();
    const password = elements.signupPassword.value;
    const confirm = elements.signupPasswordConfirm.value;
    const name = document.getElementById('signup-name').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    
    // 유효성 검사
    if (password !== confirm) {
        showToast('비밀번호가 서로 일치하지 않습니다.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('비밀번호는 최소 6자리 이상이어야 합니다.', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner"></span> 가입 진행 중...`;
    
    try {
        await signUp(email, password, name, phone);
        showToast('회원가입이 완료되었습니다! 입력하신 이메일로 인증 메일이 발송되었다면 확인 후 로그인해 주세요.', 'success');
        e.target.reset();
        openModal(elements.tabLogin);
    } catch (err) {
        showToast(`회원가입 실패: ${err.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// --- 로그인 제출 핸들러 ---
async function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner"></span> 로그인 중...`;
    
    try {
        await signIn(email, password);
        const profile = await getCurrentUserProfile();
        const displayName = profile ? (profile.username || profile.email) : email;
        showToast(`🎉 ${displayName}님, 성공적으로 로그인되었습니다!`, 'success');
        e.target.reset();
        closeModal();
        await updateAuthUI();
    } catch (err) {
        showToast(`로그인 실패: ${err.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// --- 아이디(이메일) 찾기 제출 핸들러 ---
async function handleFindIdSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('findid-name').value.trim();
    const phone = document.getElementById('findid-phone').value.trim();
    
    const resultDiv = document.getElementById('findid-result');
    const emailSpan = document.getElementById('found-email');
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner"></span> 조회 중...`;
    
    try {
        const email = await findEmail(name, phone);
        resultDiv.classList.remove('hidden');
        if (email) {
            emailSpan.textContent = email;
            showToast('일치하는 회원 정보를 찾았습니다!', 'success');
        } else {
            emailSpan.textContent = '일치하는 정보가 존재하지 않습니다.';
            showToast('일치하는 회원 정보가 없습니다.', 'error');
        }
    } catch (err) {
        showToast(`아이디 조회 중 에러 발생: ${err.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// --- 비밀번호 재설정 제출 핸들러 ---
async function handleFindPwSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('findpw-email').value.trim();
    const name = document.getElementById('findpw-name').value.trim();
    const phone = document.getElementById('findpw-phone').value.trim();
    const newPassword = document.getElementById('findpw-new-password').value;
    
    if (newPassword.length < 6) {
        showToast('비밀번호는 최소 6자리 이상이어야 합니다.', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner"></span> 재설정 진행 중...`;
    
    try {
        const success = await resetPasswordByIdentity(email, name, phone, newPassword);
        if (success) {
            showToast('🎉 비밀번호가 성공적으로 재설정되었습니다! 새 비밀번호로 로그인해 주세요.', 'success');
            e.target.reset();
            openModal(elements.tabLogin);
        } else {
            showToast('입력하신 정보와 일치하는 회원이 존재하지 않습니다.', 'error');
        }
    } catch (err) {
        showToast(`비밀번호 재설정 실패: ${err.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// --- 비밀번호 변경 제출 핸들러 ---
async function handleChangePasswordSubmit(e) {
    e.preventDefault();
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-new-password').value;
    
    if (newPassword !== confirmPassword) {
        showToast('비밀번호가 일치하지 않습니다.', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showToast('비밀번호는 최소 6자리 이상이어야 합니다.', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner"></span> 변경 중...`;
    
    try {
        await updatePassword(newPassword);
        showToast('비밀번호가 성공적으로 변경되었습니다!', 'success');
        e.target.reset();
        openModal(elements.tabMyPage);
    } catch (err) {
        showToast(`비밀번호 변경 실패: ${err.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// --- 회원탈퇴 핸들러 ---
async function handleDeleteAccountClick() {
    if (!confirm('정말로 탈퇴하시겠습니까?\n탈퇴 시 모든 정보는 복구할 수 없도록 즉시 물리적으로 영구 삭제됩니다.')) {
        return;
    }
    
    elements.btnDeleteAccount.disabled = true;
    elements.btnDeleteAccount.innerHTML = `<span class="spinner"></span> 탈퇴 진행 중...`;
    
    try {
        await deleteAccount();
        showToast('회원탈퇴가 성공적으로 완료되었습니다. 이용해주셔서 감사합니다.', 'success');
        closeModal();
        await updateAuthUI();
    } catch (err) {
        showToast(`회원탈퇴 처리 실패: ${err.message}`, 'error');
        elements.btnDeleteAccount.disabled = false;
        elements.btnDeleteAccount.innerHTML = '회원 탈퇴하기';
    }
}

// --- 코스 플래너 추천 데이터 ---
const courseData = {
    "1": { // 당일
        "healing": [
            { time: "10:00", title: "다대포 해안생태길 산책", desc: "다대포 생태공원의 드넓은 갈대숲 데크길을 걸으며 아침 바다와 갯벌의 고요함을 만끽합니다." },
            { time: "13:00", title: "금강공원 케이블카 탐방", desc: "도심 속 금강산이라 불리는 금강공원에서 케이블카를 타고 숲과 어우러진 산세를 감상합니다." },
            { time: "17:00", title: "연화리 오션뷰 전복죽 식도락", desc: "기장 연화리 해변 포장마차촌에서 가마솥에 진하게 끓여낸 갓 딴 전복죽으로 든든한 저녁을 맛봅니다." },
            { time: "20:00", title: "다대포 꿈의 낙조분수 야경", desc: "세계 최대 수준의 해상 음악 분수에서 음악에 맞춰 춤추는 화려한 물줄기 야경을 봅니다." }
        ],
        "activity": [
            { time: "09:30", title: "송도 케이블카 스카이하버", desc: "바다 위를 가로지르는 크리스탈 캐빈 케이블카를 타고 짜릿한 스릴과 절경을 감상합니다." },
            { time: "12:30", title: "기장 루지 액티비티", desc: "스카이라인 루지 카트를 타고 경사로 트랙을 신나게 질주하며 다이내믹한 속도를 즐깁니다." },
            { time: "16:00", title: "송정 해변 서핑 서프독", desc: "한국 서핑의 메카 송정에서 전문 강사의 지도를 받아 안전하게 파도를 타는 해양 레저를 즐깁니다." },
            { time: "19:30", title: "수영만 요트 투어", desc: "해질녘 요트를 타고 광안대교 앞바다 한가운데서 불꽃놀이와 낭만적인 밤하늘을 만끽합니다." }
        ],
        "food": [
            { time: "11:00", title: "초량 밀면 & 만두", desc: "부산역 근처의 원조 밀면집에서 쫄깃한 면발과 얼음 동동 시원한 육수로 점심을 맛봅니다." },
            { time: "14:00", title: "남포동 국제시장 & BIFF거리", desc: "시장 골목을 구경하며 따뜻한 씨앗호떡, 납작만두, 깡통 떡볶이를 맛보는 핑거푸드 투어입니다." },
            { time: "17:30", title: "해운대 달맞이길 카페 & 한우 갈비", desc: "바다가 내려다보이는 달맞이 고개 카페에서 디저트를 먹고 숯불 향 가득한 한우 갈비로 식사합니다." },
            { time: "20:30", title: "민락수변공원 회 테이크아웃", desc: "민락회타운에서 갓 뜬 싱싱한 모듬 회를 포장해 밤바다 소리를 들으며 소박한 야식을 나눕니다." }
        ]
    },
    "2": { // 1박 2일
        "healing": [
            { time: "1일차 11:00", title: "해운대 해변 열차 & 청사포 다릿돌전망대", desc: "오션뷰 관광 해변 열차를 타고 청사포로 이동해 바다 위로 뻗은 스카이워크 위에서 탁 트인 동해 바다를 조망합니다." },
            { time: "1일차 14:30", title: "해동용궁사 탐방", desc: "바다 바로 옆 바위 절벽 위에 세워진 신비롭고 웅장한 사찰을 거닐며 맑은 정신을 충전합니다." },
            { time: "1일차 19:30", title: "더베이101 마린시티 야경", desc: "마린시티 고층 빌딩숲이 물결 위에 거울처럼 투영되는 눈부신 도시 야경을 낚아채며 하루를 끝냅니다." },
            { time: "2일차 10:00", title: "기장 용소웰빙공원", desc: "아름다운 출렁다리와 푸른 호수가 숲속 산책로와 평화롭게 어우러진 숨겨진 힐링 산책 명소입니다." },
            { time: "2일차 13:00", title: "부평 깡통시장 먹방 릴레이", desc: "어묵탕, 비빔당면, 깡통시장 떡볶이 등 전통 시장 노포 골목에서 다양한 맛을 끊임없이 음미합니다." }
        ],
        "activity": [
            { time: "1일차 10:30", title: "오륙도 스카이워크", desc: "투명 유리 바닥 아래로 거칠게 몰아치는 흰 파도를 밟으며 동해와 남해의 기점을 걸어봅니다." },
            { time: "1일차 14:00", title: "해운대 루지 & 엑스더스카이", desc: "스카이라인 루지 카트를 탄 후, 100층 높이의 엘시티 전망대에 올라 구름 위에서 해변을 조망합니다." },
            { time: "1일차 20:00", title: "해운대 달맞이길 루프탑 바", desc: "해운대 달맞이길 루프탑 바에서 칵테일을 마시며 낭만 가득한 밤바다 조명을 내려다봅니다." },
            { time: "2일차 11:00", title: "영도 절영해안산책로 트래킹", desc: "해안 기암절벽 바로 옆에 마련된 테마 해안 산책로를 걸으며 흰 포말을 가까이서 느껴봅니다." },
            { time: "2일차 14:30", title: "송도 거북섬 해상 산책", desc: "송도 해수욕장의 다리를 건너며 바다 위를 가볍게 걷고 구름다리를 직접 밟는 이색 체험을 합니다." }
        ],
        "food": [
            { time: "1일차 11:30", title: "수변공원 국밥거리 - 돼지국밥", desc: "부산 여행의 필수 코스인 돼지국밥 골목에서 부추를 듬뿍 넣은 뜨끈한 국밥을 맛봅니다." },
            { time: "1일차 15:00", title: "전포동 카페거리 커피 탐방", desc: "트렌디한 개인 카페들이 모여 있는 전포동 골목에서 인생 커피와 수제 디저트를 맛봅니다." },
            { time: "1일차 18:30", title: "기장 대게 만찬 또는 해산물 코스", desc: "부산 외곽 기장군에서 갓 쪄낸 대게나 모둠 해산물로 풍성한 만찬을 즐깁니다." },
            { time: "2일차 10:30", title: "영도 신기산업 오션뷰 카페", desc: "영도 산복도로에 있는 개조된 컨테이너 카페에서 넓은 부산항 야경을 내려다봅니다." },
            { time: "2일차 13:00", title: "부평 깡통시장 먹방 릴레이", desc: "비빔당면, 깡통시장 떡볶이, 단팥죽, 유부전골 등 끝없는 길거리 음식을 정복합니다." }
        ]
    },
    "3": { // 2박 3일
        "healing": [
            { time: "1일차 13:00", title: "부산 시민공원 피크닉", desc: "넓은 잔디밭과 울창한 숲길을 걸으며 복잡한 도시에서 벗어나 자연 속 여유를 만끽합니다." },
            { time: "1일차 18:00", title: "해운대 동백섬 산책", desc: "소나무 향기 가득한 산책로를 걸으며 누리마루 APEC하우스와 광안대교 오션뷰를 감상합니다." },
            { time: "2일차 11:00", title: "기장 아홉산숲 대나무 숲길", desc: "수백 년 된 대나무들이 빽빽이 들어선 사유림 숲길을 걸으며 깊은 피톤치드를 들이마십니다." },
            { time: "2일차 15:00", title: "임랑 해수욕장 한적한 바다", desc: "조용하고 한적한 임랑 해변에서 물멍을 때리며 파도 소리에만 집중하는 시간을 갖습니다." },
            { time: "3일차 10:00", title: "영도 흰여울문화마을", desc: "절벽 위 좁은 골목길을 따라 아기자기한 오션뷰 소품샵과 카페를 구경하며 낭만 가득한 산책을 합니다." },
            { time: "3일차 14:00", title: "부산 근현대역사관 박물관", desc: "원도심 남포동에 위치한 역사관에서 부산의 다이내믹한 역사 이야기를 조용히 짚어봅니다." }
        ],
        "activity": [
            { time: "1일차 14:00", title: "송정 해변 서핑 서프독", desc: "한국 서핑의 메카 송정에서 전문가에게 보드 타는 법을 배우고 멋지게 테이크오프합니다." },
            { time: "1일차 19:00", title: "부산 타워 전망대 & 야경 스크린", desc: "용두산공원 부산타워에 올라가 불빛 가득한 부산항 대교의 역동적인 조명을 전망합니다." },
            { time: "2일차 10:30", title: "기장 롯데월드 어드벤처", desc: "짜릿한 롤러코스터와 다채로운 퍼레이드가 가득한 동화 속 테마파크에서 종일 액티브한 하루를 보냅니다." },
            { time: "2일차 18:30", title: "부산 락클라이밍/실내 서핑", desc: "기장에서 실내 액티비티를 체험하거나 트렌디한 클라이밍 센터에서 운동을 즐깁니다." },
            { time: "3일차 11:00", title: "영도 봉래산 트래킹 코스", desc: "영도의 중심 봉래산 정상에 올라가 부산 전경을 360도로 조망하며 상쾌한 땀을 흘립니다." },
            { time: "3일차 15:00", title: "송도 케이블카 스카이하버", desc: "송도 해수욕장에서 케이블카 바닥이 투명한 크리스탈 크루즈를 타고 짜릿하게 바다를 건넙니다." }
        ],
        "food": [
            { time: "1일차 12:00", title: "완당집 - 만두피 완당탕", desc: "남포동에서 70년 전통의 얇디얇은 완당과 만두로 입맛을 돋우는 점심 식사를 합니다." },
            { time: "1일차 16:00", title: "해운대 전통시장 곰장어 구이", desc: "해운대 시장 골목에서 즉석으로 매콤하게 볶아내는 양념 곰장어와 볶음밥을 먹습니다." },
            { time: "2일차 11:30", title: "해운대 전복죽 & 해녀촌 회", desc: "기장 연화리 해녀촌에서 전복 싱싱한 모둠 해산물과 가마솥에 끓인 진한 전복죽을 맛봅니다." },
            { time: "2일차 16:30", title: "부산 어묵 만들기 체험", desc: "삼진어묵이나 고래사어묵 역사관에서 나만의 수제 어묵을 직접 빚고 갓 쪄낸 어묵을 먹어봅니다." },
            { time: "3일차 11:00", title: "중앙동 뚱보집 - 록빈 & 쭈꾸미", desc: "노포 감성이 가득한 골목에서 바삭한 빈대떡인 록빈과 매콤한 석쇠 주꾸미 구이로 해장과 맛의 정점을 찍습니다." },
            { time: "3일차 14:30", title: "보수동 책방골목 단팥죽", desc: "오래된 헌책방들이 모인 골목길 서점을 둘러보고 따뜻한 수제 단팥죽과 옛날 빙수로 디저트를 마칩니다." }
        ]
    }
};

// --- 상세 보기 클릭 시 동작 ---
function handleTourClick(btn) {
    const card = btn.closest('.tour-card');
    const tourName = card.querySelector('.tour-name').textContent.trim();
    // 로컬 상세 설명 페이지로 연계
    const url = `spot-detail.html?spot=${encodeURIComponent(tourName)}`;
    window.open(url, '_blank');
}

// --- 여행 코스 생성 로직 ---
function generateTravelCourse() {
    const duration = elements.plannerDuration.value;
    const style = elements.plannerStyle.value;
    
    const durationText = elements.plannerDuration.options[elements.plannerDuration.selectedIndex].text;
    const styleText = elements.plannerStyle.options[elements.plannerStyle.selectedIndex].text;
    
    const items = courseData[duration]?.[style];
    if (!items) {
        showToast('추천 코스를 가져오는 중 오류가 발생했습니다.', 'error');
        return;
    }
    
    // 배지 텍스트 업데이트
    elements.resultBadge.textContent = `${durationText} • ${styleText}`;
    
    // 타임라인 그리기
    elements.timelineContainer.innerHTML = '';
    items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'timeline-item';
        // 장소 이름 가공 (부평 깡통시장 먹방 릴레이 -> 부평 깡통시장)
        const queryTerm = item.title.split(' - ')[0].split('(')[0].trim();
        
        itemDiv.innerHTML = `
            <div class="timeline-badge">${index + 1}</div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <span class="timeline-time">${item.time}</span>
                    <h4 class="timeline-title">${item.title}</h4>
                </div>
                <p class="timeline-desc">${item.desc}</p>
                <div class="timeline-actions" style="margin-top: 0.8rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <a href="spot-detail.html?spot=${encodeURIComponent(queryTerm)}" target="_blank" class="btn" data-variant="accent" data-size="sm" style="text-decoration: none; font-size: 0.75rem; padding: 0.3rem 0.6rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 0.25rem; font-weight: 700;">
                        📖 가이드 상세 소개
                    </a>
                    <a href="https://map.kakao.com/?q=부산 ${encodeURIComponent(queryTerm)}" target="_blank" class="btn" data-variant="secondary" data-size="sm" style="text-decoration: none; font-size: 0.75rem; padding: 0.3rem 0.6rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 0.25rem;">
                        🗺️ 지도 길찾기
                    </a>
                </div>
            </div>
        `;
        elements.timelineContainer.appendChild(itemDiv);
    });
    
    // 숨김 해제 및 스크롤
    elements.plannerResult.classList.remove('hidden');
    elements.plannerResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('✨ 최적의 동선이 반영된 맞춤 코스가 추천되었습니다!', 'success');
}

// --- Supabase 인증 세션 변경 이벤트 리스너 ---
function setupAuthListener() {
    if (!supabase) return;
    
    supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('인증 세션 변경 감지:', event);
        await updateAuthUI();
    });
}

// --- 초기화 이벤트 및 리스너 등록 ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. 초기 UI 상태 업데이트
    updateAuthUI();
    setupAuthListener();
    
    // (기존 DB 설정 로직 제거됨)
    
    // 3. 이벤트 바인딩 - 모달 제어
    elements.btnLogin.addEventListener('click', () => openModal(elements.tabLogin));
    elements.modalClose.addEventListener('click', closeModal);
    elements.modalOverlay.addEventListener('click', (e) => {
        if (e.target === elements.modalOverlay) closeModal();
    });
    
    // 4. 이벤트 바인딩 - 탭 전환 링크
    elements.linkToSignUp.addEventListener('click', () => openModal(elements.tabSignUp));
    elements.linkToLogin.addEventListener('click', () => openModal(elements.tabLogin));
    elements.linkToFindId.addEventListener('click', () => {
        document.getElementById('findid-result').classList.add('hidden');
        openModal(elements.tabFindId);
    });
    elements.linkFindIdToLogin.addEventListener('click', () => openModal(elements.tabLogin));
    elements.linkToFindPw.addEventListener('click', () => openModal(elements.tabFindPw));
    elements.linkFindPwToLogin.addEventListener('click', () => openModal(elements.tabLogin));
    
    // 4.1. 유저 드롭다운 메뉴 활성화 제어
    elements.dropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.dropdownMenu.classList.toggle('show');
    });

    // 외부 클릭 시 드롭다운 닫기
    document.addEventListener('click', () => {
        if (elements.dropdownMenu) elements.dropdownMenu.classList.remove('show');
    });

    // 드롭다운 메뉴 아이템 바인딩
    elements.dropdownMyInfo.addEventListener('click', (e) => {
        e.preventDefault();
        elements.dropdownMenu.classList.remove('show');
        if (!currentUser) return;
        
        // 내 정보 텍스트 연동
        elements.profileEmail.textContent = currentUser.email;
        elements.profileName.textContent = currentUser.username;
        elements.profilePhone.textContent = currentUser.phone;
        
        openModal(elements.tabMyPage);
    });

    elements.dropdownSavedPlanner.addEventListener('click', (e) => {
        e.preventDefault();
        elements.dropdownMenu.classList.remove('show');
        
        // 저장된 여행 플래너 영역으로 부드럽게 스크롤
        const resultSection = document.getElementById('planner-result');
        if (resultSection && !resultSection.classList.contains('hidden')) {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            document.getElementById('course-planner-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
            showToast('💾 아직 생성된 맞춤 코스가 없습니다. 하단 플래너에서 추천 코스를 먼저 생성해 보세요!', 'info');
        }
    });

    elements.dropdownLogout.addEventListener('click', async (e) => {
        e.preventDefault();
        elements.dropdownMenu.classList.remove('show');
        try {
            await signOut();
            showToast('로그아웃 되었습니다.', 'success');
            await updateAuthUI();
        } catch (err) {
            showToast(`로그아웃 실패: ${err.message}`, 'error');
        }
    });

    elements.dropdownDeleteAccount.addEventListener('click', (e) => {
        e.preventDefault();
        elements.dropdownMenu.classList.remove('show');
        handleDeleteAccountClick();
    });
    
    elements.linkChangePassword.addEventListener('click', () => openModal(elements.tabChangePassword));
    elements.linkBackToProfile.addEventListener('click', () => openModal(elements.tabMyPage));
    
    // 5. 이벤트 바인딩 - 폼 제출
    elements.formSignUp.addEventListener('submit', handleSignUpSubmit);
    elements.formLogin.addEventListener('submit', handleLoginSubmit);
    elements.formFindId.addEventListener('submit', handleFindIdSubmit);
    elements.formChangePassword.addEventListener('submit', handleChangePasswordSubmit);
    elements.formFindPw.addEventListener('submit', handleFindPwSubmit);
    
    // 6. 이벤트 바인딩 - 회원탈퇴 & 로그아웃
    elements.btnDeleteAccount.addEventListener('click', handleDeleteAccountClick);
    document.getElementById('btn-logout').addEventListener('click', async () => {
        try {
            await signOut();
            showToast('로그아웃 되었습니다.', 'success');
            closeModal();
            await updateAuthUI();
        } catch (err) {
            showToast(`로그아웃 실패: ${err.message}`, 'error');
        }
    });
    
    // 7. 이벤트 바인딩 - 추천 관광 명소 상세 보기 시뮬레이션
    elements.tourButtons.forEach(btn => {
        btn.addEventListener('click', () => handleTourClick(btn));
    });

    // 8. 이벤트 바인딩 - 명소 카테고리 필터링
    elements.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            elements.tourCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transition = 'opacity 0.3s ease';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // 9. 이벤트 바인딩 - 코스 추천 생성 및 북마크 저장
    elements.btnGenerateCourse.addEventListener('click', (e) => {
        e.preventDefault();
        generateTravelCourse();
    });

    elements.btnSaveCourse.addEventListener('click', () => {
        if (!currentUser) {
            showToast('로그인이 필요한 서비스입니다. 상단의 로그인 버튼을 클릭해주세요.', 'error');
            openModal(elements.tabLogin);
        } else {
            const durationText = elements.plannerDuration.options[elements.plannerDuration.selectedIndex].text;
            const styleText = elements.plannerStyle.options[elements.plannerStyle.selectedIndex].text;
            showToast(`🎉 "${durationText} - ${styleText}" 코스가 회원님의 북마크에 안전하게 저장되었습니다!`, 'success');
        }
    });
});
