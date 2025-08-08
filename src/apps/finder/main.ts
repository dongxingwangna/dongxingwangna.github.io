import { useSystem } from '../../system/SysTem.ts';
import Finder from './Finder.tsx';

const system = useSystem();

const appId = system.registerAppId();

system.registerApp({ id: appId, name: 'Finder', icon: '/icons/finder.png', main: Finder });
