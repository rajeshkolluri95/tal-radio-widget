"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import {
  ref,
  onValue,
  off,
  get,
  remove,
  DatabaseReference,
  set,
  onDisconnect,
  runTransaction,
} from "firebase/database";
import { useFirebaseServices } from "../firebaseConfig";
import { Music, Pause, Play, Radio, Volume2, VolumeX } from "lucide-react";


// import Music from "./assets/music.svg";
// import Pause from "./assets/pause.svg";
// import Play from "./assets/play.svg";
// import Volume2 from "./assets/volume-2.svg";
// import VolumeX from "./assets/volume-x.svg";
// import Radio from "./assets/radio.svg?react";
import { getChannels } from "./apis";
import { checkDefaultChannel } from "./utils";
import SafeImage from "./ui/safe-image";
import LiveClock from "./ui/live-clock";
import "./RadioWidget.css";
// import MusicIcon from "./assets/music.svg?react";

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
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [channel, setChannel] = useState<string | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [talmediaLanguage, setTalmediaLanguage] = useState<string>("");
  const sliderRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousStreamUrlRef = useRef<string | null>(null);
  const previousChannelRef = useRef<string | null>(null);
  const { realtimeDb, database } = useFirebaseServices(firebaseConfig);
  const handleChangeChannel = (newChannel: string | null) => {
    setTalmediaLanguage(checkDefaultChannel(newChannel));
    setChannel(newChannel);
  };
  console.log("Audio SRC:", audioRef.current?.src);

  //   const { toast } = useToast();
  const [didUserInteract, setDidUserInteract] = useState(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [mute, setMute] = useState<boolean>(false);
  const [previousCurrentStreamingRef, setPreviousCurrentStreamingRef] =
    useState<DatabaseReference | null>(null);
  const [currentStreaming, setCurrentStreaming] =
    useState<StreamingData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const listenerIdRef = useRef<string | null>(null);
  //   const [getChannels] = useLazyGetChannelsQuery();

  const fetchAudioAndPlay = async (shouldPlayFromSeekTime: boolean) => {
    const audio = audioRef.current;
    if (!audio || !currentStreaming?.downloadUrl) return;

    // Load the new source
    audio.load();
    audio.src = currentStreaming.downloadUrl;

    const playAudio = () => {
      if (isPlaying) {
        audio.play().catch((error) => {
          console.error("Audio play failed:", error);
          // Optional: retry logic
        });
      }
    };

    if (shouldPlayFromSeekTime) {
      try {
        // ✅ Modular Firebase syntax
        const seekTimeRef = ref(realtimeDb, `/seekTime/${channel}`);
        const snapshot = await get(seekTimeRef);

        if (snapshot.exists() && isPlaying) {
          const seekTime = snapshot.val();
          audio.currentTime = seekTime || 0;
          playAudio();
        }
      } catch (error) {
        console.error("Error fetching seek time:", error);
      }
    } else {
      audio.currentTime = 0;
      playAudio();
    }
  };
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const goOffline = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.src = "";
      audio.currentTime = 0;
      if (isPlaying) audio.pause();
    }
    setIsPlaying(false);
  };

  const onChannelChange = (oldChannel: string, newChannel: string) => {
    // Placeholder for socket updates (commented out in original code)
  };

  const channelHandler = (channel: string) => {
    if (!channel || !channels?.length) return;

    // Find selected channel
    const selectedChannel = channels.find(
      (eachChannel) => eachChannel.name === channel
    );
    if (!selectedChannel?.name) return;

    // Get the Firebase Realtime Database reference (modular syntax)
    const currentStreamingRef = ref(
      realtimeDb,
      `/currentStreaming/${selectedChannel.name}`
    );

    // Stop listening to the old reference if it exists
    if (previousCurrentStreamingRef) {
      off(previousCurrentStreamingRef);
    }

    // Listen for new streaming data
    onValue(currentStreamingRef, (snapshot) => {
      if (snapshot.exists()) {
        setCurrentStreaming(snapshot.val());
      } else {
        setCurrentStreaming({ title: "Offline", thumbnailUrl: "" });
        goOffline();
      }
    });

    // Store current ref to stop listening next time
    setPreviousCurrentStreamingRef(currentStreamingRef);
  };

  // ----------------------
  // 🔹 Effects
  // ----------------------
  console.log("LiveRadioWidget", previousChannelRef, previousStreamUrlRef);

  useEffect(() => {
    if (!currentStreaming?.downloadUrl) return;

    const isNewStream =
      previousStreamUrlRef.current !== currentStreaming.downloadUrl;

    const isChannelChanged = previousChannelRef.current !== channel;

    // ✅ Logic:
    // - If the channel changed, resume from seek time
    // - If same channel but new stream, start from beginning
    // - If same channel and same stream, do nothing extra
    fetchAudioAndPlay(isChannelChanged ? true : !isNewStream);

    // ✅ Update refs for next run
    previousStreamUrlRef.current = currentStreaming.downloadUrl;
    previousChannelRef.current = channel;
  }, [currentStreaming]);

  const loadChannels = () => {
    setIsLoading(true);
    getChannels()
      //   .unwrap()
      .then((response) => {
        setIsLoading(false);
        if (Array.isArray(response?.data) && response.data.length > 0) {
          setChannels(response.data);
        }
      })
      .catch((error: Error) => {
        setIsLoading(false);
        //   toast.error("Problem in fetching Channels: " + error.message);
        // toast({
        //   title: "Problem in fetching Channels",
        //   description: `${error.message}`,
        // });
      });
  };

  const decideDefaultChannel = () => {
    let defaultChannel = "";

    if (!channel) {
      if (channels?.length > 0) {
        channels.forEach((ch) => {
          if (ch.isDefault) defaultChannel = ch.name;
        });
      }

      setTalmediaLanguage(checkDefaultChannel(defaultChannel));
      if (defaultChannel) setChannel(defaultChannel);
    }
  };

  useEffect(() => {
    if (channel) channelHandler(channel);
  }, [channel]);

  useEffect(() => {
    if (channels?.length > 0) {
      decideDefaultChannel();
    } else {
      loadChannels();
    }

    return () => {
      if (previousCurrentStreamingRef) {
        off(previousCurrentStreamingRef);
      }
      const audio = audioRef.current;
      if (audio && isPlaying) audio.pause();
    };
  }, []);

  useEffect(() => {
    if (channels?.length > 0) decideDefaultChannel();
  }, [channels]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !channel) return; // ✅ Skip if channel is not ready

    const listenerId = Math.random().toString(36).slice(2, 10);
    listenerIdRef.current = listenerId;

    if (isPlaying) {
      fetchAudioAndPlay(true);

      // ✅ Safe guard — ensure valid channel
      if (!channel || channel === "null" || channel === "undefined") {
        console.warn(
          "⚠️ Skipping invalid channel for listener registration:",
          channel
        );
        return;
      }

      // 🔹 Create listener reference
      const listenerRef = ref(
        realtimeDb,
        `/talRadioCurrentListeners/${channel}/${listenerId}`
      );

      // ✅ Add listener info safely
      set(listenerRef, {
        timestamp: Date.now(),
        platform: "web",
      }).catch((err) => console.error("Failed to set listener:", err));

      // ✅ Auto-remove on disconnect
      onDisconnect(listenerRef).remove();

      // 🔹 References for listener counts
      const totalListenersRef = ref(
        realtimeDb,
        "/talRadioListenersCount/totalListeners"
      );
      const channelListenersRef = ref(
        realtimeDb,
        `/talRadioListenersCount/totalChannelListeners/${channel}`
      );

      // ✅ Increment counts atomically
      runTransaction(totalListenersRef, (cur) => (cur || 0) + 1);
      runTransaction(channelListenersRef, (cur) => (cur || 0) + 1);
    } else {
      // 🔹 Stop playing audio and remove listener
      audio.pause();

      if (listenerIdRef.current && channel) {
        const listenerRef = ref(
          realtimeDb,
          `/talRadioCurrentListeners/${channel}/${listenerIdRef.current}`
        );
        remove(listenerRef).catch(() => { });
      }
    }

    // ✅ Cleanup on unmount or dependency change
    return () => {
      if (!channel || !listenerIdRef.current) return;
      const listenerRef = ref(
        realtimeDb,
        `/talRadioCurrentListeners/${channel}/${listenerIdRef.current}`
      );
      remove(listenerRef).catch(() => { });
    };
  }, [isPlaying, channel]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  const handlePlayer = (status: boolean) => {
    setIsPlaying(status);
    setDidUserInteract(true);
  };
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.setProperty("--fill", `${volume * 100}%`);
    }
  }, [volume]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isPlaying) {
        const listenerId = listenerIdRef.current;

        if (listenerId) {
          // ✅ Modular Firebase syntax
          const listenerRef = ref(
            realtimeDb,
            `/talRadioCurrentListeners/${channel}/${listenerId}`
          );
          remove(listenerRef).catch((error) =>
            console.error("Error removing listener:", error)
          );
        }

        // Optional: prompt the user before closing
        event.preventDefault();
        event.returnValue = ""; // Required for Chrome to trigger confirmation dialog
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // ✅ Cleanup listener on unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
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
          {/* <Radio className="radio-icon" /> */}
          <Radio className="radio-icon" />

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
        <Music className="music-icon" />

        {/* <MusicIcon className="music-icon" /> */}
        <span>{currentStreaming?.title || "Now Playing"}</span>
      </h3>

      {/* Main */}
      <div className="tal-main">
        {/* Thumbnail */}
        <div className="tal-thumb">
          <SafeImage src={currentStreaming?.thumbnailUrl} />
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
              <button
                onClick={() => setIsPlaying(false)}
                className="tal-circle-btn pause"
              >
                {/* <img src={Pause} className="tal-icon" /> */}
                <Pause className="tal-icon" />

              </button>
            ) : (
              <button
                onClick={() => setIsPlaying(true)}
                className="tal-circle-btn play"
              >
                {/* <img src={Play} className="tal-icon" /> */}
                <Play className="tal-icon" />

              </button>
            )}

            <button onClick={() => setMute(!mute)} className="tal-mute-btn">

              {mute ? (
                <VolumeX className="volume-icon" />
              ) : (
                <Volume2 cclassName="volume-icon" />
              )}


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
