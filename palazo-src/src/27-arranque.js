  var yt = (s) => document.querySelector(s),
    lo = {
      get(s, e) {
        try {
          let t = localStorage.getItem("pzreal." + s);
          return t ? JSON.parse(t) : e;
        } catch {
          return e;
        }
      },
      set(s, e) {
        try {
          localStorage.setItem("pzreal." + s, JSON.stringify(e));
        } catch {}
      },
    },
    Y = { units: [], time: 0, myTeam: 0, TEAMCOL: ["#4da3ff", "#e0503f"], playing: !1, mi: 0, shake: 0, modelOf: $n, OPS: Mf };
  Y.settings = Object.assign({ quality: "auto", sens: 1, fov: 72, vol: 0.8, invert: !1, tp: !1, diff: "medium" }, lo.get("settings", {}));
  Y.saveSettings = () => lo.set("settings", Y.settings);
  Y.diff = Y.settings.diff;
  Y.progress = () => lo.get("progress", {});
  var Ye = Rg(yt("#game"));
  Y.E = Ye;
  Y.applyQuality = () => Ye.setQuality(Y.settings.quality === "auto" ? Ag() : Y.settings.quality);
  Y.applyQuality();

