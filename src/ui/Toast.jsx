export default function Toast({ message, type = 'info', visible = true }) {
  if (!visible) return null;

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  }[type] || 'bg-blue-500';

  return (
    <div
      className={`fixed bottom-6 left-6 ${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl animate-in`}
    >
      {message}
    </div>
  );
}

