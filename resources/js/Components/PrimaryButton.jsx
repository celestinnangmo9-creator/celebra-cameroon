export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-lg border border-transparent bg-emerald-600 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 ease-in-out hover:bg-emerald-700 hover:shadow-emerald-600/40 hover:-translate-y-0.5 focus:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 active:bg-emerald-800 active:translate-y-0 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
