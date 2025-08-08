import { useSystem } from '../../system/SysTem.ts';
import VSCode from './VsCode.tsx';

const system = useSystem();

const appId = system.registerAppId();

system.registerApp({ id: appId, name: 'VSCode', icon: '/icons/vscode.png', main: VSCode });
