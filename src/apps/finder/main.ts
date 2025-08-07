import { useSystem } from '../../system/SysTem.ts';

const system = useSystem();

system.registerApp({ name: 'Finder', icon: '/icons/finder.png', main: 'finder' });
