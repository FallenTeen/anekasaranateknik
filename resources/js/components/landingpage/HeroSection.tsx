import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  useEffect(() => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('opacity-100', 'translate-y-0');
      }, index * 200);
    });
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="h-screen relative">
      <div className="h-screen relative" style={{ backgroundImage: "url('/assets/images/beglight.svg')", backgroundSize: 'cover', backgroundPosition: 'center' }} >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none"></div>

        <div className="h-full flex items-center justify-between text-white px-8 mx-auto">
          <div className="relative w-1/2 max-w-2xl mx-auto h-2/3 items-center justify-center lg:flex hidden">
            <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
              <img
                className=" object-fit object-center w-fill h-fill items-center justify-center rounded-md box-shadow-2xl"
                src="/assets/images/Mainnicon.png"
                alt="AC Service"
                loading="lazy"
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2 h-full flex flex-col items-center lg:items-start justify-center ">
            <h1 className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 text-xl font-extrabold leading-tight drop-shadow-lg pt-12 lg:pt-0">
              Selamat Datang Di
            </h1>
            <h1 className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 text-xl font-extrabold leading-tight drop-shadow-lg">
              ANEKA SARANA TEKNIK
            </h1>
            <h2 className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 text-sm font-thin mb-4 leading-tight drop-shadow-lg">
              Telah dipercaya sejak 2015
            </h2>
            <p className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 drop-shadow-lg text-6xl my-10 font-bold tracking-tight text-center lg:text-left">
              SOLUSI TERBAIK UNTUK{' '}
              <span className="text-blue-600 hover:scale-105 inline-block hover:text-white transition-all duration-500 cursor-pointer">
                KESEJUKAN
              </span>
              {' '}DAN{' '}
              <span className="text-blue-600 hover:scale-105 inline-block hover:text-white transition-all duration-500 cursor-pointer">
                KENYAMANAN
              </span>
              {' '}ANDA.
            </p>
            <button
              onClick={() => scrollToSection('about')}
              className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 inline-flex items-center gap-2 px-6 py-4 mt-10 bg-blue-600 text-lg rounded-xl font-semibold shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
            >
              Mulai Lihat Barang
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
