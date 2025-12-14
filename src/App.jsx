import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ArrowUpRight,
  PhoneCall,
  MessageCircle,
  X,
  Flame,
  ClipboardCheck,
  Star,
} from "lucide-react";

/** 실전 설정 */
const BRAND = { name: "더슬렛", product: "유니슬렛" };
const CONTACT = { tel: "010-7534-2913", kakaoUrl: "https://open.kakao.com/o/sH00Mn6h" };

/**
 * ⚠️ 견적 “원 단위” 노출 안전장치
 * - 단가를 넣지 않으면(0) 숫자는 숨기고 “상담으로 범위 안내”만 표시합니다.
 */
const ESTIMATE_MODEL = {
  BASE_PER_M2: 0,     // 예: 190000
  INSTALL_BASE: 0,    // 예: 120000
  ERROR_RATE: 0.12,
  OPTION_MULTIPLIERS: {
    fabricPremium: 1.12,
    blackout: 1.08,
    pet: 1.06,
    highCeiling: 1.05,
  },
};

/** public 기준 (없어도 fallback 처리) */
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

const THEME = {
  greige: "#f3eee6",
  navy: "#0b1f3b",
  navy2: "#102a4d",
  ink: "#141414",
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

function CTAButton({ children, onClick, href, variant = "primary", className = "" }) {
  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-base transition-transform duration-150 sm:w-auto";
  const motion = "hover:scale-105 active:scale-95";
  const styles =
    variant === "primary"
      ? `bg-[${THEME.navy}] text-white hover:bg-[${THEME.navy2}]`
      : variant === "outline"
      ? `border border-[${THEME.navy}]/25 bg-white/70 text-[${THEME.navy}] hover:bg-white`
      : "bg-white/80 text-neutral-900 border border-neutral-200 hover:bg-white";

  const textWeight = variant === "primary" ? "font-semibold" : "font-medium";

  if (href) {
    return (
      <a className={cn(base, motion, textWeight, styles, className)} href={href}>
        {children} <ArrowUpRight className="h-4 w-4" />
      </a>
    );
  }
  return (
    <button className={cn(base, motion, textWeight, styles, className)} onClick={onClick} type="button">
      {children} <ArrowUpRight className="h-4 w-4" />
    </button>
  );
}

function SafeImage({ src, alt, className = "" }) {
  const [ok, setOk] = useState(Boolean(src));
  if (ok && src) {
    return <img src={src} alt={alt} loading="lazy" onError={() => setOk(false)} className={className} />;
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("bg-gradient-to-br from-neutral-200/60 via-white/40 to-neutral-100/60", className)}
    />
  );
}

