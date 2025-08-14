import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue';

interface LyricLine {
    time: number; // 单位秒，歌词时间戳
    text: string;
}

interface Track {
    title: string;
    artist: string;
    src: string;
    cover: string;
    lyrics: LyricLine[]; // 带时间戳歌词
}

// 示例带时间戳歌词，时间戳单位秒
const tracks: Track[] = [
    {
        title: '光辉岁月',
        artist: 'Beyond',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        cover: 'https://picsum.photos/id/237/400/400',
        lyrics: [
            { time: 0, text: '风雨中抱紧自由' },
            { time: 3, text: '不放弃理想和执着' },
            { time: 6, text: '风雨中抱紧自由' },
            { time: 9, text: '不放弃理想和执着' },
            { time: 12, text: '守护心中的梦' },
            { time: 15, text: '为你点亮未来的路' },
            { time: 18, text: '光辉岁月，永远不会消逝' },
            { time: 21, text: '在我们心中永远鲜活' },
        ],
    },
    {
        title: '喜欢你',
        artist: 'Beyond',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        cover: 'https://picsum.photos/id/238/400/400',
        lyrics: [
            { time: 0, text: '我多么羡慕你' },
            { time: 3, text: '你拥有那片蓝天' },
            { time: 6, text: '我要抓紧时间' },
            { time: 9, text: '唱出我的心声' },
            { time: 12, text: '喜欢你，喜欢你' },
            { time: 15, text: '喜欢你，就是喜欢你' },
        ],
    },
    {
        title: '海阔天空',
        artist: 'Beyond',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        cover: 'https://picsum.photos/id/239/400/400',
        lyrics: [
            { time: 0, text: '今天我 寒夜里看雪飘过' },
            { time: 4, text: '怀着冷却了的心窝漂远方' },
            { time: 8, text: '风雨里追赶' },
            { time: 12, text: '雾里分不清影踪' },
            { time: 16, text: '天空海阔你与我' },
        ],
    },
];

const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === Infinity) return '00:00';
    const m = Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0');
    const s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, '0');
    return `${m}:${s}`;
};

