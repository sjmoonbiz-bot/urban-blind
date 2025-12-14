import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  Flame,
  MessageCircle,
  PhoneCall,
  Star,
  X,
} from "lucide-react";

/**
 * BRAND / CONTACT
 */
const BRAND = {
  name: "더슬렛",
  product: "유니슬렛",
  tagline: "Premium Window Styling",
};

const CONTACT = {
  tel: "010-7534-2913",
  kakaoUrl: "https://open.kakao.com/o/sH00Mn6h",
};

/**
 * THEME (High-end)
 * Deep Charcoal + Champagne Gold + Warm Greige
 */
const THEME = {
  charcoal: "#1c1917",
  gold: "#d4af37",
  greige: "#e5e0d8",
  ivory: "#fbfaf7",
  ink: "#12100f",
};

/**
 * VIP Estimate model
 * - BASE_PER_M2 / INSTALL_BASE 값을 0이 아닌 실제 단가로 넣으면 “원 단위 범위” 자동 표시
 * - 0이면 숫자는 숨기고 “VIP 견적서 발행(상담)” 흐름으로 작동(허위 가격 노출 방지)
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
 * Unsplash (high-res)
 * - “연출 이미지(예시)”로 사용하는 것을 권장 (실제 시공 전/후는 반드시 실제 사진으로 교체)
 */
const UNSPLASH = {
  hero: "https://source.unsplash.com/featured/2400x1400/?luxury%20interior,minimal%20living%20room",
  gallery: [
    "https://source.unsplash.com/featured/1600x1100/?luxury%20living%20room,minimal",
    "https://source.unsplash.com/featured/1600x1100/?hotel%20lounge,interior",
    "https://source.unsplash.com/featured/1600x1100/?modern%20living%20room,neutral",
    "https://source.unsplash.com/featured/1600x1100/?high-end%20interior,curtains",
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
        "bg-gradient-to-br from-neutral-200/70 via-white/60 to-neutral-100/60",
        className
      )}
    />
  );
}

/**
 * Luxury typography injection (single-file requirement)
 */
function useLuxuryFonts() {
  useEffect(() => {
    const id = "the-slat-fonts";
    if (document.getElementById(id)) return;

    const pre1 = document.createElement("link");
    pre1.rel = "preconnect";
    pre1.href = "https://fonts.googleapis.com";

    const pre2 = document.createElement("link");
    pre2.rel = "preconnect";
    pre2.href = "https://fonts.gstatic.com";
    pre2.crossOrigin = "anonymous";

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600&family=Noto+Serif+KR:wght@300;400;500;600&display=swap";

    document.head.appendChild(pre1);
    document.head.appendChild(pre2);
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.id = "the-slat-font-css";
    style.innerHTML = `
      :root { --charcoal:${THEME.charcoal}; --gold:${THEME.gold}; --greige:${THEME.greige}; --ivory:${THEME.ivory}; --ink:${THEME.ink}; }
      body { background: var(--greige); color: var(--ink); font-family: "Noto Sans KR", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Apple SD Gothic Neo","Malgun Gothic", sans-serif; }
      .slat-display { font-family: "Noto Serif KR", ui-serif, Georgia, "Times New Roman", serif; letter-spacing: -0.02em; }
      .slat-body { font-family: "Noto Sans KR", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Apple SD Gothic Neo","Malgun Gothic", sans-serif; }
    `;
    document.head.appendChild(style);

    return () => {
      // keep fonts for navigation; do not remove
    };
  }, []);
}

function Button({ children, onClick, href, variant = "primary", className = "" }) {
  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-[15px] transition-transform duration-150 sm:w-auto";
  const motion = "hover:scale-[1.02] active:scale-[0.98]";
  const styles =
    variant === "primary"
      ? `bg-[${THEME.charcoal}] text-[${THEME.ivory}] hover:brightness-[1.08]`
      : variant === "gold"
      ? `bg-[${THEME.gold}] text-[${THEME.charcoal}] hover:brightness-[1.05]`
      : variant === "outline"
      ? `border border-[${THEME.charcoal}]/25 bg-white/60 text-[${THEME.charcoal}] hover:bg-white`
      : "bg-white/70 text-neutral-900 border border-neutral-200 hover:bg-white";

  const weight = variant === "gold" ? "font-semibold" : "font-medium";

  if (href) {
    return (
      <a className={cn(base, motion, weight, styles, className)} href={href}>
        {children} <ArrowUpRight className="h-4 w-4" />
      </a>
    );
  }
  return (
    <button className={cn(base, motion, weight, styles, className)} onClick={onClick} type="button">
      {children} <ArrowUpRight className="h-4 w-4" />
    </button>
  );
}

