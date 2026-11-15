  function da(s, e = !1) {
    let t = s[0].index !== null,
      n = new Set(Object.keys(s[0].attributes)),
      i = new Set(Object.keys(s[0].morphAttributes)),
      r = {},
      o = {},
      a = s[0].morphTargetsRelative,
      c = new Ue(),
      h = 0;
    for (let l = 0; l < s.length; ++l) {
      let u = s[l],
        d = 0;
      if (t !== (u.index !== null))
        return (
          console.error(
            "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
              l +
              ". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.",
          ),
          null
        );
      for (let p in u.attributes) {
        if (!n.has(p))
          return (
            console.error(
              "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
                l +
                '. All geometries must have compatible attributes; make sure "' +
                p +
                '" attribute exists among all geometries, or in none of them.',
            ),
            null
          );
        (r[p] === void 0 && (r[p] = []), r[p].push(u.attributes[p]), d++);
      }
      if (d !== n.size)
        return (
          console.error(
            "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
              l +
              ". Make sure all geometries have the same number of attributes.",
          ),
          null
        );
      if (a !== u.morphTargetsRelative)
        return (
          console.error(
            "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
              l +
              ". .morphTargetsRelative must be consistent throughout all geometries.",
          ),
          null
        );
      for (let p in u.morphAttributes) {
        if (!i.has(p))
          return (
            console.error(
              "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
                l +
                ".  .morphAttributes must be consistent throughout all geometries.",
            ),
            null
          );
        (o[p] === void 0 && (o[p] = []), o[p].push(u.morphAttributes[p]));
      }
      if (e) {
        let p;
        if (t) p = u.index.count;
        else if (u.attributes.position !== void 0) p = u.attributes.position.count;
        else
          return (
            console.error(
              "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
                l +
                ". The geometry must have either an index or a position attribute",
            ),
            null
          );
        (c.addGroup(h, p, l), (h += p));
      }
    }
    if (t) {
      let l = 0,
        u = [];
      for (let d = 0; d < s.length; ++d) {
        let p = s[d].index;
        for (let g = 0; g < p.count; ++g) u.push(p.getX(g) + l);
        l += s[d].attributes.position.count;
      }
      c.setIndex(u);
    }
    for (let l in r) {
      let u = Cg(r[l]);
      if (!u) return (console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " + l + " attribute."), null);
      c.setAttribute(l, u);
    }
    for (let l in o) {
      let u = o[l][0].length;
      if (u === 0) break;
      ((c.morphAttributes = c.morphAttributes || {}), (c.morphAttributes[l] = []));
      for (let d = 0; d < u; ++d) {
        let p = [];
        for (let y = 0; y < o[l].length; ++y) p.push(o[l][y][d]);
        let g = Cg(p);
        if (!g) return (console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " + l + " morphAttribute."), null);
        c.morphAttributes[l].push(g);
      }
    }
    return c;
  }
  function Cg(s) {
    let e,
      t,
      n,
      i = -1,
      r = 0;
    for (let h = 0; h < s.length; ++h) {
      let l = s[h];
      if (l.isInterleavedBufferAttribute)
        return (console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."), null);
      if ((e === void 0 && (e = l.array.constructor), e !== l.array.constructor))
        return (
          console.error(
            "THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.",
          ),
          null
        );
      if ((t === void 0 && (t = l.itemSize), t !== l.itemSize))
        return (
          console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),
          null
        );
      if ((n === void 0 && (n = l.normalized), n !== l.normalized))
        return (
          console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),
          null
        );
      if ((i === -1 && (i = l.gpuType), i !== l.gpuType))
        return (
          console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),
          null
        );
      r += l.array.length;
    }
    let o = new e(r),
      a = 0;
    for (let h = 0; h < s.length; ++h) (o.set(s[h].array, a), (a += s[h].array.length));
    let c = new Ge(o, t, n);
    return (i !== void 0 && (c.gpuType = i), c);
  }
  function Fd(s, e) {
    if (e === Ad) return (console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), s);
    if (e === jr || e === ca) {
      let t = s.getIndex();
      if (t === null) {
        let o = [],
          a = s.getAttribute("position");
        if (a !== void 0) {
          for (let c = 0; c < a.count; c++) o.push(c);
          (s.setIndex(o), (t = s.getIndex()));
        } else return (console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."), s);
      }
      let n = t.count - 2,
        i = [];
      if (e === jr) for (let o = 1; o <= n; o++) (i.push(t.getX(0)), i.push(t.getX(o)), i.push(t.getX(o + 1)));
      else
        for (let o = 0; o < n; o++)
          o % 2 === 0 ? (i.push(t.getX(o)), i.push(t.getX(o + 1)), i.push(t.getX(o + 2))) : (i.push(t.getX(o + 2)), i.push(t.getX(o + 1)), i.push(t.getX(o)));
      i.length / 3 !== n && console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
      let r = s.clone();
      return (r.setIndex(i), r.clearGroups(), r);
    } else return (console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", e), s);
  }
  var Lc = class extends Kt {
    constructor(e) {
      (super(e),
        (this.dracoLoader = null),
        (this.ktx2Loader = null),
        (this.meshoptDecoder = null),
        (this.pluginCallbacks = []),
        this.register(function (t) {
          return new Xd(t);
        }),
        this.register(function (t) {
          return new ef(t);
        }),
        this.register(function (t) {
          return new tf(t);
        }),
        this.register(function (t) {
          return new nf(t);
        }),
        this.register(function (t) {
          return new Yd(t);
        }),
        this.register(function (t) {
          return new Zd(t);
        }),
        this.register(function (t) {
          return new Kd(t);
        }),
        this.register(function (t) {
          return new Jd(t);
        }),
        this.register(function (t) {
          return new Gd(t);
        }),
        this.register(function (t) {
          return new jd(t);
        }),
        this.register(function (t) {
          return new qd(t);
        }),
        this.register(function (t) {
          return new Qd(t);
        }),
        this.register(function (t) {
          return new $d(t);
        }),
        this.register(function (t) {
          return new Vd(t);
        }),
        this.register(function (t) {
          return new sf(t);
        }),
        this.register(function (t) {
          return new rf(t);
        }));
    }
    load(e, t, n, i) {
      let r = this,
        o;
      if (this.resourcePath !== "") o = this.resourcePath;
      else if (this.path !== "") {
        let h = Jn.extractUrlBase(e);
        o = Jn.resolveURL(h, this.path);
      } else o = Jn.extractUrlBase(e);
      this.manager.itemStart(e);
      let a = function (h) {
          (i ? i(h) : console.error(h), r.manager.itemError(e), r.manager.itemEnd(e));
        },
        c = new _n(this.manager);
      (c.setPath(this.path),
        c.setResponseType("arraybuffer"),
        c.setRequestHeader(this.requestHeader),
        c.setWithCredentials(this.withCredentials),
        c.load(
          e,
          function (h) {
            try {
              r.parse(
                h,
                o,
                function (l) {
                  (t(l), r.manager.itemEnd(e));
                },
                a,
              );
            } catch (l) {
              a(l);
            }
          },
          n,
          a,
        ));
    }
    setDRACOLoader(e) {
      return ((this.dracoLoader = e), this);
    }
    setDDSLoader() {
      throw new Error('THREE.GLTFLoader: "MSFT_texture_dds" no longer supported. Please update to "KHR_texture_basisu".');
    }
    setKTX2Loader(e) {
      return ((this.ktx2Loader = e), this);
    }
    setMeshoptDecoder(e) {
      return ((this.meshoptDecoder = e), this);
    }
    register(e) {
      return (this.pluginCallbacks.indexOf(e) === -1 && this.pluginCallbacks.push(e), this);
    }
    unregister(e) {
      return (this.pluginCallbacks.indexOf(e) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1), this);
    }
    parse(e, t, n, i) {
      let r,
        o = {},
        a = {},
        c = new TextDecoder();
      if (typeof e == "string") r = JSON.parse(e);
      else if (e instanceof ArrayBuffer)
        if (c.decode(new Uint8Array(e, 0, 4)) === Dg) {
          try {
            o[rt.KHR_BINARY_GLTF] = new of(e);
          } catch (u) {
            i && i(u);
            return;
          }
          r = JSON.parse(o[rt.KHR_BINARY_GLTF].content);
        } else r = JSON.parse(c.decode(e));
      else r = e;
      if (r.asset === void 0 || r.asset.version[0] < 2) {
        i && i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
        return;
      }
      let h = new ff(r, {
        path: t || this.resourcePath || "",
        crossOrigin: this.crossOrigin,
        requestHeader: this.requestHeader,
        manager: this.manager,
        ktx2Loader: this.ktx2Loader,
        meshoptDecoder: this.meshoptDecoder,
      });
      h.fileLoader.setRequestHeader(this.requestHeader);
      for (let l = 0; l < this.pluginCallbacks.length; l++) {
        let u = this.pluginCallbacks[l](h);
        (u.name || console.error("THREE.GLTFLoader: Invalid plugin found: missing name"), (a[u.name] = u), (o[u.name] = !0));
      }
      if (r.extensionsUsed)
        for (let l = 0; l < r.extensionsUsed.length; ++l) {
          let u = r.extensionsUsed[l],
            d = r.extensionsRequired || [];
          switch (u) {
            case rt.KHR_MATERIALS_UNLIT:
              o[u] = new Wd();
              break;
            case rt.KHR_DRACO_MESH_COMPRESSION:
              o[u] = new af(r, this.dracoLoader);
              break;
            case rt.KHR_TEXTURE_TRANSFORM:
              o[u] = new lf();
              break;
            case rt.KHR_MESH_QUANTIZATION:
              o[u] = new cf();
              break;
            default:
              d.indexOf(u) >= 0 && a[u] === void 0 && console.warn('THREE.GLTFLoader: Unknown extension "' + u + '".');
          }
        }
      (h.setExtensions(o), h.setPlugins(a), h.parse(n, i));
    }
    parseAsync(e, t) {
      let n = this;
      return new Promise(function (i, r) {
        n.parse(e, t, i, r);
      });
    }
  };
  function ab() {
    let s = {};
    return {
      get: function (e) {
        return s[e];
      },
      add: function (e, t) {
        s[e] = t;
      },
      remove: function (e) {
        delete s[e];
      },
      removeAll: function () {
        s = {};
      },
    };
  }
  var rt = {
      KHR_BINARY_GLTF: "KHR_binary_glTF",
      KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
      KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
      KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
      KHR_MATERIALS_IOR: "KHR_materials_ior",
      KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
      KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
      KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
      KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
      KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy",
      KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
      KHR_MATERIALS_VOLUME: "KHR_materials_volume",
      KHR_TEXTURE_BASISU: "KHR_texture_basisu",
      KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
      KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
      KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
      EXT_MATERIALS_BUMP: "EXT_materials_bump",
      EXT_TEXTURE_WEBP: "EXT_texture_webp",
      EXT_TEXTURE_AVIF: "EXT_texture_avif",
      EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
      EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing",
    },
    Vd = class {
      constructor(e) {
        ((this.parser = e), (this.name = rt.KHR_LIGHTS_PUNCTUAL), (this.cache = { refs: {}, uses: {} }));
      }
      _markDefs() {
        let e = this.parser,
          t = this.parser.json.nodes || [];
        for (let n = 0, i = t.length; n < i; n++) {
          let r = t[n];
          r.extensions && r.extensions[this.name] && r.extensions[this.name].light !== void 0 && e._addNodeRef(this.cache, r.extensions[this.name].light);
        }
      }
      _loadLight(e) {
        let t = this.parser,
          n = "light:" + e,
          i = t.cache.get(n);
        if (i) return i;
        let r = t.json,
          c = (((r.extensions && r.extensions[this.name]) || {}).lights || [])[e],
          h,
          l = new pe(16777215);
        c.color !== void 0 && l.setRGB(c.color[0], c.color[1], c.color[2], Bt);
        let u = c.range !== void 0 ? c.range : 0;
        switch (c.type) {
          case "directional":
            ((h = new as(l)), h.target.position.set(0, 0, -1), h.add(h.target));
            break;
          case "point":
            ((h = new di(l)), (h.distance = u));
            break;
          case "spot":
            ((h = new Yr(l)),
              (h.distance = u),
              (c.spot = c.spot || {}),
              (c.spot.innerConeAngle = c.spot.innerConeAngle !== void 0 ? c.spot.innerConeAngle : 0),
              (c.spot.outerConeAngle = c.spot.outerConeAngle !== void 0 ? c.spot.outerConeAngle : Math.PI / 4),
              (h.angle = c.spot.outerConeAngle),
              (h.penumbra = 1 - c.spot.innerConeAngle / c.spot.outerConeAngle),
              h.target.position.set(0, 0, -1),
              h.add(h.target));
            break;
          default:
            throw new Error("THREE.GLTFLoader: Unexpected light type: " + c.type);
        }
        return (
          h.position.set(0, 0, 0),
          (h.decay = 2),
          ds(h, c),
          c.intensity !== void 0 && (h.intensity = c.intensity),
          (h.name = t.createUniqueName(c.name || "light_" + e)),
          (i = Promise.resolve(h)),
          t.cache.add(n, i),
          i
        );
      }
      getDependency(e, t) {
        if (e === "light") return this._loadLight(t);
      }
      createNodeAttachment(e) {
        let t = this,
          n = this.parser,
          r = n.json.nodes[e],
          a = ((r.extensions && r.extensions[this.name]) || {}).light;
        return a === void 0
          ? null
          : this._loadLight(a).then(function (c) {
              return n._getNodeRef(t.cache, a, c);
            });
      }
    },
    Wd = class {
      constructor() {
        this.name = rt.KHR_MATERIALS_UNLIT;
      }
      getMaterialType() {
        return ot;
      }
      extendParams(e, t, n) {
        let i = [];
        ((e.color = new pe(1, 1, 1)), (e.opacity = 1));
        let r = t.pbrMetallicRoughness;
        if (r) {
          if (Array.isArray(r.baseColorFactor)) {
            let o = r.baseColorFactor;
            (e.color.setRGB(o[0], o[1], o[2], Bt), (e.opacity = o[3]));
          }
          r.baseColorTexture !== void 0 && i.push(n.assignTexture(e, "map", r.baseColorTexture, ht));
        }
        return Promise.all(i);
      }
    },
    Gd = class {
      constructor(e) {
        ((this.parser = e), (this.name = rt.KHR_MATERIALS_EMISSIVE_STRENGTH));
      }
      extendMaterialParams(e, t) {
        let i = this.parser.json.materials[e];
        if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
        let r = i.extensions[this.name].emissiveStrength;
        return (r !== void 0 && (t.emissiveIntensity = r), Promise.resolve());
      }
    },
    Xd = class {
      constructor(e) {
        ((this.parser = e), (this.name = rt.KHR_MATERIALS_CLEARCOAT));
      }
      getMaterialType(e) {
        let n = this.parser.json.materials[e];
        return !n.extensions || !n.extensions[this.name] ? null : vn;
      }
      extendMaterialParams(e, t) {
        let n = this.parser,
          i = n.json.materials[e];
        if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
        let r = [],
          o = i.extensions[this.name];
        if (
          (o.clearcoatFactor !== void 0 && (t.clearcoat = o.clearcoatFactor),
          o.clearcoatTexture !== void 0 && r.push(n.assignTexture(t, "clearcoatMap", o.clearcoatTexture)),
          o.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = o.clearcoatRoughnessFactor),
          o.clearcoatRoughnessTexture !== void 0 && r.push(n.assignTexture(t, "clearcoatRoughnessMap", o.clearcoatRoughnessTexture)),
          o.clearcoatNormalTexture !== void 0 &&
            (r.push(n.assignTexture(t, "clearcoatNormalMap", o.clearcoatNormalTexture)), o.clearcoatNormalTexture.scale !== void 0))
        ) {
          let a = o.clearcoatNormalTexture.scale;
          t.clearcoatNormalScale = new ae(a, a);
        }
        return Promise.all(r);
      }
    },
    qd = class {
      constructor(e) {
        ((this.parser = e), (this.name = rt.KHR_MATERIALS_IRIDESCENCE));
      }
      getMaterialType(e) {
        let n = this.parser.json.materials[e];
        return !n.extensions || !n.extensions[this.name] ? null : vn;
      }
      extendMaterialParams(e, t) {
        let n = this.parser,
          i = n.json.materials[e];
        if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
        let r = [],
          o = i.extensions[this.name];
        return (
          o.iridescenceFactor !== void 0 && (t.iridescence = o.iridescenceFactor),
          o.iridescenceTexture !== void 0 && r.push(n.assignTexture(t, "iridescenceMap", o.iridescenceTexture)),
          o.iridescenceIor !== void 0 && (t.iridescenceIOR = o.iridescenceIor),
          t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]),
          o.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = o.iridescenceThicknessMinimum),
          o.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = o.iridescenceThicknessMaximum),
          o.iridescenceThicknessTexture !== void 0 && r.push(n.assignTexture(t, "iridescenceThicknessMap", o.iridescenceThicknessTexture)),
          Promise.all(r)
        );
      }
    },
    Yd = class {
      constructor(e) {
        ((this.parser = e), (this.name = rt.KHR_MATERIALS_SHEEN));
      }
      getMaterialType(e) {
        let n = this.parser.json.materials[e];
        return !n.extensions || !n.extensions[this.name] ? null : vn;
      }
      extendMaterialParams(e, t) {
        let n = this.parser,
          i = n.json.materials[e];
        if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
        let r = [];
        ((t.sheenColor = new pe(0, 0, 0)), (t.sheenRoughness = 0), (t.sheen = 1));
        let o = i.extensions[this.name];
        if (o.sheenColorFactor !== void 0) {
          let a = o.sheenColorFactor;
          t.sheenColor.setRGB(a[0], a[1], a[2], Bt);
        }
        return (
          o.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = o.sheenRoughnessFactor),
          o.sheenColorTexture !== void 0 && r.push(n.assignTexture(t, "sheenColorMap", o.sheenColorTexture, ht)),
          o.sheenRoughnessTexture !== void 0 && r.push(n.assignTexture(t, "sheenRoughnessMap", o.sheenRoughnessTexture)),
          Promise.all(r)
        );
      }
    },
    Zd = class {
      constructor(e) {
        ((this.parser = e), (this.name = rt.KHR_MATERIALS_TRANSMISSION));
      }
      getMaterialType(e) {
        let n = this.parser.json.materials[e];
        return !n.extensions || !n.extensions[this.name] ? null : vn;
      }
      extendMaterialParams(e, t) {
        let n = this.parser,
          i = n.json.materials[e];
        if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
        let r = [],
          o = i.extensions[this.name];
        return (
          o.transmissionFactor !== void 0 && (t.transmission = o.transmissionFactor),
          o.transmissionTexture !== void 0 && r.push(n.assignTexture(t, "transmissionMap", o.transmissionTexture)),
          Promise.all(r)
        );
      }
    },
    Kd = class {
      constructor(e) {
        ((this.parser = e), (this.name = rt.KHR_MATERIALS_VOLUME));
      }
      getMaterialType(e) {
        let n = this.parser.json.materials[e];
        return !n.extensions || !n.extensions[this.name] ? null : vn;
      }
      extendMaterialParams(e, t) {
        let n = this.parser,
          i = n.json.materials[e];
        if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
        let r = [],
          o = i.extensions[this.name];
        ((t.thickness = o.thicknessFactor !== void 0 ? o.thicknessFactor : 0),
          o.thicknessTexture !== void 0 && r.push(n.assignTexture(t, "thicknessMap", o.thicknessTexture)),
          (t.attenuationDistance = o.attenuationDistance || 1 / 0));
        let a = o.attenuationColor || [1, 1, 1];
        return ((t.attenuationColor = new pe().setRGB(a[0], a[1], a[2], Bt)), Promise.all(r));
      }
    },
    Jd = class {
      constructor(e) {
        ((this.parser = e), (this.name = rt.KHR_MATERIALS_IOR));
      }
      getMaterialType(e) {
        let n = this.parser.json.materials[e];
        return !n.extensions || !n.extensions[this.name] ? null : vn;
      }
      extendMaterialParams(e, t) {
        let i = this.parser.json.materials[e];
        if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
        let r = i.extensions[this.name];
        return ((t.ior = r.ior !== void 0 ? r.ior : 1.5), Promise.resolve());
      }
    },
    jd = class {
      constructor(e) {
        ((this.parser = e), (this.name = rt.KHR_MATERIALS_SPECULAR));
      }
      getMaterialType(e) {
        let n = this.parser.json.materials[e];
        return !n.extensions || !n.extensions[this.name] ? null : vn;
      }
      extendMaterialParams(e, t) {
        let n = this.parser,
          i = n.json.materials[e];
        if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
        let r = [],
          o = i.extensions[this.name];
        ((t.specularIntensity = o.specularFactor !== void 0 ? o.specularFactor : 1),
          o.specularTexture !== void 0 && r.push(n.assignTexture(t, "specularIntensityMap", o.specularTexture)));
        let a = o.specularColorFactor || [1, 1, 1];
        return (
          (t.specularColor = new pe().setRGB(a[0], a[1], a[2], Bt)),
          o.specularColorTexture !== void 0 && r.push(n.assignTexture(t, "specularColorMap", o.specularColorTexture, ht)),
          Promise.all(r)
        );
      }
    },
    $d = class {
      constructor(e) {
        ((this.parser = e), (this.name = rt.EXT_MATERIALS_BUMP));
      }
      getMaterialType(e) {
        let n = this.parser.json.materials[e];
        return !n.extensions || !n.extensions[this.name] ? null : vn;
      }
      extendMaterialParams(e, t) {
        let n = this.parser,
          i = n.json.materials[e];
        if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
        let r = [],
          o = i.extensions[this.name];
        return (
          (t.bumpScale = o.bumpFactor !== void 0 ? o.bumpFactor : 1),
          o.bumpTexture !== void 0 && r.push(n.assignTexture(t, "bumpMap", o.bumpTexture)),
          Promise.all(r)
        );
      }
    },
    Qd = class {
      constructor(e) {
        ((this.parser = e), (this.name = rt.KHR_MATERIALS_ANISOTROPY));
      }
      getMaterialType(e) {
        let n = this.parser.json.materials[e];
        return !n.extensions || !n.extensions[this.name] ? null : vn;
      }
      extendMaterialParams(e, t) {
        let n = this.parser,
          i = n.json.materials[e];
        if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
        let r = [],
          o = i.extensions[this.name];
        return (
          o.anisotropyStrength !== void 0 && (t.anisotropy = o.anisotropyStrength),
          o.anisotropyRotation !== void 0 && (t.anisotropyRotation = o.anisotropyRotation),
          o.anisotropyTexture !== void 0 && r.push(n.assignTexture(t, "anisotropyMap", o.anisotropyTexture)),
          Promise.all(r)
        );
      }
    },
    ef = class {
      constructor(e) {
        ((this.parser = e), (this.name = rt.KHR_TEXTURE_BASISU));
      }
      loadTexture(e) {
        let t = this.parser,
          n = t.json,
          i = n.textures[e];
        if (!i.extensions || !i.extensions[this.name]) return null;
        let r = i.extensions[this.name],
          o = t.options.ktx2Loader;
        if (!o) {
          if (n.extensionsRequired && n.extensionsRequired.indexOf(this.name) >= 0)
            throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
          return null;
        }
        return t.loadTextureImage(e, r.source, o);
      }
    },
    tf = class {
      constructor(e) {
        ((this.parser = e), (this.name = rt.EXT_TEXTURE_WEBP), (this.isSupported = null));
      }
      loadTexture(e) {
        let t = this.name,
          n = this.parser,
          i = n.json,
          r = i.textures[e];
        if (!r.extensions || !r.extensions[t]) return null;
        let o = r.extensions[t],
          a = i.images[o.source],
          c = n.textureLoader;
        if (a.uri) {
          let h = n.options.manager.getHandler(a.uri);
          h !== null && (c = h);
        }
        return this.detectSupport().then(function (h) {
          if (h) return n.loadTextureImage(e, o.source, c);
          if (i.extensionsRequired && i.extensionsRequired.indexOf(t) >= 0) throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");
          return n.loadTexture(e);
        });
      }
      detectSupport() {
        return (
          this.isSupported ||
            (this.isSupported = new Promise(function (e) {
              let t = new Image();
              ((t.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA"),
                (t.onload = t.onerror =
                  function () {
                    e(t.height === 1);
                  }));
            })),
          this.isSupported
        );
      }
    },
    nf = class {
      constructor(e) {
        ((this.parser = e), (this.name = rt.EXT_TEXTURE_AVIF), (this.isSupported = null));
      }
      loadTexture(e) {
        let t = this.name,
          n = this.parser,
          i = n.json,
          r = i.textures[e];
        if (!r.extensions || !r.extensions[t]) return null;
        let o = r.extensions[t],
          a = i.images[o.source],
          c = n.textureLoader;
        if (a.uri) {
          let h = n.options.manager.getHandler(a.uri);
          h !== null && (c = h);
        }
        return this.detectSupport().then(function (h) {
          if (h) return n.loadTextureImage(e, o.source, c);
          if (i.extensionsRequired && i.extensionsRequired.indexOf(t) >= 0) throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");
          return n.loadTexture(e);
        });
      }
      detectSupport() {
        return (
          this.isSupported ||
            (this.isSupported = new Promise(function (e) {
              let t = new Image();
              ((t.src =
                "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI="),
                (t.onload = t.onerror =
                  function () {
                    e(t.height === 1);
                  }));
            })),
          this.isSupported
        );
      }
    },
    sf = class {
      constructor(e) {
        ((this.name = rt.EXT_MESHOPT_COMPRESSION), (this.parser = e));
      }
      loadBufferView(e) {
        let t = this.parser.json,
          n = t.bufferViews[e];
        if (n.extensions && n.extensions[this.name]) {
          let i = n.extensions[this.name],
            r = this.parser.getDependency("buffer", i.buffer),
            o = this.parser.options.meshoptDecoder;
          if (!o || !o.supported) {
            if (t.extensionsRequired && t.extensionsRequired.indexOf(this.name) >= 0)
              throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
            return null;
          }
          return r.then(function (a) {
            let c = i.byteOffset || 0,
              h = i.byteLength || 0,
              l = i.count,
              u = i.byteStride,
              d = new Uint8Array(a, c, h);
            return o.decodeGltfBufferAsync
              ? o.decodeGltfBufferAsync(l, u, d, i.mode, i.filter).then(function (p) {
                  return p.buffer;
                })
              : o.ready.then(function () {
                  let p = new ArrayBuffer(l * u);
                  return (o.decodeGltfBuffer(new Uint8Array(p), l, u, d, i.mode, i.filter), p);
                });
          });
        } else return null;
      }
    },
    rf = class {
      constructor(e) {
        ((this.name = rt.EXT_MESH_GPU_INSTANCING), (this.parser = e));
      }
      createNodeMesh(e) {
        let t = this.parser.json,
          n = t.nodes[e];
        if (!n.extensions || !n.extensions[this.name] || n.mesh === void 0) return null;
        let i = t.meshes[n.mesh];
        for (let h of i.primitives) if (h.mode !== Un.TRIANGLES && h.mode !== Un.TRIANGLE_STRIP && h.mode !== Un.TRIANGLE_FAN && h.mode !== void 0) return null;
        let o = n.extensions[this.name].attributes,
          a = [],
          c = {};
        for (let h in o) a.push(this.parser.getDependency("accessor", o[h]).then((l) => ((c[h] = l), c[h])));
        return a.length < 1
          ? null
          : (a.push(this.parser.createNodeMesh(e)),
            Promise.all(a).then((h) => {
              let l = h.pop(),
                u = l.isGroup ? l.children : [l],
                d = h[0].count,
                p = [];
              for (let g of u) {
                let y = new ze(),
                  m = new C(),
                  f = new Dt(),
                  v = new C(1, 1, 1),
                  x = new Dn(g.geometry, g.material, d);
                for (let _ = 0; _ < d; _++)
                  (c.TRANSLATION && m.fromBufferAttribute(c.TRANSLATION, _),
                    c.ROTATION && f.fromBufferAttribute(c.ROTATION, _),
                    c.SCALE && v.fromBufferAttribute(c.SCALE, _),
                    x.setMatrixAt(_, y.compose(m, f, v)));
                for (let _ in c)
                  if (_ === "_COLOR_0") {
                    let S = c[_];
                    x.instanceColor = new Zn(S.array, S.itemSize, S.normalized);
                  } else _ !== "TRANSLATION" && _ !== "ROTATION" && _ !== "SCALE" && g.geometry.setAttribute(_, c[_]);
                (st.prototype.copy.call(x, g), this.parser.assignFinalMaterial(x), p.push(x));
              }
              return l.isGroup ? (l.clear(), l.add(...p), l) : p[0];
            }));
      }
    },
    Dg = "glTF",
    fa = 12,
    Pg = { JSON: 1313821514, BIN: 5130562 },
    of = class {
      constructor(e) {
        ((this.name = rt.KHR_BINARY_GLTF), (this.content = null), (this.body = null));
        let t = new DataView(e, 0, fa),
          n = new TextDecoder();
        if (
          ((this.header = { magic: n.decode(new Uint8Array(e.slice(0, 4))), version: t.getUint32(4, !0), length: t.getUint32(8, !0) }),
          this.header.magic !== Dg)
        )
          throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
        if (this.header.version < 2) throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
        let i = this.header.length - fa,
          r = new DataView(e, fa),
          o = 0;
        for (; o < i;) {
          let a = r.getUint32(o, !0);
          o += 4;
          let c = r.getUint32(o, !0);
          if (((o += 4), c === Pg.JSON)) {
            let h = new Uint8Array(e, fa + o, a);
            this.content = n.decode(h);
          } else if (c === Pg.BIN) {
            let h = fa + o;
            this.body = e.slice(h, h + a);
          }
          o += a;
        }
        if (this.content === null) throw new Error("THREE.GLTFLoader: JSON content not found.");
      }
    },
    af = class {
      constructor(e, t) {
        if (!t) throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
        ((this.name = rt.KHR_DRACO_MESH_COMPRESSION), (this.json = e), (this.dracoLoader = t), this.dracoLoader.preload());
      }
      decodePrimitive(e, t) {
        let n = this.json,
          i = this.dracoLoader,
          r = e.extensions[this.name].bufferView,
          o = e.extensions[this.name].attributes,
          a = {},
          c = {},
          h = {};
        for (let l in o) {
          let u = uf[l] || l.toLowerCase();
          a[u] = o[l];
        }
        for (let l in e.attributes) {
          let u = uf[l] || l.toLowerCase();
          if (o[l] !== void 0) {
            let d = n.accessors[e.attributes[l]],
              p = to[d.componentType];
            ((h[u] = p.name), (c[u] = d.normalized === !0));
          }
        }
        return t.getDependency("bufferView", r).then(function (l) {
          return new Promise(function (u, d) {
            i.decodeDracoFile(
              l,
              function (p) {
                for (let g in p.attributes) {
                  let y = p.attributes[g],
                    m = c[g];
                  m !== void 0 && (y.normalized = m);
                }
                u(p);
              },
              a,
              h,
              Bt,
              d,
            );
          });
        });
      }
    },
    lf = class {
      constructor() {
        this.name = rt.KHR_TEXTURE_TRANSFORM;
      }
      extendTexture(e, t) {
        return (
          ((t.texCoord === void 0 || t.texCoord === e.channel) && t.offset === void 0 && t.rotation === void 0 && t.scale === void 0) ||
            ((e = e.clone()),
            t.texCoord !== void 0 && (e.channel = t.texCoord),
            t.offset !== void 0 && e.offset.fromArray(t.offset),
            t.rotation !== void 0 && (e.rotation = t.rotation),
            t.scale !== void 0 && e.repeat.fromArray(t.scale),
            (e.needsUpdate = !0)),
          e
        );
      }
    },
    cf = class {
      constructor() {
        this.name = rt.KHR_MESH_QUANTIZATION;
      }
    },
    Ic = class extends Ui {
      constructor(e, t, n, i) {
        super(e, t, n, i);
      }
      copySampleValue_(e) {
        let t = this.resultBuffer,
          n = this.sampleValues,
          i = this.valueSize,
          r = e * i * 3 + i;
        for (let o = 0; o !== i; o++) t[o] = n[r + o];
        return t;
      }
      interpolate_(e, t, n, i) {
        let r = this.resultBuffer,
          o = this.sampleValues,
          a = this.valueSize,
          c = a * 2,
          h = a * 3,
          l = i - t,
          u = (n - t) / l,
          d = u * u,
          p = d * u,
          g = e * h,
          y = g - h,
          m = -2 * p + 3 * d,
          f = p - d,
          v = 1 - m,
          x = f - d + u;
        for (let _ = 0; _ !== a; _++) {
          let S = o[y + _ + a],
            b = o[y + _ + c] * l,
            M = o[g + _ + a],
            A = o[g + _] * l;
          r[_] = v * S + x * b + m * M + f * A;
        }
        return r;
      }
    },
    lb = new Dt(),
    hf = class extends Ic {
      interpolate_(e, t, n, i) {
        let r = super.interpolate_(e, t, n, i);
        return (lb.fromArray(r).normalize().toArray(r), r);
      }
    },
    Un = {
      FLOAT: 5126,
      FLOAT_MAT3: 35675,
      FLOAT_MAT4: 35676,
      FLOAT_VEC2: 35664,
      FLOAT_VEC3: 35665,
      FLOAT_VEC4: 35666,
      LINEAR: 9729,
      REPEAT: 10497,
      SAMPLER_2D: 35678,
      POINTS: 0,
      LINES: 1,
      LINE_LOOP: 2,
      LINE_STRIP: 3,
      TRIANGLES: 4,
      TRIANGLE_STRIP: 5,
      TRIANGLE_FAN: 6,
      UNSIGNED_BYTE: 5121,
      UNSIGNED_SHORT: 5123,
    },
    to = { 5120: Int8Array, 5121: Uint8Array, 5122: Int16Array, 5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array },
    Lg = { 9728: bt, 9729: vt, 9984: Cr, 9985: la, 9986: zs, 9987: qn },
    Ig = { 33071: Zt, 33648: Bs, 10497: Xn },
    Bd = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16 },
    uf = {
      POSITION: "position",
      NORMAL: "normal",
      TANGENT: "tangent",
      TEXCOORD_0: "uv",
      TEXCOORD_1: "uv1",
      TEXCOORD_2: "uv2",
      TEXCOORD_3: "uv3",
      COLOR_0: "color",
      WEIGHTS_0: "skinWeight",
      JOINTS_0: "skinIndex",
    },
    us = { scale: "scale", translation: "position", rotation: "quaternion", weights: "morphTargetInfluences" },
    cb = { CUBICSPLINE: void 0, LINEAR: Qi, STEP: Hs },
    kd = { OPAQUE: "OPAQUE", MASK: "MASK", BLEND: "BLEND" };
  function hb(s) {
    return (
      s.DefaultMaterial === void 0 &&
        (s.DefaultMaterial = new Xe({ color: 16777215, emissive: 0, metalness: 1, roughness: 1, transparent: !1, depthTest: !0, side: Gn })),
      s.DefaultMaterial
    );
  }
  function js(s, e, t) {
    for (let n in t.extensions)
      s[n] === void 0 && ((e.userData.gltfExtensions = e.userData.gltfExtensions || {}), (e.userData.gltfExtensions[n] = t.extensions[n]));
  }
  function ds(s, e) {
    e.extras !== void 0 &&
      (typeof e.extras == "object" ? Object.assign(s.userData, e.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + e.extras));
  }
  function ub(s, e, t) {
    let n = !1,
      i = !1,
      r = !1;
    for (let h = 0, l = e.length; h < l; h++) {
      let u = e[h];
      if ((u.POSITION !== void 0 && (n = !0), u.NORMAL !== void 0 && (i = !0), u.COLOR_0 !== void 0 && (r = !0), n && i && r)) break;
    }
    if (!n && !i && !r) return Promise.resolve(s);
    let o = [],
      a = [],
      c = [];
    for (let h = 0, l = e.length; h < l; h++) {
      let u = e[h];
      if (n) {
        let d = u.POSITION !== void 0 ? t.getDependency("accessor", u.POSITION) : s.attributes.position;
        o.push(d);
      }
      if (i) {
        let d = u.NORMAL !== void 0 ? t.getDependency("accessor", u.NORMAL) : s.attributes.normal;
        a.push(d);
      }
      if (r) {
        let d = u.COLOR_0 !== void 0 ? t.getDependency("accessor", u.COLOR_0) : s.attributes.color;
        c.push(d);
      }
    }
    return Promise.all([Promise.all(o), Promise.all(a), Promise.all(c)]).then(function (h) {
      let l = h[0],
        u = h[1],
        d = h[2];
      return (n && (s.morphAttributes.position = l), i && (s.morphAttributes.normal = u), r && (s.morphAttributes.color = d), (s.morphTargetsRelative = !0), s);
    });
  }
  function db(s, e) {
    if ((s.updateMorphTargets(), e.weights !== void 0)) for (let t = 0, n = e.weights.length; t < n; t++) s.morphTargetInfluences[t] = e.weights[t];
    if (e.extras && Array.isArray(e.extras.targetNames)) {
      let t = e.extras.targetNames;
      if (s.morphTargetInfluences.length === t.length) {
        s.morphTargetDictionary = {};
        for (let n = 0, i = t.length; n < i; n++) s.morphTargetDictionary[t[n]] = n;
      } else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
    }
  }
  function fb(s) {
    let e,
      t = s.extensions && s.extensions[rt.KHR_DRACO_MESH_COMPRESSION];
    if (
      (t ? (e = "draco:" + t.bufferView + ":" + t.indices + ":" + Hd(t.attributes)) : (e = s.indices + ":" + Hd(s.attributes) + ":" + s.mode),
      s.targets !== void 0)
    )
      for (let n = 0, i = s.targets.length; n < i; n++) e += ":" + Hd(s.targets[n]);
    return e;
  }
  function Hd(s) {
    let e = "",
      t = Object.keys(s).sort();
    for (let n = 0, i = t.length; n < i; n++) e += t[n] + ":" + s[t[n]] + ";";
    return e;
  }
  function df(s) {
    switch (s) {
      case Int8Array:
        return 1 / 127;
      case Uint8Array:
        return 1 / 255;
      case Int16Array:
        return 1 / 32767;
      case Uint16Array:
        return 1 / 65535;
      default:
        throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
    }
  }
  function pb(s) {
    return s.search(/\.jpe?g($|\?)/i) > 0 || s.search(/^data\:image\/jpeg/) === 0
      ? "image/jpeg"
      : s.search(/\.webp($|\?)/i) > 0 || s.search(/^data\:image\/webp/) === 0
        ? "image/webp"
        : "image/png";
  }
  var mb = new ze(),
    ff = class {
      constructor(e = {}, t = {}) {
        ((this.json = e),
          (this.extensions = {}),
          (this.plugins = {}),
          (this.options = t),
          (this.cache = new ab()),
          (this.associations = new Map()),
          (this.primitiveCache = {}),
          (this.nodeCache = {}),
          (this.meshCache = { refs: {}, uses: {} }),
          (this.cameraCache = { refs: {}, uses: {} }),
          (this.lightCache = { refs: {}, uses: {} }),
          (this.sourceCache = {}),
          (this.textureCache = {}),
          (this.nodeNamesUsed = {}));
        let n = !1,
          i = !1,
          r = -1;
        (typeof navigator < "u" &&
          ((n = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) === !0),
          (i = navigator.userAgent.indexOf("Firefox") > -1),
          (r = i ? navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1] : -1)),
          typeof createImageBitmap > "u" || n || (i && r < 98)
            ? (this.textureLoader = new Ks(this.options.manager))
            : (this.textureLoader = new sa(this.options.manager)),
          this.textureLoader.setCrossOrigin(this.options.crossOrigin),
          this.textureLoader.setRequestHeader(this.options.requestHeader),
          (this.fileLoader = new _n(this.options.manager)),
          this.fileLoader.setResponseType("arraybuffer"),
          this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(!0));
      }
      setExtensions(e) {
        this.extensions = e;
      }
      setPlugins(e) {
        this.plugins = e;
      }
      parse(e, t) {
        let n = this,
          i = this.json,
          r = this.extensions;
        (this.cache.removeAll(),
          (this.nodeCache = {}),
          this._invokeAll(function (o) {
            return o._markDefs && o._markDefs();
          }),
          Promise.all(
            this._invokeAll(function (o) {
              return o.beforeRoot && o.beforeRoot();
            }),
          )
            .then(function () {
              return Promise.all([n.getDependencies("scene"), n.getDependencies("animation"), n.getDependencies("camera")]);
            })
            .then(function (o) {
              let a = { scene: o[0][i.scene || 0], scenes: o[0], animations: o[1], cameras: o[2], asset: i.asset, parser: n, userData: {} };
              return (
                js(r, a, i),
                ds(a, i),
                Promise.all(
                  n._invokeAll(function (c) {
                    return c.afterRoot && c.afterRoot(a);
                  }),
                ).then(function () {
                  e(a);
                })
              );
            })
            .catch(t));
      }
      _markDefs() {
        let e = this.json.nodes || [],
          t = this.json.skins || [],
          n = this.json.meshes || [];
        for (let i = 0, r = t.length; i < r; i++) {
          let o = t[i].joints;
          for (let a = 0, c = o.length; a < c; a++) e[o[a]].isBone = !0;
        }
        for (let i = 0, r = e.length; i < r; i++) {
          let o = e[i];
          (o.mesh !== void 0 && (this._addNodeRef(this.meshCache, o.mesh), o.skin !== void 0 && (n[o.mesh].isSkinnedMesh = !0)),
            o.camera !== void 0 && this._addNodeRef(this.cameraCache, o.camera));
        }
      }
      _addNodeRef(e, t) {
        t !== void 0 && (e.refs[t] === void 0 && (e.refs[t] = e.uses[t] = 0), e.refs[t]++);
      }
      _getNodeRef(e, t, n) {
        if (e.refs[t] <= 1) return n;
        let i = n.clone(),
          r = (o, a) => {
            let c = this.associations.get(o);
            c != null && this.associations.set(a, c);
            for (let [h, l] of o.children.entries()) r(l, a.children[h]);
          };
        return (r(n, i), (i.name += "_instance_" + e.uses[t]++), i);
      }
      _invokeOne(e) {
        let t = Object.values(this.plugins);
        t.push(this);
        for (let n = 0; n < t.length; n++) {
          let i = e(t[n]);
          if (i) return i;
        }
        return null;
      }
      _invokeAll(e) {
        let t = Object.values(this.plugins);
        t.unshift(this);
        let n = [];
        for (let i = 0; i < t.length; i++) {
          let r = e(t[i]);
          r && n.push(r);
        }
        return n;
      }
      getDependency(e, t) {
        let n = e + ":" + t,
          i = this.cache.get(n);
        if (!i) {
          switch (e) {
            case "scene":
              i = this.loadScene(t);
              break;
            case "node":
              i = this._invokeOne(function (r) {
                return r.loadNode && r.loadNode(t);
              });
              break;
            case "mesh":
              i = this._invokeOne(function (r) {
                return r.loadMesh && r.loadMesh(t);
              });
              break;
            case "accessor":
              i = this.loadAccessor(t);
              break;
            case "bufferView":
              i = this._invokeOne(function (r) {
                return r.loadBufferView && r.loadBufferView(t);
              });
              break;
            case "buffer":
              i = this.loadBuffer(t);
              break;
            case "material":
              i = this._invokeOne(function (r) {
                return r.loadMaterial && r.loadMaterial(t);
              });
              break;
            case "texture":
              i = this._invokeOne(function (r) {
                return r.loadTexture && r.loadTexture(t);
              });
              break;
            case "skin":
              i = this.loadSkin(t);
              break;
            case "animation":
              i = this._invokeOne(function (r) {
                return r.loadAnimation && r.loadAnimation(t);
              });
              break;
            case "camera":
              i = this.loadCamera(t);
              break;
            default:
              if (
                ((i = this._invokeOne(function (r) {
                  return r != this && r.getDependency && r.getDependency(e, t);
                })),
                !i)
              )
                throw new Error("Unknown type: " + e);
              break;
          }
          this.cache.add(n, i);
        }
        return i;
      }
      getDependencies(e) {
        let t = this.cache.get(e);
        if (!t) {
          let n = this,
            i = this.json[e + (e === "mesh" ? "es" : "s")] || [];
          ((t = Promise.all(
            i.map(function (r, o) {
              return n.getDependency(e, o);
            }),
          )),
            this.cache.add(e, t));
        }
        return t;
      }
      loadBuffer(e) {
        let t = this.json.buffers[e],
          n = this.fileLoader;
        if (t.type && t.type !== "arraybuffer") throw new Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
        if (t.uri === void 0 && e === 0) return Promise.resolve(this.extensions[rt.KHR_BINARY_GLTF].body);
        let i = this.options;
        return new Promise(function (r, o) {
          n.load(Jn.resolveURL(t.uri, i.path), r, void 0, function () {
            o(new Error('THREE.GLTFLoader: Failed to load buffer "' + t.uri + '".'));
          });
        });
      }
      loadBufferView(e) {
        let t = this.json.bufferViews[e];
        return this.getDependency("buffer", t.buffer).then(function (n) {
          let i = t.byteLength || 0,
            r = t.byteOffset || 0;
          return n.slice(r, r + i);
        });
      }
      loadAccessor(e) {
        let t = this,
          n = this.json,
          i = this.json.accessors[e];
        if (i.bufferView === void 0 && i.sparse === void 0) {
          let o = Bd[i.type],
            a = to[i.componentType],
            c = i.normalized === !0,
            h = new a(i.count * o);
          return Promise.resolve(new Ge(h, o, c));
        }
        let r = [];
        return (
          i.bufferView !== void 0 ? r.push(this.getDependency("bufferView", i.bufferView)) : r.push(null),
          i.sparse !== void 0 &&
            (r.push(this.getDependency("bufferView", i.sparse.indices.bufferView)), r.push(this.getDependency("bufferView", i.sparse.values.bufferView))),
          Promise.all(r).then(function (o) {
            let a = o[0],
              c = Bd[i.type],
              h = to[i.componentType],
              l = h.BYTES_PER_ELEMENT,
              u = l * c,
              d = i.byteOffset || 0,
              p = i.bufferView !== void 0 ? n.bufferViews[i.bufferView].byteStride : void 0,
              g = i.normalized === !0,
              y,
              m;
            if (p && p !== u) {
              let f = Math.floor(d / p),
                v = "InterleavedBuffer:" + i.bufferView + ":" + i.componentType + ":" + f + ":" + i.count,
                x = t.cache.get(v);
              (x || ((y = new h(a, f * p, (i.count * p) / l)), (x = new Ni(y, p / l)), t.cache.add(v, x)), (m = new oi(x, c, (d % p) / l, g)));
            } else (a === null ? (y = new h(i.count * c)) : (y = new h(a, d, i.count * c)), (m = new Ge(y, c, g)));
            if (i.sparse !== void 0) {
              let f = Bd.SCALAR,
                v = to[i.sparse.indices.componentType],
                x = i.sparse.indices.byteOffset || 0,
                _ = i.sparse.values.byteOffset || 0,
                S = new v(o[1], x, i.sparse.count * f),
                b = new h(o[2], _, i.sparse.count * c);
              a !== null && (m = new Ge(m.array.slice(), m.itemSize, m.normalized));
              for (let M = 0, A = S.length; M < A; M++) {
                let E = S[M];
                if ((m.setX(E, b[M * c]), c >= 2 && m.setY(E, b[M * c + 1]), c >= 3 && m.setZ(E, b[M * c + 2]), c >= 4 && m.setW(E, b[M * c + 3]), c >= 5))
                  throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
              }
            }
            return m;
          })
        );
      }
      loadTexture(e) {
        let t = this.json,
          n = this.options,
          r = t.textures[e].source,
          o = t.images[r],
          a = this.textureLoader;
        if (o.uri) {
          let c = n.manager.getHandler(o.uri);
          c !== null && (a = c);
        }
        return this.loadTextureImage(e, r, a);
      }
      loadTextureImage(e, t, n) {
        let i = this,
          r = this.json,
          o = r.textures[e],
          a = r.images[t],
          c = (a.uri || a.bufferView) + ":" + o.sampler;
        if (this.textureCache[c]) return this.textureCache[c];
        let h = this.loadImageSource(t, n)
          .then(function (l) {
            ((l.flipY = !1),
              (l.name = o.name || a.name || ""),
              l.name === "" && typeof a.uri == "string" && a.uri.startsWith("data:image/") === !1 && (l.name = a.uri));
            let d = (r.samplers || {})[o.sampler] || {};
            return (
              (l.magFilter = Lg[d.magFilter] || vt),
              (l.minFilter = Lg[d.minFilter] || qn),
              (l.wrapS = Ig[d.wrapS] || Xn),
              (l.wrapT = Ig[d.wrapT] || Xn),
              i.associations.set(l, { textures: e }),
              l
            );
          })
          .catch(function () {
            return null;
          });
        return ((this.textureCache[c] = h), h);
      }
      loadImageSource(e, t) {
        let n = this,
          i = this.json,
          r = this.options;
        if (this.sourceCache[e] !== void 0) return this.sourceCache[e].then((u) => u.clone());
        let o = i.images[e],
          a = self.URL || self.webkitURL,
          c = o.uri || "",
          h = !1;
        if (o.bufferView !== void 0)
          c = n.getDependency("bufferView", o.bufferView).then(function (u) {
            h = !0;
            let d = new Blob([u], { type: o.mimeType });
            return ((c = a.createObjectURL(d)), c);
          });
        else if (o.uri === void 0) throw new Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
        let l = Promise.resolve(c)
          .then(function (u) {
            return new Promise(function (d, p) {
              let g = d;
              (t.isImageBitmapLoader === !0 &&
                (g = function (y) {
                  let m = new Ct(y);
                  ((m.needsUpdate = !0), d(m));
                }),
                t.load(Jn.resolveURL(u, r.path), g, void 0, p));
            });
          })
          .then(function (u) {
            return (h === !0 && a.revokeObjectURL(c), (u.userData.mimeType = o.mimeType || pb(o.uri)), u);
          })
          .catch(function (u) {
            throw (console.error("THREE.GLTFLoader: Couldn't load texture", c), u);
          });
        return ((this.sourceCache[e] = l), l);
      }
      assignTexture(e, t, n, i) {
        let r = this;
        return this.getDependency("texture", n.index).then(function (o) {
          if (!o) return null;
          if ((n.texCoord !== void 0 && n.texCoord > 0 && ((o = o.clone()), (o.channel = n.texCoord)), r.extensions[rt.KHR_TEXTURE_TRANSFORM])) {
            let a = n.extensions !== void 0 ? n.extensions[rt.KHR_TEXTURE_TRANSFORM] : void 0;
            if (a) {
              let c = r.associations.get(o);
              ((o = r.extensions[rt.KHR_TEXTURE_TRANSFORM].extendTexture(o, a)), r.associations.set(o, c));
            }
          }
          return (i !== void 0 && (o.colorSpace = i), (e[t] = o), o);
        });
      }
      assignFinalMaterial(e) {
        let t = e.geometry,
          n = e.material,
          i = t.attributes.tangent === void 0,
          r = t.attributes.color !== void 0,
          o = t.attributes.normal === void 0;
        if (e.isPoints) {
          let a = "PointsMaterial:" + n.uuid,
            c = this.cache.get(a);
          (c || ((c = new Di()), Pt.prototype.copy.call(c, n), c.color.copy(n.color), (c.map = n.map), (c.sizeAttenuation = !1), this.cache.add(a, c)),
            (n = c));
        } else if (e.isLine) {
          let a = "LineBasicMaterial:" + n.uuid,
            c = this.cache.get(a);
          (c || ((c = new Ut()), Pt.prototype.copy.call(c, n), c.color.copy(n.color), (c.map = n.map), this.cache.add(a, c)), (n = c));
        }
        if (i || r || o) {
          let a = "ClonedMaterial:" + n.uuid + ":";
          (i && (a += "derivative-tangents:"), r && (a += "vertex-colors:"), o && (a += "flat-shading:"));
          let c = this.cache.get(a);
          (c ||
            ((c = n.clone()),
            r && (c.vertexColors = !0),
            o && (c.flatShading = !0),
            i && (c.normalScale && (c.normalScale.y *= -1), c.clearcoatNormalScale && (c.clearcoatNormalScale.y *= -1)),
            this.cache.add(a, c),
            this.associations.set(c, this.associations.get(n))),
            (n = c));
        }
        e.material = n;
      }
      getMaterialType() {
        return Xe;
      }
      loadMaterial(e) {
        let t = this,
          n = this.json,
          i = this.extensions,
          r = n.materials[e],
          o,
          a = {},
          c = r.extensions || {},
          h = [];
        if (c[rt.KHR_MATERIALS_UNLIT]) {
          let u = i[rt.KHR_MATERIALS_UNLIT];
          ((o = u.getMaterialType()), h.push(u.extendParams(a, r, t)));
        } else {
          let u = r.pbrMetallicRoughness || {};
          if (((a.color = new pe(1, 1, 1)), (a.opacity = 1), Array.isArray(u.baseColorFactor))) {
            let d = u.baseColorFactor;
            (a.color.setRGB(d[0], d[1], d[2], Bt), (a.opacity = d[3]));
          }
          (u.baseColorTexture !== void 0 && h.push(t.assignTexture(a, "map", u.baseColorTexture, ht)),
            (a.metalness = u.metallicFactor !== void 0 ? u.metallicFactor : 1),
            (a.roughness = u.roughnessFactor !== void 0 ? u.roughnessFactor : 1),
            u.metallicRoughnessTexture !== void 0 &&
              (h.push(t.assignTexture(a, "metalnessMap", u.metallicRoughnessTexture)), h.push(t.assignTexture(a, "roughnessMap", u.metallicRoughnessTexture))),
            (o = this._invokeOne(function (d) {
              return d.getMaterialType && d.getMaterialType(e);
            })),
            h.push(
              Promise.all(
                this._invokeAll(function (d) {
                  return d.extendMaterialParams && d.extendMaterialParams(e, a);
                }),
              ),
            ));
        }
        r.doubleSided === !0 && (a.side = Rt);
        let l = r.alphaMode || kd.OPAQUE;
        if (
          (l === kd.BLEND
            ? ((a.transparent = !0), (a.depthWrite = !1))
            : ((a.transparent = !1), l === kd.MASK && (a.alphaTest = r.alphaCutoff !== void 0 ? r.alphaCutoff : 0.5)),
          r.normalTexture !== void 0 &&
            o !== ot &&
            (h.push(t.assignTexture(a, "normalMap", r.normalTexture)), (a.normalScale = new ae(1, 1)), r.normalTexture.scale !== void 0))
        ) {
          let u = r.normalTexture.scale;
          a.normalScale.set(u, u);
        }
        if (
          (r.occlusionTexture !== void 0 &&
            o !== ot &&
            (h.push(t.assignTexture(a, "aoMap", r.occlusionTexture)),
            r.occlusionTexture.strength !== void 0 && (a.aoMapIntensity = r.occlusionTexture.strength)),
          r.emissiveFactor !== void 0 && o !== ot)
        ) {
          let u = r.emissiveFactor;
          a.emissive = new pe().setRGB(u[0], u[1], u[2], Bt);
        }
        return (
          r.emissiveTexture !== void 0 && o !== ot && h.push(t.assignTexture(a, "emissiveMap", r.emissiveTexture, ht)),
          Promise.all(h).then(function () {
            let u = new o(a);
            return (r.name && (u.name = r.name), ds(u, r), t.associations.set(u, { materials: e }), r.extensions && js(i, u, r), u);
          })
        );
      }
      createUniqueName(e) {
        let t = ct.sanitizeNodeName(e || "");
        return t in this.nodeNamesUsed ? t + "_" + ++this.nodeNamesUsed[t] : ((this.nodeNamesUsed[t] = 0), t);
      }
      loadGeometries(e) {
        let t = this,
          n = this.extensions,
          i = this.primitiveCache;
        function r(a) {
          return n[rt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a, t).then(function (c) {
            return Ng(c, a, t);
          });
        }
        let o = [];
        for (let a = 0, c = e.length; a < c; a++) {
          let h = e[a],
            l = fb(h),
            u = i[l];
          if (u) o.push(u.promise);
          else {
            let d;
            (h.extensions && h.extensions[rt.KHR_DRACO_MESH_COMPRESSION] ? (d = r(h)) : (d = Ng(new Ue(), h, t)),
              (i[l] = { primitive: h, promise: d }),
              o.push(d));
          }
        }
        return Promise.all(o);
      }
      loadMesh(e) {
        let t = this,
          n = this.json,
          i = this.extensions,
          r = n.meshes[e],
          o = r.primitives,
          a = [];
        for (let c = 0, h = o.length; c < h; c++) {
          let l = o[c].material === void 0 ? hb(this.cache) : this.getDependency("material", o[c].material);
          a.push(l);
        }
        return (
          a.push(t.loadGeometries(o)),
          Promise.all(a).then(function (c) {
            let h = c.slice(0, c.length - 1),
              l = c[c.length - 1],
              u = [];
            for (let p = 0, g = l.length; p < g; p++) {
              let y = l[p],
                m = o[p],
                f,
                v = h[p];
              if (m.mode === Un.TRIANGLES || m.mode === Un.TRIANGLE_STRIP || m.mode === Un.TRIANGLE_FAN || m.mode === void 0)
                ((f = r.isSkinnedMesh === !0 ? new Fr(y, v) : new we(y, v)),
                  f.isSkinnedMesh === !0 && f.normalizeSkinWeights(),
                  m.mode === Un.TRIANGLE_STRIP ? (f.geometry = Fd(f.geometry, ca)) : m.mode === Un.TRIANGLE_FAN && (f.geometry = Fd(f.geometry, jr)));
              else if (m.mode === Un.LINES) f = new xn(y, v);
              else if (m.mode === Un.LINE_STRIP) f = new sn(y, v);
              else if (m.mode === Un.LINE_LOOP) f = new kr(y, v);
              else if (m.mode === Un.POINTS) f = new is(y, v);
              else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + m.mode);
              (Object.keys(f.geometry.morphAttributes).length > 0 && db(f, r),
                (f.name = t.createUniqueName(r.name || "mesh_" + e)),
                ds(f, r),
                m.extensions && js(i, f, m),
                t.assignFinalMaterial(f),
                u.push(f));
            }
            for (let p = 0, g = u.length; p < g; p++) t.associations.set(u[p], { meshes: e, primitives: p });
            if (u.length === 1) return (r.extensions && js(i, u[0], r), u[0]);
            let d = new ut();
            (r.extensions && js(i, d, r), t.associations.set(d, { meshes: e }));
            for (let p = 0, g = u.length; p < g; p++) d.add(u[p]);
            return d;
          })
        );
      }
      loadCamera(e) {
        let t,
          n = this.json.cameras[e],
          i = n[n.type];
        if (!i) {
          console.warn("THREE.GLTFLoader: Missing camera parameters.");
          return;
        }
        return (
          n.type === "perspective"
            ? (t = new St(cs.radToDeg(i.yfov), i.aspectRatio || 1, i.znear || 1, i.zfar || 2e6))
            : n.type === "orthographic" && (t = new ri(-i.xmag, i.xmag, i.ymag, -i.ymag, i.znear, i.zfar)),
          n.name && (t.name = this.createUniqueName(n.name)),
          ds(t, n),
          Promise.resolve(t)
        );
      }
      loadSkin(e) {
        let t = this.json.skins[e],
          n = [];
        for (let i = 0, r = t.joints.length; i < r; i++) n.push(this._loadNodeShallow(t.joints[i]));
        return (
          t.inverseBindMatrices !== void 0 ? n.push(this.getDependency("accessor", t.inverseBindMatrices)) : n.push(null),
          Promise.all(n).then(function (i) {
            let r = i.pop(),
              o = i,
              a = [],
              c = [];
            for (let h = 0, l = o.length; h < l; h++) {
              let u = o[h];
              if (u) {
                a.push(u);
                let d = new ze();
                (r !== null && d.fromArray(r.array, h * 16), c.push(d));
              } else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', t.joints[h]);
            }
            return new Br(a, c);
          })
        );
      }
      loadAnimation(e) {
        let t = this.json,
          n = this,
          i = t.animations[e],
          r = i.name ? i.name : "animation_" + e,
          o = [],
          a = [],
          c = [],
          h = [],
          l = [];
        for (let u = 0, d = i.channels.length; u < d; u++) {
          let p = i.channels[u],
            g = i.samplers[p.sampler],
            y = p.target,
            m = y.node,
            f = i.parameters !== void 0 ? i.parameters[g.input] : g.input,
            v = i.parameters !== void 0 ? i.parameters[g.output] : g.output;
          y.node !== void 0 &&
            (o.push(this.getDependency("node", m)), a.push(this.getDependency("accessor", f)), c.push(this.getDependency("accessor", v)), h.push(g), l.push(y));
        }
        return Promise.all([Promise.all(o), Promise.all(a), Promise.all(c), Promise.all(h), Promise.all(l)]).then(function (u) {
          let d = u[0],
            p = u[1],
            g = u[2],
            y = u[3],
            m = u[4],
            f = [];
          for (let v = 0, x = d.length; v < x; v++) {
            let _ = d[v],
              S = p[v],
              b = g[v],
              M = y[v],
              A = m[v];
            if (_ === void 0) continue;
            _.updateMatrix && _.updateMatrix();
            let E = n._createAnimationTracks(_, S, b, M, A);
            if (E) for (let w = 0; w < E.length; w++) f.push(E[w]);
          }
          return new Fi(r, void 0, f);
        });
      }
      createNodeMesh(e) {
        let t = this.json,
          n = this,
          i = t.nodes[e];
        return i.mesh === void 0
          ? null
          : n.getDependency("mesh", i.mesh).then(function (r) {
              let o = n._getNodeRef(n.meshCache, i.mesh, r);
              return (
                i.weights !== void 0 &&
                  o.traverse(function (a) {
                    if (a.isMesh) for (let c = 0, h = i.weights.length; c < h; c++) a.morphTargetInfluences[c] = i.weights[c];
                  }),
                o
              );
            });
      }
      loadNode(e) {
        let t = this.json,
          n = this,
          i = t.nodes[e],
          r = n._loadNodeShallow(e),
          o = [],
          a = i.children || [];
        for (let h = 0, l = a.length; h < l; h++) o.push(n.getDependency("node", a[h]));
        let c = i.skin === void 0 ? Promise.resolve(null) : n.getDependency("skin", i.skin);
        return Promise.all([r, Promise.all(o), c]).then(function (h) {
          let l = h[0],
            u = h[1],
            d = h[2];
          d !== null &&
            l.traverse(function (p) {
              p.isSkinnedMesh && p.bind(d, mb);
            });
          for (let p = 0, g = u.length; p < g; p++) l.add(u[p]);
          return l;
        });
      }
      _loadNodeShallow(e) {
        let t = this.json,
          n = this.extensions,
          i = this;
        if (this.nodeCache[e] !== void 0) return this.nodeCache[e];
        let r = t.nodes[e],
          o = r.name ? i.createUniqueName(r.name) : "",
          a = [],
          c = i._invokeOne(function (h) {
            return h.createNodeMesh && h.createNodeMesh(e);
          });
        return (
          c && a.push(c),
          r.camera !== void 0 &&
            a.push(
              i.getDependency("camera", r.camera).then(function (h) {
                return i._getNodeRef(i.cameraCache, r.camera, h);
              }),
            ),
          i
            ._invokeAll(function (h) {
              return h.createNodeAttachment && h.createNodeAttachment(e);
            })
            .forEach(function (h) {
              a.push(h);
            }),
          (this.nodeCache[e] = Promise.all(a).then(function (h) {
            let l;
            if ((r.isBone === !0 ? (l = new Xs()) : h.length > 1 ? (l = new ut()) : h.length === 1 ? (l = h[0]) : (l = new st()), l !== h[0]))
              for (let u = 0, d = h.length; u < d; u++) l.add(h[u]);
            if ((r.name && ((l.userData.name = r.name), (l.name = o)), ds(l, r), r.extensions && js(n, l, r), r.matrix !== void 0)) {
              let u = new ze();
              (u.fromArray(r.matrix), l.applyMatrix4(u));
            } else
              (r.translation !== void 0 && l.position.fromArray(r.translation),
                r.rotation !== void 0 && l.quaternion.fromArray(r.rotation),
                r.scale !== void 0 && l.scale.fromArray(r.scale));
            return (i.associations.has(l) || i.associations.set(l, {}), (i.associations.get(l).nodes = e), l);
          })),
          this.nodeCache[e]
        );
      }
      loadScene(e) {
        let t = this.extensions,
          n = this.json.scenes[e],
          i = this,
          r = new ut();
        (n.name && (r.name = i.createUniqueName(n.name)), ds(r, n), n.extensions && js(t, r, n));
        let o = n.nodes || [],
          a = [];
        for (let c = 0, h = o.length; c < h; c++) a.push(i.getDependency("node", o[c]));
        return Promise.all(a).then(function (c) {
          for (let l = 0, u = c.length; l < u; l++) r.add(c[l]);
          let h = (l) => {
            let u = new Map();
            for (let [d, p] of i.associations) (d instanceof Pt || d instanceof Ct) && u.set(d, p);
            return (
              l.traverse((d) => {
                let p = i.associations.get(d);
                p != null && u.set(d, p);
              }),
              u
            );
          };
          return ((i.associations = h(r)), r);
        });
      }
      _createAnimationTracks(e, t, n, i, r) {
        let o = [],
          a = e.name ? e.name : e.uuid,
          c = [];
        us[r.path] === us.weights
          ? e.traverse(function (d) {
              d.morphTargetInfluences && c.push(d.name ? d.name : d.uuid);
            })
          : c.push(a);
        let h;
        switch (us[r.path]) {
          case us.weights:
            h = ci;
            break;
          case us.rotation:
            h = Kn;
            break;
          case us.position:
          case us.scale:
            h = hi;
            break;
          default:
            switch (n.itemSize) {
              case 1:
                h = ci;
                break;
              case 2:
              case 3:
              default:
                h = hi;
                break;
            }
            break;
        }
        let l = i.interpolation !== void 0 ? cb[i.interpolation] : Qi,
          u = this._getArrayFromAccessor(n);
        for (let d = 0, p = c.length; d < p; d++) {
          let g = new h(c[d] + "." + us[r.path], t.array, u, l);
          (i.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(g), o.push(g));
        }
        return o;
      }
      _getArrayFromAccessor(e) {
        let t = e.array;
        if (e.normalized) {
          let n = df(t.constructor),
            i = new Float32Array(t.length);
          for (let r = 0, o = t.length; r < o; r++) i[r] = t[r] * n;
          t = i;
        }
        return t;
      }
      _createCubicSplineTrackInterpolant(e) {
        ((e.createInterpolant = function (n) {
          let i = this instanceof Kn ? hf : Ic;
          return new i(this.times, this.values, this.getValueSize() / 3, n);
        }),
          (e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0));
      }
    };
  function gb(s, e, t) {
    let n = e.attributes,
      i = new kt();
    if (n.POSITION !== void 0) {
      let a = t.json.accessors[n.POSITION],
        c = a.min,
        h = a.max;
      if (c !== void 0 && h !== void 0) {
        if ((i.set(new C(c[0], c[1], c[2]), new C(h[0], h[1], h[2])), a.normalized)) {
          let l = df(to[a.componentType]);
          (i.min.multiplyScalar(l), i.max.multiplyScalar(l));
        }
      } else {
        console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
        return;
      }
    } else return;
    let r = e.targets;
    if (r !== void 0) {
      let a = new C(),
        c = new C();
      for (let h = 0, l = r.length; h < l; h++) {
        let u = r[h];
        if (u.POSITION !== void 0) {
          let d = t.json.accessors[u.POSITION],
            p = d.min,
            g = d.max;
          if (p !== void 0 && g !== void 0) {
            if (
              (c.setX(Math.max(Math.abs(p[0]), Math.abs(g[0]))),
              c.setY(Math.max(Math.abs(p[1]), Math.abs(g[1]))),
              c.setZ(Math.max(Math.abs(p[2]), Math.abs(g[2]))),
              d.normalized)
            ) {
              let y = df(to[d.componentType]);
              c.multiplyScalar(y);
            }
            a.max(c);
          } else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
        }
      }
      i.expandByVector(a);
    }
    s.boundingBox = i;
    let o = new Ft();
    (i.getCenter(o.center), (o.radius = i.min.distanceTo(i.max) / 2), (s.boundingSphere = o));
  }
  function Ng(s, e, t) {
    let n = e.attributes,
      i = [];
    function r(o, a) {
      return t.getDependency("accessor", o).then(function (c) {
        s.setAttribute(a, c);
      });
    }
    for (let o in n) {
      let a = uf[o] || o.toLowerCase();
      a in s.attributes || i.push(r(n[o], a));
    }
    if (e.indices !== void 0 && !s.index) {
      let o = t.getDependency("accessor", e.indices).then(function (a) {
        s.setIndex(a);
      });
      i.push(o);
    }
    return (
      lt.workingColorSpace !== Bt &&
        "COLOR_0" in n &&
        console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${lt.workingColorSpace}" not supported.`),
      ds(s, e),
      gb(s, e, t),
      Promise.all(i).then(function () {
        return e.targets !== void 0 ? ub(s, e.targets, t) : s;
      })
    );
  }
