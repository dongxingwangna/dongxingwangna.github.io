import { defineComponent, ref } from 'vue';
import DockItem from './DockItem.tsx';
import { map } from 'lodash-es';
import { useSystem } from '../../system/SysTem.ts';
import type { AppCfg } from '../../system/type.ts';

const Dock = defineComponent(() => {
    const dockItems = ref<AppCfg[]>([]);
    const system = useSystem();

    dockItems.value = system.getApps();

    function runApp(item: AppCfg) {
        system.runApp(item);
    }

    return () => (
        <div class="fixed bottom-4 w-full flex justify-center pointer-events-none">
            <div
                class="flex bg-white/20 px-4 py-2 rounded-2xl shadow-xl space-x-4 pointer-events-auto"
                style={{
                    backdropFilter: 'blur(2px)',
                }}
            >
                {map(dockItems.value, (item) => (
                    <DockItem
                        id={item.id}
                        key={item.name}
                        icon={item.icon}
                        name={item.name}
                        onClick={() => runApp(item)}
                    />
                ))}
            </div>
        </div>
    );
});

export default Dock;
