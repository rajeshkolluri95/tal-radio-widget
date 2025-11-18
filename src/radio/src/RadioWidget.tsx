import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import {
    ref,
    onValue,
    off,
    DatabaseReference,
    get,
    remove,
    runTransaction,
    onDisconnect,
    set,
} from "firebase/database";
import { app as firebase, storage, realtimeDb, firestoreDb } from "./firebaseConfig";
import "./RadioWidget.css"

import Music from "./assets/music.svg";
import Pause from "./assets/pause.svg";
import Play from "./assets/play.svg";
import Radio from './assets/radio.svg?react';
import Volume2 from "./assets/volume-2.svg";
import VolumeX from "./assets/volume-x.svg";
import { checkDefaultChannel } from "./utils";
import SafeImage from "./ui/safe-image";
import { getChannels } from "./apis";
import LiveClock from "./ui/live-clock";

interface Channel {
    _id: string;
    name: string;
    isLive?: boolean;
    isDefault?: boolean;
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
    ShowLiveChannelsOnly?: boolean;
    match?: {
        params?: {
            defaultChannel?: string;
        };
    };
}

const LiveRadioWidget: React.FC<AudioProps> = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [channel, setChannel] = useState<string | null>(null);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [talmediaLanguage, setTalmediaLanguage] = useState("");
    const [volume, setVolume] = useState(0.5);
    const [mute, setMute] = useState(false);
    const [currentStreaming, setCurrentStreaming] = useState<StreamingData | null>(null);
    const [previousCurrentStreamingRef, setPreviousCurrentStreamingRef] =
        useState<DatabaseReference | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const previousStreamUrlRef = useRef<string | null>(null);
    const previousChannelRef = useRef<string | null>(null);
    const listenerIdRef = useRef<string | null>(null);

    // 🔹 Handle Channel Change
    const handleChangeChannel = (newChannel: string | null) => {
        setTalmediaLanguage(checkDefaultChannel(newChannel));
        setChannel(newChannel);
    };

    // 🔹 Audio Playback Logic
    const fetchAudioAndPlay = async (shouldPlayFromSeekTime: boolean) => {
        const audio = document.getElementById("audio") as HTMLAudioElement | null;
        if (!audio || !currentStreaming?.downloadUrl) return;

        // Pause before switching
        audio.pause();

        // ✅ Correct order: set src first, then load
        if (audio.src !== currentStreaming.downloadUrl) {
            audio.src = currentStreaming.downloadUrl;
            audio.load();
        }

        const playAudio = () => {
            if (isPlaying) {
                audio
                    .play()
                    .catch((error) =>
                        console.warn("Audio play failed (harmless):", error.message)
                    );
            }
        };

        if (shouldPlayFromSeekTime) {
            try {
                const seekTimeRef = ref(realtimeDb, `/seekTime/${channel}`);
                const snapshot = await get(seekTimeRef);

                if (snapshot.exists() && isPlaying) {
                    const seekTime = snapshot.val();
                    audio.currentTime = seekTime || 0;
                }
            } catch (error) {
                console.error("Error fetching seek time:", error);
            }
        } else {
            audio.currentTime = 0;
        }

        playAudio();
    };

    // 🔹 Go Offline
    useEffect(() => {
        const audio = document.getElementById("audio") as HTMLAudioElement | null;
        if (!audio) return;

        if (isPlaying) {
            audio.play().catch((err) => console.warn("Play failed:", err));
        } else {
            audio.pause();
        }
    }, [isPlaying]);
    // 🔹 Firebase Listener for Current Stream
    const channelHandler = (channel: string) => {
        if (!channel || !channels?.length) return;

        const selectedChannel = channels.find((each) => each.name === channel);
        if (!selectedChannel?.name) return;

        const currentStreamingRef = ref(realtimeDb, `/currentStreaming/${selectedChannel.name}`);

        if (previousCurrentStreamingRef) off(previousCurrentStreamingRef);

        onValue(currentStreamingRef, (snapshot) => {
            if (snapshot.exists()) {
                setCurrentStreaming(snapshot.val());
            } else {
                setCurrentStreaming({ title: "Offline", thumbnailUrl: "" });
                goOffline();
            }
        });

        setPreviousCurrentStreamingRef(currentStreamingRef);
    };

    // 🔹 Load Channels from API
    const loadChannels = async () => {
        try {
            setIsLoading(true);
            const response = await getChannels();
            setIsLoading(false);

            if (Array.isArray(response?.data) && response.data.length > 0) {
                setChannels(response.data);
            }
        } catch (error: any) {
            setIsLoading(false);
            console.error("Error fetching channels:", error);
        }
    };

    // 🔹 Default Channel Setup
    const decideDefaultChannel = () => {
        let defaultChannel = "";
        if (!channel && channels?.length > 0) {
            const found = channels.find((ch) => ch.isDefault);
            if (found) defaultChannel = found.name;
        }
        setTalmediaLanguage(checkDefaultChannel(defaultChannel));
        if (defaultChannel) setChannel(defaultChannel);
    };

    // 🔹 Effects
    useEffect(() => {
        if (channel) channelHandler(channel);
    }, [channel]);

    useEffect(() => {
        if (channels?.length > 0) decideDefaultChannel();
        else loadChannels();

        return () => {
            if (previousCurrentStreamingRef) off(previousCurrentStreamingRef);
            const audio = document.getElementById("audio") as HTMLAudioElement | null;
            if (audio && isPlaying) audio.pause();
        };
    }, []);

    useEffect(() => {
        if (!currentStreaming?.downloadUrl) return;

        const isNewStream = previousStreamUrlRef.current !== currentStreaming.downloadUrl;
        const isChannelChanged = previousChannelRef.current !== channel;

        fetchAudioAndPlay(isChannelChanged);

        previousStreamUrlRef.current = currentStreaming.downloadUrl;
        previousChannelRef.current = channel;
    }, [currentStreaming]);

    useEffect(() => {
        const audio = document.getElementById("audio") as HTMLAudioElement | null;
        if (audio) audio.volume = volume;
    }, [volume]);

    // 🔹 Handle Play / Pause
    const handlePlayer = (status: boolean) => {
        setIsPlaying(status);
    };

    // 🔹 Cleanup Listeners Before Unload
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isPlaying) {
                const listenerId = listenerIdRef.current;
                if (listenerId && channel) {
                    const listenerRef = ref(
                        realtimeDb,
                        `/talRadioCurrentListeners/${channel}/${listenerId}`
                    );
                    remove(listenerRef).catch((err) =>
                        console.error("Error removing listener:", err)
                    );
                }
                event.preventDefault();
                event.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isPlaying, channel]);

    // ----------------------
    // 🔹 JSX
    // ----------------------

    return (
        <div className="w-full bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-lg p-6 transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <Radio className="h-5 w-5 text-green-500" />
                    TALRadio – Listen, Feel and Act!
                </h2>
            </div>

            {/* Channel Selector */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-6 flex items-center justify-between">
                <div className="flex gap-2 justify-center px-3">
                    {["talradio", "hindi", "telugu", "kannada"].map((lang) => (
                        <button
                            key={lang}
                            onClick={() => handleChangeChannel(lang)}
                            className={`flex-shrink-0 px-3 py-[4px] text-[11px] rounded-full transition-all duration-200 border ${channel === lang
                                ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-purple-50"
                                }`}
                        >
                            {lang === "talradio"
                                ? "English"
                                : lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Section */}
            <div className="flex flex-col gap-3">
                {/* Title */}
                <h3 className="flex items-center gap-2 text-[16px] font-semibold text-gray-900 truncate">
                    <img src={Music} alt="Music" className="h-4 w-4" />
                    <span className="truncate">
                        {currentStreaming?.title || "Now Playing"}
                    </span>
                </h3>

                {/* Image + Info + Controls */}
                <div className="flex items-center gap-6">
                    <div className="relative flex-shrink-0">
                        <SafeImage
                            src={currentStreaming?.thumbnailUrl}
                            alt="Thumbnail"
                            className="w-28 h-28 rounded-2xl object-cover border border-purple-200 shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
                        />
                        {isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl">
                                <div className="flex space-x-1">
                                    {[...Array(4)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-1 h-5 bg-purple-400 rounded-full animate-bounce"
                                            style={{
                                                animationDelay: `${i * 0.15}s`,
                                                animationDuration: "0.8s",
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Info + Controls */}
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                        <div className="overflow-hidden mb-3">
                            <p className="text-[12px] text-gray-600 mt-0.5">
                                Producer: {currentStreaming?.producer || "Unknown Producer"}
                            </p>
                            <p className="text-[12px] text-gray-600 mt-0.5">
                                RJ: {currentStreaming?.rjUserId || "Unknown RJ"}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 w-full">
                            {isPlaying ? (
                                <button
                                    onClick={() => handlePlayer(false)}
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                                >
                                    <img src={Pause} alt="Pause" className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => handlePlayer(true)}
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition"
                                >
                                    <img src={Play} alt="Play" className="w-4 h-4" />
                                </button>
                            )}

                            {/* Volume */}
                            <button
                                onClick={() => setMute((prev) => !prev)}
                                className="p-2 rounded-full hover:bg-gray-100 transition"
                            >
                                {mute ? (
                                    <img src={VolumeX} alt="Volume X" className="w-4 h-4" />
                                ) : (
                                    <img src={Volume2} alt="Volume 2" className="w-4 h-4" />
                                )}
                            </button>

                            <div className="flex items-center flex-1">
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={volume}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        setVolume(parseFloat(e.target.value))
                                    }
                                    className="w-full custom-volume-slider mt-[1px]"
                                    style={{
                                        background: `linear-gradient(90deg, #a855f7 ${volume * 100}%, #e5e7eb ${volume * 100
                                            }%)`,
                                    }}
                                />
                            </div>
                        </div>

                        <LiveClock />
                    </div>
                </div>
            </div>

            <audio id="audio" muted={mute} loop preload="auto" />
        </div>
    );
};

export default LiveRadioWidget;
