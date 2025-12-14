import React, { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  Wind,
  Ruler,
  RotateCw,
  CheckCircle2,
  ArrowUpRight,
  PhoneCall,
  MessageCircle,
  Star,
} from "lucide-react";

/** ✅ 실사용 설정 */
const BRAND = {
  name: "더슬렛",
  subtitle: "유니슬렛 · 방문 실측 · 맞춤 시공",
};

const CONTACT = {
  tel: "010-7534-2913",
  kakaoUrl: "https://open.kakao.com/o/sH00Mn6h", // 필요 시 교체
};

/**
 * ✅ 견적 숫자(원) 노출 안전장치
 * - 아래 2개 값을 실제 운영 단가로 채우면 “원 단위 범위”가 자동 표시됩니다.
 * - 값이 0이면 숫자를 표시하지 않고 “상담으로 범위 안내”만 보여줍니다. (실전 안전모드)
 */
const ESTIMATE_MODEL = {
  BASE_PER_M2: 0, // m²당 단가(원) → 실제 값 입력 (예: 190000)
  INSTALL_BASE: 0, // 기본 시공/출장/부자재(원) → 실제 값 입력 (예: 120000)
  ERROR_RATE: 0.12, // 실측 전 ± 오차율
  OPTION_MULTIPLIERS: {
    fabricPremium: 1.12,
    blackout: 1.08,
    pet: 1.06,
    highCeiling: 1.05,
  },
};

/** ✅ 이미지/영상 경로 (public 폴더 기준) */
const MEDIA = {
  heroVideoMp4: "/media/hero.mp4", // 없으면 자동으로 이미지/그라데이션으로 대체
  heroImage: "/images/hero.webp", // 없으면 자동 대체
  gallery: [
    { label: "BEFORE", title: "교체 전", src: "/images/before-1.webp" },
    { label: "AFTER", title: "교체 후", src: "/images/after-1.webp" },
    { label: "BEFORE", title: "교체 전", src: "/images/before-2.webp" },
    { label: "AFTER", title: "교체 후", src: "/images/after-2.webp" },
  ],
};

function formatKRW(n) {
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString("ko-KR") + "원";
}
function cn(...c) {
  return c.filter(Boolean).join(" ");
}
function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView?.({ behavior: "smooth", block: "start" });
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200/70 bg-white/70 px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

function CTAButton({ children, onClick, href, variant = "dark", className = "" }) {
  const cls =
    variant === "dark"
      ? "bg-neutral-900 text-white hover:bg-neutral-800"
      : "bg-white/80 text-neutral-900 border border-neutral-200 hover:bg-white";
  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-base font-semibold transition sm:w-auto";
  if (href) {
    return (
      <a className={cn(base, cls, className)} href={href}>
        {children} <ArrowUpRight className="h-4 w-4" />
      </a>
    );
  }
  return (
    <button className={cn(base, cls, className)} onClick={onClick} type="button">
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
      className={cn(
        "bg-gradient-to-br from-neutral-200/60 via-white/40 to-neutral-100/60",
        className
      )}
    />
  );
}

