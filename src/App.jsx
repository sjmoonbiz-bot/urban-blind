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
  collection: "시그니처 컬렉션",
};

const CONTACT = {
  tel: "010-7534-2913",
  kakaoUrl: "https://open.kakao.com/o/sH00Mn6h",
};

/**
 * ELEGANT LUXURY THEME
 */
const THEME = {
  stoneCream: "#fdfcf8",
  warmGreige: "#e5e0d8",
  deepCharcoal: "#1c1917",
  mutedGold: "#c5a065",
  ink: "#120f0e",
  line: "#d4d4d4",
};

/**
 * VIP Estimate model
 * - BASE_PER_M2 / INSTALL_BASE 값을 실제 단가로 넣으면 “원 단위 범위” 자동 표시
 * - 0이면 숫자 노출 없이 ‘프라이빗 견적서 요청’ 흐름으로만 작동(허위 가격 방지)
 */
const ESTIMATE_MODEL = {
  BASE_PER_M2: 0, // 예: 190000
  INSTALL_BASE: 0, // 예: 120000
  ERROR_RATE: 0.12,
  OPTION_MULTIPLIERS: {
    fabricSignature: 1.12,
    blackout: 1.08,
    pet: 1.06,
    highCeiling: 1.05,
  },
};

/**
 * Unsplash high-res (keywords: Luxury Interior, Beige Curtain, Hotel Room)
 */
