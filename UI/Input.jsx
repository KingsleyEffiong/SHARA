import React from 'react'

function Input({ type, placeholder, onChange, name }) {
    return (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
    )
}

export default Input