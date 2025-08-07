import { useSystem } from '../../system/SysTem.ts';

const system = useSystem();

system.registerApp({ name: 'VSCode', icon: '/icons/vscode.png', main: '#' });
