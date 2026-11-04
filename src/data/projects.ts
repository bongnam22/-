export type Category = "Promotion" | "Graphic" | "Branding"
export type Shape = "landscape" | "portrait" | "square"

export interface ProjectDetailData {
  overviewKo: string
  overviewEn: string
  client: string
  role: string
  deliverables: string[]
  tools: string[]
  conceptKeyword: string
  motifIcon?: string
  palette: Array<{ name: string; hex: string; desc: string }>
  visuals: {
    heroAccent: string
    mockupType1: string
    mockupType2: string
    mockupType3: string
    mockupType4: string
    bannerLabel: string
  }
}

export interface Project {
  id: number
  title: string
  englishTitle: string
  category: Category
  shape: Shape
  year: string
  gray: string
  accentColor: string
  tagline: string
  coverImage?: string
  galleryImages?: string[]
  details: ProjectDetailData
}

export const projects: Project[] = [
  {
    id: 1,
    title: "카이소캠페인",
    englishTitle: "KAISO Campaign",
    category: "Promotion",
    shape: "landscape",
    year: "2024. 03 — 05",
    gray: "#d8d8d6",
    accentColor: "#2962FF",
    tagline: "부산 로컬 청년 크리에이터를 잇는 페스티벌 브랜딩",
    details: {
      overviewKo:
        "부산의 로컬 청년 예술가들과 도시 문화를 잇는 오프라인 팝업 및 페스티벌 '카이소(KAISO)'의 종합 프로모션 아이덴티티입니다. 해양 도시 부산의 파도와 역동적인 에너지를 기하학적 파동 모티브로 시각화하였으며, 온·오프라인 전방위 미디어에서 청년층의 높은 공감대를 이끌어냈습니다.",
      overviewEn:
        "KAISO is a vibrant promotional campaign and cultural festival linking local youth creators with urban life in Busan. We designed an adaptive visual system inspired by tidal wave forms and vibrant coastal dynamics, maintaining high kinetic excitement across posters, installations, and digital channels.",
      client: "부산문화재단 & 로컬 크리에이티브 연합",
      role: "Lead Visual Designer (Key Visual, Signage, Merch)",
      deliverables: ["Key Visual Poster", "Exhibition Booth", "Wayfinding System", "Goods Package"],
      tools: ["Ai", "Ps", "Ae"],
      conceptKeyword: "Tidal Waves & Cultural Pulse",
      motifIcon: "wave",
      palette: [
        { name: "Marine Indigo", hex: "#0E1E38", desc: "심해의 안정감과 도시적 무게감" },
        { name: "Electric Blue", hex: "#2962FF", desc: "젊은 창작자들의 에너지와 바다의 파동" },
        { name: "Sunrise Tangerine", hex: "#FF6E40", desc: "페스티벌의 열기와 축제적 활기" },
        { name: "Soft Salt White", hex: "#F5F6F8", desc: "명료한 텍스트 가독성을 위한 백그라운드" },
      ],
      visuals: {
        heroAccent: "#2962FF",
        mockupType1: "STREET BANNERS & BILLBOARDS",
        mockupType2: "POP-UP BOOTH ARCHITECTURE",
        mockupType3: "LIMITED FESTIVAL KIT & TOTE",
        mockupType4: "INTERACTIVE DIGITAL KEYFRAME",
        bannerLabel: "KAISO CULTURE WEEK BRAND EXPERIENCE",
      },
    },
  },
  {
    id: 2,
    title: "KOTRA 60주년",
    englishTitle: "KOTRA 60th Anniversary",
    category: "Promotion",
    shape: "portrait",
    year: "2023. 08 — 11",
    gray: "#c9c9c6",
    accentColor: "#0062D2",
    tagline: "대한민국 글로벌 무역 60년의 궤적과 비전 시각화",
    details: {
      overviewKo:
        "대한무역투자진흥공사(KOTRA)의 60주년을 기념하는 심볼릭 엠블럼과 특별 전시, 기념 도록 및 행사 브랜딩 디자인입니다. 1962년부터 이어진 무역 개척의 궤적을 뫼비우스의 띠 형태의 연결선과 미래 지향적 블루 그리드로 구축했습니다.",
      overviewEn:
        "Celebrating 60 years of KOTRA powering Korea’s global trade evolution. We constructed a heritage-meets-future milestone emblem combining continuous Möbius ribbons with structured typographic grids, applied systematically across the anniversary chronicle and global summits.",
      client: "대한무역투자진흥공사 (KOTRA)",
      role: "Graphic & Editorial Designer",
      deliverables: ["60th Symbol Emblem", "Commemorative Book", "Summit Signage", "Digital Assets"],
      tools: ["Ai", "Id", "Ps"],
      conceptKeyword: "Global Gateway & Timeless Ribbon",
      motifIcon: "orbit",
      palette: [
        { name: "KOTRA Heritage Blue", hex: "#003A70", desc: "국가 무역을 지탱해온 신뢰와 역사" },
        { name: "Horizon Cyan", hex: "#00A3E0", desc: "세계 시장으로 뻗어나가는 개척 정신" },
        { name: "Pure Platinum", hex: "#E9ECF1", desc: "정제된 조형미와 품격 있는 베이스" },
        { name: "Graphite Noir", hex: "#191B1F", desc: "단단한 정보 전달을 위한 핵심 텍스트 컬러" },
      ],
      visuals: {
        heroAccent: "#003A70",
        mockupType1: "HARDCOVER CHRONICLE BOOK",
        mockupType2: "GLOBAL SUMMIT STAGE BACKDROP",
        mockupType3: "COMMEMORATIVE MEDAL PACKAGING",
        mockupType4: "MOTION INTRO STORYBOARD",
        bannerLabel: "KOTRA 60TH GLOBAL TRADE EXPEDITION",
      },
    },
  },
  {
    id: 3,
    title: "광안리 펭수",
    englishTitle: "Pengsoo in Gwangalli",
    category: "Promotion",
    shape: "landscape",
    year: "2023. 06 — 08",
    gray: "#e2e2df",
    accentColor: "#FFC700",
    tagline: "광안리 해변 여름 드론쇼 & 캐릭터 페스티벌 캠페인",
    details: {
      overviewKo:
        "여름철 광안리 해변을 찾은 300만 방문객을 맞이한 '광안리 M 드론라이트쇼 X 펭수' 콜라보레이션 프로젝트입니다. 광안대교와 시원한 파도를 배경으로 선글라스를 낀 펭수의 재치 있는 그래픽 애셋을 개발하고, 포토존, 굿즈 패키지, 디지털 모션 포스터를 제작했습니다.",
      overviewEn:
        "A sun-drenched summer brand promotion for the iconic Gwangalli M Drone Light Show in collaboration with EBS Pengsoo. Featuring bespoke beachwear character graphics, seaside photo installations, and lively merchandise celebrating Busan’s summer shoreline.",
      client: "부산광역시 수영구 & EBS",
      role: "Campaign Graphic & Merchandise Designer",
      deliverables: ["Character Key Visual", "Drone Show Title Graphic", "Beach Photozone", "Summer Merch"],
      tools: ["Ai", "Ps", "Figma"],
      conceptKeyword: "Sunny Breeze & Seaside Humor",
      motifIcon: "sun",
      palette: [
        { name: "Penguin Sunshine", hex: "#FFC700", desc: "펭수 특유의 유쾌하고 따뜻한 시그니처 옐로우" },
        { name: "Gwangalli Ocean", hex: "#0072CE", desc: "시원하게 펼쳐진 광안리 앞바다의 청량감" },
        { name: "Sunset Coral", hex: "#FF5A36", desc: "여름 일몰과 물놀이 튜브의 화사한 포인트" },
        { name: "White Sand", hex: "#FFFDF5", desc: "모래사장처럼 포근하고 밝은 바탕색" },
      ],
      visuals: {
        heroAccent: "#FFC700",
        mockupType1: "BEACH PHOTOZONE SCULPTURE",
        mockupType2: "DRONE SHOW POSTER & TIMETABLE",
        mockupType3: "SUMMER RESORT GOODIES",
        mockupType4: "SURFBOARD & PARASOL GRAPHICS",
        bannerLabel: "GWANGALLI SUMMER RESORT WITH PENGSOO",
      },
    },
  },
  {
    id: 4,
    title: "브레드이발소",
    englishTitle: "Bread Barbershop",
    category: "Promotion",
    shape: "square",
    year: "2023. 02 — 04",
    gray: "#bdbdb9",
    accentColor: "#E65100",
    tagline: "글로벌 히트 애니메이션 캐릭터 팝업 & F&B 콜라보레이션",
    details: {
      overviewKo:
        "남녀노소에게 사랑받는 애니메이션 '브레드이발소'의 스페셜 베이커리 팝업 스토어 프로모션입니다. 이발소의 상징인 회전 싸인볼과 갓 구운 토스트의 따뜻한 브라운 톤을 결합하여, 유쾌한 서사를 오감으로 느낄 수 있는 스토어 비주얼 및 패키징을 완성했습니다.",
      overviewEn:
        "Specialty retail and pop-up experience for the globally acclaimed animated series Bread Barbershop. Blending vintage barbershop striped poles with warm golden bakery aesthetics to craft enticing food packaging and interactive in-store point-of-sale displays.",
      client: "몬스터스튜디오 & 베이커리 플래그십",
      role: "Visual Promotion & Package Designer",
      deliverables: ["Pop-up Store Facade", "Specialty Bread Packaging", "Character Stickers", "Stamp Card"],
      tools: ["Ai", "Ps"],
      conceptKeyword: "Whimsical Barber & Freshly Baked",
      motifIcon: "sparkle",
      palette: [
        { name: "Golden Toast", hex: "#C77728", desc: "바삭하게 구워진 토스트 식빵의 온기" },
        { name: "Barber Carmine", hex: "#D32F2F", desc: "클래식 이발소의 상징적인 레드 스트라이프" },
        { name: "Fresh Cream", hex: "#FFF9E6", desc: "부드러운 디저트 크림을 연상시키는 베이스" },
        { name: "Deep Crust", hex: "#3E2723", desc: "또렷한 실루엣을 잡아주는 다크 초콜릿 컬러" },
      ],
      visuals: {
        heroAccent: "#C77728",
        mockupType1: "BAKERY WINDOW GRAPHIC & MENU",
        mockupType2: "ECO TO-GO BOX & TAPE DESIGN",
        mockupType3: "COLLECTIBLE CHARACTER BADGES",
        mockupType4: "BARBER STRIPE GIFT BAG",
        bannerLabel: "BREAD BARBERSHOP SALON EXPERIENCE",
      },
    },
  },
  {
    id: 5,
    title: "아라솔 캐릭터",
    englishTitle: "Arasol Character",
    category: "Graphic",
    shape: "square",
    year: "2022. 11 — 2023. 01",
    gray: "#d4d4d0",
    accentColor: "#009688",
    tagline: "해양 생태 보호 메시지를 품은 솔방울 바다요정",
    details: {
      overviewKo:
        "해양 쓰레기 정화 캠페인과 청정 해변 조성을 위해 기획된 환경 캐릭터 '아라솔(Arasol)'의 비주얼 매뉴얼입니다. '바다(아라)'와 '솔방울'의 유기적인 형상을 결합하여, 친근하면서도 감성적인 일러스트레이션 시스템과 디지털 스티커, 에코 굿즈를 디자인했습니다.",
      overviewEn:
        "Arasol is an eco-character initiative promoting ocean plastics reduction and coastal marine conservation. Developed with soft organic curves evoking both seaside pinecones and pristine water droplets, the character brings emotional resonance to ecological workshops.",
      client: "해양환경보호 프로젝트 & 에코랩",
      role: "Character Concept & Visual Identity Lead",
      deliverables: ["Character Style Guide", "Expression Library", "Eco Merchandise", "Social Media Stickers"],
      tools: ["Ai", "Ps"],
      conceptKeyword: "Eco Ocean Sprite & Organic Pine",
      motifIcon: "drop",
      palette: [
        { name: "Deep Lagoon", hex: "#00695C", desc: "청정한 바닷속의 깊은 평온함" },
        { name: "Sprout Pine", hex: "#80CBC4", desc: "싱그러운 솔잎과 새싹의 생명력" },
        { name: "Seafoam Cream", hex: "#E0F2F1", desc: "잔잔한 해안가 거품의 맑고 깨끗한 톤" },
        { name: "Driftwood Earth", hex: "#6D4C41", desc: "해변 유목과 대지의 편안한 조화" },
      ],
      visuals: {
        heroAccent: "#00695C",
        mockupType1: "CHARACTER IDENTITY MANUAL",
        mockupType2: "RECYCLED FABRIC PLUSH TOY",
        mockupType3: "ECO TUMBLER & COASTER",
        mockupType4: "DIGITAL MESSENGER STICKER SHEET",
        bannerLabel: "CLEAN COASTLINE WITH ARASOL",
      },
    },
  },
  {
    id: 6,
    title: "인생자취",
    englishTitle: "Living on My Own",
    category: "Branding",
    shape: "portrait",
    year: "2022. 08 — 10",
    gray: "#c4c4c1",
    accentColor: "#8D6E63",
    tagline: "1인 가구 청년을 위한 모던 라이프스타일 큐레이션",
    details: {
      overviewKo:
        "자취를 처음 시작하는 청년들의 일상을 지지하는 라이프스타일 브랜드 '인생자취'의 브랜드 아이덴티티입니다. 혼자만의 작은 방이 세상에서 가장 단단한 휴식처가 되도록, 간결한 평면도 그리드 모티브와 따스한 텍스처의 지기구조 패키지를 디자인했습니다.",
      overviewEn:
        "Living on My Own is a lifestyle and home-goods brand crafted for young independents establishing their first homes. Drawing inspiration from architectural floor plans and quiet domestic routines, we crafted an understated typographic identity and sustainable packaging system.",
      client: "라이프 아틀리에 코퍼레이션",
      role: "Brand Identity & Packaging Designer",
      deliverables: ["Brand Identity Guideline", "Box Packaging Suite", "Unboxing Manual", "Brand Book"],
      tools: ["Ai", "Id", "Ps"],
      conceptKeyword: "Compact Solitude & Cozy Sanctuary",
      motifIcon: "cube",
      palette: [
        { name: "Terracotta Clay", hex: "#8D6E63", desc: "소박하고 아늑한 일상의 흙빛" },
        { name: "Raw Linen", hex: "#EFEBE9", desc: "가공되지 않은 패브릭의 자연스러움" },
        { name: "Quiet Charcoal", hex: "#37474F", desc: "집중과 사색의 고요한 공간감" },
        { name: "Morning Sun", hex: "#D7CCC8", desc: "방 안으로 스며드는 은은한 아침 햇살" },
      ],
      visuals: {
        heroAccent: "#8D6E63",
        mockupType1: "SUSTAINABLE KRAFT PACKAGE BOX",
        mockupType2: "ROOM FRAGRANCE & CANDLE LABEL",
        mockupType3: "STARTER ESSENTIAL GUIDE BOOKLET",
        mockupType4: "TEXTILE FABRIC POUCH & TAG",
        bannerLabel: "INDEPENDENT LIVING SANCTUARY",
      },
    },
  },
  {
    id: 7,
    title: "파티타이거",
    englishTitle: "Party Tiger",
    category: "Branding",
    shape: "landscape",
    year: "2022. 04 — 07",
    gray: "#dededb",
    accentColor: "#FF3D00",
    tagline: "전통 민화 호랑이의 현대적 재해석과 크래프트 펍 브랜딩",
    details: {
      overviewKo:
        "조선 민화 속 까치와 호랑이의 해학적인 표정을 네오-볼드 스트리트 그래픽으로 재해석한 수제 맥주 펍 '파티타이거'의 비주얼 아이덴티티입니다. 강렬한 주황과 먹색의 대조를 바탕으로 맥주 탭 핸들, 캔 라벨, 코스터, 네온사인을 토탈 디렉팅했습니다.",
      overviewEn:
        "A fierce yet humorous craft beer pub identity inspired by classic Korean folk tigers ('Minhwa'). Translating archaic wooden talisman iconography into sharp contemporary neon emblems, raw screen-printed beer cans, and bold tavern merchandise.",
      client: "타이거 크래프트 브루어리",
      role: "Total Brand Director & Graphic Designer",
      deliverables: ["Visual Identity System", "Beer Can Series (4 types)", "Glassware & Tap Handles", "Neon Signage"],
      tools: ["Ai", "Ps"],
      conceptKeyword: "Neo-Folk Tiger & High Voltage Craft",
      motifIcon: "flame",
      palette: [
        { name: "Tiger Flame", hex: "#FF3D00", desc: "호랑이의 눈빛과 축제의 열정을 담은 네온 오렌지" },
        { name: "Sumi Ink", hex: "#111111", desc: "전통 수묵화의 짙고 깊은 먹빛" },
        { name: "Craft Amber", hex: "#FFAB00", desc: "갓 따른 수제 에일 맥주의 황금빛 거품" },
        { name: "Hanji Paper", hex: "#F7F5F0", desc: "한지의 부드러운 질감을 살린 내추럴 화이트" },
      ],
      visuals: {
        heroAccent: "#FF3D00",
        mockupType1: "4-PACK CRAFT BEER CAN SERIES",
        mockupType2: "GLOWING CUSTOM NEON FACADE",
        mockupType3: "EMBOSSED BAR COASTERS & CUPS",
        mockupType4: "OVERSIZED STREET GRAPHIC TEE",
        bannerLabel: "PARTY TIGER BREWING COMPANY",
      },
    },
  },
  {
    id: 8,
    title: "두심당",
    englishTitle: "Dusimdang",
    category: "Branding",
    shape: "portrait",
    year: "2021. 11 — 2022. 02",
    gray: "#babbb8",
    accentColor: "#5D4037",
    tagline: "정성 어린 콩과 곡물로 빚어낸 전통 프리미엄 제과점",
    details: {
      overviewKo:
        "국산 콩과 자연 재료만을 고집하는 전통 건강 베이커리 '두심당(豆心堂)'의 브랜드 리뉴얼 프로젝트입니다. 콩 깍지와 한옥 창살의 단아한 기하학 구조를 심볼화하고, 전통 지함 패키지와 한지 띠지 디자인으로 선물로서의 격조를 높였습니다.",
      overviewEn:
        "Brand renewal for Dusimdang, an artisanal confectionery honoring traditional bean pastries and natural grains. We designed a restrained emblem based on soy pods and Korean wooden latticework, complemented by tactile mulberry paper packaging.",
      client: "농업회사법인 두심당",
      role: "CI / BI Renewal & Structural Package Design",
      deliverables: ["Brandmark & Seal", "Gift Box Structure", "Wrapping Paper & Ribbon", "Menu & Signage"],
      tools: ["Ai", "Ps", "Id"],
      conceptKeyword: "Artisanal Grain & Zen Geometry",
      motifIcon: "flower",
      palette: [
        { name: "Soy Walnut", hex: "#4E342E", desc: "깊이 볶아낸 콩과 견과류의 진중한 고동색" },
        { name: "Grain Ochre", hex: "#BCAAA4", desc: "곱게 빻은 미숫가루와 통밀의 은은한 미색" },
        { name: "Golden Wheat", hex: "#C79A63", desc: "노릇하게 구워진 페이스트리의 정갈한 색조" },
        { name: "Mulberry White", hex: "#FAF8F5", desc: "자연을 닮은 한지의 단아하고 깨끗한 여백" },
      ],
      visuals: {
        heroAccent: "#4E342E",
        mockupType1: "RIGID TRADITIONAL CONFECTIONERY BOX",
        mockupType2: "CALLIGRAPHIC WOODEN DOOR SIGN",
        mockupType3: "ORGANIC LINEN GIFT WRAP (BOJAGI)",
        mockupType4: "TASTING CARD & SEAL STAMPS",
        bannerLabel: "DUSIMDANG ARTISANAL HERITAGE",
      },
    },
  },
  {
    id: 9,
    title: "캠핑이나하라그렉",
    englishTitle: "Go Camping, Greg",
    category: "Branding",
    shape: "landscape",
    year: "2021. 07 — 10",
    gray: "#d0d0cd",
    accentColor: "#33691E",
    tagline: "도시를 떠나 대자연으로 향하는 아웃도어 기어 브랜드",
    details: {
      overviewKo:
        "바쁜 도시 일상에 지친 현대인들에게 '그냥 짐 싸서 떠나라'는 명쾌한 모토를 던지는 아웃도어 캠핑 기어 브랜드 '캠핑이나하라그렉'의 비주얼 시스템입니다. 텐트 팩, 나침반, 산등성이를 형상화한 유머러스한 심볼과 튼튼한 하드웨어 패키징을 완성했습니다.",
      overviewEn:
        "Go Camping, Greg is a tongue-in-cheek outdoor apparel and adventure gear brand urging urbanites to drop everything and pitch a tent. We developed a rugged badge system featuring mountain silhouettes, topographical lines, and weather-resistant labeling.",
      client: "그렉 어드벤처 기어",
      role: "Brand Identity & Field Gear Packaging",
      deliverables: ["Brand Identity & Badges", "Hardware Tool Packaging", "Waterproof Labels", "Lookbook"],
      tools: ["Ai", "Ps"],
      conceptKeyword: "Rugged Mountain & Campfire Wit",
      motifIcon: "mountain",
      palette: [
        { name: "Deep Spruce", hex: "#1B5E20", desc: "울창한 침엽수림의 짙은 녹음" },
        { name: "Campfire Ember", hex: "#E65100", desc: "어둠 속에서 타오르는 모닥불 불꽃" },
        { name: "Khaki Canvas", hex: "#8D7B68", desc: "비바람을 견디는 빈티지 텐트 캔버스 톤" },
        { name: "Graphite Anvil", hex: "#263238", desc: "아웃도어 하드웨어 메탈 기어의 견고함" },
      ],
      visuals: {
        heroAccent: "#1B5E20",
        mockupType1: "WEATHERPROOF GEAR CASE & LABELS",
        mockupType2: "EMBROIDERED CAMPING BADGES & CAPS",
        mockupType3: "ADVENTURE FIELD MANUAL & MAP",
        mockupType4: "ANODIZED TITANIUM CAMP MUG",
        bannerLabel: "GO CAMPING GREG EXPEDITION GEAR",
      },
    },
  },
]
