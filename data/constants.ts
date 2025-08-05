import {
    Home,
    FileText,
    Megaphone,
    CheckSquare,
    List,
    Settings,
    HelpCircle,
    Building2,
    Tags,
    ClipboardList,
    MessageSquare,
    Dumbbell,
} from 'lucide-react';

export const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Building2, label: 'Societies', active: false },
    { icon: Megaphone, label: 'Announcements', active: false },
    { icon: Tags, label: 'Tags', active: false },
    { icon: CheckSquare, label: 'Tasks', active: false },
    { icon: FileText, label: 'Reports', active: false },
    { icon: ClipboardList, label: 'Documents', active: false },
    { icon: Dumbbell, label: 'Connect', active: false },
    { icon: List, label: 'Lists', active: false },
    { icon: MessageSquare, label: 'Messages', active: false },
    { icon: Settings, label: 'Settings', active: false },
    { icon: HelpCircle, label: 'Help', active: false },
];

export const esButtonColors = [
    'bg-gradient-to-br from-blue-500 via-blue-500 70% to-purple-600',
    'bg-gradient-to-br from-red-500 via-red-500 70% to-orange-600',
    'bg-gradient-to-br from-orange-500 via-orange-500 70% to-yellow-600',
    'bg-gradient-to-br from-blue-500 via-blue-500 70% to-purple-600',
    'bg-purple-500'
];