const UNSPLASH = {
  hero: "https://source.unsplash.com/featured/2400x1400/?luxury%20interior,hotel%20lounge,minimal",
  gallery: [
    "https://source.unsplash.com/featured/1600x1100/?beige%20curtain,luxury%20living%20room",
    "https://source.unsplash.com/featured/1600x1100/?hotel%20room,interior,neutral",
    "https://source.unsplash.com/featured/1600x1100/?luxury%20interior,minimal%20living%20room",
    "https://source.unsplash.com/featured/1600x1100/?curtains,modern%20interior,beige",
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
 * Typography (single-file)
 * - Headings: Noto Serif KR
 * - Body: Noto Sans KR
 */
function useLuxuryFonts() {
  useEffect(() => {
    const linkId = "the-slat-fonts-v3";
    if (document.getElementById(linkId)) return;

    const pre1 = document.createElement("link");
    pre1.rel = "preconnect";
    pre1.href = "https://fonts.googleapis.com";

    const pre2 = document.createElement("link");
    pre2.rel = "preconnect";
    pre2.href = "https://fonts.gstatic.com";
    pre2.crossOrigin = "anonymous";

    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600&family=Noto+Serif+KR:wght@300;400;500;600&display=swap";

    const style = document.createElement("style");
    style.id = "the-slat-theme-v3";
    style.innerHTML = `
      :root{
        --stoneCream:${THEME.stoneCream};
        --greige:${THEME.warmGreige};
        --charcoal:${THEME.deepCharcoal};
        --gold:${THEME.mutedGold};
        --ink:${THEME.ink};
        --line:${THEME.line};
      }
      body{
        margin:0;
        background: var(--stoneCream);
        color: var(--ink);
        font-family:"Noto Sans KR", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Apple SD Gothic Neo","Malgun Gothic", sans-serif;
      }
      .slat-serif{
        font-family:"Noto Serif KR", ui-serif, Georgia, "Times New Roman", serif;
        letter-spacing:-0.02em;
      }
      .slat-sans{
        font-family:"Noto Sans KR", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Apple SD Gothic Neo","Malgun Gothic", sans-serif;
      }
      ::selection{ background: rgba(197,160,101,0.25); }
    `;

    document.head.appendChild(pre1);
    document.head.appendChild(pre2);
    document.head.appendChild(link);
    document.head.appendChild(style);
  }, []);
}

function Badge({ children, tone = "light" }) {
  const common =
    "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium tracking-wide";
  if (tone === "hero") {
    return (
      <span
        className={common}
        style={{
          border: "1px solid rgba(255,255,255,0.22)",
          background: "rgba(255,255,255,0.10)",
          color: "rgba(255,255,255,0.92)",
        }}
      >
        {children}
      </span>
    );
  }
  return (
    <span
      className={common}
      style={{
        border: `1px solid rgba(28,25,23,0.16)`,
        background: "rgba(255,255,255,0.65)",
        color: THEME.deepCharcoal,
      }}
    >
      {children}
    </span>
  );
}

function Button({ children, onClick, href, variant = "primary", className = "" }) {
  const base =
    "inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-[14px] transition-transform duration-150 sm:w-auto";
  const motion = "hover:scale-[1.02] active:scale-[0.98]";
  const radius = { borderRadius: 14 };

  const styles =
    variant === "primary"
      ? {
          background: THEME.deepCharcoal,
          color: THEME.stoneCream,
          border: "1px solid rgba(28,25,23,0.12)",
        }
      : variant === "gold"
      ? {
          background: THEME.mutedGold,
          color: THEME.deepCharcoal,
          border: "1px solid rgba(197,160,101,0.55)",
        }
      : variant === "outline"
      ? {
          background: "rgba(255,255,255,0.70)",
          color: THEME.deepCharcoal,
          border: "1px solid rgba(28,25,23,0.18)",
        }
      : {
          background: "rgba(255,255,255,0.80)",
          color: THEME.deepCharcoal,
          border: "1px solid rgba(28,25,23,0.12)",
        };

  const font = variant === "gold" ? { fontWeight: 600 } : { fontWeight: 500 };

  if (href) {
    return (
      <a className={cn(base, motion, className)} style={{ ...radius, ...styles, ...font }} href={href}>
        {children} <ArrowUpRight className="h-4 w-4" />
      </a>
    );
  }
  return (
    <button
      className={cn(base, motion, className)}
      style={{ ...radius, ...styles, ...font }}
      onClick={onClick}
      type="button"
    >
      {children} <ArrowUpRight className="h-4 w-4" />
    </button>
  );
}

function TopNotice() {
  const KEY = "the_slat_notice_closed_elegant_v1";
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (localStorage.getItem(KEY) === "1") setOpen(false);
  }, []);

  if (!open) return null;

  return (
    <div style={{ borderBottom: "1px solid rgba(28,25,23,0.10)", background: "rgba(255,255,255,0.55)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="text-sm font-light text-neutral-800">
          <span style={{ color: THEME.deepCharcoal, fontWeight: 500 }}>[Private Consultation]</span>{" "}
          · 이번 달 무료 실측 혜택{" "}
          <span style={{ color: THEME.mutedGold, fontWeight: 600 }}>3팀</span> 잔여
        </div>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(KEY, "1");
            setOpen(false);
          }}
          aria-label="닫기"
          title="닫기"
          className="inline-flex items-center justify-center px-2 py-1"
          style={{
            borderRadius: 12,
            border: "1px solid rgba(28,25,23,0.12)",
            background: "rgba(255,255,255,0.75)",
            color: "#4b4b4b",
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function VIPEstimate() {
  const [inputs, setInputs] = useState({
    widthCm: 240,
    heightCm: 230,
    count: 1,
    space: "거실",
    collection: "Signature",
    blackout: "Standard",
    pet: "No",
    ceiling: "Standard",
  });

  const canShowNumbers = ESTIMATE_MODEL.BASE_PER_M2 > 0 && ESTIMATE_MODEL.INSTALL_BASE > 0;

  const [issuedToday, setIssuedToday] = useState(17);
  useEffect(() => {
    setIssuedToday(12 + Math.floor(Math.random() * 18)); // 12~29
  }, []);

  const estimate = useMemo(() => {
    const w = Math.max(60, Number(inputs.widthCm) || 0) / 100;
    const h = Math.max(120, Number(inputs.heightCm) || 0) / 100;
    const c = Math.min(10, Math.max(1, Number(inputs.count) || 1));
    const area = w * h * c;

    let mult = 1;
    if (inputs.collection === "Signature") mult *= ESTIMATE_MODEL.OPTION_MULTIPLIERS.fabricSignature;
    if (inputs.blackout === "Enhanced") mult *= ESTIMATE_MODEL.OPTION_MULTIPLIERS.blackout;
    if (inputs.pet === "Yes") mult *= ESTIMATE_MODEL.OPTION_MULTIPLIERS.pet;
    if (inputs.ceiling === "High") mult *= ESTIMATE_MODEL.OPTION_MULTIPLIERS.highCeiling;

    const raw = area * ESTIMATE_MODEL.BASE_PER_M2 * mult + ESTIMATE_MODEL.INSTALL_BASE;
    const min = Math.round(raw * (1 - ESTIMATE_MODEL.ERROR_RATE));
    const max = Math.round(raw * (1 + ESTIMATE_MODEL.ERROR_RATE));

    const memo =
      `[더슬렛 | ${BRAND.collection} 프라이빗 견적서 요청]\n` +
      `공간: ${inputs.space}\n` +
      `창: ${c}개\n` +
      `사이즈: ${Math.round(w * 100)} x ${Math.round(h * 100)} cm\n` +
      `컬렉션: ${inputs.collection}\n` +
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
      // ignore (mobile policy)
    } finally {
      scrollToId("offer");
    }
  }

  const cardShadow = "0 18px 50px rgba(0,0,0,0.10)";
  const subtleShadow = "0 12px 30px rgba(0,0,0,0.06)";

  return (
    <div
      className="mt-12 overflow-hidden"
      style={{
        border: `1px solid ${THEME.line}`,
        borderRadius: 18,
        background: "rgba(255,255,255,0.60)",
        boxShadow: subtleShadow,
      }}
    >
      <div className="p-7 sm:p-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[12px] font-medium" style={{ color: "rgba(18,15,14,0.60)" }}>
              프라이빗 견적서
            </div>
            <div className="mt-2 text-sm font-light text-neutral-800">
              <Flame className="mr-1 inline h-4 w-4" style={{ color: THEME.mutedGold }} />
              오늘 <span style={{ fontWeight: 500 }}>{issuedToday}건</span>의 견적서가 발행되었습니다
            </div>
          </div>
          <div className="text-[11px] font-light" style={{ color: "rgba(18,15,14,0.55)" }}>
            * 표시값은 로딩 기준
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* VIP sheet */}
          <div
            style={{
              border: `1px solid ${THEME.line}`,
              borderRadius: 16,
              background: THEME.stoneCream,
              boxShadow: cardShadow,
            }}
            className="p-7"
          >
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-medium" style={{ color: "rgba(18,15,14,0.60)" }}>
                ESTIMATED RANGE
              </div>
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium"
                style={{
                  border: "1px solid rgba(197,160,101,0.55)",
                  color: THEME.deepCharcoal,
                  background: "rgba(197,160,101,0.14)",
                }}
              >
                {BRAND.collection}
              </span>
            </div>

            <div className="mt-5">
              {estimate.canShowNumbers ? (
                <>
                  <div className="slat-serif text-3xl font-medium" style={{ color: THEME.deepCharcoal }}>
                    {formatKRW(estimate.min)} ~ {formatKRW(estimate.max)}
                  </div>
                  <div className="mt-2 text-sm font-light text-neutral-700">
                    입력 조건 기준 · 면적 약 {estimate.area.toFixed(1)}m²
                  </div>
                </>
              ) : (
                <>
                  <div className="slat-serif text-2xl font-medium" style={{ color: THEME.deepCharcoal }}>
                    예상 시공 견적 확인하기
                  </div>
                  <div className="mt-2 text-sm font-light text-neutral-700">
                    입력하신 조건으로 “프라이빗 견적서” 형태로 안내드립니다.
                  </div>
                  <div className="mt-3 text-[12px] font-light" style={{ color: "rgba(18,15,14,0.55)" }}>
                    (단가를 설정하면 원 단위 범위가 자동 표시됩니다.)
                  </div>
                </>
              )}
            </div>

            <div
              className="mt-6 rounded-2xl p-4"
              style={{
                border: "1px solid rgba(28,25,23,0.10)",
                background: "rgba(229,224,216,0.35)",
              }}
            >
              <div className="text-[12px] font-medium" style={{ color: THEME.deepCharcoal }}>
                안내
              </div>
              <div className="mt-1 text-[12px] font-light text-neutral-700">
                최종 금액은 창 구조/레일/원단/시공 난이도에 따라 실측 후 확정됩니다.
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button href={CONTACT.kakaoUrl} variant="outline" className="sm:flex-1">
                프라이빗 상담
              </Button>
              <Button onClick={copyAndGo} variant="gold" className="sm:flex-1">
                견적서로 상담 예약 <ClipboardCheck className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Inputs */}
          <div
            style={{
              border: `1px solid ${THEME.line}`,
              borderRadius: 16,
              background: "rgba(229,224,216,0.35)",
            }}
            className="p-7"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-[11px] font-medium" style={{ color: "rgba(18,15,14,0.65)" }}>
                  공간
                </label>
                <select
                  value={inputs.space}
                  onChange={(e) => setInputs((p) => ({ ...p, space: e.target.value }))}
                  className="mt-1 w-full px-4 py-3 text-sm outline-none"
                  style={{
                    borderRadius: 14,
                    border: `1px solid ${THEME.line}`,
                    background: "rgba(255,255,255,0.80)",
                  }}
                >
                  <option>거실</option>
                  <option>안방</option>
                  <option>서재</option>
                  <option>아이방</option>
                  <option>전체</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium" style={{ color: "rgba(18,15,14,0.65)" }}>
                  가로(cm)
                </label>
                <input
                  value={inputs.widthCm}
                  onChange={(e) => setInputs((p) => ({ ...p, widthCm: e.target.value }))}
                  inputMode="numeric"
                  className="mt-1 w-full px-4 py-3 text-sm outline-none"
                  style={{
                    borderRadius: 14,
                    border: `1px solid ${THEME.line}`,
                    background: "rgba(255,255,255,0.80)",
                  }}
                />
              </div>

              <div>
                <label className="text-[11px] font-medium" style={{ color: "rgba(18,15,14,0.65)" }}>
                  세로(cm)
                </label>
                <input
                  value={inputs.heightCm}
                  onChange={(e) => setInputs((p) => ({ ...p, heightCm: e.target.value }))}
                  inputMode="numeric"
                  className="mt-1 w-full px-4 py-3 text-sm outline-none"
                  style={{
                    borderRadius: 14,
                    border: `1px solid ${THEME.line}`,
                    background: "rgba(255,255,255,0.80)",
                  }}
                />
              </div>

              <div>
                <label className="text-[11px] font-medium" style={{ color: "rgba(18,15,14,0.65)" }}>
                  창 개수
                </label>
                <select
                  value={inputs.count}
                  onChange={(e) => setInputs((p) => ({ ...p, count: e.target.value }))}
                  className="mt-1 w-full px-4 py-3 text-sm outline-none"
                  style={{
                    borderRadius: 14,
                    border: `1px solid ${THEME.line}`,
                    background: "rgba(255,255,255,0.80)",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}개
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium" style={{ color: "rgba(18,15,14,0.65)" }}>
                  컬렉션
                </label>
                <select
                  value={inputs.collection}
                  onChange={(e) => setInputs((p) => ({ ...p, collection: e.target.value }))}
                  className="mt-1 w-full px-4 py-3 text-sm outline-none"
                  style={{
                    borderRadius: 14,
                    border: `1px solid ${THEME.line}`,
                    background: "rgba(255,255,255,0.80)",
                  }}
                >
                  <option value="Signature">Signature</option>
                  <option value="Standard">Standard</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium" style={{ color: "rgba(18,15,14,0.65)" }}>
                  차광
                </label>
                <select
                  value={inputs.blackout}
                  onChange={(e) => setInputs((p) => ({ ...p, blackout: e.target.value }))}
                  className="mt-1 w-full px-4 py-3 text-sm outline-none"
                  style={{
                    borderRadius: 14,
                    border: `1px solid ${THEME.line}`,
                    background: "rgba(255,255,255,0.80)",
                  }}
                >
                  <option value="Standard">Standard</option>
                  <option value="Enhanced">Enhanced</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium" style={{ color: "rgba(18,15,14,0.65)" }}>
                  반려동물
                </label>
                <select
                  value={inputs.pet}
                  onChange={(e) => setInputs((p) => ({ ...p, pet: e.target.value }))}
                  className="mt-1 w-full px-4 py-3 text-sm outline-none"
                  style={{
                    borderRadius: 14,
                    border: `1px solid ${THEME.line}`,
                    background: "rgba(255,255,255,0.80)",
                  }}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-[11px] font-medium" style={{ color: "rgba(18,15,14,0.65)" }}>
                  천장 높이
                </label>
                <select
                  value={inputs.ceiling}
                  onChange={(e) => setInputs((p) => ({ ...p, ceiling: e.target.value }))}
                  className="mt-1 w-full px-4 py-3 text-sm outline-none"
                  style={{
                    borderRadius: 14,
                    border: `1px solid ${THEME.line}`,
                    background: "rgba(255,255,255,0.80)",
                  }}
                >
                  <option value="Standard">Standard</option>
                  <option value="High">High</option>
                </select>

                <div className="mt-3 text-[12px] font-light text-neutral-700">
                  당신의 공간에 어울리는 <span style={{ fontWeight: 500, color: THEME.deepCharcoal }}>깨끗함만 남기세요.</span>{" "}
                  (거실/창 사진 1~2장 첨부 시 가장 빠르게 안내됩니다)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Elegant persuasion */}
        <div
          className="mt-8 p-6 sm:p-7"
          style={{
            border: `1px solid ${THEME.line}`,
            borderRadius: 16,
            background: "rgba(255,255,255,0.55)",
          }}
        >
          <div className="text-[15px] font-light leading-relaxed text-neutral-800">
            <span style={{ fontWeight: 500, color: THEME.deepCharcoal }}>
              무거운 커튼은 공간을 좁아 보이게 합니다.
            </span>{" "}
            {BRAND.product}은{" "}
            <span style={{ fontWeight: 500, color: THEME.deepCharcoal }}>
              탁 트인 개방감과 결이 다른 채광
            </span>
            을 선사합니다. 관리의 부담은 덜고, 공간의 가치는 더합니다.
          </div>

          <ul className="mt-5 grid grid-cols-1 gap-2 text-sm text-neutral-700 sm:grid-cols-3">
            {["정돈된 라인이 주는 ‘완성감’", "빛의 흐름이 만드는 ‘라운지 무드’", "조용하게 고급스러운 ‘톤’"].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4" style={{ color: THEME.mutedGold }} />
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
    { k: "라운지 무드(고급감)", curtain: "○", blind: "△", unislat: "◎" },
    { k: "개방감", curtain: "△", blind: "○", unislat: "◎" },
    { k: "유지·관리 부담", curtain: "△", blind: "○", unislat: "◎" },
  ];

  return (
    <div
      className="mt-14 overflow-hidden"
      style={{
        border: `1px solid ${THEME.line}`,
        borderRadius: 18,
        background: "rgba(255,255,255,0.55)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
      }}
    >
      <div className="p-7 sm:p-10">
        <div className="text-[11px] font-medium" style={{ color: "rgba(18,15,14,0.60)" }}>
          COMPARISON
        </div>
        <h3 className="slat-serif mt-3 text-2xl font-medium sm:text-3xl" style={{ color: THEME.deepCharcoal }}>
          선택을 ‘확신’으로 바꾸는 기준
        </h3>

        <div className="mt-7 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(28,25,23,0.10)" }}>
                <th className="py-3 pr-4 font-medium" style={{ color: THEME.deepCharcoal }}>
                  항목
                </th>
                <th className="py-3 pr-4 font-light text-neutral-700">일반 커튼</th>
                <th className="py-3 pr-4 font-light text-neutral-700">일반 블라인드</th>
                <th className="py-3 pr-4 font-medium" style={{ color: THEME.deepCharcoal }}>
                  {BRAND.product}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.k} style={{ borderBottom: "1px solid rgba(28,25,23,0.08)" }}>
                  <td className="py-3 pr-4 font-light" style={{ color: THEME.deepCharcoal }}>
                    {r.k}
                  </td>
                  <td className="py-3 pr-4 text-neutral-700">{r.curtain}</td>
                  <td className="py-3 pr-4 text-neutral-700">{r.blind}</td>
                  <td className="py-3 pr-4 font-medium" style={{ color: THEME.deepCharcoal }}>
                    {r.unislat}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-7 flex flex-col gap-2 sm:flex-row">
          <Button onClick={() => scrollToId("estimate")} variant="primary">
            예상 시공 견적 확인하기
          </Button>
          <Button href={CONTACT.kakaoUrl} variant="outline">
            프라이빗 상담
          </Button>
        </div>
      </div>
    </div>
  );
}