/** 3초 컷 견적 + “견적 메모 복사” */
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
  const [copied, setCopied] = useState(false);

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
      `[더슬렛 유니슬렛 견적요청]\n` +
      `공간: ${inputs.space}\n` +
      `창: ${c}개\n` +
      `사이즈: ${Math.round(w * 100)} x ${Math.round(h * 100)} cm\n` +
      `원단: ${inputs.fabric}\n` +
      `차광: ${inputs.blackout}\n` +
      `반려동물: ${inputs.pet}\n` +
      `천장/대형창: ${inputs.ceiling}\n` +
      `요청: (사진 첨부 가능)\n`;

    return {
      area,
      min,
      max,
      summary: `${inputs.space} · ${c}개 · ${Math.round(w * 100)}x${Math.round(h * 100)}cm`,
      memo,
      inputs,
      canShowNumbers,
    };
  }, [inputs, canShowNumbers]);

  useEffect(() => onEstimate?.(estimate), [estimate, onEstimate]);

  async function copyMemo() {
    try {
      await navigator.clipboard.writeText(estimate.memo);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // clipboard 실패 시 무시 (모바일 브라우저 정책)
      setCopied(false);
    }
  }

  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-neutral-200/70 bg-white/70 shadow-sm backdrop-blur">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="p-6 sm:p-8">
          <div className="text-xs font-semibold text-neutral-500">3초 컷 견적</div>
          <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-900">
            가격이 궁금한 게 당연합니다.
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-base">
            그래서 먼저 보여드립니다. (실측 전 기준)
          </p>

          <div className="mt-5 rounded-3xl bg-neutral-900 p-5 text-white">
            <div className="text-xs text-white/75">
              {estimate.canShowNumbers ? "예상 금액 범위 (실측 전)" : "예상 금액 안내"}
            </div>

            {estimate.canShowNumbers ? (
              <>
                <div className="mt-2 text-2xl font-extrabold">
                  {formatKRW(estimate.min)} ~ {formatKRW(estimate.max)}
                </div>
                <div className="mt-2 text-xs text-white/75">
                  {estimate.summary} · 면적 약 {estimate.area.toFixed(1)}m²
                </div>
              </>
            ) : (
              <>
                <div className="mt-2 text-xl font-extrabold">입력하신 조건 기준으로</div>
                <div className="mt-1 text-sm text-white/80">
                  예상 범위는 상담으로 바로 안내드립니다.
                </div>
                <div className="mt-2 text-xs text-white/70">
                  (운영 단가를 설정하면 이 영역에 “원 단위 범위”가 자동 표시됩니다.)
                </div>
              </>
            )}

            <div className="mt-3 text-xs text-white/70">
              * 최종 금액은 창 구조/레일/원단/시공 난이도에 따라 실측 후 확정됩니다.
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <CTAButton href={CONTACT.kakaoUrl}>카톡 상담</CTAButton>
            <CTAButton onClick={copyMemo} variant="light">
              {copied ? "복사됨" : "견적 메모 복사"}
            </CTAButton>
          </div>

          <div className="mt-3 text-xs text-neutral-500">
            카톡 상담 시 “견적 메모” 붙여넣고 사진 1~2장 보내면 상담이 빨라집니다.
          </div>
        </div>

        <div className="border-t border-neutral-200/70 bg-[#f7f3ec] p-6 sm:border-l sm:border-t-0 sm:p-8">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-neutral-700">설치 공간</label>
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
              <label className="text-xs font-semibold text-neutral-700">가로(cm)</label>
              <input
                value={inputs.widthCm}
                onChange={(e) => setInputs((p) => ({ ...p, widthCm: e.target.value }))}
                inputMode="numeric"
                className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700">세로(cm)</label>
              <input
                value={inputs.heightCm}
                onChange={(e) => setInputs((p) => ({ ...p, heightCm: e.target.value }))}
                inputMode="numeric"
                className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700">창 개수</label>
              <select
                value={inputs.count}
                onChange={(e) => setInputs((p) => ({ ...p, count: e.target.value }))}
                className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
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
                className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
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
                className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
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
                className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
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
                className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
              >
                <option>보통</option>
                <option>높음</option>
              </select>
              <div className="mt-2 text-xs text-neutral-500">
                * 상담을 빠르게 하려면 “사진 + 대략 사이즈”만 있으면 됩니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 고민 종결 비교표 */
function ComparisonTable() {
  const rows = [
    { k: "채광 조절", curtain: "△", blind: "◎", unislat: "◎" },
    { k: "촉감/무드", curtain: "◎", blind: "△", unislat: "◎" },
    { k: "먼지/털 관리", curtain: "△", blind: "○", unislat: "◎" },
    { k: "부분 세탁", curtain: "✕", blind: "✕", unislat: "◎" },
    { k: "동선(베란다 출입)", curtain: "△", blind: "○", unislat: "◎" },
  ];

  return (
    <div className="mt-12 overflow-hidden rounded-3xl border border-neutral-200/70 bg-white/70 shadow-sm backdrop-blur">
      <div className="p-6 sm:p-8">
        <div className="text-xs font-semibold text-neutral-500">비교표</div>
        <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-900">
          고민을 끝내는 한 장
        </h3>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="py-3 pr-4 font-extrabold text-neutral-900">항목</th>
                <th className="py-3 pr-4 font-extrabold text-neutral-700">일반 커튼</th>
                <th className="py-3 pr-4 font-extrabold text-neutral-700">일반 블라인드</th>
                <th className="py-3 pr-4 font-extrabold text-neutral-900">유니슬렛</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.k} className="border-b border-neutral-200/70">
                  <td className="py-3 pr-4 font-semibold text-neutral-900">{r.k}</td>
                  <td className="py-3 pr-4 text-neutral-700">{r.curtain}</td>
                  <td className="py-3 pr-4 text-neutral-700">{r.blind}</td>
                  <td className="py-3 pr-4 font-extrabold text-neutral-900">{r.unislat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <CTAButton onClick={() => scrollToId("estimate")}>3초 견적 확인</CTAButton>
          <CTAButton href={CONTACT.kakaoUrl} variant="light">
            카톡 상담
          </CTAButton>
        </div>
      </div>
    </div>
  );
}

