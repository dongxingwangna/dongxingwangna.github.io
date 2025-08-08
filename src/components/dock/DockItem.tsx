import { defineComponent, ref } from 'vue';
import ToolTip from '../toolTip/ToolTip.tsx';
import type { AppCfg } from '../../system/type.ts';

export type DockItemEmit = {
    click: () => void;
};

const DockItem = defineComponent<Omit<AppCfg, 'main'>, DockItemEmit>(
    (props) => {
        const scale = ref(1);

        function onHover(e: MouseEvent) {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const center = rect.left + rect.width / 2;
            const dist = Math.abs(e.clientX - center);
            scale.value = 1.4 - Math.min(dist / 100, 0.4);
        }

        function resetScale() {
            scale.value = 1;
        }

        return () => (
            <ToolTip title={props.name}>
                <span
                    class="flex flex-col items-center transition-transform duration-100 group origin-bottom"
                    onMousemove={onHover}
                    onMouseleave={resetScale}
                    style={{ transform: `scale( ${scale.value} )` }}
                >
                    <img src={props.icon} alt="icon" class="w-10 h-10" />
                </span>
            </ToolTip>
        );
    },
    {
        props: ['icon', 'name'],
    },
);

export default DockItem;
