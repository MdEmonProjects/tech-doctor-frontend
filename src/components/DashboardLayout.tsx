import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { closeMobileSidebar, openMobileSidebar } from '../features/ui/uiSlice';
import Sidebar from './Sidebar/Sidebar';
import type { AppDispatch, RootState } from '../app/store';
import DefaultModal from './DefaultModal';
type AuthState = {
  auth: {
    user: { name?: string | null; email: string; role: string } | null;
  };
};

export default function DashboardLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: AuthState) => state.auth.user);
  const { mobileSidebarOpen } = useSelector((state: RootState) => state.ui);
  const signOut = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-dvh min-h-0 w-full min-w-0 overflow-hidden bg-background">
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 cursor-default bg-black/40 md:hidden"
          onClick={() => dispatch(closeMobileSidebar())}
        />
      )}
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
          <div className="sticky top-0 z-30 shrink-0">
            <header className="flex min-h-16 w-full shrink-0 items-center justify-between gap-2 border-b border-border/50 bg-surface px-3 py-2 sm:gap-3 sm:px-4 lg:h-20 lg:gap-4 lg:px-6 lg:py-0">
              <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-4">
                <button
                  type="button"
                  aria-label="Open menu"
                  onClick={() => dispatch(openMobileSidebar())}
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-secondary hover:text-foreground md:hidden"
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height={22}
                    width={22}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
                <button
                  data-slot="button"
                  className="button flex items-center justify-center w-9 h-9 bg-surface-secondary text-foreground rounded-full"
                  data-rac=""
                  type="button"
                  tabIndex={0}
                  aria-label="Notifications"
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height={17}
                    width={17}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </button>
                <button
                  data-slot="button"
                  className="button flex items-center justify-center w-9 h-9 bg-surface-secondary text-foreground text-center rounded-full"
                  type="button"
                  tabIndex={0}
                  data-react-aria-pressable="true"
                  aria-label="ডার্ক মোডে যান"
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height={17}
                    width={17}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </button>
                <div
                  className="hidden sm:flex popover__trigger ps-2 items-center gap-2.5 cursor-pointer rounded-lg transition-opacity hover:opacity-90 outline-none"
                  role="button"
                  aria-label="ব্যবহারকারী মেনু"
                  aria-expanded="false"
                  tabIndex={0}
                >
                  <div className="w-9 h-9 text-sm rounded-full bg-brand-600 text-white flex items-center justify-center font-semibold shrink-0 font-bengali">
                    <img
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                      src="https://qmmsoft.com/avatar.png?token=InVzZXJzL3Byb2ZpbGVfcGljdHVyZXMvV2hhdHNBcHBfSW1hZ2VfMjAyNi0wOC0yM19hdF8zLjA2LjU5X1BNLmpwZyI:1xAPts:Y8GEbm3oyIUOTxJpTUcd5OFzeBPDjcUUuF1nML8o4U8"
                    />
                  </div>
                </div>
              </div>
            </header>
            {/* <div className="overflow-hidden border-b border-border/50 bg-section-header px-3 py-1.5 text-xs text-muted sm:px-6">
              <p className="truncate font-bengali">জরুরি বিজ্ঞপ্তি: পরীক্ষার্থী নিবন্ধন কার্যক্রম চলমান রয়েছে। নির্ধারিত সময়ের মধ্যে তথ্য যাচাই করুন।</p>
            </div> */}
          </div>

          <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden bg-dashboard-workspace">
            <Outlet />
          </main>
        </div>
      </div>
      <DefaultModal />
    </div>
  );
}