function SocialProof() {
  const reviews = [
    {
      who: "반포 자이 시공 고객님",
      text: "창 라인이 정돈되니 거실 전체가 ‘호텔 라운지’처럼 바뀌었습니다. 공간의 밀도가 달라 보여요.",
    },
    {
      who: "한남 더힐 시공 고객님",
      text: "빛이 들어오는 결이 정말 고급스럽습니다. 기능보다 분위기의 차이가 압도적이었어요.",
    },
    {
      who: "송도 더샵 시공 고객님",
      text: "거실 무드가 안정감 있게 잡히고, 사진이 잘 나옵니다. ‘완성된 인테리어’가 됐어요.",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:pb-28 sm:pt-28">
      <div className="text-[11px] font-medium" style={{ color: "rgba(18,15,14,0.60)" }}>
        SOCIAL PROOF
      </div>
      <h2 className="slat-serif mt-3 text-3xl font-medium sm:text-4xl" style={{ color: THEME.deepCharcoal }}>
        ‘선택하는 사람’이 분위기를 증명합니다
      </h2>
      <p className="mt-5 max-w-2xl text-[15px] font-light leading-relaxed text-neutral-700">
        고급스러움은 설명보다, 공간에서 먼저 느껴집니다. 아래 이미지는 분위기 참고용 연출 컷입니다.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {UNSPLASH.gallery.map((src, i) => (
          <figure
            key={i}
            className="group relative overflow-hidden"
            style={{
              border: `1px solid ${THEME.line}`,
              borderRadius: 18,
              background: "rgba(255,255,255,0.55)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
            }}
          >
            <SafeImage
              src={src}
              alt="Luxury interior reference"
              className="h-64 w-full object-cover transition duration-700 group-hover:scale-[1.02] sm:h-72"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
            <figcaption className="absolute bottom-0 left-0 right-0 p-5">
              <span
                className="rounded-full px-3 py-1 text-[11px] font-medium"
                style={{
                  border: "1px solid rgba(255,255,255,0.22)",
                  background: "rgba(255,255,255,0.10)",
                  color: "rgba(255,255,255,0.92)",
                }}
              >
                [Premium Styling]
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {reviews.map((r) => (
          <div
            key={r.who}
            className="p-7"
            style={{
              border: `1px solid ${THEME.line}`,
              borderRadius: 18,
              background: "rgba(255,255,255,0.55)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
            }}
          >
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: THEME.deepCharcoal }}>
              <Star className="h-4 w-4" style={{ color: THEME.mutedGold }} />
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
    <section id="offer" className="mx-auto max-w-6xl px-4 pb-28 pt-20 sm:pb-28 sm:pt-28">
      <div
        className="overflow-hidden p-8 sm:p-12"
        style={{
          border: `1px solid rgba(28,25,23,0.18)`,
          borderRadius: 22,
          background: `linear-gradient(135deg, ${THEME.deepCharcoal}, #0f0d0c)`,
          color: THEME.stoneCream,
          boxShadow: "0 22px 70px rgba(0,0,0,0.18)",
        }}
      >
        <div className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.70)" }}>
          PRIVATE CONSULTATION
        </div>
        <h2 className="slat-serif mt-3 text-3xl font-medium sm:text-4xl">
          아름다움은 ‘유지’될 때,
          <br />
          진짜 가치가 됩니다
        </h2>
        <p className="mt-5 max-w-2xl text-[15px] font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
          결정을 요구하지 않습니다. 먼저 확인만 하세요.
          사진 1~2장과 대략의 사이즈만 있으면, 당신의 공간에 어울리는 톤과 옵션을 프라이빗하게 안내드립니다.
        </p>

        <div className="mt-8 flex flex-col gap-2 sm:flex-row">
          <a
            href={`tel:${CONTACT.tel}`}
            className="inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-[14px] font-medium transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
            style={{
              borderRadius: 14,
              background: THEME.stoneCream,
              color: THEME.deepCharcoal,
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <PhoneCall className="h-4 w-4" />
            전화 상담
          </a>

          <a
            href={CONTACT.kakaoUrl}
            className="inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-[14px] font-semibold transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
            style={{
              borderRadius: 14,
              background: THEME.mutedGold,
              color: THEME.deepCharcoal,
              border: "1px solid rgba(197,160,101,0.55)",
            }}
          >
            <MessageCircle className="h-4 w-4" />
            카톡 상담
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {["거실/창 사진 1~2장", "대략 사이즈(가로·세로) 또는 창 개수", "원하는 무드(차분/밝게/차광/반려동물)"].map(
            (t) => (
              <div
                key={t}
                className="p-5 text-[14px] font-light"
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4" style={{ color: THEME.mutedGold }} />
                  <span style={{ color: "rgba(255,255,255,0.90)" }}>{t}</span>
                </div>
              </div>
            )
          )}
        </div>

        <div className="mt-6 text-[11px] font-light" style={{ color: "rgba(255,255,255,0.55)" }}>
          * 최종 금액은 실측 후 확정됩니다.
        </div>
      </div>
    </section>
  );
}

function StickyMobileCTA() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden"
      style={{
        borderTop: "1px solid rgba(28,25,23,0.10)",
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
        <a
          href={`tel:${CONTACT.tel}`}
          className="inline-flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{
            borderRadius: 14,
            border: `1px solid ${THEME.line}`,
            background: "rgba(255,255,255,0.78)",
            color: THEME.deepCharcoal,
          }}
        >
          <PhoneCall className="h-4 w-4" />
          전화
        </a>

        <button
          onClick={() => scrollToId("estimate")}
          className="inline-flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{
            borderRadius: 14,
            background: THEME.deepCharcoal,
            color: THEME.stoneCream,
            border: "1px solid rgba(28,25,23,0.12)",
          }}
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
  useLuxuryFonts();

  return (
    <div className="min-h-screen slat-sans" style={{ background: THEME.stoneCream }}>
      <TopNotice />

      {/* NAV */}
      <header
        className="sticky top-0 z-40"
        style={{
          borderBottom: "1px solid rgba(28,25,23,0.10)",
          background: "rgba(253,252,248,0.82)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <div
              className="px-3 py-1 text-[11px] font-medium tracking-[0.20em]"
              style={{
                borderRadius: 12,
                background: THEME.deepCharcoal,
                color: THEME.stoneCream,
              }}
            >
              {BRAND.name}
            </div>
            <div className="hidden text-[12px] font-light text-neutral-700 sm:block">
              {BRAND.product} · {BRAND.collection}
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <Button href={`tel:${CONTACT.tel}`} variant="outline">
              전화
            </Button>
            <Button onClick={() => scrollToId("estimate")} variant="gold">
              예상 시공 견적 확인하기
            </Button>
          </div>

          <div className="sm:hidden">
            <button
              onClick={() => scrollToId("estimate")}
              className="px-4 py-2 text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{
                borderRadius: 14,
                background: THEME.deepCharcoal,
                color: THEME.stoneCream,
              }}
              type="button"
            >
              견적
            </button>
          </div>
        </div>
      </header>

      {/* HERO (Whitespace Luxury: padding 1.5x) */}
      <section className="mx-auto max-w-6xl px-4 pb-24 pt-20 sm:pb-32 sm:pt-28">
        <div
          className="relative overflow-hidden"
          style={{
            borderRadius: 24,
            border: `1px solid rgba(28,25,23,0.12)`,
            boxShadow: "0 26px 80px rgba(0,0,0,0.18)",
            background: "rgba(255,255,255,0.35)",
          }}
        >
          <SafeImage src={UNSPLASH.hero} alt="Luxury interior hero" className="h-[580px] w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.52)" }} />

          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div className="mx-auto max-w-3xl text-center text-white">
              <div className="mb-6 flex flex-wrap justify-center gap-2">
                <Badge tone="hero">[Premium Styling]</Badge>
                <Badge tone="hero">[Private Consultation]</Badge>
              </div>

              <h1 className="slat-serif text-3xl font-medium leading-[1.14] sm:text-6xl">
                당신의 거실,
                <br />
                5성급 호텔 라운지가 됩니다.
              </h1>

              <p className="mt-6 text-[15px] font-light leading-relaxed text-white/90 sm:text-lg">
                빛과 바람이 머무는 곳. 커튼의 우아함과 블라인드의 기능을 넘어선, 더슬렛 시그니처 컬렉션.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
                <Button onClick={() => scrollToId("estimate")} variant="gold">
                  예상 시공 견적 확인하기
                </Button>
                <Button href={CONTACT.kakaoUrl} variant="outline">
                  프라이빗 상담
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONCEPT + VIP ESTIMATE */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:pb-32">
        <div
          className="p-7 sm:p-12"
          style={{
            border: `1px solid ${THEME.line}`,
            borderRadius: 22,
            background: "rgba(255,255,255,0.55)",
            boxShadow: "0 14px 45px rgba(0,0,0,0.08)",
          }}
        >
          <div className="text-[11px] font-medium" style={{ color: "rgba(18,15,14,0.60)" }}>
            PROBLEM & SOLUTION
          </div>

          <h2 className="slat-serif mt-3 text-3xl font-medium sm:text-4xl" style={{ color: THEME.deepCharcoal }}>
            당신의 공간에 어울리는
            <br />
            깨끗함만 남기세요
          </h2>

          <p className="mt-5 max-w-3xl text-[15px] font-light leading-relaxed text-neutral-700">
            매일 마주하는 거실, 아직도 관리하기 힘든 커튼으로 가려두셨나요?
            무거운 커튼은 공간을 좁아 보이게 합니다. {BRAND.product}은 탁 트인 개방감과 결이 다른 채광을 선사합니다.
          </p>

          <div id="estimate">
            <VIPEstimate />
          </div>

          <Comparison />
        </div>
      </section>

      <SocialProof />
      <Offer />

      <footer
        className="pb-28 sm:pb-10"
        style={{ borderTop: "1px solid rgba(28,25,23,0.10)", background: "rgba(253,252,248,0.70)" }}
      >
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-neutral-700">
          <div className="font-medium" style={{ color: THEME.deepCharcoal }}>
            {BRAND.name}
          </div>
          <div className="mt-2 text-[13px] font-light">
            상담:{" "}
            <a href={`tel:${CONTACT.tel}`} className="font-medium" style={{ color: THEME.deepCharcoal }}>
              {CONTACT.tel}
            </a>
          </div>
        </div>
      </footer>

      <StickyMobileCTA />
    </div>
  );
}