/** 희소성 배너 (닫기 가능) */
function ScarcityBanner() {
  const KEY = "the_slat_scarcity_closed_v2";
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const closed = localStorage.getItem(KEY) === "1";
    if (closed) setOpen(false);
  }, []);

  if (!open) return null;

  return (
    <div className="w-full border-b border-neutral-200/70 bg-white/75 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
        <div className="text-sm font-medium text-neutral-800">
          📢 이번 달 <span className="font-semibold text-[var(--navy)]">무료 실측 혜택</span>, 현재{" "}
          <span className="font-semibold text-[var(--navy)]">3자리</span> 남았습니다.
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

/** 3초 견적 + 밴드왜건 + 보상 CTA */
function QuickEstimate() {
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
    const n = 14 + Math.floor(Math.random() * 16); // 14~29
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

    return { area, min, max, memo, canShowNumbers };
  }, [inputs]);

  async function copyAndNudge() {
    try {
      await navigator.clipboard.writeText(estimate.memo);
    } catch {
      // 모바일 정책으로 실패 가능
    } finally {
      scrollToId("offer");
    }
  }

  return (
    <div className="mt-10 overflow-hidden rounded-3xl border border-neutral-200/70 bg-white/65 shadow-sm backdrop-blur">
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-neutral-500">3초 견적</div>
            <div className="mt-2 text-base font-medium text-neutral-800">
              <Flame className="mr-1 inline h-4 w-4" style={{ color: THEME.navy }} />
              오늘 <span className="font-semibold" style={{ color: THEME.navy }}>{todayCount}명</span>이 내 집 견적을 확인했습니다
            </div>
          </div>
          <div className="text-xs text-neutral-500">* 표시값은 로딩 기준</div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 결과 카드 */}
          <div className="rounded-3xl p-6 text-white" style={{ background: THEME.navy }}>
            <div className="text-xs text-white/75">예상 범위 (실측 전)</div>

            {estimate.canShowNumbers ? (
              <div className="mt-2 text-2xl font-semibold">
                {formatKRW(estimate.min)} ~ {formatKRW(estimate.max)}
              </div>
            ) : (
              <>
                <div className="mt-2 text-xl font-semibold">입력 완료</div>
                <div className="mt-1 text-sm text-white/80">
                  이 조건으로 “품격 옵션 포함” 범위를 안내드립니다.
                </div>
              </>
            )}

            <div className="mt-4 rounded-2xl bg-white/10 p-4 text-sm text-white/85">
              <div className="font-semibold">혜택 상태</div>
              <div className="mt-1 text-xs text-white/75">
                견적 확인 후 상담하면, 안내 속도가 달라집니다.
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <CTAButton href={CONTACT.kakaoUrl} variant="outline" className="sm:flex-1">
                카톡 상담
              </CTAButton>
              <CTAButton onClick={copyAndNudge} variant="primary" className="sm:flex-1">
                🎁 이 견적으로 혜택 받고 상담하기 <ClipboardCheck className="h-4 w-4" />
              </CTAButton>
            </div>

            <div className="mt-3 text-xs text-white/70">
              * 최종 금액은 창 구조/레일/원단/시공 난이도에 따라 실측 후 확정됩니다.
            </div>
          </div>

          {/* 입력 폼 */}
          <div className="rounded-3xl border border-neutral-200/70 bg-[#efe9df] p-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-medium text-neutral-700">설치 공간</label>
                <select
                  value={inputs.space}
                  onChange={(e) => setInputs((p) => ({ ...p, space: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
                >
                  <option>거실</option>
                  <option>안방</option>
                  <option>서재</option>
                  <option>아이방</option>
                  <option>전체</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700">가로(cm)</label>
                <input
                  value={inputs.widthCm}
                  onChange={(e) => setInputs((p) => ({ ...p, widthCm: e.target.value }))}
                  inputMode="numeric"
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-700">세로(cm)</label>
                <input
                  value={inputs.heightCm}
                  onChange={(e) => setInputs((p) => ({ ...p, heightCm: e.target.value }))}
                  inputMode="numeric"
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700">창 개수</label>
                <select
                  value={inputs.count}
                  onChange={(e) => setInputs((p) => ({ ...p, count: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}개</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700">원단</label>
                <select
                  value={inputs.fabric}
                  onChange={(e) => setInputs((p) => ({ ...p, fabric: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
                >
                  <option>스탠다드</option>
                  <option>프리미엄</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700">차광</label>
                <select
                  value={inputs.blackout}
                  onChange={(e) => setInputs((p) => ({ ...p, blackout: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
                >
                  <option>보통</option>
                  <option>강함</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700">반려동물</label>
                <select
                  value={inputs.pet}
                  onChange={(e) => setInputs((p) => ({ ...p, pet: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
                >
                  <option>있음</option>
                  <option>없음</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-neutral-700">천장/대형창</label>
                <select
                  value={inputs.ceiling}
                  onChange={(e) => setInputs((p) => ({ ...p, ceiling: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
                >
                  <option>보통</option>
                  <option>높음</option>
                </select>
                <div className="mt-2 text-xs text-neutral-500">
                  * 사진 1~2장만 더하면 안내가 매우 빨라집니다.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 톤 수정된 Problem/Solution */}
        <div className="mt-6 rounded-3xl border border-neutral-200/70 bg-white/70 p-5">
          <div className="text-sm font-medium text-neutral-800">
            <span className="rounded-lg px-2 py-1" style={{ background: "rgba(11,31,59,0.08)", color: THEME.navy }}>
              매일 마주하는 거실, 아직도 관리하기 힘든 커튼으로 가려두셨나요?
            </span>{" "}
            이제 관리는 덜어내고 <span className="font-semibold" style={{ color: THEME.navy }}>아름다움만 남기세요.</span>
          </div>

          <ul className="mt-4 grid grid-cols-1 gap-2 text-sm text-neutral-700 sm:grid-cols-3">
            {[
              "정갈한 라인으로 공간의 격을 정리",
              "부분 관리로 ‘유지 비용(시간)’을 최소화",
              "빛과 무드가 공간의 가치를 끌어올림",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4" style={{ color: THEME.navy }} />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ComparisonTable() {
  const rows = [
    { k: "인테리어 완성도", curtain: "○", blind: "△", unislat: "◎" },
    { k: "정갈한 라인감", curtain: "△", blind: "◎", unislat: "◎" },
    { k: "유지/관리 부담", curtain: "△", blind: "○", unislat: "◎" },
    { k: "부분 관리", curtain: "✕", blind: "✕", unislat: "◎" },
    { k: "공간의 가치(무드)", curtain: "○", blind: "△", unislat: "◎" },
  ];

  return (
    <div className="mt-10 overflow-hidden rounded-3xl border border-neutral-200/70 bg-white/65 shadow-sm backdrop-blur">
      <div className="p-6 sm:p-8">
        <div className="text-xs font-medium text-neutral-500">비교표</div>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
          선택을 ‘확신’으로 바꾸는 한 장
        </h3>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="py-3 pr-4 font-semibold text-neutral-900">항목</th>
                <th className="py-3 pr-4 font-medium text-neutral-700">일반 커튼</th>
                <th className="py-3 pr-4 font-medium text-neutral-700">일반 블라인드</th>
                <th className="py-3 pr-4 font-semibold text-neutral-900">유니슬렛</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.k} className="border-b border-neutral-200/70">
                  <td className="py-3 pr-4 font-medium text-neutral-900">{r.k}</td>
                  <td className="py-3 pr-4 text-neutral-700">{r.curtain}</td>
                  <td className="py-3 pr-4 text-neutral-700">{r.blind}</td>
                  <td className="py-3 pr-4 font-semibold" style={{ color: THEME.navy }}>{r.unislat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <CTAButton onClick={() => scrollToId("estimate")} variant="primary">
            3초 견적 다시 보기
          </CTAButton>
          <CTAButton href={CONTACT.kakaoUrl} variant="outline">
            카톡 상담
          </CTAButton>
        </div>
      </div>
    </div>
  );
}

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
            className="h-56 w-full object-cover transition duration-700 group-hover:scale-[1.02] sm:h-64"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <figcaption className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-neutral-900">
              {g.label}
            </span>
            <div className="mt-2 text-base font-semibold text-white sm:text-lg">{g.title}</div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200/70 bg-white/90 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
        <a
          href={`tel:${CONTACT.tel}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 transition-transform hover:scale-105 active:scale-95"
        >
          <PhoneCall className="h-4 w-4" />
          전화 상담
        </a>
        <button
          onClick={() => scrollToId("estimate")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95"
          style={{ background: THEME.navy }}
          type="button"
        >
          <MessageCircle className="h-4 w-4" />
          견적 확인
        </button>
      </div>
    </div>
  );
}

export default function App() {
  // CSS 변수로 navy를 배너에서 쓰기 위해(간단)
  useEffect(() => {
    document.documentElement.style.setProperty("--navy", THEME.navy);
  }, []);

  const identityTags = [
    "🏡 신혼집",
    "🐈 반려동물",
    "☕ 홈카페",
    "🛋️ 인테리어 취향",
    "🧺 관리 최소",
    "📸 거실 사진 잘 나오는 집",
  ];

  return (
    <div className="min-h-screen" style={{ background: THEME.greige }}>
      <ScarcityBanner />

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-neutral-200/60 bg-[#f3eee6]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div
              className="rounded-2xl px-3 py-1 text-xs font-semibold tracking-wider text-white"
              style={{ background: THEME.navy }}
            >
              {BRAND.name}
            </div>
            <div className="hidden text-xs font-medium text-neutral-600 sm:block">
              {BRAND.product}
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <CTAButton href={`tel:${CONTACT.tel}`} variant="outline">전화</CTAButton>
            <CTAButton onClick={() => scrollToId("estimate")} variant="primary">3초 견적</CTAButton>
          </div>

          <div className="sm:hidden">
            <button
              onClick={() => scrollToId("estimate")}
              className="rounded-2xl px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95"
              style={{ background: THEME.navy }}
              type="button"
            >
              견적
            </button>
          </div>
        </div>
      </header>

      {/* HERO (프리미엄 톤/여백/중앙 정렬) */}
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:pb-14 sm:pt-14">
        <div className="relative overflow-hidden rounded-[2rem] border border-neutral-200/70 bg-white/45 shadow-sm backdrop-blur">
          {/* Background visual */}
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
            alt="유니슬렛 프리미엄 거실 이미지"
            className="h-[520px] w-full object-cover"
          />

          {/* Premium overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
          <div className="relative z-10 flex min-h-[520px] items-center justify-center px-6 py-10">
            <div className="mx-auto max-w-3xl text-center text-white">
              <div className="mb-5 inline-flex flex-wrap justify-center gap-2">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium">
                  프리미엄 인테리어
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium">
                  공간의 가치 상승
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium">
                  정갈한 라인
                </span>
              </div>

              <h1 className="text-3xl font-semibold leading-[1.12] tracking-[-0.02em] sm:text-5xl">
                단 한 번의 시공으로,
                <br />
                거실이 5성급 호텔 라운지가 됩니다.
              </h1>

              <p className="mt-5 text-base font-light leading-relaxed text-white/90 sm:text-lg">
                커튼의 포근함과 블라인드의 정갈함, 그 완벽한 결합.
                <br className="hidden sm:block" />
                당신의 공간에 품격을 입히세요.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
                <CTAButton onClick={() => scrollToId("estimate")} variant="primary">
                  무료 실측 혜택으로 견적 확인
                </CTAButton>
                <CTAButton href={CONTACT.kakaoUrl} variant="outline">
                  카톡 상담
                </CTAButton>
              </div>

              <div className="mt-7">
                <div className="text-xs font-light text-white/70">이 중 하나라도 해당되면, 만족도가 특히 높습니다</div>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {identityTags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM/SOLUTION + CALC */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:pb-20">
        <div className="rounded-[2rem] border border-neutral-200/60 bg-white/55 p-6 shadow-sm backdrop-blur sm:p-10">
          <div className="text-xs font-medium text-neutral-500">거실의 품격</div>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            매일 마주하는 거실,
            <br />
            <span style={{ color: THEME.navy }}>아름다움만 남기고 관리 부담은 덜어내세요.</span>
          </h2>

          <p className="mt-4 text-sm font-light leading-relaxed text-neutral-700 sm:text-base">
            “좋은 인테리어”는 새 가구가 아니라, 창에서 결정됩니다.
            정돈된 라인과 고급스러운 무드가 공간의 가치를 끌어올립니다.
          </p>

          <div id="estimate">
            <QuickEstimate />
          </div>

          <ComparisonTable />
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:pb-20">
        <div className="text-xs font-medium text-neutral-500">전후 사진</div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          사진은 ‘분위기 변화’를 숨기지 않습니다
        </h2>

        <Gallery />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              title: "거실의 ‘급’이 달라 보임",
              text: "창 라인이 정리되면, 공간 전체가 정돈된 인상으로 바뀝니다.",
            },
            {
              title: "유지 비용(시간)이 줄어듦",
              text: "관리 부담이 줄면 ‘예쁜 상태’를 오래 유지할 수 있습니다.",
            },
            {
              title: "무드가 생활 만족도로 연결",
              text: "빛과 질감은 매일의 기분을 바꿉니다. 결국 집의 가치가 올라갑니다.",
            },
          ].map((r) => (
            <div key={r.title} className="rounded-3xl border border-neutral-200/70 bg-white/70 p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-900">
                <Star className="h-4 w-4" style={{ color: THEME.navy }} />
                {r.title}
              </div>
              <p className="mt-3 text-sm font-light leading-relaxed text-neutral-700">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OFFER */}
      <section id="offer" className="mx-auto max-w-6xl px-4 pb-24 sm:pb-20">
        <div className="rounded-[2rem] border border-neutral-200/60 p-6 text-white shadow-sm sm:p-10" style={{ background: THEME.navy }}>
          <div className="text-xs font-medium text-white/70">상담 신청</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            결정을 요구하지 않습니다.
            <br />
            먼저 “확인”부터 하세요.
          </h2>
          <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-white/85 sm:text-base">
            사진 1~2장 + 대략 사이즈만 있으면,
            당신의 공간에 가장 어울리는 톤과 옵션으로 빠르게 안내합니다.
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <a
              href={`tel:${CONTACT.tel}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-base font-medium text-neutral-900 transition-transform hover:scale-105 active:scale-95 sm:w-auto"
            >
              <PhoneCall className="h-4 w-4" /> 전화 상담
            </a>
            <a
              href={CONTACT.kakaoUrl}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-base font-semibold text-white transition-transform hover:scale-105 active:scale-95 sm:w-auto"
              style={{ background: "rgba(255,255,255,0.14)" }}
            >
              <MessageCircle className="h-4 w-4" /> 카톡 상담
            </a>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              "사진(창/거실) 1~2장",
              "대략 사이즈(가로·세로) 또는 창 개수",
              "원하는 무드(밝게/차분/차광/반려동물 등)",
            ].map((t) => (
              <div key={t} className="rounded-3xl bg-white/10 p-5 text-sm text-white/90">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-white/90" />
                  <span className="font-light">{t}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-white/60">* 최종 금액은 실측 후 확정됩니다.</div>
        </div>
      </section>

      <footer className="border-t border-neutral-200/60 pb-28 sm:pb-8" style={{ background: THEME.greige }}>
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-600">
          <div className="font-medium" style={{ color: THEME.ink }}>{BRAND.name}</div>
          <div className="mt-1">
            상담:{" "}
            <a className="font-semibold" style={{ color: THEME.ink }} href={`tel:${CONTACT.tel}`}>
              {CONTACT.tel}
            </a>
          </div>
        </div>
      </footer>

      <StickyMobileCTA />
    </div>
  );
}
