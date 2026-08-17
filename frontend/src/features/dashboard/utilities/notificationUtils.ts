export function getNotificationCardStyles(isUnread: boolean, isDeadline: boolean): string {
  if (isUnread) {
    return isDeadline ? 'bg-[#160D12] border-[#EF4444]/40' : 'bg-[#090D16] border-[#38BDF8]/30';
  }
  return 'bg-[#090D16]/60 border-[#1E293B] opacity-75';
}

export function getNotificationIconStyles(type: string): string {
  if (type === 'deadline_reminder') {
    return 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30';
  }
  if (type === 'graded') {
    return 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30';
  }
  return 'bg-[#8B5CF6]/20 text-[#C4B5FD] border-[#8B5CF6]/30';
}
