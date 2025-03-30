export function Button({ children, onClick, className = "", disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition disabled:bg-gray-400 ${className}`}
        >
            {children}
        </button>
    );
}
