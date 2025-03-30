export function Progress({ value }) {
    return (
        <div className="relative w-full h-2 bg-gray-200 rounded">
            <div
                className="absolute top-0 left-0 h-2 bg-blue-500 rounded transition-all"
                style={{ width: `${value}%` }}
            ></div>
        </div>
    );
}
