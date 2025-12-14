import React, { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  PhoneCall,
  MessageCircle,
  X,
  Flame,
  ClipboardCheck,
} from "lucide-react";

/**
 * 실전 설정
 */
const BRAND = {
  name: "더슬렛",
  product: "유니슬렛",
};

const CONTACT = {
  tel: "010-7534-2913",
  kakaoUrl: "https://open.kakao.com/o/sH00Mn6h", // 필요 시 교체
};

const COLORS = {
  charcoal: "#1a1a1a",
  orange: "#ea580c", // Tailwind orange-600
};

/**
 * ⚠️ 견적 숫자(원) 노출 안전장치
 * - 아래 2개 값이 0이면 “원 단위 견적”을 표시하지 않습니다.
 * - 실제 단가를 넣으면 자동으로 범위(원)가 표시됩니다.
 */
const ESTIMATE_MODEL = {
  BASE_PER_M2: 0, // 예: 190000
  INSTALL_BASE: 0, // 예: 120000
  ERROR_RATE: 0.12,
  OPTION_MULTIPLIERS: {
    fabricPremium: 1.12,
    blackout: 1.08,
    pet: 1.06,
    highCeiling: 1.05,
  },
};

/**
 * 미디어(없어도 페이지가 깨지지 않게 fallback 처리)
 * public 폴더 기준
 */
const MEDIA = {
  heroVideoMp4: "/media/hero.mp4",
  heroImage: "/images/hero.webp",
  gallery: [
    { label: "BEFORE", title: "교체 전", src: "/images/before-1.webp" },
    { label: "AFTER", title: "교체 후", src: "/images/after-1.webp" },
    { label: "BEFORE", title: "교체 전", src: "/images/before-2.webp" },
    { label: "AFTER", title: "교체 후", src: "/images/after-2.webp" },
  ],
};

function cn(...c) {
  return c.filter(Boolean).join(" ");
}

function formatKRW(n) {
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString("ko-KR") + "원";
}

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView?.({ behavior: "smooth", block: "start" });
}

function Pill({ children, tone = "light" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur",
        tone === "dark"
          ? "border-white/20 bg-white/10 text-white"
          : "border-neutral-200/70 bg-white/70 text-neutral-700"
      )}
    >
      {children}
    </span>
  );
}

function CTAButton({ children, onClick, href, variant = "orange", className = "" }) {
  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-base font-black transition-transform duration-150 sm:w-auto";
  const motion = "hover:scale-105 active:scale-95";
  const styles =
    variant === "orange"
      ? "bg-orange-600 text-white hover:bg-orange-500"
      : variant === "charcoal"
      ? "bg-[#1a1a1a] text-white hover:bg-black"
      : "bg-white/85 text-neutral-900 border border-neutral-200 hover:bg-white";

  if (href) {
    return (
      <a className={cn(base, motion, styles, className)} href={href}>
        {children} <ArrowUpRight className="h-4 w-4" />
      </a>
    );
  }
  return (
    <button className={cn(base, motion, styles, className)} onClick={onClick} type="button">
      {children} <ArrowUpRight className="h-4 w-4" />
    </button>
  );
}

function SafeImage({ src, alt, className = "" }) {
  const [ok, setOk] = useState(Boolean(src));
  if (ok && src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setOk(false)}
        className={className}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("bg-gradient-to-br from-neutral-200/60 via-white/40 to-neutral-100/60", className)}
    />
  );
}

/**
 * 상단 희소성 배너 (닫기 가능 / 로컬 저장)
 */
