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
  AlertTriangle,
  HelpCircle,
  Sparkle,
} from "lucide-react";

/** [설정] 카카오톡 오픈채팅 링크 */
const KAKAO_CHAT_URL = "https://open.kakao.com/o/sH00Mn6h";

/** 브랜드 정보 (여기만 바꾸면 전체 반영) */
const BRAND = {
  name: "더슬렛",
  nameEn: "THE SLAT",
  tagline: "프리미엄 유니슬렛 전문",
  serviceArea: "부산 전지역",
  phone: "010-1234-5678",
  bizHours: "매일 09:00-20:00",
  // 아래는 “사실이면” 쓰세요. 아니라면 비워두거나 문장 수정 권장.
  // proofLine: "유니슬렛 전문 실측 기준으로 견적부터 시공까지 책임집니다.",
  proofLine: "유니슬렛 전문 실측 기준으로, 견적부터 시공까지 한 번에 진행합니다.",
};

/** Unsplash 랜덤 (매 빌드/새로고침마다 조금씩 달라질 수 있음) */
const unsplash = (sig, query) =>
  `https://source.unsplash.com/1600x1000/?${encodeURIComponent(query)}&sig=${sig}`;

const IMAGES = [
  unsplash(1, "interior,living room,window,modern"),
  unsplash(2, "interior,apartment,living room,curtain"),
  unsplash(3, "interior,window,sunlight,home"),
  unsplash(4, "interior,modern,luxury,hotel style"),
  unsplash(5, "apartment,living room,window"),
  unsplash(6, "modern home,interior,neutral tones"),
  unsplash(7, "interior,window,light,shadow"),
  unsplash(8, "minimal interior,living room,beige"),
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

/** 섹션 애니메이션 */
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

function Button({ children, className = "", onClick, as = "button", href, disabled, type }) {
  const Comp = as;
  return (
    <Comp
      href={href}
      onClick={onClick}
      disabled={disabled}
      type={type}
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
    const t = setTimeout(onClose, 2400);
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
      <div className="rounded-2xl border border-stone-200 bg-white/90 px-4 py-3 text-sm text-stone-800 shadow-xl backdrop-blur whitespace-nowrap">
        {message}
      </div>
    </div>
  );
}

function Modal({ open, title, children, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-stone-950/50 p-4">
      <div className="w-full max-w-md rounded-[2rem] border border-stone-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 p-6">
          <div>
            <div className="text-base font-extrabold text-stone-900">{title}</div>
            <div className="mt-1 text-sm text-stone-600">PC에서는 전화 앱이 열리지 않아서 번호를 화면에 표시합니다.</div>
          </div>
          <button
            className="grid h-10 w-10 place-items-center rounded-2xl border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
            onClick={onClose}
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}

function Accordion({ items }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div className="grid gap-2">
      {items.map((it, idx) => {
        const open = idx === openIdx;
        return (
          <div key={it.q} className="rounded-3xl border border-stone-200 bg-white">
            <button
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpenIdx(open ? -1 : idx)}
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-slate-900" />
                <div className="text-sm font-bold text-stone-900">{it.q}</div>
              </div>
              <ChevronRight className={classNames("h-5 w-5 text-stone-500 transition", open ? "rotate-90" : "")} />
            </button>
            <div
              className={classNames(
                "grid transition-[grid-template-rows] duration-300",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden px-5 pb-4 text-sm leading-relaxed text-stone-700">
                {it.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const NAV = useMemo(
    () => [
      { id: "usp", label: "왜 더슬렛?" },
      { id: "diagnosis", label: "3초 진단" },
      { id: "unislat", label: "유니슬렛" },
      { id: "gallery", label: "사례" },
      { id: "faq", label: "FAQ" },
      { id: "reviews", label: "후기" },
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

  const [phoneOpen, setPhoneOpen] = useState(false);

  const [lead, setLead] = useState({ name: "", phone: "", area: "" });

  // “개인화(내 얘기 같게)” — 외부 API 없이, 선택값을 CTA 메시지에 반영
  const [fit, setFit] = useState({
    windowType: "대형 통창",
    priority: "프라이버시",
    issue: "외부 시선",
  });

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
      "유니슬렛",
      "UniSlat",
      "스마트커튼",
      "버티컬",
      "채광조절",
      "프라이버시",
      "대형창",
      "슬라이딩도어",
      "더슬렛",
      "부산",
      "해운대",
      "센텀",
      "수영",
      "남천",
      "연산",
      "동래",
      "명지",
    ],
    []
  );

  useEffect(() => {
    document.title = `${BRAND.name} | ${BRAND.tagline}`;
  }, []);

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

  const isMobile = () =>
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

  const telHref = `tel:${BRAND.phone.replaceAll("-", "")}`;

  const handlePhoneClick = (e) => {
    if (!isMobile()) {
      e.preventDefault();
      setPhoneOpen(true); // PC에서는 “화면에 번호 표시”
    }
  };

  const fitSummary = useMemo(() => {
    return `창 형태: ${fit.windowType} / 우선순위: ${fit.priority} / 고민: ${fit.issue}`;
  }, [fit]);

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
      `[${BRAND.name} 유니슬렛 무료 견적 요청]\n` +
      `이름: ${name}\n` +
      `연락처: ${phone}\n` +
      `지역: ${area}\n` +
      `선택 정보: ${fitSummary}\n` +
      `요청: 유니슬렛 무료 방문 실측 + 맞춤 견적 문의드립니다.\n`;

    try {
      await copyToClipboard(msg);
      setToastMsg("요청 내용이 복사되었습니다. 카카오톡에서 붙여넣기만 하시면 됩니다.");
      setToastOpen(true);
      setTimeout(() => {
        window.open(KAKAO_CHAT_URL, "_blank", "noopener,noreferrer");
      }, 900);
    } catch {
      setToastMsg("복사에 실패했습니다. 아래 예시를 수동으로 복사해 주세요.");
      setToastOpen(true);
      window.open(KAKAO_CHAT_URL, "_blank", "noopener,noreferrer");
    }
  };

  const FAQ_ITEMS = useMemo(
    () => [
      {
        q: "가격이 제일 걱정돼요. 대략 어느 정도인가요?",
        a: (
          <div className="grid gap-2">
            <div>
              유니슬렛은 <b>창 크기/분할/레일 구성/원단(또는 슬랫) 옵션</b>에 따라 가격 차이가 큽니다.
              그래서 방문 실측에서 “정확한 구성”을 잡고 <b>견적 항목(자재/설치/부자재)</b>을 나눠 투명하게 안내하는 방식이 가장 안전합니다.
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs text-stone-600">
              팁: “가장 많이 하는 구성 2~3가지”를 사장님 실제 기준으로 문장 한 줄 추가하면 전환율이 올라갑니다.
            </div>
          </div>
        ),
      },
      {
        q: "버티컬이랑 뭐가 달라요?",
        a: (
          <div className="grid gap-2">
            <div>
              유니슬렛은 <b>버티컬처럼 넓게 열리고</b>, <b>블라인드처럼 각도로 빛을 조절</b>하는 게 핵심입니다.
              “열림 + 각도조절”을 한 번에 가져가서, 대형창/슬라이딩 도어에서 만족도가 높습니다.
            </div>
          </div>
        ),
      },
      {
        q: "청소/관리 어렵지 않나요?",
        a: (
          <div className="grid gap-2">
            <div>
              유니슬렛은 구조상 먼지 걱정이 생길 수 있어요. 대신 <b>오염된 날개만 분리해서 관리</b>가 가능한 구성이 많습니다.
              방문 시 “집 구조/반려동물/아이” 환경까지 보고 관리 난이도를 낮춘 옵션으로 추천드립니다.
            </div>
          </div>
        ),
      },
      {
        q: "시공은 얼마나 걸려요?",
        a: (
          <div className="grid gap-2">
            <div>
              보통은 <b>현장 상황(창 수/크기/레일 작업)</b>에 따라 달라집니다. 상담 단계에서 예상 소요 시간을 먼저 말씀드리고 진행합니다.
            </div>
          </div>
        ),
      },
      {
        q: "A/S는 어떻게 해줘요?",
        a: (
          <div className="grid gap-2">
            <div>
              유니슬렛은 “수평/작동감/마감”이 중요해서 설치 직후 점검이 핵심입니다.
              사장님 실제 정책에 맞춰 <b>A/S 기준(기간/범위/유상 조건)</b>을 명확히 적으면 신뢰가 크게 올라갑니다.
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs text-stone-600">
              TODO: 사장님 실제 A/S 정책 문장으로 교체 추천 (예: 설치 후 ○개월 무상 점검 등)
            </div>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-yellow-200 selection:text-stone-900">
      <Toast open={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />

      {/* Phone modal (PC 전용 표시) */}
      <Modal open={phoneOpen} title={`${BRAND.name} 상담 전화`} onClose={() => setPhoneOpen(false)}>
        <div className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
          <div className="text-xs font-semibold text-stone-700">전화번호</div>
          <div className="mt-2 text-3xl font-black tracking-tight text-stone-900">{BRAND.phone}</div>
          <div className="mt-2 text-sm text-stone-600">상담 가능 시간: {BRAND.bizHours}</div>
          <div className="mt-4 grid gap-2">
            <Button
              className="w-full bg-slate-900 text-stone-50 hover:bg-slate-800"
              onClick={() => setPhoneOpen(false)}
            >
              확인
              <CheckCircle2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Modal>

      {/* Scroll progress */}
      <div className="fixed left-0 top-0 z-[9998] h-1 w-full bg-transparent">
        <div className="h-1 bg-slate-900/70 transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      {/* Header */}
      <header
        className={classNames(
          "sticky top-0 z-[9997] border-b",
          scrolled ? "border-stone-200 bg-white/85 backdrop-blur" : "border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={() => scrollToId("top")}
            className="flex items-center gap-3 rounded-xl px-2 py-1 text-left group"
            aria-label="홈으로"
          >
            {/* 로고 느낌 (슬랫 3개) */}
            <div className={`flex gap-[3px] transition-colors duration-300 ${scrolled ? "text-stone-900" : "text-stone-900 md:text-white"}`}>
              <div className="w-1.5 h-7 bg-current rounded-sm group-hover:h-5 transition-all duration-300" />
              <div className="w-1.5 h-7 bg-current rounded-sm transition-all duration-300" />
              <div className="w-1.5 h-7 bg-current rounded-sm group-hover:h-5 transition-all duration-300" />
            </div>
            <div className="leading-none flex flex-col justify-center">
              <div className={`text-lg font-black tracking-tighter ${scrolled ? "text-stone-900" : "text-stone-900 md:text-white"}`}>
                {BRAND.name}
              </div>
              <div className={`text-[9px] tracking-[0.2em] uppercase font-medium ${scrolled ? "text-stone-500" : "text-stone-600 md:text-white/80"}`}>
                {BRAND.nameEn} · UNISLAT
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 md:flex">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => scrollToId(n.id)}
                  className={`rounded-xl px-3 py-2 text-sm transition hover:bg-stone-100 ${
                    scrolled ? "text-stone-700" : "text-stone-700 md:text-white/90 md:hover:bg-white/10"
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </nav>

            <Button className="bg-yellow-400 text-stone-900 shadow-sm hover:bg-yellow-300" onClick={() => scrollToId("cta")}>
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

      <main id="top">
        {/* Hero */}
        <section className="relative">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/40 to-stone-50" />

          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-stone-50 backdrop-blur mb-6">
                <MapPin className="h-4 w-4" />
                {BRAND.serviceArea} · 무료 방문 실측
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-stone-50 mb-6 drop-shadow-sm leading-tight">
                “빛은 조절하고, 시선은 막고,”<br />
                거실은 <span className="text-yellow-400">더 넓어 보이게</span>
              </h1>

              <p className="text-lg md:text-xl leading-relaxed text-stone-200 mb-8 font-light">
                블라인드의 기능 + 커튼의 우아함을 하나로.<br />
                <strong className="text-white font-semibold">유니슬렛(UniSlat)</strong>이 체감되는 이유는 “각도 조절”입니다.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="bg-yellow-400 text-stone-900 shadow-lg hover:bg-yellow-300 px-8 py-4 text-base" onClick={() => scrollToId("cta")}>
                  1분 무료 견적 신청
                  <MessageCircle className="h-5 w-5" />
                </Button>

                <Button
                  as="a"
                  href={telHref}
                  onClick={handlePhoneClick}
                  className="border border-white/30 bg-white/10 text-stone-50 hover:bg-white/15 px-8 py-4 text-base"
                >
                  전화 상담
                  <PhoneCall className="h-5 w-5" />
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <Chip>각도 조절</Chip>
                <Chip>프라이버시</Chip>
                <Chip>대형창 최적</Chip>
                <Chip>방문 실측 무료</Chip>
              </div>

              <div className="mt-6 rounded-3xl border border-white/20 bg-white/10 p-4 text-sm text-stone-100 backdrop-blur">
                <div className="flex items-start gap-2">
                  <Sparkle className="mt-0.5 h-5 w-5 text-yellow-300" />
                  <div>
                    <div className="font-semibold">{BRAND.proofLine}</div>
                    <div className="mt-1 text-stone-200/90">“애매한 견적”이 아니라, 창/동선/채광 기준으로 맞춥니다.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* USP */}
        <section id="usp" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Reveal>
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold tracking-tight">왜 “유니슬렛 전문”이 중요한가</h2>
              <p className="mt-2 text-sm text-stone-600">
                유니슬렛은 일반 커튼/블라인드처럼 “대충 재서 달면” 결과가 갈립니다. 실측 기준이 곧 결과입니다.
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
                  <Ruler className="h-6 w-6 text-slate-900" />
                </div>
                <h3 className="text-lg font-bold">유니슬렛 전용 실측 기준</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  바닥 간격, 레일 동선, 각도 시야가 예쁘게 보이는 기준까지 잡습니다. “가장 자주 보는 각도”가 결과를 만듭니다.
                </p>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
                  <RotateCw className="h-6 w-6 text-slate-900" />
                </div>
                <h3 className="text-lg font-bold">빛을 “쓸 만큼만”</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  같은 햇빛이라도 각도로 “눈부심은 줄이고, 채광은 살립니다.” 낮/밤/TV 시청까지 사용 시나리오로 설계합니다.
                </p>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
                  <Wrench className="h-6 w-6 text-slate-900" />
                </div>
                <h3 className="text-lg font-bold">설치 후까지 책임(점검)</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  수평/작동감/마감 체크 후 사용법을 안내합니다. “설치가 끝”이 아니라 “사용이 편해야” 만족이 남습니다.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Problem agitation (불안/불편을 정확히 짚어주면 전환이 오른다) */}
        <section className="bg-stone-100/60 border-y border-stone-200">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <Reveal>
              <div className="grid gap-6 md:grid-cols-2 md:items-center">
                <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
                  <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                    <AlertTriangle className="h-4 w-4" />
                    고객이 망설이는 이유
                  </div>
                  <h2 className="mt-4 text-2xl font-extrabold tracking-tight">
                    “예쁘긴 한데… 우리 집엔 맞을까?”<br />이 질문이 들면 정상입니다.
                  </h2>
                  <div className="mt-4 grid gap-3 text-sm text-stone-700">
                    {[
                      "대형창은 눈부심/시선 둘 다 잡기 어렵다",
                      "버티컬은 답답해 보이고, 커튼은 관리가 번거롭다",
                      "견적이 ‘대충’ 나오면 설치 후 후회한다",
                    ].map((t) => (
                      <div key={t} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-slate-900" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
                    그래서 더슬렛은 <b>“방문 실측 + 사용 시나리오(낮/밤/TV/동선)”</b> 기준으로 설계를 잡고 견적을 냅니다.
                  </div>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
                  <div className="text-lg font-bold flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-slate-900" />
                    고객이 실제로 원하는 결과
                  </div>
                  <div className="mt-3 grid gap-3 text-sm text-stone-700">
                    {[
                      { t: "낮에는 채광, 밤에는 프라이버시", d: "각도 조절로 밸런스를 잡습니다." },
                      { t: "거실이 넓어 보이는 세로 라인", d: "세로 슬랫이 시야를 정리해 줍니다." },
                      { t: "관리 스트레스 최소화", d: "오염/먼지/생활패턴에 맞는 구성 추천." },
                    ].map((x) => (
                      <div key={x.t} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                        <div className="font-semibold text-stone-900">{x.t}</div>
                        <div className="mt-1 text-stone-600">{x.d}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 3초 진단 (개인화 + 미세한 커밋) */}
        <section id="diagnosis" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">3초 진단: 우리 집엔 어떤 유니슬렛이 맞을까?</h2>
                <p className="mt-2 text-sm text-stone-600">
                  선택하신 내용이 상담 메시지에 자동으로 들어갑니다. (AI/유료 API 없이 작동)
                </p>
              </div>
              <Button className="hidden border border-stone-200 bg-white text-stone-800 hover:bg-stone-50 sm:inline-flex" onClick={() => scrollToId("cta")}>
                이대로 상담하기
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-bold text-stone-900">1) 창 형태</div>
                <div className="mt-3 grid gap-2">
                  {["대형 통창", "슬라이딩 도어", "베란다/확장형", "안방 창"].map((v) => (
                    <button
                      key={v}
                      onClick={() => setFit((s) => ({ ...s, windowType: v }))}
                      className={classNames(
                        "rounded-2xl border px-4 py-3 text-left text-sm transition",
                        fit.windowType === v ? "border-slate-900 bg-stone-50" : "border-stone-200 bg-white hover:bg-stone-50"
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-bold text-stone-900">2) 우선순위</div>
                <div className="mt-3 grid gap-2">
                  {["프라이버시", "채광", "분위기(호텔 무드)", "관리 편함"].map((v) => (
                    <button
                      key={v}
                      onClick={() => setFit((s) => ({ ...s, priority: v }))}
                      className={classNames(
                        "rounded-2xl border px-4 py-3 text-left text-sm transition",
                        fit.priority === v ? "border-slate-900 bg-stone-50" : "border-stone-200 bg-white hover:bg-stone-50"
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-bold text-stone-900">3) 가장 불편한 점</div>
                <div className="mt-3 grid gap-2">
                  {["외부 시선", "눈부심/TV 반사", "먼지/관리", "동선(문 열림)"].map((v) => (
                    <button
                      key={v}
                      onClick={() => setFit((s) => ({ ...s, issue: v }))}
                      className={classNames(
                        "rounded-2xl border px-4 py-3 text-left text-sm transition",
                        fit.issue === v ? "border-slate-900 bg-stone-50" : "border-stone-200 bg-white hover:bg-stone-50"
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
                  <div className="text-xs font-semibold text-stone-600">선택 요약</div>
                  <div className="mt-1 font-semibold text-stone-900">{fitSummary}</div>
                  <button
                    onClick={() => scrollToId("cta")}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-slate-900 underline"
                  >
                    이 조건으로 상담 요청하기 <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

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
                  <h2 className="mt-4 text-2xl font-extrabold tracking-tight">세로 슬랫 구조로 “열림 + 각도조절”을 한 번에</h2>
                  <p className="mt-4 text-sm leading-relaxed text-stone-700">
                    유니슬렛은 버티컬처럼 넓게 열리고, 블라인드처럼 각도로 빛을 조절합니다.
                    큰 창/베란다 문/슬라이딩 도어에서 특히 만족도가 높습니다.
                  </p>

                  <ul className="mt-5 grid gap-3 text-sm text-stone-700">
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-slate-900" />
                      <span>각도 조절로 채광/프라이버시 밸런스를 맞춥니다.</span>
                    </li>
                    <li className="flex gap-2">
                      <Wind className="mt-0.5 h-5 w-5 text-slate-900" />
                      <span>세로 라인이 공간을 정리해, 거실이 넓어 보입니다.</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-slate-900" />
                      <span>오염/생활패턴에 맞춘 옵션으로 관리 난이도를 낮출 수 있습니다.</span>
                    </li>
                  </ul>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button className="bg-slate-900 text-stone-50 hover:bg-slate-800" onClick={() => scrollToId("cta")}>
                      우리 집 맞춤 상담
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    <Button as="a" href={telHref} onClick={handlePhoneClick} className="border border-stone-300 bg-white text-stone-800 hover:bg-stone-50">
                      전화 문의
                      <PhoneCall className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
                  <h3 className="text-lg font-bold">인기 검색어</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">요즘 문의가 많은 키워드 예시입니다.</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {SEO_KEYWORDS.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 p-4">
                    <div className="text-xs font-semibold text-stone-700">예시 검색어</div>
                    <div className="mt-2 grid gap-1 text-sm text-stone-700">
                      <div>해운대 유니슬렛 견적</div>
                      <div>슬라이딩도어 유니슬렛 추천</div>
                      <div>대형창 프라이버시 커튼 대안</div>
                    </div>
                  </div>

                  <div className="mt-6 text-sm text-stone-600">
                    * 실제 시공 사진/후기 업데이트가 쌓일수록 자연 유입이 좋아집니다.
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
                <p className="mt-2 text-sm text-stone-600">실제 공간의 분위기를 확인해보세요. (현재는 데모 이미지)</p>
              </div>
              <Button className="hidden border border-stone-200 bg-white text-stone-800 hover:bg-stone-50 sm:inline-flex" onClick={() => scrollToId("cta")}>
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
                      <div className="mt-1 text-xs text-stone-600">상담 → 실측 → 제작 → 시공</div>
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
              <p className="mt-2 text-sm text-stone-600">유니슬렛은 “실측 + 동선 + 채광”이 핵심이라 방문 상담이 결과를 좌우합니다.</p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "상담",
                    desc: "창/동선/원하는 분위기와 우선순위를 빠르게 정리합니다.",
                    icon: <MessageCircle className="h-6 w-6" />,
                  },
                  {
                    title: "무료 실측",
                    desc: "샘플 확인 + 정확 실측으로 각도와 시야가 예쁜 구성을 잡습니다.",
                    icon: <Ruler className="h-6 w-6" />,
                  },
                  {
                    title: "시공 & 점검",
                    desc: "수평/작동감/마감 체크 후 사용 방법까지 안내합니다.",
                    icon: <ShieldCheck className="h-6 w-6" />,
                  },
                ].map((s) => (
                  <div key={s.title} className="rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm transition hover:bg-stone-100/60">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
                      {s.icon}
                    </div>
                    <div className="text-lg font-bold">{s.title}</div>
                    <div className="mt-2 text-sm leading-relaxed text-stone-600">{s.desc}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-stone-200 bg-stone-50 p-5 text-sm text-stone-700">
                <b>중요:</b> “원하시는 날짜”가 있다면 먼저 상담 요청을 추천드립니다. (일정/제작 리드타임 때문)
              </div>
            </Reveal>
          </div>
        </section>

        {/* FAQ (불안 제거 섹션) */}
        <section id="faq" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Reveal>
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold tracking-tight">자주 묻는 질문</h2>
              <p className="mt-2 text-sm text-stone-600">구매 직전의 불안/의문을 여기서 정리하면, 상담 전환이 올라갑니다.</p>
            </div>
            <Accordion items={FAQ_ITEMS} />
          </Reveal>
        </section>

        {/* Reviews */}
        <section id="reviews" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">고객 후기</h2>
                <p className="mt-2 text-sm text-stone-600">후기는 “사회적 증거”입니다. 실제 후기가 쌓일수록 문의가 더 쉬워집니다.</p>
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
                  text: "버티컬 느낌인데 훨씬 부드럽고, 각도 조절이 깔끔해서 거실 분위기가 확 바뀌었어요. 방문 실측이 진짜 도움됐습니다.",
                },
                {
                  name: "이OO",
                  text: "큰 창이라 고민했는데 동선까지 고려해서 추천해주셔서 만족합니다. 낮에는 채광, 밤에는 프라이버시가 잘 잡혀요.",
                },
                {
                  name: "박OO",
                  text: "설치 후 작동감까지 체크하고 가셔서 믿음이 갔습니다. 관리 방법도 자세히 알려주셨어요.",
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

            <div className="mt-6 rounded-3xl border border-stone-200 bg-stone-50 p-5 text-sm text-stone-700">
              <b>추천:</b> 실후기(카톡 캡처/네이버 리뷰)를 “허락 받고” 이미지로 올리면 신뢰도가 확 뛰어오릅니다.
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
                      <span>개인정보는 상담 목적 외 사용하지 않습니다. (서버 저장 없음)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-slate-900" />
                      <span>상담 가능 시간: {BRAND.bizHours}</span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl border border-stone-200 bg-stone-50 p-5">
                    <div className="text-xs font-semibold text-stone-700">복사되는 메시지 예시</div>
                    <pre className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-stone-600">{`[${BRAND.name} 유니슬렛 무료 견적 요청]
이름: 홍길동
연락처: 010-1234-5678
지역: 해운대구
선택 정보: ${fitSummary}
요청: 유니슬렛 무료 방문 실측 + 맞춤 견적 문의드립니다.`}</pre>
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
                    <Button className="w-full bg-yellow-400 text-stone-900 shadow-md hover:bg-yellow-300" onClick={onLeadSubmit}>
                      카카오톡으로 상담 요청
                      <MessageCircle className="h-5 w-5" />
                    </Button>

                    <Button as="a" href={telHref} onClick={handlePhoneClick} className="w-full bg-slate-900 text-stone-50 hover:bg-slate-800">
                      전화로 빠르게 상담
                      <PhoneCall className="h-5 w-5" />
                    </Button>

                    <div className="text-xs text-stone-500">버튼을 누르면 새 창에서 카카오톡 오픈채팅이 열립니다.</div>
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
                <a className="hover:text-stone-900" href={telHref} onClick={handlePhoneClick}>
                  {BRAND.phone}
                </a>
                <span className="text-stone-300">|</span>
                <span>{BRAND.serviceArea}</span>
                <span className="text-stone-300">|</span>
                <span>{BRAND.bizHours}</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-stone-500">
              * 현재 이미지는 데모용 랜덤 이미지입니다. 실제 시공 사진으로 교체하면 전환율이 크게 올라갑니다.
            </div>
          </div>
        </footer>
      </main>

      {/* Floating buttons (우측) */}
      <div className="fixed bottom-4 right-4 z-[9998] hidden sm:flex flex-col gap-2">
        <Button as="a" href={KAKAO_CHAT_URL} className="bg-yellow-400 text-stone-900 shadow-lg hover:bg-yellow-300">
          <MessageCircle className="h-5 w-5" />
          카톡
        </Button>
        <Button as="a" href={telHref} onClick={handlePhoneClick} className="bg-slate-900 text-stone-50 shadow-lg hover:bg-slate-800">
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

      {/* Mobile Bottom Bar (전환용 핵심) */}
      <div className="fixed bottom-0 left-0 right-0 z-[9998] sm:hidden border-t border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="grid grid-cols-2 gap-3">
            <Button as="a" href={KAKAO_CHAT_URL} className="w-full bg-yellow-400 text-stone-900 shadow hover:bg-yellow-300">
              <MessageCircle className="h-5 w-5" />
              카톡 상담
            </Button>
            <Button as="a" href={telHref} onClick={handlePhoneClick} className="w-full bg-slate-900 text-stone-50 hover:bg-slate-800">
              <PhoneCall className="h-5 w-5" />
              전화
            </Button>
          </div>
          <div className="mt-2 text-center text-[11px] text-stone-500">
            {BRAND.serviceArea} · 방문 실측 무료 · {BRAND.bizHours}
          </div>
        </div>
      </div>

      {/* Mobile bar 때문에 하단 여백 */}
      <div className="h-24 sm:hidden" />
    </div>
  );
}
