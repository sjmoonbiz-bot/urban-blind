import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  PhoneCall,
  MessageCircle,
  ShieldCheck,
  Ruler,
  Wrench,
  Star,
  ChevronRight,
  Menu,
  X,
  MapPin,
  CheckCircle2,
  BadgeCheck,
  ArrowUpRight,
  Wind,
  RotateCw,
  Sparkles,
  Lightbulb
} from "lucide-react";

/** [설정] 카카오톡 오픈채팅 링크 & Gemini API 키 */
const KAKAO_CHAT_URL = "https://open.kakao.com/o/sYourLinkID";
const GEMINI_API_KEY = ""; // 여기에 API 키를 입력하세요

/** 브랜드 정보 */
const BRAND = {
  name: "THE SLAT",
  tagline: "프리미엄 유니슬렛 전문",
  serviceArea: "부산 전지역", // 서울/경기 등 사장님 지역으로 변경하세요
  phone: "010-1234-5678",
  bizHours: "매일 09:00-20:00",
};

/** 고화질 이미지 에셋 */
const IMAGES = [
  "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80", 
  "https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1502005229762-cf1e2a862d84?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1617104424032-b9bd6972d0e4?auto=format&fit=crop&w=1600&q=80"
];

const img = (index) => IMAGES[index % IMAGES.length];

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  return new Promise((resolve, reject) => {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error("copy failed"));
    } catch (e) {
      reject(e);
    }
  });
}

/** 섹션 애니메이션 컴포넌트 */
function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShow(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={classNames(
        "transition-all duration-700 will-change-transform",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        className
      )}
    >
      {children}
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-700">
      {children}
    </span>
  );
}

function Button({ children, className = "", onClick, as = "button", href, disabled }) {
  const Comp = as;
  return (
    <Comp
      href={href}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold",
        "transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900/30",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        className
      )}
    >
      {children}
    </Comp>
  );
}

function Toast({ open, message, onClose }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 2600);
    return () => clearTimeout(t);
  }, [open, onClose]);

  return (
    <div
      className={classNames(
        "fixed left-1/2 top-4 z-[9999] -translate-x-1/2",
        "transition-all duration-300",
        open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      )}
      aria-live="polite"
    >
      <div className="rounded-2xl border border-stone-200 bg-white/90 px-4 py-3 text-sm text-stone-800 shadow-xl backdrop-blur">
        {message}
      </div>
    </div>
  );
}

