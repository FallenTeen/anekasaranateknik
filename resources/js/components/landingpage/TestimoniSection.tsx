import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const TestimoniSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef(null);

  // --- MODIFIKASI MENGGUNAKAN PRAVATAR ---
  const testimonials = [
    {
      id: 1,
      name: "Budi Santoso",
      role: "Pemilik Restoran",
      company: "Warung Nusantara",
      rating: 5,
      text: "Pelayanan yang sangat memuaskan! Tim teknisi datang tepat waktu dan bekerja dengan profesional. AC di restoran saya sekarang dingin dan hemat listrik.",
      // Menggunakan Pravatar untuk gambar acak
      image: "https://i.pravatar.cc/80?u=1"
    },
    {
      id: 2,
      name: "Siti Aminah",
      role: "Ibu Rumah Tangga",
      company: "Perumahan Griya Asri",
      rating: 5,
      text: "Sudah 2 tahun pakai jasa mereka untuk service AC rumah. Selalu puas dengan hasilnya. Harga terjangkau dan pelayanan ramah.",
      image: "https://i.pravatar.cc/80?u=2"
    },
    {
      id: 3,
      name: "Ahmad Wijaya",
      role: "Manajer Kantor",
      company: "PT. Maju Bersama",
      rating: 5,
      text: "Instalasi AC kantor berjalan lancar tanpa gangguan aktivitas kerja. Teknisi sangat berpengalaman dan memberikan garansi yang baik.",
      image: "https://i.pravatar.cc/80?u=3"
    },
    {
      id: 4,
      name: "Maya Sari",
      role: "Pemilik Salon",
      company: "Maya Beauty Salon",
      rating: 4,
      text: "Service cepat dan hasil memuaskan. AC salon saya yang tadinya bocor freon sekarang sudah normal kembali. Terima kasih!",
      image: "https://i.pravatar.cc/80?u=4"
    }
  ];
  // --- MODIFIKASI SELESAI ---

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const animatedElements = entry.target.querySelectorAll('.animate-on-scroll');
            animatedElements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add('opacity-100', 'translate-y-0');
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section id="testimonials" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100" ref={sectionRef}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 text-3xl font-bold text-gray-900 mb-4">
            Apa Kata Pelanggan Kami
          </h2>
          <p className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 text-gray-600 text-lg max-w-2xl mx-auto">
            Kepuasan pelanggan adalah prioritas utama kami. Dengarkan pengalaman mereka yang telah mempercayai layanan kami.
          </p>
        </div>

        <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 relative">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-6 right-6 text-blue-100">
              <Quote className="w-16 h-16" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="flex space-x-1">
                  {renderStars(testimonials[currentTestimonial].rating)}
                </div>
              </div>

              <blockquote className="text-xl md:text-2xl text-gray-700 text-center leading-relaxed mb-8 font-medium">
                "{testimonials[currentTestimonial].text}"
              </blockquote>

              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                />
                <div className="text-center md:text-left">
                  <h4 className="text-xl font-bold text-gray-900">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-gray-600">
                    {testimonials[currentTestimonial].role}
                  </p>
                  <p className="text-blue-600 font-medium">
                    {testimonials[currentTestimonial].company}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={prevTestimonial}
            className="absolute left-0 md:left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 shadow-lg p-3 rounded-full transition-all duration-300 z-20"
            onMouseEnter={() => setIsAutoPlaying(false)}
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 md:right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 shadow-lg p-3 rounded-full transition-all duration-300 z-20"
            onMouseEnter={() => setIsAutoPlaying(false)}
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 flex justify-center mt-8 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentTestimonial === index
                  ? 'bg-blue-600 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Optional: Tampilan Grid Testimoni */}
        <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                currentTestimonial === index ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => goToTestimonial(index)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h5 className="font-semibold text-gray-900 text-sm">{testimonial.name}</h5>
                  <p className="text-gray-500 text-xs">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex space-x-1 mb-3">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-gray-600 text-sm line-clamp-3">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimoniSection;
