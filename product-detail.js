// 상품 데이터셋 정의 (app.js와 완전히 일치하도록 할인율 및 원가 데이터 동기화)
const productsData = [
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
        category: "강아지 용품",
        subCategory: "bowl",
        subCategoryName: "식기/물그릇",
        name: "오가닉 세라믹 경사 밥그릇",
        desc: "척추와 관절에 무리를 주지 않는 15도 경사각 식기입니다. 묵직한 세라믹 소재로 밥을 먹을 때 밀림이 전혀 없습니다. 고온 가마에서 정밀하게 구워내 유해 성분이 검출되지 않는 친환경 도자기입니다.",
        originalPrice: 24000,
        discountRate: 20,
        price: 19200,
        tip: "그릇 부분이 분리되어 세척이 용이하며, 전자레인지 사용이 가능해 화식이나 습식 사료를 데워주기 편리합니다. 중성 식기 세제를 사용해 씻어주세요.",
        target: "소형 및 중형견 전 연령",
        delivery: "무료배송",
        bg: "linear-gradient(135deg, #fcece6, #f7d1c4)",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <ellipse cx="50" cy="65" rx="35" ry="20" fill="var(--primary)" opacity="0.8"/>
                <ellipse cx="50" cy="58" rx="35" ry="18" fill="#fff"/>
                <ellipse cx="50" cy="55" rx="28" ry="13" fill="#e6d5c3"/>
                <path d="M42,52 C45,55 55,55 58,52" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"/>
              </svg>`
    },
    {
        id: "dog-bowl-2",
        category: "강아지 용품",
        subCategory: "bowl",
        subCategoryName: "식기/물그릇",
        name: "순환 유도 무소음 정수기",
        desc: "물이 계속 흘러 반려견의 호기심을 유도하여 음수량을 늘려주는 무소음 분수 정수 물그릇입니다. 활성탄 및 이온수지 3중 필터 탑재로 상시 맑은 정수를 공급합니다.",
        originalPrice: 39000,
        discountRate: 10,
        price: 35100,
        tip: "모터 수명 향상과 깨끗한 수질을 위해 2주마다 필터를 세척하고 1달 주기로 필터 패드를 전면 교체해 주세요. 물이 모자라면 자동으로 전원이 차단됩니다.",
        target: "평소 물을 잘 마시지 않아 결석 위험이 있는 모든 강아지",
        delivery: "무료배송",
        bg: "linear-gradient(135deg, #e4f4fa, #c2e5f2)",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <rect x="25" y="40" width="50" height="38" rx="8" fill="var(--primary)" opacity="0.75"/>
                <ellipse cx="50" cy="40" rx="25" ry="10" fill="#a2daf0"/>
                <path d="M50,20 L50,35" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>
                <path d="M47,20 Q50,15 53,20" stroke="var(--accent)" stroke-width="2" fill="none"/>
              </svg>`
    },
    {
        id: "dog-collar-1",
        category: "강아지 용품",
        subCategory: "harness",
        subCategoryName: "목줄/하네스",
        name: "소프트 가죽 클래식 이니셜 목줄",
        desc: "부드럽고 튼튼한 이탈리아 천연 소가죽으로 제작되어 반려견 목 피부에 자극이 덜하고 쓸림이 없는 프리미엄 가죽 목줄입니다. 황동 버클 마감으로 클래식한 멋을 살렸습니다.",
        originalPrice: 30000,
        discountRate: 20,
        price: 24000,
        tip: "인식표 D링이 탑재되어 안전하게 인식표 펜던트를 걸 수 있으며, 수분 접촉 시 가죽 에센스로 가볍게 닦아 관리해 주세요. 물에 젖었을 땐 그늘에 건조하세요.",
        target: "모든 크기의 반려견 (S/M/L 사이즈 옵션 제공)",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #f5f0eb, #e3d3c4)",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <circle cx="50" cy="50" r="28" stroke="var(--accent)" stroke-width="6" fill="none"/>
                <circle cx="50" cy="78" r="8" fill="var(--accent)"/>
              </svg>`
    },
    {
        id: "dog-harness-1",
        category: "강아지 용품",
        subCategory: "harness",
        subCategoryName: "목줄/하네스",
        name: "메쉬 프리 컴포트 H형 하네스",
        desc: "산책 시 당김으로 인한 목과 기도의 압박을 골고루 분산시켜주는 안심 H형 에어메쉬 하네스입니다. 가벼운 중량으로 달리기나 활발한 산책에도 피부 마찰을 예방합니다.",
        originalPrice: 35000,
        discountRate: 15,
        price: 29750,
        tip: "버클이 등 위쪽에 배치되어 있어 강아지가 서 있는 상태에서 앞발을 끼울 필요 없이 머리만 넣어 쉽게 착용이 가능합니다. 사이즈 조절 끈을 이용해 딱 맞게 맞추세요.",
        target: "기관지 협착증이나 쓸개골 약화가 진행 중인 반려견",
        delivery: "무료배송",
        bg: "linear-gradient(135deg, #e3f5e9, #c3e8d2)",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <path d="M30,30 C30,70 70,70 70,30" stroke="var(--primary)" stroke-width="8" stroke-linecap="round" fill="none"/>
                <line x1="50" y1="48" x2="50" y2="80" stroke="var(--primary)" stroke-width="8" stroke-linecap="round"/>
                <rect x="45" y="70" width="10" height="10" fill="var(--accent)"/>
              </svg>`
    },
    {
        id: "dog-lead-1",
        category: "강아지 용품",
        subCategory: "harness",
        subCategoryName: "목줄/하네스",
        name: "안전 그립 원터치 자동 리드줄 (5m)",
        desc: "버튼 하나로 신속하게 줄 길이 조절 및 일시 정지가 가능한 신축식 자동 리드줄입니다. 인체공학적 고무 그립 적용으로 보호자의 손 피로와 미끄러짐을 미연에 예방해 줍니다.",
        originalPrice: 32000,
        discountRate: 15,
        price: 27200,
        tip: "비에 젖은 경우 줄을 끝까지 풀어낸 뒤 그늘에서 완전히 건조하여 내장 스프링이 부식되지 않게 관리하세요. 급작스럽게 당길 땐 락 버튼을 신속하게 꾹 누르십시오.",
        target: "산책 시 자유로운 반경 보장과 통제가 동시에 필요한 반려견",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #f7ece2, #e8d0bd)",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <rect x="25" y="30" width="45" height="40" rx="20" fill="var(--primary)" opacity="0.8"/>
                <rect x="52" y="42" width="22" height="16" rx="5" stroke="var(--primary)" stroke-width="6"/>
                <circle cx="38" cy="42" r="5" fill="var(--accent)"/>
              </svg>`
    },
    {
        id: "dog-tag-1",
        category: "강아지 용품",
        subCategory: "tag",
        subCategoryName: "인식표",
        name: "무소음 실리콘 맞춤형 이니셜 인식표",
        desc: "산책 중 짤랑거리는 쇠 부딪히는 소리 자극이 전혀 없으며, 하네스 줄에 딱 맞게 밀착되는 친환경 무독성 실리콘 맞춤 각인 인식표입니다. 물에 젖거나 오염되어도 물티슈로 슥 닦아낼 수 있습니다.",
        originalPrice: 15000,
        discountRate: 20,
        price: 12000,
        tip: "주문 시 비고란에 등록 번호, 견주 연락처, 반려동물 이름을 입력해 주시면 선명한 레이저 각인으로 제작됩니다. 실리콘 밴드가 넓어 하네스 끈에 쉽게 고정됩니다.",
        target: "소리에 예민하고 활발한 야외 활동을 선호하는 반려견",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #fff0f5, #ffd1df)",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <rect x="25" y="40" width="50" height="20" rx="8" fill="var(--accent)"/>
                <circle cx="35" cy="50" r="4" fill="white"/>
                <line x1="45" y1="50" x2="68" y2="50" stroke="white" stroke-width="3" stroke-linecap="round"/>
              </svg>`
    },
    {
        id: "dog-muzzle-1",
        category: "강아지 용품",
        subCategory: "muzzle",
        subCategoryName: "입마개",
        name: "통기성 쾌적 메쉬 안전 입마개",
        desc: "헐떡임과 가벼운 음수가 가능하도록 전면 바구니형 메쉬로 특수 디자인되어, 반려견의 콧등 호흡을 전혀 방해하지 않고 짖음이나 돌발적인 이물질 섭취, 물림 사고를 철저하게 방지합니다.",
        originalPrice: 22000,
        discountRate: 10,
        price: 19800,
        tip: "입마개를 처음 착용시킬 때는 맛있는 간식을 구멍 틈새로 급여하며 긍정적 각인을 시켜주는 연습을 하세요. 벨크로 끈을 이용해 뒤통수 부위를 단단히 고정하십시오.",
        target: "사회화 훈련 중이거나 짖음 및 입질 조절, 법정 맹견 지정 반려견",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #e3ecf5, #c3d5e8)",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <path d="M30,30 L60,40 L60,60 L30,55 Z" fill="none" stroke="var(--primary)" stroke-width="4"/>
                <path d="M40,33 L40,57 M50,37 L50,59" stroke="var(--primary)" stroke-width="2"/>
                <path d="M60,50 L85,45" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/>
              </svg>`
    },
    {
        id: "dog-clothes-1",
        category: "강아지 용품",
        subCategory: "clothes",
        subCategoryName: "의류",
        name: "파스텔 보들 보들 코튼 스트라이프 티",
        desc: "피부 알레르기를 예방하는 100% 오가닉 면사 원단으로 국내 공방에서 자체 제작하여 신축성이 아주 뛰어나고 부드러운 순면 스트라이프 실내 데일리 웨어입니다. 배 닿는 부위에 고무 밴드를 넣어 조이지 않습니다.",
        originalPrice: 20000,
        discountRate: 20,
        price: 16000,
        tip: "찬물 가벼운 중성세제 기계 세탁이 가능하며 수축을 예방하기 위해 건조기 사용보다는 자연 건조를 권장합니다. 다림질 시 저온을 유지하세요.",
        target: "미용 직후 보온이 필요하거나 아토피성 피부염으로 긁음 방지가 필요한 강아지",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #fffae6, #fff0b3)",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <path d="M35,30 L65,30 L75,75 L25,75 Z" fill="var(--primary)" opacity="0.8"/>
                <line x1="30" y1="45" x2="70" y2="45" stroke="var(--accent)" stroke-width="4"/>
                <line x1="27" y1="60" x2="73" y2="60" stroke="var(--accent)" stroke-width="4"/>
              </svg>`
    },

    // 2. 고양이 용품
    {
        id: "cat-bowl-1",
        category: "고양이 용품",
        subCategory: "bowl",
        subCategoryName: "식기/물그릇",
        name: "도자기 와이드 안심 턱드름 밥그릇",
        desc: "예민한 고양이 수염 피로(Whisker Fatigue)를 전면 방지하는 널찍하고 편평한 와이드 형태의 최고급 유기 도자기 안심 식기입니다. 턱 밑에 닿는 면적을 최소화하여 피부 자극을 방지합니다.",
        price: 21000,
        originalPrice: 28000,
        discountRate: 25,
        tip: "도자기 식기는 플라스틱 그릇과 달리 미세 스크래치가 생기지 않아 박테리아 증식을 차단하고 턱 주변 모낭염(턱드름)을 완벽히 방지해 줍니다.",
        target: "턱밑 피부가 예민하거나 수염이 그릇 벽면에 닿는 것을 극도로 싫어하는 묘체",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #fff0e6, #ffd1b3)",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <ellipse cx="50" cy="70" rx="38" ry="12" fill="var(--primary)" opacity="0.8"/>
                <ellipse cx="50" cy="65" rx="38" ry="10" fill="#fff"/>
                <circle cx="50" cy="63" r="4" fill="var(--accent)"/>
              </svg>`
    },
    {
        id: "cat-bowl-2",
        category: "고양이 용품",
        subCategory: "bowl",
        subCategoryName: "식기/물그릇",
        name: "폭포 분수 세라믹 무선 수중 정수기",
        desc: "고양이가 좋아하는 낙수형 폭포 물줄기를 재현하고 모터를 완전 무선 유도 전류식으로 설계하여 녹이나 전기 누전 위험이 전혀 없는 최고급 도자기 정수기입니다. 풍부한 산소를 공급하여 물맛을 높여줍니다.",
        price: 45000,
        originalPrice: 50000,
        discountRate: 10,
        tip: "세라믹 바디는 끓는 물 소독이 가능하여 주기적인 스팀 소독으로 물이끼나 균 번식을 완벽히 방지할 수 있습니다. 상단 분수 노즐은 솔로 가볍게 청소하세요.",
        target: "신부전증 예방 및 음수 유도가 필수적인 고양이 전체",
        delivery: "무료배송",
        bg: "linear-gradient(135deg, #e6f7ff, #b3e6ff)",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <ellipse cx="50" cy="65" rx="30" ry="25" fill="var(--primary)" opacity="0.75"/>
                <path d="M50,25 Q50,45 60,45" stroke="var(--accent)" stroke-width="4" fill="none" stroke-linecap="round"/>
                <ellipse cx="50" cy="45" rx="20" ry="5" fill="#a5d8f2"/>
              </svg>`
    },
    {
        id: "cat-collar-1",
        category: "고양이 용품",
        subCategory: "harness",
        subCategoryName: "목줄/하네스",
        name: "안전 탈출 스마트 버클 레더 목줄",
        desc: "장애물에 목줄이 걸려 매달렸을 때 일정 힘(3kg) 이상이 가해지면 버클이 자동으로 틱 소리와 함께 분리되어 목 졸림 및 질식을 예방해 주는 스마트 구조의 반려묘 전용 목줄입니다.",
        price: 18000,
        originalPrice: 24000,
        discountRate: 25,
        tip: "인식 펜던트와 가벼운 미니 방울이 기본 탑재되어 집안에서 고양이의 위치를 발걸음 소리로 조용히 알려줍니다. 방울 소리가 싫으시면 고리를 열어 떼어내시면 됩니다.",
        target: "수직 활동이 잦고 높은 싱크대나 문 위를 잘 오르는 실내 묘체",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #f0ebf5, #dfd3e8)",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <circle cx="50" cy="50" r="28" stroke="var(--primary)" stroke-width="6" fill="none"/>
                <circle cx="50" cy="78" r="8" fill="var(--accent)"/>
              </svg>`
    },
    {
        id: "cat-harness-1",
        category: "고양이 용품",
        subCategory: "harness",
        subCategoryName: "목줄/하네스",
        name: "스케입 프리 안심 랩 하네스",
        desc: "몸 구조가 액체처럼 유연해 일반 끈 하네스에서 쉽게 탈출하는 고양이 맞춤형 전신 랩 형태의 완벽 탈출 방지 조끼형 하네스입니다. 가슴과 목 부분을 넓게 조여 가해지는 힘을 안전하게 분산합니다.",
        price: 29920,
        originalPrice: 34000,
        discountRate: 12,
        tip: "벨크로 접착과 안전 클립 버클의 이중 잠금 설계로 가슴 부위를 포근하게 감싸 주어 외출 시 고양이가 느끼는 고립 공포를 현격히 줄여 줍니다.",
        target: "부득이한 병원 이동이나 이사, 재난 대피 등 비상 야외 외출이 필요한 예민한 고양이",
        delivery: "무료배송",
        bg: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <path d="M30,35 C30,75 70,75 70,35" stroke="var(--primary)" stroke-width="8" stroke-linecap="round" fill="none"/>
                <rect x="42" y="58" width="16" height="12" rx="3" fill="var(--accent)"/>
              </svg>`
    },
    {
        id: "cat-lead-1",
        category: "고양이 용품",
        subCategory: "harness",
        subCategoryName: "목줄/하네스",
        name: "소프트 초경량 안전 리드줄 (3m)",
        desc: "무게감을 거의 느끼지 못하는 65g 초경량 나일론 사를 정밀 직조하여 고양이의 예민한 등 근육과 꼬리 쪽에 물리적 부담을 가하지 않는 전용 가벼운 리드줄입니다. 부드러운 그립 제공.",
        price: 15300,
        originalPrice: 18000,
        discountRate: 15,
        tip: "하네스와 고정하는 회전 회전 고리가 알루미늄 항공 합금으로 제작되어 강도가 매우 높으면서도 충격 흡수 스프링이 내장되어 탁월하게 안전합니다.",
        target: "야외 외출 적응 훈련을 시작하거나 가벼운 리드가 필요한 반려묘",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #fff9e6, #fff0b3)",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <path d="M25,60 Q50,30 75,60" stroke="var(--primary)" stroke-width="4" fill="none" stroke-linecap="round"/>
                <circle cx="75" cy="60" r="5" fill="var(--accent)"/>
              </svg>`
    },
    {
        id: "cat-tag-1",
        category: "고양이 용품",
        subCategory: "tag",
        subCategoryName: "인식표",
        name: "초경량 패브릭 리본 자수 인식표",
        desc: "무게가 단 3g으로, 목에 거부감을 전혀 주지 않고 전화번호와 이름을 부드럽게 컴퓨터 기계 자수로 꼼꼼히 박아 부착하는 안전 리본식 목걸이입니다. 금속 장식이 없어 알레르기가 없습니다.",
        price: 11200,
        originalPrice: 14000,
        discountRate: 20,
        tip: "부드러운 천연 면 100% 원단이라 털 엉킴이 없고 가려움증을 유발하지 않는 완전 무자극 소재입니다. 미온수로 가볍게 손세탁이 가능합니다.",
        target: "목줄이나 무거운 펜던트를 걸면 발톱으로 심하게 긁어 상처가 사는 민감 묘체",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #fff0f5, #ffd1df)",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <rect x="20" y="45" width="60" height="10" rx="3" fill="var(--accent)"/>
                <path d="M40,40 L60,60 M60,40 L40,60" stroke="white" stroke-width="3"/>
              </svg>`
    },
    {
        id: "cat-muzzle-1",
        category: "고양이 용품",
        subCategory: "muzzle",
        subCategoryName: "입마개",
        name: "고양이 안심 힐링 안대형 헬멧",
        desc: "미용이나 손톱 정리, 병원 진료 시 고양이의 시야를 안전하게 가려주어 고양이가 시각적 과도 자극으로부터 평온한 안정을 느끼게 해 주며 입질 물림을 원천 차단하는 투명 구체형 마스크 헬멧입니다.",
        price: 17600,
        originalPrice: 22000,
        discountRate: 20,
        tip: "호흡을 위한 전면 12개의 원형 통풍구가 있어 내부 공기가 시원하게 회전되므로, 미용이나 진료 시 15분 미만의 짧은 시간 위주로 안전하게 활용해 주세요.",
        target: "동물병원 검진이나 발톱 케어 시 공격성과 하악질이 심해져 케어가 어려운 고양이",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #eef4f8, #cce0f0)",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <circle cx="50" cy="50" r="22" fill="none" stroke="var(--primary)" stroke-width="4"/>
                <circle cx="50" cy="50" r="14" fill="none" stroke="var(--primary)" stroke-dasharray="4 2"/>
                <line x1="30" y1="50" x2="20" y2="50" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/>
              </svg>`
    },
    {
        id: "cat-clothes-1",
        category: "고양이 용품",
        subCategory: "clothes",
        subCategoryName: "의류",
        name: "메쉬 쿨링 무자극 냥이 스핑크스 전용 의류",
        desc: "털이 없고 피지 분비가 대단히 왕성한 스핑크스 고양이 전용 오가닉 코튼 티셔츠입니다. 가구 및 침구에 기름때가 타는 이염을 예방하고 차가운 에어컨 바람 아래서 감기 걸리지 않게 도와줍니다.",
        price: 19200,
        originalPrice: 24000,
        discountRate: 20,
        tip: "암홀(소매 틈새) 부분이 넓게 트여 있어 겨드랑이 쏠림 현상이 없으며, 그루밍 및 스크래칭 시 원단 걸림이 없도록 입체 성형 패턴으로 제작되었습니다.",
        target: "털이 없어 실내 온도 습도 변화에 예민한 스핑크스 고양이 및 피부 짓무름 예방 묘체",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #fffae6, #fff0b3)",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <path d="M35,32 L65,32 L72,70 L28,70 Z" fill="var(--primary)" opacity="0.8"/>
                <path d="M42,20 L50,32 L58,20" stroke="var(--accent)" stroke-width="4" fill="none"/>
              </svg>`
    },

    // 3. 특화간식
    {
        id: "snack-joint-1",
        category: "질환 특화간식",
        subCategory: "snack",
        subCategoryName: "질환 특화간식",
        name: "🦴 슬개골 튼튼 콘드로이친 조인트 츄",
        desc: "유전적으로 고질적인 관절 약화에 취약한 소형 반려견의 슬개골 탈구 연골 보호 및 마모 예방을 목표로 상어연골에서 추출한 천연 콘드로이친과 글루코사민을 한 알에 배합한 영양 수제 간식입니다.",
        price: 13090,
        originalPrice: 17000,
        discountRate: 23,
        tip: "하루 권장 급여량은 5kg 기준 2개이며, 연령에 상관없이 씹어 삼키기 좋은 고무처럼 탄성 있는 부드러운 저온 건조 젤 제형으로 성형하여 이빨과 잇몸 자극이 덜합니다.",
        target: "푸들, 포메라니안, 치와와, 말티즈 등 태생적 슬개골 약화 걱정이 있는 펫",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #fbf0e1, #f5dfc1)",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <rect x="35" y="45" width="30" height="10" rx="3" fill="var(--accent)"/>
                <circle cx="33" cy="45" r="7" fill="var(--accent)"/>
                <circle cx="33" cy="55" r="7" fill="var(--accent)"/>
                <circle cx="67" cy="45" r="7" fill="var(--accent)"/>
                <circle cx="67" cy="55" r="7" fill="var(--accent)"/>
              </svg>`
    },
    {
        id: "snack-tear-1",
        category: "질환 특화간식",
        subCategory: "snack",
        subCategoryName: "질환 특화간식",
        name: "👁️ 눈물 싹싹 안구 케어 빌베리 쌀쿠키",
        desc: "눈물샘 삼출물 과다와 눈 주위 갈색 염증 자국으로 고민하는 반려동물을 위해 항산화 기능성 안토시아닌이 야생 블루베리의 4배 이상 농축된 유기농 빌베리와 루테인을 다량 배합해 구운 저알레르기 기능 식단 쿠키입니다.",
        price: 12000,
        originalPrice: 16000,
        discountRate: 25,
        tip: "밀가루 글루텐 단백질 알레르기가 유발하는 눈물을 예방하기 위해 100% 국산 햅쌀가루를 베이스로 반죽하였으며, 바삭한 소리로 씹는 쾌감을 극대화해 스트레스를 날려줍니다.",
        target: "말티즈, 푸들, 비숑프리제 등 평소 눈물이 많거나 안구 건조, 시력 보호가 시급한 펫",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #f0e6f5, #dfc2f2)",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <circle cx="50" cy="50" r="22" fill="var(--primary)" opacity="0.8"/>
                <circle cx="50" cy="50" r="15" fill="none" stroke="white" stroke-width="3" stroke-dasharray="6 3"/>
                <circle cx="45" cy="45" r="3" fill="white"/>
              </svg>`
    },
    {
        id: "snack-kidney-1",
        category: "질환 특화간식",
        subCategory: "snack",
        subCategoryName: "질환 특화간식",
        name: "💧 저인 저나트륨 안심 신장 케어 크랜베리 퓨레",
        desc: "신장 여과 기능이 저하되어 단백질과 유기 인 섭취를 무조건 배제해야 하는 만성 신부전 또는 요로 결석증 반려동물을 위해 고농축 천연 크랜베리 과즙과 특허 저나트륨 포뮬러로 수분을 공급하는 짜먹는 퓨레입니다.",
        price: 14580,
        originalPrice: 18000,
        discountRate: 19,
        tip: "신장 부하를 차단하고자 단백질을 최소화하고 인 함량을 0.05% 이하로 극도로 제한하였습니다. 평소 식수에 짜서 가볍게 희석해 주시면 음수량을 기하급수적으로 늘릴 수 있습니다.",
        target: "신부전 케어, 고양이 하부요로기질환(FLUTD), 결석 수술 경력이 있는 강아지 및 고양이",
        delivery: "무료배송",
        bg: "linear-gradient(135deg, #e3f5fc, #bae6f7)",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <path d="M25,25 L75,35 L65,75 L35,75 Z" fill="var(--primary)" opacity="0.75"/>
                <ellipse cx="45" cy="50" r="4" fill="var(--accent)"/>
                <ellipse cx="55" cy="50" r="4" fill="var(--accent)"/>
              </svg>`
    },
    {
        id: "snack-atopy-1",
        category: "질환 특화간식",
        subCategory: "snack",
        subCategoryName: "질환 특화간식",
        name: "🌱 알레르기 제로 가수분해 연어 아토피 바이트",
        desc: "육류(소고기, 닭고기) 단백질 면역 거부반응으로 온몸 피부를 사정없이 긁어 각질이 지는 아토피 반려견/반려묘를 위해, 연어 살코기를 면역계가 감지하지 못하는 3,000달톤 이하 극미세 아미노산 단위로 쪼갠 가수분해 저자극 바이트입니다.",
        price: 15000,
        originalPrice: 20000,
        discountRate: 25,
        tip: "피부 장벽 세포 복구를 촉진하는 오메가3 불포화지방산과 아연, 비타민E를 다량 함유하여 털이 빠진 귓바퀴나 가려운 발바닥 각질 완화에 가장 확실한 모질 개선 보상 간식입니다.",
        target: "만성 아토피성 지루염, 지간염, 식이 알레르기성 급성 발적 피부 펫 전체",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #eef9f2, #c7eccf)",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <rect x="25" y="35" width="50" height="30" rx="6" fill="var(--primary)" opacity="0.8"/>
                <path d="M35,50 Q50,45 65,50" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/>
              </svg>`
    },
    {
        id: "snack-obesity-1",
        category: "질환 특화간식",
        subCategory: "snack",
        subCategoryName: "질환 특화간식",
        name: "🏃 저칼로리 곤약 닭가슴살 건강 육포",
        desc: "지방 간이나 당뇨, 과체중으로 인해 철저한 열량 통제가 수반되지만 맛의 즐거움을 포기할 수 없는 비만 반려동물을 위한 저열량 기능식 육포입니다. 곤약 분말과 무지방 닭가슴살을 에어 드라이어로 건조하여 완성했습니다.",
        price: 12600,
        originalPrice: 15000,
        discountRate: 16,
        tip: "한 조각당 단 2kcal에 불과해 다이어트 스트레스로 인한 공격성을 완벽하게 방지해 주며 씹는 본능을 유도해 치석 제거나 잇몸 마사지 효과도 탁월합니다.",
        target: "갑작스레 살이 쪘거나 활동량이 줄어 체중 유지가 필수인 당뇨, 과체중 펫",
        delivery: "배송비 3,000원",
        bg: "linear-gradient(135deg, #fffae6, #ffe680)",
        svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <rect x="30" y="25" width="40" height="50" rx="3" fill="var(--accent)"/>
                <line x1="40" y1="35" x2="40" y2="65" stroke="var(--primary)" stroke-width="4" stroke-linecap="round"/>
                <line x1="50" y1="35" x2="50" y2="65" stroke="var(--primary)" stroke-width="4" stroke-linecap="round"/>
                <line x1="60" y1="35" x2="60" y2="65" stroke="var(--primary)" stroke-width="4" stroke-linecap="round"/>
              </svg>`
    }
];

// --- 토스트 알림 자체 구현 ---
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button class="toast-close">&times;</button>
    `;
    
    container.appendChild(toast);
    
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// --- DOM 초기 바인딩 ---
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    
    if (!productId) {
        alert('잘못된 접근입니다. 상품을 찾을 수 없습니다.');
        window.location.href = 'index.html';
        return;
    }
    
    // app.js에서 추가해 저장한 동적 상품 리스트를 결합하여 조회
    const activeProductsStr = localStorage.getItem('pet_planet_active_products');
    let activeProducts = productsData;
    if (activeProductsStr) {
        try {
            activeProducts = JSON.parse(activeProductsStr);
        } catch (e) {
            activeProducts = productsData;
        }
    }
    
    const product = activeProducts.find(p => p.id === productId);
    if (!product) {
        alert('존재하지 않는 상품이거나 단종된 상품입니다.');
        window.location.href = 'index.html';
        return;
    }
    
    // DOM에 데이터 바인딩
    document.title = `${product.name} - 상품 상세 정보 | 펫플래닛`;
    document.getElementById('detail-name').textContent = product.name;
    document.getElementById('detail-category').textContent = `${product.category} • ${product.subCategoryName}`;
    document.getElementById('detail-description').textContent = product.desc;
    document.getElementById('detail-tip').textContent = product.tip;
    document.getElementById('detail-target').textContent = product.target;
    document.getElementById('detail-original-price').textContent = `정상 판매가: ${product.originalPrice.toLocaleString()}원`;
    document.getElementById('detail-discount-rate').textContent = `${product.discountRate}% OFF`;
    document.getElementById('detail-price').textContent = `${product.price.toLocaleString()}원`;
    document.getElementById('detail-delivery').textContent = product.delivery;
    
    // SVG 삽입
    document.getElementById('detail-svg-container').innerHTML = product.svg;
    
    // 배경 변경
    const heroBg = document.getElementById('detail-hero-bg');
    if (heroBg) {
        heroBg.style.background = product.bg;
    }
    
    // 품절 처리 분기
    if (product.isSoldOut) {
        // 품절 알림 배너 동적 생성 및 추가
        const soldOutBanner = document.createElement('div');
        soldOutBanner.className = 'sold-out-banner';
        soldOutBanner.style.background = 'rgba(220, 50, 50, 0.08)';
        soldOutBanner.style.border = '1px solid rgba(220, 50, 50, 0.2)';
        soldOutBanner.style.color = 'var(--error)';
        soldOutBanner.style.padding = '1.25rem';
        soldOutBanner.style.borderRadius = 'var(--radius-md)';
        soldOutBanner.style.marginBottom = '2rem';
        soldOutBanner.style.fontWeight = '800';
        soldOutBanner.style.textAlign = 'center';
        soldOutBanner.style.fontSize = '1.1rem';
        soldOutBanner.style.boxShadow = '0 4px 12px rgba(220, 50, 50, 0.05)';
        soldOutBanner.innerHTML = '⚠️ 품절된 상품입니다. 현재 구매하실 수 없습니다.';
        
        const plannerCard = document.querySelector('.planner-card');
        if (plannerCard) {
            plannerCard.prepend(soldOutBanner);
        }
        
        // 상품 이름에 품절 표시 추가
        document.getElementById('detail-name').innerHTML = `${product.name} <span style="color: var(--error); font-size: 1.2rem; vertical-align: middle; margin-left: 0.5rem;">[품절]</span>`;
    }

    // 장바구니 담기 버튼 바인딩
    const btnAddCart = document.getElementById('btn-detail-add-cart');
    if (btnAddCart) {
        if (product.isSoldOut) {
            btnAddCart.disabled = true;
            btnAddCart.style.opacity = '0.5';
            btnAddCart.style.cursor = 'not-allowed';
            btnAddCart.style.background = 'var(--text-muted)';
            btnAddCart.style.borderColor = 'var(--text-muted)';
            btnAddCart.innerHTML = '🚫 품절된 상품입니다';
        } else {
            btnAddCart.addEventListener('click', () => {
                let cart = [];
                const saved = localStorage.getItem('pet_planet_cart');
                if (saved) {
                    try {
                        cart = JSON.parse(saved);
                    } catch (e) {
                        cart = [];
                    }
                }
                
                const existing = cart.find(item => item.productId === product.id);
                if (existing) {
                    existing.quantity += 1;
                } else {
                    cart.push({ productId: product.id, quantity: 1 });
                }
                
                localStorage.setItem('pet_planet_cart', JSON.stringify(cart));
                showToast(`🛒 "${product.name}"을(를) 장바구니에 안전하게 보관했습니다.`, 'success');
            });
        }
    }
});
