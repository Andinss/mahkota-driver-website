import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";

interface StarRatingProps {
  rating: number; // integer 1–5
}

export default function StarRating({ rating }: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i < rating);

  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={`Rating ${rating} dari 5`}
    >
      {stars.map((filled, i) => (
        <span
          key={i}
          className={`ms text-[20px] ${filled ? "text-gold" : "text-gray-600"}`}
        >
          <HugeiconsIcon icon={StarIcon} size="1em" />
        </span>
      ))}
    </div>
  );
}
