import { useSystem } from '../../system/SysTem.ts';
import Music from './Music.tsx';

const system = useSystem();

system.registerApp({ name: 'Music', icon: '/icons/music.png', main: Music });
