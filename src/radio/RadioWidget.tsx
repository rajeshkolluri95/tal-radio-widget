"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import {
    ref,
    onValue,
    off,
    get,
    remove,
    DatabaseReference,
} from "firebase/database";
import { useFirebaseServices } from "../firebaseConfig";

import Music from "./assets/music.svg";
import Pause from "./assets/pause.svg";
import Play from "./assets/play.svg";
import Volume2 from "./assets/volume-2.svg";
import VolumeX from "./assets/volume-x.svg";
import Radio from "./assets/radio.svg?react";
import { getChannels } from "./apis";
import { checkDefaultChannel } from "./utils";
import SafeImage from "./ui/safe-image";
import LiveClock from "./ui/live-clock";
import "./RadioWidget.css";

interface Channel {
    _id: string;
    name: string;
    isDefault?: boolean;
    isLive?: boolean;
    voiceCommandLabel?: string;
}

interface StreamingData {
    title?: string;
    thumbnailUrl?: string;
    downloadUrl?: string;
    rjUserId?: string;
    producer?: string;
}

interface AudioProps {
    firebaseConfig: any;
    ShowLiveChannelsOnly?: boolean;
    match?: {
        params?: {
            defaultChannel?: string;
        };
    };
}

const LiveRadioWidget: React.FC<AudioProps> = ({ firebaseConfig }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [channel, setChannel] = useState<string | null>(null);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [talmediaLanguage, setTalmediaLanguage] = useState("");
    const sliderRef = useRef<HTMLInputElement | null>(null);

    const [volume, setVolume] = useState(0.5);
    const [mute, setMute] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [currentStreaming, setCurrentStreaming] =
        useState<StreamingData | null>(null);

    const previousCurrentStreamingRef = useRef<DatabaseReference | null>(null);
    const previousChannelRef = useRef<string | null>(null);
    const listenerIdRef = useRef<string | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const { realtimeDb, database } = useFirebaseServices(firebaseConfig);

    // ----------------------------
    // GLOBAL NOW PLAYING LOG
    // ----------------------------
    useEffect(() => {
        const dataRef = ref(database, "radio/nowPlaying");
        const unsub = onValue(dataRef, (snapshot) => {
            console.log("Now playing:", snapshot.val());
        });

        return () => off(dataRef);
    }, [database]);

    // ----------------------------
    // CHANGE CHANNEL
    // ----------------------------
    const handleChangeChannel = (newChannel: string | null) => {
        setTalmediaLanguage(checkDefaultChannel(newChannel));
        setChannel(newChannel);
    };

    // ----------------------------
    // LOAD + PLAY STREAMING WITH SEEK
    // ----------------------------
    const fetchAudioAndPlay = async (playFromSeek: boolean) => {
        const audio = audioRef.current;
        if (!audio || !currentStreaming?.downloadUrl) return;

        audio.pause();

        if (audio.src !== currentStreaming.downloadUrl) {
            audio.src = currentStreaming.downloadUrl;
            audio.load();
        }

        const playAudio = () => {
            if (isPlaying) {
                audio
                    .play()
                    .catch((err) => console.warn("Audio play failed:", err));
            }
        };

        if (playFromSeek) {
            try {
                const seekRef = ref(realtimeDb, `/seekTime/${channel}`);
                const snapshot = await get(seekRef);

                if (snapshot.exists() && isPlaying) {
                    audio.currentTime = snapshot.val() || 0;
                }
            } catch (error) {
                console.error("Seek fetch error:", error);
            }
        } else {
            audio.currentTime = 0;
        }

        playAudio();
    };

    // ----------------------------
    // PLAY / PAUSE CONTROL
    // ----------------------------
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        isPlaying
            ? audio.play().catch(() => { })
            : audio.pause();
    }, [isPlaying]);

    // ----------------------------
    // STREAMING LISTENER
    // ----------------------------
    const channelHandler = (channelName: string) => {
        const selected = channels.find((each) => each.name === channelName);
        if (!selected) return;

        const refPath = ref(
            realtimeDb,
            `/currentStreaming/${selected.name}`
        );

        if (previousCurrentStreamingRef.current)
            off(previousCurrentStreamingRef.current);

        onValue(refPath, (snapshot) => {
            if (snapshot.exists()) {
                setCurrentStreaming(snapshot.val());
            } else {
                setCurrentStreaming({
                    title: "Offline",
                    thumbnailUrl: "",
                });
            }
        });

        previousCurrentStreamingRef.current = refPath;
    };

    // ----------------------------
    // LOAD CHANNEL LIST
    // ----------------------------
    const loadChannels = async () => {
        try {
            setIsLoading(true);
            const response = await getChannels();
            setIsLoading(false);

            if (Array.isArray(response?.data)) {
                setChannels(response.data);
            }
        } catch (err) {
            setIsLoading(false);
            console.error("Error fetching channels:", err);
        }
    };

    // ----------------------------
    // DEFAULT CHANNEL
    // ----------------------------
    const decideDefaultChannel = () => {
        if (!channel && channels.length > 0) {
            const found = channels.find((ch) => ch.isDefault);
            if (found) {
                setTalmediaLanguage(checkDefaultChannel(found.name));
                setChannel(found.name);
            }
        }
    };

    // ----------------------------
    // ON CHANNEL CHANGE
    // ----------------------------
    useEffect(() => {
        if (channel) channelHandler(channel);
    }, [channel]);

    // ----------------------------
    // INITIAL LOAD
    // ----------------------------
    useEffect(() => {
        loadChannels();
    }, []);

    useEffect(() => {
        if (channels.length > 0) decideDefaultChannel();

        return () => {
            if (previousCurrentStreamingRef.current)
                off(previousCurrentStreamingRef.current);

            const audio = audioRef.current;
            if (audio) audio.pause();
        };
    }, [channels]);

    // ----------------------------
    // ON STREAMING CHANGE → PLAY
    // ----------------------------
    useEffect(() => {
        if (!currentStreaming?.downloadUrl) return;

        const channelChanged =
            previousChannelRef.current !== channel;

        fetchAudioAndPlay(channelChanged);

        previousChannelRef.current = channel;
    }, [currentStreaming]);

    // ----------------------------
    // VOLUME
    // ----------------------------
    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);
    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.style.setProperty("--fill", `${volume * 100}%`);
        }
    }, [])
    // ----------------------------
    // BEFORE UNLOAD → REMOVE LISTENER
    // ----------------------------
    useEffect(() => {
        const handler = (event: BeforeUnloadEvent) => {
            if (isPlaying && listenerIdRef.current && channel) {
                const listenerRef = ref(
                    realtimeDb,
                    `/talRadioCurrentListeners/${channel}/${listenerIdRef.current}`
                );
                remove(listenerRef).catch(() => { });
                event.preventDefault();
                event.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [isPlaying, channel]);

    // ----------------------------
    // RENDER
    // ----------------------------
    return (
        // <div className="w-full bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-lg p-6 transition-all duration-300">

        //     {/* Header */}
        //     <div className="flex items-center justify-between mb-5">
        //         <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
        //             <Radio className="h-5 w-5 text-green-500" />
        //             TALRadio – Listen, Feel and Act!
        //         </h2>
        //     </div>

        //     {/* Channel Selector */}
        //     <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-6 flex items-center justify-between">
        //         {isLoading ? (
        //             <div className="w-full text-center text-xs text-gray-500 animate-pulse">
        //                 Loading languages...
        //             </div>
        //         ) : (
        //             <div className="flex gap-2 justify-center px-3">
        //                 {["talradio", "hindi", "telugu", "kannada"].map((lang) => (
        //                     <button
        //                         key={lang}
        //                         onClick={() => handleChangeChannel(lang)}
        //                         className={`px-3 py-[4px] text-[11px] rounded-full border transition-all duration-200 ${
        //                             channel === lang
        //                                 ? "bg-purple-600 text-white border-purple-600"
        //                                 : "bg-white text-gray-700 border-gray-300 hover:bg-purple-50"
        //                         }`}
        //                     >
        //                         {lang === "talradio"
        //                             ? "English"
        //                             : lang.charAt(0).toUpperCase() + lang.slice(1)}
        //                     </button>
        //                 ))}
        //             </div>
        //         )}
        //     </div>

        //     {/* Main */}
        //     <div className="flex flex-col gap-3">
        //         {/* Title */}
        //         <h3 className="flex items-center gap-2 text-[16px] font-semibold text-gray-900 truncate">
        //             <img src={Music} className="h-4 w-4" />
        //             <span className="truncate">
        //                 {currentStreaming?.title || "Now Playing"}
        //             </span>
        //         </h3>

        //         <div className="flex items-center gap-6">
        //             {/* Thumbnail */}
        //             <div className="relative">
        //                 <SafeImage
        //                     src={currentStreaming?.thumbnailUrl}
        //                     className="w-28 h-28 rounded-2xl border object-cover"
        //                 />

        //                 {isPlaying && (
        //                     <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center">
        //                         <div className="flex space-x-1">
        //                             {[0, 1, 2, 3].map((i) => (
        //                                 <div
        //                                     key={i}
        //                                     className="w-1 h-5 bg-purple-400 rounded-full animate-bounce"
        //                                     style={{ animationDelay: `${i * 0.15}s` }}
        //                                 />
        //                             ))}
        //                         </div>
        //                     </div>
        //                 )}
        //             </div>

        //             {/* Details */}
        //             <div className="flex flex-col flex-1">
        //                 <p className="text-[12px] text-gray-600">
        //                     Producer: {currentStreaming?.producer || "Unknown"}
        //                 </p>
        //                 <p className="text-[12px] text-gray-600">
        //                     RJ: {currentStreaming?.rjUserId || "Unknown"}
        //                 </p>

        //                 <div className="flex items-center gap-3 mt-3">
        //                     {/* Player Buttons */}
        //                     {isPlaying ? (
        //                         <button
        //                             onClick={() => setIsPlaying(false)}
        //                             className="w-9 h-9 bg-red-100 text-red-600 rounded-full flex items-center justify-center"
        //                         >
        //                             <img src={Pause} className="w-4 h-4" />
        //                         </button>
        //                     ) : (
        //                         <button
        //                             onClick={() => setIsPlaying(true)}
        //                             className="w-9 h-9 bg-green-100 text-green-600 rounded-full flex items-center justify-center"
        //                         >
        //                             <img src={Play} className="w-4 h-4" />
        //                         </button>
        //                     )}

        //                     {/* Mute */}
        //                     <button
        //                         onClick={() => setMute((prev) => !prev)}
        //                         className="p-2 rounded-full hover:bg-gray-100"
        //                     >
        //                         <img
        //                             src={mute ? VolumeX : Volume2}
        //                             className="w-4 h-4"
        //                         />
        //                     </button>

        //                     {/* Volume Slider */}
        //                     <input
        //                         type="range"
        //                         min={0}
        //                         max={1}
        //                         step={0.01}
        //                         value={volume}
        //                         onChange={(e) => setVolume(parseFloat(e.target.value))}
        //                         className="flex-1 custom-volume-slider"
        //                         style={{
        //                             background: `linear-gradient(90deg, #a855f7 ${
        //                                 volume * 100
        //                             }%, #e5e7eb ${volume * 100}%)`,
        //                         }}
        //                     />
        //                 </div>

        //                 <LiveClock />
        //             </div>
        //         </div>
        //     </div>

        //     {/* Hidden Audio */}
        //     <audio ref={audioRef} muted={mute} preload="auto" loop />
        // </div>

        <div className="tal-radio-container">

            {/* Header */}
            <div className="tal-header">
                <h2 className="tal-header-title">
                    <Radio className="h-5 w-5 text-green-500" />
                    TALRadio – Listen, Feel and Act!
                </h2>
            </div>

            {/* Channel Selector */}
            <div className="tal-channel-box">
                {isLoading ? (
                    <div className="text-xs">Loading languages...</div>
                ) : (
                    <div style={{ display: "flex" }}>
                        {["talradio", "hindi", "telugu", "kannada"].map((lang) => (
                            <button
                                key={lang}
                                onClick={() => handleChangeChannel(lang)}
                                className={`tal-channel-btn ${channel === lang ? "active" : ""
                                    }`}
                            >
                                {lang === "talradio"
                                    ? "English"
                                    : lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Title */}
            <h3 className="tal-title">
                <img src={Music} />
                <span>{currentStreaming?.title || "Now Playing"}</span>
            </h3>

            {/* Main */}
            <div className="tal-main">

                {/* Thumbnail */}
                <div className="tal-thumb">
                    <SafeImage
                        src={currentStreaming?.thumbnailUrl}
                    />
                    {isPlaying && (
                        <div className="tal-equalizer">
                            {[0, 1, 2, 3].map((i) => (
                                <div key={i} style={{ animationDelay: `${i * 0.15}s` }} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="tal-details">
                    <p className="tal-meta">
                        Producer: {currentStreaming?.producer || "Unknown"}
                    </p>
                    <p className="tal-meta">
                        RJ: {currentStreaming?.rjUserId || "Unknown"}
                    </p>

                    <div className="tal-controls">
                        {isPlaying ? (
                            <button onClick={() => setIsPlaying(false)} className="tal-btn pause">
                                <img src={Pause} />
                            </button>
                        ) : (
                            <button onClick={() => setIsPlaying(true)} className="tal-btn play">
                                <img src={Play} />
                            </button>
                        )}

                        <button
                            onClick={() => setMute(!mute)}
                            className="tal-mute-btn"
                        >
                            <img src={mute ? VolumeX : Volume2} />
                        </button>

                        <input
                            ref={sliderRef}
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={volume}
                            onChange={(e) => {
                                const v = parseFloat(e.target.value);
                                setVolume(v);
                                e.target.style.setProperty("--fill", `${v * 100}%`);
                            }}
                            className="custom-volume-slider"
                        />
                    </div>

                    <LiveClock />
                </div>
            </div>

            <audio ref={audioRef} muted={mute} preload="auto" loop />
        </div>
    );
};

export default LiveRadioWidget;
