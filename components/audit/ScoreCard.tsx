import type { Grade } from '@/lib/audit/types';
import Badge from '../shared/Badge';

interface ScoreCardProps {
  title: string;
  score: number;
  grade: Grade;
  icon?: string;
  subtitle?: string;
}

export default function ScoreCard({ title, score, grade, icon, subtitle }: ScoreCardProps) {
  const getGradeColor = (grade: Grade): string => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-green-400';
      case 'B':
        return 'text-yellow-400';
      case 'C':
        return 'text-orange-400';
      case 'D':
      case 'F':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getProgressColor = (score: number): string => {
    if (score >= 80) return 'bg-green-400';
    if (score >= 60) return 'bg-yellow-400';
    if (score >= 40) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {icon && <span className="text-3xl">{icon}</span>}
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`text-4xl font-bold ${getGradeColor(grade)}`}>{grade}</div>
          <Badge
            variant={score >= 70 ? 'success' : score >= 50 ? 'warning' : 'error'}
            size="sm"
          >
            {score}/100
          </Badge>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full ${getProgressColor(score)} transition-all duration-1000`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
