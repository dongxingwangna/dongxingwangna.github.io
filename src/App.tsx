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

    function closeApp(runId: string) {
        system.stopApp(runId);
    }

    return (
        <div class="bg-[url(/wallpaper/bg.png)] bg-no-repeat bg-cover h-full relative">
            <Dock />
            {map(runApp, (app) => (
                <Window key={app.id} title={app.name} onClose={() => closeApp(app.runId)}>
                    {h(appMap[app.name]['main'])}
                </Window>
            ))}
        </div>
    );
}
