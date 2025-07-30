import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton
} from '@/components/ui/sidebar';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    ChevronRight,
    ClipboardList,
    CreditCard,
    History,
    LayoutGrid,
    Package,
    ShoppingCart,
    Users,
    Wrench
} from 'lucide-react';
import { route } from 'ziggy-js';
import { useState } from 'react';
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

interface NavMainProps {
    items: NavItem[];
}

function NavMain({ items }: NavMainProps) {
    const [openItems, setOpenItems] = useState<string[]>([]);

    const handleAccordionChange = (value: string[]) => {
        setOpenItems(value);
    };

    return (
        <SidebarMenu>
            <Accordion
                type="multiple"
                value={openItems}
                onValueChange={handleAccordionChange}
                className="w-full"
            >
                {items.map((item, index) => {
                    const Icon = item.icon;
                    const hasSubItems = item.items && item.items.length > 0;

                    if (!hasSubItems) {
                        // Simple menu item without sub-items
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild className="w-full">
                                    <Link href={item.href} className="flex items-center gap-2">
                                        <Icon className="h-4 w-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    // Menu item with sub-items using accordion
                    return (
                        <SidebarMenuItem key={item.title}>
                            <AccordionItem value={item.title} className="border-none">
                                <AccordionTrigger className="hover:no-underline p-0 [&[data-state=open]>button>svg:last-child]:rotate-90">
                                    <SidebarMenuButton className="w-full justify-between">
                                        <div className="flex items-center gap-2">
                                            <Icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200" />
                                    </SidebarMenuButton>
                                </AccordionTrigger>
                                <AccordionContent className="pb-0">
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => {
                                            const SubIcon = subItem.icon;
                                            return (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton asChild>
                                                        <Link
                                                            href={subItem.href}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <SubIcon className="h-4 w-4" />
                                                            <span>{subItem.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            );
                                        })}
                                    </SidebarMenuSub>
                                </AccordionContent>
                            </AccordionItem>
                        </SidebarMenuItem>
                    );
                })}
            </Accordion>
        </SidebarMenu>
    );
}

function AppSidebar() {
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
export { AppSidebar };
export default AppSidebar;
