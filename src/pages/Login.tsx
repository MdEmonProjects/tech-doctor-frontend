import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { loginSuccess } from '../features/auth/authSlice';
import { useLoginMutation } from '../features/auth/authQuerySlice';

type LoginForm = { email: string; password: string };
type AuthState = { auth: { isAuthenticated: boolean; error: string | null; user: { role: string } | null } };

function getErrorMessage(error: unknown) {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: unknown }).data;
    if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
      return data.message;
    }
  }
  return error instanceof Error ? error.message : 'Unable to sign in. Please try again.';
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ mode: 'onTouched' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state: AuthState) => state.auth.isAuthenticated);
  const authError = useSelector((state: AuthState) => state.auth.error);
  const user = useSelector((state: AuthState) => state.auth.user);
  const [login, { isLoading }] = useLoginMutation();

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  const from = location.state?.from?.pathname;

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await login(data).unwrap();
      dispatch(
        loginSuccess({
          user: result.user,
          accessToken: result.accessToken,
        }),
      );
      const defaultDestination = result.user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
      const destination = from && (result.user.role === 'ADMIN' || !from.startsWith('/admin'))
        ? from
        : defaultDestination;
      navigate(destination, { replace: true });
    } catch (error) {
      dispatch({
        type: 'auth/loginFailure',
          payload: getErrorMessage(error),
      });
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-white p-3 sm:p-6">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-9">
        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-clay text-white text-lg">
          ✦
        </div>
        <h1 className="font-serif text-2xl font-semibold text-gray-900">Sign in</h1>
        <p className="mt-1.5 mb-7 text-sm leading-relaxed text-gray-500">
          Sign in with your administrator or staff account.
        </p>

        {authError && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {authError}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            <span>Email</span>
            <input
              type="text"
              autoComplete="email"
              placeholder="admin@example.com"
              className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-clay"
              {...register('email', {
                required: 'Email is required',
              })}
            />
            {errors.email && (
              <span className="mt-1 block text-xs font-normal text-clay-dark">
                {errors.email.message}
              </span>
            )}
          </label>

          <label className="block text-sm font-medium text-gray-700">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-clay"
              {...register('password', {
                required: 'Password is required',
              })}
            />
            {errors.password && (
              <span className="mt-1 block text-xs font-normal text-clay-dark">
                {errors.password.message}
              </span>
            )}
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-lg bg-clay py-2.5 text-sm font-semibold text-white transition-colors hover:bg-clay-dark disabled:opacity-60"
          >
            {isLoading ? 'Signing in…' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
