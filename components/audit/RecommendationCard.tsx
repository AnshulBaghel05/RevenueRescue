import type { Recommendation } from '@/lib/audit/types';
import Badge from '../shared/Badge';
import { formatCurrency } from '@/lib/audit/utils';

interface RecommendationCardProps {
  recommendation: Recommendation;
  rank?: number;
}

export default function RecommendationCard({ recommendation, rank }: RecommendationCardProps) {
  const getImpactIcon = (impact: Recommendation['impact']): string => {
    switch (impact) {
      case 'critical':
        return '🚨';
      case 'high':
        return '⚡';
      case 'medium':
        return '💡';
      case 'low':
        return '✨';
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-primary/30 transition-colors">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {rank && (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
            {rank}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getImpactIcon(recommendation.impact)}</span>
              <h3 className="text-xl font-bold text-white">{recommendation.title}</h3>
            </div>
            {recommendation.isInstantWin && (
              <Badge variant="success" size="sm">
                ⚡ Quick Win
              </Badge>
            )}
          </div>
          <p className="text-gray-400">{recommendation.description}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Potential Lift</div>
          <div className="text-lg font-bold text-green-400">
            {formatCurrency(recommendation.estimatedRevenueLift)}/mo
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Impact</div>
          <div className="text-sm font-semibold text-white capitalize">
            {recommendation.impact}
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Effort</div>
          <div className="text-sm font-semibold text-white capitalize">
            {recommendation.effort}
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="mb-4">
        <div className="text-sm font-semibold text-white mb-3">Action Steps:</div>
        <ol className="space-y-2">
          {recommendation.steps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </span>
              <span className="text-gray-300 text-sm flex-1">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Resources */}
      {recommendation.resources && recommendation.resources.length > 0 && (
        <div className="pt-4 border-t border-gray-700">
          <div className="text-sm font-semibold text-white mb-2">Helpful Resources:</div>
          <div className="flex flex-wrap gap-2">
            {recommendation.resources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 border border-primary/30 rounded-lg text-sm text-primary hover:bg-primary/20 transition-colors"
              >
                {resource.title}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
