import { useSystem } from '../../system/SysTem.ts';

const system = useSystem();

system.registerApp({ name: 'Safari', icon: '/icons/safari.png', main: '#' });
