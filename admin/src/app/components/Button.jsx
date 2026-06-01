function Button({ clickFnc, text, is_main }) {
    return (
        <button
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold ${is_main ? "is_main" : ""}`}
            onClick={clickFnc}
        >
            {text}
        </button>
    );
}

export default Button;
