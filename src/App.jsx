import React, { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Wind,
  Ruler,
  RotateCw,
  CheckCircle2,
  ArrowUpRight,
  PhoneCall,
  MessageCircle,
  Star,
  BadgeCheck,
} from "lucide-react";

/**
 * ✅ 운영 시 수정할 것
 * - tel: 실제 번호
 * - kakaoUrl: 실제 오픈채팅/채널
 */
const CONTACT = {
  tel: "010-0000-0000",
  kakaoUrl: "https://open.kakao.com/o/sH00Mn6h",
};

const BRAND = {
  name: "UNISLAT",
  area: "부산 전지역",
  proYears: 20,
};

/**
 * ✅ 견적 모델 (허위 단정 방지)
 * - 아래 숫자는 “예시 스케일”이며, 실제 단가/옵션을 넣어서 운영하세요.
 */
const ESTIMATE_MODEL = {
  BASE_PER_M2: 190000, // m²당 단가(예시) → 실제 값으로 교체
  INSTALL_BASE: 120000, // 기본 시공/출장/부자재(예시) → 실제 값으로 교체
  ERROR_RATE: 0.12, // 실측 전 ± 오차율
  OPTION_MULTIPLIERS: {
    fabricPremium: 1.12,
    blackout: 1.08,
    pet: 1.06,
    highCeiling: 1.05,
  },
};

function formatKRW(n) {
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString("ko-KR") + "원";
}

function scrollToId(id) {
  const el = document.getElementById(id);
  el?.scrollIntoView?.({ behavior: "smooth", block: "start" });
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200/70 bg-white/70 px-3 py-1 text-xs font-semibold text-neutral-700 shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

function CTAButton({ children, onClick, href, variant = "dark" }) {
  const cls =
    variant === "dark"
      ? "bg-neutral-900 text-white hover:bg-neutral-800"
      : "bg-white/80 text-neutral-900 border border-neutral-200 hover:bg-white";
  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-base font-semibold transition sm:w-auto";
  if (href) {
    return (
      <a className={`${base} ${cls}`} href={href}>
        {children} <ArrowUpRight className="h-4 w-4" />
      </a>
    );
  }
  return (
    <button className={`${base} ${cls}`} onClick={onClick} type="button">
      {children}
      <ArrowUpRight className="h-4 w-4" />
    </button>
  );
}

/** 3초 컷 견적 계산기 */
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

    const core = area * ESTIMATE_MODEL.BASE_PER_M2 * mult;
    const raw = core + ESTIMATE_MODEL.INSTALL_BASE;
    const min = Math.round(raw * (1 - ESTIMATE_MODEL.ERROR_RATE));
    const max = Math.round(raw * (1 + ESTIMATE_MODEL.ERROR_RATE));

    return {
      area,
      min,
      max,
      summary: `${inputs.space} · ${c}개 · ${Math.round(w * 100)}x${Math.round(h * 100)}cm`,
      inputs,
    };
  }, [inputs]);

  useEffect(() => onEstimate?.(estimate), [estimate, onEstimate]);

  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-neutral-200/70 bg-white/70 shadow-sm backdrop-blur">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="p-6 sm:p-8">
          <div className="text-xs font-semibold text-neutral-500">PRICE FIRST</div>
          <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-900">
            가격부터 보고 결정하세요.
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-base">
            상담을 시작하기 전에, “얼마예요?”를 대신해 <b className="text-neutral-900">실측 전 예상 범위</b>를 먼저 보여드립니다.
            가격이 안 보이면 사람은 결국 “미루기”를 선택합니다.
          </p>

          <div className="mt-5 rounded-3xl bg-neutral-900 p-5 text-white">
            <div className="text-xs text-white/75">3초 컷 예상 금액 (실측 전)</div>
            <div className="mt-2 text-2xl font-extrabold">
              {formatKRW(estimate.min)} ~ {formatKRW(estimate.max)}
            </div>
            <div className="mt-2 text-xs text-white/75">
              {estimate.summary} · 면적 약 {estimate.area.toFixed(1)}m²
            </div>
            <div className="mt-3 text-xs text-white/70">
              * 최종 금액은 창 구조/레일/원단/시공 난이도에 따라 실측 후 확정됩니다.
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <CTAButton onClick={() => scrollToId("offer")}>상담/실측 예약하기</CTAButton>
            <CTAButton href={CONTACT.kakaoUrl} variant="light">카톡으로 사진 보내기</CTAButton>
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
                * 실측 전 “범위”만 보여도 구매 저항은 크게 내려갑니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 모바일 하단 고정 CTA */