/** 모바일 하단 고정 CTA */
function StickyMobileCTA({ estimate }) {
  const label =
    estimate?.canShowNumbers && estimate?.min
      ? `견적 받기 · ${Math.round(estimate.min / 10000)}~${Math.round(estimate.max / 10000)}만`
      : "견적 받기";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200/70 bg-white/80 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-3">
        <a
          href={`tel:${CONTACT.tel}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white/80 px-4 py-2 text-sm font-semibold text-neutral-900"
        >
          <PhoneCall className="h-4 w-4" />
          전화 상담
        </a>
        <button
          onClick={() => scrollToId("estimate")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
          type="button"
        >
          <MessageCircle className="h-4 w-4" />
          {label}
        </button>
      </div>
    </div>
  );
}

function Gallery() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
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
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-neutral-900">
                {g.label}
              </span>
            </div>
            <div className="mt-2 text-base font-bold text-white sm:text-lg">{g.title}</div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function ReviewCard({ title, text }) {
  return (
    <div className="rounded-3xl border border-neutral-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="flex items-center gap-2 text-sm font-extrabold text-neutral-900">
        <Star className="h-4 w-4" />
        {title}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-neutral-700">{text}</p>
    </div>
  );
}

export default function App() {
  const [quickEstimate, setQuickEstimate] = useState(null);

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-neutral-900">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-neutral-200/60 bg-[#f6f1e8]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="rounded-2xl bg-neutral-900 px-3 py-1 text-xs font-extrabold tracking-wider text-white">
              {BRAND.name}
            </div>
            <div className="hidden text-xs font-semibold text-neutral-600 sm:block">
              {BRAND.subtitle}
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <CTAButton href={`tel:${CONTACT.tel}`} variant="light">
              전화
            </CTAButton>
            <CTAButton onClick={() => scrollToId("estimate")}>3초 견적</CTAButton>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:pb-16 sm:pt-14">
        <div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2">
          <div>
            <div className="flex flex-wrap gap-2">
              <Pill>
                <Sparkles className="h-3.5 w-3.5" /> 유니슬렛
              </Pill>
              <Pill>
                <Wind className="h-3.5 w-3.5" /> 먼지/털 관리
              </Pill>
              <Pill>
                <RotateCw className="h-3.5 w-3.5" /> 부분 세탁
              </Pill>
              <Pill>
                <Ruler className="h-3.5 w-3.5" /> 세로 라인
              </Pill>
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-neutral-900 sm:text-5xl">
              아직도 먼지 나는 무거운 커튼을 쓰고 계신가요?
            </h1>
            <p className="mt-4 text-base leading-relaxed text-neutral-700 sm:text-lg">
              블라인드의 채광 조절과 커튼의 부드러움을 하나로.
              <br className="hidden sm:block" />
              거실의 분위기를 “정돈된 느낌”으로 바꾸는 유니슬렛.
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <CTAButton onClick={() => scrollToId("estimate")}>우리집 견적 3초 확인</CTAButton>
              <CTAButton href={CONTACT.kakaoUrl} variant="light">
                카톡 상담
              </CTAButton>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { t: "닫아도 통과", d: "동선을 막지 않는 구조" },
                { t: "부분 분리", d: "더러운 슬랫만 관리" },
                { t: "무드 + 기능", d: "빛 조절과 부드러움" },
              ].map((x, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-neutral-200/70 bg-white/70 p-5 shadow-sm backdrop-blur"
                >
                  <div className="text-sm font-extrabold text-neutral-900">{x.t}</div>
                  <div className="mt-2 text-xs text-neutral-600">{x.d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative overflow-hidden rounded-[2rem] border border-neutral-200/70 bg-white/60 shadow-sm backdrop-blur">
            <div className="absolute inset-0">
              {/* video -> image -> gradient fallback */}
              <video
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={MEDIA.heroImage}
                onError={(e) => {
                  // 비디오 로드 실패 시 비디오 숨김
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
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-transparent" />
          </div>
        </div>
      </section>

      {/* PROBLEM + ESTIMATE */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:pb-20">
        <div className="rounded-[2rem] border border-neutral-200/60 bg-white/55 p-6 shadow-sm backdrop-blur sm:p-10">
          <div className="text-xs font-semibold text-neutral-500">문제</div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
            커튼은 무겁고, 블라인드는 차갑습니다. 그래서 계속 미루게 됩니다.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-base">
            커튼은 세탁이 부담이라 방치되고, 블라인드는 꺾임/손상/청소 스트레스가 생깁니다.
            결국 집의 첫인상(창)이 “관리 못한 느낌”으로 남습니다.
          </p>

          <div id="estimate">
            <QuickEstimate onEstimate={setQuickEstimate} />
          </div>
        </div>
      </section>

      {/* SOLUTION + 비교표 */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:pb-20">
        <div className="text-xs font-semibold text-neutral-500">해결</div>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
          유니슬렛: 관리 스트레스를 “구조”로 없애는 방식
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { t: "Walk-through", d: "닫혀 있어도 통과 가능" },
            { t: "부분 세탁", d: "더러운 슬랫만 분리" },
            { t: "정돈된 라인", d: "세로 라인으로 공간 보정" },
            { t: "빛 조절", d: "무드 + 실용을 동시에" },
          ].map((x, i) => (
            <div
              key={i}
              className="rounded-3xl border border-neutral-200/70 bg-white/70 p-6 shadow-sm backdrop-blur"
            >
              <div className="text-base font-extrabold text-neutral-900">{x.t}</div>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700">{x.d}</p>
            </div>
          ))}
        </div>

        <ComparisonTable />
      </section>

      {/* SOCIAL PROOF */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:pb-20">
        <div className="text-xs font-semibold text-neutral-500">전후 사진</div>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
          사진이 가장 빠른 설득입니다
        </h2>
        <Gallery />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ReviewCard
            title="분위기가 깔끔해 보이게 바뀜"
            text="창이 정돈되니까 집 전체 인상이 달라졌어요. 사진 찍을 때도 확실히 티가 나요."
          />
          <ReviewCard
            title="세탁/먼지 스트레스 감소"
            text="전체 세탁이 아니라 부분 관리가 되니까 미루는 일이 줄었어요."
          />
          <ReviewCard
            title="빛 조절이 실사용에서 편함"
            text="시간대별로 밝기 조절이 쉬워서 생활 만족도가 올라갔어요."
          />
        </div>
      </section>

      {/* OFFER */}
      <section id="offer" className="mx-auto max-w-6xl px-4 pb-24 sm:pb-20">
        <div className="rounded-[2rem] border border-neutral-200/60 bg-neutral-900 p-6 text-white shadow-sm sm:p-10">
          <div className="text-xs font-semibold text-white/70">상담/문의</div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            사진 1~2장 + 대략 사이즈만 있으면 상담이 시작됩니다
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            견적은 조건(창 구조/레일/원단/난이도)에 따라 달라집니다.
            그래서 먼저 “기준 정보”를 받고 빠르게 안내합니다.
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <a
              href={`tel:${CONTACT.tel}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-base font-semibold text-neutral-900 sm:w-auto"
            >
              <PhoneCall className="h-4 w-4" /> 전화 상담
            </a>
            <a
              href={CONTACT.kakaoUrl}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-base font-semibold text-white sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" /> 카톡 상담
            </a>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              "사진(창/거실) 1~2장",
              "대략 사이즈(가로·세로) 또는 창 개수",
              "원하는 느낌(밝게/무드/차광/반려동물 등)",
            ].map((t, i) => (
              <div key={i} className="rounded-3xl bg-white/10 p-5 text-sm text-white/85">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4" />
                  <span>{t}</span>
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
          <div className="font-extrabold text-neutral-900">{BRAND.name}</div>
          <div className="mt-1">
            상담:{" "}
            <a className="font-semibold text-neutral-900" href={`tel:${CONTACT.tel}`}>
              {CONTACT.tel}
            </a>
          </div>
        </div>
      </footer>

      <StickyMobileCTA estimate={quickEstimate} />
    </div>
  );
}
