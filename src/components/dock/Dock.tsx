import { defineComponent } from 'vue';
import DockItem from './DockItem.tsx';

const Dock = defineComponent(() => {
    const dockItems = [
        { name: 'Finder', icon: '/icons/finder.png', link: '#' },
        { name: 'Safari', icon: '/icons/safari.png', link: '#' },
        { name: 'VSCode', icon: '/icons/vscode.png', link: '#' },
        { name: 'Terminal', icon: '/icons/terminal.png', link: '#' },
        { name: 'Music', icon: '/icons/music.png', link: '#' },
    ];

    return () => (
        <div class="fixed bottom-4 w-full flex justify-center pointer-events-none">
            <div
                class="flex bg-white/20 px-4 py-2 rounded-2xl shadow-xl space-x-4 pointer-events-auto"
                style={{
                    backdropFilter: 'blur(2px)',
                }}
            >
                {dockItems.map((item) => (
                    <DockItem key={item.name} icon={item.icon} link={item.link} label={item.name} />
                ))}
            </div>
        </div>
    );
});

export default Dock;
