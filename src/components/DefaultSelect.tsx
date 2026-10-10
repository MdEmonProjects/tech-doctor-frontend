import { useFormContext } from 'react-hook-form';

interface SelectOption { value: string; label: string; }
interface DefaultSelectProps {
  label: string;
  registerKey: string;
  options: readonly SelectOption[];
  require?: boolean;
  placeholder?: string;
}

export default function DefaultSelect({ label, registerKey, options, require = false, placeholder = 'Select an option' }: DefaultSelectProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[registerKey]?.message;

  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}{require && <span className="ml-1 text-red-500">*</span>}
      </span>
      <select
        {...register(registerKey, { required: require ? `${label} is required.` : false })}
        defaultValue=""
        className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/15 ${error ? 'border-red-500' : 'border-slate-300'}`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      {typeof error === 'string' && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
    </label>
  );
}
