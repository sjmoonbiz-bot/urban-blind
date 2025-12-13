import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  PhoneCall,
  MessageCircle,
  ShieldCheck,
  Ruler,
  Factory,
  Wrench,
  Star,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  MapPin,
  CheckCircle2,
  BadgeCheck,
  ArrowUpRight,
  Wind,
  RotateCw,
} from "lucide-react";

/** 카카오톡 오픈채팅 링크만 여기 바꾸면 됩니다 */
const KAKAO_CHAT_URL = "https://open.kakao.com/o/여기에_오픈채팅_링크";

/** 운영 정보(필요하면 수정) */
const BRAND = {
  name: "더슬렛",
  tagline: "유니슬렛(스마트커튼) 전문 방문견적",
  serviceArea: "부산 전지역",
  phone: "010-7534-2913",
  bizHours: "매일 09:00-20:00",
};

/** Unsplash 랜덤 이미지 (유니슬렛은 ‘vertical blinds / smart curtain’ 키워드가 가장 근접) */
const img = (keywords) =>
  `https://source.unsplash.com/featured/1600x1000/?${encodeURIComponent(
    keywords
  )}&sig=${Math.floor(Math.random() * 10_000)}`;

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

/** 섹션 리빌(마이크로 인터랙션) */
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

function Button({ children, className = "", onClick, as = "button", href }) {
  const Comp = as;
  return (
    <Comp
      href={href}
      onClick={onClick}
      className={classNames(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold",
        "transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900/30",
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

export default function App() {
  const NAV = useMemo(
    () => [
      { id: "usp", label: "왜 유니슬렛인가" },
      { id: "unislat", label: "유니슬렛 소개" },
      { id: "gallery", label: "시공 사례" },
      { id: "process", label: "진행 과정" },
      { id: "reviews", label: "후기" },
      { id: "guarantee", label: "A/S 보증" },
      { id: "cta", label: "무료 상담" },
    ],
    []
  );

  const heroBg = useMemo(() => img("vertical blinds, living room, interior, hotel"), []);
  const gallerySeed = useMemo(() => Date.now(), []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [lead, setLead] = useState({ name: "", phone: "", area: "" });

  /** 유니슬렛 시공 사례(카피/SEO용: 아파트명 + 유니슬렛/스마트커튼) */
  const GALLERY = useMemo(
    () => [
      { apt: "해운대 힐스테이트", style: "유니슬렛 · 데이(채광) 중심", k: "vertical blinds, bright living room" },
      { apt: "센텀 더샵", style: "유니슬렛 · 디밍(눈부심 완화)", k: "vertical blinds, modern apartment" },
      { apt: "명지 더샵", style: "유니슬렛 · 프라이버시 강조", k: "smart curtain, slatted curtain, interior" },
      { apt: "연산 롯데캐슬", style: "유니슬렛 · 거실 대형창", k: "vertical blinds, large window, living room" },
      { apt: "동래 래미안", style: "유니슬렛 · 톤온톤 믹스", k: "vertical blinds, warm interior" },
      { apt: "서면 아이파크", style: "유니슬렛 · 호텔 무드", k: "hotel interior, vertical blinds" },
      { apt: "수영 SK뷰", style: "유니슬렛 · 베란다/슬라이딩 도어", k: "vertical blinds, sliding door, apartment" },
      { apt: "남천 푸르지오", style: "유니슬렛 · 낮/밤 사용성", k: "smart curtain, privacy, living room" },
    ],
    []
  );

  /** 검색 유입용 키워드(페이지에서 실제로 노출되는 형태) */
  const SEO_KEYWORDS = useMemo(
    () => [
      "유니슬렛", "유니슬랫", "UniSlat", "스마트커튼", "버티컬", "버티컬블라인드",
      "세로블라인드", "채광조절", "프라이버시", "대형창", "슬라이딩도어",
      "해운대", "센텀", "광안리", "수영", "남천", "연산", "동래", "명지", "서면",
      "힐스테이트", "더샵", "푸르지오", "래미안", "롯데캐슬", "아이파크", "SK뷰",
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
      `[유니슬렛 무료 방문견적 요청]\n` +
      `이름: ${name}\n` +
      `연락처: ${phone}\n` +
      `지역: ${area}\n` +
      `요청: 유니슬렛(스마트커튼) 무료 방문 실측 및 견적 문의드립니다.\n`;

    try {
      await copyToClipboard(msg);
      setToastMsg("요청 내용이 복사되었습니다. 카카오톡에서 붙여넣기만 하시면 됩니다.");
      setToastOpen(true);
      window.open(KAKAO_CHAT_URL, "_blank", "noopener,noreferrer");
    } catch {
      setToastMsg("복사에 실패했습니다. 아래 내용을 수동으로 복사해 주세요.");
      setToastOpen(true);
      window.open(KAKAO_CHAT_URL, "_blank", "noopener,noreferrer");
    }
  };

  const telHref = `tel:${BRAND.phone.replaceAll("-", "")}`;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
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
            className="flex items-center gap-2 rounded-xl px-2 py-1 text-left"
            aria-label="홈으로"
          >
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-900 text-stone-50">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold tracking-tight">{BRAND.name}</div>
              <div className="text-xs text-stone-600">{BRAND.tagline}</div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 md:flex">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => scrollToId(n.id)}
                  className="rounded-xl px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-100"
                >
                  {n.label}
                </button>
              ))}
            </nav>

            <Button
              className="bg-yellow-400 text-stone-900 shadow-sm hover:bg-yellow-300"
              onClick={() => scrollToId("cta")}
            >
              유니슬렛 무료견적
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
          <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-stone-50 backdrop-blur">
                <MapPin className="h-4 w-4" />
                {BRAND.serviceArea} 유니슬렛 무료 방문 실측·견적
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-50 sm:text-5xl">
                블라인드처럼 조절되고,
                <span className="block text-yellow-200">버티컬처럼 넓게 열리는 유니슬렛.</span>
              </h1>

              <p className="mt-4 text-base leading-relaxed text-stone-100/90 sm:text-lg">
                세로 슬랫 구조로 채광·시야·프라이버시를 각도로 조절하고,
                큰 창/슬라이딩 도어에도 깔끔하게 어울립니다.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  className="bg-yellow-400 text-stone-900 shadow-lg hover:bg-yellow-300"
                  onClick={() => scrollToId("cta")}
                >
                  1분 유니슬렛 상담 신청
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <Button
                  as="a"
                  href={telHref}
                  className="border border-white/30 bg-white/10 text-stone-50 hover:bg-white/15"
                >
                  전화로 바로 상담
                  <PhoneCall className="h-5 w-5" />
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Chip>무료 실측</Chip>
                <Chip>각도 조절</Chip>
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
                <h3 className="text-lg font-bold">무료 방문 실측</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  샘플을 들고 방문해 창 구조/동선까지 보고 제안합니다. 큰 창일수록 실측이 결과를 좌우합니다.
                </p>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
                  <RotateCw className="h-6 w-6 text-slate-900" />
                </div>
                <h3 className="text-lg font-bold">각도(회전)로 정교 조절</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  슬랫 각도로 채광과 프라이버시를 동시에 컨트롤합니다. “눈부심은 줄이고, 답답함은 덜고”가 목표입니다.
                </p>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
                  <Wrench className="h-6 w-6 text-slate-900" />
                </div>
                <h3 className="text-lg font-bold">설치 후까지 책임</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  작동감/수평/마감까지 점검하고, 사용 중 이슈는 A/S 정책 기준으로 처리합니다.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 유니슬렛 소개 + SEO 키워드 */}
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
                      <span>세로 슬랫 구조라 답답함이 덜하고, 공간이 길어 보이는 효과가 있습니다.</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-slate-900" />
                      <span>제품 옵션에 따라 관리/세탁 편의(분리 청소 등)를 안내할 수 있습니다.</span>
                    </li>
                  </ul>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button
                      className="bg-slate-900 text-stone-50 hover:bg-slate-800"
                      onClick={() => scrollToId("cta")}
                    >
                      우리 집에 맞는 유니슬렛 상담
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    <Button
                      as="a"
                      href={telHref}
                      className="border border-stone-300 bg-white text-stone-800 hover:bg-stone-50"
                    >
                      전화 문의
                      <PhoneCall className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
                  <h3 className="text-lg font-bold">아파트명 + 유니슬렛 검색 유입</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    구매 의사가 높은 고객은 “아파트명 + 유니슬렛/스마트커튼”으로 검색합니다.
                    아래 키워드는 실제 페이지에서 노출되어 검색 폭을 넓히는 용도입니다.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {SEO_KEYWORDS.slice(0, 28).map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 p-4">
                    <div className="text-xs font-semibold text-stone-700">예시 검색어</div>
                    <div className="mt-2 grid gap-1 text-sm text-stone-700">
                      <div>해운대 힐스테이트 유니슬렛</div>
                      <div>명지 더샵 스마트커튼 유니슬렛</div>
                      <div>센텀 더샵 유니슬렛 견적</div>
                    </div>
                  </div>

                  <div className="mt-6 text-sm text-stone-600">
                    운영 팁: 갤러리의 아파트명/스타일을 실제 시공 사례로 교체하면, 검색 유입이 누적됩니다.
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
                  “내 집과 비슷한 창”을 빠르게 찾도록 아파트명과 사용 목적(채광/프라이버시)을 함께 표기합니다.
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
                const url = `https://source.unsplash.com/featured/900x700/?${encodeURIComponent(
                  g.k
                )}&sig=${gallerySeed + idx}`;
                return (
                  <div
                    key={`${g.apt}-${idx}`}
                    className="group overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={url}
                        alt={`${g.apt} ${g.style} 유니슬렛 시공`}
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
                        상담 → 무료 실측 → 맞춤 제작 → 설치 마감 점검
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-stone-500">{BRAND.serviceArea}</span>
                        <span className="text-xs font-semibold text-slate-900">
                          무료 견적
                          <ChevronRight className="ml-0.5 inline h-4 w-4" />
                        </span>
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
                    "설치 후 작동감까지 체크하고 가셔서 믿음이 갔습니다. 사용 팁도 자세히 알려주셔서 편해요.",
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

        {/* Guarantee */}
        <section id="guarantee" className="bg-stone-100/60">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <Reveal>
              <div className="grid gap-6 md:grid-cols-2 md:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-700 shadow-sm">
                    <ShieldCheck className="h-4 w-4" />
                    리스크 제거(보증 정책)
                  </div>
                  <h2 className="mt-4 text-2xl font-extrabold tracking-tight">
                    마지막 망설임을 없애는, 유니슬렛 A/S 보증
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-stone-700">
                    “작동이 뻑뻑하면? 수평이 틀어지면?” 같은 불안을 정책으로 해결합니다.
                    상담에서 보증 범위와 기준을 명확히 안내합니다.
                  </p>

                  <div className="mt-6 grid gap-3">
                    <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-100">
                          <BadgeCheck className="h-5 w-5 text-slate-900" />
                        </div>
                        <div>
                          <div className="text-sm font-bold">설치 후 30일 작동/마감 점검</div>
                          <div className="mt-1 text-sm text-stone-600">
                            초기 사용 중 생기는 미세 조정(1회)을 기준에 따라 처리합니다.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-100">
                          <Wrench className="h-5 w-5 text-slate-900" />
                        </div>
                        <div>
                          <div className="text-sm font-bold">1년 무상 A/S(시공 관련)</div>
                          <div className="mt-1 text-sm text-stone-600">
                            레일/브라켓/작동 불량 등 시공 관련 이슈는 책임지고 처리합니다.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-stone-500">
                      보증 범위는 제품 옵션/설치 환경에 따라 달라질 수 있으며, 상담 시 상세 안내합니다.
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
                  <h3 className="text-lg font-bold">자주 묻는 질문</h3>
                  <div className="mt-4 grid gap-3 text-sm">
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                      <div className="font-semibold text-stone-800">Q. 유니슬렛이 버티컬이랑 뭐가 달라요?</div>
                      <div className="mt-2 text-stone-600">
                        핵심은 “각도 조절 + 넓게 열림”을 생활 동선에 맞게 세팅해준다는 점입니다. 방문 실측에서 창 구조를 보고 추천합니다.
                      </div>
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                      <div className="font-semibold text-stone-800">Q. 큰 창/베란다문에도 괜찮나요?</div>
                      <div className="mt-2 text-stone-600">
                        유니슬렛은 대형창/슬라이딩 도어에서 쓰임이 큰 편이라, 동선과 개폐 방향이 특히 중요합니다.
                      </div>
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                      <div className="font-semibold text-stone-800">Q. 견적만 받아도 되나요?</div>
                      <div className="mt-2 text-stone-600">네. 무료 방문 실측/견적만 받아보셔도 됩니다.</div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button className="bg-yellow-400 text-stone-900 hover:bg-yellow-300" onClick={() => scrollToId("cta")}>
                      지금 무료 상담
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                    <Button as="a" href={telHref} className="border border-stone-300 bg-white text-stone-800 hover:bg-stone-50">
                      전화하기
                      <PhoneCall className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
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
{`[유니슬렛 무료 방문견적 요청]
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
              본 페이지 이미지는 데모용(Unsplash)입니다. 실제 유니슬렛 시공 사진으로 교체하면 전환율이 올라갑니다.
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
          카카오톡
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