/** [기능 추가] AI 스타일리스트 컴포넌트 */
function AIStylistSection() {
  const [wallColor, setWallColor] = useState("");
  const [furnitureColor, setFurnitureColor] = useState("");
  const [mood, setMood] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAIRecommendation = async () => {
    if (!wallColor || !furnitureColor || !mood) {
      alert("모든 항목을 입력해주세요!");
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecommendation(null);
    const prompt = `
      당신은 10년차 유니슬렛 전문 인테리어 디자이너입니다.
      고객의 집 정보가 다음과 같을 때, 가장 잘 어울리는 유니슬렛 색상 조합 3가지를 추천해주세요.
      (단색, 투톤 믹스 등 유니슬렛의 특징을 살려서)
      
      [고객 정보]
      - 벽지 색상: ${wallColor}
      - 가구/바닥 톤: ${furnitureColor}
      - 원하는 분위기: ${mood}

      [답변 형식]
      - 친절하고 전문적인 말투.
      - 3가지 옵션 추천.
      - 마무리로 "더슬렛에서 무료 실측 받아보세요" 유도.
    `;
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      setRecommendation(data.candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (err) {
      setError("AI 전문가와 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="ai-stylist" className="py-24 bg-stone-50 border-y border-stone-200">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold mb-3 border border-violet-200">
              <Sparkles size={12} fill="currentColor"/> AI Beta
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 mb-4">✨ AI 맞춤 유니슬렛 추천</h2>
            <p className="text-stone-600">
              우리 집에 어떤 컬러가 어울릴지 고민되시나요?<br/>
              벽지와 가구 톤만 알려주세요. AI 전문가가 골라드립니다.
            </p>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl border border-stone-100 p-8 md:p-10">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">벽지 색상</label>
                <input type="text" placeholder="예: 화이트, 연그레이" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500" value={wallColor} onChange={(e) => setWallColor(e.target.value)}/>
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">가구/바닥 톤</label>
                <input type="text" placeholder="예: 오크 우드, 블랙" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500" value={furnitureColor} onChange={(e) => setFurnitureColor(e.target.value)}/>
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">원하는 분위기</label>
                <input type="text" placeholder="예: 아늑함, 모던함" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500" value={mood} onChange={(e) => setMood(e.target.value)}/>
              </div>
            </div>

            <div className="text-center mb-8">
              <Button 
                onClick={handleAIRecommendation} 
                disabled={isLoading} 
                className="w-full md:w-auto bg-violet-600 hover:bg-violet-700 text-white shadow-lg"
              >
                {isLoading ? (
                  <>분석 중...</>
                ) : (
                  <><Sparkles size={18} className="text-yellow-300"/> AI 추천받기</>
                )}
              </Button>
            </div>

            {recommendation && (
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 md:p-8 relative animate-fade-in">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 rounded-full border border-stone-200 shadow-sm flex items-center gap-2 text-violet-700 font-bold text-sm">
                  <Lightbulb size={16}/> AI 전문가의 제안
                </div>
                <div className="prose prose-stone max-w-none whitespace-pre-line leading-relaxed text-stone-800 text-sm md:text-base">
                  {recommendation}
                </div>
                <div className="mt-6 pt-6 border-t border-stone-200 text-center">
                   <button onClick={() => scrollToId('cta')} className="text-stone-900 font-bold underline hover:text-violet-600 transition-colors">
                     이 추천으로 견적 받으러 가기 &rarr;
                   </button>
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center text-sm">
                {error}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function App() {
  const NAV = useMemo(
    () => [
      { id: "usp", label: "왜 더슬렛?" },
      { id: "ai-stylist", label: "AI 추천" },
      { id: "unislat", label: "제품 소개" },
      { id: "gallery", label: "시공 사례" },
      { id: "reviews", label: "고객 후기" },
      { id: "cta", label: "무료 상담" },
    ],
    []
  );

  const heroBg = useMemo(() => img(0), []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [lead, setLead] = useState({ name: "", phone: "", area: "" });

  const GALLERY = useMemo(
    () => [
      { apt: "해운대 힐스테이트", style: "유니슬렛 · 데이(채광) 중심" },
      { apt: "센텀 더샵", style: "유니슬렛 · 디밍(눈부심 완화)" },
      { apt: "명지 더샵", style: "유니슬렛 · 프라이버시 강조" },
      { apt: "연산 롯데캐슬", style: "유니슬렛 · 거실 대형창" },
      { apt: "동래 래미안", style: "유니슬렛 · 톤온톤 믹스" },
      { apt: "서면 아이파크", style: "유니슬렛 · 호텔 무드" },
      { apt: "수영 SK뷰", style: "유니슬렛 · 베란다/슬라이딩 도어" },
      { apt: "남천 푸르지오", style: "유니슬렛 · 낮/밤 사용성" },
    ],
    []
  );

  const SEO_KEYWORDS = useMemo(
    () => [
      "유니슬렛", "UniSlat", "스마트커튼", "버티컬", "차르르커튼",
      "채광조절", "프라이버시", "대형창", "슬라이딩도어", "더슬렛",
      "해운대", "센텀", "광안리", "수영", "남천", "연산", "동래", "명지",
      "힐스테이트", "더샵", "푸르지오", "래미안", "롯데캐슬", "아이파크",
    ],
    []
  );

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setScrolled(y > 8);
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop || 0;
      const scrollHeight = doc.scrollHeight || 1;
      const clientHeight = doc.clientHeight || 1;
      const denom = Math.max(1, scrollHeight - clientHeight);
      setProgress(Math.min(100, Math.max(0, (scrollTop / denom) * 100)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onLeadSubmit = async () => {
    const name = lead.name.trim();
    const phone = lead.phone.trim();
    const area = lead.area.trim();

    if (!name || !phone || !area) {
      setToastMsg("이름/연락처/지역을 모두 입력해 주세요.");
      setToastOpen(true);
      return;
    }

    const msg =
      `[${BRAND.name} 무료 견적 요청]\n` +
      `이름: ${name}\n` +
      `연락처: ${phone}\n` +
      `지역: ${area}\n` +
      `요청: 유니슬렛(스마트커튼) 무료 방문 실측 및 견적 문의드립니다.\n`;

    try {
      await copyToClipboard(msg);
      setToastMsg("요청 내용이 복사되었습니다. 카카오톡에서 붙여넣기만 하시면 됩니다.");
      setToastOpen(true);
      setTimeout(() => {
        window.open(KAKAO_CHAT_URL, "_blank", "noopener,noreferrer");
      }, 1000);
    } catch {
      setToastMsg("복사에 실패했습니다. 아래 내용을 수동으로 복사해 주세요.");
      setToastOpen(true);
      window.open(KAKAO_CHAT_URL, "_blank", "noopener,noreferrer");
    }
  };

  const telHref = `tel:${BRAND.phone.replaceAll("-", "")}`;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-yellow-200 selection:text-stone-900">
      <Toast open={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />

      {/* Scroll progress */}
      <div className="fixed left-0 top-0 z-[9998] h-1 w-full bg-transparent">
        <div
          className="h-1 bg-slate-900/70 transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <header
        className={classNames(
          "sticky top-0 z-[9997] border-b",
          scrolled
            ? "border-stone-200 bg-white/85 backdrop-blur"
            : "border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={() => scrollToId("top")}
            className="flex items-center gap-3 rounded-xl px-2 py-1 text-left group"
            aria-label="홈으로"
          >
            {/* THE SLAT Custom Logo (Bar Icon) */}
            <div className={`flex gap-[3px] transition-colors duration-300 ${scrolled ? 'text-stone-900' : 'text-stone-900 md:text-white'}`}>
              <div className="w-1.5 h-7 bg-current rounded-sm group-hover:h-5 transition-all duration-300"></div>
              <div className="w-1.5 h-7 bg-current rounded-sm transition-all duration-300"></div>
              <div className="w-1.5 h-7 bg-current rounded-sm group-hover:h-5 transition-all duration-300"></div>
            </div>
            <div className="leading-none flex flex-col justify-center">
              <div className={`text-lg font-black tracking-tighter ${scrolled ? 'text-stone-900' : 'text-stone-900 md:text-white'}`}>{BRAND.name}</div>
              <div className={`text-[9px] tracking-[0.2em] uppercase font-medium ${scrolled ? 'text-stone-500' : 'text-stone-600 md:text-white/80'}`}>PREMIUM UNISLAT</div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 md:flex">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => scrollToId(n.id)}
                  className={`rounded-xl px-3 py-2 text-sm transition hover:bg-stone-100 ${scrolled ? 'text-stone-700' : 'text-stone-700 md:text-white/90 md:hover:bg-white/10'}`}
                >
                  {n.label}
                </button>
              ))}
            </nav>

            <Button
              className="bg-yellow-400 text-stone-900 shadow-sm hover:bg-yellow-300"
              onClick={() => scrollToId("cta")}
            >
              무료 견적
              <ArrowUpRight className="h-4 w-4" />
            </Button>

            <button
              className="ml-1 grid h-11 w-11 place-items-center rounded-2xl border border-stone-200 bg-white/70 text-stone-800 md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="메뉴"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={classNames(
            "md:hidden overflow-hidden border-t border-stone-200 bg-white/90 backdrop-blur transition-[max-height] duration-300",
            menuOpen ? "max-h-96" : "max-h-0"
          )}
        >
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
            <div className="grid gap-2">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    setMenuOpen(false);
                    scrollToId(n.id);
                  }}
                  className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800"
                >
                  {n.label}
                  <ChevronRight className="h-4 w-4 text-stone-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main id="top">
        <section className="relative">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroBg})` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/55 via-stone-950/35 to-stone-50" />
          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-stone-50 backdrop-blur mb-6">
                <MapPin className="h-4 w-4" />
                {BRAND.serviceArea} 무료 방문 실측
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-stone-50 mb-6 drop-shadow-sm leading-tight">
                커튼을 걷지 마세요,<br/>
                그냥 <span className="text-yellow-400">지나가세요.</span>
              </h1>

              <p className="text-lg md:text-xl leading-relaxed text-stone-200 mb-8 font-light">
                블라인드의 기능과 커튼의 우아함을 하나로.<br/>
                <strong className="text-white font-semibold">유니슬렛(Uni-Slat)</strong>이 거실 생활을 바꿉니다.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  className="bg-yellow-400 text-stone-900 shadow-lg hover:bg-yellow-300 px-8 py-4 text-base"
                  onClick={() => scrollToId("cta")}
                >
                  무료 견적 신청하기
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <Button
                  as="a"
                  href={telHref}
                  className="border border-white/30 bg-white/10 text-stone-50 hover:bg-white/15 px-8 py-4 text-base"
                >
                  전화 상담
                  <PhoneCall className="h-5 w-5" />
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <Chip>각도 조절</Chip>
                <Chip>낱장 세탁</Chip>
                <Chip>대형창 최적</Chip>
                <Chip>확실한 A/S</Chip>
              </div>
            </div>
          </div>
        </section>

        {/* USP */}
        <section id="usp" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Reveal>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
                  <Ruler className="h-6 w-6 text-slate-900" />
                </div>
                <h3 className="text-lg font-bold">유니슬렛 전문 실측</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  일반 커튼과 다릅니다. 바닥에서 정확히 1cm 띄우는 유니슬렛만의 황금 비율을 찾아드립니다.
                </p>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
                  <RotateCw className="h-6 w-6 text-slate-900" />
                </div>
                <h3 className="text-lg font-bold">180도 채광 조절</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  스틱 하나로 암막부터 쉬폰 느낌까지. 블라인드의 기능과 커튼의 감성을 한 번에 잡았습니다.
                </p>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
                  <Wrench className="h-6 w-6 text-slate-900" />
                </div>
                <h3 className="text-lg font-bold">설치 후까지 책임</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  작동감/수평/마감까지 점검하고, 사용 중 이슈는 A/S 정책 기준으로 확실하게 처리합니다.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* AI Stylist (NEW) */}
        <AIStylistSection />

        {/* 유니슬렛 소개 + SEO */}
        <section id="unislat" className="bg-stone-100/60">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <Reveal>
              <div className="grid gap-6 md:grid-cols-2 md:items-center">
                <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
                  <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                    <BadgeCheck className="h-4 w-4" />
                    유니슬렛이란?
                  </div>
                  <h2 className="mt-4 text-2xl font-extrabold tracking-tight">
                    세로 슬랫 구조로 “열림 + 각도조절”을 한 번에
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-stone-700">
                    유니슬렛은 버티컬처럼 넓게 열리고, 블라인드처럼 각도로 빛을 조절하는 방식이 핵심입니다.
                    큰 창, 베란다 문, 슬라이딩 도어에서 특히 만족도가 높습니다.
                  </p>

                  <ul className="mt-5 grid gap-3 text-sm text-stone-700">
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-slate-900" />
                      <span>각도 조절로 채광/프라이버시 밸런스를 맞춥니다.</span>
                    </li>
                    <li className="flex gap-2">
                      <Wind className="mt-0.5 h-5 w-5 text-slate-900" />
                      <span>세로 슬랫 구조라 답답함이 덜하고, 공간이 넓어 보입니다.</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-slate-900" />
                      <span>오염된 날개만 쏙 빼서 '낱장 세탁'이 가능합니다.</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
                  <h3 className="text-lg font-bold">인기 검색어</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    요즘 가장 문의가 많은 아파트와 키워드입니다.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {SEO_KEYWORDS.slice(0, 20).map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>

                  <div className="mt-6 text-sm text-stone-600">
                    * 위 키워드는 예시이며, 실제 시공 사례 업데이트 시 반영됩니다.
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">유니슬렛 시공 갤러리</h2>
                <p className="mt-2 text-sm text-stone-600">
                  더슬렛이 완성한 실제 공간의 분위기를 확인해보세요.
                </p>
              </div>
              <Button
                className="hidden border border-stone-200 bg-white text-stone-800 hover:bg-stone-50 sm:inline-flex"
                onClick={() => scrollToId("cta")}
              >
                나도 견적 받기
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {GALLERY.map((g, idx) => {
                const url = img(idx + 1);
                return (
                  <div
                    key={`${g.apt}-${idx}`}
                    className="group overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={url}
                        alt={`${g.apt} ${g.style}`}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/45 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-800 backdrop-blur">
                          <MapPin className="h-3.5 w-3.5" />
                          {g.apt}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-sm font-bold">{g.style}</div>
                      <div className="mt-1 text-xs text-stone-600">
                        상담 → 실측 → 맞춤제작 → 완벽시공
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </section>

        {/* Process */}
        <section id="process" className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <Reveal>
              <h2 className="text-2xl font-extrabold tracking-tight">진행 과정</h2>
              <p className="mt-2 text-sm text-stone-600">
                유니슬렛은 “실측 + 동선 + 채광”이 핵심이라, 방문 상담이 결과를 좌우합니다.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "상담",
                    desc: "창 크기/동선/원하는 채광·프라이버시를 빠르게 정리합니다.",
                    icon: <MessageCircle className="h-6 w-6" />,
                  },
                  {
                    title: "무료 실측",
                    desc: "샘플 확인 + 정확 실측으로 ‘각도 조절이 예쁘게 보이는’ 구성을 잡습니다.",
                    icon: <Ruler className="h-6 w-6" />,
                  },
                  {
                    title: "유니슬렛 시공",
                    desc: "수평/작동감/마감 체크 후 사용 방법까지 안내합니다.",
                    icon: <ShieldCheck className="h-6 w-6" />,
                  },
                ].map((s) => (
                  <div
                    key={s.title}
                    className="rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm transition hover:bg-stone-100/60"
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
                      {s.icon}
                    </div>
                    <div className="text-lg font-bold">{s.title}</div>
                    <div className="mt-2 text-sm leading-relaxed text-stone-600">{s.desc}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">고객 후기</h2>
                <p className="mt-2 text-sm text-stone-600">
                  유니슬렛은 설치 후 체감이 커서, 후기가 쌓일수록 전환율이 더 올라갑니다.
                </p>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-sm font-semibold text-stone-800">5.0</div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  name: "김OO",
                  text:
                    "버티컬 느낌인데 훨씬 부드럽고, 각도 조절이 깔끔해서 거실 분위기가 확 바뀌었어요. 방문 실측이 도움이 됐습니다.",
                },
                {
                  name: "이OO",
                  text:
                    "큰 창이라 고민했는데 동선까지 고려해서 추천해주셔서 만족합니다. 낮에는 채광, 밤에는 프라이버시가 잘 잡혀요.",
                },
                {
                  name: "박OO",
                  text:
                    "설치 후 작동감까지 체크하고 가셔서 믿음이 갔습니다. 강아지 때문에 낱장 세탁 되는 게 정말 좋아요.",
                },
              ].map((r) => (
                <div key={r.name} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold">{r.name} 고객님</div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-stone-700">{r.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* CTA */}
        <section id="cta" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Reveal>
            <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="grid gap-6 md:grid-cols-2 md:items-center">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">유니슬렛 무료 상담 신청</h2>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    이름/전화/지역만 입력하면 요청 내용이 자동으로 복사되고, 카카오톡 오픈채팅이 열립니다.
                  </p>

                  <div className="mt-4 grid gap-2 text-sm text-stone-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-slate-900" />
                      <span>개인정보는 상담 목적 외 사용하지 않습니다.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-slate-900" />
                      <span>상담 가능 시간: {BRAND.bizHours}</span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl border border-stone-200 bg-stone-50 p-5">
                    <div className="text-xs font-semibold text-stone-700">복사되는 메시지 예시</div>
                    <pre className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-stone-600">
{`[${BRAND.name} 무료 견적 요청]
이름: 홍길동
연락처: 010-1234-5678
지역: 해운대구
요청: 유니슬렛(스마트커튼) 무료 방문 실측 및 견적 문의드립니다.`}
                    </pre>
                  </div>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-stone-50 p-6">
                  <label className="block text-sm font-semibold text-stone-800">이름</label>
                  <input
                    value={lead.name}
                    onChange={(e) => setLead((v) => ({ ...v, name: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900/30 focus:ring-2 focus:ring-slate-900/10"
                    placeholder="예) 김민지"
                    autoComplete="name"
                  />

                  <label className="mt-4 block text-sm font-semibold text-stone-800">연락처</label>
                  <input
                    value={lead.phone}
                    onChange={(e) => setLead((v) => ({ ...v, phone: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900/30 focus:ring-2 focus:ring-slate-900/10"
                    placeholder="예) 010-1234-5678"
                    inputMode="tel"
                    autoComplete="tel"
                  />

                  <label className="mt-4 block text-sm font-semibold text-stone-800">지역(동/구)</label>
                  <input
                    value={lead.area}
                    onChange={(e) => setLead((v) => ({ ...v, area: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900/30 focus:ring-2 focus:ring-slate-900/10"
                    placeholder="예) 해운대구 / 수영구"
                    autoComplete="address-level2"
                  />

                  <div className="mt-5 grid gap-3">
                    <Button
                      className="w-full bg-yellow-400 text-stone-900 shadow-md hover:bg-yellow-300"
                      onClick={onLeadSubmit}
                    >
                      카카오톡으로 유니슬렛 상담
                      <MessageCircle className="h-5 w-5" />
                    </Button>

                    <Button as="a" href={telHref} className="w-full bg-slate-900 text-stone-50 hover:bg-slate-800">
                      전화로 빠르게 상담
                      <PhoneCall className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Footer */}
        <footer className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-stone-600 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="font-semibold text-stone-800">{BRAND.name}</div>
              <div className="flex flex-wrap gap-3">
                <a className="hover:text-stone-900" href={telHref}>
                  {BRAND.phone}
                </a>
                <span className="text-stone-300">|</span>
                <span>{BRAND.serviceArea}</span>
                <span className="text-stone-300">|</span>
                <span>{BRAND.bizHours}</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-stone-500">
              본 페이지 이미지는 데모용입니다. 실제 유니슬렛 시공 사진으로 교체하면 전환율이 올라갑니다.
            </div>
          </div>
        </footer>
      </main>

      {/* Floating buttons */}
      <div className="fixed bottom-4 right-4 z-[9998] flex flex-col gap-2">
        <Button
          as="a"
          href={KAKAO_CHAT_URL}
          className="bg-yellow-400 text-stone-900 shadow-lg hover:bg-yellow-300"
        >
          <MessageCircle className="h-5 w-5" />
          카톡
        </Button>
        <Button as="a" href={telHref} className="bg-slate-900 text-stone-50 shadow-lg hover:bg-slate-800">
          <PhoneCall className="h-5 w-5" />
          전화
        </Button>
        <button
          onClick={() => scrollToId("top")}
          className="grid h-12 w-12 place-items-center rounded-2xl border border-stone-200 bg-white/90 text-stone-800 shadow-md backdrop-blur transition hover:bg-white active:scale-[0.99]"
          aria-label="맨 위로"
        >
          <ArrowUpRight className="h-5 w-5 rotate-[-90deg]" />
        </button>
      </div>
    </div>
  );
}