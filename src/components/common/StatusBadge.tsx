import React from 'react';
import { ProjectStatus, TaskPriority, OrderStatus } from '../../types';
import { getProjectStatusConfig, getPriorityConfig, getOrderStatusConfig } from '../../utils/formatters';

interface StatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const config = getProjectStatusConfig(status);
  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border whitespace-nowrap shrink-0 ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <span>{config.label}</span>
    </span>
  );
};

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const config = getPriorityConfig(priority);

  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded border whitespace-nowrap shrink-0 ${config.badge}`}
    >
      {config.label}
    </span>
  );
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const config = getOrderStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border whitespace-nowrap shrink-0 ${config.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
