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
                        class="flex items-center gap-3 px-3 py-2 cursor-move bg-gradient-to-b from-white/60 to-white/30"
                        onPointerdown={(e) => startDrag(e)}
                    >
                        {/* mac 红黄绿 按钮 */}
                        <div class="flex gap-2">
                            <span
                                class="w-3.5 h-3.5 rounded-full shadow-inner bg-[#ff5f57] cursor-pointer"
                                title="close"
                                onClick={withModifiers(close, ['stop'])}
                            />
                            <span
                                class="w-3.5 h-3.5 rounded-full shadow-inner bg-[#febc2e] cursor-pointer"
                                title="minimize"
                                onClick={withModifiers(minimize, ['stop'])}
                            />
                            <span
                                class="w-3.5 h-3.5 rounded-full shadow-inner bg-[#28c840] cursor-pointer"
                                title="maximize"
                                onClick={withModifiers(toggleMax, ['stop'])}
                            />
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
                    <div
                        class={[props.contentClass, 'bg-white p-4 h-full overflow-auto'].join(' ')}
                    >
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
