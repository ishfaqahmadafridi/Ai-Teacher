export function getNotificationCardStyles(isUnread: boolean, isDeadline: boolean): string {
  if (isUnread) {
    return isDeadline ? 'bg-dashboard-danger/5 border-dashboard-danger/40' : 'bg-dashboard-panel border-dashboard-primary/30';
  }
  return 'bg-dashboard-panel/60 border-dashboard-border opacity-75';
}

export function getNotificationIconStyles(type: string): string {
  if (type === 'deadline_reminder') {
    return 'bg-dashboard-danger/20 text-dashboard-danger border-dashboard-danger/30';
  }
  if (type === 'graded') {
    return 'bg-dashboard-success/20 text-dashboard-success border-dashboard-success/30';
  }
  return 'bg-dashboard-primary/20 text-dashboard-primary border-dashboard-primary/30';
}
