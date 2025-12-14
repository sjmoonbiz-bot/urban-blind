import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * UNISLAT_SALES_MACHINE_V1
 * React + TailwindCSS (단일 파일 랜딩 페이지 컴포넌트)
 *
 * 사용:
 * 1) Tailwind 설치된 프로젝트에 이 파일을 추가
 * 2) <UnislatLandingPage /> 렌더링
 * 3) 아래 링크/이미지/영상/문구/정책(AS/보증)만 실제 운영에 맞게 교체
 */

// ✅ 운영 시 교체
const BRAND = {
  name: "UNISLAT",
  tagline: "블라인드의 기능 + 커튼의 감성, ‘새 카테고리’ 유니슬렛",
  serviceArea: "부산 전지역",
};

// ✅ 운영 시 교체 (카카오 오픈채팅 / 전화 / 폼 전송 엔드포인트)
const CONTACT = {
  kakaoUrl: "https://open.kakao.com/o/REPLACE_ME",
  tel: "010-0000-0000",
};

// ✅ 미디어 교체 (고화질 영상/이미지로 전환 권장)
const MEDIA = {
  heroVideoMp4: "", // 예: "/videos/unislat-walkthrough.mp4" (없으면 이미지가 보임)
  heroImage:
    "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=2400&q=80",
  // Before/After는 반드시 실제 시공 사진으로 교체 (전환에 핵심)
  beforeAfter: [
    {
      label: "BEFORE",
      title: "빛은 답답하고, 먼지는 쌓이고",
      img: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=1600&q=80",
    },
    {
      label: "AFTER",
      title: "채광은 정교하게, 분위기는 부드럽게",
      img: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1600&q=80",
    },
    {
      label: "DETAIL",
      title: "세로 라인이 천장을 ‘더 높게’",
      img: "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1600&q=80",
    },
    {
      label: "DETAIL",
      title: "슬랫 단위 분리·세탁",
      img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80",
    },
  ],
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function useInViewOnce(options = { rootMargin: "0px 0px -15% 0px", threshold: 0.12 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
  }, [options]);

  return { ref, inView };
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-neutral-700 backdrop-blur">
      {children}
    </span>
  );
}

function PrimaryButton({ children, onClick, href, className = "", small = false }) {
  const base =
    "inline-flex items-center justify-center rounded-2xl font-semibold shadow-sm transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-neutral-900/20";
  const size = small ? "px-4 py-2 text-sm" : "px-5 py-3 text-base";
  const style =
    "bg-neutral-900 text-white hover:bg-neutral-800 border border-neutral-900";
  const cls = cn(base, size, style, className);

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={cls} type="button">
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, href, className = "", small = false }) {
  const base =
    "inline-flex items-center justify-center rounded-2xl font-semibold shadow-sm transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-neutral-900/10";
  const size = small ? "px-4 py-2 text-sm" : "px-5 py-3 text-base";
  const style =
    "bg-white/80 text-neutral-900 hover:bg-white border border-neutral-200 backdrop-blur";
  const cls = cn(base, size, style, className);

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={cls} type="button">
      {children}
    </button>
  );
}

function SectionTitle({ eyebrow, title, desc }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? (
        <div className="mb-3 flex justify-center">
          <Pill>{eyebrow}</Pill>
        </div>
      ) : null}
      <h2 className="text-balance text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
        {title}
      </h2>
      {desc ? (
        <p className="mt-4 text-pretty text-base leading-relaxed text-neutral-600 sm:text-lg">
          {desc}
        </p>
      ) : null}
    </div>
  );
}

function Card({ className = "", children }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-neutral-200/80 bg-white/70 p-5 shadow-sm backdrop-blur sm:p-7",
        className
      )}
    >
      {children}
    </div>
  );
}

