import {
    supabase,
    signUp,
    signIn,
    signOut,
    findEmail,
    updatePassword,
    deleteAccount,
    getCurrentUserProfile,
    resetPasswordByIdentity,
    fetchProducts,
    insertProduct,
    deleteProduct,
    toggleProductSoldOut
} from './supabase-client.js';

// --- 상품 데이터셋 정의 (신규 특화처방 간식 대거 추가) ---
let productsData = [
    // [테스트용 임시 상품]
    {
        id: "temp-test-product",
        category: "dog",
        subCategory: "bowl",
        subCategoryName: "테스트용 임시상품",
        name: "[테스트] 삭제용 임시 상품 🗑️",
        desc: "이 상품은 관리자 삭제 및 품절 테스트를 위해 제공되는 로컬 임시 상품입니다. 어드민 계정으로 로그인 후 삭제를 누르시면 메인 페이지에서 즉시 내려가고, 품절 처리를 하면 품절 상태를 확인하실 수 있습니다.",
        originalPrice: 10000,
        discountRate: 50,
        price: 5000,
        rating: 5.0,
        reviews: 0,
        tip: "자유롭게 삭제/품절 테스트를 진행하셔도 홈페이지와 데이터베이스에 전혀 무리가 없습니다.",
        target: "모든 테스트 진행자",
        delivery: "무료배송",
        bg: "linear-gradient(135deg, #f7ece2, #e8d0bd)",
        featured: true,
        isSoldOut: false,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="25" y="25" width="50" height="50" rx="10" fill="var(--error)" opacity="0.8"/>
                <text x="50" y="55" fill="white" font-size="12" font-weight="bold" text-anchor="middle">TEST</text>
              </svg>`
    },
    // 1. 강아지 용품
    {
        id: "dog-bowl-1",
        category: "dog",
        subCategory: "bowl",
        subCategoryName: "식기/물그릇",
        name: "오가닉 세라믹 경사 밥그릇",
        desc: "척추와 관절에 무리를 주지 않는 15도 경사각 식기입니다. 묵직한 세라믹 소재로 밥을 먹을 때 밀림이 전혀 없습니다.",
        originalPrice: 24000,
        discountRate: 20,
        price: 19200,
        rating: 4.9,
        reviews: 142,
        tip: "그릇 부분이 분리되어 세척이 용이하며, 전자레인지 사용이 가능해 화식이나 습식 사료를 데워주기 편리합니다.",
        target: "소형 및 중형견 전 연령",
        delivery: "무료배송",
        bg: "linear-gradient(135deg, #fcece6, #f7d1c4)",
        featured: true,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="50" cy="65" rx="35" ry="20" fill="var(--primary)" opacity="0.8"/>
                <ellipse cx="50" cy="58" rx="35" ry="18" fill="#fff"/>
                <ellipse cx="50" cy="55" rx="28" ry="13" fill="#e6d5c3"/>
                <path d="M42,52 C45,55 55,55 58,52" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"/>
              </svg>`
    },
    {
        id: "dog-bowl-2",
        category: "dog",
        subCategory: "bowl",
        subCategoryName: "식기/물그릇",
        name: "순환 유도 무소음 정수기",
        desc: "물이 계속 흘러 반려견의 호기심을 유도하여 음수량을 늘려주는 무소음 분수 정수 물그릇입니다. 3중 필터 탑재.",
        originalPrice: 39000,
        discountRate: 10,
        price: 35100,
        rating: 4.7,
        reviews: 98,
        tip: "모터 수명 향상과 깨끗한 수질을 위해 2주마다 필터를 세척하고 1달 주기로 필터 패드를 전면 교체해 주세요.",
        target: "평소 물을 잘 마시지 않아 결석 위험이 있는 모든 강아지",
        delivery: "무료배송",
        bg: "linear-gradient(135deg, #e4f4fa, #c2e5f2)",
        featured: false,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="25" y="40" width="50" height="38" rx="8" fill="var(--primary)" opacity="0.75"/>
                <ellipse cx="50" cy="40" rx="25" ry="10" fill="#a2daf0"/>
                <path d="M50,20 L50,35" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>
                <path d="M47,20 Q50,15 53,20" stroke="var(--accent)" stroke-width="2" fill="none"/>
              </svg>`
    },
    {
        id: "dog-collar-1",
        category: "dog",
        subCategory: "harness",
        subCategoryName: "목줄/하네스",
        name: "소프트 가죽 클래식 이니셜 목줄",
        desc: "부드럽고 튼튼한 이탈리아 천연 소가죽으로 제작되어 반려견 목 피부에 자극이 덜하고 쓸림이 없는 프리미엄 가죽 목줄입니다.",
        originalPrice: 30000,
        discountRate: 20,
        price: 24000,
        rating: 4.8,
        reviews: 85,
        tip: "인식표 D링이 탑재되어 안전하게 인식표 펜던트를 걸 수 있으며, 수분 접촉 시 가죽 에센스로 가볍게 닦아 관리해 주세요.",
        target: "모든 크기의 반려견 (S/M/L 사이즈 옵션 제공)",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #f5f0eb, #e3d3c4)",
        featured: false,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="28" stroke="var(--accent)" stroke-width="6" fill="none"/>
                <circle cx="50" cy="78" r="8" fill="var(--accent)"/>
              </svg>`
    },
    {
        id: "dog-harness-1",
        category: "dog",
        subCategory: "harness",
        subCategoryName: "목줄/하네스",
        name: "메쉬 프리 컴포트 H형 하네스",
        desc: "산책 시 당김으로 인한 목과 기도의 압박을 분산시켜주는 안심 H형 에어메쉬 하네스입니다. 가벼운 중량.",
        originalPrice: 35000,
        discountRate: 15,
        price: 29750,
        rating: 4.9,
        reviews: 215,
        tip: "버클이 등 위쪽에 배치되어 있어 앞발을 끼울 필요 없이 머리만 넣어 쉽게 착용이 가능합니다.",
        target: "기관지 협착증이나 쓸개골 약화가 진행 중인 반려견",
        delivery: "무료배송",
        bg: "linear-gradient(135deg, #e3f5e9, #c3e8d2)",
        featured: true,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30,30 C30,70 70,70 70,30" stroke="var(--primary)" stroke-width="8" stroke-linecap="round" fill="none"/>
                <line x1="50" y1="48" x2="50" y2="80" stroke="var(--primary)" stroke-width="8" stroke-linecap="round"/>
                <rect x="45" y="70" width="10" height="10" fill="var(--accent)"/>
              </svg>`
    },
    {
        id: "dog-lead-1",
        category: "dog",
        subCategory: "harness",
        subCategoryName: "목줄/하네스",
        name: "안전 그립 원터치 자동 리드줄 (5m)",
        desc: "버튼 하나로 신속하게 줄 길이 조절 및 일시 정지가 가능한 신축식 자동 리드줄입니다. 인체공학적 고무 그립 적용.",
        originalPrice: 32000,
        discountRate: 15,
        price: 27200,
        rating: 4.6,
        reviews: 73,
        tip: "비에 젖은 경우 줄을 끝까지 풀어낸 뒤 그늘에서 완전히 건조하여 내장 스프링이 부식되지 않게 관리하세요.",
        target: "산책 시 자유로운 반경 보장과 통제가 동시에 필요한 반려견",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #f7ece2, #e8d0bd)",
        featured: false,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="25" y="30" width="45" height="40" rx="20" fill="var(--primary)" opacity="0.8"/>
                <rect x="52" y="42" width="22" height="16" rx="5" stroke="var(--primary)" stroke-width="6"/>
                <circle cx="38" cy="42" r="5" fill="var(--accent)"/>
              </svg>`
    },
    {
        id: "dog-tag-1",
        category: "dog",
        subCategory: "tag",
        subCategoryName: "인식표",
        name: "무소음 실리콘 맞춤 각인 인식표",
        desc: "산책 중 짤랑거리는 소리 자극이 전혀 없으며, 하네스에 딱 맞게 밀착되는 방수 실리콘 커스텀 각인 인식표입니다.",
        originalPrice: 15000,
        discountRate: 20,
        price: 12000,
        rating: 4.9,
        reviews: 160,
        tip: "주문시 보호자 성명과 휴대폰 연락처, 반려동물 등록번호를 기재해주시면 레이저로 각인됩니다.",
        target: "소리에 예민하고 야외 활동을 선호하는 반려견",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #fff0f5, #ffd1df)",
        featured: false,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="25" y="40" width="50" height="20" rx="8" fill="var(--accent)"/>
                <circle cx="35" cy="50" r="4" fill="white"/>
                <line x1="45" y1="50" x2="68" y2="50" stroke="white" stroke-width="3" stroke-linecap="round"/>
              </svg>`
    },
    {
        id: "dog-muzzle-1",
        category: "dog",
        subCategory: "muzzle",
        subCategoryName: "입마개",
        name: "통기성 쾌적 메쉬 안전 입마개",
        desc: "호흡과 음수가 가능하도록 전면 바구니형 메쉬로 특수 디자인되어 짖음/물림을 미연에 안전하게 예방합니다.",
        originalPrice: 22000,
        discountRate: 10,
        price: 19800,
        rating: 4.5,
        reviews: 43,
        tip: "처음 착용시에는 간식을 틈새로 급여하며 거부감을 줄이는 훈련을 우선 진행하는 것을 권장합니다.",
        target: "사회화 훈련 중이거나 짖음 및 입질 제어가 필요한 반려견",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #e3ecf5, #c3d5e8)",
        featured: false,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30,30 L60,40 L60,60 L30,55 Z" fill="none" stroke="var(--primary)" stroke-width="4"/>
                <path d="M40,33 L40,57 M50,37 L50,59" stroke="var(--primary)" stroke-width="2"/>
                <path d="M60,50 L85,45" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/>
              </svg>`
    },
    {
        id: "dog-clothes-1",
        category: "dog",
        subCategory: "clothes",
        subCategoryName: "의류",
        name: "파스텔 보들 보들 코튼 스트라이프 티",
        desc: "피부 알레르기를 예방하는 100% 오가닉 면사 원단으로 국내 제작한 부드러운 신축성 실내 데일리복입니다.",
        originalPrice: 20000,
        discountRate: 20,
        price: 16000,
        rating: 4.8,
        reviews: 112,
        tip: "찬물 중성세제로 가볍게 손세탁하거나 울코스로 기계 세탁하십시오. 자연건조를 권장합니다.",
        target: "미용 직후 보온이 필요하거나 피부 보호가 필요한 반려견",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #fffae6, #fff0b3)",
        featured: false,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M35,30 L65,30 L75,75 L25,75 Z" fill="var(--primary)" opacity="0.8"/>
                <line x1="30" y1="45" x2="70" y2="45" stroke="var(--accent)" stroke-width="4"/>
                <line x1="27" y1="60" x2="73" y2="60" stroke="var(--accent)" stroke-width="4"/>
              </svg>`
    },

    // 2. 고양이 용품
    {
        id: "cat-bowl-1",
        category: "cat",
        subCategory: "bowl",
        subCategoryName: "식기/물그릇",
        name: "도자기 와이드 안심 턱드름 밥그릇",
        desc: "예민한 고양이 수염 피로를 방지하는 널찍하고 편평한 형태의 최고급 유기 도자기 안심 식기입니다.",
        originalPrice: 28000,
        discountRate: 25,
        price: 21000,
        rating: 4.9,
        reviews: 154,
        tip: "플라스틱 식기와 달리 스크래치가 나지 않아 세균 번식을 막아주고 턱 여드름을 효과적으로 예방합니다.",
        target: "수염이 닿는 것을 싫어하거나 피부염 예방이 필요한 반려묘",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #fff0e6, #ffd1b3)",
        featured: true,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="50" cy="70" rx="38" ry="12" fill="var(--primary)" opacity="0.8"/>
                <ellipse cx="50" cy="65" rx="38" ry="10" fill="#fff"/>
                <circle cx="50" cy="63" r="4" fill="var(--accent)"/>
              </svg>`
    },
    {
        id: "cat-bowl-2",
        category: "cat",
        subCategory: "bowl",
        subCategoryName: "식기/물그릇",
        name: "폭포 분수 세라믹 무선 수중 정수기",
        desc: "고양이가 좋아하는 흐르는 폭포형 물줄기를 재현하고 모터를 무선화하여 전류 누전 위험이 전혀 없는 고급 도자기 정수기입니다.",
        originalPrice: 50000,
        discountRate: 10,
        price: 45000,
        rating: 4.8,
        reviews: 120,
        tip: "도자기 바디는 끓는물 열탕 소독이 가능하여 물이끼나 물때 세척에 아주 위생적입니다.",
        target: "신장 건강을 위해 음수 유도가 필수적인 반려묘",
        delivery: "무료배송",
        bg: "linear-gradient(135deg, #e6f7ff, #b3e6ff)",
        featured: true,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="50" cy="65" rx="30" ry="25" fill="var(--primary)" opacity="0.75"/>
                <path d="M50,25 Q50,45 60,45" stroke="var(--accent)" stroke-width="4" fill="none" stroke-linecap="round"/>
                <ellipse cx="50" cy="45" rx="20" ry="5" fill="#a5d8f2"/>
              </svg>`
    },
    {
        id: "cat-collar-1",
        category: "cat",
        subCategory: "harness",
        subCategoryName: "목줄/하네스",
        name: "안전 탈출 스마트 버클 레더 목줄",
        desc: "어딘가 걸렸을 때 일정 장력(3kg) 이상이 가해지면 자동으로 풀려 목 졸림 질식을 방지하는 안전 버클형 가죽 목줄입니다.",
        originalPrice: 24000,
        discountRate: 25,
        price: 18000,
        rating: 4.7,
        reviews: 62,
        tip: "방울과 이니셜 펜던트가 함께 조립되어 실내에서 냥이 발소리와 위치를 은은하게 확인하기 좋습니다.",
        target: "수직 놀이가 많아 목걸이 걸림 위험이 있는 반려묘",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #f0ebf5, #dfd3e8)",
        featured: false,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="28" stroke="var(--primary)" stroke-width="6" fill="none"/>
                <circle cx="50" cy="78" r="8" fill="var(--accent)"/>
              </svg>`
    },
    {
        id: "cat-harness-1",
        category: "cat",
        subCategory: "harness",
        subCategoryName: "목줄/하네스",
        name: "스케입 프리 안심 랩 하네스",
        desc: "유연한 연골을 가져 쉽게 빠져나가는 묘체를 위해 몸 전체를 감싸는 조끼 랩 형태의 탈출 방지 하네스입니다.",
        originalPrice: 34000,
        discountRate: 12,
        price: 29920,
        rating: 4.8,
        reviews: 79,
        tip: "이중 벨크로 락 시스템으로 고정력이 매우 뛰어나며 야외 이동 시 공포감을 덜어주는 안락함을 줍니다.",
        target: "비상 이동이나 외부 외출 시 탈출 우려가 큰 고양이",
        delivery: "무료배송",
        bg: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
        featured: false,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30,35 C30,75 70,75 70,35" stroke="var(--primary)" stroke-width="8" stroke-linecap="round" fill="none"/>
                <rect x="42" y="58" width="16" height="12" rx="3" fill="var(--accent)"/>
              </svg>`
    },
    {
        id: "cat-clothes-1",
        category: "cat",
        subCategory: "clothes",
        subCategoryName: "의류",
        name: "메쉬 쿨링 스핑크스 전용 의류",
        desc: "스핑크스 등 털이 없는 고양이 전용 유기농 면 티셔츠로 피지 기름때 이염 방지 및 피부 체온을 유지합니다.",
        originalPrice: 24000,
        discountRate: 20,
        price: 19200,
        rating: 4.9,
        reviews: 73,
        tip: "겨드랑이와 배 쪽 쏠림이 없도록 패턴 디자인되었으며 그루밍 반경을 방해하지 않는 신축 원단입니다.",
        target: "스핑크스 묘종 및 온도 조절이나 피부 쓸림 보호가 필요한 고양이",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #fffae6, #fff0b3)",
        featured: false,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M35,32 L65,32 L72,70 L28,70 Z" fill="var(--primary)" opacity="0.8"/>
                <path d="M42,20 L50,32 L58,20" stroke="var(--accent)" stroke-width="4" fill="none"/>
              </svg>`
    },

    // 3. 특화간식 (기존 5종 공용)
    {
        id: "snack-joint-1",
        category: "snack",
        subCategory: "snack",
        subCategoryName: "질환 특화간식",
        name: "🦴 슬개골 튼튼 콘드로이친 조인트 츄",
        desc: "슬개골 탈구 및 연골 손상 예방을 유도하도록 상어연골 콘드로이친과 글루코사민을 고함량 함유한 소프트 츄 간식입니다.",
        originalPrice: 17000,
        discountRate: 23,
        price: 13090,
        rating: 4.9,
        reviews: 284,
        tip: "노령견/노령묘가 씹기 좋도록 말랑쫄깃한 젤 제형으로 건조하여 잇몸 건강 통증 없이 부드럽게 급여할 수 있습니다.",
        target: "슬개골 탈구 염려가 큰 푸들, 포메 등의 소형 펫 및 관절이 약한 묘체",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #fbf0e1, #f5dfc1)",
        featured: true,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="35" y="45" width="30" height="10" rx="3" fill="var(--accent)"/>
                <circle cx="33" cy="45" r="7" fill="var(--accent)"/>
                <circle cx="33" cy="55" r="7" fill="var(--accent)"/>
                <circle cx="67" cy="45" r="7" fill="var(--accent)"/>
                <circle cx="67" cy="55" r="7" fill="var(--accent)"/>
              </svg>`
    },
    {
        id: "snack-tear-1",
        category: "snack",
        subCategory: "snack",
        subCategoryName: "질환 특화간식",
        name: "👁️ 눈물 싹싹 안구 케어 빌베리 쌀쿠키",
        desc: "눈물 번짐 자국 완화 및 안구 건조 방지를 위해 안토시아닌이 풍부한 빌베리와 루테인을 첨가하여 바삭하게 오븐 조리한 쌀쿠키입니다.",
        originalPrice: 16000,
        discountRate: 25,
        price: 12000,
        rating: 4.8,
        reviews: 193,
        tip: "알레르기를 유발하는 밀가루나 인공 색소를 배제하고 100% 햅쌀가루로 구워 안전합니다.",
        target: "비숑, 말티즈 등 눈물 얼룩 자국이 많이 생기거나 시력 관리가 필요한 펫",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #f0e6f5, #dfc2f2)",
        featured: true,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="22" fill="var(--primary)" opacity="0.8"/>
                <circle cx="50" cy="50" r="15" fill="none" stroke="white" stroke-width="3" stroke-dasharray="6 3"/>
                <circle cx="45" cy="45" r="3" fill="white"/>
              </svg>`
    },
    {
        id: "snack-kidney-1",
        category: "snack",
        subCategory: "snack",
        subCategoryName: "질환 특화간식",
        name: "💧 저인 저나트륨 안심 신장 케어 크랜베리 퓨레",
        desc: "신장 여과 기능 유지 및 결석 요로 결석 염증 억제를 위해 인 수치를 획기적으로 차단하고 크랜베리를 배합한 짜먹는 수분 퓨레입니다.",
        originalPrice: 18000,
        discountRate: 19,
        price: 14580,
        rating: 4.9,
        reviews: 312,
        tip: "저단백 저나트륨 포뮬러라 신부전증 묘체/견체 식단에 섞거나 음수가 필요할 때 식수에 희석하여 주기 좋습니다.",
        target: "신장 수치 관리가 시급하거나 방광염 결석을 반복해서 앓아 온 펫",
        delivery: "무료배송",
        bg: "linear-gradient(135deg, #e3f5fc, #bae6f7)",
        featured: true,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25,25 L75,35 L65,75 L35,75 Z" fill="var(--primary)" opacity="0.75"/>
                <ellipse cx="45" cy="50" r="4" fill="var(--accent)"/>
                <ellipse cx="55" cy="50" r="4" fill="var(--accent)"/>
              </svg>`
    },
    {
        id: "snack-atopy-1",
        category: "snack",
        subCategory: "snack",
        subCategoryName: "질환 특화간식",
        name: "🌱 알레르기 제로 가수분해 연어 아토피 바이트",
        desc: "피부 장벽 개선 및 사료 단백질 거부 반응 예방을 유도하도록 연어 살코기를 미세 분자로 쪼갠 저자극 가수분해 아토피 안심 간식입니다.",
        originalPrice: 20000,
        discountRate: 25,
        price: 15000,
        rating: 4.8,
        reviews: 224,
        tip: "피부 건조함을 해결하는 오메가3 가 다량 함유되어 털이 빠진 귓가나 각질 발바닥 케어에 탁월합니다.",
        target: "육류 알레르기로 귓병이 잦고 발바닥이나 배 부위를 계속 긁어 상처가 나는 펫",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #eef9f2, #c7eccf)",
        featured: false,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="25" y="35" width="50" height="30" rx="6" fill="var(--primary)" opacity="0.8"/>
                <path d="M35,50 Q50,45 65,50" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/>
              </svg>`
    },
    {
        id: "snack-obesity-1",
        category: "snack",
        subCategory: "snack",
        subCategoryName: "질환 특화간식",
        name: "🏃 저칼로리 곤약 닭가슴살 건강 육포",
        desc: "체중 조절이 필수적인 펫을 위해 곤약 분말과 고단백 무지방 닭가슴살을 혼합해 1스틱당 단 2kcal 칼로리로 완성한 건강 다이어트 육포입니다.",
        originalPrice: 15000,
        discountRate: 16,
        price: 12600,
        rating: 4.7,
        reviews: 135,
        tip: "지방 간이나 췌장염 걱정이 있어 간식을 일체 금해 포만감이 절실할 때 급여하면 다이어트 스트레스를 날려줍니다.",
        target: "과체중 판정을 받았거나 중성화 수술 이후 급격하게 살이 찌고 있는 모든 펫",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #fffae6, #ffe680)",
        featured: false,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="30" y="25" width="40" height="50" rx="3" fill="var(--accent)"/>
                <line x1="40" y1="35" x2="40" y2="65" stroke="var(--primary)" stroke-width="4" stroke-linecap="round"/>
                <line x1="50" y1="35" x2="50" y2="65" stroke="var(--primary)" stroke-width="4" stroke-linecap="round"/>
                <line x1="60" y1="35" x2="60" y2="65" stroke="var(--primary)" stroke-width="4" stroke-linecap="round"/>
              </svg>`
    },

    // 신규 추가된 구체적 질환별 특화간식 (진단 폼 매칭용)
    {
        id: "snack-ear-1",
        category: "snack",
        subCategory: "snack",
        subCategoryName: "질환 특화간식",
        name: "👂 귓병 안심 무균 이어클리너 & 오메가츄",
        desc: "반복되는 외이도염과 붉은 귀 발적 완화를 돕도록 항균 허브 오일과 카렌듈라 추출물이 가득 함유된 귀 세정 츄어블입니다.",
        originalPrice: 16000,
        discountRate: 12,
        price: 14080,
        rating: 4.8,
        reviews: 84,
        tip: "세균 증식을 막아주는 순한 세정 성분으로 귀 가려움을 완화시켜 주며, 오메가3 지방산이 외이도 피부 면역 장벽을 보강합니다.",
        target: "귓병이 자주 나 머리를 흔들거나 귀 주변을 계속 긁는 강아지",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #eef7fc, #cce8f7)",
        featured: false,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40,30 L60,30 L70,80 L30,80 Z" fill="var(--primary)" opacity="0.8"/>
                <path d="M50,15 L50,30" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/>
                <circle cx="50" cy="55" r="8" fill="white"/>
              </svg>`
    },
    {
        id: "snack-heart-1",
        category: "snack",
        subCategory: "snack",
        subCategoryName: "질환 특화간식",
        name: "❤️ 면역 보강 심장 강화 초록입홍합 트릿",
        desc: "노령으로 인한 기력 저하 방지 및 심장 근육 강화, 면역 조절을 위해 고품질 초록입홍합과 코엔자임 Q10을 동결건조한 건강 트릿입니다.",
        originalPrice: 19000,
        discountRate: 15,
        price: 16150,
        rating: 4.9,
        reviews: 127,
        tip: "첨가물 없는 순수 초록입홍합 원물 트릿으로 신진대사를 높여주고 면역 항체를 자극해 줍니다.",
        target: "여름철/환절기 면역력이 떨어져 무기력하고 심장 혈관 관리가 필요한 펫",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #fdf0f0, #fbcaca)",
        featured: false,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50,35 C50,35 35,20 20,35 C5,50 50,85 50,85 C50,85 95,50 80,35 C65,20 50,35 50,35 Z" fill="var(--accent)"/>
              </svg>`
    },
    {
        id: "snack-hairball-1",
        category: "snack",
        subCategory: "snack",
        subCategoryName: "질환 특화간식",
        name: "🌾 헤어볼 쏙쏙 락토 캣그라스 츄어블",
        desc: "그루밍 중 삼킨 털이 장내 정체되는 것을 해소하고 변비 해결을 유도하도록 귀리 식이섬유와 락토바실러스 유산균을 결합한 츄어블입니다.",
        originalPrice: 15000,
        discountRate: 20,
        price: 12000,
        rating: 4.8,
        reviews: 94,
        tip: "캣그라스를 갈아 넣어 기호성이 매우 우수하며 식이섬유가 위장 속 뭉친 털을 감싸 대변으로 쉽게 나오도록 돕습니다.",
        target: "헤어볼을 자주 토해 헛구역질을 하거나 만성 변비를 앓는 예민 묘체",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #f0f7f2, #d1ecd9)",
        featured: false,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30,75 L40,30 L50,75 L60,35 L70,75 Z" stroke="var(--primary)" stroke-width="6" stroke-linecap="round" fill="none"/>
              </svg>`
    },
    {
        id: "snack-herpes-1",
        category: "snack",
        subCategory: "snack",
        subCategoryName: "질환 특화간식",
        name: "🧬 안구 면역 아웃 L-라이신 타우린 퓨레",
        desc: "허피스 바이러스 복제를 차단해 주는 L-라이신과 시력 손상을 지연하는 타우린을 황금 비율로 배합한 기호성 극대화 무염 연어 퓨레입니다.",
        originalPrice: 18000,
        discountRate: 20,
        price: 14400,
        rating: 4.9,
        reviews: 215,
        tip: "허피스는 예방이 가장 중요하므로 매일 아침 사료 위에 1포씩 토핑처럼 가볍게 비벼서 꾸준히 급여해 주시면 좋습니다.",
        target: "허피스 감염 이력이 있거나 눈곱, 눈물 번짐 결막염이 잦은 고양이",
        delivery: "무료배송",
        bg: "linear-gradient(135deg, #f3ebfa, #dcbeee)",
        featured: true,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30,30 L70,30 L70,70 L30,70 Z" fill="var(--primary)" opacity="0.8"/>
                <circle cx="50" cy="50" r="10" stroke="white" stroke-width="3" fill="none"/>
              </svg>`
    },
    {
        id: "snack-stomatitis-1",
        category: "snack",
        subCategory: "snack",
        subCategoryName: "질환 특화간식",
        name: "🦷 구내염 진정 락토페린 안심 덴탈가루",
        desc: "고통스러운 구내염 치주질환 통증을 낮추고 구강 세균막 증식을 막는 천연 초유 락토페린과 스피루리나 기반의 덴탈 파우더입니다.",
        originalPrice: 20000,
        discountRate: 15,
        price: 17000,
        rating: 4.8,
        reviews: 104,
        tip: "염증 부위에 닿아 흡수되도록 소량의 온수에 가볍게 개어 잇몸에 면봉으로 직접 도포하거나 식단에 섞어 줍니다.",
        target: "침 흘림이 잦고 구강 통증 때문에 사료를 씹지 못하고 뱉어내는 묘체",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #eef9f2, #c7eccf)",
        featured: false,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30,45 Q50,25 70,45 Q50,65 30,45 Z" fill="var(--primary)" opacity="0.8"/>
                <path d="M35,45 H65" stroke="white" stroke-width="2"/>
              </svg>`
    },
    {
        id: "snack-stress-1",
        category: "snack",
        subCategory: "snack",
        subCategoryName: "질환 특화간식",
        name: "🌿 힐링 캣닙 라벤더 안심 츄",
        desc: "스트레스성 오버그루밍 탈모 및 영역 불안 증상을 해소하도록 유기농 개박하(캣닙)와 신경 안정 물질인 L-테아닌이 든 간식입니다.",
        originalPrice: 14000,
        discountRate: 20,
        price: 11200,
        rating: 4.9,
        reviews: 143,
        tip: "낯선 소음, 이사 등으로 냥이가 잔뜩 주눅 들어 있거나 구석에 숨으려 할 때 1개 주시면 심신 긴장을 부드럽게 이완해 줍니다.",
        target: "불안감을 느껴 배나 발등 털이 다 빠질 정도로 오버그루밍을 반복하는 고양이",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #fffbe6, #fff099)",
        featured: false,
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="25" y="30" width="50" height="40" rx="12" fill="var(--accent)"/>
                <path d="M45,45 Q50,35 55,45" stroke="white" stroke-width="4" stroke-linecap="round"/>
              </svg>`
    }
];

// --- 2차 소분류 매핑 칩 데이터 ---
const subCategoriesMap = {
    dog: [
        { id: "all", name: "전체보기" },
        { id: "bowl", name: "식기/물그릇" },
        { id: "harness", name: "목줄/하네스" },
        { id: "tag", name: "인식표" },
        { id: "muzzle", name: "입마개" },
        { id: "clothes", name: "의류" },
        { id: "snack", name: "질환 특화간식" }
    ],
    cat: [
        { id: "all", name: "전체보기" },
        { id: "bowl", name: "식기/물그릇" },
        { id: "harness", name: "목줄/하네스" },
        { id: "tag", name: "인식표" },
        { id: "muzzle", name: "입마개" },
        { id: "clothes", name: "의류" },
        { id: "snack", name: "질환 특화간식" }
    ]
};

// --- 건강 진단 동적 옵션 데이터 ---
const breedOptionsMap = {
    dog: [
        { value: "poodle", text: "푸들" },
        { value: "pomeranian", text: "포메라니안" },
        { value: "maltese", text: "말티즈" },
        { value: "retriever", text: "골든 리트리버" },
        { value: "shiba", text: "시바견" },
        { value: "mix", text: "믹스견 (하이브리드)" }
    ],
    cat: [
        { value: "russianblue", text: "러시안 블루" },
        { value: "koreanshort", text: "코리안 숏헤어" },
        { value: "persian", text: "페르시안" },
        { value: "ragdoll", text: "랙돌" },
        { value: "sphynx", text: "스핑크스" },
        { value: "mixcat", text: "믹스묘 (하이브리드)" }
    ]
};

const diseaseOptionsMap = {
    dog: [
        { value: "joint", text: "슬개골 탈구 / 마디 관절염 (연골 케어)" },
        { value: "tear", text: "눈물자국 번짐 / 시력 노화 (눈 건강)" },
        { value: "atopy", text: "아토피성 가려움 / 사료 알레르기 (피부 케어)" },
        { value: "obesity", text: "비만 / 췌장염 당뇨 식이조절 (체중 케어)" },
        { value: "ear", text: "외이도염 / 귓구멍 발적 (귀 건강)" },
        { value: "heart", text: "심장사상충 / 계절 면역 저하 (면역 케어)" }
    ],
    cat: [
        { value: "kidney", text: "만성 신부전증 / 요로 결석 (신장 요로)" },
        { value: "hairball", text: "헤어볼 배출 장애 / 거대결장 변비 (장 건강)" },
        { value: "herpes", text: "허피스 감염 / 바이러스 결막염 (안구 면역)" },
        { value: "stomatitis", text: "칼리시 구내염 / 만성 치주염 (구강 케어)" },
        { value: "stress", text: "스트레스성 강박 오버그루밍 (행동 케어)" }
    ]
};

// --- 질환별 특화간식 처방 가이드 데이터 (신규 강아지/고양이 질환 추가) ---
const healthCareTimelineData = {
    "dog": {
        "joint": [
            { time: "오전 08:30 (아침 식사)", title: "체중 조절 및 관절 보강 습식 급여", desc: "체중 부하가 늘어나면 슬개골 탈구가 빠르게 악화되므로 저열량 다이어트 사료와 함께 소형견용 미끄럼 방지 식기 위치를 고정해 아침을 주세요." },
            { time: "오후 02:00 (낮 산책/간식)", title: "🦴 슬개골 튼튼 조인트 츄 1정 급여 및 평지 걷기", desc: "연골 콘드로이친 성분이 가득한 '슬개골 튼튼 조인트 츄'를 1개 급여하고 가벼운 평지 산책을 합니다. 계단 오르내리기나 점프는 금지해 주십시오." },
            { time: "오후 08:00 (저녁 안정)", title: "무릎 온찜질 및 뒷다리 허벅지 근육 마사지", desc: "무릎 관절 주변 근력을 강화하기 위해 따뜻한 스팀 타월로 온찜질을 한 뒤, 양 허벅지 근육 부위를 부드럽게 원을 그리며 마사지합니다." }
        ],
        "tear": [
            { time: "오전 09:00 (눈물 닦기)", title: "눈가 멸균 식염수 세정 및 눈가 보습", desc: "아침 눈물 자국을 마른 패드로 닦아내고 이염 부위를 전용 세정제로 닦아 유해 미생물 번식 및 악취를 미연에 예방해 줍니다." },
            { time: "오후 01:30 (안구 영양)", title: "👁️ 눈물 싹싹 빌베리 쌀쿠키 1~2정 보상", desc: "항산화 안토시아닌과 루테인이 든 '눈물 싹싹 빌베리 쌀쿠키'를 주어 눈 면역을 보호합니다. 글루텐 프리라 눈물 과다를 억제합니다." },
            { time: "오후 07:30 (실내 청정)", title: "공기 필터 환기 가동 및 안구 건조 방지 인공눈물", desc: "건조하고 먼지가 차면 눈물량이 늘어나므로 실내 습도를 50% 이상 유지해 주시고, 건조한 안구에 동물용 인공눈물을 한 방울 점안합니다." }
        ],
        "atopy": [
            { time: "오전 09:30 (식이 통제)", title: "가수분해 처방식 사료 급여 및 보습 분사", desc: "식이 알레르기를 원천 차단하기 위해 다른 간식은 끊고 가수분해 사료만 급여하며 건조해 가려운 부위에 안심 보습제를 분사해 줍니다." },
            { time: "오후 02:30 (피부 진정)", title: "🌱 가수분해 연어 아토피 바이트 보상", desc: "육류 성분이 일절 가미되지 않은 '가수분해 연어 아토피 바이트'를 급여해 피모 가려움증을 이완하고 노즈워크 놀이로 긁는 주의를 차단합니다." },
            { time: "오후 08:30 (귀/지간 케어)", title: "빨개진 귀 세정과 지간 발가락 건조", desc: "아토피로 붉어지기 쉬운 귓구멍 안쪽을 순한 클리너로 닦아주고, 발바닥 사이를 깨끗이 씻긴 뒤 털이 뭉치지 않게 찬바람으로 완전 건조합니다." }
        ],
        "obesity": [
            { time: "오전 08:00 (칼로리 제한)", title: "전자저울 기반 다이어트 사료 계량 급식", desc: "다이어트 전용 고단백 사료를 전자저울로 일일 한도 칼로리에 맞춰 소량만 정확하게 계량해 아침으로 제공합니다." },
            { time: "오후 04:00 (본능 놀이)", title: "🏃 저칼로리 곤약 닭가슴살 육포 및 터그 운동", desc: "단 2kcal의 '저칼로리 곤약 닭가슴살 육포'를 쪼개 놀이 보상으로 급여해 먹는 포만감 욕구를 채우고 15분간 적극적 장난감 놀이를 합니다." },
            { time: "오후 08:00 (유산소 산책)", title: "체중 측정 및 야간 유산소 걷기 (40분)", desc: "몸무게 추이를 기록 관리하고 선선한 저녁에 최소 40분 이상 빠른 보폭으로 걸어 체지방 태우기를 직접 유도합니다." }
        ],
        "ear": [
            { time: "오전 09:00 (귀 관찰)", title: "귀 통풍을 위한 귀 뒤집어두기 및 가벼운 빗질", desc: "귀가 처진 품종은 통풍이 안 되어 귓병이 악화되므로 가볍게 귀를 뒤집어 공기를 통하게 해주고 주변 죽은 털을 정돈합니다." },
            { time: "오후 02:00 (면역 케어)", title: "👂 귓병 안심 오메가츄 급여", desc: "항균 및 지질 대사 향상을 돕는 카렌듈라와 오메가3가 함유된 '귀 안심 오메가츄'를 1정 급여해 외이염의 체내 발적 완화를 유도합니다." },
            { time: "오후 08:30 (귀 세정)", title: "무알코올 세정액 도포 및 조심스러운 마사지", desc: "귀 안에 클리너를 2~3방울 넣고 귀 뿌리를 조물조물 마사지한 뒤, 흘러나오는 귀지만 탈지면으로 부드럽게 닦고 면봉 사용은 절대 금합니다." }
        ],
        "heart": [
            { time: "오전 08:00 (심박 점검)", title: "체온 및 아침 안정 시 호흡수 측정", desc: "휴식 시 분당 호흡수를 체크하여 심폐 부하가 없는지 확인하고, 나트륨 수치를 억제한 무염 심장 보호용 사료를 배식합니다." },
            { time: "오후 03:00 (에너지 보강)", title: "❤️ 초록입홍합 트릿 급여 및 저강도 산책", desc: "심장에 활력을 가해주는 코엔자임 Q10이 배합된 '초록입홍합 트릿'을 급여하고 시원한 그늘 밑에서 가볍게 10분만 걷는 유산소 산책을 가집니다." },
            { time: "오후 09:00 (숙면 관리)", title: "실내 온도 시원하게(23도) 유지 및 숙면 유도", desc: "심장 혈관에 압박을 주지 않도록 실내 온도를 선선하게 맞춰주시고 전면 안락한 쿠션에서 스트레스 없이 푹 잠들게 돌봅니다." }
        ]
    },
    "cat": {
        "kidney": [
            { time: "오전 08:00 (흐르는 물 교체)", title: "세라믹 무선 정수기 세척 및 냉수 주입", desc: "고양이가 음수 갈증을 해소하도록 폭포식 세라믹 정수기의 필터와 수조를 매일 씻고, 신선한 정제 얼음물을 채워 흥미를 높입니다." },
            { time: "오후 03:00 (신부전 관리)", title: "💧 안심 신장 케어 크랜베리 퓨레 1포 급여", desc: "인의 흡수를 방지하도록 저인 수치로 완성한 '신장 케어 크랜베리 퓨레' 1포를 짜 주거나 식수에 풀어서 급수량을 상승시킵니다." },
            { time: "오후 09:30 (배뇨 체크)", title: "모래 화장실 감자(소변 덩어리) 계량 측정", desc: "매일 화장실 모래를 확인해 배뇨 감자가 3개 이상 균일한 직경(5cm 내외)으로 생성되었는지 면밀히 검사해 하부 요로 폐색을 예방합니다." }
        ],
        "hairball": [
            { time: "오전 09:00 (그루밍 방지)", title: "실리콘 빗으로 전신 털 정리(헤어볼 제거)", desc: "그루밍 중 입에 걸려 삼키는 털 양을 획기적으로 줄여주도록 부드러운 죽은 털 빗으로 전신을 브러싱해 줍니다." },
            { time: "오후 01:30 (식이섬유)", title: "🌾 캣그라스 츄어블 급여 및 사냥 유도", desc: "식이섬유가 모가 뭉치는 것을 방어하는 '헤어볼 쏙쏙 캣그라스 츄어블'을 보상으로 주어 위장의 자연스러운 소화 연동 운동을 유도합니다." },
            { time: "오후 08:00 (헤어볼 체크)", title: "헤어볼 배출제 소량 급여 및 소변/대변 점검", desc: "식욕부진을 일으키는 장내 모구를 녹이거나 배설하게 돕는 라사토 성분의 겔을 발이나 입 주변에 가볍게 도포해 핥아먹게 훈련합니다." }
        ],
        "herpes": [
            { time: "오전 08:30 (눈가 위생)", title: "결막 부종 점검 및 눈곱 청결 패드 케어", desc: "허피스 재발 시 눈이 붓고 눈곱이 차므로 멸균 식염수 솜으로 세게 밀지 않고 은은하게 쓸어내려 지저분한 눈물을 정돈합니다." },
            { time: "오후 02:00 (면역 항체)", title: "🧬 안구 면역 L-라이신 퓨레 1포 토핑", desc: "바이러스 복제를 방어하는 필수 성분인 'L-라이신 퓨레'를 1포 급여하여 면역 조절 및 눈가 발적 가라앉히기를 시도합니다." },
            { time: "오후 08:00 (안정 격리)", title: "실내 온도 보온 가동 및 스트레스 요인 제거", desc: "허피스는 추위와 급작스러운 주변 변화에 의해 자극받아 발현되므로 실내 보온을 조절하고 편안한 하우스 쉼터로 인도합니다." }
        ],
        "stomatitis": [
            { time: "오전 09:00 (구강 체크)", title: "잇몸 발적 및 붉은 라인 충혈 모니터링", desc: "침 흘림이나 구취가 생기는지 보고, 딱딱한 건사료는 잇몸 출혈을 일으키므로 따뜻한 물에 불리거나 완전 습식 무자극 캔으로 급여합니다." },
            { time: "오후 03:00 (잇몸 면역)", title: "🦷 락토페린 안심 덴탈가루 잇몸 도포", desc: "천연 항염 물질인 '락토페린 덴탈가루'를 따뜻한 온수 1방울에 개어 잇몸 주변 빨갛게 부은 곳에 부드럽게 발라 흡수를 돕습니다." },
            { time: "오후 09:00 (덴탈 브러시)", title: "어린이용 미세모 혹은 거즈를 활용한 무자극 양치", desc: "잇몸 상처가 나지 않도록 유아용 칫솔로 가볍게 잔여 치태만 제거하고 고양이용 치주 안심 겔을 도포해 줍니다." }
        ],
        "stress": [
            { time: "오전 10:00 (영역 안정)", title: "펠리웨이 안심 페로몬 스플레이 가동 및 환기", desc: "냥이가 낯선 냄새로 불안해하지 않게 영역 고정 페로몬 디퓨저를 켜주고 편안한 수직 캣폴 위치를 보강해 줍니다." },
            { time: "오후 04:00 (긴장 이완)", title: "🌿 힐링 캣닙 라벤더 안심 츄 1정 보상", desc: "신경 안정 성분과 개박하 천연 향이 든 '캣닙 라벤더 안심 츄'를 1개 주어 낯선 소음으로부터 심신 릴랙스를 돕고 긴장 오버그루밍을 예방합니다." },
            { time: "오후 08:00 (사냥 놀이)", title: "10분 낚싯대 놀이로 야생성 방출 및 포만 습식", desc: "지루함에 발이나 배를 심하게 그루밍하지 않도록 강박 해소용 낚싯대 사냥 놀이로 에너지를 소진시킨 후 좋아하는 간식을 배불리 줍니다." }
        ]
    }
};

// --- 전역 상태 및 UI 엘리먼트 ---
let currentUser = null;
let cart = [];
let currentMainFilter = 'dog';
let currentSubFilter = 'all';

// DOM 엘리먼트 캐싱
const elements = {
    authNav: document.getElementById('auth-nav'),
    userBadge: document.getElementById('user-badge'),
    userAvatar: document.getElementById('user-avatar'),
    userNameSpan: document.getElementById('user-name-span'),
    btnLogin: document.getElementById('btn-login'),
    dropdownTrigger: document.getElementById('btn-user-dropdown'),
    dropdownMenu: document.getElementById('user-dropdown-menu'),
    dropdownMyInfo: document.getElementById('dropdown-my-info'),
    dropdownSavedPlanner: document.getElementById('dropdown-saved-planner'),
    dropdownAdminPanel: document.getElementById('dropdown-admin-panel'), // 신규 관리자 메뉴
    dropdownLogout: document.getElementById('dropdown-logout'),
    dropdownDeleteAccount: document.getElementById('dropdown-delete-account'),
    
    modalOverlay: document.getElementById('modal-overlay'),
    modalClose: document.getElementById('modal-close'),
    
    tabLogin: document.getElementById('tab-login'),
    tabSignUp: document.getElementById('tab-signup'),
    tabFindId: document.getElementById('tab-findid'),
    tabMyPage: document.getElementById('tab-mypage-view'),
    tabChangePassword: document.getElementById('tab-change-password'),
    tabFindPw: document.getElementById('tab-findpw'),
    tabCart: document.getElementById('tab-cart'),
    tabAdmin: document.getElementById('tab-admin'), // 신규 관리자 탭
    
    formLogin: document.getElementById('form-login'),
    formSignUp: document.getElementById('form-signup'),
    formFindId: document.getElementById('form-findid'),
    formChangePassword: document.getElementById('form-change-password'),
    formFindPw: document.getElementById('form-findpw'),
    formAdminProduct: document.getElementById('form-admin-product'), // 신규 관리자 폼
    
    signupPassword: document.getElementById('signup-password'),
    signupPasswordConfirm: document.getElementById('signup-password-confirm'),
    
    linkToSignUp: document.getElementById('link-to-signup'),
    linkToLogin: document.getElementById('link-to-login'),
    linkToFindId: document.getElementById('link-to-findid'),
    linkFindIdToLogin: document.getElementById('link-findid-to-login'),
    linkChangePassword: document.getElementById('link-change-password'),
    linkBackToProfile: document.getElementById('link-back-to-profile'),
    linkToFindPw: document.getElementById('link-to-findpw'),
    linkFindPwToLogin: document.getElementById('link-findpw-to-login'),
    
    profileEmail: document.getElementById('profile-email'),
    profileName: document.getElementById('profile-name'),
    profilePhone: document.getElementById('profile-phone'),
    
    btnDeleteAccount: document.getElementById('btn-delete-account'),
    toastContainer: document.getElementById('toast-container'),
    
    btnFloatingCart: document.getElementById('btn-floating-cart'),
    cartCountBadge: document.getElementById('cart-count-badge'),
    cartItemsList: document.getElementById('cart-items-list'),
    cartTotalAmount: document.getElementById('cart-total-amount'),
    btnCartCheckout: document.getElementById('btn-cart-checkout'),
    btnCartClear: document.getElementById('btn-cart-clear'),
    
    productGrid: document.getElementById('product-grid'),
    mainFilterBtns: document.querySelectorAll('.main-filter-btn'),
    subFilterContainer: document.getElementById('sub-filter-container'),
    
    // 영양처방 (신규 세부 품종 셀렉트 포함)
    plannerPetType: document.getElementById('planner-pet-type'),
    plannerBreedType: document.getElementById('planner-breed-type'),
    plannerDiseaseType: document.getElementById('planner-disease-type'),
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
        <button class="toast-close" aria-label="닫기">&times;</button>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// --- 모달 제어 함수 ---
function openModal(tabElement) {
    [
        elements.tabLogin, elements.tabSignUp, elements.tabFindId, 
        elements.tabMyPage, elements.tabChangePassword, elements.tabFindPw, 
        elements.tabCart, elements.tabAdmin
    ].forEach(tab => {
        if(tab) {
            tab.classList.add('hidden');
            tab.classList.remove('active');
        }
    });
    
    tabElement.classList.remove('hidden');
    tabElement.classList.add('active');
    elements.modalOverlay.classList.add('active');
}

function closeModal() {
    elements.modalOverlay.classList.remove('active');
}

// --- 로그인 상태에 따른 UI 업데이트 (관리자 권한 포함) ---
async function updateAuthUI() {
    try {
        currentUser = await getCurrentUserProfile();
        if (currentUser) {
            elements.btnLogin.classList.add('hidden');
            elements.userBadge.classList.remove('hidden');
            elements.userNameSpan.textContent = currentUser.username || currentUser.email;
            elements.userAvatar.textContent = (currentUser.username || currentUser.email).charAt(0).toUpperCase();
            
            // 관리자 계정 판별 (admin@petplanet.co.kr 이메일이거나 role meta가 admin인 경우)
            const isAdmin = currentUser.email === 'admin@petplanet.co.kr' || currentUser.role === 'admin';
            if (isAdmin) {
                elements.dropdownAdminPanel.classList.remove('hidden');
            } else {
                elements.dropdownAdminPanel.classList.add('hidden');
            }
        } else {
            elements.btnLogin.classList.remove('hidden');
            elements.userBadge.classList.add('hidden');
            elements.dropdownAdminPanel.classList.add('hidden');
            currentUser = null;
        }
        renderFilteredProducts();
    } catch (err) {
        console.error('인증 UI 업데이트 실패:', err);
        elements.btnLogin.classList.remove('hidden');
        elements.userBadge.classList.add('hidden');
        elements.dropdownAdminPanel.classList.add('hidden');
        currentUser = null;
        renderFilteredProducts();
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
    
    if (password !== confirm) {
        showToast('입력하신 비밀번호가 서로 일치하지 않습니다.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('비밀번호는 보안상 최소 6자리 이상이어야 합니다.', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner"></span> 가입 처리 중...`;
    
    try {
        // 특정 이메일 가입 시 관리자 역할 자동 탑재 시뮬레이션
        const metadata = {};
        if (email === 'admin@petplanet.co.kr') {
            metadata.role = 'admin';
        }
        await signUp(email, password, name, phone, metadata);
        showToast('회원가입이 완료되었습니다! 가입하신 정보로 로그인 해주세요.', 'success');
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
    submitBtn.innerHTML = `<span class="spinner"></span> 인증 중...`;
    
    try {
        await signIn(email, password);
        const profile = await getCurrentUserProfile();
        const displayName = profile ? (profile.username || profile.email) : email;
        showToast(`🎉 ${displayName} 보호자님, 안전하게 로그인되었습니다!`, 'success');
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
    submitBtn.innerHTML = `<span class="spinner"></span> 검색 중...`;
    
    try {
        const email = await findEmail(name, phone);
        resultDiv.classList.remove('hidden');
        if (email) {
            emailSpan.textContent = email;
            showToast('성함과 번호에 일치하는 이메일을 조회했습니다.', 'success');
        } else {
            emailSpan.textContent = '일치하는 가입 정보가 존재하지 않습니다.';
            showToast('조회 결과가 존재하지 않습니다.', 'error');
        }
    } catch (err) {
        showToast(`아이디 조회 오류: ${err.message}`, 'error');
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
    submitBtn.innerHTML = `<span class="spinner"></span> 초기화 처리 중...`;
    
    try {
        const success = await resetPasswordByIdentity(email, name, phone, newPassword);
        if (success) {
            showToast('🎉 비밀번호 재설정이 안전하게 처리되었습니다. 새 비밀번호로 로그인해주세요.', 'success');
            e.target.reset();
            openModal(elements.tabLogin);
        } else {
            showToast('입력하신 계정의 보호자 식별 정보가 올바르지 않습니다.', 'error');
        }
    } catch (err) {
        showToast(`비밀번호 초기화 실패: ${err.message}`, 'error');
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
        showToast('새 비밀번호 재입력 확인 정보가 서로 맞지 않습니다.', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showToast('안전을 위해 최소 6자리 이상의 번호로 지정해 주세요.', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner"></span> 변경 중...`;
    
    try {
        await updatePassword(newPassword);
        showToast('비밀번호 변경이 정상 완료되었습니다.', 'success');
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
    if (!confirm('정말로 탈퇴하시겠습니까?\n탈퇴 시 보호자님의 펫 데이터와 주문 내역이 즉각 물리 삭제되며 영구 소실됩니다.')) {
        return;
    }
    
    elements.btnDeleteAccount.disabled = true;
    elements.btnDeleteAccount.innerHTML = `<span class="spinner"></span> 회원 탈퇴 처리 중...`;
    
    try {
        await deleteAccount();
        showToast('회원 탈퇴 및 계정 정리가 성공적으로 수행되었습니다.', 'success');
        closeModal();
        await updateAuthUI();
    } catch (err) {
        showToast(`탈퇴 처리 중 에러 발생: ${err.message}`, 'error');
        elements.btnDeleteAccount.disabled = false;
        elements.btnDeleteAccount.innerHTML = '회원 탈퇴하기';
    }
}

// --- 관리자 신규 상품 등록 제출 핸들러 ---
async function handleAdminProductSubmit(e) {
    e.preventDefault();
    
    const category = document.getElementById('admin-category').value;
    const subCategory = document.getElementById('admin-subcategory').value;
    const name = document.getElementById('admin-product-name').value.trim();
    const desc = document.getElementById('admin-desc').value.trim();
    const originalPrice = Number(document.getElementById('admin-original-price').value);
    const discountRate = Number(document.getElementById('admin-discount-rate').value);
    const target = document.getElementById('admin-target').value.trim();
    const delivery = document.getElementById('admin-delivery').value;
    const tip = document.getElementById('admin-tip').value.trim();
    
    const price = Math.round(originalPrice * (1 - discountRate / 100));
    
    let subCategoryName = "반려 용품";
    if (subCategory === 'bowl') subCategoryName = "식기/물그릇";
    else if (subCategory === 'harness') subCategoryName = "목줄/하네스";
    else if (subCategory === 'tag') subCategoryName = "인식표";
    else if (subCategory === 'muzzle') subCategoryName = "입마개";
    else if (subCategory === 'clothes') subCategoryName = "의류";
    else if (subCategory === 'snack') subCategoryName = "질환 특화간식";

    let svg = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="30" fill="var(--primary)" opacity="0.8"/>
                <text x="35" y="58" fill="white" font-size="24" font-weight="900">NEW</text>
              </svg>`;
    let bg = "linear-gradient(135deg, #f7ece2, #e8d0bd)";
    
    if (category === 'cat') {
        bg = "linear-gradient(135deg, #fff0e6, #ffd1b3)";
    } else if (category === 'snack') {
        bg = "linear-gradient(135deg, #fbf0e1, #f5dfc1)";
        svg = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="25" y="35" width="50" height="30" rx="6" fill="var(--accent)"/>
                <text x="32" y="56" fill="white" font-size="18" font-weight="900">TREAT</text>
              </svg>`;
    }

    const newProduct = {
        id: `prod-${Date.now()}`,
        category,
        subCategory,
        subCategoryName,
        name,
        desc,
        originalPrice,
        discountRate,
        price,
        rating: 5.0,
        reviews: 0,
        tip,
        target,
        delivery,
        bg,
        svg
    };

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner"></span> 데이터베이스 저장 중...`;

    try {
        await insertProduct(newProduct);
        showToast('🎉 상품이 Supabase 클라우드 데이터베이스 및 메인 카탈로그에 성공적으로 저장되었습니다.', 'success');
    } catch (err) {
        console.warn('Supabase 저장 실패 (로컬 메모리에만 일시 보관):', err.message);
        showToast('데이터베이스에 상품 등록이 거부되었습니다. (로컬 메모리 반영)', 'info');
    } finally {
        productsData.unshift(newProduct);
        renderFilteredProducts();
        
        e.target.reset();
        closeModal();
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// --- 상품 상세 보기 클릭 시 동작 ---
function handleProductDetailClick(productId) {
    localStorage.setItem('pet_planet_active_products', JSON.stringify(productsData));
    const url = `product-detail.html?product=${encodeURIComponent(productId)}`;
    window.open(url, '_blank');
}

// --- 2차 소분류 칩 동적 렌더링 로직 ---
function renderSubFilterChips(mainCategory) {
    elements.subFilterContainer.innerHTML = '';
    const chips = subCategoriesMap[mainCategory] || [];
    
    chips.forEach(chip => {
        const btn = document.createElement('button');
        btn.className = `sub-filter-btn ${chip.id === currentSubFilter ? 'active' : ''}`;
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', chip.id === currentSubFilter ? 'true' : 'false');
        btn.textContent = chip.name;
        btn.setAttribute('data-sub-filter', chip.id);
        
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sub-filter-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            
            currentSubFilter = chip.id;
            renderFilteredProducts();
        });
        
        elements.subFilterContainer.appendChild(btn);
    });
}

// --- 이중 필터 기반 상품 렌더링 로직 ---
function renderFilteredProducts() {
    elements.productGrid.innerHTML = '';
    
    const filtered = productsData.filter(p => {
        const matchMain = (p.category === currentMainFilter) || (p.category === 'snack');
        
        let matchSub = false;
        if (currentSubFilter === 'all') {
            matchSub = true;
        } else if (currentSubFilter === 'snack') {
            matchSub = (p.category === 'snack');
        } else {
            matchSub = (p.subCategory === currentSubFilter) && (p.category !== 'snack');
        }
        
        return matchMain && matchSub;
    });
    
    if (filtered.length === 0) {
        elements.productGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted); font-weight: 700;">해당 분류에 등록된 인기 상품이 현재 준비 중입니다.</div>`;
        return;
    }
    
    const isAdmin = currentUser && (currentUser.email === 'admin@petplanet.co.kr' || currentUser.role === 'admin');
    
    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'tour-card';
        if (p.featured) card.setAttribute('data-variant', 'featured');
        if (p.isSoldOut) card.classList.add('sold-out');
        
        const starHTML = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 !== 0 ? '☆' : '');
        
        // 품절 시 뱃지 및 버튼 비활성화 분기 처리
        const soldOutBadge = p.isSoldOut ? `<span class="p-badge soldout" style="background: var(--error); color: white;">품절</span>` : '';
        const cartButtonDisabled = p.isSoldOut ? 'disabled style="flex: 1.2; font-size: 0.8rem; padding: 0.5rem; opacity: 0.6; cursor: not-allowed;"' : 'style="flex: 1.2; font-size: 0.8rem; padding: 0.5rem;"';
        const cartButtonText = p.isSoldOut ? '품절 🚫' : '장바구니 🛒';
        
        // 어드민 액션 버튼 추가
        let adminActionsHTML = '';
        if (isAdmin) {
            adminActionsHTML = `
                <div class="admin-card-actions" style="display: flex; gap: 0.5rem; width: 100%; margin-top: 0.5rem; border-top: 1px dashed var(--border-color); padding-top: 0.5rem; pointer-events: auto;">
                    <button class="btn btn-admin-soldout" style="flex: 1; font-size: 0.75rem; padding: 0.35rem 0.5rem; background: var(--warning); color: var(--text-dark); cursor: pointer; border: none; border-radius: var(--radius-sm);" data-id="${p.id}">
                        ${p.isSoldOut ? '🟢 판매재개' : '🔴 품절처리'}
                    </button>
                    <button class="btn btn-admin-delete" style="flex: 1; font-size: 0.75rem; padding: 0.35rem 0.5rem; background: var(--error); color: white; cursor: pointer; border: none; border-radius: var(--radius-sm);" data-id="${p.id}">
                        🗑️ 삭제
                    </button>
                </div>
            `;
        }
        
        card.innerHTML = `
            <div class="product-badges">
                ${p.featured ? `<span class="p-badge best">인기</span>` : ''}
                ${p.discountRate > 0 ? `<span class="p-badge discount">${p.discountRate}% 세일</span>` : ''}
                ${p.category === 'snack' ? `<span class="p-badge organic">특화처방</span>` : ''}
                ${soldOutBadge}
            </div>
            <div class="tour-img-container" style="${p.isSoldOut ? 'filter: grayscale(1) opacity(0.5);' : ''}">
                ${p.svg}
            </div>
            <div class="tour-info">
                <span class="tour-tag">${p.subCategoryName}</span>
                <h3 class="tour-name">${p.name}</h3>
                
                <div class="product-rating">
                    <span class="rating-stars">${starHTML}</span>
                    <span>${p.rating} (${p.reviews}개 리뷰)</span>
                </div>
                
                <p class="tour-desc">${p.desc}</p>
                
                <div class="price-container">
                    <div class="original-price-row">
                        <span>${p.originalPrice.toLocaleString()}원</span>
                        <span class="delivery-badge">${p.delivery}</span>
                    </div>
                    <div class="current-price-row">
                        <span class="discount-rate">${p.discountRate}%</span>
                        <span class="current-price">${p.price.toLocaleString()}원</span>
                    </div>
                </div>
                
                <div style="display: flex; gap: 0.5rem; width: 100%;">
                    <button class="btn btn-detail" data-variant="secondary" data-size="sm" style="flex: 1; font-size: 0.8rem; padding: 0.5rem;" data-id="${p.id}">🔍 상세 정보</button>
                    <button class="btn btn-add-cart" data-variant="primary" data-size="sm" ${cartButtonDisabled} data-id="${p.id}">${cartButtonText}</button>
                </div>
                ${adminActionsHTML}
            </div>
        `;
        
        card.querySelector('.btn-detail').addEventListener('click', () => handleProductDetailClick(p.id));
        if (!p.isSoldOut) {
            card.querySelector('.btn-add-cart').addEventListener('click', () => addToCart(p.id));
        }
        
        if (isAdmin) {
            card.querySelector('.btn-admin-soldout').addEventListener('click', (e) => {
                e.stopPropagation();
                handleAdminToggleSoldOut(p.id, !p.isSoldOut);
            });
            card.querySelector('.btn-admin-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                handleAdminDeleteProduct(p.id);
            });
        }
        
        elements.productGrid.appendChild(card);
    });
}

// --- 관리자 상품 삭제 핸들러 ---
async function handleAdminDeleteProduct(id) {
    if (!confirm('정말로 이 상품을 삭제하시겠습니까? 데이터베이스에서 완전히 삭제됩니다.')) return;
    
    try {
        await deleteProduct(id);
        showToast('🗑️ 상품이 성공적으로 삭제되었습니다.', 'success');
        
        // 로컬 productsData 배열에서도 제거
        productsData = productsData.filter(p => p.id !== id);
        renderFilteredProducts();
    } catch (err) {
        console.error('상품 삭제 실패:', err);
        showToast(`❌ 상품 삭제 실패: ${err.message}`, 'error');
    }
}

// --- 관리자 상품 품절상태 토글 핸들러 ---
async function handleAdminToggleSoldOut(id, targetSoldOutState) {
    try {
        await toggleProductSoldOut(id, targetSoldOutState);
        showToast(targetSoldOutState ? '🚫 상품이 품절 처리되었습니다.' : '🟢 상품 판매가 재개되었습니다.', 'success');
        
        // 로컬 productsData 배열의 상태 갱신
        const prod = productsData.find(p => p.id === id);
        if (prod) {
            prod.isSoldOut = targetSoldOutState;
        }
        renderFilteredProducts();
    } catch (err) {
        console.error('품절 상태 업데이트 실패:', err);
        showToast(`❌ 상태 업데이트 실패: ${err.message}`, 'error');
    }
}

// --- 반려동물 종류에 맞춰 세부 품종 및 건강 고민 동적 로딩 ---
function handlePetTypeChange() {
    const petType = elements.plannerPetType.value;
    
    // 1. 세부 품종 셀렉트 박스 갱신
    elements.plannerBreedType.innerHTML = '';
    const breeds = breedOptionsMap[petType] || [];
    breeds.forEach(b => {
        const option = document.createElement('option');
        option.value = b.value;
        option.textContent = b.text;
        elements.plannerBreedType.appendChild(option);
    });
    
    // 2. 건강 고민 셀렉트 박스 갱신
    elements.plannerDiseaseType.innerHTML = '';
    const diseases = diseaseOptionsMap[petType] || [];
    diseases.forEach(d => {
        const option = document.createElement('option');
        option.value = d.value;
        option.textContent = d.text;
        elements.plannerDiseaseType.appendChild(option);
    });
}

// --- 장바구니 로직 구현 ---
function loadCart() {
    const saved = localStorage.getItem('pet_planet_cart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (e) {
            cart = [];
        }
    }
    updateCartBadge();
}

function saveCart() {
    localStorage.setItem('pet_planet_cart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    elements.cartCountBadge.textContent = totalCount;
    if (totalCount > 0) {
        elements.cartCountBadge.classList.remove('hidden');
    } else {
        elements.cartCountBadge.classList.add('hidden');
    }
}

function addToCart(productId, quantity = 1) {
    const existing = cart.find(item => item.productId === productId);
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ productId, quantity });
    }
    
    saveCart();
    showToast(`🛒 장바구니에 "${product.name}"이(가) 추가되었습니다.`, 'success');
}

