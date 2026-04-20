import type { CakeResDto } from '../../../resDtos/cakeResDto';

export const CakeCard = ({ cake }: { cake: CakeResDto }) => {
  return (
    <div className="group bg-white/80 backdrop-blur rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={cake.imageUrl}
          alt={cake.name}
          className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent opacity-70" />

        {/* Yum badge */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-medium shadow">
          🤤 {cake.yumFactor}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h2 className="font-medium text-sm text-gray-900">{cake.name}</h2>

        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
          {cake.comment}
        </p>

        {/* Actions */}
        <div className="flex justify-end items-center mt-3 gap-3">
          <button className="text-xs text-blue-500 hover:text-blue-600 transition">
            View
          </button>

          <button className="text-xs text-blue-500 hover:text-blue-600 transition">
            Edit
          </button>

          <button className="text-xs text-red-500 hover:text-red-600 transition">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
