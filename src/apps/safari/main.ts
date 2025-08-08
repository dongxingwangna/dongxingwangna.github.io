import { useSystem } from '../../system/SysTem.ts';
import Safari from './Safari.tsx';

const system = useSystem();

const appId = system.registerAppId();

system.registerApp({ id: appId, name: 'Safari', icon: '/icons/safari.png', main: Safari });
