import React from "react";

interface GameCardProps {
  imageUrl?: string;
  title?: string;
  tags?: string[];
  profileName?: string;
  rating?: number;
}

const GameCard: React.FC<GameCardProps> = ({
  imageUrl,
  title,
  tags = [],
  profileName,
  rating,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image section */}
      <div className="h-48 w-full">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title || "Game image"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-pink-300"></div>
        )}
      </div>

      {/* Content section */}
      <div className="p-4">
        {/* Title */}
        {title && (
          <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
            {title}
          </h3>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Rating and Profile */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          {rating !== undefined && (
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              <span>{rating}</span>
            </div>
          )}

          {profileName && (
            <span className="text-gray-500 truncate">{profileName}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCard;