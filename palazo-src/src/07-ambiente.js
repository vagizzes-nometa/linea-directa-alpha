  var no = class s extends we {
    constructor() {
      let e = s.SkyShader,
        t = new Lt({ name: e.name, uniforms: jn.clone(e.uniforms), vertexShader: e.vertexShader, fragmentShader: e.fragmentShader, side: $t, depthWrite: !1 });
      (super(new at(1, 1, 1), t), (this.isSky = !0));
    }
  };
  no.SkyShader = {
    name: "SkyShader",
    uniforms: {
      turbidity: { value: 2 },
      rayleigh: { value: 1 },
      mieCoefficient: { value: 0.005 },
      mieDirectionalG: { value: 0.8 },
      sunPosition: { value: new C() },
      up: { value: new C(0, 1, 0) },
    },
    vertexShader: `
		uniform vec3 sunPosition;
		uniform float rayleigh;
		uniform float turbidity;
		uniform float mieCoefficient;
		uniform vec3 up;

		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		// constants for atmospheric scattering
		const float e = 2.71828182845904523536028747135266249775724709369995957;
		const float pi = 3.141592653589793238462643383279502884197169;

		// wavelength of used primaries, according to preetham
		const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
		// this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:
		// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
		const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

		// mie stuff
		// K coefficient for the primaries
		const float v = 4.0;
		const vec3 K = vec3( 0.686, 0.678, 0.666 );
		// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
		const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

		// earth shadow hack
		// cutoffAngle = pi / 1.95;
		const float cutoffAngle = 1.6110731556870734;
		const float steepness = 1.5;
		const float EE = 1000.0;

		float sunIntensity( float zenithAngleCos ) {
			zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
			return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
		}

		vec3 totalMie( float T ) {
			float c = ( 0.2 * T ) * 10E-18;
			return 0.434 * c * MieConst;
		}

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vWorldPosition = worldPosition.xyz;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z = gl_Position.w; // set z to camera.far

			vSunDirection = normalize( sunPosition );

			vSunE = sunIntensity( dot( vSunDirection, up ) );

			vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

			float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

			// extinction (absorbtion + out scattering)
			// rayleigh coefficients
			vBetaR = totalRayleigh * rayleighCoefficient;

			// mie coefficients
			vBetaM = totalMie( turbidity ) * mieCoefficient;

		}`,
    fragmentShader: `
		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		uniform float mieDirectionalG;
		uniform vec3 up;

		// constants for atmospheric scattering
		const float pi = 3.141592653589793238462643383279502884197169;

		const float n = 1.0003; // refractive index of air
		const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

		// optical length at zenith for molecules
		const float rayleighZenithLength = 8.4E3;
		const float mieZenithLength = 1.25E3;
		// 66 arc seconds -> degrees, and the cosine of that
		const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

		// 3.0 / ( 16.0 * pi )
		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
		// 1.0 / ( 4.0 * pi )
		const float ONE_OVER_FOURPI = 0.07957747154594767;

		float rayleighPhase( float cosTheta ) {
			return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
		}

		float hgPhase( float cosTheta, float g ) {
			float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

		void main() {

			vec3 direction = normalize( vWorldPosition - cameraPosition );

			// optical length
			// cutoff angle at 90 to avoid singularity in next formula.
			float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
			float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
			float sR = rayleighZenithLength * inverse;
			float sM = mieZenithLength * inverse;

			// combined extinction factor
			vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

			// in scattering
			float cosTheta = dot( direction, vSunDirection );

			float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
			vec3 betaRTheta = vBetaR * rPhase;

			float mPhase = hgPhase( cosTheta, mieDirectionalG );
			vec3 betaMTheta = vBetaM * mPhase;

			vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
			Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

			// nightsky
			float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
			float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
			vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
			vec3 L0 = vec3( 0.1 ) * Fex;

			// composition + solar disc
			float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
			L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

			vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

			vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

			gl_FragColor = vec4( retColor, 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`,
  };
  var yb = {
    sunset: {
      elev: 6.5,
      azim: 205,
      turb: 9,
      ray: 2.4,
      mie: 0.007,
      mieG: 0.86,
      sun: "#ffbf8c",
      sunI: 3.4,
      hemiSky: "#9fb3cc",
      hemiGnd: "#5a4732",
      hemiI: 0.45,
      fog: "#9a7f6a",
      fogD: 0.0078,
      exp: 0.85,
      night: !1,
    },
    night: {
      elev: -4,
      azim: 150,
      turb: 2,
      ray: 0.6,
      mie: 0.003,
      mieG: 0.8,
      sun: "#a9c2f0",
      sunI: 1.25,
      hemiSky: "#4a5f8c",
      hemiGnd: "#1a1a22",
      hemiI: 0.9,
      fog: "#1b2536",
      fogD: 0.013,
      exp: 1.35,
      night: !0,
    },
  };
  function Vg(s) {
    let e = { sky: null, sun: null, hemi: null, stars: null, preset: null };
    return (
      (e.apply = (t) => {
        let n = yb[t];
        e.preset = n;
        let i = s.scene;
        for (let g of [e.sky, e.sun, e.hemi, e.stars, e.moon]) g && (i.remove(g), g.target && i.remove(g.target));
        let r = new C().setFromSphericalCoords(1, cs.degToRad(90 - n.elev), cs.degToRad(n.azim)),
          o = new no();
        o.scale.setScalar(4e3);
        let a = o.material.uniforms;
        ((a.turbidity.value = n.turb),
          (a.rayleigh.value = n.ray),
          (a.mieCoefficient.value = n.mie),
          (a.mieDirectionalG.value = n.mieG),
          a.sunPosition.value.copy(r),
          i.add(o),
          (e.sky = o));
        let c = new Gs(s.renderer),
          h = new ns(),
          l = new no();
        l.scale.setScalar(4e3);
        for (let g of ["turbidity", "rayleigh", "mieCoefficient", "mieDirectionalG"]) l.material.uniforms[g].value = a[g].value;
        (l.material.uniforms.sunPosition.value.copy(r),
          h.add(l),
          n.night && h.add(new Js("#3b4f78", "#05060a", 1)),
          (i.environment = c.fromScene(h).texture),
          c.dispose(),
          (i.fog = new zr(n.fog, n.fogD)),
          (s.renderer.toneMappingExposure = n.exp));
        let u = n.night ? new C().setFromSphericalCoords(1, cs.degToRad(52), cs.degToRad(120)) : r.clone(),
          d = new as(n.sun, n.sunI);
        ((d.castShadow = s.q.shadows), d.shadow.mapSize.set(s.q.shadowSize || 1024, s.q.shadowSize || 1024));
        let p = d.shadow.camera;
        if (
          ((p.left = -45),
          (p.right = 45),
          (p.top = 45),
          (p.bottom = -45),
          (p.near = 5),
          (p.far = 400),
          (d.shadow.bias = -5e-4),
          (d.shadow.normalBias = 0.04),
          i.add(d, d.target),
          (e.sun = d),
          (s.sun = d),
          (s.sunDir = u),
          (e.hemi = new Js(n.hemiSky, n.hemiGnd, n.hemiI)),
          i.add(e.hemi),
          n.night)
        ) {
          let y = new Ue(),
            m = new Float32Array(1500 * 3);
          for (let v = 0; v < 1500; v++) {
            let x = new C().setFromSphericalCoords(1500, Math.acos(Math.random() * 0.95), Math.random() * 6.283);
            m.set([x.x, x.y, x.z], v * 3);
          }
          (y.setAttribute("position", new Ge(m, 3)),
            (e.stars = new is(y, new Di({ color: "#dfe8ff", size: 1.6, sizeAttenuation: !1, fog: !1, transparent: !0, opacity: 0.85 }))),
            i.add(e.stars));
          let f = new we(new yn(28, 24, 16), new ot({ color: new pe(2.2, 2.3, 2.6), fog: !1 }));
          (f.position.copy(u).multiplyScalar(1400), i.add(f), (e.moon = f));
        }
        return n;
      }),
      e
    );
  }
