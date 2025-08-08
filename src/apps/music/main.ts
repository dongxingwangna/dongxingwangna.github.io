import { useSystem } from '../../system/SysTem.ts';
import Music from './Music.tsx';

const system = useSystem();

const appId = system.registerAppId();

system.registerApp({ id: appId, name: 'Music', icon: '/icons/music.png', main: Music });