function TopNotice() {
  const KEY = "the_slat_notice_closed_lux_v1";
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (localStorage.getItem(KEY) === "1") setOpen(false);
  }, []);

  if (!open) return null;

  return (
    <div className="w-full border-b border-neutral-200/70 bg-white/65 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="text-sm font-light text-neutral-800">
          <span className="font-medium" style={{ color: THEME.charcoal }}>
            {BRAND.tagline}
          </span>{" "}
          · 이번 달 <span style={{ color: THEME.gold, fontWeight: 600 }}>무료 실측 혜택</span> 잔여{" "}
          <span style={{ color: THEME.charcoal, fontWeight: 600 }}>3팀</span>
        </div>
        <button
          type="button"
          className="rounded-xl border border-neutral-200 bg-white/80 px-2 py-1 text-neutral-700 hover:bg-white"
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

function Badge({ children }) {
  return (
    <span
      className="rounded-full border px-3 py-1 text-[11px] font-medium"
      style={{
        borderColor: "rgba(255,255,255,0.22)",
        background: "rgba(255,255,255,0.10)",
        color: "rgba(255,255,255,0.90)",
      }}
    >
      {children}
    </span>
  );
}

function VIPEstimateCard() {
  const [inputs, setInputs] = useState({
    widthCm: 240,
    heightCm: 230,
    count: 1,
    space: "거실",
    fabric: "Signature",
    blackout: "Standard",
    pet: "No",
    ceiling: "Standard",
  });

  const canShowNumbers = ESTIMATE_MODEL.BASE_PER_M2 > 0 && ESTIMATE_MODEL.INSTALL_BASE > 0;

  const [issueCount, setIssueCount] = useState(17);
  useEffect(() => {
    setIssueCount(12 + Math.floor(Math.random() * 18)); // 12~29
  }, []);

  const estimate = useMemo(() => {
    const w = Math.max(60, Number(inputs.widthCm) || 0) / 100;
    const h = Math.max(120, Number(inputs.heightCm) || 0) / 100;
    const c = Math.min(10, Math.max(1, Number(inputs.count) || 1));
    const area = w * h * c;

    let mult = 1;
    if (inputs.fabric === "Signature") mult *= ESTIMATE_MODEL.OPTION_MULTIPLIERS.fabricPremium;
    if (inputs.blackout === "Enhanced") mult *= ESTIMATE_MODEL.OPTION_MULTIPLIERS.blackout;
    if (inputs.pet === "Yes") mult *= ESTIMATE_MODEL.OPTION_MULTIPLIERS.pet;
    if (inputs.ceiling === "High") mult *= ESTIMATE_MODEL.OPTION_MULTIPLIERS.highCeiling;

    const raw = area * ESTIMATE_MODEL.BASE_PER_M2 * mult + ESTIMATE_MODEL.INSTALL_BASE;
    const min = Math.round(raw * (1 - ESTIMATE_MODEL.ERROR_RATE));
    const max = Math.round(raw * (1 + ESTIMATE_MODEL.ERROR_RATE));

    const memo =
      `[${BRAND.name} ${BRAND.product} VIP 예상 견적서 요청]\n` +
      `공간: ${inputs.space}\n` +
      `창: ${c}개\n` +
      `사이즈: ${Math.round(w * 100)} x ${Math.round(h * 100)} cm\n` +
      `컬렉션: ${inputs.fabric}\n` +
      `차광: ${inputs.blackout}\n` +
      `반려동물: ${inputs.pet}\n` +
      `천장: ${inputs.ceiling}\n` +
      `첨부: (거실/창 사진 1~2장)\n`;

    return { area, min, max, memo, canShowNumbers };
  }, [inputs]);

  async function copyAndGo() {
    try {
      await navigator.clipboard.writeText(estimate.memo);
    } catch {
      // ignore
    } finally {
      scrollToId("offer");
    }
  }

  return (
    <div className="mt-10 overflow-hidden rounded-[28px] border border-neutral-200/70 bg-white/55 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur">
      <div className="p-7 sm:p-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[11px] font-medium text-neutral-500">VIP 예상 견적서</div>
            <div className="mt-2 text-base font-light text-neutral-800">
              <Flame className="mr-1 inline h-4 w-4" style={{ color: THEME.gold }} />
              오늘 <span className="font-medium">{issueCount}건</span>의 예상 견적서가 발행되었습니다
            </div>
          </div>
          <div className="text-[11px] font-light text-neutral-500">* 표시값은 로딩 기준</div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* VIP sheet */}
          <div
            className="rounded-[26px] border p-7"
            style={{
              borderColor: "rgba(28,25,23,0.16)",
              background: `linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,255,255,0.50))`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-medium text-neutral-600">ESTIMATE RANGE</div>
              <span
                className="rounded-full border px-3 py-1 text-[11px] font-medium"
                style={{
                  borderColor: "rgba(212,175,55,0.45)",
                  color: THEME.charcoal,
                  background: "rgba(212,175,55,0.16)",
                }}
              >
                Signature
              </span>
            </div>

            <div className="mt-4">
              {estimate.canShowNumbers ? (
                <>
                  <div className="slat-display text-3xl font-medium" style={{ color: THEME.charcoal }}>
                    {formatKRW(estimate.min)} ~ {formatKRW(estimate.max)}
                  </div>
                  <div className="mt-2 text-sm font-light text-neutral-700">
                    입력 조건 기준 · 면적 약 {estimate.area.toFixed(1)}m²
                  </div>
                </>
              ) : (
                <>
                  <div className="slat-display text-2xl font-medium" style={{ color: THEME.charcoal }}>
                    견적서 발행 준비 완료
                  </div>
                  <div className="mt-2 text-sm font-light text-neutral-700">
                    정확한 범위는 상담 후 “VIP 예상 견적서”로 안내드립니다.
                  </div>
                  <div className="mt-3 text-[12px] font-light text-neutral-500">
                    (단가를 설정하면 여기서 원 단위 범위가 자동 표시됩니다.)
                  </div>
                </>
              )}
            </div>

            <div
              className="mt-6 rounded-2xl border p-4 text-sm"
              style={{
                borderColor: "rgba(28,25,23,0.12)",
                background: "rgba(251,250,247,0.65)",
              }}
            >
              <div className="text-[12px] font-medium" style={{ color: THEME.charcoal }}>
                안내
              </div>
              <div className="mt-1 text-[12px] font-light text-neutral-700">
                최종 금액은 창 구조/레일/원단/시공 난이도에 따라 실측 후 확정됩니다.
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button href={CONTACT.kakaoUrl} variant="outline" className="sm:flex-1">
                카톡 상담
              </Button>
              <Button onClick={copyAndGo} variant="gold" className="sm:flex-1">
                🎁 VIP 견적서로 상담 예약 <ClipboardCheck className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Inputs */}
          <div
            className="rounded-[26px] border p-7"
            style={{
              borderColor: "rgba(28,25,23,0.12)",
              background: "rgba(229,224,216,0.55)",
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-[11px] font-medium text-neutral-700">공간</label>
                <select
                  value={inputs.space}
                  onChange={(e) => setInputs((p) => ({ ...p, space: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm outline-none focus:border-neutral-400"
                >
                  <option>거실</option>
                  <option>안방</option>
                  <option>서재</option>
                  <option>아이방</option>
                  <option>전체</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-neutral-700">가로(cm)</label>
                <input
                  value={inputs.widthCm}
                  onChange={(e) => setInputs((p) => ({ ...p, widthCm: e.target.value }))}
                  inputMode="numeric"
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-neutral-700">세로(cm)</label>
                <input
                  value={inputs.heightCm}
                  onChange={(e) => setInputs((p) => ({ ...p, heightCm: e.target.value }))}
                  inputMode="numeric"
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-neutral-700">창 개수</label>
                <select
                  value={inputs.count}
                  onChange={(e) => setInputs((p) => ({ ...p, count: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm outline-none focus:border-neutral-400"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}개
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-neutral-700">컬렉션</label>
                <select
                  value={inputs.fabric}
                  onChange={(e) => setInputs((p) => ({ ...p, fabric: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm outline-none focus:border-neutral-400"
                >
                  <option value="Signature">Signature</option>
                  <option value="Standard">Standard</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-neutral-700">차광</label>
                <select
                  value={inputs.blackout}
                  onChange={(e) => setInputs((p) => ({ ...p, blackout: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm outline-none focus:border-neutral-400"
                >
                  <option value="Standard">Standard</option>
                  <option value="Enhanced">Enhanced</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-neutral-700">반려동물</label>
                <select
                  value={inputs.pet}
                  onChange={(e) => setInputs((p) => ({ ...p, pet: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm outline-none focus:border-neutral-400"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-[11px] font-medium text-neutral-700">천장</label>
                <select
                  value={inputs.ceiling}
                  onChange={(e) => setInputs((p) => ({ ...p, ceiling: e.target.value }))}
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm outline-none focus:border-neutral-400"
                >
                  <option value="Standard">Standard</option>
                  <option value="High">High</option>
                </select>

                <div className="mt-3 text-[12px] font-light text-neutral-600">
                  당신의 공간에 어울리는 <span className="font-medium">깨끗함만 남기세요.</span> (사진 1~2장 첨부 시 안내가 가장 빠릅니다)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Elegant problem/solution message */}
        <div className="mt-7 rounded-[24px] border border-neutral-200/70 bg-white/60 p-6">
          <div className="text-[15px] font-light leading-relaxed text-neutral-800">
            <span className="font-medium" style={{ color: THEME.charcoal }}>
              무거운 커튼은 공간을 좁아 보이게 합니다.
            </span>{" "}
            {BRAND.product}은{" "}
            <span className="font-medium" style={{ color: THEME.charcoal }}>
              탁 트인 개방감과 정돈된 결
            </span>
            을 선사합니다 — 관리는 덜고, 아름다움은 더합니다.
          </div>

          <ul className="mt-5 grid grid-cols-1 gap-2 text-sm text-neutral-700 sm:grid-cols-3">
            {[
              "빛의 흐름을 ‘라인’으로 정리",
              "무드가 공간의 가치를 상승",
              "호텔 라운지 같은 정돈감",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4" style={{ color: THEME.gold }} />
                <span className="font-light">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Comparison() {
  const rows = [
    { k: "공간의 결(라인)", curtain: "△", blind: "◎", unislat: "◎" },
    { k: "무드(고급감)", curtain: "○", blind: "△", unislat: "◎" },
    { k: "개방감", curtain: "△", blind: "○", unislat: "◎" },
    { k: "유지/관리 부담", curtain: "△", blind: "○", unislat: "◎" },
  ];

  return (
    <div className="mt-10 overflow-hidden rounded-[28px] border border-neutral-200/70 bg-white/55 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur">
      <div className="p-7 sm:p-10">
        <div className="text-[11px] font-medium text-neutral-500">COMPARISON</div>
        <h3 className="slat-display mt-2 text-2xl font-medium" style={{ color: THEME.charcoal }}>
          선택을 ‘확신’으로 바꾸는 비교
        </h3>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="py-3 pr-4 font-medium text-neutral-900">항목</th>
                <th className="py-3 pr-4 font-light text-neutral-700">일반 커튼</th>
                <th className="py-3 pr-4 font-light text-neutral-700">일반 블라인드</th>
                <th className="py-3 pr-4 font-medium text-neutral-900">{BRAND.product}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.k} className="border-b border-neutral-200/70">
                  <td className="py-3 pr-4 font-light text-neutral-900">{r.k}</td>
                  <td className="py-3 pr-4 text-neutral-700">{r.curtain}</td>
                  <td className="py-3 pr-4 text-neutral-700">{r.blind}</td>
                  <td className="py-3 pr-4 font-medium" style={{ color: THEME.charcoal }}>
                    {r.unislat}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button onClick={() => scrollToId("estimate")} variant="primary">
            VIP 예상 견적서 확인
          </Button>
          <Button href={CONTACT.kakaoUrl} variant="outline">
            카톡 상담
          </Button>
        </div>
      </div>
    </div>
  );
}

function GalleryAndReviews() {
  const reviews = [
    {
      // ⚠️ 예시(실제 고객 사례가 있으면 반드시 교체 권장)
      who: "예시) 반포 자이 시공 고객님",
      text: "거실의 인상이 ‘정돈된 호텔 라운지’처럼 바뀌었습니다. 창이 정리되니 공간 전체의 가치가 올라가 보입니다.",
    },
    {
      who: "예시) 한남 더힐 시공 고객님",
      text: "빛이 들어오는 결이 아름답습니다. 기능보다 ‘분위기’가 압도적으로 좋아졌고, 사진이 정말 잘 나옵니다.",
    },
    {
      who: "예시) 해운대 마린시티 시공 고객님",
      text: "라인이 깔끔해져서 고급스러움이 살아납니다. 무엇보다 관리 부담이 줄어 ‘좋은 상태’를 오래 유지할 수 있었습니다.",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:pb-28 sm:pt-24">
      <div className="text-[11px] font-medium text-neutral-500">VISUAL PROOF</div>
      <h2 className="slat-display mt-2 text-3xl font-medium sm:text-4xl" style={{ color: THEME.charcoal }}>
        프리미엄은, 사진에서 먼저 드러납니다
      </h2>
      <p className="mt-4 max-w-2xl text-[15px] font-light leading-relaxed text-neutral-700">
        아래 이미지는 분위기 참고용 연출 컷(예시)입니다. 전환율을 올리려면 실제 시공 사진으로 교체하는 것이 가장 효과적입니다.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {UNSPLASH.gallery.map((src, i) => (
          <figure
            key={i}
            className="group relative overflow-hidden rounded-[28px] border border-neutral-200/70 bg-white/50 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          >
            <SafeImage
              src={src}
              alt="Luxury interior reference"
              className="h-64 w-full object-cover transition duration-700 group-hover:scale-[1.02] sm:h-72"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
            <figcaption className="absolute bottom-0 left-0 right-0 p-5">
              <span
                className="rounded-full border px-3 py-1 text-[11px] font-medium"
                style={{
                  borderColor: "rgba(255,255,255,0.20)",
                  background: "rgba(255,255,255,0.10)",
                  color: "rgba(255,255,255,0.90)",
                }}
              >
                Signature Reference
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {reviews.map((r) => (
          <div
            key={r.who}
            className="rounded-[28px] border border-neutral-200/70 bg-white/55 p-7 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur"
          >
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: THEME.charcoal }}>
              <Star className="h-4 w-4" style={{ color: THEME.gold }} />
              {r.who}
            </div>
            <p className="mt-4 text-[14px] font-light leading-relaxed text-neutral-700">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Offer() {
  return (
    <section id="offer" className="mx-auto max-w-6xl px-4 pb-28 pt-16 sm:pb-28 sm:pt-24">
      <div
        className="overflow-hidden rounded-[32px] border p-8 shadow-[0_18px_50px_rgba(0,0,0,0.12)] sm:p-12"
        style={{
          borderColor: "rgba(28,25,23,0.18)",
          background: `linear-gradient(135deg, ${THEME.charcoal}, #0f0d0c)`,
          color: THEME.ivory,
        }}
      >
        <div className="text-[11px] font-medium text-white/70">CONSULTATION</div>
        <h2 className="slat-display mt-3 text-3xl font-medium sm:text-4xl">
          당신의 공간을, ‘완성된 거실’로
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] font-light leading-relaxed text-white/85">
          결정을 요구하지 않습니다. 먼저 확인만 하세요.
          사진 1~2장과 대략의 사이즈만 있으면, 공간에 맞는 톤과 옵션을 VIP 예상 견적서로 안내드립니다.
        </p>

        <div className="mt-8 flex flex-col gap-2 sm:flex-row">
          <a
            href={`tel:${CONTACT.tel}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-[15px] font-medium text-[#1c1917] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
          >
            <PhoneCall className="h-4 w-4" />
            전화 상담
          </a>
          <a
            href={CONTACT.kakaoUrl}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-[15px] font-medium transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
            style={{
              background: `linear-gradient(135deg, rgba(212,175,55,0.95), rgba(212,175,55,0.80))`,
              color: THEME.charcoal,
            }}
          >
            <MessageCircle className="h-4 w-4" />
            카톡 상담
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {["거실/창 사진 1~2장", "대략 사이즈(가로·세로) 또는 창 개수", "원하는 무드(밝게/차분/차광/반려동물)"].map(
            (t) => (
              <div
                key={t}
                className="rounded-3xl border p-5 text-[14px] font-light"
                style={{
                  borderColor: "rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4" style={{ color: THEME.gold }} />
                  <span className="text-white/90">{t}</span>
                </div>
              </div>
            )
          )}
        </div>

        <div className="mt-5 text-[11px] font-light text-white/55">
          * 최종 금액은 실측 후 확정됩니다.
        </div>
      </div>
    </section>
  );
}

function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200/70 bg-white/90 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
        <a
          href={`tel:${CONTACT.tel}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ color: THEME.charcoal }}
        >
          <PhoneCall className="h-4 w-4" />
          전화
        </a>
        <button
          onClick={() => scrollToId("estimate")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: THEME.charcoal, color: THEME.ivory }}
          type="button"
        >
          <MessageCircle className="h-4 w-4" />
          VIP 견적서
        </button>
      </div>
    </div>
  );
}

export default function App() {
  useLuxuryFonts();

  return (
    <div className="min-h-screen slat-body" style={{ background: THEME.greige }}>
      <TopNotice />

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-neutral-200/60 bg-white/50 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div
              className="rounded-2xl px-3 py-1 text-[11px] font-medium tracking-widest"
              style={{ background: THEME.charcoal, color: THEME.ivory }}
            >
              {BRAND.name}
            </div>
            <div className="hidden text-[12px] font-light text-neutral-700 sm:block">
              {BRAND.product} · Signature Collection
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <Button href={`tel:${CONTACT.tel}`} variant="outline">
              전화
            </Button>
            <Button onClick={() => scrollToId("estimate")} variant="primary">
              VIP 견적서
            </Button>
          </div>

          <div className="sm:hidden">
            <button
              onClick={() => scrollToId("estimate")}
              className="rounded-2xl px-4 py-2 text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: THEME.charcoal, color: THEME.ivory }}
              type="button"
            >
              견적서
            </button>
          </div>
        </div>
      </header>

      {/* HERO (Spacing x1.5, Premium) */}
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:pb-28 sm:pt-24">
        <div className="relative overflow-hidden rounded-[36px] border border-neutral-200/70 bg-white/40 shadow-[0_22px_70px_rgba(0,0,0,0.14)]">
          <SafeImage src={UNSPLASH.hero} alt="Luxury interior hero" className="h-[560px] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/60" />

          {/* Centered elegant layout */}
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div className="mx-auto max-w-3xl text-center text-white">
              <div className="mb-6 flex flex-wrap justify-center gap-2">
                <Badge>[Premium Window Styling]</Badge>
                <Badge>[Signature Collection]</Badge>
              </div>

              <h1 className="slat-display text-3xl font-medium leading-[1.14] sm:text-6xl">
                당신의 거실,
                <br />
                5성급 호텔 라운지가 됩니다.
              </h1>

              <p className="mt-6 text-[15px] font-light leading-relaxed text-white/90 sm:text-lg">
                빛과 바람이 머무는 곳. 커튼의 우아함과 블라인드의 기능을 넘어선, {BRAND.product}.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
                <Button onClick={() => scrollToId("estimate")} variant="gold">
                  VIP 예상 견적서 확인
                </Button>
                <Button href={CONTACT.kakaoUrl} variant="outline">
                  카톡 상담
                </Button>
              </div>

              <div className="mt-8 text-[12px] font-light text-white/70">
                * 프리미엄 무드는 “창”에서 시작됩니다. (실제 시공 사진으로 교체 시 전환율이 가장 크게 상승합니다)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION + VIP Estimate */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:pb-28">
        <div className="rounded-[36px] border border-neutral-200/70 bg-white/45 p-7 shadow-[0_14px_45px_rgba(0,0,0,0.08)] backdrop-blur sm:p-12">
          <div className="text-[11px] font-medium text-neutral-500">CONCEPT</div>
          <h2 className="slat-display mt-3 text-3xl font-medium sm:text-4xl" style={{ color: THEME.charcoal }}>
            당신의 공간에 어울리는
            <br />
            깨끗함만 남기세요
          </h2>
          <p className="mt-5 max-w-3xl text-[15px] font-light leading-relaxed text-neutral-700">
            매일 마주하는 거실, 아직도 관리하기 힘든 커튼으로 가려두셨나요?
            이제 관리는 덜어내고 아름다움만 남기세요.
            무거운 커튼은 공간을 좁아 보이게 만들고, {BRAND.product}은 탁 트인 개방감과 정돈된 결을 선사합니다.
          </p>

          <div id="estimate">
            <VIPEstimateCard />
          </div>

          <Comparison />
        </div>
      </section>

      <GalleryAndReviews />
      <Offer />

      <footer className="border-t border-neutral-200/70 bg-white/40 pb-28 sm:pb-10">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-neutral-700">
          <div className="font-medium" style={{ color: THEME.charcoal }}>
            {BRAND.name}
          </div>
          <div className="mt-2 text-[13px] font-light">
            상담:{" "}
            <a href={`tel:${CONTACT.tel}`} className="font-medium" style={{ color: THEME.charcoal }}>
              {CONTACT.tel}
            </a>
          </div>
        </div>
      </footer>

      <StickyMobileCTA />
    </div>
  );
}