function ScarcityBanner() {
  const KEY = "the_slat_scarcity_closed_v1";
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const closed = localStorage.getItem(KEY) === "1";
    if (closed) setOpen(false);
  }, []);

  if (!open) return null;

  return (
    <div className="w-full border-b border-neutral-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
        <div className="text-sm font-black text-neutral-900">
          📢 이번 달 무료 실측 혜택, 현재 <span className="text-orange-600">3자리</span> 남았습니다.
        </div>
        <button
          type="button"
          className="rounded-xl border border-neutral-200 bg-white px-2 py-1 text-neutral-700 hover:bg-neutral-50"
          onClick={() => {
            localStorage.setItem(KEY, "1");
            setOpen(false);
          }}
          aria-label="닫기"
          title="닫기"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * 3초 컷 견적 + 밴드왜건 + 보상 CTA
 */
function QuickEstimate({ onEstimate }) {
  const [inputs, setInputs] = useState({
    widthCm: 240,
    heightCm: 230,
    count: 1,
    space: "거실",
    fabric: "프리미엄",
    blackout: "보통",
    pet: "있음",
    ceiling: "보통",
  });

  const [todayCount, setTodayCount] = useState(17);

  useEffect(() => {
    // 랜덤/고정(요청사항): 초기 로딩 시 14~29 랜덤
    const n = 14 + Math.floor(Math.random() * 16);
    setTodayCount(n);
  }, []);

  const canShowNumbers = ESTIMATE_MODEL.BASE_PER_M2 > 0 && ESTIMATE_MODEL.INSTALL_BASE > 0;

  const estimate = useMemo(() => {
    const w = Math.max(60, Number(inputs.widthCm) || 0) / 100;
    const h = Math.max(120, Number(inputs.heightCm) || 0) / 100;
    const c = Math.min(10, Math.max(1, Number(inputs.count) || 1));
    const area = w * h * c;

    let mult = 1;
    if (inputs.fabric === "프리미엄") mult *= ESTIMATE_MODEL.OPTION_MULTIPLIERS.fabricPremium;
    if (inputs.blackout === "강함") mult *= ESTIMATE_MODEL.OPTION_MULTIPLIERS.blackout;
    if (inputs.pet === "있음") mult *= ESTIMATE_MODEL.OPTION_MULTIPLIERS.pet;
    if (inputs.ceiling === "높음") mult *= ESTIMATE_MODEL.OPTION_MULTIPLIERS.highCeiling;

    const raw = area * ESTIMATE_MODEL.BASE_PER_M2 * mult + ESTIMATE_MODEL.INSTALL_BASE;
    const min = Math.round(raw * (1 - ESTIMATE_MODEL.ERROR_RATE));
    const max = Math.round(raw * (1 + ESTIMATE_MODEL.ERROR_RATE));

    const memo =
      `[${BRAND.name} ${BRAND.product} 상담 메모]\n` +
      `공간: ${inputs.space}\n` +
      `창: ${c}개\n` +
      `사이즈: ${Math.round(w * 100)} x ${Math.round(h * 100)} cm\n` +
      `원단: ${inputs.fabric}\n` +
      `차광: ${inputs.blackout}\n` +
      `반려동물: ${inputs.pet}\n` +
      `천장/대형창: ${inputs.ceiling}\n` +
      `요청: (사진 1~2장 첨부)\n`;

    return {
      area,
      min,
      max,
      memo,
      summary: `${inputs.space} · ${c}개 · ${Math.round(w * 100)}x${Math.round(h * 100)}cm`,
      canShowNumbers,
    };
  }, [inputs, canShowNumbers]);

  useEffect(() => onEstimate?.(estimate), [estimate, onEstimate]);

  async function copyAndNudge() {
    try {
      await navigator.clipboard.writeText(estimate.memo);
    } catch {
      // 모바일 브라우저 정책으로 실패할 수 있음(무시)
    } finally {
      scrollToId("offer");
    }
  }

  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-neutral-200/70 bg-white/70 shadow-sm backdrop-blur">
      <div className="p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-neutral-500">3초 컷 견적 계산기</div>
            <div className="mt-1 text-lg font-black text-neutral-900 sm:text-xl">
              <Flame className="mr-1 inline h-5 w-5 text-orange-600" />
              오늘 <span className="text-orange-600">{todayCount}명</span>이 내 집 견적을 확인했습니다
            </div>
          </div>
          <div className="text-xs text-neutral-500">
            * 숫자는 로딩 기준 표시
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 결과 카드 */}
          <div className="rounded-3xl bg-[#1a1a1a] p-5 text-white">
            <div className="text-xs text-white/75">견적 결과 (실측 전)</div>

            {estimate.canShowNumbers ? (
              <>
                <div className="mt-2 text-2xl font-black">
                  {formatKRW(estimate.min)} ~ {formatKRW(estimate.max)}
                </div>
                <div className="mt-2 text-xs text-white/75">
                  {estimate.summary} · 면적 약 {estimate.area.toFixed(1)}m²
                </div>
              </>
            ) : (
              <>
                <div className="mt-2 text-xl font-black">조건 입력 완료</div>
                <div className="mt-1 text-sm text-white/80">
                  이 조건으로 “빠른 범위 안내”가 가능합니다.
                </div>
                <div className="mt-2 text-xs text-white/70">
                  (단가 설정 시 원 단위 범위 자동 표시)
                </div>
              </>
            )}

            <div className="mt-4 rounded-2xl bg-white/10 p-4 text-sm text-white/85">
              <div className="font-black">보상 버튼</div>
              <div className="mt-1 text-xs text-white/75">
                견적 확인 = 상담이 빨라지는 “혜택 상태”
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <CTAButton href={CONTACT.kakaoUrl} variant="orange" className="sm:flex-1">
                카톡 상담
              </CTAButton>
              <CTAButton onClick={copyAndNudge} variant="light" className="sm:flex-1">
                🎁 이 견적으로 혜택 받고 상담하기 <ClipboardCheck className="h-4 w-4" />
              </CTAButton>
            </div>

            <div className="mt-3 text-xs text-white/70">
              * 최종 금액은 창 구조/레일/원단/시공 난이도에 따라 실측 후 확정됩니다.
            </div>
          </div>

          {/* 입력 폼 */}
          <div className="rounded-3xl border border-neutral-200/70 bg-[#f7f3ec] p-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-neutral-700">설치 공간</label>
                <select
                  value={inputs.space}
                  onChange={(e) => setInputs((p) => ({ ...p, space: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-300"
                >
                  <option>거실</option>
                  <option>안방</option>
                  <option>서재</option>
                  <option>아이방</option>
                  <option>전체</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700">가로(cm)</label>
                <input
                  value={inputs.widthCm}
                  onChange={(e) => setInputs((p) => ({ ...p, widthCm: e.target.value }))}
                  inputMode="numeric"
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-300"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-700">세로(cm)</label>
                <input
                  value={inputs.heightCm}
                  onChange={(e) => setInputs((p) => ({ ...p, heightCm: e.target.value }))}
                  inputMode="numeric"
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-300"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700">창 개수</label>
                <select
                  value={inputs.count}
                  onChange={(e) => setInputs((p) => ({ ...p, count: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-300"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}개
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700">원단</label>
                <select
                  value={inputs.fabric}
                  onChange={(e) => setInputs((p) => ({ ...p, fabric: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-300"
                >
                  <option>스탠다드</option>
                  <option>프리미엄</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700">차광</label>
                <select
                  value={inputs.blackout}
                  onChange={(e) => setInputs((p) => ({ ...p, blackout: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-300"
                >
                  <option>보통</option>
                  <option>강함</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700">반려동물</label>
                <select
                  value={inputs.pet}
                  onChange={(e) => setInputs((p) => ({ ...p, pet: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-300"
                >
                  <option>있음</option>
                  <option>없음</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-semibold text-neutral-700">천장/대형창</label>
                <select
                  value={inputs.ceiling}
                  onChange={(e) => setInputs((p) => ({ ...p, ceiling: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-300"
                >
                  <option>보통</option>
                  <option>높음</option>
                </select>
                <div className="mt-2 text-xs text-neutral-500">
                  * 여기까지만 입력하면 “상담 속도”가 확 빨라집니다.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Problem 강조 문구(체크/하이라이트) */}
        <div className="mt-6 rounded-3xl border border-neutral-200/70 bg-white/70 p-5">
          <div className="text-sm font-black text-neutral-900">
            <span className="rounded-lg bg-orange-100 px-2 py-1 text-orange-700">
              무거운 커튼의 세탁 스트레스, 블라인드의 차가움.
            </span>{" "}
            이제 {BRAND.product}으로 모든 고민을 끝내세요.
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-2 text-sm text-neutral-700 sm:grid-cols-3">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-orange-600" />
              빨래·먼지 생각 안 나게
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-orange-600" />
              동선 방해 없이 “바람처럼”
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-orange-600" />
              분위기는 더 부드럽게
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * 비교표 (고민 종결)
 */
function ComparisonTable() {
  const rows = [
    { k: "채광 조절", curtain: "△", blind: "◎", unislat: "◎" },
    { k: "무드/부드러움", curtain: "◎", blind: "△", unislat: "◎" },
    { k: "먼지/털 관리", curtain: "△", blind: "○", unislat: "◎" },
    { k: "부분 세탁", curtain: "✕", blind: "✕", unislat: "◎" },
    { k: "동선(베란다 출입)", curtain: "△", blind: "○", unislat: "◎" },
  ];

  return (
    <div className="mt-10 overflow-hidden rounded-3xl border border-neutral-200/70 bg-white/70 shadow-sm backdrop-blur">
      <div className="p-6 sm:p-8">
        <div className="text-xs font-semibold text-neutral-500">비교표</div>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-neutral-900">
          고민을 끝내는 한 장
        </h3>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="py-3 pr-4 font-black text-neutral-900">항목</th>
                <th className="py-3 pr-4 font-black text-neutral-700">일반 커튼</th>
                <th className="py-3 pr-4 font-black text-neutral-700">일반 블라인드</th>
                <th className="py-3 pr-4 font-black text-neutral-900">유니슬렛</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.k} className="border-b border-neutral-200/70">
                  <td className="py-3 pr-4 font-semibold text-neutral-900">{r.k}</td>
                  <td className="py-3 pr-4 text-neutral-700">{r.curtain}</td>
                  <td className="py-3 pr-4 text-neutral-700">{r.blind}</td>
                  <td className="py-3 pr-4 font-black text-neutral-900">{r.unislat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <CTAButton onClick={() => scrollToId("estimate")} variant="orange">
            3초 견적 다시 확인
          </CTAButton>
          <CTAButton href={CONTACT.kakaoUrl} variant="light">
            카톡 상담
          </CTAButton>
        </div>
      </div>
    </div>
  );
}

/**
 * 갤러리 (전후 사진)
 */
function Gallery() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
      {MEDIA.gallery.map((g, i) => (
        <figure
          key={i}
          className="group relative overflow-hidden rounded-3xl border border-neutral-200/70 bg-neutral-100"
        >
          <SafeImage
            src={g.src}
            alt={g.title}
            className="h-56 w-full object-cover transition duration-700 group-hover:scale-[1.03] sm:h-64"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <figcaption className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-black text-neutral-900">
              {g.label}
            </span>
            <div className="mt-2 text-base font-black text-white sm:text-lg">{g.title}</div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/**
 * 모바일 하단 스티키 바 (Thumb Zone 최적화)
 */
function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200/70 bg-white/90 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
        <a
          href={`tel:${CONTACT.tel}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-black text-neutral-900 transition-transform hover:scale-105 active:scale-95"
        >
          <PhoneCall className="h-4 w-4" />
          전화 상담
        </a>
        <button
          onClick={() => scrollToId("estimate")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 px-4 py-3 text-sm font-black text-white transition-transform hover:scale-105 active:scale-95"
          type="button"
        >
          <MessageCircle className="h-4 w-4" />
          3초 견적
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const identityTags = [
    "👶 육아맘",
    "🐈 냥이 집사",
    "🐶 강아지 집사",
    "☕️ 홈카페족",
    "🧼 빨래 귀찮은 사람",
    "🪟 베란다 자주 나가는 집",
  ];

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-neutral-900">
      <ScarcityBanner />

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-neutral-200/60 bg-[#f6f1e8]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="rounded-2xl bg-[#1a1a1a] px-3 py-1 text-xs font-black tracking-wider text-white">
              {BRAND.name}
            </div>
            <div className="hidden text-xs font-semibold text-neutral-600 sm:block">
              {BRAND.product}
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <CTAButton href={`tel:${CONTACT.tel}`} variant="light">
              전화
            </CTAButton>
            <CTAButton onClick={() => scrollToId("estimate")} variant="orange">
              3초 견적
            </CTAButton>
          </div>

          <div className="sm:hidden">
            <button
              onClick={() => scrollToId("estimate")}
              className="rounded-2xl bg-orange-600 px-4 py-2 text-sm font-black text-white transition-transform hover:scale-105 active:scale-95"
              type="button"
            >
              3초 견적
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:pb-16 sm:pt-14">
        <div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2">
          <div>
            <div className="flex flex-wrap gap-2">
              <Pill>
                <Sparkles className="h-3.5 w-3.5 text-orange-600" /> 새 카테고리
              </Pill>
              <Pill>
                <span className="text-orange-600">✦</span> 동선 방해 0
              </Pill>
              <Pill>
                <span className="text-orange-600">✦</span> 부분 세탁
              </Pill>
            </div>

            {/* 요청 헤드라인/서브헤드 */}
            <h1 className="mt-5 text-4xl font-black tracking-tight text-[#1a1a1a] sm:text-6xl">
              손대지 마세요.
              <br />
              바람처럼 지나가세요.
            </h1>

            <p className="mt-4 text-base leading-relaxed text-neutral-700 sm:text-lg">
              커튼을 걷는 3초조차 아까운 당신을 위해.
              <br className="hidden sm:block" />
              빨래 걱정, 먼지 걱정, 동선 방해 없는 {BRAND.product}.
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <CTAButton onClick={() => scrollToId("estimate")} variant="orange">
                3초 견적 먼저 보기
              </CTAButton>
              <CTAButton href={CONTACT.kakaoUrl} variant="light">
                카톡으로 바로 상담
              </CTAButton>
            </div>

            {/* Identity Tag (정체성 타겟팅) */}
            <div className="mt-6">
              <div className="text-xs font-semibold text-neutral-500">이 중 하나라도 “나”면 바로 맞습니다</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {identityTags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-neutral-200/70 bg-white/80 px-3 py-1 text-xs font-black text-neutral-800 shadow-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Visual: 가벼움/자유로움 강조(영상+오버레이) */}
          <div className="relative overflow-hidden rounded-[2rem] border border-neutral-200/70 bg-white/60 shadow-sm backdrop-blur">
            <div className="absolute inset-0">
              <video
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={MEDIA.heroImage}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              >
                <source src={MEDIA.heroVideoMp4} type="video/mp4" />
              </video>
            </div>

            <SafeImage
              src={MEDIA.heroImage}
              alt="유니슬렛 대표 이미지"
              className="h-[360px] w-full object-cover sm:h-[460px]"
            />

            {/* 라이트/자유감 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/10" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-2 text-sm font-black text-[#1a1a1a] shadow-sm backdrop-blur">
                “닫아도 지나갈 수 있는 창”
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM + SOLUTION(체크 강조) + CALC */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:pb-20">
        <div className="rounded-[2rem] border border-neutral-200/60 bg-white/55 p-6 shadow-sm backdrop-blur sm:p-10">
          <div className="text-xs font-semibold text-neutral-500">고통 → 해결</div>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#1a1a1a] sm:text-3xl">
            무거운 커튼의 세탁 스트레스, 블라인드의 차가움.
            <br />
            <span className="text-orange-600">이제 유니슬렛으로 끝내세요.</span>
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              "세탁은 ‘미루는 게 정상’이 됩니다",
              "동선이 막히면 결국 귀찮아집니다",
              "집 인상은 ‘창’에서 결정됩니다",
            ].map((t) => (
              <div
                key={t}
                className="rounded-3xl border border-neutral-200/70 bg-white/70 p-5 shadow-sm"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-orange-600" />
                  <div className="text-sm font-black text-neutral-900">{t}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 견적 계산기 */}
          <div id="estimate" className="mt-2">
            <QuickEstimate />
          </div>

          <ComparisonTable />
        </div>
      </section>

      {/* SOCIAL PROOF: 전후 사진 */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:pb-20">
        <div className="text-xs font-semibold text-neutral-500">사회적 증거</div>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-[#1a1a1a] sm:text-3xl">
          전후 사진이 말보다 빠릅니다
        </h2>

        <Gallery />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              title: "세탁 생각이 줄었어요",
              text: "전체가 아니라 ‘부분’만 관리되니까, 미루는 이유가 사라졌어요.",
            },
            {
              title: "동선이 편해졌어요",
              text: "닫혀 있어도 지나갈 수 있으니, 창이 생활을 방해하지 않아요.",
            },
            {
              title: "집이 더 정돈돼 보여요",
              text: "창 라인이 정리되니까 거실 분위기가 확 올라가요.",
            },
          ].map((r) => (
            <div
              key={r.title}
              className="rounded-3xl border border-neutral-200/70 bg-white/70 p-6 shadow-sm backdrop-blur"
            >
              <div className="flex items-center gap-2 text-sm font-black text-neutral-900">
                <Star className="h-4 w-4 text-orange-600" />
                {r.title}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-neutral-700">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OFFER */}
      <section id="offer" className="mx-auto max-w-6xl px-4 pb-24 sm:pb-20">
        <div className="rounded-[2rem] border border-neutral-200/60 bg-[#1a1a1a] p-6 text-white shadow-sm sm:p-10">
          <div className="text-xs font-semibold text-white/70">상담 신청</div>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            지금 필요한 건 “결정”이 아니라 “확인”입니다
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            사진 1~2장 + 대략 사이즈만 있으면 안내가 시작됩니다.
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <a
              href={`tel:${CONTACT.tel}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-base font-black text-[#1a1a1a] transition-transform hover:scale-105 active:scale-95 sm:w-auto"
            >
              <PhoneCall className="h-4 w-4" /> 전화 상담
            </a>
            <a
              href={CONTACT.kakaoUrl}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-base font-black text-white transition-transform hover:scale-105 active:scale-95 sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" /> 카톡 상담
            </a>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              "사진(창/거실) 1~2장",
              "대략 사이즈(가로·세로) 또는 창 개수",
              "원하는 느낌(밝게/무드/차광/반려동물 등)",
            ].map((t) => (
              <div key={t} className="rounded-3xl bg-white/10 p-5 text-sm text-white/85">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-orange-500" />
                  <span className="font-semibold">{t}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-white/60">
            * 최종 금액은 실측 후 확정됩니다.
          </div>
        </div>
      </section>

      <footer className="border-t border-neutral-200/60 bg-[#f6f1e8] pb-28 sm:pb-8">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-600">
          <div className="font-black text-[#1a1a1a]">{BRAND.name}</div>
          <div className="mt-1">
            상담:{" "}
            <a className="font-black text-[#1a1a1a]" href={`tel:${CONTACT.tel}`}>
              {CONTACT.tel}
            </a>
          </div>
        </div>
      </footer>

      <StickyMobileCTA />
    </div>
  );
}
