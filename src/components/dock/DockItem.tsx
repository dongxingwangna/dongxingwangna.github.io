import { defineComponent, ref } from 'vue';
import ToolTip from '../toolTip/ToolTip.tsx';

export interface DockItemProps {
    icon: string;
    label: string;
    link: string;
}

const DockItem = defineComponent<DockItemProps>(
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
            <ToolTip title={props.label}>
                <a
                    href={props.link}
                    class="flex flex-col items-center transition-transform duration-100 group"
                    onMousemove={onHover}
                    onMouseleave={resetScale}
                    style={{ transform: `scale( ${scale.value} )` }}
                >
                    <img src={props.icon} alt="icon" class="w-10 h-10" />
                </a>
            </ToolTip>
        );
    },
    {
        props: ['icon', 'label', 'link'],
    },
);

export default DockItem;
