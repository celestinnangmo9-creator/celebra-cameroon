export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
