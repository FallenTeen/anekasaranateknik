import { Facebook, Instagram, Phone, Twitter } from 'lucide-react';

const FooterSection = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            icon: Facebook,
            href: '#',
            name: 'Facebook',
        },
        {
            icon: Instagram,
            href: '#',
            name: 'Instagram',
        },
        {
            icon: Twitter,
            href: '#',
            name: 'Twitter',
        },
    ];

    const menuSections = [
        {
            title: 'Shop',
            links: [
                { name: 'Semua Produk', href: '#' },
                { name: 'Produk', href: '#' },
                { name: 'Rekomendasi', href: '#' },
            ],
        },
        {
            title: 'Informations',
            links: [
                { name: 'Tentang Kami', href: '#' },
                { name: 'Kontak Kami', href: '#' },
                { name: 'News', href: '#' },
            ],
        },
    ];
    const sponsors = [
        { name: "APPLE", image: "apple.png" },
        { name: "ASUS", image: "asus.png" },
        { name: "HUAWEI", image: "huawei.png" },
        { name: "MI", image: "mi.png" },
        { name: "MSI", image: "msi.png" },
        { name: "ACER", image: "acer.png" },
        { name: "IBOX", image: "ibox.png" },
        { name: "LENOVO", image: "lenovo.png" },
    ];
    const shippings = [
        { name: "JNE", image: "jne.png" },
        { name: "POS", image: "pos.png" },
        { name: "TIKI", image: "tiki.png" },
        { name: "ANTERAJA", image: "anteraja.png" },
    ];

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const PartnerLogo = ({ image, type }) => (
        <div className="flex flex-col items-center">
            <img
                src={`/assets/icons/${type}/${image}`}
                className="h-8 w-auto object-contain"
            />
            <span className="mt-1 text-xs font-bold text-black">{name}</span>
        </div>
    );

    return (
        <footer className="flex flex-col bg-blue-600 font-sans text-white">
            <div className="mx-6 flex flex-col gap-6 pt-8 lg:flex-row">
                <div className="flex flex-col justify-between lg:grow lg:flex-row lg:px-12">
                    <div className="flex flex-1 flex-col lg:pr-4">
                        <div className="flex h-10 items-center text-3xl font-bold">PT. Aneka Sarana Teknik</div>
                        <div>
                            <div className="pt-8 text-lg font-semibold">Our Social Media</div>
                            <div className="flex items-center gap-4 pt-4">
                                {socialLinks.map((social, index) => {
                                    const IconComponent = social.icon;
                                    return (
                                        <a
                                            key={index}
                                            href={social.href}
                                            className="rounded-lg bg-blue-800 p-3 transition-colors duration-300 hover:bg-blue-500"
                                            aria-label={social.name}
                                        >
                                            <IconComponent className="h-6 w-6" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-1 flex-wrap justify-between gap-8 lg:mx-auto lg:w-3/4">
                        {menuSections.map((section, sectionIndex) => (
                            <ul key={sectionIndex} className="flex-1 list-none">
                                <li className="pb-4 text-xl font-bold">{section.title}</li>
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex} className="py-2">
                                        <a href={link.href} className="text-white transition-colors duration-300 hover:underline">
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ))}
                    </div>
                </div>

                <div className="flex grow flex-col items-center">
                    <div className="grid w-full gap-6">
                        <div className="flex flex-col items-center">
                            <div className="animate-pulse cursor-pointer py-1 text-xl font-bold duration-300 hover:tracking-wider">
                                Stay Up To Date
                            </div>
                            <div className="flex w-full max-w-md items-center rounded-xl border-4 border-blue-400 focus-within:border-white">
                                <input
                                    type="email"
                                    placeholder="Youremail@example.com"
                                    className="placeholder-opacity-40 w-full rounded-l-xl border-none bg-blue-600 px-4 py-2 placeholder-white duration-300 outline-none"
                                />
                                <button
                                    type="submit"
                                    className="rounded-r-xl bg-blue-500 px-4 py-2 font-bold text-white duration-300 hover:bg-blue-400"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.146823525993!2d106.9919048!3d-6.244373699999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698dc767fa61ff%3A0x21ba7216f5e6a156!2sPT%20Aneka%20Sarana%20Teknik!5e0!3m2!1sen!2sid!4v1753814078597!5m2!1sen!2sid"
                                className="w-full max-w-lg rounded-lg shadow-lg"
                                style={{ border: 0 }}
                                height="250"
                                title="Lokasi PT Aneka Sarana Teknik"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 w-full flex mx-auto justify-center border-t border-blue-400 bg-blue-400 py-2 font-sans font-semibold gap-4">
                <div className="flex flex-col items-center gap-2 px-4 py-2 lg:flex-row lg:justify-center">
                    <div className="hidden px-2 lg:block">Partnership</div>
                    <div className="flex flex-wrap justify-center gap-1">
                        {sponsors.map((sponsor, index) => (
                            <PartnerLogo
                                key={index}
                                image={sponsor.image}
                                type="sponsors"
                            />
                        ))}
                    </div>
                </div>
                <div className="mt-4 flex flex-col items-center gap-4 px-4 py-2 lg:mt-0 lg:flex-row lg:justify-center">
                    <div className="hidden px-2 lg:block">Mitra Pengantaran</div>
                    <div className="flex flex-wrap justify-center gap-1">
                        {shippings.map((shipping, index) => (
                            <PartnerLogo
                                key={index}
                                image={shipping.image}
                                type="mitra"
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-blue-700 py-4 text-center text-sm">
                © {currentYear} PT. Aneka Sarana Teknik. All rights reserved.
            </div>
            <a
                href="https://wa.me/+62812345678"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed right-6 bottom-6 z-50 transform rounded-full bg-green-500 p-4 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-green-600"
                aria-label="Chat WhatsApp"
            >
                <Phone className="h-6 w-6" />
            </a>
        </footer>
    );
};

export default FooterSection;
