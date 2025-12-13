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
  Info,
  Home,
  Sparkle,
} from "lucide-react";

/** [설정] 카카오톡 오픈채팅 링크 */
const KAKAO_CHAT_URL = "https://open.kakao.com/o/sH00Mn6h";

/** 브랜드 정보 */
const BRAND = {
  name: "THE SLAT",
  tagline: "프리미엄 유니슬렛 전문",
  serviceArea: "부산 전지역",
  phone: "010-1234-5678",
  bizHours: "매일 09:00-20:00",
  asPolicy: "설치 후 1년 무상 A/S (제품/환경에 따라 일부 예외)",
};

/** 이미지: 데모용(운영 시 실제 시공사진으로 교체 권장) */
const unsplash = (sig, w = 1600, h = 900) =>
  `https://source.unsplash.com/${w}x${h}/?interior,living-room,window,blinds&sig=${sig}`;

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
      { threshold: 0.12 }
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
      <div className="rounded-2xl border border-stone-200 bg-white/90 px-4 py-3 text-sm text-stone-800 shadow-xl backdrop-blur whitespace-nowrap">
        {message}
      </div>
    </div>
  );
}

/** PC에서 전화번호를 “화면에 띄우는” 오버레이 */
function PhoneOverlay({ open, onClose, phone }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/45 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-[2rem] bg-white shadow-2xl border border-stone-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-stone-900">상담 전화번호</div>
              <div className="mt-1 text-xs text-stone-600">
                PC에서는 전화 연결이 어려워서 번호를 화면에 띄워드립니다.
              </div>
            </div>
            <button
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-2xl border border-stone-200 bg-stone-50 text-stone-800 hover:bg-stone-100"
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 p-5">
            <div className="text-xs font-semibold text-stone-700">전화</div>
            <div className="mt-2 text-2xl font-black tracking-tight text-stone-900">{phone}</div>
            <div className="mt-2 text-xs text-stone-600">
              휴대폰에서 직접 입력하거나, 화면을 찍어서 사용하세요.
            </div>
          </div>

          <div className="mt-5 grid gap-2">
            <Button className="w-full bg-slate-900 text-white hover:bg-slate-800" onClick={onClose}>
              확인
              <CheckCircle2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-stone-200 bg-white text-xs text-stone-500">
          상담 가능 시간: {BRAND.bizHours}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const NAV = useMemo(
    () => [
      { id: "usp", label: "왜 더슬렛?" },
      { id: "about", label: "소개" },
      { id: "unislat", label: "제품" },
      { id: "gallery", label: "사례" },
      { id: "process", label: "과정" },
      { id: "reviews", label: "후기" },
      { id: "cta", label: "무료 상담" },
    ],
    []
  );

  const heroBg = useMemo(() => unsplash(1, 1800, 1100), []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [phoneOverlayOpen, setPhoneOverlayOpen] = useState(false);

  const [lead, setLead] = useState({ name: "", phone: "", area: "", note: "" });
  const [consent, setConsent] = useState(false);

  const GALLERY = useMemo(
    () => [
      { apt: "해운대 힐스테이트", style: "유니슬렛 · 데이(채광) 중심", sig: 11 },
      { apt: "센텀 더샵", style: "유니슬렛 · 디밍(눈부심 완화)", sig: 12 },
      { apt: "명지 더샵", style: "유니슬렛 · 프라이버시 강조", sig: 13 },
      { apt: "연산 롯데캐슬", style: "유니슬렛 · 거실 대형창", sig: 14 },
      { apt: "동래 래미안", style: "유니슬렛 · 톤온톤 믹스", sig: 15 },
      { apt: "서면 아이파크", style: "유니슬렛 · 호텔 무드", sig: 16 },
      { apt: "수영 SK뷰", style: "유니슬렛 · 베란다/슬라이딩 도어", sig: 17 },
      { apt: "남천 푸르지오", style: "유니슬렛 · 낮/밤 사용성", sig: 18 },
    ],
    []
  );

  useEffect(() => {
    // SEO(최소한의 메타 설정) - index.html에서 하는 게 가장 좋지만, 운영 편의상 여기서도 보강
    document.title = `${BRAND.name} | ${BRAND.tagline}`;
    const ensureMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    ensureMeta(
      "description",
      `${BRAND.serviceArea} 유니슬렛(블라인드+버티컬) 무료 방문 실측/견적. ${BRAND.name} ${BRAND.tagline}`
    );
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

  const notify = (msg) => {
    setToastMsg(msg);
    setToastOpen(true);
  };

  const normalizePhone = (value) => {
    const digits = (value || "").replace(/\D/g, "").slice(0, 11);
    // 010XXXXXXXX 형태 기준(국내 휴대폰)
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const onLeadSubmit = async () => {
    const name = lead.name.trim();
    const phone = lead.phone.trim();
    const area = lead.area.trim();
    const note = lead.note.trim();

    if (!name || !phone || !area) {
      notify("이름/연락처/지역을 모두 입력해 주세요.");
      return;
    }
    if (!consent) {
      notify("개인정보 수집·이용 동의(필수)에 체크해 주세요.");
      return;
    }

    const msg =
      `[${BRAND.name} 무료 견적 요청]\n` +
      `이름: ${name}\n` +
      `연락처: ${phone}\n` +
      `지역: ${area}\n` +
      (note ? `요청사항: ${note}\n` : "") +
      `요청: 유니슬렛 무료 방문 실측 및 견적 문의드립니다.\n`;

    try {
      await copyToClipboard(msg);
      notify("요청 내용이 복사되었습니다. 카카오톡에서 붙여넣기만 하시면 됩니다.");
      setTimeout(() => {
        window.open(KAKAO_CHAT_URL, "_blank", "noopener,noreferrer");
      }, 900);
    } catch {
      notify("복사에 실패했습니다. 아래 예시를 참고해 카카오톡에 입력해 주세요.");
      window.open(KAKAO_CHAT_URL, "_blank", "noopener,noreferrer");
    }
  };

  /** 전화 클릭: 모바일은 tel, PC는 오버레이로 번호 표시 */
  const telHref = `tel:${BRAND.phone.replaceAll("-", "")}`;
  const handlePhoneClick = (e) => {
    const isMobile =
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

    if (!isMobile) {
      e.preventDefault();
      setPhoneOverlayOpen(true);
    }
  };

  const leaveReviewToKakao = () => {
    const msg =
      `[${BRAND.name} 후기 남기기]\n` +
      `성함(또는 이니셜): \n` +
      `시공 지역/아파트: \n` +
      `후기 내용: \n` +
      `사진(가능하면): \n`;
    copyToClipboard(msg).catch(() => {});
    window.open(KAKAO_CHAT_URL, "_blank", "noopener,noreferrer");
    notify("후기 양식을 복사했습니다. 카카오톡에 붙여넣어 보내주시면 됩니다.");
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-yellow-200 selection:text-stone-900">
      <Toast open={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />
      <PhoneOverlay open={phoneOverlayOpen} onClose={() => setPhoneOverlayOpen(false)} phone={BRAND.phone} />

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
          scrolled ? "border-stone-200 bg-white/85 backdrop-blur" : "border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={() => scrollToId("top")}
            className="flex items-center gap-3 rounded-xl px-2 py-1 text-left group"
            aria-label="홈으로"
          >
            {/* THE SLAT Custom Logo (Bar Icon) */}
            <div
              className={classNames(
                "flex gap-[3px] transition-colors duration-300",
                scrolled ? "text-stone-900" : "text-stone-900 md:text-white"
              )}
            >
              <div className="w-1.5 h-7 bg-current rounded-sm group-hover:h-5 transition-all duration-300" />
              <div className="w-1.5 h-7 bg-current rounded-sm transition-all duration-300" />
              <div className="w-1.5 h-7 bg-current rounded-sm group-hover:h-5 transition-all duration-300" />
            </div>
            <div className="leading-none flex flex-col justify-center">
              <div
                className={classNames(
                  "text-lg font-black tracking-tighter",
                  scrolled ? "text-stone-900" : "text-stone-900 md:text-white"
                )}
              >
                {BRAND.name}
              </div>
              <div
                className={classNames(
                  "text-[9px] tracking-[0.2em] uppercase font-medium",
                  scrolled ? "text-stone-500" : "text-stone-600 md:text-white/80"
                )}
              >
                PREMIUM UNISLAT
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 md:flex">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => scrollToId(n.id)}
                  className={classNames(
                    "rounded-xl px-3 py-2 text-sm transition",
                    scrolled
                      ? "text-stone-700 hover:bg-stone-100"
                      : "text-stone-700 md:text-white/90 md:hover:bg-white/10"
                  )}
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
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/35 to-stone-50" />
          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-stone-50 backdrop-blur mb-6">
                <MapPin className="h-4 w-4" />
                {BRAND.serviceArea} 무료 방문 실측
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-stone-50 mb-6 drop-shadow-sm leading-tight">
                커튼을 걷지 마세요,
                <br />
                그냥 <span className="text-yellow-400">지나가세요.</span>
              </h1>

              <p className="text-lg md:text-xl leading-relaxed text-stone-200 mb-8 font-light">
                블라인드의 기능과 커튼의 우아함을 하나로.
                <br />
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
                  onClick={handlePhoneClick}
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
                  유니슬렛은 “바닥 여유/동선/채광”이 결과를 좌우합니다. 공간에 맞춰 황금 비율을 잡아드립니다.
                </p>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
                  <RotateCw className="h-6 w-6 text-slate-900" />
                </div>
                <h3 className="text-lg font-bold">180도 채광 조절</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  스틱 하나로 암막부터 쉬폰 느낌까지. “눈부심은 줄이고, 분위기는 살리고”가 가능합니다.
                </p>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
                  <ShieldCheck className="h-6 w-6 text-slate-900" />
                </div>
                <h3 className="text-lg font-bold">A/S 보증으로 마무리</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  설치 후에도 책임집니다. 작동감/수평/마감 점검 + {BRAND.asPolicy}
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* About */}
        <section id="about" className="bg-white border-y border-stone-200">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <Reveal>
              <div className="grid gap-6 md:grid-cols-2 md:items-center">
                <div className="rounded-3xl border border-stone-200 bg-stone-50 p-7">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-700 border border-stone-200">
                    <Info className="h-4 w-4" />
                    우리가 하는 방식
                  </div>
                  <h2 className="mt-4 text-2xl font-extrabold tracking-tight">
                    “빠르게 팔기”보다
                    <br />
                    “오래 만족”에 집중합니다.
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-stone-700">
                    유니슬렛은 설치 후 체감이 큰 제품이라, 처음 설계(동선/채광/프라이버시)가 중요합니다.
                    샘플을 들고 방문해 실제 빛에서 확인하고, 생활 패턴에 맞춰 제안합니다.
                  </p>

                  <div className="mt-5 grid gap-3 text-sm text-stone-700">
                    <div className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-slate-900" />
                      <span>큰 창/슬라이딩 도어에 최적화된 구성 추천</span>
                    </div>
                    <div className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-slate-900" />
                      <span>낱장 교체/세탁 안내까지 포함(관리 난이도 낮춤)</span>
                    </div>
                    <div className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-slate-900" />
                      <span>설치 후 A/S 기준 명확히 안내</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button className="bg-slate-900 text-stone-50 hover:bg-slate-800" onClick={() => scrollToId("cta")}>
                      무료 실측 받기
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    <Button
                      as="a"
                      href={telHref}
                      onClick={handlePhoneClick}
                      className="border border-stone-300 bg-white text-stone-800 hover:bg-stone-50"
                    >
                      전화 문의
                      <PhoneCall className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
                    <Home className="h-5 w-5" />
                    이런 집에 특히 추천
                  </div>
                  <div className="mt-4 grid gap-3 text-sm text-stone-700">
                    {[
                      "거실 대형창 / 통창",
                      "베란다·슬라이딩 도어",
                      "버티컬은 답답하고, 블라인드는 밋밋했던 분",
                      "낮엔 채광, 밤엔 프라이버시를 확실히 잡고 싶은 집",
                    ].map((t) => (
                      <div key={t} className="flex gap-2">
                        <Sparkle className="mt-0.5 h-5 w-5 text-slate-900" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4">
                    <div className="text-xs font-semibold text-stone-700">상담 시 준비하면 좋은 것</div>
                    <div className="mt-2 grid gap-1 text-sm text-stone-700">
                      <div>• 창 사진 1장(전체)</div>
                      <div>• 창 앞 동선(식탁/소파/문) 정보</div>
                      <div>• 원하는 느낌(호텔/모던/따뜻함) 한 문장</div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 유니슬렛 소개 */}
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
                    유니슬렛은 버티컬처럼 넓게 열리고, 블라인드처럼 각도로 빛을 조절합니다.
                    큰 창/베란다 문/슬라이딩 도어에서 만족도가 높습니다.
                  </p>

                  <ul className="mt-5 grid gap-3 text-sm text-stone-700">
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-slate-900" />
                      <span>각도 조절로 채광/프라이버시 밸런스를 맞춥니다.</span>
                    </li>
                    <li className="flex gap-2">
                      <Wind className="mt-0.5 h-5 w-5 text-slate-900" />
                      <span>세로 슬랫 구조라 공간이 더 넓어 보입니다.</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-slate-900" />
                      <span>오염된 날개만 쏙 빼서 ‘낱장 세탁/교체’가 가능합니다.</span>
                    </li>
                  </ul>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button className="bg-slate-900 text-stone-50 hover:bg-slate-800" onClick={() => scrollToId("cta")}>
                      우리 집에 맞는 상담
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    <Button
                      as="a"
                      href={telHref}
                      onClick={handlePhoneClick}
                      className="border border-stone-300 bg-white text-stone-800 hover:bg-stone-50"
                    >
                      전화 문의
                      <PhoneCall className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
                  <h3 className="text-lg font-bold">고객이 자주 묻는 질문</h3>
                  <div className="mt-4 grid gap-3">
                    {[
                      { q: "버티컬이랑 뭐가 달라요?", a: "열림은 넓게(버티컬), 빛 조절은 섬세하게(블라인드) 가져가는 방식입니다." },
                      { q: "관리 어려운가요?", a: "오염된 슬랫만 분리해 세탁/교체가 가능해 유지관리가 편합니다." },
                      { q: "설치 후 문제 생기면요?", a: BRAND.asPolicy },
                    ].map((item) => (
                      <div key={item.q} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                        <div className="text-sm font-bold text-stone-900">{item.q}</div>
                        <div className="mt-1 text-sm text-stone-700 leading-relaxed">{item.a}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4">
                    <div className="text-xs font-semibold text-stone-700">팁</div>
                    <div className="mt-2 text-sm text-stone-700 leading-relaxed">
                      “대형창일수록” 방문 실측이 중요합니다. 바닥 여유/문 열림/가구 동선을 같이 봐야
                      예쁘게 떨어집니다.
                    </div>
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
                <p className="mt-2 text-sm text-stone-600">더슬렛이 완성한 공간의 분위기를 확인해보세요.</p>
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
              {GALLERY.map((g) => {
                const url = unsplash(g.sig);
                return (
                  <div
                    key={`${g.apt}-${g.sig}`}
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
                      <div className="mt-1 text-xs text-stone-600">상담 → 실측 → 맞춤제작 → 완벽시공</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 text-xs text-stone-500">
              * 현재 사진은 데모용입니다. 운영 시 실제 시공 사진으로 교체하면 문의 전환율이 확 올라갑니다.
            </div>
          </Reveal>
        </section>

        {/* Process */}
        <section id="process" className="bg-white border-y border-stone-200">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <Reveal>
              <h2 className="text-2xl font-extrabold tracking-tight">진행 과정</h2>
              <p className="mt-2 text-sm text-stone-600">
                유니슬렛은 “실측 + 동선 + 채광”이 핵심이라, 방문 상담이 결과를 좌우합니다.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                {[
                  {
                    title: "상담",
                    desc: "창/동선/원하는 채광·프라이버시를 빠르게 정리합니다.",
                    icon: <MessageCircle className="h-6 w-6" />,
                  },
                  {
                    title: "무료 실측",
                    desc: "샘플 확인 + 정확 실측으로 예쁘게 떨어지는 구성을 잡습니다.",
                    icon: <Ruler className="h-6 w-6" />,
                  },
                  {
                    title: "맞춤 제작",
                    desc: "공간에 맞춘 사양으로 제작(컬러/구성/작동감).",
                    icon: <Wrench className="h-6 w-6" />,
                  },
                  {
                    title: "시공 & A/S",
                    desc: "수평/마감 체크 후 사용법 안내, 기준에 따라 A/S 진행.",
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
                  후기는 신뢰의 핵심입니다. 실제 시공 고객님은 카카오톡으로 후기를 남겨주세요.
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

            <div className="mt-4">
              <Button className="border border-stone-200 bg-white text-stone-800 hover:bg-stone-50" onClick={leaveReviewToKakao}>
                카카오톡으로 후기 남기기
                <ArrowUpRight className="h-4 w-4" />
              </Button>
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

            <div className="mt-6 rounded-3xl border border-stone-200 bg-stone-50 p-5 text-sm text-stone-700">
              <div className="font-bold">운영 팁</div>
              <div className="mt-2 leading-relaxed">
                카카오톡으로 받은 “진짜 후기”를 주 1회 이 섹션에 추가만 해도 전환율이 안정적으로 올라갑니다.
              </div>
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
                      <span>상담 가능 시간: {BRAND.bizHours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-slate-900" />
                      <span>A/S 정책: {BRAND.asPolicy}</span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl border border-stone-200 bg-stone-50 p-5">
                    <div className="text-xs font-semibold text-stone-700">복사되는 메시지 예시</div>
                    <pre className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-stone-600">
{`[${BRAND.name} 무료 견적 요청]
이름: 홍길동
연락처: 010-1234-5678
지역: 해운대구
요청사항: (예: 거실 통창 / 베란다문 포함)
요청: 유니슬렛 무료 방문 실측 및 견적 문의드립니다.`}
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
                    onChange={(e) => setLead((v) => ({ ...v, phone: normalizePhone(e.target.value) }))}
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

                  <label className="mt-4 block text-sm font-semibold text-stone-800">요청사항(선택)</label>
                  <input
                    value={lead.note}
                    onChange={(e) => setLead((v) => ({ ...v, note: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900/30 focus:ring-2 focus:ring-slate-900/10"
                    placeholder="예) 거실 통창 / 베란다문 포함 / 반려동물 있음"
                  />

                  <label className="mt-4 flex items-start gap-2 text-sm text-stone-700">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-stone-300 text-slate-900 focus:ring-slate-900/30"
                    />
                    <span>
                      <span className="font-semibold text-stone-900">개인정보 수집·이용 동의(필수)</span>
                      <span className="block text-xs text-stone-500 mt-1">
                        상담 목적 외 사용하지 않습니다.
                      </span>
                    </span>
                  </label>

                  <div className="mt-5 grid gap-3">
                    <Button className="w-full bg-yellow-400 text-stone-900 shadow-md hover:bg-yellow-300" onClick={onLeadSubmit}>
                      카카오톡으로 상담 요청
                      <MessageCircle className="h-5 w-5" />
                    </Button>

                    <Button
                      as="a"
                      href={telHref}
                      onClick={handlePhoneClick}
                      className="w-full bg-slate-900 text-stone-50 hover:bg-slate-800"
                    >
                      전화로 빠르게 상담
                      <PhoneCall className="h-5 w-5" />
                    </Button>

                    <div className="text-xs text-stone-500">
                      버튼을 누르면 새 창에서 카카오톡 오픈채팅이 열립니다.
                    </div>
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
              본 페이지 이미지는 데모용입니다. 실제 유니슬렛 시공 사진으로 교체하면 전환율이 올라갑니다.
            </div>
          </div>
        </footer>
      </main>

      {/* Floating buttons */}
      <div className="fixed bottom-4 right-4 z-[9998] flex flex-col gap-2">
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
    </div>
  );
}
