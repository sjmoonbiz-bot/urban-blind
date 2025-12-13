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
} from "lucide-react";

/** 카카오톡 오픈채팅 링크만 여기 바꾸면 됩니다 */
const KAKAO_CHAT_URL = "https://open.kakao.com/o/여기에_오픈채팅_링크";

/** 운영 정보(필요하면 수정) */
const BRAND = {
  name: "어반블라인드",
  tagline: "커튼·블라인드 방문견적",
  serviceArea: "부산 전지역",
  phone: "010-0000-0000", // 전화 연결용 (tel:)
  bizHours: "매일 09:00-20:00",
};

/** Unsplash 랜덤 이미지 */
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
      { id: "usp", label: "왜 우리인가" },
      { id: "story", label: "우리 이야기" },
      { id: "gallery", label: "시공 사례" },
      { id: "process", label: "진행 과정" },
      { id: "reviews", label: "후기" },
      { id: "guarantee", label: "A/S 보증" },
      { id: "cta", label: "무료 상담" },
    ],
    []
  );

  const heroBg = useMemo(() => img("curtain, living room, interior, cozy"), []);
  const gallerySeed = useMemo(() => Date.now(), []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [lead, setLead] = useState({ name: "", phone: "", area: "" });

  const GALLERY = useMemo(
    () => [
      { apt: "해운대 힐스테이트", style: "차르르 쉬폰 + 속커튼", k: "sheer curtain, bright living room" },
      { apt: "센텀 더샵", style: "100% 암막 커튼", k: "blackout curtain, modern bedroom" },
      { apt: "명지 더샵", style: "우드 블라인드", k: "wood blinds, minimal interior" },
      { apt: "연산 롯데캐슬", style: "콤비 블라인드", k: "zebra blinds, living room" },
      { apt: "동래 래미안", style: "린넨 커튼", k: "linen curtain, warm interior" },
      { apt: "서면 아이파크", style: "허니콤 쉐이드", k: "honeycomb shade, cozy room" },
      { apt: "수영 SK뷰", style: "암막 + 쉬폰 레이어드", k: "layered curtains, apartment" },
      { apt: "남천 푸르지오", style: "롤스크린", k: "roller blind, clean interior" },
    ],
    []
  );

  /** 아파트명 SEO: 실제로 보여주면서(숨김 아님) 검색어 폭을 넓힘 */
  const SEO_APTS = useMemo(
    () => [
      "해운대", "센텀", "광안리", "수영", "남천", "연산", "동래", "명지", "서면",
      "힐스테이트", "더샵", "푸르지오", "래미안", "롯데캐슬", "아이파크", "SK뷰",
      "커튼", "블라인드", "암막커튼", "차르르커튼", "쉬폰커튼", "우드블라인드", "콤비블라인드", "롤스크린",
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
      `[무료 방문견적 요청]\n` +
      `이름: ${name}\n` +
      `연락처: ${phone}\n` +
      `지역: ${area}\n` +
      `요청: 커튼/블라인드 무료 방문 실측 및 견적 문의드립니다.\n`;

    try {
      await copyToClipboard(msg);
      setToastMsg("요청 내용이 복사되었습니다. 카카오톡에서 붙여넣기만 하시면 됩니다.");
      setToastOpen(true);
      window.open(KAKAO_CHAT_URL, "_blank", "noopener,noreferrer");
    } catch {
      setToastMsg("복사에 실패했습니다. 아래 내용을 수동으로 복사해 주세요.");
      setToastOpen(true);
      // 복사 실패 시에도 카카오톡은 열어둠
      window.open(KAKAO_CHAT_URL, "_blank", "noopener,noreferrer");
    }
  };

  const telHref = `tel:${BRAND.phone.replaceAll("-", "")}`;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <Toast open={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />

      {/* Scroll progress (micro-interaction) */}
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
              <div className="text-sm font800 font-extrabold tracking-tight">{BRAND.name}</div>
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
          <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-stone-50 backdrop-blur">
                <MapPin className="h-4 w-4" />
                {BRAND.serviceArea} 무료 방문 실측·견적
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-50 sm:text-5xl">
                커튼 하나 바꿨을 뿐인데,
                <span className="block text-yellow-200">집이 호텔처럼 달라집니다.</span>
              </h1>

              <p className="mt-4 text-base leading-relaxed text-stone-100/90 sm:text-lg">
                샘플 들고 직접 방문해 조명 아래에서 색감까지 확인합니다.
                실측부터 설치까지 한 번에, 실패 없는 선택으로 안내합니다.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  className="bg-yellow-400 text-stone-900 shadow-lg hover:bg-yellow-300"
                  onClick={() => scrollToId("cta")}
                >
                  1분 무료 상담 신청
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
                <Chip>공장 직영</Chip>
                <Chip>확실한 A/S</Chip>
                <Chip>설치 후 점검</Chip>
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
                <h3 className="text-lg font-bold">무료 실측</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  레이저 실측으로 1mm 단위까지 정확하게 맞춥니다. 실패 확률을 구조적으로 없앱니다.
                </p>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
                  <Factory className="h-6 w-6 text-slate-900" />
                </div>
                <h3 className="text-lg font-bold">공장 직영</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  유통 마진을 줄이고, 원단·부자재 품질은 올립니다. 합리적인 가격을 투명하게 제안합니다.
                </p>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
                  <Wrench className="h-6 w-6 text-slate-900" />
                </div>
                <h3 className="text-lg font-bold">확실한 A/S</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  설치가 끝이 아닙니다. 사용하면서 생기는 이슈까지 책임지는 보증 정책을 운영합니다.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Story (공대생 아들 스토리) */}
        <section id="story" className="bg-stone-100/60">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <Reveal>
              <div className="grid gap-6 md:grid-cols-2 md:items-center">
                <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
                  <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                    <BadgeCheck className="h-4 w-4" />
                    브랜드 스토리
                  </div>
                  <h2 className="mt-4 text-2xl font-extrabold tracking-tight">
                    30년 장인의 손끝 + 공대생의 기준으로 작업합니다.
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-stone-700">
                    아버지는 30년 동안 커튼·블라인드 현장에서 “핏” 하나로 신뢰를 쌓았습니다.
                    아들은 공학적 체크리스트로 실측·제작·시공 과정을 표준화했습니다.
                  </p>
                  <ul className="mt-5 grid gap-3 text-sm text-stone-700">
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-slate-900" />
                      <span>
                        실측값, 창 구조, 벽면 상태를 기록해 재방문/AS 시에도 같은 품질로 대응합니다.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-slate-900" />
                      <span>
                        샘플 확인 → 채광/조명에서 색감 체크 → 설치 후 마감 점검까지 한 흐름으로 진행합니다.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-slate-900" />
                      <span>
                        “감”이 아니라 “기준”으로 일해, 결과물이 일정하게 잘 나오는 구조를 만듭니다.
                      </span>
                    </li>
                  </ul>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button
                      className="bg-slate-900 text-stone-50 hover:bg-slate-800"
                      onClick={() => scrollToId("cta")}
                    >
                      우리 집도 상담받기
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
                  <h3 className="text-lg font-bold">검색으로 들어오는 고객을 놓치지 않도록</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    “아파트명 + 커튼/블라인드”로 검색하는 고객은 구매 의사가 매우 높습니다.
                    아래 키워드는 실제 페이지에서 노출되는 형태로 구성해 검색 폭을 넓힙니다.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {SEO_APTS.slice(0, 26).map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 p-4">
                    <div className="text-xs font-semibold text-stone-700">예시 검색어</div>
                    <div className="mt-2 grid gap-1 text-sm text-stone-700">
                      <div>해운대 힐스테이트 커튼</div>
                      <div>명지 더샵 블라인드</div>
                      <div>센텀 더샵 암막커튼</div>
                    </div>
                  </div>

                  <div className="mt-6 text-sm text-stone-600">
                    운영 팁: 갤러리 카드의 아파트명/스타일을 실제 시공 사례로 꾸준히 교체하면,
                    자연스럽게 검색 유입이 쌓입니다.
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
                <h2 className="text-2xl font-extrabold tracking-tight">시공 갤러리</h2>
                <p className="mt-2 text-sm text-stone-600">
                  아파트명과 스타일을 함께 표기해, 고객이 “내 집과 비슷한 사례”를 빠르게 찾도록 설계했습니다.
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
                        alt={`${g.apt} ${g.style} 커튼 블라인드 시공`}
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
                        방문 실측 → 맞춤 제작 → 설치 마감까지 한 번에
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
                복잡해 보이는 일을 “심플한 3단계”로 줄이면 상담 전환이 올라갑니다.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "상담",
                    desc: "원하시는 분위기/예산/공간을 간단히 확인합니다.",
                    icon: <MessageCircle className="h-6 w-6" />,
                  },
                  {
                    title: "무료 실측",
                    desc: "샘플 확인 + 레이저 실측으로 정확히 맞춥니다.",
                    icon: <Ruler className="h-6 w-6" />,
                  },
                  {
                    title: "맞춤 시공",
                    desc: "제작·설치 후 마감 점검까지 책임지고 마무리합니다.",
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
                  후기는 시간이 쌓일수록 강해지는 자산입니다. 지금은 “대표 후기”로 신뢰를 채웁니다.
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
                    "실측부터 설치까지 너무 깔끔했고, 햇빛 들어올 때 컬러가 정말 예뻐요. 샘플 들고 오셔서 집 조명 아래서 비교해준 게 결정에 도움 됐습니다.",
                },
                {
                  name: "이OO",
                  text:
                    "인터넷 구매로 실패한 적이 있어서 걱정했는데, 길이/주름이 딱 맞게 나왔습니다. 마감까지 체크하고 가셔서 믿음이 갔어요.",
                },
                {
                  name: "박OO",
                  text:
                    "가격이 투명하고 설명이 명확해서 좋았습니다. 설치 후에도 사용 방법, 관리 팁까지 알려주셔서 만족합니다.",
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

        {/* Guarantee (강력한 A/S 보증) */}
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
                    마지막 망설임을 없애는, 확실한 A/S 보증
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-stone-700">
                    “마음에 안 들면 어떡하지?”라는 불안을 정책으로 해결합니다.
                    작업 품질에 자신이 있을 때만 가능한 약속입니다.
                  </p>

                  <div className="mt-6 grid gap-3">
                    <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-100">
                          <BadgeCheck className="h-5 w-5 text-slate-900" />
                        </div>
                        <div>
                          <div className="text-sm font-bold">핏(길이/주름) 30일 보증</div>
                          <div className="mt-1 text-sm text-stone-600">
                            설치 후 사용해보시고 불편하면, 무상으로 재조정(1회)을 진행합니다.
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
                          <div className="text-sm font-bold">1년 무상 A/S</div>
                          <div className="mt-1 text-sm text-stone-600">
                            레일/브라켓/작동 불량 등 시공 관련 이슈는 책임지고 처리합니다.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-100">
                          <CheckCircle2 className="h-5 w-5 text-slate-900" />
                        </div>
                        <div>
                          <div className="text-sm font-bold">설치 후 점검 체크리스트</div>
                          <div className="mt-1 text-sm text-stone-600">
                            마감/수평/작동감을 확인한 뒤 안내까지 마치고 종료합니다.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-stone-500">
                      보증 범위는 제품/시공 조건에 따라 달라질 수 있으며, 상담 시 상세 안내합니다.
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
                  <h3 className="text-lg font-bold">상담 전에 고객이 가장 많이 묻는 질문</h3>
                  <div className="mt-4 grid gap-3 text-sm">
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                      <div className="font-semibold text-stone-800">Q. 견적만 받아도 되나요?</div>
                      <div className="mt-2 text-stone-600">네. 무료 방문 실측/견적만 받아보셔도 됩니다.</div>
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                      <div className="font-semibold text-stone-800">Q. 인터넷이 더 싸지 않나요?</div>
                      <div className="mt-2 text-stone-600">
                        온라인은 실측/색감/마감 변수가 큽니다. 방문 상담으로 실패 비용을 줄입니다.
                      </div>
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                      <div className="font-semibold text-stone-800">Q. 설치 후 문제 생기면요?</div>
                      <div className="mt-2 text-stone-600">
                        위 보증 정책 기준으로 책임지고 처리합니다. 연락만 주시면 됩니다.
                      </div>
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
                  <h2 className="text-2xl font-extrabold tracking-tight">무료 상담 신청</h2>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    이름/전화/지역만 입력하면 요청 내용이 자동으로 복사되고,
                    카카오톡 오픈채팅이 열립니다.
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
{`[무료 방문견적 요청]
이름: 홍길동
연락처: 010-1234-5678
지역: 해운대구
요청: 커튼/블라인드 무료 방문 실측 및 견적 문의드립니다.`}
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
                      카카오톡으로 상담하기
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
              본 페이지의 이미지는 데모용(Unsplash)이며, 실제 시공 사진으로 교체하면 신뢰도가 크게 상승합니다.
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
