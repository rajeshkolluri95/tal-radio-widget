import { jsx as t, jsxs as u } from "react/jsx-runtime";
import { useMemo as I, useState as d, useEffect as f, useRef as b } from "react";
import { getDatabase as V, off as z, ref as p, set as Z, onDisconnect as J, runTransaction as S, remove as M, get as $, onValue as _ } from "firebase/database";
import { getApps as ee, getApp as te, initializeApp as ne } from "firebase/app";
import { getStorage as Ae } from "firebase/storage";
import { getFirestore as se } from "firebase/firestore";
import { Radio as ae, Music as re, Pause as ie, Play as oe, VolumeX as le, Volume2 as ce } from "lucide-react";
const de = (i) => I(() => {
  if (!(i != null && i.apiKey))
    throw new Error("Missing Firebase configuration");
  const o = ee().length ? te() : ne(i), n = V(o), h = Ae(o), a = V(o), g = se(o);
  return console.log("✅ Firebase initialized:", o.name), { app: o, database: n, storage: h, realtimeDb: a, firestoreDb: g };
}, [i]);
async function ue(i = !1) {
  try {
    const A = await fetch(
      `https://touch-a-life-dev.web.app/api/v1/talradio/channels?includeAll=${i}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    if (!A.ok)
      throw new Error(`HTTP error! Status: ${A.status}`);
    return await A.json();
  } catch (A) {
    throw console.error("Error fetching channels:", A), A;
  }
}
function G(i = null) {
  switch (i) {
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
const me = "data:image/jpeg;base64,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", fe = ({
  src: i,
  fallback: A = me,
  // ✅ use imported default image
  alt: o = "image",
  className: n,
  style: h
}) => {
  const [a, g] = d(i || A), [w, E] = d(!1);
  return f(() => {
    i ? (g(i), E(!1)) : g(A);
  }, [i, A]), /* @__PURE__ */ t(
    "img",
    {
      src: a,
      alt: o,
      onError: () => {
        a !== A && g(A);
      },
      onLoad: () => E(!0),
      className: `${n || ""} ${w ? "opacity-100" : "opacity-0"} transition-opacity duration-500`,
      style: h,
      loading: "lazy"
    }
  );
}, ge = () => {
  const [i, A] = d((/* @__PURE__ */ new Date()).getSeconds()), [o, n] = d(/* @__PURE__ */ new Date());
  f(() => {
    const m = setInterval(() => {
      const C = /* @__PURE__ */ new Date();
      A(C.getSeconds()), C.getSeconds() === 0 && n(C);
    }, 1e3);
    return () => clearInterval(m);
  }, []);
  const h = I(
    () => o.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !0
    }),
    [o]
  ), a = I(
    () => o.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric"
    }),
    [o]
  ), [g, w] = h.split(" "), [E, N] = g.split(":");
  return /* @__PURE__ */ u("div", { className: "flex justify-between items-center mt-2 text-[11px] text-gray-500 font-mono", children: [
    /* @__PURE__ */ t("span", { children: a }),
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
        /* @__PURE__ */ t("span", { children: N }),
        /* @__PURE__ */ t("span", { children: ":" }),
        /* @__PURE__ */ t("span", { className: "ml-1 text-[10px] text-gray-600", children: i.toString().padStart(2, "0") }),
        /* @__PURE__ */ t("span", { className: "ml-1 text-[10px] opacity-80", children: w })
      ] })
    ] }),
    /* @__PURE__ */ t("style", { children: `
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.2; }
          }
        ` })
  ] });
}, be = ({ firebaseConfig: i }) => {
  var Y;
  const [A, o] = d(!1), [n, h] = d(null), [a, g] = d([]), [w, E] = d(""), N = b(null), m = b(null), C = b(null), U = b(null), { realtimeDb: B, database: he } = de(i), X = (e) => {
    E(G(e)), h(e);
  };
  console.log("Audio SRC:", (Y = m.current) == null ? void 0 : Y.src);
  const [Be, pe] = d(!1), [Q, O] = d(0.5), [D, P] = d(!1), [F, q] = d(null), [r, K] = d(null), [j, v] = d(!1), R = b(null), L = async (e) => {
    const s = m.current;
    if (!s || !(r != null && r.downloadUrl)) return;
    s.load(), s.src = r.downloadUrl;
    const l = () => {
      A && s.play().catch((c) => {
        console.error("Audio play failed:", c);
      });
    };
    if (e)
      try {
        const c = p(B, `/seekTime/${n}`), y = await $(c);
        if (y.exists() && A) {
          const x = y.val();
          s.currentTime = x || 0, l();
        }
      } catch (c) {
        console.error("Error fetching seek time:", c);
      }
    else
      s.currentTime = 0, l();
  };
  f(() => {
    m.current && (m.current.volume = Q);
  }, [Q]);
  const W = () => {
    const e = m.current;
    e && (e.src = "", e.currentTime = 0, A && e.pause()), o(!1);
  }, k = (e) => {
    if (!e || !(a != null && a.length)) return;
    const s = a.find(
      (c) => c.name === e
    );
    if (!(s != null && s.name)) return;
    const l = p(
      B,
      `/currentStreaming/${s.name}`
    );
    F && z(F), _(l, (c) => {
      c.exists() ? K(c.val()) : (K({ title: "Offline", thumbnailUrl: "" }), W());
    }), q(l);
  };
  console.log("LiveRadioWidget", U, C), f(() => {
    if (!(r != null && r.downloadUrl)) return;
    const e = C.current !== r.downloadUrl, s = U.current !== n;
    L(s ? !0 : !e), C.current = r.downloadUrl, U.current = n;
  }, [r]);
  const H = () => {
    v(!0), ue().then((e) => {
      v(!1), Array.isArray(e == null ? void 0 : e.data) && e.data.length > 0 && g(e.data);
    }).catch((e) => {
      v(!1);
    });
  }, T = () => {
    let e = "";
    n || ((a == null ? void 0 : a.length) > 0 && a.forEach((s) => {
      s.isDefault && (e = s.name);
    }), E(G(e)), e && h(e));
  };
  return f(() => {
    n && k(n);
  }, [n]), f(() => ((a == null ? void 0 : a.length) > 0 ? T() : H(), () => {
    F && z(F);
    const e = m.current;
    e && A && e.pause();
  }), []), f(() => {
    (a == null ? void 0 : a.length) > 0 && T();
  }, [a]), f(() => {
    const e = m.current;
    if (!e || !n) return;
    const s = Math.random().toString(36).slice(2, 10);
    if (R.current = s, A) {
      if (L(!0), !n || n === "null" || n === "undefined") {
        console.warn(
          "⚠️ Skipping invalid channel for listener registration:",
          n
        );
        return;
      }
      const l = p(
        B,
        `/talRadioCurrentListeners/${n}/${s}`
      );
      Z(l, {
        timestamp: Date.now(),
        platform: "web"
      }).catch((x) => console.error("Failed to set listener:", x)), J(l).remove();
      const c = p(
        B,
        "/talRadioListenersCount/totalListeners"
      ), y = p(
        B,
        `/talRadioListenersCount/totalChannelListeners/${n}`
      );
      S(c, (x) => (x || 0) + 1), S(y, (x) => (x || 0) + 1);
    } else if (e.pause(), R.current && n) {
      const l = p(
        B,
        `/talRadioCurrentListeners/${n}/${R.current}`
      );
      M(l).catch(() => {
      });
    }
    return () => {
      if (!n || !R.current) return;
      const l = p(
        B,
        `/talRadioCurrentListeners/${n}/${R.current}`
      );
      M(l).catch(() => {
      });
    };
  }, [A, n]), f(() => {
    const e = m.current;
    e && (e.volume = Q);
  }, [Q]), f(() => {
    N.current && N.current.style.setProperty("--fill", `${Q * 100}%`);
  }, [Q]), f(() => {
    const e = (s) => {
      if (A) {
        const l = R.current;
        if (l) {
          const c = p(
            B,
            `/talRadioCurrentListeners/${n}/${l}`
          );
          M(c).catch(
            (y) => console.error("Error removing listener:", y)
          );
        }
        s.preventDefault(), s.returnValue = "";
      }
    };
    return window.addEventListener("beforeunload", e), () => {
      window.removeEventListener("beforeunload", e);
    };
  }, [A, n]), // <div className="w-full bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-lg p-6 transition-all duration-300">
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
      /* @__PURE__ */ t(ae, { className: "radio-icon" }),
      "TALRadio – Listen, Feel and Act!"
    ] }) }),
    /* @__PURE__ */ t("div", { className: "tal-channel-box", children: j ? /* @__PURE__ */ t("div", { className: "text-xs", children: "Loading languages..." }) : /* @__PURE__ */ t("div", { style: { display: "flex" }, children: ["talradio", "hindi", "telugu", "kannada"].map((e) => /* @__PURE__ */ t(
      "button",
      {
        onClick: () => X(e),
        className: `tal-channel-btn ${n === e ? "active" : ""}`,
        children: e === "talradio" ? "English" : e.charAt(0).toUpperCase() + e.slice(1)
      },
      e
    )) }) }),
    /* @__PURE__ */ u("h3", { className: "tal-title", children: [
      /* @__PURE__ */ t(re, { className: "music-icon" }),
      /* @__PURE__ */ t("span", { children: (r == null ? void 0 : r.title) || "Now Playing" })
    ] }),
    /* @__PURE__ */ u("div", { className: "tal-main", children: [
      /* @__PURE__ */ u("div", { className: "tal-thumb", children: [
        /* @__PURE__ */ t(fe, { src: r == null ? void 0 : r.thumbnailUrl }),
        A && /* @__PURE__ */ t("div", { className: "tal-equalizer", children: [0, 1, 2, 3].map((e) => /* @__PURE__ */ t("div", { style: { animationDelay: `${e * 0.15}s` } }, e)) })
      ] }),
      /* @__PURE__ */ u("div", { className: "tal-details", children: [
        /* @__PURE__ */ u("p", { className: "tal-meta", children: [
          "Producer: ",
          (r == null ? void 0 : r.producer) || "Unknown"
        ] }),
        /* @__PURE__ */ u("p", { className: "tal-meta", children: [
          "RJ: ",
          (r == null ? void 0 : r.rjUserId) || "Unknown"
        ] }),
        /* @__PURE__ */ u("div", { className: "tal-controls", children: [
          A ? /* @__PURE__ */ t(
            "button",
            {
              onClick: () => o(!1),
              className: "tal-circle-btn pause",
              children: /* @__PURE__ */ t(ie, { className: "tal-icon" })
            }
          ) : /* @__PURE__ */ t(
            "button",
            {
              onClick: () => o(!0),
              className: "tal-circle-btn play",
              children: /* @__PURE__ */ t(oe, { className: "tal-icon" })
            }
          ),
          /* @__PURE__ */ t("button", { onClick: () => P(!D), className: "tal-mute-btn", children: D ? /* @__PURE__ */ t(le, { className: "volume-icon" }) : /* @__PURE__ */ t(ce, { cclassName: "volume-icon" }) }),
          /* @__PURE__ */ t(
            "input",
            {
              ref: N,
              type: "range",
              min: 0,
              max: 1,
              step: 0.01,
              value: Q,
              onChange: (e) => {
                const s = parseFloat(e.target.value);
                O(s), e.target.style.setProperty("--fill", `${s * 100}%`);
              },
              className: "custom-volume-slider"
            }
          )
        ] }),
        /* @__PURE__ */ t(ge, {})
      ] })
    ] }),
    /* @__PURE__ */ t("audio", { ref: m, muted: D, preload: "auto", loop: !0 })
  ] });
};
export {
  be as LiveRadioWidget
};
