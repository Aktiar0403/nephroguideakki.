export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
    >
      {children}
    </button>
  );
}