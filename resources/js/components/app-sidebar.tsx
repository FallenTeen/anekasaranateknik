import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell, ClipboardList, CreditCard, History, LayoutGrid, Package, ShoppingCart, Users, Wrench } from 'lucide-react';
import { route } from 'ziggy-js';
import AppLogo from './app-logo';

interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
}

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
        icon: LayoutGrid,
    },
    {
        title: 'Produk',
        href: route('admin.produk.kelola'),
        icon: Package,
        items: [
            {
                title: 'Kelola Produk',
                href: route('admin.produk.kelola'),
                icon: Package,
            },
            {
                title: 'Kelola Transaksi',
                href: route('admin.produk.transaksi'),
                icon: CreditCard,
            },
            {
                title: 'Riwayat Transaksi',
                href: route('admin.produk.riwayat'),
                icon: History,
            },
        ],
    },
    {
        title: 'Services',
        href: route('admin.services.jasa'),
        icon: Wrench,
        items: [
            {
                title: 'Jasa',
                href: route('admin.services.jasa'),
                icon: Wrench,
            },
            {
                title: 'List Pekerja',
                href: route('admin.services.pekerja'),
                icon: Users,
            },
        ],
    },
    {
        title: 'Notifikasi',
        href: route('admin.notifikasi'),
        icon: Bell,
    },
];

const userNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('user.dashboard'),
        icon: LayoutGrid,
    },
    {
        title: 'Keranjang',
        href: route('user.keranjang'),
        icon: ShoppingCart,
    },
    {
        title: 'Riwayat Pesanan',
        href: route('user.riwayat-pesanan'),
        icon: ClipboardList,
    },
];

export function AppSidebar() {
    const { auth } = usePage<PageProps>().props;
    const isAdmin = auth.user?.role === 'admin';
    const navItems = isAdmin ? adminNavItems : userNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-blue-100">
            <SidebarHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-blue-200/50">
                            <Link href={isAdmin ? route('admin.dashboard') : route('user.dashboard')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-white">
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
