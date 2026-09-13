import { motion } from "framer-motion";
import { FiTrendingUp } from "react-icons/fi";

function ProgressCard({
  completed = 0,
  total = 0,
  percentage = 0,
}) {
  const safePercentage = Math.min(
    100,
    Math.max(0, percentage)
  );

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Daily progress
          </p>

          <h2 className="mt-2 text-3xl font-semibold text-gray-900">
            {safePercentage}%
          </h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
          <FiTrendingUp size={19} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-gray-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safePercentage}%` }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="h-full rounded-full bg-[#3f8f5f]"
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
        <span>
          {completed} of {total} completed
        </span>

        {safePercentage === 100 && total > 0 ? (
          <span className="font-medium text-green-600">
            All done 🎉
          </span>
        ) : (
          <span>
            {total - completed} remaining
          </span>
        )}
      </div>
    </div>
  );
}

export default ProgressCard;