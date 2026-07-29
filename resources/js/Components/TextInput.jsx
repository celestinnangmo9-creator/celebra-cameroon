import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 focus:border-emerald-500 focus:ring-emerald-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400 ' +
                className
            }
            ref={localRef}
        />
    );
});
