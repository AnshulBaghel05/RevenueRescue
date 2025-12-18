import type { Issue } from '@/lib/audit/types';
import Badge from '../shared/Badge';
import { formatCurrency } from '@/lib/audit/utils';

interface IssueCardProps {
  issue: Issue;
}

export default function IssueCard({ issue }: IssueCardProps) {
  const getSeverityIcon = (severity: Issue['severity']): string => {
    switch (severity) {
      case 'critical':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
    }
  };

  const getSeverityVariant = (severity: Issue['severity']) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
    }
  };

  const getEffortBadgeVariant = (effort: Issue['effort']) => {
    switch (effort) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-primary/30 transition-colors">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <span className="text-3xl flex-shrink-0">{getSeverityIcon(issue.severity)}</span>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="text-xl font-bold text-white">{issue.title}</h3>
            <Badge variant={getSeverityVariant(issue.severity)} size="sm">
              {issue.severity}
            </Badge>
          </div>
          <p className="text-gray-400 mb-3">{issue.description}</p>
        </div>
      </div>

      {/* Impact */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4">
        <div className="text-sm text-gray-500 mb-1">Impact</div>
        <p className="text-gray-300">{issue.impact}</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">Revenue Impact</div>
          <div className="text-lg font-bold text-red-400">
            {formatCurrency(issue.revenueImpact)}/mo
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">Effort</div>
          <Badge variant={getEffortBadgeVariant(issue.effort)} size="sm">
            {issue.effort}
          </Badge>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">Time to Fix</div>
          <div className="text-sm text-gray-300">{issue.estimatedTimeToFix}</div>
        </div>
      </div>

      {/* Affected URLs */}
      {issue.affectedUrls && issue.affectedUrls.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-500 mb-2">Affected URLs</div>
          <ul className="space-y-1">
            {issue.affectedUrls.map((url, idx) => (
              <li key={idx} className="text-sm text-gray-400 font-mono truncate">
                {url}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
