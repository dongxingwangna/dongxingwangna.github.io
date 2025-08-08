import Dock from './components/dock/Dock.tsx';
import Window from './components/window/Window.tsx';

await import('./apps/main.ts');

export function App() {
    return (
        <div class="bg-[url(/wallpaper/bg.png)] bg-no-repeat bg-cover h-full relative">
            <Dock />
            <Window title="音乐" />
        </div>
    );
}