function updateCartItemQty(productId, delta) {
    const item = cart.find(i => i.productId === productId);
    if (!item) return;
    
    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.productId !== productId);
    }
    saveCart();
    renderCart();
}

function deleteCartItem(productId) {
    cart = cart.filter(i => i.productId !== productId);
    saveCart();
    renderCart();
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm('현재 장바구니에 담긴 물품을 모두 비우시겠습니까?')) {
        cart = [];
        saveCart();
        renderCart();
        showToast('장바구니가 깨끗하게 비워졌습니다.', 'info');
    }
}

function renderCart() {
    elements.cartItemsList.innerHTML = '';
    let totalAmount = 0;
    
    if (cart.length === 0) {
        elements.cartItemsList.innerHTML = `<div class="empty-cart-msg">🛒 담긴 물건이 현재 존재하지 않습니다.<br>영양만점 펫 용품을 장바구니에 채워보세요!</div>`;
        elements.cartTotalAmount.textContent = '0원';
        return;
    }
    
    cart.forEach(item => {
        const product = productsData.find(p => p.id === item.productId);
        if (!product) return;
        
        const subtotal = product.price * item.quantity;
        totalAmount += subtotal;
        
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-name">${product.name}</span>
                <span class="cart-item-price">${product.price.toLocaleString()}원</span>
            </div>
            <div class="cart-item-controls">
                <button class="cart-qty-btn btn-qty-minus">-</button>
                <span class="cart-qty-val">${item.quantity}</span>
                <button class="cart-qty-btn btn-qty-plus">+</button>
                <button class="cart-item-delete btn-del" aria-label="아이템 제거">🗑️</button>
            </div>
        `;
        
        cartItemDiv.querySelector('.btn-qty-minus').addEventListener('click', () => updateCartItemQty(product.id, -1));
        cartItemDiv.querySelector('.btn-qty-plus').addEventListener('click', () => updateCartItemQty(product.id, 1));
        cartItemDiv.querySelector('.btn-del').addEventListener('click', () => deleteCartItem(product.id));
        
        elements.cartItemsList.appendChild(cartItemDiv);
    });
    
    elements.cartTotalAmount.textContent = `${totalAmount.toLocaleString()}원`;
}

// --- 질환별 특화간식 처방 및 가이드 생성 로직 ---
function generateHealthReport() {
    const petType = elements.plannerPetType.value;
    const breed = elements.plannerBreedType.value;
    const disease = elements.plannerDiseaseType.value;
    
    const petTypeText = elements.plannerPetType.options[elements.plannerPetType.selectedIndex].text;
    const breedText = elements.plannerBreedType.options[elements.plannerBreedType.selectedIndex].text;
    const diseaseText = elements.plannerDiseaseType.options[elements.plannerDiseaseType.selectedIndex].text;
    
    const timeline = healthCareTimelineData[petType]?.[disease];
    if (!timeline) {
        showToast('영양 처방 데이터를 생성하는 중 에러가 생겼습니다.', 'error');
        return;
    }
    
    elements.resultBadge.textContent = `${breedText} (${petTypeText}) • ${diseaseText}`;
    elements.timelineContainer.innerHTML = '';
    
    timeline.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'timeline-item';
        
        let matchingSnackId = null;
        if (disease === 'joint') matchingSnackId = 'snack-joint-1';
        else if (disease === 'tear') matchingSnackId = 'snack-tear-1';
        else if (disease === 'kidney') matchingSnackId = 'snack-kidney-1';
        else if (disease === 'atopy') matchingSnackId = 'snack-atopy-1';
        else if (disease === 'obesity') matchingSnackId = 'snack-obesity-1';
        else if (disease === 'ear') matchingSnackId = 'snack-ear-1';
        else if (disease === 'heart') matchingSnackId = 'snack-heart-1';
        else if (disease === 'hairball') matchingSnackId = 'snack-hairball-1';
        else if (disease === 'herpes') matchingSnackId = 'snack-herpes-1';
        else if (disease === 'stomatitis') matchingSnackId = 'snack-stomatitis-1';
        else if (disease === 'stress') matchingSnackId = 'snack-stress-1';
        
        const matchingProduct = productsData.find(p => p.id === matchingSnackId);
        
        itemDiv.innerHTML = `
            <div class="timeline-badge">${index + 1}</div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <span class="timeline-time">${item.time}</span>
                    <h4 class="timeline-title">${item.title}</h4>
                </div>
                <p class="timeline-desc">${item.desc}</p>
                ${index === 1 && matchingProduct ? `
                    <div style="margin-top: 1rem; padding: 0.85rem; background: var(--bg-base); border: 1px solid var(--border-color); border-radius: var(--radius-sm); display: flex; align-items: center; gap: 0.75rem; justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="font-size: 1.25rem;">💊</span>
                            <div>
                                <strong style="font-size: 0.82rem; display: block; color: var(--text-main);">${matchingProduct.name}</strong>
                                <span style="font-size: 0.75rem; color: var(--accent); font-weight: 700;">처방 특화간식 혜택가: ${matchingProduct.price.toLocaleString()}원</span>
                            </div>
                        </div>
                        <button class="btn btn-timeline-add" data-variant="primary" data-size="sm" style="font-size: 0.72rem; padding: 0.35rem 0.7rem; border-radius: 4px; font-weight:700;">장바구니 담기</button>
                    </div>
                ` : ''}
            </div>
        `;
        
        if (index === 1 && matchingProduct) {
            itemDiv.querySelector('.btn-timeline-add').addEventListener('click', () => addToCart(matchingProduct.id));
        }
        
        elements.timelineContainer.appendChild(itemDiv);
    });
    
    elements.plannerResult.classList.remove('hidden');
    elements.plannerResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast(`✨ ${breedText} 보호자님, 분석 보고서가 생성되었습니다!`, 'success');
}

// --- Supabase 인증 상태 변경 감지 ---
function setupAuthListener() {
    if (!supabase) return;
    
    supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('인증 세션 변경:', event);
        await updateAuthUI();
    });
}

// --- Supabase 상품 데이터 로드 및 결합 ---
async function loadSupabaseProducts() {
    try {
        const dbProducts = await fetchProducts();
        if (dbProducts && dbProducts.length > 0) {
            const dbIds = dbProducts.map(p => p.id);
            // DB에 등록된 상품은 DB 정보(품절 여부 포함)로 최신화하고, DB에 없는 로컬 데이터셋만 남겨서 합칩니다.
            const remainingLocal = productsData.filter(p => !dbIds.includes(p.id));
            productsData = [...dbProducts, ...remainingLocal];
            renderFilteredProducts();
        }
    } catch (e) {
        console.warn('데이터베이스 상품 병합 실패:', e);
    }
}

// --- 초기화 이벤트 리스너 등록 ---
document.addEventListener('DOMContentLoaded', async () => {
    renderSubFilterChips(currentMainFilter);
    renderFilteredProducts();
    loadCart();
    
    await loadSupabaseProducts();
    await updateAuthUI();
    setupAuthListener();
    
    elements.btnLogin.addEventListener('click', () => openModal(elements.tabLogin));
    elements.modalClose.addEventListener('click', closeModal);
    elements.modalOverlay.addEventListener('click', (e) => {
        if (e.target === elements.modalOverlay) closeModal();
    });
    
    elements.btnFloatingCart.addEventListener('click', () => {
        renderCart();
        openModal(elements.tabCart);
    });
    
    elements.linkToSignUp.addEventListener('click', () => openModal(elements.tabSignUp));
    elements.linkToLogin.addEventListener('click', () => openModal(elements.tabLogin));
    elements.linkToFindId.addEventListener('click', () => {
        document.getElementById('findid-result').classList.add('hidden');
        openModal(elements.tabFindId);
    });
    elements.linkFindIdToLogin.addEventListener('click', () => openModal(elements.tabLogin));
    elements.linkToFindPw.addEventListener('click', () => openModal(elements.tabFindPw));
    elements.linkFindPwToLogin.addEventListener('click', () => openModal(elements.tabLogin));
    
    elements.dropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.dropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        if (elements.dropdownMenu) elements.dropdownMenu.classList.remove('show');
    });

    elements.dropdownMyInfo.addEventListener('click', (e) => {
        e.preventDefault();
        elements.dropdownMenu.classList.remove('show');
        if (!currentUser) return;
        
        elements.profileEmail.textContent = currentUser.email;
        elements.profileName.textContent = currentUser.username;
        elements.profilePhone.textContent = currentUser.phone;
        
        openModal(elements.tabMyPage);
    });

    elements.dropdownSavedPlanner.addEventListener('click', (e) => {
        e.preventDefault();
        elements.dropdownMenu.classList.remove('show');
        
        const resultSection = document.getElementById('planner-result');
        if (resultSection && !resultSection.classList.contains('hidden')) {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            document.getElementById('specialty-snacks-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
            showToast('💾 저장된 건강 상태 리포트가 아직 존재하지 않습니다. 진단 폼을 먼저 작성하세요.', 'info');
        }
    });

    elements.dropdownAdminPanel.addEventListener('click', (e) => {
        e.preventDefault();
        elements.dropdownMenu.classList.remove('show');
        openModal(elements.tabAdmin);
    });

    elements.dropdownLogout.addEventListener('click', async (e) => {
        e.preventDefault();
        elements.dropdownMenu.classList.remove('show');
        try {
            await signOut();
            showToast('보호자 계정이 안전하게 로그아웃 처리되었습니다.', 'success');
            await updateAuthUI();
        } catch (err) {
            showToast(`로그아웃 에러: ${err.message}`, 'error');
        }
    });

    elements.dropdownDeleteAccount.addEventListener('click', (e) => {
        e.preventDefault();
        elements.dropdownMenu.classList.remove('show');
        handleDeleteAccountClick();
    });
    
    elements.linkChangePassword.addEventListener('click', () => openModal(elements.tabChangePassword));
    elements.linkBackToProfile.addEventListener('click', () => openModal(elements.tabMyPage));
    
    elements.formSignUp.addEventListener('submit', handleSignUpSubmit);
    elements.formLogin.addEventListener('submit', handleLoginSubmit);
    elements.formFindId.addEventListener('submit', handleFindIdSubmit);
    elements.formChangePassword.addEventListener('submit', handleChangePasswordSubmit);
    elements.formFindPw.addEventListener('submit', handleFindPwSubmit);
    
    elements.formAdminProduct.addEventListener('submit', handleAdminProductSubmit);
    
    elements.btnDeleteAccount.addEventListener('click', handleDeleteAccountClick);
    document.getElementById('btn-logout').addEventListener('click', async () => {
        try {
            await signOut();
            showToast('로그아웃 되었습니다.', 'success');
            closeModal();
            await updateAuthUI();
        } catch (err) {
            showToast(`로그아웃 오류: ${err.message}`, 'error');
        }
    });

    elements.btnCartClear.addEventListener('click', clearCart);
    elements.btnCartCheckout.addEventListener('click', () => {
        if (cart.length === 0) return;
        if (!currentUser) {
            showToast('주문 및 혜택가 결제를 위해 로그인이 필요합니다.', 'error');
            openModal(elements.tabLogin);
        } else {
            showToast('💳 테스트 카드 결제 승인이 완료되었습니다! 주문이 성공적으로 배송 처리됩니다.', 'success');
            cart = [];
            saveCart();
            renderCart();
            closeModal();
        }
    });

    elements.mainFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.mainFilterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            
            const selectedMain = btn.getAttribute('data-main-filter');
            currentMainFilter = selectedMain;
            currentSubFilter = 'all';
            
            renderSubFilterChips(selectedMain);
            renderFilteredProducts();
        });
    });

    elements.btnGenerateCourse.addEventListener('click', (e) => {
        e.preventDefault();
        generateHealthReport();
    });

    elements.btnSaveCourse.addEventListener('click', () => {
        if (!currentUser) {
            showToast('리포트 보관 및 저장을 위해 로그인이 선행되어야 합니다.', 'error');
            openModal(elements.tabLogin);
        } else {
            const petTypeText = elements.plannerPetType.options[elements.plannerPetType.selectedIndex].text;
            const breedText = elements.plannerBreedType.options[elements.plannerBreedType.selectedIndex].text;
            const diseaseText = elements.plannerDiseaseType.options[elements.plannerDiseaseType.selectedIndex].text;
            showToast(`🎉 "${breedText} (${petTypeText}) - ${diseaseText}" 건강 관리 리포트가 보호자님 계정 프로필에 안전하게 저장되었습니다!`, 'success');
        }
    });

    elements.plannerPetType.addEventListener('change', handlePetTypeChange);
    handlePetTypeChange();
});

export { productsData };
