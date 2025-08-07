import Dock from './components/dock/Dock.tsx';
await import('./apps/main.ts');
export function App() {
    return (
        <div class="bg-[url(/wallpaper/bg.png)] bg-no-repeat bg-cover h-full">
            <Dock />
        </div>
    );
}
