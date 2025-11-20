import { jsx as t, jsxs as l } from "react/jsx-runtime";
import * as x from "react";
import { useMemo as D, useState as c, useEffect as d, useRef as v } from "react";
import { getDatabase as T, ref as y, onValue as Y, off as M, get as S, remove as q } from "firebase/database";
import { getApps as W, getApp as H, initializeApp as Z } from "firebase/app";
import { getStorage as J } from "firebase/storage";
import { getFirestore as $ } from "firebase/firestore";
const _ = (A) => D(() => {
  if (!(A != null && A.apiKey))
    throw new Error("Missing Firebase configuration");
  const r = W().length ? H() : Z(A), o = T(r), g = J(r), i = T(r), h = $(r);
  return console.log("✅ Firebase initialized:", r.name), { app: r, database: o, storage: g, realtimeDb: i, firestoreDb: h };
}, [A]), ee = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%20class='lucide%20lucide-music-icon%20lucide-music'%3e%3cpath%20d='M9%2018V5l12-2v13'/%3e%3ccircle%20cx='6'%20cy='18'%20r='3'/%3e%3ccircle%20cx='18'%20cy='16'%20r='3'/%3e%3c/svg%3e", te = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%20class='lucide%20lucide-pause-icon%20lucide-pause'%3e%3crect%20x='14'%20y='3'%20width='5'%20height='18'%20rx='1'/%3e%3crect%20x='5'%20y='3'%20width='5'%20height='18'%20rx='1'/%3e%3c/svg%3e", ne = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%20class='lucide%20lucide-play-icon%20lucide-play'%3e%3cpath%20d='M5%205a2%202%200%200%201%203.008-1.728l11.997%206.998a2%202%200%200%201%20.003%203.458l-12%207A2%202%200%200%201%205%2019z'/%3e%3c/svg%3e", ae = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%20class='lucide%20lucide-volume2-icon%20lucide-volume-2'%3e%3cpath%20d='M11%204.702a.705.705%200%200%200-1.203-.498L6.413%207.587A1.4%201.4%200%200%201%205.416%208H3a1%201%200%200%200-1%201v6a1%201%200%200%200%201%201h2.416a1.4%201.4%200%200%201%20.997.413l3.383%203.384A.705.705%200%200%200%2011%2019.298z'/%3e%3cpath%20d='M16%209a5%205%200%200%201%200%206'/%3e%3cpath%20d='M19.364%2018.364a9%209%200%200%200%200-12.728'/%3e%3c/svg%3e", se = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%20class='lucide%20lucide-volume-x-icon%20lucide-volume-x'%3e%3cpath%20d='M11%204.702a.705.705%200%200%200-1.203-.498L6.413%207.587A1.4%201.4%200%200%201%205.416%208H3a1%201%200%200%200-1%201v6a1%201%200%200%200%201%201h2.416a1.4%201.4%200%200%201%20.997.413l3.383%203.384A.705.705%200%200%200%2011%2019.298z'/%3e%3cline%20x1='22'%20x2='16'%20y1='9'%20y2='15'/%3e%3cline%20x1='16'%20x2='22'%20y1='9'%20y2='15'/%3e%3c/svg%3e", Ae = (A) => /* @__PURE__ */ x.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-radio-icon lucide-radio", ...A }, /* @__PURE__ */ x.createElement("path", { d: "M16.247 7.761a6 6 0 0 1 0 8.478" }), /* @__PURE__ */ x.createElement("path", { d: "M19.075 4.933a10 10 0 0 1 0 14.134" }), /* @__PURE__ */ x.createElement("path", { d: "M4.925 19.067a10 10 0 0 1 0-14.134" }), /* @__PURE__ */ x.createElement("path", { d: "M7.753 16.239a6 6 0 0 1 0-8.478" }), /* @__PURE__ */ x.createElement("circle", { cx: 12, cy: 12, r: 2 }));
async function re(A = !1) {
  try {
    const n = await fetch(
      `https://touch-a-life-dev.web.app/api/v1/talradio/channels?includeAll=${A}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    if (!n.ok)
      throw new Error(`HTTP error! Status: ${n.status}`);
    return await n.json();
  } catch (n) {
    throw console.error("Error fetching channels:", n), n;
  }
}
function z(A = null) {
  switch (A) {
    case "telugu":
      return "telugu";
    case "hindi":
      return "hindi";
    case "talradio":
      return "english";
    case "kannada":
      return "kannada";
    default:
      return "all";
  }
}
const oe = "data:image/jpeg;base64,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", ie = ({
  src: A,
  fallback: n = oe,
  // ✅ use imported default image
  alt: r = "image",
  className: o,
  style: g
}) => {
  const [i, h] = c(A || n), [C, m] = c(!1);
  return d(() => {
    A ? (h(A), m(!1)) : h(n);
  }, [A, n]), /* @__PURE__ */ t(
    "img",
    {
      src: i,
      alt: r,
      onError: () => {
        i !== n && h(n);
      },
      onLoad: () => m(!0),
      className: `${o || ""} ${C ? "opacity-100" : "opacity-0"} transition-opacity duration-500`,
      style: g,
      loading: "lazy"
    }
  );
}, le = () => {
  const [A, n] = c((/* @__PURE__ */ new Date()).getSeconds()), [r, o] = c(/* @__PURE__ */ new Date());
  d(() => {
    const f = setInterval(() => {
      const E = /* @__PURE__ */ new Date();
      n(E.getSeconds()), E.getSeconds() === 0 && o(E);
    }, 1e3);
    return () => clearInterval(f);
  }, []);
  const g = D(
    () => r.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !0
    }),
    [r]
  ), i = D(
    () => r.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric"
    }),
    [r]
  ), [h, C] = g.split(" "), [m, p] = h.split(":");
  return /* @__PURE__ */ l("div", { className: "flex justify-between items-center mt-2 text-[11px] text-gray-500 font-mono", children: [
    /* @__PURE__ */ t("span", { children: i }),
    /* @__PURE__ */ l("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ t("span", { className: "w-2 h-2 bg-red-500 rounded-full animate-pulse" }),
      /* @__PURE__ */ l("div", { className: "flex items-baseline text-gray-700 font-semibold", children: [
        /* @__PURE__ */ t("span", { children: m }),
        /* @__PURE__ */ t(
          "span",
          {
            className: "mx-[2px] text-gray-700 animate-[pulse_2s_ease-in-out_infinite]",
            style: {
              animationName: "pulse",
              animationDuration: "2s",
              animationIterationCount: "infinite",
              animationTimingFunction: "ease-in-out"
            },
            children: ":"
          }
        ),
        /* @__PURE__ */ t("span", { children: p }),
        /* @__PURE__ */ t("span", { children: ":" }),
        /* @__PURE__ */ t("span", { className: "ml-1 text-[10px] text-gray-600", children: A.toString().padStart(2, "0") }),
        /* @__PURE__ */ t("span", { className: "ml-1 text-[10px] opacity-80", children: C })
      ] })
    ] }),
    /* @__PURE__ */ t("style", { children: `
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.2; }
          }
        ` })
  ] });
}, pe = ({ firebaseConfig: A }) => {
  const [n, r] = c(!1), [o, g] = c(null), [i, h] = c([]), [C, m] = c(""), p = v(null), [f, E] = c(0.5), [N, L] = c(!1), [V, b] = c(!1), [a, U] = c(null), Q = v(null), R = v(null), K = v(null), B = v(null), { realtimeDb: F, database: I } = _(A);
  d(() => {
    const e = y(I, "radio/nowPlaying");
    return Y(e, (s) => {
      console.log("Now playing:", s.val());
    }), () => M(e);
  }, [I]);
  const G = (e) => {
    m(z(e)), g(e);
  }, X = async (e) => {
    const s = B.current;
    if (!s || !(a != null && a.downloadUrl)) return;
    s.pause(), s.src !== a.downloadUrl && (s.src = a.downloadUrl, s.load());
    const w = () => {
      n && s.play().catch((u) => console.warn("Audio play failed:", u));
    };
    if (e)
      try {
        const u = y(F, `/seekTime/${o}`), k = await S(u);
        k.exists() && n && (s.currentTime = k.val() || 0);
      } catch (u) {
        console.error("Seek fetch error:", u);
      }
    else
      s.currentTime = 0;
    w();
  };
  d(() => {
    const e = B.current;
    e && (n ? e.play().catch(() => {
    }) : e.pause());
  }, [n]);
  const P = (e) => {
    const s = i.find((u) => u.name === e);
    if (!s) return;
    const w = y(
      F,
      `/currentStreaming/${s.name}`
    );
    Q.current && M(Q.current), Y(w, (u) => {
      u.exists() ? U(u.val()) : U({
        title: "Offline",
        thumbnailUrl: ""
      });
    }), Q.current = w;
  }, j = async () => {
    try {
      b(!0);
      const e = await re();
      b(!1), Array.isArray(e == null ? void 0 : e.data) && h(e.data);
    } catch (e) {
      b(!1), console.error("Error fetching channels:", e);
    }
  }, O = () => {
    if (!o && i.length > 0) {
      const e = i.find((s) => s.isDefault);
      e && (m(z(e.name)), g(e.name));
    }
  };
  return d(() => {
    o && P(o);
  }, [o]), d(() => {
    j();
  }, []), d(() => (i.length > 0 && O(), () => {
    Q.current && M(Q.current);
    const e = B.current;
    e && e.pause();
  }), [i]), d(() => {
    if (!(a != null && a.downloadUrl)) return;
    const e = R.current !== o;
    X(e), R.current = o;
  }, [a]), d(() => {
    B.current && (B.current.volume = f);
  }, [f]), d(() => {
    p.current && p.current.style.setProperty("--fill", `${f * 100}%`);
  }, []), d(() => {
    const e = (s) => {
      if (n && K.current && o) {
        const w = y(
          F,
          `/talRadioCurrentListeners/${o}/${K.current}`
        );
        q(w).catch(() => {
        }), s.preventDefault(), s.returnValue = "";
      }
    };
    return window.addEventListener("beforeunload", e), () => window.removeEventListener("beforeunload", e);
  }, [n, o]), // <div className="w-full bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-lg p-6 transition-all duration-300">
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
  /* @__PURE__ */ l("div", { className: "tal-radio-container", children: [
    /* @__PURE__ */ t("div", { className: "tal-header", children: /* @__PURE__ */ l("h2", { className: "tal-header-title", children: [
      /* @__PURE__ */ t(Ae, { className: "h-5 w-5 text-green-500" }),
      "TALRadio – Listen, Feel and Act!"
    ] }) }),
    /* @__PURE__ */ t("div", { className: "tal-channel-box", children: V ? /* @__PURE__ */ t("div", { className: "text-xs", children: "Loading languages..." }) : /* @__PURE__ */ t("div", { style: { display: "flex" }, children: ["talradio", "hindi", "telugu", "kannada"].map((e) => /* @__PURE__ */ t(
      "button",
      {
        onClick: () => G(e),
        className: `tal-channel-btn ${o === e ? "active" : ""}`,
        children: e === "talradio" ? "English" : e.charAt(0).toUpperCase() + e.slice(1)
      },
      e
    )) }) }),
    /* @__PURE__ */ l("h3", { className: "tal-title", children: [
      /* @__PURE__ */ t("img", { src: ee }),
      /* @__PURE__ */ t("span", { children: (a == null ? void 0 : a.title) || "Now Playing" })
    ] }),
    /* @__PURE__ */ l("div", { className: "tal-main", children: [
      /* @__PURE__ */ l("div", { className: "tal-thumb", children: [
        /* @__PURE__ */ t(
          ie,
          {
            src: a == null ? void 0 : a.thumbnailUrl
          }
        ),
        n && /* @__PURE__ */ t("div", { className: "tal-equalizer", children: [0, 1, 2, 3].map((e) => /* @__PURE__ */ t("div", { style: { animationDelay: `${e * 0.15}s` } }, e)) })
      ] }),
      /* @__PURE__ */ l("div", { className: "tal-details", children: [
        /* @__PURE__ */ l("p", { className: "tal-meta", children: [
          "Producer: ",
          (a == null ? void 0 : a.producer) || "Unknown"
        ] }),
        /* @__PURE__ */ l("p", { className: "tal-meta", children: [
          "RJ: ",
          (a == null ? void 0 : a.rjUserId) || "Unknown"
        ] }),
        /* @__PURE__ */ l("div", { className: "tal-controls", children: [
          n ? /* @__PURE__ */ t("button", { onClick: () => r(!1), className: "tal-btn pause", children: /* @__PURE__ */ t("img", { src: te }) }) : /* @__PURE__ */ t("button", { onClick: () => r(!0), className: "tal-btn play", children: /* @__PURE__ */ t("img", { src: ne }) }),
          /* @__PURE__ */ t(
            "button",
            {
              onClick: () => L(!N),
              className: "tal-mute-btn",
              children: /* @__PURE__ */ t("img", { src: N ? se : ae })
            }
          ),
          /* @__PURE__ */ t(
            "input",
            {
              ref: p,
              type: "range",
              min: 0,
              max: 1,
              step: 0.01,
              value: f,
              onChange: (e) => {
                const s = parseFloat(e.target.value);
                E(s), e.target.style.setProperty("--fill", `${s * 100}%`);
              },
              className: "custom-volume-slider"
            }
          )
        ] }),
        /* @__PURE__ */ t(le, {})
      ] })
    ] }),
    /* @__PURE__ */ t("audio", { ref: B, muted: N, preload: "auto", loop: !0 })
  ] });
};
export {
  pe as LiveRadioWidget
};
//# sourceMappingURL=index.esm.js.map
