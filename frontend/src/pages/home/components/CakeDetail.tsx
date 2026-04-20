import { Button } from '../../../components/form/Button';
import type { CakeResDto } from '../../../resDtos/cakeResDto';

export const CakeDetail = ({
  cake,
  onDelete,
  onClose,
}: {
  cake: CakeResDto;
  onDelete: (cake: CakeResDto) => void;
  onClose: () => void;
}) => {
  return (
    <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
      {/* Image */}
      <div className="relative">
        <img
          src={cake.imageUrl}
          alt={cake.name}
          className="w-full h-56 object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent" />

        {/* Yum badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-medium shadow">
          🤤 {cake.yumFactor}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div>
          <h2 className="text-sm font-medium text-gray-900">{cake.name}</h2>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between">
          <span className="bg-black text-white text-sm px-2 py-1 rounded-lg">
            {cake.yumFactor}/10
          </span>
          <span className="text-xs text-gray-400">Yum factor</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Comment */}
        <div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {cake.comment}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            className="flex-1"
            onClick={() => onDelete(cake)}
            type="button"
          >
            Delete
          </Button>

          <Button
            className="flex-1"
            theme="secondary"
            onClick={onClose}
            type="button"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
