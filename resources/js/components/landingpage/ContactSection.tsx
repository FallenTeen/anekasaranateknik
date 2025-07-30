import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useEffect, useRef } from 'react';

const ContactSection = () => {
    const sectionRef = useRef(null);

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
            { threshold: 0.2 },
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const contactInfo = [
        {
            icon: MapPin,
            title: 'Alamat',
            content: (
                <>
                    Jalan xxxxx
                    <br />
                    Purwokerto Utara, 53352
                </>
            ),
        },
        {
            icon: Clock,
            title: 'Jam Buka',
            content: (
                <div className="space-y-1">
                    <div className="flex justify-between">
                        <span>Senin - Jumat</span>
                        <span>09.00-20.00 WIB</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Sabtu</span>
                        <span>09.00-17.00 WIB</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Minggu</span>
                        <span>Libur</span>
                    </div>
                </div>
            ),
        },
        {
            icon: Phone,
            title: 'Nomor Whatsapp',
            content: (
                <>
                    0812345678 atau klik{' '}
                    <a
                        href="https://wa.me/+62812345678"
                        className="font-semibold text-blue-600 duration-300 hover:scale-105 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Disini
                    </a>
                </>
            ),
        },
        {
            icon: Mail,
            title: 'Email',
            content: 'anekasaranateknik@gmail.com',
        },
    ];

    return (
        <section id="contact" className="bg-white py-16" ref={sectionRef}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="animate-on-scroll translate-y-10 text-base font-semibold tracking-wide text-blue-600 uppercase opacity-0 transition-all duration-1000">
                        Contact Us
                    </h2>
                    <p className="animate-on-scroll mt-2 translate-y-10 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 opacity-0 transition-all duration-1000 sm:text-4xl">
                        PT. ANEKA SARANA TEKNIK
                    </p>
                    <p className="animate-on-scroll mx-auto mt-4 max-w-2xl translate-y-10 text-xl text-gray-500 opacity-0 transition-all duration-1000">
                        Silahkan hubungi kami untuk konsultasi dan melakukan pembelian produk yang kami sediakan.
                    </p>
                </div>

                <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
                    {contactInfo.map((info, index) => {
                        const IconComponent = info.icon;
                        return (
                            <div
                                key={index}
                                className="animate-on-scroll flex translate-y-10 flex-col items-center space-y-4 rounded-lg bg-gray-50 p-6 text-center opacity-0 transition-all transition-colors duration-300 duration-1000 hover:bg-gray-100 md:items-start md:text-left"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-500 text-white">
                                    <IconComponent className="h-6 w-6" />
                                </div>
                                <div>
                                    <dt className="mb-2 text-lg font-medium text-gray-900">{info.title}</dt>
                                    <dd className="text-base leading-relaxed text-gray-600">{info.content}</dd>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="animate-on-scroll mt-16 translate-y-10 text-center opacity-0 transition-all duration-1000">
                    <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
                        <h3 className="mb-4 text-2xl font-bold">Siap Membantu Kebutuhan AC Anda!</h3>
                        <p className="mx-auto mb-6 max-w-2xl text-blue-100">
                            Tim profesional kami siap memberikan solusi terbaik untuk semua kebutuhan pendingin ruangan Anda. Hubungi kami sekarang
                            untuk konsultasi gratis!
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <a
                                href="https://wa.me/+62812345678"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex transform items-center justify-center rounded-lg border border-white px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-blue-600"
                            >
                                <Phone className="mr-2 h-5 w-5" />
                                Hubungi via WhatsApp
                            </a>
                            <a
                                href="mailto:anekasaranateknik@gmail.com"
                                className="inline-flex transform items-center justify-center rounded-lg border border-white px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-blue-600"
                            >
                                <Mail className="mr-2 h-5 w-5" />
                                Kirim Email
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
