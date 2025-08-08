import { useSystem } from '../../system/SysTem.ts';
import Terminal from './Terminal.tsx';

const system = useSystem();

const appId = system.registerAppId();

system.registerApp({ id: appId, name: 'Terminal', icon: '/icons/terminal.png', main: Terminal });
