import type { InputHTMLAttributes } from 'react';
import { useFormContext } from 'react-hook-form';

interface DefaultInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  label: string;
  registerKey: string;
  require?: boolean;
}

export default function DefaultInput({ label, registerKey, require = false, className = '', ...inputProps }: DefaultInputProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[registerKey]?.message;

  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}{require && <span className="ml-1 text-red-500">*</span>}
      </span>
      <input
        {...register(registerKey, { required: require ? `${label} is required.` : false })}
        {...inputProps}
        className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/15 ${error ? 'border-red-500' : 'border-slate-300'} ${className}`}
      />
      {typeof error === 'string' && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </label>
  );
}
