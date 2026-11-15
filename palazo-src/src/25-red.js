  function c0() {
    let s = { room: null, state: "connecting", myPeer: null, peers: new Map(), onPeers: null, onChange: null },
      e = () => {
        try {
          s.onChange && s.onChange();
        } catch (n) {
          console.error(n);
        }
      };
    ((s.connect = async () => {
      let n = null;
      try {
        n = window.claude && window.claude.use ? await window.claude.use("room") : null;
      } catch {
        n = null;
      }
      if (!n) return ((s.state = "off"), e(), null);
      ((s.room = n), (s.state = n.connected && n.connected() ? "on" : "connecting"));
      let i = () => {
        ((s.state = "off"), e());
      };
      try {
        n.onConnection((r) => {
          ((s.state = r ? "on" : "connecting"), e());
        }, i);
      } catch {}
      return (
        n.onPeers((r) => {
          for (let o of r.peers) o.sameTab && (s.myPeer = o.peer);
          for (let o of r.left) s.peers.delete(o.peer);
          for (let o of r.joined) !o.sameTab && o.kind === "viewer" && s.peers.set(o.peer, o);
          for (let o of r.updated) !o.sameTab && o.kind === "viewer" && s.peers.set(o.peer, o);
          try {
            s.onPeers && s.onPeers(r);
          } catch (o) {
            console.error(o);
          }
          e();
        }, i),
        e(),
        n
      );
    }),
      (s.players = () => [...s.peers.values()].filter((n) => n.presence && n.presence.pz === 1)));
    let t = "";
    return (
      (s.send = (n) => {
        if (!s.room) return;
        let i = JSON.stringify(n);
        i !== t && ((t = i), s.room.presence(n).catch(() => {}));
      }),
      (s.leave = () => {
        ((t = ""), s.room && s.room.presence({ pz: null, hits: null, dl: null, gr: null, gm: null, vt: null }).catch(() => {}));
      }),
      s
    );
  }
