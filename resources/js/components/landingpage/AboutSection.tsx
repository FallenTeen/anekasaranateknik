import { CheckCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';

const AboutSection = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const animatedElements = entry.target.querySelectorAll('.animate-on-scroll');
                        animatedElements.forEach((el, index) => {
                            setTimeout(() => {
                                el.classList.add('opacity-100', 'translate-y-0', 'translate-x-0');
                            }, index * 200);
                        });
                    }
                });
            },
            { threshold: 0.2 },
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const services = [
        {
            image: '/assets/icons/services/Layanan-24-jam-2.svg',
            title: 'Layanan 24 Jam',
            description: 'Kami menyediakan layanan AC darurat 24 jam, untuk menjaga optimalisasi kebutuhan anda.',
            badges: ['Professional', '24/7'],
        },
        {
            image: '/assets/icons/services/Pelayanan-yang-distandarisasi.svg',
            title: 'Layanan Berkualitas',
            description: 'Layanan AC kami mematuhi standar, dikelola oleh teknisi berpengalaman untuk menjamin kualitas.',
            badges: ['Berstandar', 'Stabil'],
        },
        {
            image: '/assets/icons/services/Dukungan.svg',
            title: 'Dukungan Pelanggan',
            description: 'Kami siap memberikan dukungan penuh dalam setiap langkah pembelian produk kami.',
            badges: ['Berpengalaman', 'Professional'],
        },
    ];

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="about" className="w-full bg-white py-16" ref={sectionRef}>
            <div className="mx-auto min-w-full">
                <div className="mb-16 text-center">
                    <p className="animate-on-scroll mb-2 translate-y-10 text-2xl font-semibold text-gray-900 opacity-0 transition-all duration-1000">
                        Mengapa Kami?
                    </p>
                    <h2 className="animate-on-scroll translate-y-10 text-lg text-gray-600 opacity-0 transition-all duration-1000">
                        Kami menyediakan layanan termurah, terlengkap, dan tercepat
                    </h2>
                </div>
                <div className="mb-16 px-24 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => {
                        return (
                            <div
                                key={index}
                                className="animate-on-scroll mx-auto max-w-sm translate-x-10 overflow-hidden rounded-lg border border-gray-200 bg-white opacity-0 shadow-sm transition-all transition-shadow duration-300 duration-1000 hover:shadow-lg"
                            >
                                <div className="flex flex-col items-center p-6 text-center">
                                    <div className="mb-4 rounded-full bg-blue-50 p-4">
                                        <div className="mb-4">
                                            <img src={service.image} alt={service.title} className="h-24 w-24 object-contain" />
                                        </div>
                                    </div>
                                    <h3 className="mb-3 text-xl font-medium text-gray-800">{service.title}</h3>
                                    <p className="mb-4 text-sm leading-relaxed text-gray-500">{service.description}</p>
                                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                                        {service.badges.map((badge, badgeIndex) => (
                                            <div key={badgeIndex} className="flex items-center">
                                                <CheckCircle className="mr-1 h-3 w-3" />
                                                <span>{badge}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="animate-on-scroll translate-y-10 bg-blue-600 p-8 text-center text-white opacity-0 transition-all duration-1000">
                    <h2 className="mb-4 text-3xl font-semibold">Siap untuk Meningkatkan Kenyamanan Anda?</h2>
                    <p className="mx-auto mb-6 max-w-2xl text-blue-100">
                        Bergabunglah dengan ribuan pelanggan puas yang telah memilih layanan kami. Dapatkan produk AC berkualitas dan layanan
                        profesional dari tim kami!
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <button
                            onClick={() => scrollToSection('contact')}
                            className="rounded-md border border-white px-6 py-3 font-bold text-white transition duration-300 hover:bg-white hover:text-blue-600 hover:shadow-lg"
                        >
                            Hubungi Kami
                        </button>
                        <button
                            onClick={() => scrollToSection('products')}
                            className="rounded-md border border-white px-6 py-3 font-bold text-white transition duration-300 hover:bg-white hover:text-blue-600 hover:shadow-lg"
                        >
                            Jelajahi Produk kami
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
