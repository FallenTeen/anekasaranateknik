import AppLogoIcon from '@/components/app-logo-icon';
import { CardContent, CardCustom, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10" style={{ backgroundImage: "url('/assets/images/beglight.svg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="flex w-full max-w-4xl flex-col gap-6">
                <Link href="/" className="flex items-center gap-2 self-center font-medium">
                    <div className="flex font-Poppins text-white font-bold text-4xl h-9 w-9 items-center justify-center">
                       WELCOME
                    </div>
                </Link>

                <div className="flex flex-col lg:flex-row rounded-lg shadow-lg">
                    <CardCustom className="w-full lg:w-1/2 rounded-t-lg lg:rounded-l-lg lg:rounded-r-none">
                        <CardHeader className="px-10 pt-8 pb-0 text-center">
                            <CardTitle className="text-xl">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 py-8">{children}</CardContent>
                    </CardCustom>
                    <div className="hidden lg:flex min-h-full w-full lg:w-1/2 items-center justify-center rounded-b-lg lg:rounded-r-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                        <div className="px-8 text-center">
                            <h1 className="text-2xl font-bold">Selamat Datang</h1>
                            <h2 className="text-md mb-8 font-semibold">Di PT. Aneka Sarana Teknik E-Catalogue</h2>
                            <a
                                href="/"
                                type="submit"
                                className="group relative mx-auto flex items-center justify-center gap-2 overflow-hidden rounded-full border-2 border-gray-50 bg-gray-50 px-4 py-2 text-lg text-black shadow-xl transition-all duration-300 ease-in-out before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-emerald-500 before:transition-all before:duration-500 before:ease-in-out hover:text-white hover:bg-white/0 before:hover:w-full lg:font-semibold"
                            >
                                <span className="relative z-10">Telusuri Produk</span>
                                <svg
                                    className="relative z-10 h-8 w-8 rotate-45 justify-end rounded-full border border-gray-700 bg-gray-50 p-2 text-gray-700 transition-all duration-300 ease-linear group-hover:rotate-90 group-hover:border-white group-hover:bg-white group-hover:text-emerald-500"
                                    viewBox="0 0 16 19"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                                        fill="currentColor"
                                    ></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
