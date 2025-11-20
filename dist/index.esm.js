import { jsx as t, jsxs as u } from "react/jsx-runtime";
import * as h from "react";
import { useMemo as I, useState as d, useEffect as g, useRef as R } from "react";
import { getDatabase as z, off as S, ref as w, set as J, onDisconnect as $, runTransaction as V, remove as L, get as _, onValue as ee } from "firebase/database";
import { getApps as te, getApp as ne, initializeApp as se } from "firebase/app";
import { getStorage as re } from "firebase/storage";
import { getFirestore as ae } from "firebase/firestore";
const ie = (a) => I(() => {
  if (!(a != null && a.apiKey))
    throw new Error("Missing Firebase configuration");
  const A = te().length ? ne() : se(a), n = z(A), p = re(A), i = z(A), f = ae(A);
  return console.log("✅ Firebase initialized:", A.name), { app: A, database: n, storage: p, realtimeDb: i, firestoreDb: f };
}, [a]), oe = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%20class='lucide%20lucide-pause-icon%20lucide-pause'%3e%3crect%20x='14'%20y='3'%20width='5'%20height='18'%20rx='1'/%3e%3crect%20x='5'%20y='3'%20width='5'%20height='18'%20rx='1'/%3e%3c/svg%3e", Ae = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%20class='lucide%20lucide-play-icon%20lucide-play'%3e%3cpath%20d='M5%205a2%202%200%200%201%203.008-1.728l11.997%206.998a2%202%200%200%201%20.003%203.458l-12%207A2%202%200%200%201%205%2019z'/%3e%3c/svg%3e", le = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%20class='lucide%20lucide-volume2-icon%20lucide-volume-2'%3e%3cpath%20d='M11%204.702a.705.705%200%200%200-1.203-.498L6.413%207.587A1.4%201.4%200%200%201%205.416%208H3a1%201%200%200%200-1%201v6a1%201%200%200%200%201%201h2.416a1.4%201.4%200%200%201%20.997.413l3.383%203.384A.705.705%200%200%200%2011%2019.298z'/%3e%3cpath%20d='M16%209a5%205%200%200%201%200%206'/%3e%3cpath%20d='M19.364%2018.364a9%209%200%200%200%200-12.728'/%3e%3c/svg%3e", ce = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='currentColor'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%20class='lucide%20lucide-volume-x-icon%20lucide-volume-x'%3e%3cpath%20d='M11%204.702a.705.705%200%200%200-1.203-.498L6.413%207.587A1.4%201.4%200%200%201%205.416%208H3a1%201%200%200%200-1%201v6a1%201%200%200%200%201%201h2.416a1.4%201.4%200%200%201%20.997.413l3.383%203.384A.705.705%200%200%200%2011%2019.298z'/%3e%3cline%20x1='22'%20x2='16'%20y1='9'%20y2='15'/%3e%3cline%20x1='16'%20x2='22'%20y1='9'%20y2='15'/%3e%3c/svg%3e", de = (a) => /* @__PURE__ */ h.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-radio-icon lucide-radio", ...a }, /* @__PURE__ */ h.createElement("path", { d: "M16.247 7.761a6 6 0 0 1 0 8.478" }), /* @__PURE__ */ h.createElement("path", { d: "M19.075 4.933a10 10 0 0 1 0 14.134" }), /* @__PURE__ */ h.createElement("path", { d: "M4.925 19.067a10 10 0 0 1 0-14.134" }), /* @__PURE__ */ h.createElement("path", { d: "M7.753 16.239a6 6 0 0 1 0-8.478" }), /* @__PURE__ */ h.createElement("circle", { cx: 12, cy: 12, r: 2 }));
async function ue(a = !1) {
  try {
    const s = await fetch(
      `https://touch-a-life-dev.web.app/api/v1/talradio/channels?includeAll=${a}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    if (!s.ok)
      throw new Error(`HTTP error! Status: ${s.status}`);
    return await s.json();
  } catch (s) {
    throw console.error("Error fetching channels:", s), s;
  }
}
function G(a = null) {
  switch (a) {
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
const me = "data:image/jpeg;base64,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", ge = ({
  src: a,
  fallback: s = me,
  // ✅ use imported default image
  alt: A = "image",
  className: n,
  style: p
}) => {
  const [i, f] = d(a || s), [b, E] = d(!1);
  return g(() => {
    a ? (f(a), E(!1)) : f(s);
  }, [a, s]), /* @__PURE__ */ t(
    "img",
    {
      src: i,
      alt: A,
      onError: () => {
        i !== s && f(s);
      },
      onLoad: () => E(!0),
      className: `${n || ""} ${b ? "opacity-100" : "opacity-0"} transition-opacity duration-500`,
      style: p,
      loading: "lazy"
    }
  );
}, he = () => {
  const [a, s] = d((/* @__PURE__ */ new Date()).getSeconds()), [A, n] = d(/* @__PURE__ */ new Date());
  g(() => {
    const m = setInterval(() => {
      const x = /* @__PURE__ */ new Date();
      s(x.getSeconds()), x.getSeconds() === 0 && n(x);
    }, 1e3);
    return () => clearInterval(m);
  }, []);
  const p = I(
    () => A.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !0
    }),
    [A]
  ), i = I(
    () => A.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric"
    }),
    [A]
  ), [f, b] = p.split(" "), [E, Q] = f.split(":");
  return /* @__PURE__ */ u("div", { className: "flex justify-between items-center mt-2 text-[11px] text-gray-500 font-mono", children: [
    /* @__PURE__ */ t("span", { children: i }),
    /* @__PURE__ */ u("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ t("span", { className: "w-2 h-2 bg-red-500 rounded-full animate-pulse" }),
      /* @__PURE__ */ u("div", { className: "flex items-baseline text-gray-700 font-semibold", children: [
        /* @__PURE__ */ t("span", { children: E }),
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
        /* @__PURE__ */ t("span", { children: Q }),
        /* @__PURE__ */ t("span", { children: ":" }),
        /* @__PURE__ */ t("span", { className: "ml-1 text-[10px] text-gray-600", children: a.toString().padStart(2, "0") }),
        /* @__PURE__ */ t("span", { className: "ml-1 text-[10px] opacity-80", children: b })
      ] })
    ] }),
    /* @__PURE__ */ t("style", { children: `
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.2; }
          }
        ` })
  ] });
}, fe = (a) => /* @__PURE__ */ h.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-music-icon lucide-music", ...a }, /* @__PURE__ */ h.createElement("path", { d: "M9 18V5l12-2v13" }), /* @__PURE__ */ h.createElement("circle", { cx: 6, cy: 18, r: 3 }), /* @__PURE__ */ h.createElement("circle", { cx: 18, cy: 16, r: 3 })), Ne = ({ firebaseConfig: a }) => {
  var Y;
  const [s, A] = d(!1), [n, p] = d(null), [i, f] = d([]), [b, E] = d(""), Q = R(null), m = R(null), x = R(null), M = R(null), { realtimeDb: B, database: pe } = ie(a), X = (e) => {
    E(G(e)), p(e);
  };
  console.log("Audio SRC:", (Y = m.current) == null ? void 0 : Y.src);
  const [Be, we] = d(!1), [C, j] = d(0.5), [U, O] = d(!1), [F, P] = d(null), [o, K] = d(null), [q, D] = d(!1), y = R(null), T = async (e) => {
    const r = m.current;
    if (!r || !(o != null && o.downloadUrl)) return;
    r.load(), r.src = o.downloadUrl;
    const l = () => {
      s && r.play().catch((c) => {
        console.error("Audio play failed:", c);
      });
    };
    if (e)
      try {
        const c = w(B, `/seekTime/${n}`), N = await _(c);
        if (N.exists() && s) {
          const v = N.val();
          r.currentTime = v || 0, l();
        }
      } catch (c) {
        console.error("Error fetching seek time:", c);
      }
    else
      r.currentTime = 0, l();
  };
  g(() => {
    m.current && (m.current.volume = C);
  }, [C]);
  const W = () => {
    const e = m.current;
    e && (e.src = "", e.currentTime = 0, s && e.pause()), A(!1);
  }, H = (e) => {
    if (!e || !(i != null && i.length)) return;
    const r = i.find(
      (c) => c.name === e
    );
    if (!(r != null && r.name)) return;
    const l = w(
      B,
      `/currentStreaming/${r.name}`
    );
    F && S(F), ee(l, (c) => {
      c.exists() ? K(c.val()) : (K({ title: "Offline", thumbnailUrl: "" }), W());
    }), P(l);
  };
  console.log("LiveRadioWidget", M, x), g(() => {
    if (!(o != null && o.downloadUrl)) return;
    const e = x.current !== o.downloadUrl, r = M.current !== n;
    T(r ? !0 : !e), x.current = o.downloadUrl, M.current = n;
  }, [o]);
  const Z = () => {
    D(!0), ue().then((e) => {
      D(!1), Array.isArray(e == null ? void 0 : e.data) && e.data.length > 0 && f(e.data);
    }).catch((e) => {
      D(!1);
    });
  }, k = () => {
    let e = "";
    n || ((i == null ? void 0 : i.length) > 0 && i.forEach((r) => {
      r.isDefault && (e = r.name);
    }), E(G(e)), e && p(e));
  };
  return g(() => {
    n && H(n);
  }, [n]), g(() => ((i == null ? void 0 : i.length) > 0 ? k() : Z(), () => {
    F && S(F);
    const e = m.current;
    e && s && e.pause();
  }), []), g(() => {
    (i == null ? void 0 : i.length) > 0 && k();
  }, [i]), g(() => {
    const e = m.current;
    if (!e || !n) return;
    const r = Math.random().toString(36).slice(2, 10);
    if (y.current = r, s) {
      if (T(!0), !n || n === "null" || n === "undefined") {
        console.warn(
          "⚠️ Skipping invalid channel for listener registration:",
          n
        );
        return;
      }
      const l = w(
        B,
        `/talRadioCurrentListeners/${n}/${r}`
      );
      J(l, {
        timestamp: Date.now(),
        platform: "web"
      }).catch((v) => console.error("Failed to set listener:", v)), $(l).remove();
      const c = w(
        B,
        "/talRadioListenersCount/totalListeners"
      ), N = w(
        B,
        `/talRadioListenersCount/totalChannelListeners/${n}`
      );
      V(c, (v) => (v || 0) + 1), V(N, (v) => (v || 0) + 1);
    } else if (e.pause(), y.current && n) {
      const l = w(
        B,
        `/talRadioCurrentListeners/${n}/${y.current}`
      );
      L(l).catch(() => {
      });
    }
    return () => {
      if (!n || !y.current) return;
      const l = w(
        B,
        `/talRadioCurrentListeners/${n}/${y.current}`
      );
      L(l).catch(() => {
      });
    };
  }, [s, n]), g(() => {
    const e = m.current;
    e && (e.volume = C);
  }, [C]), g(() => {
    Q.current && Q.current.style.setProperty("--fill", `${C * 100}%`);
  }, [C]), g(() => {
    const e = (r) => {
      if (s) {
        const l = y.current;
        if (l) {
          const c = w(
            B,
            `/talRadioCurrentListeners/${n}/${l}`
          );
          L(c).catch(
            (N) => console.error("Error removing listener:", N)
          );
        }
        r.preventDefault(), r.returnValue = "";
      }
    };
    return window.addEventListener("beforeunload", e), () => {
      window.removeEventListener("beforeunload", e);
    };
  }, [s, n]), // <div className="w-full bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-lg p-6 transition-all duration-300">
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
  /* @__PURE__ */ u("div", { className: "tal-radio-container", children: [
    /* @__PURE__ */ t("div", { className: "tal-header", children: /* @__PURE__ */ u("h2", { className: "tal-header-title", children: [
      /* @__PURE__ */ t(de, { className: "radio-icon" }),
      "TALRadio – Listen, Feel and Act!"
    ] }) }),
    /* @__PURE__ */ t("div", { className: "tal-channel-box", children: q ? /* @__PURE__ */ t("div", { className: "text-xs", children: "Loading languages..." }) : /* @__PURE__ */ t("div", { style: { display: "flex" }, children: ["talradio", "hindi", "telugu", "kannada"].map((e) => /* @__PURE__ */ t(
      "button",
      {
        onClick: () => X(e),
        className: `tal-channel-btn ${n === e ? "active" : ""}`,
        children: e === "talradio" ? "English" : e.charAt(0).toUpperCase() + e.slice(1)
      },
      e
    )) }) }),
    /* @__PURE__ */ u("h3", { className: "tal-title", children: [
      /* @__PURE__ */ t(fe, { className: "music-icon" }),
      /* @__PURE__ */ t("span", { children: (o == null ? void 0 : o.title) || "Now Playing" })
    ] }),
    /* @__PURE__ */ u("div", { className: "tal-main", children: [
      /* @__PURE__ */ u("div", { className: "tal-thumb", children: [
        /* @__PURE__ */ t(ge, { src: o == null ? void 0 : o.thumbnailUrl }),
        s && /* @__PURE__ */ t("div", { className: "tal-equalizer", children: [0, 1, 2, 3].map((e) => /* @__PURE__ */ t("div", { style: { animationDelay: `${e * 0.15}s` } }, e)) })
      ] }),
      /* @__PURE__ */ u("div", { className: "tal-details", children: [
        /* @__PURE__ */ u("p", { className: "tal-meta", children: [
          "Producer: ",
          (o == null ? void 0 : o.producer) || "Unknown"
        ] }),
        /* @__PURE__ */ u("p", { className: "tal-meta", children: [
          "RJ: ",
          (o == null ? void 0 : o.rjUserId) || "Unknown"
        ] }),
        /* @__PURE__ */ u("div", { className: "tal-controls", children: [
          s ? /* @__PURE__ */ t(
            "button",
            {
              onClick: () => A(!1),
              className: "tal-circle-btn pause",
              children: /* @__PURE__ */ t("img", { src: oe, className: "tal-icon" })
            }
          ) : /* @__PURE__ */ t(
            "button",
            {
              onClick: () => A(!0),
              className: "tal-circle-btn play",
              children: /* @__PURE__ */ t("img", { src: Ae, className: "tal-icon" })
            }
          ),
          /* @__PURE__ */ t("button", { onClick: () => O(!U), className: "tal-mute-btn", children: /* @__PURE__ */ t("img", { src: U ? ce : le, className: "volume-icon" }) }),
          /* @__PURE__ */ t(
            "input",
            {
              ref: Q,
              type: "range",
              min: 0,
              max: 1,
              step: 0.01,
              value: C,
              onChange: (e) => {
                const r = parseFloat(e.target.value);
                j(r), e.target.style.setProperty("--fill", `${r * 100}%`);
              },
              className: "custom-volume-slider"
            }
          )
        ] }),
        /* @__PURE__ */ t(he, {})
      ] })
    ] }),
    /* @__PURE__ */ t("audio", { ref: m, muted: U, preload: "auto", loop: !0 })
  ] });
};
export {
  Ne as LiveRadioWidget
};
//# sourceMappingURL=index.esm.js.map