function StickyMobileCTA({ estimate }) {
  const label = estimate?.min
    ? `견적 받기 · ${Math.round(estimate.min / 10000)}~${Math.round(estimate.max / 10000)}만`
    : "30초 견적 받기";

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

/** 고민 종결 비교표 */
function ComparisonTable() {
  const rows = [
    { k: "채광 조절", curtain: "△", blind: "◎", unislat: "◎" },
    { k: "촉감/무드", curtain: "◎", blind: "△", unislat: "◎" },
    { k: "먼지/털 관리", curtain: "△", blind: "○", unislat: "◎" },
    { k: "부분 세탁", curtain: "✕", blind: "✕", unislat: "◎" },
    { k: "파손/변형 스트레스", curtain: "○", blind: "△", unislat: "○" },
    { k: "동선(베란다 출입)", curtain: "△", blind: "○", unislat: "◎" },
    { k: "공간이 커 보이는 라인", curtain: "○", blind: "○", unislat: "◎" },
  ];

  return (
    <div className="mt-12 overflow-hidden rounded-3xl border border-neutral-200/70 bg-white/70 shadow-sm backdrop-blur">
      <div className="p-6 sm:p-8">
        <div className="text-xs font-semibold text-neutral-500">DECISION KILLER</div>
        <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-900">
          고민을 끝내는 비교표
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-base">
          유니슬렛은 “커튼을 더 좋게 만든 제품”이 아니라, <b className="text-neutral-900">생활/관리 구조를 바꾼 새 카테고리</b>입니다.
          그래서 비교가 끝나면 결론이 나옵니다.
        </p>

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
          <CTAButton onClick={() => scrollToId("estimate")}>견적 먼저 보고 상담하기</CTAButton>
          <CTAButton href={CONTACT.kakaoUrl} variant="light">
            카톡으로 사진 보내기
          </CTAButton>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="rounded-3xl border border-neutral-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-neutral-900 p-2 text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-base font-extrabold text-neutral-900">{title}</div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-neutral-700">{desc}</p>
    </div>
  );
}

function ReviewCard({ name, text }) {
  return (
    <div className="rounded-3xl border border-neutral-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
        <Star className="h-4 w-4" />
        {name}
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
              {BRAND.area} · {BRAND.proYears}년 시공
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <CTAButton href={`tel:${CONTACT.tel}`} variant="light">전화</CTAButton>
            <CTAButton onClick={() => scrollToId("estimate")}>30초 견적</CTAButton>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:pb-16 sm:pt-14">
        <div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2">
          <div>
            <div className="flex flex-wrap gap-2">
              <Pill><Sparkles className="h-3.5 w-3.5" /> 새 카테고리: 유니슬렛</Pill>
              <Pill><ShieldCheck className="h-3.5 w-3.5" /> A/S 중심 설계</Pill>
              <Pill><Wind className="h-3.5 w-3.5" /> 먼지 스트레스 컷</Pill>
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-neutral-900 sm:text-5xl">
              아직도 먼지 나는 무거운 커튼을 쓰고 계신가요?
            </h1>
            <p className="mt-4 text-base leading-relaxed text-neutral-700 sm:text-lg">
              블라인드의 채광 조절과 커튼의 부드러움을 하나로. <br className="hidden sm:block" />
              거실의 품격을 바꾸는 <b className="text-neutral-900">유니슬렛</b>.
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <CTAButton onClick={() => scrollToId("estimate")}>우리집 견적 30초 만에 확인하기</CTAButton>
              <CTAButton href={CONTACT.kakaoUrl} variant="light">카톡 빠른 상담</CTAButton>
            </div>

            <div className="mt-5 text-xs text-neutral-500">
              * 인스타/카톡 브라우저에서도 빠르게 뜨도록 “단일 페이지 + 즉시 CTA” 구조로 설계되었습니다.
            </div>
          </div>

          {/* Visual placeholder (영상/이미지 루프 자리) */}
          <div className="relative overflow-hidden rounded-[2rem] border border-neutral-200/70 bg-white/60 shadow-sm backdrop-blur">
            <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-[#f7f3ec] to-neutral-200/30" />
            <div className="relative p-6 sm:p-8">
              <div className="text-xs font-semibold text-neutral-600">VISUAL LOOP</div>
              <div className="mt-2 text-lg font-extrabold text-neutral-900">
                “닫혀 있어도, 지나갈 수 있는 커튼”
              </div>
              <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                여기에 “슬랫 사이를 걸어서 통과하는” 영상/이미지를 넣으면, 3초 안에 메커니즘이 이해됩니다.
                (예: <span className="font-semibold">public/hero.mp4</span> 또는 <span className="font-semibold">public/hero.jpg</span>)
              </p>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 rounded-xl border border-neutral-200/60 bg-white/60"
                  />
                ))}
              </div>
              <div className="mt-4 text-xs text-neutral-500">
                (임시 플레이스홀더) 실제 시공 사진/영상으로 교체 권장
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM + ESTIMATE */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:pb-20">
        <div className="rounded-[2rem] border border-neutral-200/60 bg-white/55 p-6 shadow-sm backdrop-blur sm:p-10">
          <div className="text-xs font-semibold text-neutral-500">SECTION 2 · PROBLEM</div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
            지금 쓰는 커튼/블라인드가 “불편한 게 정상”이 되어버린 상태
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-base">
            커튼은 무겁고, 먼지를 먹고, 세탁은 미뤄집니다. 블라인드는 차갑고, 꺾이고, 청소하다 손이 다칩니다.
            문제는 “제품”이 아니라 <b className="text-neutral-900">관리 구조</b>입니다.
          </p>

          {/* ✅ 견적 계산기: 스크롤 조금만 내려도 바로 보이게 */}
          <div id="estimate">
            <QuickEstimate onEstimate={setQuickEstimate} />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FeatureCard
              icon={Ruler}
              title="블라인드: 청소하다 손 베이고, 아이들이 만져서 꺾이고"
              desc="‘날카롭고 얇은 구조’는 결국 파손 스트레스를 부릅니다. 관리가 귀찮아지는 순간, 집은 바로 티가 납니다."
            />
            <FeatureCard
              icon={RotateCw}
              title="패브릭 커튼: 1년에 한 번도 세탁하기 힘든 무게, 그 사이 쌓이는 미세먼지"
              desc="세탁이 ‘큰 결심’이 되는 순간부터, 커튼은 깨끗함을 포기하는 가구가 됩니다. 특히 반려동물/알레르기면 더 치명적입니다."
            />
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:pb-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-xs font-semibold text-neutral-500">SECTION 3 · SOLUTION</div>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
              유니슬렛은 “더 좋은 커튼”이 아니라, 완전히 다른 메커니즘입니다
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-base">
              핵심은 “부분 분리/부분 세탁”과 “동선 유지”입니다. 관리가 쉬워지면, 집은 자동으로 깨끗해집니다.
            </p>
          </div>
          <div className="hidden sm:flex">
            <CTAButton onClick={() => scrollToId("offer")}>바로 상담 예약</CTAButton>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={Wind}
            title="Walk-through"
            desc="닫혀 있어도 슬랫 사이로 ‘통과’가 가능합니다. 베란다/창문 접근이 스트레스가 아닙니다."
          />
          <FeatureCard
            icon={RotateCw}
            title="부분 세탁"
            desc="더러운 슬랫만 분리해서 세탁기에. ‘전체를 떼어내는 세탁’ 자체가 사라집니다."
          />
          <FeatureCard
            icon={BadgeCheck}
            title="형상 기억"
            desc="구김이 남는 패브릭이 아니라, 형태가 유지되는 원단 구조로 관리 난이도를 낮춥니다."
          />
          <FeatureCard
            icon={Ruler}
            title="공간이 높아 보이는 라인"
            desc="세로 라인이 천장을 더 높게 보이게 만듭니다. 거실 ‘급’이 한 단계 올라갑니다."
          />
        </div>

        <ComparisonTable />
      </section>

      {/* SOCIAL PROOF */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:pb-20">
        <div className="rounded-[2rem] border border-neutral-200/60 bg-white/55 p-6 shadow-sm backdrop-blur sm:p-10">
          <div className="text-xs font-semibold text-neutral-500">SECTION 4 · TRUST</div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
            {BRAND.proYears}년차 전문가가 직접 실측·시공합니다
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-base">
            “예쁘게 달아드릴게요”가 아니라, <b className="text-neutral-900">오래 문제 없이 쓰게 하는 구조</b>로 시공합니다.
            (레일/수평/내구/동선까지 같이 봅니다)
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-neutral-200/70 bg-white/70 p-6">
              <div className="text-sm font-extrabold text-neutral-900">Before / After (필수)</div>
              <p className="mt-2 text-sm text-neutral-700">
                여기에 실제 시공 전/후 사진을 넣으면 전환율이 확 올라갑니다.
                (public/before1.jpg, public/after1.jpg 형태로 넣고 img로 교체)
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="h-28 rounded-2xl border border-neutral-200/60 bg-neutral-100" />
                <div className="h-28 rounded-2xl border border-neutral-200/60 bg-neutral-100" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <ReviewCard
                name="거실 분위기가 ‘신축’처럼 바뀌었어요"
                text="커튼은 답답하고 블라인드는 차가워서 늘 애매했는데, 유니슬렛은 밝기 조절이 되면서도 공간이 부드러워졌어요."
              />
              <ReviewCard
                name="반려동물 털/냄새 관리가 진짜 쉬워요"
                text="전체 세탁이 아니라 더러워진 부분만 분리해서 돌릴 수 있으니까 ‘미루는 이유’가 사라졌어요."
              />
            </div>
          </div>
        </div>
      </section>

      {/* OFFER */}
      <section id="offer" className="mx-auto max-w-6xl px-4 pb-24 sm:pb-20">
        <div className="rounded-[2rem] border border-neutral-200/60 bg-neutral-900 p-6 text-white shadow-sm sm:p-10">
          <div className="text-xs font-semibold text-white/70">SECTION 5 · OFFER</div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            결론: “견적을 본 사람”만 상담이 빨라집니다
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            이미 위에서 예상 범위를 봤다면, 이제는 빠르게 끝내는 단계입니다.
            사진 1~2장 + 창 사이즈만 있어도 상담이 시작됩니다.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/10 p-5">
              <div className="flex items-center gap-2 text-sm font-bold">
                <ShieldCheck className="h-4 w-4" /> 리스크 리버설
              </div>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4" /> 실측 후 최종 확정 (예상범위는 참고)</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4" /> A/S 기준을 먼저 설명</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4" /> 설치 후 사용법 안내</li>
              </ul>
            </div>

            <div className="rounded-3xl bg-white/10 p-5">
              <div className="flex items-center gap-2 text-sm font-bold">
                <BadgeCheck className="h-4 w-4" /> “새 메커니즘”
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                커튼/블라인드의 단점을 “참고 쓰는” 시대를 끝냅니다.
                생활 구조가 바뀌면, 인테리어는 자동으로 좋아집니다.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-5">
              <div className="flex items-center gap-2 text-sm font-bold">
                <PhoneCall className="h-4 w-4" /> 바로 연결
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                전화/카톡 중 편한 채널로 바로 진행하세요.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <a
                  href={`tel:${CONTACT.tel}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-neutral-900"
                >
                  <PhoneCall className="h-4 w-4" /> 전화 상담
                </a>
                <a
                  href={CONTACT.kakaoUrl}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-bold text-white"
                >
                  <MessageCircle className="h-4 w-4" /> 카톡 상담
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 text-xs text-white/60">
            * “이번 달 몇 자리 남음” 같은 수치는 실제 운영 데이터가 있을 때만 넣는 것을 권장합니다(허위 희소성은 리스크).
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200/60 bg-[#f6f1e8] pb-28 sm:pb-8">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-600">
          <div className="font-extrabold text-neutral-900">{BRAND.name}</div>
          <div className="mt-1">{BRAND.area} · 상담: {CONTACT.tel}</div>
          <div className="mt-3 text-xs text-neutral-500">
            본 페이지의 “예상 견적”은 실측 전 참고용 범위입니다.
          </div>
        </div>
      </footer>

      {/* Mobile sticky CTA */}
      <StickyMobileCTA estimate={quickEstimate} />
    </div>
  );
}
