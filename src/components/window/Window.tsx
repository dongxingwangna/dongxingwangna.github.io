import { defineComponent, onBeforeUnmount, onMounted, reactive, ref, withModifiers } from 'vue';

const Window = defineComponent({
    name: 'Window',
    props: {
        title: { type: String, default: 'Untitled' },
        initialX: { type: Number, default: 100 },
        initialY: { type: Number, default: 80 },
        initialWidth: { type: Number, default: 720 },
        initialHeight: { type: Number, default: 460 },
        minWidth: { type: Number, default: 320 },
        minHeight: { type: Number, default: 120 },
        resizable: { type: Boolean, default: true },
        contentClass: { type: String, default: '' },
    },
    emits: ['close', 'minimize', 'maximize'],
    setup(props, { slots, emit }) {
        /** state */
        const pos = reactive({ x: props.initialX, y: props.initialY });
        const width = ref(props.initialWidth);
        const height = ref(props.initialHeight);
        const dragging = ref(false);
        const resizing = ref(false);
        const start = reactive({ x: 0, y: 0, w: 0, h: 0 });
        const z = ref(10);
        const win = ref<HTMLElement | null>(null);

        function startDrag(e: PointerEvent) {
            dragging.value = true;
            start.x = e.clientX - pos.x;
            start.y = e.clientY - pos.y;
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            bringToFront();
        }

        function onPointerMove(e: PointerEvent) {
            if (dragging.value) {
                pos.x = e.clientX - start.x;
                pos.y = e.clientY - start.y;
            }
            if (resizing.value) {
                const nw = start.w + (e.clientX - start.x);
                const nh = start.h + (e.clientY - start.y);
                width.value = Math.max(props.minWidth, nw);
                height.value = Math.max(props.minHeight, nh);
            }
        }

        function onPointerUp() {
            dragging.value = false;
            resizing.value = false;
        }

        function startResize(e: PointerEvent) {
            resizing.value = true;
            start.x = e.clientX;
            start.y = e.clientY;
            start.w = width.value;
            start.h = height.value;
            bringToFront();
        }

        /** window actions */
        function close() {
            emit('close');
        }
        function minimize() {
            emit('minimize');
        }
        function toggleMax() {
            if (width.value < window.innerWidth - 20) {
                pos.x = 10;
                pos.y = 10;
                width.value = window.innerWidth - 20;
                height.value = window.innerHeight - 20;
            } else {
                width.value = props.initialWidth;
                height.value = props.initialHeight;
                pos.x = props.initialX;
                pos.y = props.initialY;
            }
            emit('maximize');
        }
        function bringToFront() {
            z.value = Date.now() % 100000;
        }

        onMounted(() => {
            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onPointerUp);
        });
        onBeforeUnmount(() => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        });

        return () => (
            <div
                ref={win}
                style={{
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    width: `${width.value}px`,
                    height: `${height.value}px`,
                    zIndex: z.value,
                }}
                class="fixed"
            >
                <div class="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl overflow-hidden select-none h-full relative">
                    {/* 标题栏 */}
                    <div
                        class="flex items-center gap-3 px-3 py-2 bg-gradient-to-b from-white/60 to-white/30"
                        onPointerdown={(e) => startDrag(e)}
                    >
                        {/* mac 红黄绿按钮 */}
                        <div class="flex gap-2 group">
                            {/* 关闭按钮 */}
                            <span
                                class=" relative w-3.5 h-3.5 rounded-full shadow-inner bg-[#ff5f57]"
                                title="close"
                                onClick={withModifiers(close, ['stop'])}
                            >
                                <span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                    <svg viewBox="0 0 8 8" class="w-[8px] h-[8px]">
                                        <path
                                            d="M1 1 L7 7 M7 1 L1 7"
                                            stroke="black"
                                            stroke-width="1.2"
                                            stroke-linecap="round"
                                        />
                                    </svg>
                                </span>
                            </span>

                            {/* 最小化按钮 */}
                            <span
                                class="relative w-3.5 h-3.5 rounded-full shadow-inner bg-[#febc2e]"
                                title="minimize"
                                onClick={withModifiers(minimize, ['stop'])}
                            >
                                <span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                    <svg viewBox="0 0 8 8" class="w-[8px] h-[8px]">
                                        <path
                                            d="M0 4 L8 4"
                                            stroke="black"
                                            stroke-width="1"
                                            stroke-linecap="round"
                                        />
                                    </svg>
                                </span>
                            </span>

                            {/* 最大化按钮 */}
                            <span
                                class="relative w-3.5 h-3.5 rounded-full shadow-inner bg-[#28c840]"
                                title="maximize"
                                onClick={withModifiers(toggleMax, ['stop'])}
                            >
                                <span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                    <svg viewBox="0 0 1024 1024" class="w-[1024px] h-[1024px]">
                                        <path
                                            d="M672 704a32 32 0 0 0 32-32L704 493.248a32 32 0 0 0-54.656-22.59200001l-178.68800001 178.68800001A32 32 0 0 0 493.248 704L672 704z m-320-384a32 32 0 0 0-32 32l0 178.752a32 32 0 0 0 54.656 22.59200001L553.34400001 374.656A32 32 0 0 0 530.752 320L352 320z"
                                            fill="#525366"
                                            p-id="78790"
                                        ></path>
                                    </svg>
                                </span>
                            </span>
                        </div>

                        {/* 标题 */}
                        <div class="flex-1 text-center text-sm font-medium text-gray-700 truncate px-2">
                            {slots.title?.() ?? props.title}
                        </div>

                        {/* 右侧控件 */}
                        <div class="w-10 flex justify-end items-center pr-1">
                            {slots.controls?.()}
                        </div>
                    </div>

                    {/* 内容区 */}
                    <div class={[props.contentClass, 'bg-white h-full overflow-auto'].join(' ')}>
                        {slots.default?.()}
                    </div>

                    {/* 可缩放把手 */}
                    {props.resizable && (
                        <div
                            class="absolute right-1 bottom-1 w-3 h-3 cursor-se-resize"
                            onPointerdown={(e) => startResize(e)}
                        >
                            <svg class="opacity-50" height="10" viewBox="0 0 24 24" width="10">
                                <path
                                    d="M21 21L14 14"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-width="1.5"
                                />
                                <path
                                    d="M18 21L21 18"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-width="1.5"
                                />
                            </svg>
                        </div>
                    )}
                </div>
            </div>
        );
    },
});

export default Window;
