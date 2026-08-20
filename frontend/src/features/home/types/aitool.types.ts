export interface AitoolItem {
  title: string;
  description: string;
  iconName: 'auto_awesome' | 'quiz' | 'work_history' | 'chat_bubble' | 'calendar_today' | 'rate_review';
  colorTheme: 'secondary' | 'tertiary';
}

export interface AitoolCardProps {
  tool: AitoolItem;
}

export interface AitoolIconProps {
  name: AitoolItem['iconName'];
  themeColor: AitoolItem['colorTheme'];
}
