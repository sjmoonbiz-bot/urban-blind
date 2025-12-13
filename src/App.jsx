import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Check, Ruler, Truck, ShieldCheck, Star, 
  MessageCircle, ArrowRight, Home, Scissors, Phone, MapPin 
} from 'lucide-react';

/**
 * [설정 영역]
 * 사장님, 이곳의 URL을 실제 운영하시는 카카오톡 오픈채팅방 링크로 바꿔주세요.
 */
const KAKAO_CHAT_URL = "https://open.kakao.com/o/sYourLinkID"; 

// 이미지 에셋 (Unsplash 고화질 이미지)
const IMAGES = {
  hero: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // 밝은 거실 커튼
  fabric: "https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // 텍스처
  gallery1: "https://images.unsplash.com/photo-1505693416388-b0346efee958?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  gallery2: "https://images.unsplash.com/photo-1615873968403-89e068629265?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  gallery3: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  gallery4: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 스크롤 감지 (헤더 스타일 변경용)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-stone-200">
      {/* --- Header (Sticky) --- */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="w-8 h-8 bg-stone-900 text-white flex items-center justify-center rounded-sm">
              <Home size={18} />
            </div>
            <span className={`text-xl font-bold tracking-tight ${scrolled ? 'text-stone-900' : 'text-stone-900 md:text-white'}`}>
              어반블라인드
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {['특장점', '시공사례', '진행과정', '고객후기'].map((item, idx) => {
              const ids = ['features', 'gallery', 'process', 'reviews'];
              return (
                <button 
                  key={item} 
                  onClick={() => scrollToSection(ids[idx])}
                  className={`text-sm font-medium hover:text-stone-500 transition-colors ${scrolled ? 'text-stone-600' : 'text-white/90'}`}
                >
                  {item}
                </button>
              );
            })}
            <button 
              onClick={() => scrollToSection('contact')}
              className="bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              무료 견적 신청
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden z-50 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} className="text-stone-900" /> : <Menu size={24} className={scrolled ? 'text-stone-900' : 'text-stone-900 md:text-white'} />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {isMenuOpen && (
          <div className="absolute top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center gap-8 z-40 animate-fade-in">
            {['특장점', '시공사례', '진행과정', '고객후기'].map((item, idx) => {
              const ids = ['features', 'gallery', 'process', 'reviews'];
              return (
                <button 
                  key={item} 
                  onClick={() => scrollToSection(ids[idx])}
                  className="text-2xl font-light text-stone-800"
                >
                  {item}
                </button>
              );
            })}
            <button 
              onClick={() => scrollToSection('contact')}
              className="mt-4 bg-stone-900 text-white px-8 py-3 rounded-full text-lg font-semibold"
            >
              무료 견적 신청하기
            </button>
          </div>
        )}
      </header>

      {/* --- Hero Section --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={IMAGES.hero} 
            alt="Living room interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-stone-900/10" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white mt-16">
          <span className="inline-block py-1 px-3 border border-white/30 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-4 animate-fade-in-up">
            서울 / 경기 / 인천 무료 방문 견적
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 drop-shadow-md">
            집이 호텔이 되는<br className="md:hidden" /> 가장 쉬운 방법
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            공장 직영 합리적인 가격과 완벽한 시공.<br/>
            프리미엄 커튼 & 블라인드로 당신의 공간을 완성해 드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => scrollToSection('contact')}
              className="bg-stone-900 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-stone-800 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              무료 견적 받아보기 <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* --- USP (Unique Selling Points) --- */}
      <section id="features" className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-2">Why Choose Us</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-stone-900">왜 '어반블라인드' 일까요?</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { 
                icon: <Ruler size={32} />, 
                title: "100% 무료 방문 실측", 
                desc: "전문가가 직접 샘플북을 들고 방문합니다. 우리 집 조명 아래서 원단을 직접 확인하세요." 
              },
              { 
                icon: <Scissors size={32} />, 
                title: "공장 직영 거품 없는 가격", 
                desc: "유통 마진을 뺀 합리적인 가격. 백화점 퀄리티의 원단을 공장 도매가로 만나보세요." 
              },
              { 
                icon: <ShieldCheck size={32} />, 
                title: "확실한 A/S 보장", 
                desc: "시공 후 끝이 아닙니다. 사용 중 발생하는 문제까지 책임지고 관리해 드립니다." 
              }
            ].map((feature, idx) => (
              <div key={idx} className="group p-8 rounded-2xl bg-stone-50 border border-stone-100 hover:border-stone-300 hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 text-stone-800 shadow-sm group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold mb-3 text-stone-900">{feature.title}</h4>
                <p className="text-stone-600 leading-relaxed break-keep">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Gallery Section --- */}
      <section id="gallery" className="py-20 bg-stone-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">시공 갤러리</h2>
              <p className="text-stone-600">최근 시공한 고객님들의 실제 공간입니다.</p>
            </div>
            {/* 태그들 */}
            <div className="flex gap-2 mt-4 md:mt-0">
              {['#차르르커튼', '#암막커튼', '#우드블라인드'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-white rounded-full text-sm text-stone-600 border border-stone-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { img: IMAGES.gallery1, title: "강남 자이 아파트", desc: "호텔식 형상기억 암막 + 차르르" },
              { img: IMAGES.gallery2, title: "송파 헬리오시티", desc: "프리미엄 우드 블라인드" },
              { img: IMAGES.gallery3, title: "분당 파크뷰", desc: "친환경 린넨 룩 커튼" },
              { img: IMAGES.gallery4, title: "광교 힐스테이트", desc: "이중 쉬폰 + 100% 암막" },
            ].map((item, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-xl aspect-[3/4] cursor-pointer">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity">
                  <div className="absolute bottom-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <h5 className="text-lg font-bold mb-1">{item.title}</h5>
                    <p className="text-sm text-stone-300">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Process Section --- */}
      <section id="process" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-stone-900">간편한 진행 과정</h2>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-20 right-20 h-0.5 bg-stone-200 -z-10" />

            {[
              { step: "01", title: "상담 신청", desc: "하단 폼으로 간편 신청", icon: <Phone size={24}/> },
              { step: "02", title: "방문 실측", desc: "샘플 확인 및 정확한 실측", icon: <MapPin size={24}/> },
              { step: "03", title: "제작 및 시공", desc: "전문가 시공 후 마무리", icon: <Truck size={24}/> },
            ].map((p, idx) => (
              <div key={idx} className="flex flex-col items-center text-center bg-white p-4 w-full md:w-1/3">
                <div className="w-24 h-24 bg-stone-50 border-2 border-stone-100 rounded-full flex items-center justify-center mb-6 relative">
                  <span className="text-stone-300 font-bold text-5xl absolute opacity-20 top-1 left-2">{p.step}</span>
                  <div className="text-stone-800 z-10">{p.icon}</div>
                </div>
                <h4 className="text-xl font-bold mb-2 text-stone-900">{p.title}</h4>
                <p className="text-stone-500 text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Testimonials --- */}
      <section id="reviews" className="py-20 bg-stone-900 text-stone-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">고객님들의 찐 후기</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                text: "새 아파트 입주하면서 가장 고민했던 게 커튼이었는데, 사장님이 추천해주신 컬러가 거실이랑 찰떡이에요. 분위기가 확 달라졌어요!",
                author: "동탄 롯데캐슬 입주민",
                date: "2024.03 시공"
              },
              {
                text: "인터넷으로 살까 하다가 무료 방문 견적 받아봤는데, 확실히 원단을 눈으로 보고 만져보니까 다르네요. 암막 효과 대만족입니다.",
                author: "마포 래미안 푸르지오",
                date: "2024.02 시공"
              },
              {
                text: "블라인드 줄이 고장나서 연락드렸는데 AS도 바로 해주시고 친절하셨어요. 다음엔 안방 커튼도 여기서 하려구요.",
                author: "일산 자이 거주 고객",
                date: "2024.01 시공"
              }
            ].map((review, idx) => (
              <div key={idx} className="bg-stone-800 p-8 rounded-xl border border-stone-700 relative">
                <div className="flex text-yellow-400 mb-4 gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-stone-300 mb-6 leading-relaxed">"{review.text}"</p>
                <div className="border-t border-stone-700 pt-4 flex justify-between items-center text-sm">
                  <span className="font-bold text-white">{review.author}</span>
                  <span className="text-stone-500">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA Section (Main Converter) --- */}
      <ConsultationForm />

      {/* --- Footer --- */}
      <footer className="bg-stone-950 text-stone-500 py-12 text-sm border-t border-stone-800">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4 text-stone-300">
              <Home size={16} />
              <span className="text-lg font-bold">어반블라인드</span>
            </div>
            <p className="mb-2">대표: 김대표 | 사업자등록번호: 123-45-67890</p>
            <p className="mb-2">서울시 강남구 테헤란로 123, 1층</p>
            <p>Tel: 010-1234-5678 (상담 가능 시간: 09:00 ~ 20:00)</p>
          </div>
          <div className="flex flex-col md:items-end justify-center">
             <p className="mb-4">Copyright © Urban Blind. All rights reserved.</p>
             <div className="flex gap-4">
               <a href="#" className="hover:text-white transition-colors">이용약관</a>
               <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * [컴포넌트 분리] 상담 신청 폼 & 로직
 * - 고객 경험을 위해 정보 복사 -> 카톡 실행 흐름으로 설계
 */
function ConsultationForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    area: '',
    type: '커튼'
  });
  const [toast, setToast] = useState({ show: false, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. 상담 메시지 생성
    const message = `
[무료 견적 문의]
- 성함: ${formData.name}
- 연락처: ${formData.phone}
- 지역: ${formData.area}
- 관심항목: ${formData.type}
    `.trim();

    // 2. 클립보드 복사 시도
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(message);
        return true;
      } catch (err) {
        // Fallback for some browsers/webviews
        const textArea = document.createElement("textarea");
        textArea.value = message;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        return true;
      }
    };

    copyToClipboard().then(() => {
      // 3. 토스트 메시지 노출
      setToast({ show: true, message: '상담 내용이 복사되었습니다! 카톡으로 이동합니다.' });
      
      // 4. 카카오톡 열기 (딜레이를 주어 사용자가 메시지를 읽을 시간을 줌)
      setTimeout(() => {
        window.open(KAKAO_CHAT_URL, '_blank');
        setToast({ show: false, message: '' });
      }, 1500);
    });
  };

  return (
    <section id="contact" className="py-24 bg-stone-50 relative">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100 flex flex-col md:flex-row">
          
          {/* Left: Persuasion Copy */}
          <div className="md:w-5/12 bg-stone-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">무료 견적 신청하기</h3>
              <p className="text-stone-300 mb-8 leading-relaxed text-sm">
                고민은 배송만 늦출 뿐!<br/>
                간단한 정보를 남겨주시면<br/>
                전문가가 친절하게 상담해 드립니다.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><Check size={16} className="text-yellow-400"/> 실측비, 시공비 무료</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-yellow-400"/> 서울/경기 전 지역 출장</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-yellow-400"/> 카드 무이자 할부 가능</li>
              </ul>
            </div>
            {/* Background Pattern */}
            <div className="absolute -bottom-10 -right-10 text-stone-800 opacity-50">
              <MessageCircle size={200} />
            </div>
          </div>

          {/* Right: Form */}
          <div className="md:w-7/12 p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">성함</label>
                <input 
                  type="text" 
                  name="name" 
                  required
                  placeholder="홍길동"
                  className="w-full border-b border-stone-300 py-2 focus:outline-none focus:border-stone-900 transition-colors bg-transparent placeholder-stone-300"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">연락처</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required
                  placeholder="010-1234-5678"
                  className="w-full border-b border-stone-300 py-2 focus:outline-none focus:border-stone-900 transition-colors bg-transparent placeholder-stone-300"
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">지역</label>
                  <input 
                    type="text" 
                    name="area" 
                    required
                    placeholder="예: 강남구, 분당"
                    className="w-full border-b border-stone-300 py-2 focus:outline-none focus:border-stone-900 transition-colors bg-transparent placeholder-stone-300"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">관심 항목</label>
                  <select 
                    name="type" 
                    className="w-full border-b border-stone-300 py-2 focus:outline-none focus:border-stone-900 bg-transparent text-stone-800 cursor-pointer"
                    onChange={handleChange}
                  >
                    <option value="커튼">커튼</option>
                    <option value="블라인드">블라인드</option>
                    <option value="커튼+블라인드">둘 다 (커튼+블라인드)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full bg-[#FAE100] hover:bg-[#ebd300] text-[#371D1E] font-bold py-4 rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} fill="currentColor" />
                  카카오톡으로 무료 견적 받기
                </button>
                <p className="text-center text-xs text-stone-400 mt-3">
                  버튼을 누르면 내용이 복사되고 카카오톡이 실행됩니다.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-stone-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 animate-bounce flex items-center gap-2 text-sm md:text-base w-max">
          <Check size={18} className="text-green-400" />
          {toast.message}
        </div>
      )}
    </section>
  );
}