function FeatureRow({ title, desc, bullets = [] }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 h-9 w-9 shrink-0 rounded-2xl bg-neutral-900/90 shadow-sm" />
      <div className="min-w-0">
        <div className="text-lg font-bold text-neutral-900">{title}</div>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600 sm:text-base">
          {desc}
        </p>
        {bullets?.length ? (
          <ul className="mt-3 space-y-2 text-sm text-neutral-700 sm:text-base">
            {bullets.map((b, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-900" />
                <span className="min-w-0">{b}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

function ImageTile({ label, title, img }) {
  return (
    <figure className="group relative overflow-hidden rounded-3xl border border-neutral-200/70 bg-neutral-100">
      <img
        src={img}
        alt={title}
        loading="lazy"
        className="h-56 w-full object-cover transition duration-700 group-hover:scale-[1.03] sm:h-64"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      <figcaption className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-neutral-900">
            {label}
          </span>
          <span className="text-xs text-white/80">실제 시공 사진으로 교체 권장</span>
        </div>
        <div className="mt-2 text-base font-bold text-white sm:text-lg">{title}</div>
      </figcaption>
    </figure>
  );
}

function QuoteCard({ quote, name, meta }) {
  return (
    <Card className="h-full">
      <div className="text-sm leading-relaxed text-neutral-700 sm:text-base">
        “{quote}”
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-bold text-neutral-900">{name}</div>
          <div className="truncate text-xs text-neutral-500">{meta}</div>
        </div>
        <div className="h-10 w-10 shrink-0 rounded-2xl bg-neutral-900/10" />
      </div>
    </Card>
  );
}

function StickyMobileCTA({ onOpenEstimate }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200/70 bg-white/80 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-3">
        <SecondaryButton
          href={CONTACT.kakaoUrl}
          className="w-full"
          small
        >
          카톡으로 바로 상담
        </SecondaryButton>
        <PrimaryButton onClick={onOpenEstimate} className="w-full" small>
          30초 견적 요청
        </PrimaryButton>
      </div>
    </div>
  );
}

function EstimateModal({ open, onClose }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: BRAND.serviceArea,
    homeType: "아파트",
    room: "거실",
    pet: "있음",
    laundryHate: "그렇다",
    request: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setForm((f) => ({ ...f }));
    }
  }, [open]);

  const canSubmit = useMemo(() => {
    const phoneOk = form.phone.trim().length >= 9;
    return form.name.trim() && phoneOk;
  }, [form.name, form.phone]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-neutral-900">30초 견적 요청</div>
            <div className="text-xs text-neutral-500">
              실측 후 확정 · 상담은 무료 · 부담 없이 확인하세요
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
            type="button"
          >
            닫기
          </button>
        </div>

        <div className="px-5 py-5">
          {!submitted ? (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-neutral-700">
                    성함(필수)
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="예: 김유니"
                    className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700">
                    연락처(필수)
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="예: 01012345678"
                    className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700">주거 형태</label>
                  <select
                    value={form.homeType}
                    onChange={(e) => setForm((p) => ({ ...p, homeType: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
                  >
                    <option>아파트</option>
                    <option>오피스텔</option>
                    <option>빌라/주택</option>
                    <option>상가/사무실</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700">설치 공간</label>
                  <select
                    value={form.room}
                    onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))}
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
                  <label className="text-xs font-semibold text-neutral-700">반려동물</label>
                  <select
                    value={form.pet}
                    onChange={(e) => setForm((p) => ({ ...p, pet: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
                  >
                    <option>있음</option>
                    <option>없음</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700">세탁 스트레스</label>
                  <select
                    value={form.laundryHate}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, laundryHate: e.target.value }))
                    }
                    className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
                  >
                    <option>그렇다</option>
                    <option>보통</option>
                    <option>아니다</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-semibold text-neutral-700">요청 사항</label>
                <textarea
                  value={form.request}
                  onChange={(e) => setForm((p) => ({ ...p, request: e.target.value }))}
                  placeholder="예: 햇빛이 강해서 조절이 중요해요 / 고양이 털 때문에 관리가 쉬웠으면 해요"
                  className="mt-1 min-h-[96px] w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
                />
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <PrimaryButton
                  onClick={() => {
                    if (!canSubmit) return;
                    // ✅ 운영 시: 여기서 서버 전송 / CRM 저장 / 카카오 상담 연결로 교체
                    setSubmitted(true);
                  }}
                  className={cn("w-full", !canSubmit && "opacity-60")}
                >
                  우리집 견적 요청 보내기
                </PrimaryButton>
                <SecondaryButton href={CONTACT.kakaoUrl} className="w-full">
                  카톡으로 바로 보내기
                </SecondaryButton>
              </div>

              <div className="mt-3 text-xs leading-relaxed text-neutral-500">
                제출 시 연락처로 상담 안내를 드릴 수 있습니다. 실제 금액은 현장 실측 후 확정됩니다.
              </div>
            </>
          ) : (
            <div className="py-6 text-center">
              <div className="mx-auto h-14 w-14 rounded-3xl bg-neutral-900/10" />
              <div className="mt-4 text-xl font-extrabold text-neutral-900">
                접수 완료
              </div>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-600">
                “먼지·세탁·분위기” 중 무엇이 가장 스트레스인지 이미 기록됐습니다.
                상담에서는 <b className="text-neutral-900">공간/채광/관리 습관</b> 기준으로
                가장 합리적인 구성을 빠르게 제안드립니다.
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <PrimaryButton href={CONTACT.kakaoUrl} className="w-full sm:w-auto">
                  카톡으로 상담 이어가기
                </PrimaryButton>
                <SecondaryButton onClick={onClose} className="w-full sm:w-auto">
                  닫기
                </SecondaryButton>
              </div>
              <div className="mt-3 text-xs text-neutral-500">
                * 상담 및 방문 실측은 지역/일정에 따라 안내됩니다.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UnislatLandingPage() {
  const [estimateOpen, setEstimateOpen] = useState(false);

  const testimonials = useMemo(
    () => [
      {
        quote:
          "커튼은 예쁘지만 ‘세탁’ 생각하면 미루기만 했는데, 이제 더러워진 슬랫만 떼서 돌리니까 끝이에요.",
        name: "신혼 3개월차",
        meta: "거실 설치 / 관리 스트레스 감소",
      },
      {
        quote:
          "블라인드는 차가워 보이고 꺾일까 신경 쓰였는데, 유니슬렛은 분위기가 확 바뀌고 손 닿아도 부담이 덜해요.",
        name: "인테리어 민감파",
        meta: "채광 + 무드 둘 다 필요",
      },
      {
        quote:
          "고양이 털 때문에 커튼은 답이 없었어요. 분리 세탁이 되니까 집이 ‘깨끗해 보이는 상태’가 유지됩니다.",
        name: "반려묘 집사",
        meta: "털/먼지 관리 목적",
      },
    ],
    []
  );

  const { ref: heroRef, inView: heroIn } = useInViewOnce({ rootMargin: "0px 0px -30% 0px" });
  const { ref: problemRef, inView: problemIn } = useInViewOnce();
  const { ref: solutionRef, inView: solutionIn } = useInViewOnce();
  const { ref: proofRef, inView: proofIn } = useInViewOnce();

  return (
    <div className="min-h-screen bg-[#faf7f2] text-neutral-900">
      {/* 상단 바 */}
      <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-neutral-900" />
            <div className="leading-tight">
              <div className="text-sm font-extrabold tracking-tight">{BRAND.name}</div>
              <div className="text-[11px] text-neutral-500">{BRAND.serviceArea}</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-neutral-700 sm:flex">
            <a href="#problem" className="hover:text-neutral-900">문제</a>
            <a href="#solution" className="hover:text-neutral-900">해결</a>
            <a href="#proof" className="hover:text-neutral-900">후기</a>
            <a href="#offer" className="hover:text-neutral-900">견적</a>
          </nav>

          <div className="hidden items-center gap-2 sm:flex">
            <SecondaryButton href={CONTACT.kakaoUrl} small>
              카톡 상담
            </SecondaryButton>
            <PrimaryButton onClick={() => setEstimateOpen(true)} small>
              30초 견적
            </PrimaryButton>
          </div>

          {/* 모바일 상단 CTA */}
          <div className="sm:hidden">
            <PrimaryButton onClick={() => setEstimateOpen(true)} small>
              견적
            </PrimaryButton>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="absolute inset-0">
          {/* 비디오가 있으면 비디오 우선, 없으면 이미지 */}
          {MEDIA.heroVideoMp4 ? (
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={MEDIA.heroImage}
            >
              <source src={MEDIA.heroVideoMp4} type="video/mp4" />
            </video>
          ) : (
            <img
              src={MEDIA.heroImage}
              alt="유니슬렛 무드 컷"
              className="h-full w-full object-cover"
              loading="eager"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-[#faf7f2]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-14 sm:pb-20 sm:pt-20">
          <div
            className={cn(
              "max-w-2xl transition duration-700",
              heroIn ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            )}
          >
            <div className="mb-4 flex flex-wrap gap-2">
              <Pill>먼지·세탁 스트레스 종료</Pill>
              <Pill>블라인드+커튼 ‘새 메커니즘’</Pill>
              <Pill>공간이 커 보이는 세로 라인</Pill>
            </div>

            <h1 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              아직도 먼지 나는 무거운 커튼을 쓰고 계신가요?
            </h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-white/90 sm:text-xl">
              블라인드의 채광 조절과 커튼의 부드러움을 하나로.
              <br className="hidden sm:block" />
              거실의 품격을 바꾸는 <b className="text-white">유니슬렛</b>.
            </p>

            <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center">
              <PrimaryButton onClick={() => setEstimateOpen(true)} className="w-full sm:w-auto">
                우리집 견적 30초 만에 확인하기
              </PrimaryButton>
              <SecondaryButton href={CONTACT.kakaoUrl} className="w-full sm:w-auto">
                카톡으로 사진 보내고 바로 상담
              </SecondaryButton>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Card className="bg-white/10 text-white border-white/15">
                <div className="text-sm font-bold">걸어 지나가는 커튼</div>
                <div className="mt-2 text-xs text-white/80">
                  닫혀 있어도 ‘슬랫 사이로’ 자연스럽게 통과
                </div>
              </Card>
              <Card className="bg-white/10 text-white border-white/15">
                <div className="text-sm font-bold">슬랫만 분리 세탁</div>
                <div className="mt-2 text-xs text-white/80">
                  더러워진 부분만 떼어 세탁기에
                </div>
              </Card>
              <Card className="bg-white/10 text-white border-white/15">
                <div className="text-sm font-bold">주름 기억 원단</div>
                <div className="mt-2 text-xs text-white/80">
                  형태가 유지되는 메모리 폼
                </div>
              </Card>
            </div>

            <div className="mt-6 text-xs text-white/70">
              * 실제 상담에서는 공간 구조/창 크기/채광 방향을 기준으로 최적 구성을 제안합니다.
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem" ref={problemRef} className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <SectionTitle
          eyebrow="Pain Agitation"
          title="당신이 ‘커튼/블라인드’에 지친 이유는, 제품이 아니라 구조 때문입니다."
          desc="지금 쓰는 게 불편한 건 당신 탓이 아닙니다. 애초에 관리와 생활 동선에 맞지 않게 만들어졌습니다."
        />

        <div
          className={cn(
            "mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 transition duration-700",
            problemIn ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          )}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div className="text-lg font-extrabold">전통 블라인드의 함정</div>
              <Pill>차갑고 예민함</Pill>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-base">
              청소하다 손 베이고, 아이들이 만져서 꺾이고. 조금만 방심하면
              한쪽이 휘어져 “싼 티”가 나기 시작합니다.
            </p>
            <div className="mt-4 rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700">
              <div className="font-bold text-neutral-900">결과</div>
              <ul className="mt-2 space-y-2">
                <li className="flex gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-neutral-900" />
                  <span>손이 자주 닿는 집일수록 파손/변형 리스크 ↑</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-neutral-900" />
                  <span>빛 조절은 되는데, 공간은 차갑고 얇아 보임</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div className="text-lg font-extrabold">패브릭 커튼의 현실</div>
              <Pill>무겁고 번거로움</Pill>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-base">
              일 년에 한 번 세탁하기도 힘든 무게, 그 사이 쌓이는 미세먼지.
              “예쁜데… 관리 때문에 결국 포기”가 됩니다.
            </p>
            <div className="mt-4 rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700">
              <div className="font-bold text-neutral-900">결과</div>
              <ul className="mt-2 space-y-2">
                <li className="flex gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-neutral-900" />
                  <span>세탁을 미루는 동안 먼지/냄새/털이 누적</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-neutral-900" />
                  <span>집이 ‘깔끔해 보이는 상태’를 유지하기 어려움</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 text-center">
          <div className="max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
            문제는 “더 좋은 커튼”이 아닙니다. <b className="text-neutral-900">새 구조</b>가 필요합니다.
          </div>
          <PrimaryButton onClick={() => setEstimateOpen(true)} className="mt-3 w-full sm:w-auto">
            그 ‘새 구조’가 우리집에 맞는지 30초만에 확인
          </PrimaryButton>
        </div>
      </section>

      {/* SOLUTION */}
      <section id="solution" ref={solutionRef} className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <SectionTitle
          eyebrow="The New Mechanism"
          title="유니슬렛은 ‘커튼’이 아닙니다. 생활을 바꾸는 새로운 카테고리입니다."
          desc="닫아도 답답하지 않고, 더러워도 전체를 빨지 않습니다. ‘관리 가능한 창’이 됩니다."
        />

        <div
          className={cn(
            "mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 transition duration-700",
            solutionIn ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          )}
        >
          <Card>
            <FeatureRow
              title="Walk-through 구조"
              desc="슬랫이 ‘개별’이라 닫혀 있어도 자연스럽게 통과합니다. 생활 동선을 막지 않는 창가."
              bullets={[
                "환기/베란다 출입이 잦은 집에 특히 유리",
                "아이·반려동물이 건드려도 부담을 줄이는 구조",
              ]}
            />
          </Card>

          <Card>
            <FeatureRow
              title="슬랫 단위 분리 세탁"
              desc="더러워진 부분만 떼어 세탁기에. ‘전체 세탁’이라는 고통을 구조적으로 제거합니다."
              bullets={[
                "미세먼지/털/오염이 특정 구간에 몰리는 집에 최적",
                "관리 난이도를 ‘의지’가 아니라 ‘시스템’으로 낮춤",
              ]}
            />
          </Card>

          <Card>
            <FeatureRow
              title="메모리 폼 원단"
              desc="주름이 쉽게 남지 않고 형태를 유지하는 소재 선택으로 ‘항상 정돈된 느낌’을 만듭니다."
              bullets={[
                "구김/처짐이 누적되는 커튼의 단점을 완화",
                "사진 찍어도 깔끔하게 보이는 실루엣",
              ]}
            />
          </Card>

          <Card>
            <FeatureRow
              title="세로 라인의 착시 디자인"
              desc="수평보다 세로가 공간을 더 높고 넓게 보이게 만듭니다. 거실이 ‘업그레이드’됩니다."
              bullets={[
                "천장이 낮아 보이는 집에 체감이 큼",
                "채광 조절 + 무드 연출을 동시에",
              ]}
            />
          </Card>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-neutral-200/70 bg-white/70 shadow-sm backdrop-blur">
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
            <div className="p-6 sm:p-8">
              <div className="text-xs font-semibold text-neutral-500">Future Pacing</div>
              <div className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-900">
                “청소·세탁 걱정”이 사라진 거실을 상상해보세요.
              </div>
              <p className="mt-4 text-sm leading-relaxed text-neutral-700 sm:text-base">
                방문 손님이 들어오면 먼저 보이는 건 창입니다.
                유니슬렛은 빛을 ‘정교하게’ 다루고, 원단이 주는 부드러움으로
                공간을 ‘비싸 보이게’ 만듭니다.
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <PrimaryButton onClick={() => setEstimateOpen(true)} className="w-full sm:w-auto">
                  우리집에 맞는 구성 추천 받기
                </PrimaryButton>
                <SecondaryButton href="#proof" className="w-full sm:w-auto">
                  실제 변화 먼저 보기
                </SecondaryButton>
              </div>
            </div>
            <div className="relative min-h-[240px]">
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/10 via-white/10 to-white/60" />
              <div className="absolute inset-0 p-6 sm:p-8">
                <div className="grid grid-cols-2 gap-3">
                  {["먼지", "털", "세탁", "분위기"].map((t) => (
                    <div
                      key={t}
                      className="rounded-3xl border border-neutral-200/70 bg-white/80 p-4 text-center shadow-sm"
                    >
                      <div className="text-sm font-extrabold text-neutral-900">{t}</div>
                      <div className="mt-1 text-xs text-neutral-500">스트레스 ↓</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-3xl border border-neutral-200/70 bg-neutral-900 p-5 text-white shadow-sm">
                  <div className="text-sm font-bold">핵심은 “더 좋은 제품”이 아니라</div>
                  <div className="mt-2 text-xl font-extrabold">새 메커니즘</div>
                  <div className="mt-2 text-xs text-white/80">
                    닫아도 통과 · 더러워도 부분 세탁 · 항상 정돈된 라인
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section id="proof" ref={proofRef} className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <SectionTitle
          eyebrow="Social Proof & Authority"
          title="사진이 증거입니다. 분위기는 ‘말’보다 ‘변화’로 설득됩니다."
          desc="전환 핵심: Before/After는 반드시 실제 시공 사진으로 교체하세요. (가장 강력한 신뢰 자산)"
        />

        <div
          className={cn(
            "mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 transition duration-700",
            proofIn ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          )}
        >
          {MEDIA.beforeAfter.map((x, i) => (
            <ImageTile key={i} {...x} />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div className="text-lg font-extrabold">현장 경험 20년</div>
              <Pill>직접 시공</Pill>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-base">
              “같은 제품이라도, 설치 디테일이 결과를 갈라놓습니다.”
              커튼 박스/레일/창 구조에 따라 라인이 무너질 수도, 살아날 수도 있습니다.
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div className="text-lg font-extrabold">A/S & 리스크 최소화</div>
              <Pill>Risk Reversal</Pill>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-base">
              설치 후 “이상하다”는 느낌이 남지 않도록, 사용 패턴까지 고려해 안내합니다.
              <span className="text-neutral-500">
                {" "}
                (세부 정책/범위는 상담 시 명확히 안내)
              </span>
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div className="text-lg font-extrabold">후기 = 분위기 변화</div>
              <Pill>체감</Pill>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-base">
              “거실이 고급져 보인다”, “채광이 딱 조절된다”, “집이 깔끔해 보인다” —
              결국 고객이 사는 건 제품이 아니라 <b className="text-neutral-900">변화</b>입니다.
            </p>
          </Card>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {testimonials.map((t, i) => (
            <QuoteCard key={i} {...t} />
          ))}
        </div>
      </section>

      {/* OFFER */}
      <section id="offer" className="mx-auto max-w-6xl px-4 pb-24 pt-14 sm:pb-20 sm:pt-20">
        <div className="overflow-hidden rounded-3xl border border-neutral-200/70 bg-white/70 shadow-sm backdrop-blur">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="p-7 sm:p-9">
              <div className="flex flex-wrap items-center gap-2">
                <Pill>무료 상담</Pill>
                <Pill>방문 실측(안내)</Pill>
                <Pill>맞춤 제안</Pill>
              </div>
              <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
                오늘 결정하라는 말, 안 합니다.
                <br />
                대신 <span className="underline decoration-neutral-900/20">불편을 끝낼 방법</span>을 제시합니다.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-neutral-700 sm:text-base">
                유니슬렛이 필요한 사람은 따로 있습니다.
                <b className="text-neutral-900"> 먼지</b>에 민감하거나,
                <b className="text-neutral-900"> 세탁</b>을 미루는 타입이거나,
                <b className="text-neutral-900"> 반려동물</b>과 함께 살거나,
                <b className="text-neutral-900"> 인테리어 완성도</b>에 집착한다면 —
                지금 쓰는 구조는 계속 스트레스를 줍니다.
              </p>

              <div className="mt-6 rounded-3xl bg-neutral-900 p-5 text-white">
                <div className="text-sm font-bold">지금 해야 할 일은 딱 하나</div>
                <div className="mt-1 text-xl font-extrabold">
                  “우리집에 맞는 구성”을 확인하기
                </div>
                <div className="mt-2 text-xs text-white/80">
                  * 실제 금액은 창 크기/구성/원단에 따라 달라져 실측 후 확정됩니다.
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <PrimaryButton onClick={() => setEstimateOpen(true)} className="w-full sm:w-auto">
                  30초 견적 요청 (CTA)
                </PrimaryButton>
                <SecondaryButton href={CONTACT.kakaoUrl} className="w-full sm:w-auto">
                  카톡 상담 (사진 첨부)
                </SecondaryButton>
              </div>

              {/* 윤리적 스카시티(숫자 단정 X) */}
              <div className="mt-4 text-xs leading-relaxed text-neutral-500">
                이번 달 설치 일정은 한정되어 선착순으로 안내됩니다. (지역/현장 상황에 따라 변동)
              </div>
            </div>

            <div className="border-t border-neutral-200/70 bg-[#f7f3ec] p-7 sm:border-l sm:border-t-0 sm:p-9">
              <div className="text-sm font-extrabold text-neutral-900">자주 묻는 질문</div>
              <div className="mt-4 space-y-4">
                {[
                  {
                    q: "정말 부분만 세탁할 수 있나요?",
                    a: "핵심은 ‘슬랫 단위’ 구조입니다. 오염이 생기는 구간만 분리해 세탁/관리하는 방식으로 설계됩니다. (구성/원단에 따라 안내)",
                  },
                  {
                    q: "반려동물이 뜯거나 건드려도 괜찮나요?",
                    a: "완전 무적은 아니지만, 전통 블라인드처럼 ‘한 번 꺾이면 티 나는 구조’보다 스트레스가 줄어드는 경우가 많습니다. 집 환경을 기반으로 추천 드립니다.",
                  },
                  {
                    q: "설치하면 집이 정말 달라 보이나요?",
                    a: "창은 거실의 ‘첫 인상’입니다. 세로 라인과 빛 조절로 공간이 더 정돈되고 고급스럽게 보이는 체감이 큽니다. Before/After로 확인하세요.",
                  },
                  {
                    q: "A/S는 어떻게 되나요?",
                    a: "범위/기간은 제품·구성에 따라 달라 정확히 안내드립니다. 중요한 건 ‘연락이 되는 업체’와 ‘현장 경험’입니다. 설치 후 불편이 남지 않게 대응합니다.",
                  },
                ].map((x, i) => (
                  <div key={i} className="rounded-3xl border border-neutral-200/70 bg-white/70 p-5">
                    <div className="text-sm font-extrabold text-neutral-900">{x.q}</div>
                    <div className="mt-2 text-sm leading-relaxed text-neutral-700">{x.a}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-neutral-200/70 bg-white/70 p-5">
                <div className="text-sm font-extrabold text-neutral-900">지금 상담하면 받는 것</div>
                <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                  <li className="flex gap-2">
                    <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-neutral-900" />
                    <span>공간/채광/생활 동선 기준 “맞춤 구성” 제안</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-neutral-900" />
                    <span>관리 습관(세탁/먼지/털)에 맞는 원단 추천</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-neutral-900" />
                    <span>견적 요청 → 일정/실측 안내까지 한 번에</span>
                  </li>
                </ul>

                <PrimaryButton onClick={() => setEstimateOpen(true)} className="mt-4 w-full">
                  우리집 견적 30초 만에 요청하기
                </PrimaryButton>

                <div className="mt-3 text-center text-xs text-neutral-500">
                  또는 전화:{" "}
                  <a className="font-semibold text-neutral-900" href={`tel:${CONTACT.tel}`}>
                    {CONTACT.tel}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 모바일 스티키 CTA */}
      <StickyMobileCTA onOpenEstimate={() => setEstimateOpen(true)} />

      {/* 모달 */}
      <EstimateModal open={estimateOpen} onClose={() => setEstimateOpen(false)} />
    </div>
  );
}