const Music = defineComponent(() => {
    const audioRef = ref<HTMLAudioElement | null>(null);
    const currentTrackIndex = ref(0);
    const isPlaying = ref(false);
    const progress = ref(0);
    const duration = ref(0);
    const currentTime = ref(0);
    const volume = ref(0.7);
    const isMuted = ref(false);
    const currentLyricLine = ref(0);
    const lyricContainerRef = ref<HTMLDivElement | null>(null);

    const currentTrack = computed(() => tracks[currentTrackIndex.value]);

    // 播放/暂停控制
    function togglePlay() {
        if (!audioRef.value) return;
        if (audioRef.value.paused) {
            audioRef.value.play();
            isPlaying.value = true;
        } else {
            audioRef.value.pause();
            isPlaying.value = false;
        }
    }

    // 上一首
    function prevTrack() {
        currentTrackIndex.value = (currentTrackIndex.value - 1 + tracks.length) % tracks.length;
    }

    // 下一首
    function nextTrack() {
        currentTrackIndex.value = (currentTrackIndex.value + 1) % tracks.length;
    }

    // 加载当前曲目
    function loadTrack() {
        if (!audioRef.value) return;
        isPlaying.value = false;
        progress.value = 0;
        currentTime.value = 0;
        duration.value = 0;
        currentLyricLine.value = 0;
        audioRef.value.src = currentTrack.value.src;
        audioRef.value.load();
        audioRef.value
            .play()
            .then(() => {
                isPlaying.value = true;
            })
            .catch(() => {
                isPlaying.value = false;
            });
    }

    // 播放进度更新
    function onTimeUpdate() {
        if (!audioRef.value) return;
        currentTime.value = audioRef.value.currentTime;
        duration.value = audioRef.value.duration || 0;
        progress.value = duration.value ? (currentTime.value / duration.value) * 100 : 0;

        // 歌词同步，找出当前时间对应的歌词行
        for (let i = currentTrack.value.lyrics.length - 1; i >= 0; i--) {
            if (currentTime.value >= currentTrack.value.lyrics[i].time) {
                if (currentLyricLine.value !== i) {
                    currentLyricLine.value = i;
                    nextTick(() => {
                        if (lyricContainerRef.value) {
                            const lineEl = lyricContainerRef.value.children[
                                currentLyricLine.value
                            ] as HTMLElement;
                            if (lineEl) {
                                lineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                        }
                    });
                }
                break;
            }
        }
    }

    // 进度条拖动
    function onProgressChange(e: Event) {
        if (!audioRef.value) return;
        const target = e.target as HTMLInputElement;
        const val = Number(target.value);
        progress.value = val;
        audioRef.value.currentTime = (val / 100) * duration.value;
    }

    // 音量调整
    function onVolumeChange(e: Event) {
        if (!audioRef.value) return;
        const target = e.target as HTMLInputElement;
        const val = Number(target.value);
        volume.value = val;
        audioRef.value.volume = val;
        isMuted.value = val === 0;
    }

    // 静音切换
    function toggleMute() {
        if (!audioRef.value) return;
        if (isMuted.value) {
            audioRef.value.volume = volume.value || 0.7;
            isMuted.value = false;
        } else {
            audioRef.value.volume = 0;
            isMuted.value = true;
        }
    }

    // 播放结束自动下一首
    function onEnded() {
        nextTrack();
    }

    watch(currentTrackIndex, () => {
        loadTrack();
    });

    onMounted(() => {
        if (audioRef.value) {
            audioRef.value.volume = volume.value;
            loadTrack();
        }
    });

    return () => (
        <div class="w-full h-full flex select-none overflow-hidden bg-gray-900 rounded-lg shadow-lg">
            <audio
                ref={audioRef}
                onTimeupdate={onTimeUpdate}
                onEnded={onEnded}
                preload="metadata"
            />

            {/* 左侧: 专辑封面+歌词 */}
            <div class="w-2/5 bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 p-6 flex flex-col overflow-hidden">
                <img
                    src={currentTrack.value.cover}
                    alt={currentTrack.value.title}
                    class="w-full rounded-lg shadow-xl mb-6 object-cover select-none flex-shrink-0"
                    draggable={false}
                    style={{ aspectRatio: '1 / 1' }}
                />
                <div
                    ref={lyricContainerRef}
                    class="flex-auto overflow-y-auto text-gray-300 text-sm leading-7"
                >
                    {currentTrack.value.lyrics.map((line, i) => (
                        <p
                            key={i}
                            class={`transition-colors duration-300 ${
                                i === currentLyricLine.value
                                    ? 'text-white font-semibold'
                                    : 'text-gray-400'
                            }`}
                        >
                            {line.text}
                        </p>
                    ))}
                </div>
            </div>

            {/* 右侧: 播放列表+控制区 */}
            <div class="w-3/5 flex flex-col p-6 bg-gray-800 overflow-hidden">
                {/* 播放列表 */}
                <div class="flex-1 overflow-y-auto mb-6">
                    <h3 class="text-white text-lg font-semibold mb-4">播放列表</h3>
                    <ul>
                        {tracks.map((track, i) => (
                            <li
                                key={track.src}
                                class={`flex items-center p-2 mb-2 rounded cursor-pointer ${
                                    i === currentTrackIndex.value
                                        ? 'bg-purple-700 shadow-md'
                                        : 'hover:bg-gray-700'
                                }`}
                                onClick={() => {
                                    if (i !== currentTrackIndex.value) currentTrackIndex.value = i;
                                }}
                            >
                                <img
                                    src={track.cover}
                                    alt={track.title}
                                    class="w-12 h-12 rounded object-cover mr-4 select-none flex-shrink-0"
                                    draggable={false}
                                />
                                <div class="flex-1 overflow-hidden">
                                    <div
                                        class="truncate font-semibold text-white"
                                        title={track.title}
                                    >
                                        {track.title}
                                    </div>
                                    <div
                                        class="truncate text-sm text-gray-400"
                                        title={track.artist}
                                    >
                                        {track.artist}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 控制区 */}
                <div class="flex flex-col">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex space-x-6 text-white text-3xl">
                            <button
                                onClick={prevTrack}
                                aria-label="上一首"
                                class="hover:text-purple-400 transition select-none"
                                title="上一首"
                            >
                                &#9664;&#9664;
                            </button>
                            <button
                                onClick={togglePlay}
                                aria-label={isPlaying.value ? '暂停' : '播放'}
                                class="w-14 h-14 flex items-center justify-center bg-purple-600 hover:bg-purple-700 rounded-full shadow-lg transition select-none"
                                title={isPlaying.value ? '暂停' : '播放'}
                            >
                                {isPlaying.value ? '❚❚' : '▶'}
                            </button>
                            <button
                                onClick={nextTrack}
                                aria-label="下一首"
                                class="hover:text-purple-400 transition select-none"
                                title="下一首"
                            >
                                &#9654;&#9654;
                            </button>
                        </div>

                        {/* 音量控制 */}
                        <div class="flex items-center space-x-3 w-48 text-white select-none">
                            <button
                                onClick={toggleMute}
                                aria-label={isMuted.value ? '取消静音' : '静音'}
                                class="hover:text-purple-400 transition"
                                title={isMuted.value ? '取消静音' : '静音'}
                            >
                                {isMuted.value ? '🔇' : '🔊'}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume.value}
                                onInput={onVolumeChange}
                                class="flex-1 h-1 rounded bg-purple-700 cursor-pointer appearance-none"
                            />
                        </div>
                    </div>

                    {/* 进度条 */}
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="0.1"
                        value={progress.value}
                        onInput={onProgressChange}
                        class="w-full h-1 rounded bg-purple-700 cursor-pointer appearance-none"
                        style={{
                            background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${progress.value}%, #4c1d95 ${progress.value}%, #4c1d95 100%)`,
                        }}
                    />
                    <div class="flex justify-between text-xs text-purple-300 mt-1 select-none">
                        <span>{formatTime(currentTime.value)}</span>
                        <span>{formatTime(duration.value)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Music;
