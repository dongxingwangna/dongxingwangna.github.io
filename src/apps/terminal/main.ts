import { useSystem } from '../../system/SysTem.ts';

const system = useSystem();

system.registerApp({ name: 'Terminal', icon: '/icons/terminal.png', main: '#' });
