import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Wrench } from 'lucide-react';

const breadcrumbs = [{ title: 'Dashboard', href: route('admin.dashboard') }];
const MaintenancePage = () => {
    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full items-center justify-center bg-gray-50">
                <div className="mx-auto max-w-lg text-center -mt-32">
                 <div className="mb-6 flex items-center justify-center">
                       <Wrench size={120}  />
                 </div>

                    <h1 className="mb-4 text-4xl font-bold text-gray-800">Situs Sedang dalam Perbaikan</h1>

                    <p className="mb-8 text-lg text-gray-600">
                        Kami mohon maaf atas ketidaknyamanannya. Saat ini kami sedang melakukan beberapa pembaruan untuk meningkatkan pengalaman Anda.
                        Situs akan segera kembali normal.
                    </p>

                    <div className="rounded-r-lg border-l-4 border-blue-500 bg-blue-100 p-4 text-blue-700" role="alert">
                        <p className="font-semibold">Terima kasih atas kesabaran Anda!</p>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
};

export default MaintenancePage;
