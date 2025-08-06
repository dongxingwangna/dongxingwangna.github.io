import type { FunctionalComponent } from 'vue';

const ToolTip: FunctionalComponent<{ title: string }> = (
    props,
    { slots }: { slots: { [key: string]: any } },
) => {
    return (
        <div class="group relative">
            {slots.default?.()}
            <span class="absolute bottom-full left-1/2 mb-2 w-max -translate-x-1/2 px-3 py-1.5 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                {props.title}
            </span>
        </div>
    );
};

export default ToolTip;
