import { IconifyIconProps } from "@iconify/react/dist/iconify.js"

export const pricingCards = [
    {
        title: 'Starter',
        description: 'Perfect for trying out the platform',
        price: 'Free',
        duration: '',
        highlight: 'Key features',
        features: [
            '3 Sub accounts',
            '2 Team members',
            'Unlimited pipelines'
        ],
        priceId: '',
    },
    {
        title: 'Unlimited SAAS',
        description: 'The ultimate agency kit',
        price: '$199',
        duration: 'month',
        highlight: 'Key features',
        features: [
            'Rebilling',
            '24/7 Support team',
        ],
        priceId: '',
    },
    {
        title: 'Basic',
        description: 'For serious agency owners',
        price: '$49',
        duration: 'month',
        highlight: 'Key features',
        features: [
            'Unlimited Sub accounts',
            'Unlimited Team members',
        ],
        priceId: '',
    }
]

export type Icon = {
    value: string,
    label: string,
    icon: IconifyIconProps["icon"]
}

export const icons: Record<string, Icon> = {
    settings: { value: 'settings', label: 'Settings', icon: 'material-symbols:settings' },
    chart: { value: 'chart', label: 'Chart', icon: 'material-symbols:insert-chart-rounded' },
    calendar: { value: 'calendar', label: 'Calendar', icon: 'material-symbols:calendar-month' },
    check: { value: 'check', label: 'Check', icon: 'material-symbols:bookmark-check-rounded' },
    chip: { value: 'chip', label: 'Chip', icon: 'material-symbols:poker-chip-rounded' },
    compass: { value: 'compass', label: 'Compass', icon: 'material-symbols:compass-calibration' },
    database: { value: 'database', label: 'Database', icon: 'material-symbols:database-search-rounded' },
    flag: { value: 'flag', label: 'Flag', icon: 'material-symbols:flag-2-rounded' },
    home: { value: 'home', label: 'Home', icon: 'material-symbols:home-rounded' },
    info: { value: 'info', label: 'Info', icon: 'material-symbols:info-rounded' },
    link: { value: 'link', label: 'Link', icon: 'material-symbols:link-rounded' },
    lock: { value: 'lock', label: 'Lock', icon: 'material-symbols:lock-open-rounded' },
    messages: { value: 'messages', label: 'Messages', icon: 'material-symbols:business-messages-rounded' },
    notification: { value: 'notification', label: 'Notification', icon: 'material-symbols:circle-notifications-rounded' },
    payment: { value: 'payment', label: 'Payment', icon: 'material-symbols:payments-rounded' },
    power: { value: 'power', label: 'Power', icon: 'material-symbols:power-settings-circle-rounded' },
    receipt: { value: 'receipt', label: 'Receipt', icon: 'material-symbols:receipt-long-rounded' },
    shield: { value: 'shield', label: 'Shield', icon: 'material-symbols:shield' },
    star: { value: 'star', label: 'Star', icon: 'material-symbols:star-rounded' },
    tune: { value: 'tune', label: 'Tune', icon: 'material-symbols:tune-rounded' },
    videorecorder: { value: 'videorecorder', label: 'Videorecorder', icon: 'videorecorder' },
    wallet: { value: 'wallet', label: 'Wallet', icon: 'material-symbols:wallet' },
    warning: { value: 'warning', label: 'Warning', icon: 'material-symbols:warning-rounded' },
    headphone: { value: 'headphone', label: 'Headphone', icon: 'material-symbols:headphones-rounded' },
    send: { value: 'send', label: 'Send', icon: 'material-symbols:send-rounded' },
    pipelines: { value: 'pipelines', label: 'Pipelines', icon: 'material-symbols:cable' },
    person: { value: 'person', label: 'Person', icon: 'material-symbols:person' },
    category: { value: 'category', label: 'Category', icon: 'material-symbols:category-rounded' },
    contact: { value: 'contact', label: 'Contact', icon: 'material-symbols:contact-page-rounded' },
    clipboard: { value: 'clipboardIcon', label: 'ClipboardIcon', icon: 'material-symbols:dashboard-customize-rounded' },
}