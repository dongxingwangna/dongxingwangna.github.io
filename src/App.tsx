import Dock from './components/dock/Dock.tsx';
import { useSystem } from './system/SysTem.ts';
import { keyBy, map } from 'lodash-es';
import { h } from 'vue';
import Window from './components/window/Window.tsx';

await import('./apps/main.ts');

export function App() {
    const system = useSystem();
    const runApp = system.getRunApp();
    const apps = system.getApps();
    const appMap = keyBy(apps, 'name');
    console.log('wdx: App.tsx:14 ==> runApp-->', runApp);

    return (
        <div class="bg-[url(/wallpaper/bg.png)] bg-no-repeat bg-cover h-full relative">
            <Dock />
            {map(runApp, (appName) => (
                <Window title={appName}>{h(appMap[appName]['main'])}</Window>
            ))}
        </div>
    );
}
