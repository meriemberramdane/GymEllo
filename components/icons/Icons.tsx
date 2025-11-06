import React from 'react';

const Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  />
);

export const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></Icon>
);

export const DumbbellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 21 3-3"/><path d="m6 3-3 3"/><path d="m14 7 7-7"/><path d="m3 21 7-7"/></Icon>
);

export const FlameIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></Icon>
);

export const HeartPulseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></Icon>
);

export const TargetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></Icon>
);

export const DropletIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></Icon>
);

export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></Icon>
);

export const LeafIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M11 20A7 7 0 0 1 4 13V8a5 5 0 0 1 9-3 4.5 4.5 0 0 1 8 4.5c0 2.5-2 5.5-2 5.5s-1.5-2-2.5-4"/><path d="M12 13V3"/></Icon>
);

export const UtensilsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/></Icon>
);

export const BotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></Icon>
);

export const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></Icon>
);

export const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></Icon>
);

export const LoaderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></Icon>
);

export const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></Icon>
);

export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/></Icon>
);

export const CameraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></Icon>
);

export const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M20 6 9 17l-5-5"/></Icon>
);

export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M5 12h14"/><path d="M12 5v14"/></Icon>
);

export const BookOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></Icon>
);

export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="m6 9 6 6 6-6"/></Icon>
);