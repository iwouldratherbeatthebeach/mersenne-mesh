//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
}, n = function(e, t, n, r, i) {
	if (r === "m") throw TypeError("Private method is not writable");
	if (r === "a" && !i) throw TypeError("Private accessor was defined without a setter");
	if (typeof t == "function" ? e !== t || !i : !t.has(e)) throw TypeError("Cannot write private member to an object whose class did not declare it");
	return r === "a" ? i.call(e, n) : i ? i.value = n : t.set(e, n), n;
}, r = function(e, t, n, r) {
	if (n === "a" && !r) throw TypeError("Private accessor was defined without a getter");
	if (typeof t == "function" ? e !== t || !r : !t.has(e)) throw TypeError("Cannot read private member from an object whose class did not declare it");
	return n === "m" ? r : n === "a" ? r.call(e) : r ? r.value : t.get(e);
}, i, a, o, s, c, l, u = 4096, d = 160, f = u - d;
function p(e) {
	let t = e ? "__Secure-" : "";
	return {
		sessionToken: {
			name: `${t}authjs.session-token`,
			options: {
				httpOnly: !0,
				sameSite: "lax",
				path: "/",
				secure: e
			}
		},
		callbackUrl: {
			name: `${t}authjs.callback-url`,
			options: {
				httpOnly: !0,
				sameSite: "lax",
				path: "/",
				secure: e
			}
		},
		csrfToken: {
			name: `${e ? "__Host-" : ""}authjs.csrf-token`,
			options: {
				httpOnly: !0,
				sameSite: "lax",
				path: "/",
				secure: e
			}
		},
		pkceCodeVerifier: {
			name: `${t}authjs.pkce.code_verifier`,
			options: {
				httpOnly: !0,
				sameSite: "lax",
				path: "/",
				secure: e,
				maxAge: 900
			}
		},
		state: {
			name: `${t}authjs.state`,
			options: {
				httpOnly: !0,
				sameSite: "lax",
				path: "/",
				secure: e,
				maxAge: 900
			}
		},
		nonce: {
			name: `${t}authjs.nonce`,
			options: {
				httpOnly: !0,
				sameSite: "lax",
				path: "/",
				secure: e
			}
		},
		webauthnChallenge: {
			name: `${t}authjs.challenge`,
			options: {
				httpOnly: !0,
				sameSite: "lax",
				path: "/",
				secure: e,
				maxAge: 900
			}
		}
	};
}
var m = class {
	constructor(e, t, c) {
		if (i.add(this), a.set(this, {}), o.set(this, void 0), s.set(this, void 0), n(this, s, c, "f"), n(this, o, e, "f"), !t) return;
		let { name: l } = e;
		for (let [e, n] of Object.entries(t)) !e.startsWith(l) || !n || (r(this, a, "f")[e] = n);
	}
	get value() {
		return Object.keys(r(this, a, "f")).sort((e, t) => parseInt(e.split(".").pop() || "0") - parseInt(t.split(".").pop() || "0")).map((e) => r(this, a, "f")[e]).join("");
	}
	chunk(e, t) {
		let n = r(this, i, "m", l).call(this), a = r(this, i, "m", c).call(this, {
			name: r(this, o, "f").name,
			value: e,
			options: {
				...r(this, o, "f").options,
				...t
			}
		});
		for (let e of a) n[e.name] = e;
		return Object.values(n);
	}
	clean() {
		return Object.values(r(this, i, "m", l).call(this));
	}
};
a = /* @__PURE__ */ new WeakMap(), o = /* @__PURE__ */ new WeakMap(), s = /* @__PURE__ */ new WeakMap(), i = /* @__PURE__ */ new WeakSet(), c = function(e) {
	let t = Math.ceil(e.value.length / f);
	if (t === 1) return r(this, a, "f")[e.name] = e.value, [e];
	let n = [];
	for (let i = 0; i < t; i++) {
		let t = `${e.name}.${i}`, o = e.value.substr(i * f, f);
		n.push({
			...e,
			name: t,
			value: o
		}), r(this, a, "f")[t] = o;
	}
	return r(this, s, "f").debug("CHUNKING_SESSION_COOKIE", {
		message: `Session cookie exceeds allowed ${u} bytes.`,
		emptyCookieSize: d,
		valueSize: e.value.length,
		chunks: n.map((e) => e.value.length + d)
	}), n;
}, l = function() {
	let e = {};
	for (let t in r(this, a, "f")) delete r(this, a, "f")?.[t], e[t] = {
		name: t,
		value: "",
		options: {
			...r(this, o, "f").options,
			maxAge: 0
		}
	};
	return e;
};
//#endregion
//#region node_modules/@auth/core/errors.js
var h = class extends Error {
	constructor(e, t) {
		e instanceof Error ? super(void 0, { cause: {
			err: e,
			...e.cause,
			...t
		} }) : typeof e == "string" ? (t instanceof Error && (t = {
			err: t,
			...t.cause
		}), super(e, t)) : super(void 0, e), this.name = this.constructor.name, this.type = this.constructor.type ?? "AuthError", this.kind = this.constructor.kind ?? "error", Error.captureStackTrace?.(this, this.constructor);
		let n = `https://errors.authjs.dev#${this.type.toLowerCase()}`;
		this.message += `${this.message ? ". " : ""}Read more at ${n}`;
	}
}, g = class extends h {};
g.kind = "signIn";
var _ = class extends h {};
_.type = "AdapterError";
var v = class extends h {};
v.type = "AccessDenied";
var y = class extends h {};
y.type = "CallbackRouteError";
var b = class extends h {};
b.type = "ErrorPageLoop";
var x = class extends h {};
x.type = "EventError";
var S = class extends h {};
S.type = "InvalidCallbackUrl";
var C = class extends g {
	constructor() {
		super(...arguments), this.code = "credentials";
	}
};
C.type = "CredentialsSignin";
var w = class extends h {};
w.type = "InvalidEndpoints";
var T = class extends h {};
T.type = "InvalidCheck";
var E = class extends h {};
E.type = "JWTSessionError";
var ee = class extends h {};
ee.type = "MissingAdapter";
var te = class extends h {};
te.type = "MissingAdapterMethods";
var D = class extends h {};
D.type = "MissingAuthorize";
var ne = class extends h {};
ne.type = "MissingSecret";
var O = class extends g {};
O.type = "OAuthAccountNotLinked";
var k = class extends g {};
k.type = "OAuthCallbackError";
var A = class extends h {};
A.type = "OAuthProfileParseError";
var re = class extends h {};
re.type = "SessionTokenError";
var ie = class extends g {};
ie.type = "OAuthSignInError";
var ae = class extends g {};
ae.type = "EmailSignInError";
var oe = class extends h {};
oe.type = "SignOutError";
var se = class extends h {};
se.type = "UnknownAction";
var ce = class extends h {};
ce.type = "UnsupportedStrategy";
var le = class extends h {};
le.type = "InvalidProvider";
var ue = class extends h {};
ue.type = "UntrustedHost";
var de = class extends h {};
de.type = "Verification";
var fe = class extends g {};
fe.type = "MissingCSRF";
var pe = new Set([
	"CredentialsSignin",
	"OAuthAccountNotLinked",
	"OAuthCallbackError",
	"AccessDenied",
	"Verification",
	"MissingCSRF",
	"AccountNotLinked",
	"WebAuthnVerificationError"
]);
function me(e) {
	return e instanceof h ? pe.has(e.type) : !1;
}
var he = class extends h {};
he.type = "DuplicateConditionalUI";
var ge = class extends h {};
ge.type = "MissingWebAuthnAutocomplete";
var _e = class extends h {};
_e.type = "WebAuthnVerificationError";
var ve = class extends g {};
ve.type = "AccountNotLinked";
var ye = class extends h {};
ye.type = "ExperimentalFeatureNotEnabled";
//#endregion
//#region node_modules/@auth/core/lib/utils/assert.js
var be = !1;
function xe(e, t) {
	try {
		return /^https?:/.test(new URL(e, e.startsWith("/") ? t : void 0).protocol);
	} catch {
		return !1;
	}
}
function Se(e) {
	return /^v\d+(?:\.\d+){0,2}$/.test(e);
}
var Ce = !1, we = !1, Te = !1, Ee = [
	"createVerificationToken",
	"useVerificationToken",
	"getUserByEmail"
], De = [
	"createUser",
	"getUser",
	"getUserByEmail",
	"getUserByAccount",
	"updateUser",
	"linkAccount",
	"createSession",
	"getSessionAndUser",
	"updateSession",
	"deleteSession"
], Oe = [
	"createUser",
	"getUser",
	"linkAccount",
	"getAccount",
	"getAuthenticator",
	"createAuthenticator",
	"listAuthenticatorsByUserId",
	"updateAuthenticatorCounter"
];
function ke(e, t) {
	let { url: n } = e, r = [];
	if (!be && t.debug && r.push("debug-enabled"), !t.trustHost) return new ue(`Host must be trusted. URL was: ${e.url}`);
	if (!t.secret?.length) return new ne("Please define a `secret`");
	let i = e.query?.callbackUrl;
	if (i && !xe(i, n.origin)) return new S(`Invalid callback URL. Received: ${i}`);
	let { callbackUrl: a } = p(t.useSecureCookies ?? n.protocol === "https:"), o = e.cookies?.[t.cookies?.callbackUrl?.name ?? a.name];
	if (o && !xe(o, n.origin)) return new S(`Invalid callback URL. Received: ${o}`);
	let s = !1;
	for (let e of t.providers) {
		let t = typeof e == "function" ? e() : e;
		if ((t.type === "oauth" || t.type === "oidc") && !(t.issuer ?? t.options?.issuer)) {
			let { authorization: e, token: n, userinfo: r } = t, i;
			if (typeof e != "string" && !e?.url ? i = "authorization" : typeof n != "string" && !n?.url ? i = "token" : typeof r != "string" && !r?.url && (i = "userinfo"), i) return new w(`Provider "${t.id}" is missing both \`issuer\` and \`${i}\` endpoint config. At least one of them is required`);
		}
		if (t.type === "credentials") Ce = !0;
		else if (t.type === "email") we = !0;
		else if (t.type === "webauthn") {
			if (Te = !0, t.simpleWebAuthnBrowserVersion && !Se(t.simpleWebAuthnBrowserVersion)) return new h(`Invalid provider config for "${t.id}": simpleWebAuthnBrowserVersion "${t.simpleWebAuthnBrowserVersion}" must be a valid semver string.`);
			if (t.enableConditionalUI) {
				if (s) return new he("Multiple webauthn providers have 'enableConditionalUI' set to True. Only one provider can have this option enabled at a time");
				if (s = !0, !Object.values(t.formFields).some((e) => e.autocomplete && e.autocomplete.toString().indexOf("webauthn") > -1)) return new ge(`Provider "${t.id}" has 'enableConditionalUI' set to True, but none of its formFields have 'webauthn' in their autocomplete param`);
			}
		}
	}
	if (Ce) {
		let e = t.session?.strategy === "database", n = !t.providers.some((e) => (typeof e == "function" ? e() : e).type !== "credentials");
		if (e && n) return new ce("Signing in with credentials only supported if JWT strategy is enabled");
		if (t.providers.some((e) => {
			let t = typeof e == "function" ? e() : e;
			return t.type === "credentials" && !t.authorize;
		})) return new D("Must define an authorize() handler to use credentials authentication provider");
	}
	let { adapter: c, session: l } = t, u = [];
	if (we || l?.strategy === "database" || !l?.strategy && c) if (we) {
		if (!c) return new ee("Email login requires an adapter");
		u.push(...Ee);
	} else {
		if (!c) return new ee("Database session requires an adapter");
		u.push(...De);
	}
	if (Te) {
		if (t.experimental?.enableWebAuthn) r.push("experimental-webauthn");
		else return new ye("WebAuthn is an experimental feature. To enable it, set `experimental.enableWebAuthn` to `true` in your config");
		if (!c) return new ee("WebAuthn requires an adapter");
		u.push(...Oe);
	}
	if (c) {
		let e = u.filter((e) => !(e in c));
		if (e.length) return new te(`Required adapter methods were missing: ${e.join(", ")}`);
	}
	return be ||= !0, r;
}
//#endregion
//#region node_modules/@panva/hkdf/dist/web/runtime/hkdf.js
var Ae = () => {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	throw Error("unable to locate global object");
}, je = async (e, t, n, r, i) => {
	let { crypto: { subtle: a } } = Ae();
	return new Uint8Array(await a.deriveBits({
		name: "HKDF",
		hash: `SHA-${e.substr(3)}`,
		salt: n,
		info: r
	}, await a.importKey("raw", t, "HKDF", !1, ["deriveBits"]), i << 3));
};
//#endregion
//#region node_modules/@panva/hkdf/dist/web/index.js
function Me(e) {
	switch (e) {
		case "sha256":
		case "sha384":
		case "sha512":
		case "sha1": return e;
		default: throw TypeError("unsupported \"digest\" value");
	}
}
function Ne(e, t) {
	if (typeof e == "string") return new TextEncoder().encode(e);
	if (!(e instanceof Uint8Array)) throw TypeError(`"${t}"" must be an instance of Uint8Array or a string`);
	return e;
}
function Pe(e) {
	let t = Ne(e, "ikm");
	if (!t.byteLength) throw TypeError("\"ikm\" must be at least one byte in length");
	return t;
}
function Fe(e) {
	let t = Ne(e, "info");
	if (t.byteLength > 1024) throw TypeError("\"info\" must not contain more than 1024 bytes");
	return t;
}
function Ie(e, t) {
	if (typeof e != "number" || !Number.isInteger(e) || e < 1) throw TypeError("\"keylen\" must be a positive integer");
	if (e > 255 * (parseInt(t.substr(3), 10) >> 3 || 20)) throw TypeError("\"keylen\" too large");
	return e;
}
async function Le(e, t, n, r, i) {
	return je(Me(e), Pe(t), Ne(n, "salt"), Fe(r), Ie(i, e));
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/buffer_utils.js
var Re = new TextEncoder(), ze = new TextDecoder(), Be = new TextDecoder("utf-8", { fatal: !0 }), Ve = 2 ** 32;
function j(...e) {
	let t = e.reduce((e, { length: t }) => e + t, 0), n = new Uint8Array(t), r = 0;
	for (let t of e) n.set(t, r), r += t.length;
	return n;
}
function He(e, t, n) {
	if (t < 0 || t >= Ve) throw RangeError(`value must be >= 0 and <= ${Ve - 1}. Received ${t}`);
	e.set([
		t >>> 24,
		t >>> 16,
		t >>> 8,
		t & 255
	], n);
}
function Ue(e) {
	let t = Math.floor(e / Ve), n = e % Ve, r = new Uint8Array(8);
	return He(r, t, 0), He(r, n, 4), r;
}
function We(e) {
	let t = new Uint8Array(4);
	return He(t, e), t;
}
function M(e) {
	let t = new Uint8Array(e.length);
	for (let n = 0; n < e.length; n++) {
		let r = e.charCodeAt(n);
		if (r > 127) throw TypeError("non-ASCII string encountered in encode()");
		t[n] = r;
	}
	return t;
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/crypto_key.js
var Ge = (e, t = "algorithm.name") => /* @__PURE__ */ TypeError(`CryptoKey does not support this operation, its ${t} must be ${e}`);
function Ke(e, t) {
	if (t && !e.usages.includes(t)) throw TypeError(`CryptoKey does not support this operation, its usages must include ${t}.`);
}
function qe(e, t) {
	let { modulusLength: n } = t.algorithm;
	if (typeof n != "number" || n < 2048) throw TypeError(`${e} requires key modulusLength to be 2048 bits or larger`);
}
function Je(e, t, n) {
	let r = e.algorithm;
	if (r.name !== t.name) throw Ge(t.name);
	if (t.hash && r.hash?.name !== t.hash) throw Ge(t.hash, "algorithm.hash");
	if (t.namedCurve && r.namedCurve !== t.namedCurve) throw Ge(t.namedCurve, "algorithm.namedCurve");
	if (t.length !== void 0 && r.length !== t.length) throw Ge(t.length, "algorithm.length");
	Ke(e, n);
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/invalid_key_input.js
function Ye(e, t, ...n) {
	if (n.length > 2) {
		let t = n.pop();
		e += `one of type ${n.join(", ")}, or ${t}.`;
	} else n.length === 2 ? e += `one of type ${n[0]} or ${n[1]}.` : e += `of type ${n[0]}.`;
	return t == null ? e += ` Received ${t}` : typeof t == "function" && t.name ? e += ` Received function ${t.name}` : typeof t == "object" && t && t.constructor?.name && (e += ` Received an instance of ${t.constructor.name}`), e;
}
var Xe = (e, ...t) => Ye("Key must be ", e, ...t), Ze = (e, t, ...n) => Ye(`Key for the ${e} algorithm must be `, t, ...n), Qe = class extends Error {
	static code = "ERR_JOSE_GENERIC";
	code = "ERR_JOSE_GENERIC";
	constructor(e, t) {
		super(e, t), this.name = this.constructor.name, Error.captureStackTrace?.(this, this.constructor);
	}
}, $e = class extends Qe {
	static code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
	code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
	claim;
	reason;
	payload;
	constructor(e, t, n = "unspecified", r = "unspecified") {
		super(e, { cause: {
			claim: n,
			reason: r,
			payload: t
		} }), this.claim = n, this.reason = r, this.payload = t;
	}
}, et = class extends Qe {
	static code = "ERR_JWT_EXPIRED";
	code = "ERR_JWT_EXPIRED";
	claim;
	reason;
	payload;
	constructor(e, t, n = "unspecified", r = "unspecified") {
		super(e, { cause: {
			claim: n,
			reason: r,
			payload: t
		} }), this.claim = n, this.reason = r, this.payload = t;
	}
}, tt = class extends Qe {
	static code = "ERR_JOSE_ALG_NOT_ALLOWED";
	code = "ERR_JOSE_ALG_NOT_ALLOWED";
}, N = class extends Qe {
	static code = "ERR_JOSE_NOT_SUPPORTED";
	code = "ERR_JOSE_NOT_SUPPORTED";
}, nt = class extends Qe {
	static code = "ERR_JWE_DECRYPTION_FAILED";
	code = "ERR_JWE_DECRYPTION_FAILED";
	constructor(e = "decryption operation failed", t) {
		super(e, t);
	}
}, P = class extends Qe {
	static code = "ERR_JWE_INVALID";
	code = "ERR_JWE_INVALID";
}, rt = class extends Qe {
	static code = "ERR_JWT_INVALID";
	code = "ERR_JWT_INVALID";
}, it = class extends Qe {
	static code = "ERR_JWK_INVALID";
	code = "ERR_JWK_INVALID";
};
//#endregion
//#region node_modules/jose/dist/webapi/lib/is_key_like.js
function at(e) {
	if (!ot(e)) throw Error("CryptoKey instance expected");
}
var ot = (e) => {
	if (e?.[Symbol.toStringTag] === "CryptoKey") return !0;
	try {
		return e instanceof CryptoKey;
	} catch {
		return !1;
	}
}, st = (e) => e?.[Symbol.toStringTag] === "KeyObject", ct = (e) => ot(e) || st(e), lt = (e) => crypto.getRandomValues(new Uint8Array(e.cekBits >> 3));
function ut(e, t) {
	let n = e.byteLength << 3;
	if (n !== t) throw new P(`Invalid Content Encryption Key length. Expected ${t} bits, got ${n} bits`);
}
var dt = (e) => crypto.getRandomValues(new Uint8Array(e.ivBits >> 3));
function ft(e, t) {
	if (t.length << 3 !== e.ivBits) throw new P("Invalid Initialization Vector length");
}
async function pt(e, t, n) {
	if (!(t instanceof Uint8Array)) throw TypeError(Xe(t, "Uint8Array"));
	let r = e.cekBits >> 1;
	return [
		await crypto.subtle.importKey("raw", t.subarray(r >> 3), "AES-CBC", !1, [n]),
		await crypto.subtle.importKey("raw", t.subarray(0, r >> 3), {
			hash: `SHA-${r << 1}`,
			name: "HMAC"
		}, !1, ["sign"]),
		r
	];
}
async function mt(e, t, n) {
	return new Uint8Array((await crypto.subtle.sign("HMAC", e, t)).slice(0, n >> 3));
}
async function ht(e, t, n, r, i) {
	let [a, o, s] = await pt(e, n, "encrypt"), c = new Uint8Array(await crypto.subtle.encrypt({
		iv: r,
		name: "AES-CBC"
	}, a, t));
	return {
		ciphertext: c,
		tag: await mt(o, j(i, r, c, Ue(i.length * 8)), s),
		iv: r
	};
}
async function gt(e, t) {
	let n = {
		name: "HMAC",
		hash: "SHA-256"
	}, r = await crypto.subtle.generateKey(n, !1, ["sign", "verify"]), i = await crypto.subtle.sign(n, r, e);
	return crypto.subtle.verify(n, r, i, t);
}
async function _t(e, t, n, r, i, a) {
	let [o, s, c] = await pt(e, t, "decrypt"), l = await mt(s, j(a, r, n, Ue(a.length * 8)), c), u;
	try {
		u = await gt(i, l);
	} catch {}
	if (!u) throw new nt();
	let d;
	try {
		d = new Uint8Array(await crypto.subtle.decrypt({
			iv: r,
			name: "AES-CBC"
		}, o, n));
	} catch {}
	if (!d) throw new nt();
	return d;
}
async function vt(e, t, n, r, i) {
	let a = n instanceof Uint8Array ? await crypto.subtle.importKey("raw", n, "AES-GCM", !1, ["encrypt"]) : (Je(n, e.subtle, "encrypt"), n), o = new Uint8Array(await crypto.subtle.encrypt({
		additionalData: i,
		iv: r,
		name: "AES-GCM",
		tagLength: 128
	}, a, t)), s = o.slice(-16);
	return {
		ciphertext: o.slice(0, -16),
		tag: s,
		iv: r
	};
}
async function yt(e, t, n, r, i, a) {
	let o = t instanceof Uint8Array ? await crypto.subtle.importKey("raw", t, "AES-GCM", !1, ["decrypt"]) : (Je(t, e.subtle, "decrypt"), t);
	try {
		return new Uint8Array(await crypto.subtle.decrypt({
			additionalData: a,
			iv: r,
			name: "AES-GCM",
			tagLength: 128
		}, o, j(n, i)));
	} catch {
		throw new nt();
	}
}
async function bt(e, t, n, r, i) {
	if (!ot(n) && !(n instanceof Uint8Array)) throw TypeError(Xe(n, "CryptoKey", "KeyObject", "Uint8Array", "JSON Web Key"));
	return r ? ft(e, r) : r = dt(e), n instanceof Uint8Array && ut(n, e.cekBits), e.cbc ? ht(e, t, n, r, i) : vt(e, t, n, r, i);
}
async function xt(e, t, n, r, i, a) {
	if (!ot(t) && !(t instanceof Uint8Array)) throw TypeError(Xe(t, "CryptoKey", "KeyObject", "Uint8Array", "JSON Web Key"));
	if (!r) throw new P("JWE Initialization Vector missing");
	if (!i) throw new P("JWE Authentication Tag missing");
	return ft(e, r), t instanceof Uint8Array && ut(t, e.cekBits), e.cbc ? _t(e, t, n, r, i, a) : yt(e, t, n, r, i, a);
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/base64.js
function St(e) {
	if (Uint8Array.prototype.toBase64) return e.toBase64();
	let t = 32768, n = [];
	for (let r = 0; r < e.length; r += t) n.push(String.fromCharCode.apply(null, e.subarray(r, r + t)));
	return btoa(n.join(""));
}
function Ct(e) {
	if (Uint8Array.fromBase64) return Uint8Array.fromBase64(e);
	let t = atob(e), n = new Uint8Array(t.length);
	for (let e = 0; e < t.length; e++) n[e] = t.charCodeAt(e);
	return n;
}
//#endregion
//#region node_modules/jose/dist/webapi/util/base64url.js
var wt = "The input to be decoded is not correctly encoded.";
function Tt(e) {
	if (Uint8Array.fromBase64) try {
		return Uint8Array.fromBase64(typeof e == "string" ? e : ze.decode(e), { alphabet: "base64url" });
	} catch (e) {
		throw TypeError(wt, { cause: e });
	}
	let t = e;
	if (t instanceof Uint8Array && (t = ze.decode(t)), t.includes("+") || t.includes("/")) throw TypeError(wt);
	t = t.replace(/-/g, "+").replace(/_/g, "/");
	try {
		return Ct(t);
	} catch {
		throw TypeError(wt);
	}
}
function F(e) {
	let t = e;
	return typeof t == "string" && (t = Re.encode(t)), Uint8Array.prototype.toBase64 ? t.toBase64({
		alphabet: "base64url",
		omitPadding: !0
	}) : St(t).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/type_checks.js
function Et(e) {
	if (typeof e != "object" || !e || Object.prototype.toString.call(e) !== "[object Object]") return !1;
	let t = Object.getPrototypeOf(e);
	if (t === null) return !0;
	let n = t;
	for (; Object.getPrototypeOf(n) !== null;) n = Object.getPrototypeOf(n);
	return t === n;
}
function Dt(...e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) if (n) for (let e of Object.keys(n)) {
		if (t.has(e)) return !1;
		t.add(e);
	}
	return !0;
}
var Ot = (e) => Et(e) && typeof e.kty == "string", kt = (e) => e.kty !== "oct" && (e.kty === "AKP" && typeof e.priv == "string" || typeof e.d == "string"), At = (e) => e.kty !== "oct" && e.d === void 0 && e.priv === void 0, jt = (e) => e.kty === "oct" && typeof e.k == "string", Mt = Symbol();
function I(e, t) {
	if (e) throw TypeError(`${t} can only be called once`);
}
function Nt(e, t, n) {
	try {
		return Tt(e);
	} catch {
		throw new n(`Failed to base64url decode the ${t}`);
	}
}
function Pt(e, t, n) {
	try {
		return M(e);
	} catch {
		throw new n(`The ${t} is not a valid base64url string`);
	}
}
async function Ft(e, t) {
	let n = `SHA-${e.slice(-3)}`;
	return new Uint8Array(await crypto.subtle.digest(n, t));
}
function It(e, t, n) {
	let r;
	try {
		r = JSON.parse(Be.decode(Tt(e)));
	} catch {
		throw new t(n);
	}
	if (!Et(r)) throw new t(n);
	return r;
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/jwk_to_key.js
async function Lt(e, t) {
	if (t.kty === "RSA" && "oth" in t && t.oth !== void 0) throw new N("RSA JWK \"oth\" (Other Primes Info) Parameter value is not supported");
	if (!e.kty.includes(t.kty)) throw new N("Invalid or unsupported JWK \"alg\" (Algorithm) Parameter value");
	let n = e.resolve?.({
		kty: t.kty,
		crv: t.crv
	}) ?? e.subtle, r = !!(t.d || t.priv), i = { ...t };
	return i.kty !== "AKP" && delete i.alg, delete i.use, crypto.subtle.importKey("jwk", i, n, t.ext ?? !r, t.key_ops ?? e.usages[+!!r]);
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/key.js
var Rt = (e) => e[Symbol.toStringTag], zt = (e, t, n) => {
	let { alg: r } = e;
	if (t.use !== void 0) {
		let e = n === "sign" || n === "verify" ? "sig" : "enc";
		if (t.use !== e) throw TypeError(`Invalid key for this operation, its "use" must be "${e}" when present`);
	}
	if (t.alg !== void 0 && t.alg !== r) throw TypeError(`Invalid key for this operation, its "alg" must be "${r}" when present`);
	if (Array.isArray(t.key_ops)) {
		let r = n === "encrypt" || n === "decrypt" ? e.ops?.[n === "encrypt" ? 0 : 1] : n;
		if (r && !t.key_ops.includes(r)) throw TypeError(`Invalid key for this operation, its "key_ops" must include "${r}" when present`);
	}
};
function Bt(e, t, n) {
	let { alg: r, secret: i } = e, a = n === "decrypt" || n === "sign";
	if (i && t instanceof Uint8Array) return [Vt, t];
	if (Ot(t)) {
		if (i ? !jt(t) : !(a ? kt(t) : At(t))) throw TypeError(i ? "JSON Web Key for symmetric algorithms must have JWK \"kty\" (Key Type) equal to \"oct\" and the JWK \"k\" (Key Value) present" : `JSON Web Key for this operation must be a ${a ? "private" : "public"} JWK`);
		return zt(e, t, n), [Wt, t];
	}
	if (!ct(t)) throw TypeError(i ? Ze(r, t, "CryptoKey", "KeyObject", "JSON Web Key", "Uint8Array") : Ze(r, t, "CryptoKey", "KeyObject", "JSON Web Key"));
	if (i) {
		if (t.type !== "secret") throw TypeError(`${Rt(t)} instances for symmetric algorithms must be of type "secret"`);
	} else {
		if (t.type === "secret") throw TypeError(`${Rt(t)} instances for asymmetric algorithms must not be of type "secret"`);
		let e = a ? "private" : "public";
		if ((t.type === "public" || t.type === "private") && t.type !== e) {
			let r = n === "sign" ? "signing" : n === "verify" ? "verifying" : `${n.slice(0, -1)}tion`;
			throw TypeError(`${Rt(t)} instances for asymmetric algorithm ${r} must be of type "${e}"`);
		}
	}
	return ot(t) ? [Ht, t] : [Ut, t];
}
var Vt = 0, Ht = 1, Ut = 2, Wt = 3, Gt, Kt = {
	__proto__: null,
	prime256v1: "P-256",
	secp384r1: "P-384",
	secp521r1: "P-521"
};
function qt(e, t, n) {
	Gt ||= /* @__PURE__ */ new WeakMap();
	let r = Gt.get(e);
	return n && (r ? r[t] = n : Gt.set(e, {
		__proto__: null,
		[t]: n
	})), n ?? r?.[t];
}
var Jt = async (e, t, n) => qt(e, n.alg) ?? qt(e, n.alg, await Lt(n, {
	...t,
	alg: n.alg
})), Yt = (e, t) => {
	let n = qt(e, t.alg);
	if (n) return n;
	let r = e.type === "public", i = t.usages[+!r], { asymmetricKeyType: a } = e, o = Kt[e.asymmetricKeyDetails?.namedCurve], s = t.resolve?.({
		crv: o,
		asymmetricKeyType: a
	}) ?? t.subtle;
	return qt(e, t.alg, e.toCryptoKey(s, r, i));
};
async function Xt(e, t, n) {
	let r = Bt(e, t, n);
	switch (r[0]) {
		case Vt:
		case Ht: return r[1];
		case Wt: {
			let t = r[1];
			if (t.k) return Tt(t.k);
			if (!Object.isFrozen(t)) {
				let { key_ops: e } = t;
				Array.isArray(e) && Object.freeze(e), Object.freeze(t);
			}
			return Jt(t, t, e);
		}
		case Ut: {
			let t = r[1];
			return t.type === "secret" ? t.export() : "toCryptoKey" in t && typeof t.toCryptoKey == "function" ? Yt(t, e) : Jt(t, t.export({ format: "jwk" }), e);
		}
	}
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/key_descriptor.js
function Zt(e) {
	let t = { __proto__: null };
	for (let n in e) t[n] = {
		...e[n],
		alg: n
	};
	return t;
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/jwe_algorithms.js
var Qt = [["encrypt", "wrapKey"], ["decrypt", "unwrapKey"]], $t = [[], ["deriveBits"]], en = [[], []];
function tn(e) {
	return {
		kty: ["RSA"],
		subtle: {
			name: "RSA-OAEP",
			hash: `SHA-${e}`
		},
		usages: Qt,
		ops: ["wrapKey", "unwrapKey"]
	};
}
function nn() {
	return {
		kty: ["EC", "OKP"],
		subtle: { name: "ECDH" },
		resolve: ({ kty: e, crv: t, asymmetricKeyType: n }) => {
			if (t === "X25519" || n === "x25519") return { name: "X25519" };
			if (e === "OKP") throw new N("Invalid or unsupported JWK \"alg\" (Algorithm) Parameter value");
			return {
				name: "ECDH",
				namedCurve: t
			};
		},
		usages: $t,
		ops: [void 0, "deriveBits"]
	};
}
function rn(e, t = !1) {
	return {
		kty: ["oct"],
		secret: !0,
		subtle: {
			name: t ? "AES-GCM" : "AES-KW",
			length: e
		},
		usages: en,
		ops: t ? ["encrypt", "decrypt"] : ["wrapKey", "unwrapKey"]
	};
}
function an() {
	return {
		kty: ["oct"],
		secret: !0,
		subtle: { name: "PBKDF2" },
		usages: en,
		ops: ["deriveBits", "deriveBits"]
	};
}
var on = Zt({
	dir: {
		kty: ["oct"],
		secret: !0,
		subtle: { name: "AES-GCM" },
		usages: en,
		ops: ["encrypt", "decrypt"]
	},
	"RSA-OAEP": tn(1),
	"RSA-OAEP-256": tn(256),
	"RSA-OAEP-384": tn(384),
	"RSA-OAEP-512": tn(512),
	"ECDH-ES": nn(),
	"ECDH-ES+A128KW": nn(),
	"ECDH-ES+A192KW": nn(),
	"ECDH-ES+A256KW": nn(),
	A128KW: rn(128),
	A192KW: rn(192),
	A256KW: rn(256),
	A128GCMKW: rn(128, !0),
	A192GCMKW: rn(192, !0),
	A256GCMKW: rn(256, !0),
	"PBES2-HS256+A128KW": an(),
	"PBES2-HS384+A192KW": an(),
	"PBES2-HS512+A256KW": an()
}), sn = ["encrypt", "decrypt"];
function cn(e, t = !1) {
	return {
		kty: ["oct"],
		secret: !0,
		subtle: {
			name: t ? "AES-CBC" : "AES-GCM",
			length: e
		},
		usages: en,
		ops: sn,
		cekBits: e,
		ivBits: t ? 128 : 96,
		cbc: t
	};
}
var ln = Zt({
	A128GCM: cn(128),
	A192GCM: cn(192),
	A256GCM: cn(256),
	"A128CBC-HS256": cn(256, !0),
	"A192CBC-HS384": cn(384, !0),
	"A256CBC-HS512": cn(512, !0)
});
function un(e, t) {
	throw new N(`Invalid or unsupported "${e}" (JWE ${t}) header value`);
}
function dn(e) {
	return (typeof e == "string" ? on[e] : void 0) ?? un("alg", "Algorithm");
}
function fn(e) {
	return (typeof e == "string" ? ln[e] : void 0) ?? un("enc", "Encryption Algorithm");
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/key_management.js
function pn(e, t) {
	if (e.algorithm.name !== "ECDH" && e.algorithm.name !== "X25519") throw TypeError("CryptoKey does not support this operation, its algorithm.name must be ECDH or X25519");
	Ke(e, t);
}
async function mn(e, t, n) {
	let r = dn(t).subtle, i = e instanceof Uint8Array ? await crypto.subtle.importKey("raw", e, "AES-KW", !0, [n]) : e;
	return Je(i, r, n), i;
}
async function hn(e, t, n) {
	let r = await mn(t, e, "wrapKey"), i = await crypto.subtle.importKey("raw", n, {
		hash: "SHA-256",
		name: "HMAC"
	}, !0, ["sign"]);
	return new Uint8Array(await crypto.subtle.wrapKey("raw", i, r, "AES-KW"));
}
async function gn(e, t, n) {
	let r = await mn(t, e, "unwrapKey"), i = await crypto.subtle.unwrapKey("raw", n, r, "AES-KW", {
		hash: "SHA-256",
		name: "HMAC"
	}, !0, ["sign"]);
	return new Uint8Array(await crypto.subtle.exportKey("raw", i));
}
function _n(e, t, n) {
	Je(t, dn(e).subtle, n), qe(e, t);
}
function vn(e, t) {
	return e instanceof Uint8Array ? crypto.subtle.importKey("raw", e, "PBKDF2", !1, ["deriveBits"]) : (Je(e, dn(t).subtle, "deriveBits"), e);
}
async function yn(e, t, n, r) {
	if (!(e instanceof Uint8Array) || e.length < 8) throw new P("PBES2 Salt Input must be 8 or more octets");
	if (!Number.isSafeInteger(n) || Math.sign(n) !== 1) throw new P("PBES2 Count Input must be a positive integer");
	let i = j(M(t), Uint8Array.of(0), e), a = parseInt(t.slice(13, 16), 10), o = {
		hash: `SHA-${t.slice(8, 11)}`,
		iterations: n,
		name: "PBKDF2",
		salt: i
	}, s = await vn(r, t);
	return new Uint8Array(await crypto.subtle.deriveBits(o, s, a));
}
function bn(e) {
	return j(We(e.length), e);
}
async function xn(e, t, n) {
	let r = t >> 3, i = Math.ceil(r / 32), a = new Uint8Array(i * 32);
	for (let t = 1; t <= i; t++) {
		let r = await Ft("sha256", j(We(t), e, n));
		a.set(r, (t - 1) * 32);
	}
	return a.slice(0, r);
}
async function Sn(e, t, n, r, i = new Uint8Array(), a = new Uint8Array()) {
	pn(e), pn(t, "deriveBits");
	let o = j(bn(M(n)), bn(i), bn(a), We(r));
	return xn(new Uint8Array(await crypto.subtle.deriveBits({
		name: e.algorithm.name,
		public: e
	}, t, e.algorithm.name === "X25519" ? 256 : Math.ceil(parseInt(e.algorithm.namedCurve.slice(-3), 10) / 8) << 3)), r, o);
}
function Cn(e) {
	at(e);
	let t = e.algorithm.namedCurve;
	if (t !== "P-256" && t !== "P-384" && t !== "P-521" && e.algorithm.name !== "X25519") throw new N("ECDH with the provided key is not allowed or not supported by your javascript runtime");
}
function wn(e) {
	if (e === void 0) throw new P("JWE Encrypted Key missing");
}
function Tn(e) {
	if (e !== void 0) throw new P("Encountered unexpected JWE Encrypted Key");
}
async function En(e, t, n, r, i, a) {
	let o = dn(e);
	if (e === "dir") return Tn(r), n;
	switch (o.subtle.name) {
		case "ECDH": {
			if (e === "ECDH-ES" && Tn(r), !Et(i.epk)) throw new P("JOSE Header \"epk\" (Ephemeral Public Key) missing or invalid");
			Cn(n);
			let a = await Lt(o, i.epk), s, c;
			if (i.apu !== void 0) {
				if (typeof i.apu != "string") throw new P("JOSE Header \"apu\" (Agreement PartyUInfo) invalid");
				s = Nt(i.apu, "apu", P);
			}
			if (i.apv !== void 0) {
				if (typeof i.apv != "string") throw new P("JOSE Header \"apv\" (Agreement PartyVInfo) invalid");
				c = Nt(i.apv, "apv", P);
			}
			let l = await Sn(a, n, e === "ECDH-ES" ? t.alg : e, e === "ECDH-ES" ? t.cekBits : parseInt(e.slice(-5, -2), 10), s, c);
			return e === "ECDH-ES" ? l : (wn(r), gn(e.slice(-6), l, r));
		}
		case "RSA-OAEP": return wn(r), at(n), _n(e, n, "decrypt"), new Uint8Array(await crypto.subtle.decrypt("RSA-OAEP", n, r));
		case "PBKDF2": {
			if (wn(r), typeof i.p2c != "number") throw new P("JOSE Header \"p2c\" (PBES2 Count) missing or invalid");
			let t = a?.maxPBES2Count || 1e4;
			if (i.p2c > t) throw new P("JOSE Header \"p2c\" (PBES2 Count) out is of acceptable bounds");
			if (typeof i.p2s != "string") throw new P("JOSE Header \"p2s\" (PBES2 Salt) missing or invalid");
			let o = await yn(Nt(i.p2s, "p2s", P), e, i.p2c, n);
			return gn(e.slice(-6), o, r);
		}
		case "AES-KW": return wn(r), gn(e, n, r);
		case "AES-GCM": {
			if (wn(r), typeof i.iv != "string") throw new P("JOSE Header \"iv\" (Initialization Vector) missing or invalid");
			if (typeof i.tag != "string") throw new P("JOSE Header \"tag\" (Authentication Tag) missing or invalid");
			let t;
			t = Nt(i.iv, "iv", P);
			let a;
			return a = Nt(i.tag, "tag", P), xt(fn(e.slice(0, -2)), n, r, t, a, new Uint8Array());
		}
	}
}
async function Dn(e, t, n, r, i = {}) {
	let a, o, s, c = dn(e);
	if (e === "dir") return [
		n,
		void 0,
		void 0
	];
	switch (c.subtle.name) {
		case "ECDH": {
			Cn(n);
			let { apu: l, apv: u } = i, d;
			d = i.epk ? await Xt(c, i.epk, "decrypt") : (await crypto.subtle.generateKey(n.algorithm, !0, ["deriveBits"])).privateKey;
			let f = crypto.subtle, p = d;
			if (!p.extractable) {
				if (typeof f.getPublicKey != "function") throw TypeError("CryptoKey for \"epk\" must be extractable");
				p = await f.getPublicKey(d, []);
			}
			let { x: m, y: h, crv: g, kty: _ } = await f.exportKey("jwk", p), v = await Sn(n, d, e === "ECDH-ES" ? t.alg : e, e === "ECDH-ES" ? t.cekBits : parseInt(e.slice(-5, -2), 10), l, u);
			if (o = { epk: {
				x: m,
				crv: g,
				kty: _
			} }, _ === "EC" && (o.epk.y = h), l && (o.apu = F(l)), u && (o.apv = F(u)), e === "ECDH-ES") {
				s = v;
				break;
			}
			s = r || lt(t), a = await hn(e.slice(-6), v, s);
			break;
		}
		case "RSA-OAEP":
			s = r || lt(t), at(n), _n(e, n, "encrypt"), a = new Uint8Array(await crypto.subtle.encrypt("RSA-OAEP", n, s));
			break;
		case "PBKDF2": {
			s = r || lt(t);
			let { p2c: c = 2048, p2s: l = crypto.getRandomValues(new Uint8Array(16)) } = i, u = await yn(l, e, c, n);
			a = await hn(e.slice(-6), u, s), o = {
				p2c: c,
				p2s: F(l)
			};
			break;
		}
		case "AES-KW":
			s = r || lt(t), a = await hn(e, n, s);
			break;
		case "AES-GCM": {
			s = r || lt(t);
			let { iv: c } = i, l = await bt(fn(e.slice(0, -2)), s, n, c, new Uint8Array());
			a = l.ciphertext, o = {
				iv: F(l.iv),
				tag: F(l.tag)
			};
			break;
		}
	}
	return [
		s,
		a,
		o
	];
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/options.js
var On = { __proto__: null };
function kn(e, t) {
	if (t !== void 0 && (!Array.isArray(t) || t.some((e) => typeof e != "string"))) throw TypeError(`"${e}" option must be an array of strings`);
	if (t) return new Set(t);
}
function An(e, t) {
	let { crit: n } = t ?? {};
	if (Array.isArray(n) && new Set(n).size !== n.length) throw new e("\"crit\" (Critical) Header Parameter MUST NOT contain duplicate values");
}
function jn(e, t, n, r, i) {
	if (i.crit !== void 0 && r?.crit === void 0) throw new e("\"crit\" (Critical) Header Parameter MUST be integrity protected");
	if (!r || r.crit === void 0) return [];
	if (!Array.isArray(r.crit) || r.crit.length === 0 || r.crit.some((e) => typeof e != "string" || e.length === 0)) throw new e("\"crit\" (Critical) Header Parameter MUST be an array of non-empty strings when present");
	let a = n === void 0 ? t : {
		__proto__: null,
		...n,
		...t
	};
	for (let t of r.crit) {
		if (!(t in a)) throw new N(`Extension Header Parameter "${t}" is not recognized`);
		if (!Object.hasOwn(i, t) || i[t] === void 0) throw new e(`Extension Header Parameter "${t}" is missing`);
		if (a[t] && (!Object.hasOwn(r, t) || r[t] === void 0)) throw new e(`Extension Header Parameter "${t}" MUST be integrity protected`);
	}
	return r.crit;
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/deflate.js
function Mn(e) {
	if (globalThis[e] === void 0) throw new N(`JWE "zip" (Compression Algorithm) Header Parameter requires the ${e} API.`);
}
async function Nn(e) {
	Mn("CompressionStream");
	let t = new CompressionStream("deflate-raw"), n = t.writable.getWriter();
	n.write(e).catch(() => {}), n.close().catch(() => {});
	let r = [], i = t.readable.getReader();
	for (;;) {
		let { value: e, done: t } = await i.read();
		if (t) break;
		r.push(e);
	}
	return j(...r);
}
async function Pn(e, t) {
	Mn("DecompressionStream");
	let n = new DecompressionStream("deflate-raw"), r = n.writable.getWriter();
	r.write(e).catch(() => {}), r.close().catch(() => {});
	let i = [], a = 0, o = n.readable.getReader();
	for (;;) {
		let { value: e, done: n } = await o.read();
		if (n) break;
		if (i.push(e), a += e.byteLength, t !== Infinity && a > t) throw new P("Decompressed plaintext exceeded the configured limit");
	}
	return j(...i);
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/jwe_decrypt.js
function Fn(e) {
	let { protected: t, ciphertext: n, iv: r, tag: i, aad: a } = e, o;
	t && (o = It(t, P, "JWE Protected Header is invalid"));
	let s = t === void 0 ? new Uint8Array() : M(t);
	return [
		o,
		Nt(n, "ciphertext", P),
		r === void 0 ? void 0 : Nt(r, "iv", P),
		i === void 0 ? void 0 : Nt(i, "tag", P),
		a === void 0 ? s : j(s, M("."), Pt(a, "aad", P))
	];
}
function In(e) {
	return [
		e && kn("keyManagementAlgorithms", e.keyManagementAlgorithms),
		e && kn("contentEncryptionAlgorithms", e.contentEncryptionAlgorithms),
		e
	];
}
async function Ln(e, t, n, r) {
	let [i, a, o] = n, [s, c, l, u, d] = t, { encrypted_key: f, header: p, unprotected: m } = e, h;
	if (p !== void 0 || m !== void 0) {
		if (!Dt(s, p, m)) throw new P("JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint");
		h = {
			...s,
			...p,
			...m
		};
	} else h = s ?? {};
	if (jn(P, On, o?.crit, s, h), h.zip !== void 0 && h.zip !== "DEF") throw new N("Unsupported JWE \"zip\" (Compression Algorithm) Header Parameter value.");
	if (h.zip !== void 0 && !s?.zip) throw new P("JWE \"zip\" (Compression Algorithm) Header Parameter MUST be in a protected header.");
	let { alg: g, enc: _ } = h;
	if (typeof g != "string" || !g) throw new P("missing JWE Algorithm (alg) in JWE Header");
	if (typeof _ != "string" || !_) throw new P("missing JWE Encryption Algorithm (enc) in JWE Header");
	if (i && !i.has(g) || !i && g.startsWith("PBES2")) throw new tt("\"alg\" (Algorithm) Header Parameter value not allowed");
	if (a && !a.has(_)) throw new tt("\"enc\" (Encryption Algorithm) Header Parameter value not allowed");
	let v = fn(_), y;
	f !== void 0 && (y = Nt(f, "encrypted_key", P));
	let b = !1;
	typeof r == "function" && (r = await r(s, e), b = !0);
	let x = dn(g), S = await Xt(g === "dir" ? v : x, r, "decrypt"), C;
	try {
		C = await En(g, v, S, y, h, o);
	} catch (e) {
		if (e instanceof TypeError || e instanceof P || e instanceof N) throw e;
		C = lt(v);
	}
	let w = await xt(v, C, c, l, u, d);
	if (h.zip === "DEF") {
		let e = o?.maxDecompressedLength ?? 25e4;
		if (e === 0) throw new N("JWE \"zip\" (Compression Algorithm) Header Parameter is not supported.");
		if (e !== Infinity && (!Number.isSafeInteger(e) || e < 1)) throw TypeError("maxDecompressedLength must be 0, a positive safe integer, or Infinity");
		w = await Pn(w, e).catch((e) => {
			throw e instanceof P ? e : new P("Failed to decompress plaintext", { cause: e });
		});
	}
	return [
		w,
		s,
		S,
		b
	];
}
async function Rn(e, t, n) {
	return Ln(e, Fn(e), t, n);
}
async function zn(e, t, n) {
	if (e instanceof Uint8Array && (e = ze.decode(e)), typeof e != "string") throw new P("Compact JWE must be a string or Uint8Array");
	let { 0: r, 1: i, 2: a, 3: o, 4: s, length: c } = e.split(".");
	if (c !== 5) throw new P("Invalid Compact JWE");
	return Rn({
		ciphertext: o,
		iv: a || void 0,
		protected: r,
		tag: s || void 0,
		encrypted_key: i || void 0
	}, t, n);
}
//#endregion
//#region node_modules/jose/dist/webapi/lib/jwe_encrypt.js
function Bn(e, t, n) {
	if (!Dt(e, t, n)) throw new P("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
}
function Vn(e) {
	let [, t, n, r, , , , , i] = e;
	Bn(t, n, r);
	let a = {
		...t,
		...n,
		...r
	};
	if (jn(P, On, i, t, a), a.zip !== void 0 && a.zip !== "DEF") throw new N("Unsupported JWE \"zip\" (Compression Algorithm) Header Parameter value.");
	if (a.zip !== void 0 && !t?.zip) throw new P("JWE \"zip\" (Compression Algorithm) Header Parameter MUST be in a protected header.");
	let { alg: o, enc: s } = a;
	if (typeof o != "string" || !o) throw new P("JWE \"alg\" (Algorithm) Header Parameter missing or invalid");
	if (typeof s != "string" || !s) throw new P("JWE \"enc\" (Encryption Algorithm) Header Parameter missing or invalid");
	return [
		a,
		o,
		s,
		fn(s)
	];
}
async function Hn(e, t, n) {
	let [r, i, , a] = t, [o, s, c, l, u, d, f, p, , m] = e, h = s, g = c;
	if (d && (i === "dir" || i === "ECDH-ES")) throw TypeError(`setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${i}`);
	let _ = dn(i), [v, y, b] = await Dn(i, a, await Xt(i === "dir" ? a : _, n, "encrypt"), d, p);
	b && (m ? g = g ? {
		...g,
		...b
	} : b : h = h ? {
		...h,
		...b
	} : b, Bn(h, g, l));
	let x, S;
	h ? (x = F(JSON.stringify(h)), S = M(x)) : (x = "", S = new Uint8Array());
	let C, w;
	u?.byteLength ? (w = F(u), C = j(S, M("."), M(w))) : C = S;
	let T = o;
	r.zip === "DEF" && (T = await Nn(T).catch((e) => {
		throw new P("Failed to compress plaintext", { cause: e });
	}));
	let { ciphertext: E, tag: ee, iv: te } = await bt(a, T, v, f, C), D = { ciphertext: F(E) };
	return te && (D.iv = F(te)), ee && (D.tag = F(ee)), y && (D.encrypted_key = F(y)), w && (D.aad = w), h && (D.protected = x), l && (D.unprotected = l), g && (D.header = g), D;
}
async function Un(e, t) {
	return Hn(e, Vn(e), t);
}
//#endregion
//#region node_modules/jose/dist/webapi/jwe/flattened/encrypt.js
var Wn = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	#s;
	constructor(e) {
		if (!(e instanceof Uint8Array)) throw TypeError("plaintext must be an instance of Uint8Array");
		this.#e = e;
	}
	setKeyManagementParameters(e) {
		return I(this.#s, "setKeyManagementParameters"), this.#s = e, this;
	}
	setProtectedHeader(e) {
		return I(this.#t, "setProtectedHeader"), this.#t = e, this;
	}
	setSharedUnprotectedHeader(e) {
		return I(this.#n, "setSharedUnprotectedHeader"), this.#n = e, this;
	}
	setUnprotectedHeader(e) {
		return I(this.#r, "setUnprotectedHeader"), this.#r = e, this;
	}
	setAdditionalAuthenticatedData(e) {
		return this.#i = e, this;
	}
	setContentEncryptionKey(e) {
		return I(this.#a, "setContentEncryptionKey"), this.#a = e, this;
	}
	setInitializationVector(e) {
		return I(this.#o, "setInitializationVector"), this.#o = e, this;
	}
	async encrypt(e, t) {
		if (!this.#t && !this.#r && !this.#n) throw new P("either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()");
		return An(P, this.#t), Un([
			this.#e,
			this.#t,
			this.#r,
			this.#n,
			this.#i,
			this.#a,
			this.#o,
			this.#s,
			t?.crit,
			t ? Mt in t : !1
		], e);
	}
}, Gn = (e) => Math.floor(e.getTime() / 1e3), Kn = {
	s: 1,
	m: 60,
	h: 3600,
	d: 86400,
	w: 604800,
	y: 31557600
}, qn = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i, Jn = "check_failed";
function Yn(e) {
	let t = qn.exec(e);
	if (!t || t[4] && t[1]) throw TypeError("Invalid time period format");
	let n = parseFloat(t[2]), r = Math.round(n * Kn[t[3][0].toLowerCase()]);
	return t[1] === "-" || t[4] === "ago" ? -r : r;
}
function Xn(e, t) {
	if (!Number.isFinite(t)) throw TypeError(`Invalid ${e} input`);
	return t;
}
function Zn(e, t) {
	return typeof e == "number" ? Xn(t, e) : e instanceof Date ? Xn(t, Gn(e)) : Gn(/* @__PURE__ */ new Date()) + Yn(e);
}
var Qn = (e) => e.includes("/") ? e.toLowerCase() : `application/${e.toLowerCase()}`, $n = (e, t) => typeof e == "string" ? t.includes(e) : Array.isArray(e) ? t.some((t) => e.includes(t)) : !1;
function er(e, t, n = !1) {
	let r = e[t];
	if (!(r === void 0 && !n)) {
		if (typeof r != "number") throw new $e(`"${t}" claim must be a number`, e, t, "invalid");
		return r;
	}
}
function tr(e, t) {
	throw new $e(`unexpected "${t}" claim value`, e, t, Jn);
}
function nr(e, t, n = {}) {
	let r;
	try {
		r = JSON.parse(Be.decode(t));
	} catch {}
	if (!Et(r)) throw new rt("JWT Claims Set must be a top-level JSON object");
	let { typ: i } = n;
	if (i && (typeof e.typ != "string" || Qn(e.typ) !== Qn(i))) throw new $e("unexpected \"typ\" JWT header value", r, "typ", Jn);
	let { requiredClaims: a = [], issuer: o, subject: s, audience: c, maxTokenAge: l } = n, u = [...a];
	l !== void 0 && u.push("iat"), c !== void 0 && u.push("aud"), s !== void 0 && u.push("sub"), o !== void 0 && u.push("iss");
	for (let e of new Set(u.reverse())) if (!Object.hasOwn(r, e)) throw new $e(`missing required "${e}" claim`, r, e, "missing");
	o !== void 0 && !(Array.isArray(o) ? o : [o]).includes(r.iss) && tr(r, "iss"), s !== void 0 && r.sub !== s && tr(r, "sub"), c !== void 0 && !$n(r.aud, typeof c == "string" ? [c] : c) && tr(r, "aud");
	let { clockTolerance: d } = n, f = 0;
	if (typeof d == "string") f = Yn(d);
	else if (d !== void 0) {
		if (typeof d != "number") throw TypeError("Invalid clockTolerance option type");
		f = d;
	}
	Xn("clockTolerance option", f);
	let { currentDate: p } = n, m = Xn("currentDate option", Gn(p || /* @__PURE__ */ new Date())), h = er(r, "iat", l !== void 0), g = er(r, "nbf");
	if (g !== void 0 && g > m + f) throw new $e("\"nbf\" claim timestamp check failed", r, "nbf", Jn);
	let _ = er(r, "exp");
	if (_ !== void 0 && _ <= m - f) throw new et("\"exp\" claim timestamp check failed", r, "exp", Jn);
	if (l !== void 0) {
		let e = m - h, t = typeof l == "number" ? l : Yn(l);
		if (e - f > t) throw new et("\"iat\" claim timestamp check failed (too far in the past)", r, "iat", Jn);
		if (e < 0 - f) throw new $e("\"iat\" claim timestamp check failed (it should be in the past)", r, "iat", Jn);
	}
	return r;
}
var rr = class {
	#e;
	constructor(e) {
		if (!Et(e)) throw TypeError("JWT Claims Set MUST be an object");
		this.#e = structuredClone(e);
	}
	data() {
		return Re.encode(JSON.stringify(this.#e));
	}
	get iss() {
		return this.#e.iss;
	}
	set iss(e) {
		this.#e.iss = e;
	}
	get sub() {
		return this.#e.sub;
	}
	set sub(e) {
		this.#e.sub = e;
	}
	get aud() {
		return this.#e.aud;
	}
	set aud(e) {
		this.#e.aud = e;
	}
	set jti(e) {
		this.#e.jti = e;
	}
	set nbf(e) {
		this.#e.nbf = Zn(e, "setNotBefore");
	}
	set exp(e) {
		this.#e.exp = Zn(e, "setExpirationTime");
	}
	set iat(e) {
		e === void 0 ? this.#e.iat = Gn(/* @__PURE__ */ new Date()) : typeof e == "string" ? this.#e.iat = Xn("setIssuedAt", Gn(/* @__PURE__ */ new Date()) + Yn(e)) : this.#e.iat = Zn(e, "setIssuedAt");
	}
};
//#endregion
//#region node_modules/jose/dist/webapi/jwt/decrypt.js
async function ir(e, t, n) {
	let r = await zn(e, In(n), t), i = r[1], a = nr(i, r[0], n);
	if (i.iss !== void 0 && i.iss !== a.iss) throw new $e("replicated \"iss\" claim header parameter mismatch", a, "iss", "mismatch");
	if (i.sub !== void 0 && i.sub !== a.sub) throw new $e("replicated \"sub\" claim header parameter mismatch", a, "sub", "mismatch");
	if (i.aud !== void 0 && JSON.stringify(i.aud) !== JSON.stringify(a.aud)) throw new $e("replicated \"aud\" claim header parameter mismatch", a, "aud", "mismatch");
	let o = {
		payload: a,
		protectedHeader: i
	};
	return typeof t == "function" ? {
		...o,
		key: r[2]
	} : o;
}
//#endregion
//#region node_modules/jose/dist/webapi/jwe/compact/encrypt.js
var ar = class {
	#e;
	constructor(e) {
		this.#e = new Wn(e);
	}
	setContentEncryptionKey(e) {
		return this.#e.setContentEncryptionKey(e), this;
	}
	setInitializationVector(e) {
		return this.#e.setInitializationVector(e), this;
	}
	setProtectedHeader(e) {
		return this.#e.setProtectedHeader(e), this;
	}
	setKeyManagementParameters(e) {
		return this.#e.setKeyManagementParameters(e), this;
	}
	async encrypt(e, t) {
		let n = await this.#e.encrypt(e, t);
		return [
			n.protected,
			n.encrypted_key,
			n.iv,
			n.ciphertext,
			n.tag
		].join(".");
	}
}, or = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	#s;
	constructor(e = {}) {
		this.#s = new rr(e);
	}
	setIssuer(e) {
		return this.#s.iss = e, this;
	}
	setSubject(e) {
		return this.#s.sub = e, this;
	}
	setAudience(e) {
		return this.#s.aud = e, this;
	}
	setJti(e) {
		return this.#s.jti = e, this;
	}
	setNotBefore(e) {
		return this.#s.nbf = e, this;
	}
	setExpirationTime(e) {
		return this.#s.exp = e, this;
	}
	setIssuedAt(e) {
		return this.#s.iat = e, this;
	}
	setProtectedHeader(e) {
		return I(this.#r, "setProtectedHeader"), this.#r = e, this;
	}
	setKeyManagementParameters(e) {
		return I(this.#n, "setKeyManagementParameters"), this.#n = e, this;
	}
	setContentEncryptionKey(e) {
		return I(this.#e, "setContentEncryptionKey"), this.#e = e, this;
	}
	setInitializationVector(e) {
		return I(this.#t, "setInitializationVector"), this.#t = e, this;
	}
	replicateIssuerAsHeader() {
		return this.#i = !0, this;
	}
	replicateSubjectAsHeader() {
		return this.#a = !0, this;
	}
	replicateAudienceAsHeader() {
		return this.#o = !0, this;
	}
	async encrypt(e, t) {
		let n = new ar(this.#s.data());
		return this.#r && (this.#i || this.#a || this.#o) && (this.#r = {
			...this.#r,
			iss: this.#i ? this.#s.iss : void 0,
			sub: this.#a ? this.#s.sub : void 0,
			aud: this.#o ? this.#s.aud : void 0
		}), n.setProtectedHeader(this.#r), this.#t && n.setInitializationVector(this.#t), this.#e && n.setContentEncryptionKey(this.#e), this.#n && n.setKeyManagementParameters(this.#n), n.encrypt(e, t);
	}
};
//#endregion
//#region node_modules/jose/dist/webapi/key/export.js
function sr(e) {
	return Object.fromEntries(Object.entries(e).filter(([, e]) => e !== void 0));
}
async function cr(e) {
	if (st(e)) if (e.type === "secret") e = e.export();
	else return e.export({ format: "jwk" });
	if (e instanceof Uint8Array) return {
		kty: "oct",
		k: F(e)
	};
	if (!ot(e)) throw TypeError(Xe(e, "CryptoKey", "KeyObject", "Uint8Array"));
	if (!e.extractable) throw TypeError("non-extractable CryptoKey cannot be exported as a JWK");
	let { ext: t, key_ops: n, alg: r, use: i, ...a } = sr(await crypto.subtle.exportKey("jwk", e));
	return a.kty === "AKP" && (a.alg = r), a;
}
function lr(e) {
	return cr(e);
}
//#endregion
//#region node_modules/jose/dist/webapi/jwk/thumbprint.js
var L = (e, t) => {
	if (typeof e != "string" || !e) throw new it(`${t} missing or invalid`);
};
async function ur(e, t) {
	let n;
	if (Ot(e)) n = e;
	else if (ct(e)) n = await lr(e);
	else throw TypeError(Xe(e, "CryptoKey", "KeyObject", "JSON Web Key"));
	if (t ??= "sha256", t !== "sha256" && t !== "sha384" && t !== "sha512") throw TypeError("digestAlgorithm must one of \"sha256\", \"sha384\", or \"sha512\"");
	let r;
	switch (n.kty) {
		case "AKP":
			L(n.alg, "\"alg\" (Algorithm) Parameter"), L(n.pub, "\"pub\" (Public key) Parameter"), r = {
				alg: n.alg,
				kty: n.kty,
				pub: n.pub
			};
			break;
		case "EC":
			L(n.crv, "\"crv\" (Curve) Parameter"), L(n.x, "\"x\" (X Coordinate) Parameter"), L(n.y, "\"y\" (Y Coordinate) Parameter"), r = {
				crv: n.crv,
				kty: n.kty,
				x: n.x,
				y: n.y
			};
			break;
		case "OKP":
			L(n.crv, "\"crv\" (Subtype of Key Pair) Parameter"), L(n.x, "\"x\" (Public Key) Parameter"), r = {
				crv: n.crv,
				kty: n.kty,
				x: n.x
			};
			break;
		case "RSA":
			L(n.e, "\"e\" (Exponent) Parameter"), L(n.n, "\"n\" (Modulus) Parameter"), r = {
				e: n.e,
				kty: n.kty,
				n: n.n
			};
			break;
		case "oct":
			L(n.k, "\"k\" (Key Value) Parameter"), r = {
				k: n.k,
				kty: n.kty
			};
			break;
		default: throw new N("\"kty\" (Key Type) Parameter missing or unsupported");
	}
	let i = M(JSON.stringify(r));
	return F(await Ft(t, i));
}
//#endregion
//#region node_modules/jose/dist/webapi/util/decode_jwt.js
function dr(e) {
	if (typeof e != "string") throw new rt("JWTs must use Compact JWS serialization, JWT must be a string");
	let { 1: t, length: n } = e.split(".");
	if (n === 5) throw new rt("Only JWTs using Compact JWS serialization can be decoded");
	if (n !== 3) throw new rt("Invalid JWT");
	if (!t) throw new rt("JWTs must contain a payload");
	let r;
	try {
		r = Tt(t);
	} catch {
		throw new rt("Failed to base64url decode the payload");
	}
	let i;
	try {
		i = JSON.parse(Be.decode(r));
	} catch {
		throw new rt("Failed to parse the decoded payload as JSON");
	}
	if (!Et(i)) throw new rt("Invalid JWT Claims Set");
	return i;
}
//#endregion
//#region node_modules/@auth/core/lib/vendored/cookie.js
var fr = /* @__PURE__ */ t({
	parse: () => yr,
	serialize: () => Sr
}), pr = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/, mr = /^("?)[\u0021\u0023-\u002B\u002D-\u003A\u003C-\u005B\u005D-\u007E]*\1$/, hr = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i, gr = /^[\u0020-\u003A\u003D-\u007E]*$/, _r = Object.prototype.toString, vr = /* @__PURE__ */ (() => {
	let e = function() {};
	return e.prototype = Object.create(null), e;
})();
function yr(e, t) {
	let n = new vr(), r = e.length;
	if (r < 2) return n;
	let i = t?.decode || Cr, a = 0;
	do {
		let t = e.indexOf("=", a);
		if (t === -1) break;
		let o = e.indexOf(";", a), s = o === -1 ? r : o;
		if (t > s) {
			a = e.lastIndexOf(";", t - 1) + 1;
			continue;
		}
		let c = br(e, a, t), l = xr(e, t, c), u = e.slice(c, l);
		if (n[u] === void 0) {
			let r = br(e, t + 1, s), a = xr(e, s, r);
			n[u] = i(e.slice(r, a));
		}
		a = s + 1;
	} while (a < r);
	return n;
}
function br(e, t, n) {
	do {
		let n = e.charCodeAt(t);
		if (n !== 32 && n !== 9) return t;
	} while (++t < n);
	return n;
}
function xr(e, t, n) {
	for (; t > n;) {
		let n = e.charCodeAt(--t);
		if (n !== 32 && n !== 9) return t + 1;
	}
	return n;
}
function Sr(e, t, n) {
	let r = n?.encode || encodeURIComponent;
	if (!pr.test(e)) throw TypeError(`argument name is invalid: ${e}`);
	let i = r(t);
	if (!mr.test(i)) throw TypeError(`argument val is invalid: ${t}`);
	let a = e + "=" + i;
	if (!n) return a;
	if (n.maxAge !== void 0) {
		if (!Number.isInteger(n.maxAge)) throw TypeError(`option maxAge is invalid: ${n.maxAge}`);
		a += "; Max-Age=" + n.maxAge;
	}
	if (n.domain) {
		if (!hr.test(n.domain)) throw TypeError(`option domain is invalid: ${n.domain}`);
		a += "; Domain=" + n.domain;
	}
	if (n.path) {
		if (!gr.test(n.path)) throw TypeError(`option path is invalid: ${n.path}`);
		a += "; Path=" + n.path;
	}
	if (n.expires) {
		if (!wr(n.expires) || !Number.isFinite(n.expires.valueOf())) throw TypeError(`option expires is invalid: ${n.expires}`);
		a += "; Expires=" + n.expires.toUTCString();
	}
	if (n.httpOnly && (a += "; HttpOnly"), n.secure && (a += "; Secure"), n.partitioned && (a += "; Partitioned"), n.priority) switch (typeof n.priority == "string" ? n.priority.toLowerCase() : void 0) {
		case "low":
			a += "; Priority=Low";
			break;
		case "medium":
			a += "; Priority=Medium";
			break;
		case "high":
			a += "; Priority=High";
			break;
		default: throw TypeError(`option priority is invalid: ${n.priority}`);
	}
	if (n.sameSite) switch (typeof n.sameSite == "string" ? n.sameSite.toLowerCase() : n.sameSite) {
		case !0:
		case "strict":
			a += "; SameSite=Strict";
			break;
		case "lax":
			a += "; SameSite=Lax";
			break;
		case "none":
			a += "; SameSite=None";
			break;
		default: throw TypeError(`option sameSite is invalid: ${n.sameSite}`);
	}
	return a;
}
function Cr(e) {
	if (e.indexOf("%") === -1) return e;
	try {
		return decodeURIComponent(e);
	} catch {
		return e;
	}
}
function wr(e) {
	return _r.call(e) === "[object Date]";
}
//#endregion
//#region node_modules/@auth/core/jwt.js
var { parse: Tr } = fr, Er = 720 * 60 * 60, Dr = () => Date.now() / 1e3 | 0, Or = "dir", kr = "A256CBC-HS512";
async function Ar(e) {
	let { token: t = {}, secret: n, maxAge: r = Er, salt: i } = e, a = await Mr(kr, (Array.isArray(n) ? n : [n])[0], i), o = await ur({
		kty: "oct",
		k: F(a)
	}, `sha${a.byteLength << 3}`);
	return await new or(t).setProtectedHeader({
		alg: Or,
		enc: kr,
		kid: o
	}).setIssuedAt().setExpirationTime(Dr() + r).setJti(crypto.randomUUID()).encrypt(a);
}
async function jr(e) {
	let { token: t, secret: n, salt: r } = e, i = Array.isArray(n) ? n : [n];
	if (!t) return null;
	let { payload: a } = await ir(t, async ({ kid: e, enc: t }) => {
		for (let n of i) {
			let i = await Mr(t, n, r);
			if (e === void 0 || e === await ur({
				kty: "oct",
				k: F(i)
			}, `sha${i.byteLength << 3}`)) return i;
		}
		throw Error("no matching decryption secret");
	}, {
		clockTolerance: 15,
		keyManagementAlgorithms: [Or],
		contentEncryptionAlgorithms: [kr, "A256GCM"]
	});
	return a;
}
async function Mr(e, t, n) {
	let r;
	switch (e) {
		case "A256CBC-HS512":
			r = 64;
			break;
		case "A256GCM":
			r = 32;
			break;
		default: throw Error("Unsupported JWT Content Encryption Algorithm");
	}
	return await Le("sha256", t, n, `Auth.js Generated Encryption Key (${n})`, r);
}
//#endregion
//#region node_modules/@auth/core/lib/utils/callback-url.js
async function Nr({ options: e, paramValue: t, cookieValue: n }) {
	let { url: r, callbacks: i } = e, a = r.origin;
	return t ? a = await i.redirect({
		url: t,
		baseUrl: r.origin
	}) : n && (a = await i.redirect({
		url: n,
		baseUrl: r.origin
	})), {
		callbackUrl: a,
		callbackUrlCookie: a === n ? void 0 : a
	};
}
//#endregion
//#region node_modules/@auth/core/lib/utils/logger.js
var Pr = "\x1B[31m", Fr = "\x1B[33m", Ir = "\x1B[90m", Lr = "\x1B[0m", Rr = {
	error(e) {
		let t = e instanceof h ? e.type : e.name;
		if (console.error(`${Pr}[auth][error]${Lr} ${t}: ${e.message}`), e.cause && typeof e.cause == "object" && "err" in e.cause && e.cause.err instanceof Error) {
			let { err: t, ...n } = e.cause;
			console.error(`${Pr}[auth][cause]${Lr}:`, t.stack), n && console.error(`${Pr}[auth][details]${Lr}:`, JSON.stringify(n, null, 2));
		} else e.stack && console.error(e.stack.replace(/.*/, "").substring(1));
	},
	warn(e) {
		console.warn(`${Fr}[auth][warn][${e}]${Lr}`, "Read more: https://warnings.authjs.dev");
	},
	debug(e, t) {
		console.log(`${Ir}[auth][debug]:${Lr} ${e}`, JSON.stringify(t, null, 2));
	}
};
function zr(e) {
	let t = { ...Rr };
	return e.debug || (t.debug = () => {}), e.logger?.error && (t.error = e.logger.error), e.logger?.warn && (t.warn = e.logger.warn), e.logger?.debug && (t.debug = e.logger.debug), e.logger ??= t, t;
}
//#endregion
//#region node_modules/@auth/core/lib/utils/actions.js
var Br = [
	"providers",
	"session",
	"csrf",
	"signin",
	"signout",
	"callback",
	"verify-request",
	"error",
	"webauthn-options"
];
function Vr(e) {
	return Br.includes(e);
}
//#endregion
//#region node_modules/@auth/core/lib/utils/web.js
var { parse: Hr, serialize: Ur } = fr;
async function Wr(e) {
	if (!("body" in e) || !e.body || e.method !== "POST") return;
	let t = e.headers.get("content-type");
	if (t?.includes("application/json")) return await e.json();
	if (t?.includes("application/x-www-form-urlencoded")) {
		let t = new URLSearchParams(await e.text());
		return Object.fromEntries(t);
	}
}
async function Gr(e, t) {
	try {
		if (e.method !== "GET" && e.method !== "POST") throw new se("Only GET and POST requests are supported");
		t.basePath ??= "/auth";
		let n = new URL(e.url), { action: r, providerId: i } = Xr(n.pathname, t.basePath);
		return {
			url: n,
			action: r,
			providerId: i,
			method: e.method,
			headers: Object.fromEntries(e.headers),
			body: e.body ? await Wr(e) : void 0,
			cookies: Hr(e.headers.get("cookie") ?? "") ?? {},
			error: n.searchParams.get("error") ?? void 0,
			query: Object.fromEntries(n.searchParams)
		};
	} catch (n) {
		let r = zr(t);
		r.error(n), r.debug("request", e);
	}
}
function Kr(e) {
	return new Request(e.url, {
		headers: e.headers,
		method: e.method,
		body: e.method === "POST" ? JSON.stringify(e.body ?? {}) : void 0
	});
}
function qr(e) {
	let t = new Headers(e.headers);
	e.cookies?.forEach((e) => {
		let { name: n, value: r, options: i } = e, a = Ur(n, r, i);
		t.has("Set-Cookie") ? t.append("Set-Cookie", a) : t.set("Set-Cookie", a);
	});
	let n = e.body;
	t.get("content-type") === "application/json" ? n = JSON.stringify(e.body) : t.get("content-type") === "application/x-www-form-urlencoded" && (n = new URLSearchParams(e.body).toString());
	let r = e.redirect ? 302 : e.status ?? 200, i = new Response(n, {
		headers: t,
		status: r
	});
	return e.redirect && i.headers.set("Location", e.redirect), i;
}
async function Jr(e) {
	let t = new TextEncoder().encode(e), n = await crypto.subtle.digest("SHA-256", t);
	return Array.from(new Uint8Array(n)).map((e) => e.toString(16).padStart(2, "0")).join("").toString();
}
function Yr(e) {
	let t = (e) => ("0" + e.toString(16)).slice(-2), n = (e, n) => e + t(n), r = crypto.getRandomValues(new Uint8Array(e));
	return Array.from(r).reduce(n, "");
}
function Xr(e, t) {
	let n = e.match(RegExp(`^${t}(.+)`));
	if (n === null) throw new se(`Cannot parse action at ${e}`);
	let r = n.at(-1).replace(/^\//, "").split("/").filter(Boolean);
	if (r.length !== 1 && r.length !== 2) throw new se(`Cannot parse action at ${e}`);
	let [i, a] = r;
	if (!Vr(i) || a && ![
		"signin",
		"callback",
		"webauthn-options"
	].includes(i)) throw new se(`Cannot parse action at ${e}`);
	return {
		action: i,
		providerId: a == "undefined" ? void 0 : a
	};
}
//#endregion
//#region node_modules/@auth/core/lib/actions/callback/oauth/csrf-token.js
async function Zr({ options: e, cookieValue: t, isPost: n, bodyValue: r }) {
	if (t) {
		let [i, a] = t.split("|");
		if (a === await Jr(`${i}${e.secret}`)) return {
			csrfTokenVerified: n && i === r,
			csrfToken: i
		};
	}
	let i = Yr(32);
	return {
		cookie: `${i}|${await Jr(`${i}${e.secret}`)}`,
		csrfToken: i
	};
}
function Qr(e, t) {
	if (!t) throw new fe(`CSRF token was missing during an action ${e}`);
}
//#endregion
//#region node_modules/@auth/core/lib/utils/merge.js
function $r(e) {
	return typeof e == "object" && !!e;
}
function ei(e, ...t) {
	if (!t.length) return e;
	let n = t.shift();
	if ($r(e) && $r(n)) for (let t in n) $r(n[t]) ? ($r(e[t]) || (e[t] = Array.isArray(n[t]) ? [] : {}), ei(e[t], n[t])) : n[t] !== void 0 && (e[t] = n[t]);
	return ei(e, ...t);
}
//#endregion
//#region node_modules/@auth/core/lib/symbols.js
var ti = Symbol("skip-csrf-check"), ni = Symbol("return-type-raw"), ri = Symbol("custom-fetch"), ii = Symbol("conform-internal");
//#endregion
//#region node_modules/@auth/core/lib/utils/providers.js
function ai(e) {
	let { providerId: t, config: n } = e, r = new URL(n.basePath ?? "/auth", e.url.origin), i = n.providers.map((e) => {
		let t = typeof e == "function" ? e() : e, { options: i, ...a } = t, o = i?.id ?? a.id, s = ei(a, i, {
			signinUrl: `${r}/signin/${o}`,
			callbackUrl: `${r}/callback/${o}`
		});
		if (t.type === "oauth" || t.type === "oidc") {
			s.redirectProxyUrl ??= i?.redirectProxyUrl ?? n.redirectProxyUrl;
			let e = oi(s);
			return e.authorization?.url.searchParams.get("response_mode") === "form_post" && delete e.redirectProxyUrl, e[ri] ?? (e[ri] = i?.[ri]), e;
		}
		return s;
	}), a = i.find(({ id: e }) => e === t);
	if (t && !a) {
		let e = i.map((e) => e.id).join(", ");
		throw Error(`Provider with id "${t}" not found. Available providers: [${e}].`);
	}
	return {
		providers: i,
		provider: a
	};
}
function oi(e) {
	e.issuer && (e.wellKnown ??= `${e.issuer}/.well-known/openid-configuration`);
	let t = ui(e.authorization, e.issuer);
	t && !t.url?.searchParams.has("scope") && t.url.searchParams.set("scope", "openid profile email");
	let n = ui(e.token, e.issuer), r = ui(e.userinfo, e.issuer), i = e.checks ?? ["pkce"];
	return e.redirectProxyUrl &&= (i.includes("state") || i.push("state"), `${e.redirectProxyUrl}/callback/${e.id}`), {
		...e,
		authorization: t,
		token: n,
		checks: i,
		userinfo: r,
		profile: e.profile ?? si,
		account: e.account ?? ci
	};
}
var si = (e) => li({
	id: e.sub ?? e.id ?? crypto.randomUUID(),
	name: e.name ?? e.nickname ?? e.preferred_username,
	email: e.email,
	image: e.picture
}), ci = (e) => li({
	access_token: e.access_token,
	id_token: e.id_token,
	refresh_token: e.refresh_token,
	expires_at: e.expires_at,
	scope: e.scope,
	token_type: e.token_type,
	session_state: e.session_state
});
function li(e) {
	let t = {};
	for (let [n, r] of Object.entries(e)) r !== void 0 && (t[n] = r);
	return t;
}
function ui(e, t) {
	if (!e && t) return;
	if (typeof e == "string") return { url: new URL(e) };
	let n = new URL(e?.url ?? "https://authjs.dev");
	if (e?.params != null) for (let [t, r] of Object.entries(e.params)) t === "claims" && (r = JSON.stringify(r)), n.searchParams.set(t, String(r));
	return {
		url: n,
		request: e?.request,
		conform: e?.conform,
		...e?.clientPrivateKey ? { clientPrivateKey: e?.clientPrivateKey } : null
	};
}
function di(e) {
	return e.type === "oidc";
}
//#endregion
//#region node_modules/@auth/core/lib/init.js
var fi = {
	signIn() {
		return !0;
	},
	redirect({ url: e, baseUrl: t }) {
		return e.startsWith("/") ? `${t}${e}` : new URL(e).origin === t ? e : t;
	},
	session({ session: e }) {
		return {
			user: {
				name: e.user?.name,
				email: e.user?.email,
				image: e.user?.image
			},
			expires: e.expires?.toISOString?.() ?? e.expires
		};
	},
	jwt({ token: e }) {
		return e;
	}
};
async function pi({ authOptions: e, providerId: t, action: n, url: r, cookies: i, callbackUrl: a, csrfToken: o, csrfDisabled: s, isPost: c }) {
	let l = zr(e), { providers: u, provider: d } = ai({
		url: r,
		providerId: t,
		config: e
	}), f = 720 * 60 * 60, m = !1;
	if ((d?.type === "oauth" || d?.type === "oidc") && d.redirectProxyUrl) try {
		m = new URL(d.redirectProxyUrl).origin === r.origin;
	} catch {
		throw TypeError(`redirectProxyUrl must be a valid URL. Received: ${d.redirectProxyUrl}`);
	}
	let h = {
		debug: !1,
		pages: {},
		theme: {
			colorScheme: "auto",
			logo: "",
			brandColor: "",
			buttonText: ""
		},
		...e,
		url: r,
		action: n,
		provider: d,
		cookies: ei(p(e.useSecureCookies ?? r.protocol === "https:"), e.cookies),
		providers: u,
		session: {
			strategy: e.adapter ? "database" : "jwt",
			maxAge: f,
			updateAge: 1440 * 60,
			generateSessionToken: () => crypto.randomUUID(),
			...e.session
		},
		jwt: {
			secret: e.secret,
			maxAge: e.session?.maxAge ?? f,
			encode: Ar,
			decode: jr,
			...e.jwt
		},
		events: mi(e.events ?? {}, l),
		adapter: hi(e.adapter, l),
		callbacks: {
			...fi,
			...e.callbacks
		},
		logger: l,
		callbackUrl: r.origin,
		isOnRedirectProxy: m,
		experimental: { ...e.experimental }
	}, g = [];
	if (s) h.csrfTokenVerified = !0;
	else {
		let { csrfToken: e, cookie: t, csrfTokenVerified: n } = await Zr({
			options: h,
			cookieValue: i?.[h.cookies.csrfToken.name],
			isPost: c,
			bodyValue: o
		});
		h.csrfToken = e, h.csrfTokenVerified = n, t && g.push({
			name: h.cookies.csrfToken.name,
			value: t,
			options: h.cookies.csrfToken.options
		});
	}
	let { callbackUrl: _, callbackUrlCookie: v } = await Nr({
		options: h,
		cookieValue: i?.[h.cookies.callbackUrl.name],
		paramValue: a
	});
	return h.callbackUrl = _, v && g.push({
		name: h.cookies.callbackUrl.name,
		value: v,
		options: h.cookies.callbackUrl.options
	}), {
		options: h,
		cookies: g
	};
}
function mi(e, t) {
	return Object.keys(e).reduce((n, r) => (n[r] = async (...n) => {
		try {
			let t = e[r];
			return await t(...n);
		} catch (e) {
			t.error(new x(e));
		}
	}, n), {});
}
function hi(e, t) {
	if (e) return Object.keys(e).reduce((n, r) => (n[r] = async (...n) => {
		try {
			t.debug(`adapter_${r}`, { args: n });
			let i = e[r];
			return await i(...n);
		} catch (e) {
			let n = new _(e);
			throw t.error(n), n;
		}
	}, n), {});
}
//#endregion
//#region node_modules/preact/dist/preact.module.js
var gi, R, _i, vi, yi, bi, xi, Si, Ci, wi, Ti = {}, Ei = [], Di = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, Oi = Array.isArray;
function ki(e, t) {
	for (var n in t) e[n] = t[n];
	return e;
}
function Ai(e) {
	e && e.parentNode && e.parentNode.removeChild(e);
}
function ji(e, t, n) {
	var r, i, a, o = {};
	for (a in t) a == "key" ? r = t[a] : a == "ref" ? i = t[a] : o[a] = t[a];
	if (arguments.length > 2 && (o.children = arguments.length > 3 ? gi.call(arguments, 2) : n), typeof e == "function" && e.defaultProps != null) for (a in e.defaultProps) o[a] === void 0 && (o[a] = e.defaultProps[a]);
	return Mi(e, o, r, i, null);
}
function Mi(e, t, n, r, i) {
	var a = {
		type: e,
		props: t,
		key: n,
		ref: r,
		__k: null,
		__: null,
		__b: 0,
		__e: null,
		__d: void 0,
		__c: null,
		constructor: void 0,
		__v: i ?? ++_i,
		__i: -1,
		__u: 0
	};
	return i == null && R.vnode != null && R.vnode(a), a;
}
function z(e) {
	return e.children;
}
function Ni(e, t) {
	this.props = e, this.context = t;
}
function Pi(e, t) {
	if (t == null) return e.__ ? Pi(e.__, e.__i + 1) : null;
	for (var n; t < e.__k.length; t++) if ((n = e.__k[t]) != null && n.__e != null) return n.__e;
	return typeof e.type == "function" ? Pi(e) : null;
}
function Fi(e) {
	var t, n;
	if ((e = e.__) != null && e.__c != null) {
		for (e.__e = e.__c.base = null, t = 0; t < e.__k.length; t++) if ((n = e.__k[t]) != null && n.__e != null) {
			e.__e = e.__c.base = n.__e;
			break;
		}
		return Fi(e);
	}
}
function Ii(e) {
	(!e.__d && (e.__d = !0) && vi.push(e) && !Li.__r++ || yi !== R.debounceRendering) && ((yi = R.debounceRendering) || bi)(Li);
}
function Li() {
	var e, t, n, r, i, a, o, s;
	for (vi.sort(xi); e = vi.shift();) e.__d && (t = vi.length, r = void 0, a = (i = (n = e).__v).__e, o = [], s = [], n.__P && ((r = ki({}, i)).__v = i.__v + 1, R.vnode && R.vnode(r), Gi(n.__P, r, i, n.__n, n.__P.namespaceURI, 32 & i.__u ? [a] : null, o, a ?? Pi(i), !!(32 & i.__u), s), r.__v = i.__v, r.__.__k[r.__i] = r, Ki(o, r, s), r.__e != a && Fi(r)), vi.length > t && vi.sort(xi));
	Li.__r = 0;
}
function Ri(e, t, n, r, i, a, o, s, c, l, u) {
	var d, f, p, m, h, g = r && r.__k || Ei, _ = t.length;
	for (n.__d = c, zi(n, t, g), c = n.__d, d = 0; d < _; d++) (p = n.__k[d]) != null && (f = p.__i === -1 ? Ti : g[p.__i] || Ti, p.__i = d, Gi(e, p, f, i, a, o, s, c, l, u), m = p.__e, p.ref && f.ref != p.ref && (f.ref && Ji(f.ref, null, p), u.push(p.ref, p.__c || m, p)), h == null && m != null && (h = m), 65536 & p.__u || f.__k === p.__k ? c = Bi(p, c, e) : typeof p.type == "function" && p.__d !== void 0 ? c = p.__d : m && (c = m.nextSibling), p.__d = void 0, p.__u &= -196609);
	n.__d = c, n.__e = h;
}
function zi(e, t, n) {
	var r, i, a, o, s, c = t.length, l = n.length, u = l, d = 0;
	for (e.__k = [], r = 0; r < c; r++) (i = t[r]) != null && typeof i != "boolean" && typeof i != "function" ? (o = r + d, (i = e.__k[r] = typeof i == "string" || typeof i == "number" || typeof i == "bigint" || i.constructor == String ? Mi(null, i, null, null, null) : Oi(i) ? Mi(z, { children: i }, null, null, null) : i.constructor === void 0 && i.__b > 0 ? Mi(i.type, i.props, i.key, i.ref ? i.ref : null, i.__v) : i).__ = e, i.__b = e.__b + 1, a = null, (s = i.__i = Vi(i, n, o, u)) !== -1 && (u--, (a = n[s]) && (a.__u |= 131072)), a == null || a.__v === null ? (s == -1 && d--, typeof i.type != "function" && (i.__u |= 65536)) : s !== o && (s == o - 1 ? d-- : s == o + 1 ? d++ : (s > o ? d-- : d++, i.__u |= 65536))) : i = e.__k[r] = null;
	if (u) for (r = 0; r < l; r++) (a = n[r]) != null && !(131072 & a.__u) && (a.__e == e.__d && (e.__d = Pi(a)), Yi(a, a));
}
function Bi(e, t, n) {
	var r, i;
	if (typeof e.type == "function") {
		for (r = e.__k, i = 0; r && i < r.length; i++) r[i] && (r[i].__ = e, t = Bi(r[i], t, n));
		return t;
	}
	e.__e != t && (t && e.type && !n.contains(t) && (t = Pi(e)), n.insertBefore(e.__e, t || null), t = e.__e);
	do
		t &&= t.nextSibling;
	while (t != null && t.nodeType === 8);
	return t;
}
function Vi(e, t, n, r) {
	var i = e.key, a = e.type, o = n - 1, s = n + 1, c = t[n];
	if (c === null || c && i == c.key && a === c.type && !(131072 & c.__u)) return n;
	if (r > +(c != null && !(131072 & c.__u))) for (; o >= 0 || s < t.length;) {
		if (o >= 0) {
			if ((c = t[o]) && !(131072 & c.__u) && i == c.key && a === c.type) return o;
			o--;
		}
		if (s < t.length) {
			if ((c = t[s]) && !(131072 & c.__u) && i == c.key && a === c.type) return s;
			s++;
		}
	}
	return -1;
}
function Hi(e, t, n) {
	t[0] === "-" ? e.setProperty(t, n ?? "") : e[t] = n == null ? "" : typeof n != "number" || Di.test(t) ? n : n + "px";
}
function Ui(e, t, n, r, i) {
	var a;
	n: if (t === "style") if (typeof n == "string") e.style.cssText = n;
	else {
		if (typeof r == "string" && (e.style.cssText = r = ""), r) for (t in r) n && t in n || Hi(e.style, t, "");
		if (n) for (t in n) r && n[t] === r[t] || Hi(e.style, t, n[t]);
	}
	else if (t[0] === "o" && t[1] === "n") a = t !== (t = t.replace(/(PointerCapture)$|Capture$/i, "$1")), t = t.toLowerCase() in e || t === "onFocusOut" || t === "onFocusIn" ? t.toLowerCase().slice(2) : t.slice(2), e.l ||= {}, e.l[t + a] = n, n ? r ? n.u = r.u : (n.u = Si, e.addEventListener(t, a ? wi : Ci, a)) : e.removeEventListener(t, a ? wi : Ci, a);
	else {
		if (i == "http://www.w3.org/2000/svg") t = t.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
		else if (t != "width" && t != "height" && t != "href" && t != "list" && t != "form" && t != "tabIndex" && t != "download" && t != "rowSpan" && t != "colSpan" && t != "role" && t != "popover" && t in e) try {
			e[t] = n ?? "";
			break n;
		} catch {}
		typeof n == "function" || (n == null || !1 === n && t[4] !== "-" ? e.removeAttribute(t) : e.setAttribute(t, t == "popover" && n == 1 ? "" : n));
	}
}
function Wi(e) {
	return function(t) {
		if (this.l) {
			var n = this.l[t.type + e];
			if (t.t == null) t.t = Si++;
			else if (t.t < n.u) return;
			return n(R.event ? R.event(t) : t);
		}
	};
}
function Gi(e, t, n, r, i, a, o, s, c, l) {
	var u, d, f, p, m, h, g, _, v, y, b, x, S, C, w, T, E = t.type;
	if (t.constructor !== void 0) return null;
	128 & n.__u && (c = !!(32 & n.__u), a = [s = t.__e = n.__e]), (u = R.__b) && u(t);
	n: if (typeof E == "function") try {
		if (_ = t.props, v = "prototype" in E && E.prototype.render, y = (u = E.contextType) && r[u.__c], b = u ? y ? y.props.value : u.__ : r, n.__c ? g = (d = t.__c = n.__c).__ = d.__E : (v ? t.__c = d = new E(_, b) : (t.__c = d = new Ni(_, b), d.constructor = E, d.render = Xi), y && y.sub(d), d.props = _, d.state ||= {}, d.context = b, d.__n = r, f = d.__d = !0, d.__h = [], d._sb = []), v && d.__s == null && (d.__s = d.state), v && E.getDerivedStateFromProps != null && (d.__s == d.state && (d.__s = ki({}, d.__s)), ki(d.__s, E.getDerivedStateFromProps(_, d.__s))), p = d.props, m = d.state, d.__v = t, f) v && E.getDerivedStateFromProps == null && d.componentWillMount != null && d.componentWillMount(), v && d.componentDidMount != null && d.__h.push(d.componentDidMount);
		else {
			if (v && E.getDerivedStateFromProps == null && _ !== p && d.componentWillReceiveProps != null && d.componentWillReceiveProps(_, b), !d.__e && (d.shouldComponentUpdate != null && !1 === d.shouldComponentUpdate(_, d.__s, b) || t.__v === n.__v)) {
				for (t.__v !== n.__v && (d.props = _, d.state = d.__s, d.__d = !1), t.__e = n.__e, t.__k = n.__k, t.__k.some(function(e) {
					e && (e.__ = t);
				}), x = 0; x < d._sb.length; x++) d.__h.push(d._sb[x]);
				d._sb = [], d.__h.length && o.push(d);
				break n;
			}
			d.componentWillUpdate != null && d.componentWillUpdate(_, d.__s, b), v && d.componentDidUpdate != null && d.__h.push(function() {
				d.componentDidUpdate(p, m, h);
			});
		}
		if (d.context = b, d.props = _, d.__P = e, d.__e = !1, S = R.__r, C = 0, v) {
			for (d.state = d.__s, d.__d = !1, S && S(t), u = d.render(d.props, d.state, d.context), w = 0; w < d._sb.length; w++) d.__h.push(d._sb[w]);
			d._sb = [];
		} else do
			d.__d = !1, S && S(t), u = d.render(d.props, d.state, d.context), d.state = d.__s;
		while (d.__d && ++C < 25);
		d.state = d.__s, d.getChildContext != null && (r = ki(ki({}, r), d.getChildContext())), v && !f && d.getSnapshotBeforeUpdate != null && (h = d.getSnapshotBeforeUpdate(p, m)), Ri(e, Oi(T = u != null && u.type === z && u.key == null ? u.props.children : u) ? T : [T], t, n, r, i, a, o, s, c, l), d.base = t.__e, t.__u &= -161, d.__h.length && o.push(d), g && (d.__E = d.__ = null);
	} catch (e) {
		if (t.__v = null, c || a != null) {
			for (t.__u |= c ? 160 : 128; s && s.nodeType === 8 && s.nextSibling;) s = s.nextSibling;
			a[a.indexOf(s)] = null, t.__e = s;
		} else t.__e = n.__e, t.__k = n.__k;
		R.__e(e, t, n);
	}
	else a == null && t.__v === n.__v ? (t.__k = n.__k, t.__e = n.__e) : t.__e = qi(n.__e, t, n, r, i, a, o, c, l);
	(u = R.diffed) && u(t);
}
function Ki(e, t, n) {
	t.__d = void 0;
	for (var r = 0; r < n.length; r++) Ji(n[r], n[++r], n[++r]);
	R.__c && R.__c(t, e), e.some(function(t) {
		try {
			e = t.__h, t.__h = [], e.some(function(e) {
				e.call(t);
			});
		} catch (e) {
			R.__e(e, t.__v);
		}
	});
}
function qi(e, t, n, r, i, a, o, s, c) {
	var l, u, d, f, p, m, h, g = n.props, _ = t.props, v = t.type;
	if (v === "svg" ? i = "http://www.w3.org/2000/svg" : v === "math" ? i = "http://www.w3.org/1998/Math/MathML" : i ||= "http://www.w3.org/1999/xhtml", a != null) {
		for (l = 0; l < a.length; l++) if ((p = a[l]) && "setAttribute" in p == !!v && (v ? p.localName === v : p.nodeType === 3)) {
			e = p, a[l] = null;
			break;
		}
	}
	if (e == null) {
		if (v === null) return document.createTextNode(_);
		e = document.createElementNS(i, v, _.is && _), s &&= (R.__m && R.__m(t, a), !1), a = null;
	}
	if (v === null) g === _ || s && e.data === _ || (e.data = _);
	else {
		if (a &&= gi.call(e.childNodes), g = n.props || Ti, !s && a != null) for (g = {}, l = 0; l < e.attributes.length; l++) g[(p = e.attributes[l]).name] = p.value;
		for (l in g) if (p = g[l], l != "children") {
			if (l == "dangerouslySetInnerHTML") d = p;
			else if (!(l in _)) {
				if (l == "value" && "defaultValue" in _ || l == "checked" && "defaultChecked" in _) continue;
				Ui(e, l, null, p, i);
			}
		}
		for (l in _) p = _[l], l == "children" ? f = p : l == "dangerouslySetInnerHTML" ? u = p : l == "value" ? m = p : l == "checked" ? h = p : s && typeof p != "function" || g[l] === p || Ui(e, l, p, g[l], i);
		if (u) s || d && (u.__html === d.__html || u.__html === e.innerHTML) || (e.innerHTML = u.__html), t.__k = [];
		else if (d && (e.innerHTML = ""), Ri(e, Oi(f) ? f : [f], t, n, r, v === "foreignObject" ? "http://www.w3.org/1999/xhtml" : i, a, o, a ? a[0] : n.__k && Pi(n, 0), s, c), a != null) for (l = a.length; l--;) Ai(a[l]);
		s || (l = "value", v === "progress" && m == null ? e.removeAttribute("value") : m !== void 0 && (m !== e[l] || v === "progress" && !m || v === "option" && m !== g[l]) && Ui(e, l, m, g[l], i), l = "checked", h !== void 0 && h !== e[l] && Ui(e, l, h, g[l], i));
	}
	return e;
}
function Ji(e, t, n) {
	try {
		if (typeof e == "function") {
			var r = typeof e.__u == "function";
			r && e.__u(), r && t == null || (e.__u = e(t));
		} else e.current = t;
	} catch (e) {
		R.__e(e, n);
	}
}
function Yi(e, t, n) {
	var r, i;
	if (R.unmount && R.unmount(e), (r = e.ref) && (r.current && r.current !== e.__e || Ji(r, null, t)), (r = e.__c) != null) {
		if (r.componentWillUnmount) try {
			r.componentWillUnmount();
		} catch (e) {
			R.__e(e, t);
		}
		r.base = r.__P = null;
	}
	if (r = e.__k) for (i = 0; i < r.length; i++) r[i] && Yi(r[i], t, n || typeof e.type != "function");
	n || Ai(e.__e), e.__c = e.__ = e.__e = e.__d = void 0;
}
function Xi(e, t, n) {
	return this.constructor(e, n);
}
gi = Ei.slice, R = { __e: function(e, t, n, r) {
	for (var i, a, o; t = t.__;) if ((i = t.__c) && !i.__) try {
		if ((a = i.constructor) && a.getDerivedStateFromError != null && (i.setState(a.getDerivedStateFromError(e)), o = i.__d), i.componentDidCatch != null && (i.componentDidCatch(e, r || {}), o = i.__d), o) return i.__E = i;
	} catch (t) {
		e = t;
	}
	throw e;
} }, _i = 0, Ni.prototype.setState = function(e, t) {
	var n = this.__s != null && this.__s !== this.state ? this.__s : this.__s = ki({}, this.state);
	typeof e == "function" && (e = e(ki({}, n), this.props)), e && ki(n, e), e != null && this.__v && (t && this._sb.push(t), Ii(this));
}, Ni.prototype.forceUpdate = function(e) {
	this.__v && (this.__e = !0, e && this.__h.push(e), Ii(this));
}, Ni.prototype.render = z, vi = [], bi = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, xi = function(e, t) {
	return e.__v.__b - t.__v.__b;
}, Li.__r = 0, Si = 0, Ci = Wi(!1), wi = Wi(!0);
//#endregion
//#region node_modules/preact-render-to-string/dist/index.module.js
var Zi = /[\s\n\\/='"\0<>]/, Qi = /^(xlink|xmlns|xml)([A-Z])/, $i = /^accessK|^auto[A-Z]|^cell|^ch|^col|cont|cross|dateT|encT|form[A-Z]|frame|hrefL|inputM|maxL|minL|noV|playsI|popoverT|readO|rowS|src[A-Z]|tabI|useM|item[A-Z]/, ea = /^ac|^ali|arabic|basel|cap|clipPath$|clipRule$|color|dominant|enable|fill|flood|font|glyph[^R]|horiz|image|letter|lighting|marker[^WUH]|overline|panose|pointe|paint|rendering|shape|stop|strikethrough|stroke|text[^L]|transform|underline|unicode|units|^v[^i]|^w|^xH/, ta = new Set(["draggable", "spellcheck"]), na = /["&<]/;
function ra(e) {
	if (e.length === 0 || !1 === na.test(e)) return e;
	for (var t = 0, n = 0, r = "", i = ""; n < e.length; n++) {
		switch (e.charCodeAt(n)) {
			case 34:
				i = "&quot;";
				break;
			case 38:
				i = "&amp;";
				break;
			case 60:
				i = "&lt;";
				break;
			default: continue;
		}
		n !== t && (r += e.slice(t, n)), r += i, t = n + 1;
	}
	return n !== t && (r += e.slice(t, n)), r;
}
var ia = {}, aa = new Set(/* @__PURE__ */ "animation-iteration-count.border-image-outset.border-image-slice.border-image-width.box-flex.box-flex-group.box-ordinal-group.column-count.fill-opacity.flex.flex-grow.flex-negative.flex-order.flex-positive.flex-shrink.flood-opacity.font-weight.grid-column.grid-row.line-clamp.line-height.opacity.order.orphans.stop-opacity.stroke-dasharray.stroke-dashoffset.stroke-miterlimit.stroke-opacity.stroke-width.tab-size.widows.z-index.zoom".split(".")), oa = /[A-Z]/g;
function sa(e) {
	var t = "";
	for (var n in e) {
		var r = e[n];
		if (r != null && r !== "") {
			var i = n[0] == "-" ? n : ia[n] || (ia[n] = n.replace(oa, "-$&").toLowerCase()), a = ";";
			typeof r != "number" || i.startsWith("--") || aa.has(i) || (a = "px;"), t = t + i + ":" + r + a;
		}
	}
	return t || void 0;
}
function ca() {
	this.__d = !0;
}
function la(e, t) {
	return {
		__v: e,
		context: t,
		props: e.props,
		setState: ca,
		forceUpdate: ca,
		__d: !0,
		__h: []
	};
}
function B(e, t, n) {
	if (!e.s) {
		if (n instanceof ua) {
			if (!n.s) return void (n.o = B.bind(null, e, t));
			1 & t && (t = n.s), n = n.v;
		}
		if (n && n.then) return void n.then(B.bind(null, e, t), B.bind(null, e, 2));
		e.s = t, e.v = n;
		let r = e.o;
		r && r(e);
	}
}
var ua = /* @__PURE__ */ function() {
	function e() {}
	return e.prototype.then = function(t, n) {
		var r = new e(), i = this.s;
		if (i) {
			var a = 1 & i ? t : n;
			if (a) {
				try {
					B(r, 1, a(this.v));
				} catch (e) {
					B(r, 2, e);
				}
				return r;
			}
			return this;
		}
		return this.o = function(e) {
			try {
				var i = e.v;
				1 & e.s ? B(r, 1, t ? t(i) : i) : n ? B(r, 1, n(i)) : B(r, 2, i);
			} catch (e) {
				B(r, 2, e);
			}
		}, r;
	}, e;
}(), da, fa, pa, ma, ha = {}, ga = [], _a = Array.isArray, va = Object.assign, V = "";
function ya(e, t, n) {
	var r = R.__s;
	R.__s = !0, da = R.__b, fa = R.diffed, pa = R.__r, ma = R.unmount;
	var i = ji(z, null);
	i.__k = [e];
	try {
		var a = H(e, t || ha, !1, void 0, i, !1, n);
		return _a(a) ? a.join(V) : a;
	} catch (e) {
		throw e.then ? Error("Use \"renderToStringAsync\" for suspenseful rendering.") : e;
	} finally {
		R.__c && R.__c(e, ga), R.__s = r, ga.length = 0;
	}
}
function ba(e, t) {
	var n, r = e.type, i = !0;
	return e.__c ? (i = !1, (n = e.__c).state = n.__s) : n = new r(e.props, t), e.__c = n, n.__v = e, n.props = e.props, n.context = t, n.__d = !0, n.state ??= ha, n.__s ??= n.state, r.getDerivedStateFromProps ? n.state = va({}, n.state, r.getDerivedStateFromProps(n.props, n.state)) : i && n.componentWillMount ? (n.componentWillMount(), n.state = n.__s === n.state ? n.state : n.__s) : !i && n.componentWillUpdate && n.componentWillUpdate(), pa && pa(e), n.render(n.props, n.state, t);
}
function H(e, t, n, r, i, a, o) {
	if (e == null || !0 === e || !1 === e || e === V) return V;
	var s = typeof e;
	if (s != "object") return s == "function" ? V : s == "string" ? ra(e) : e + V;
	if (_a(e)) {
		var c, l = V;
		i.__k = e;
		for (var u = 0; u < e.length; u++) {
			var d = e[u];
			if (d != null && typeof d != "boolean") {
				var f, p = H(d, t, n, r, i, a, o);
				typeof p == "string" ? l += p : (c ||= [], l && c.push(l), l = V, _a(p) ? (f = c).push.apply(f, p) : c.push(p));
			}
		}
		return c ? (l && c.push(l), c) : l;
	}
	if (e.constructor !== void 0) return V;
	e.__ = i, da && da(e);
	var m = e.type, h = e.props;
	if (typeof m == "function") {
		var g, _, v, y = t;
		if (m === z) {
			if ("tpl" in h) {
				for (var b = V, x = 0; x < h.tpl.length; x++) if (b += h.tpl[x], h.exprs && x < h.exprs.length) {
					var S = h.exprs[x];
					if (S == null) continue;
					typeof S != "object" || S.constructor !== void 0 && !_a(S) ? b += S : b += H(S, t, n, r, e, a, o);
				}
				return b;
			}
			if ("UNSTABLE_comment" in h) return "<!--" + ra(h.UNSTABLE_comment) + "-->";
			_ = h.children;
		} else {
			if ((g = m.contextType) != null) {
				var C = t[g.__c];
				y = C ? C.props.value : g.__;
			}
			var w = m.prototype && typeof m.prototype.render == "function";
			if (w) _ = ba(e, y), v = e.__c;
			else {
				e.__c = v = la(e, y);
				for (var T = 0; v.__d && T++ < 25;) v.__d = !1, pa && pa(e), _ = m.call(v, h, y);
				v.__d = !0;
			}
			if (v.getChildContext != null && (t = va({}, t, v.getChildContext())), w && R.errorBoundaries && (m.getDerivedStateFromError || v.componentDidCatch)) {
				_ = _ != null && _.type === z && _.key == null && _.props.tpl == null ? _.props.children : _;
				try {
					return H(_, t, n, r, e, a, o);
				} catch (i) {
					return m.getDerivedStateFromError && (v.__s = m.getDerivedStateFromError(i)), v.componentDidCatch && v.componentDidCatch(i, ha), v.__d ? (_ = ba(e, t), (v = e.__c).getChildContext != null && (t = va({}, t, v.getChildContext())), H(_ = _ != null && _.type === z && _.key == null && _.props.tpl == null ? _.props.children : _, t, n, r, e, a, o)) : V;
				} finally {
					fa && fa(e), e.__ = null, ma && ma(e);
				}
			}
		}
		_ = _ != null && _.type === z && _.key == null && _.props.tpl == null ? _.props.children : _;
		try {
			var E = H(_, t, n, r, e, a, o);
			return fa && fa(e), e.__ = null, R.unmount && R.unmount(e), E;
		} catch (i) {
			if (!a && o && o.onError) {
				var ee = o.onError(i, e, function(i) {
					return H(i, t, n, r, e, a, o);
				});
				if (ee !== void 0) return ee;
				var te = R.__e;
				return te && te(i, e), V;
			}
			if (!a || !i || typeof i.then != "function") throw i;
			return i.then(function i() {
				try {
					return H(_, t, n, r, e, a, o);
				} catch (s) {
					if (!s || typeof s.then != "function") throw s;
					return s.then(function() {
						return H(_, t, n, r, e, a, o);
					}, i);
				}
			});
		}
	}
	var D, ne = "<" + m, O = V;
	for (var k in h) {
		var A = h[k];
		if (typeof A != "function" || k === "class" || k === "className") {
			switch (k) {
				case "children":
					D = A;
					continue;
				case "key":
				case "ref":
				case "__self":
				case "__source": continue;
				case "htmlFor":
					if ("for" in h) continue;
					k = "for";
					break;
				case "className":
					if ("class" in h) continue;
					k = "class";
					break;
				case "defaultChecked":
					k = "checked";
					break;
				case "defaultSelected":
					k = "selected";
					break;
				case "defaultValue":
				case "value":
					switch (k = "value", m) {
						case "textarea":
							D = A;
							continue;
						case "select":
							r = A;
							continue;
						case "option": r != A || "selected" in h || (ne += " selected");
					}
					break;
				case "dangerouslySetInnerHTML":
					O = A && A.__html;
					continue;
				case "style":
					typeof A == "object" && (A = sa(A));
					break;
				case "acceptCharset":
					k = "accept-charset";
					break;
				case "httpEquiv":
					k = "http-equiv";
					break;
				default: if (Qi.test(k)) k = k.replace(Qi, "$1:$2").toLowerCase();
				else {
					if (Zi.test(k)) continue;
					k[4] !== "-" && !ta.has(k) || A == null ? n ? ea.test(k) && (k = k === "panose1" ? "panose-1" : k.replace(/([A-Z])/g, "-$1").toLowerCase()) : $i.test(k) && (k = k.toLowerCase()) : A += V;
				}
			}
			A != null && !1 !== A && (ne = !0 === A || A === V ? ne + " " + k : ne + " " + k + "=\"" + (typeof A == "string" ? ra(A) : A + V) + "\"");
		}
	}
	if (Zi.test(m)) throw Error(m + " is not a valid HTML tag name in " + ne + ">");
	if (O || (typeof D == "string" ? O = ra(D) : D != null && !1 !== D && !0 !== D && (O = H(D, t, m === "svg" || m !== "foreignObject" && n, r, e, a, o))), fa && fa(e), e.__ = null, ma && ma(e), !O && xa.has(m)) return ne + "/>";
	var re = "</" + m + ">", ie = ne + ">";
	return _a(O) ? [ie].concat(O, [re]) : typeof O == "string" ? ie + O + re : [
		ie,
		O,
		re
	];
}
var xa = new Set([
	"area",
	"base",
	"br",
	"col",
	"command",
	"embed",
	"hr",
	"img",
	"input",
	"keygen",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr"
]), Sa = 0;
Array.isArray;
function U(e, t, n, r, i, a) {
	t ||= {};
	var o, s, c = t;
	"ref" in t && (o = t.ref, delete t.ref);
	var l = {
		type: e,
		props: c,
		key: n,
		ref: o,
		__k: null,
		__: null,
		__b: 0,
		__e: null,
		__d: void 0,
		__c: null,
		constructor: void 0,
		__v: --Sa,
		__i: -1,
		__u: 0,
		__source: i,
		__self: a
	};
	if (typeof e == "function" && (o = e.defaultProps)) for (s in o) c[s] === void 0 && (c[s] = o[s]);
	return R.vnode && R.vnode(l), l;
}
//#endregion
//#region node_modules/@auth/core/lib/pages/error.js
function Ca(e) {
	let { url: t, error: n = "default", theme: r } = e, i = `${t}/signin`, a = {
		default: {
			status: 200,
			heading: "Error",
			message: U("p", { children: U("a", {
				className: "site",
				href: t?.origin,
				children: t?.host
			}) })
		},
		Configuration: {
			status: 500,
			heading: "Server error",
			message: U("div", { children: [U("p", { children: "There is a problem with the server configuration." }), U("p", { children: "Check the server logs for more information." })] })
		},
		AccessDenied: {
			status: 403,
			heading: "Access Denied",
			message: U("div", { children: [U("p", { children: "You do not have permission to sign in." }), U("p", { children: U("a", {
				className: "button",
				href: i,
				children: "Sign in"
			}) })] })
		},
		Verification: {
			status: 403,
			heading: "Unable to sign in",
			message: U("div", { children: [U("p", { children: "The sign in link is no longer valid." }), U("p", { children: "It may have been used already or it may have expired." })] }),
			signin: U("a", {
				className: "button",
				href: i,
				children: "Sign in"
			})
		}
	}, { status: o, heading: s, message: c, signin: l } = a[n] ?? a.default;
	return {
		status: o,
		html: U("div", {
			className: "error",
			children: [r?.brandColor && U("style", { dangerouslySetInnerHTML: { __html: `
        :root {
          --brand-color: ${r?.brandColor}
        }
      ` } }), U("div", {
				className: "card",
				children: [
					r?.logo && U("img", {
						src: r?.logo,
						alt: "Logo",
						className: "logo"
					}),
					U("h1", { children: s }),
					U("div", {
						className: "message",
						children: c
					}),
					l
				]
			})]
		})
	};
}
//#endregion
//#region node_modules/@auth/core/lib/utils/webauthn-client.js
async function wa(e, t) {
	let n = window.SimpleWebAuthnBrowser;
	async function r(n) {
		let r = new URL(`${e}/webauthn-options/${t}`);
		n && r.searchParams.append("action", n), a().forEach((e) => {
			r.searchParams.append(e.name, e.value);
		});
		let i = await fetch(r);
		if (!i.ok) {
			console.error("Failed to fetch options", i);
			return;
		}
		return i.json();
	}
	function i() {
		let e = `#${t}-form`, n = document.querySelector(e);
		if (!n) throw Error(`Form '${e}' not found`);
		return n;
	}
	function a() {
		let e = i();
		return Array.from(e.querySelectorAll("input[data-form-field]"));
	}
	async function o(e, t) {
		let n = i();
		if (e) {
			let t = document.createElement("input");
			t.type = "hidden", t.name = "action", t.value = e, n.appendChild(t);
		}
		if (t) {
			let e = document.createElement("input");
			e.type = "hidden", e.name = "data", e.value = JSON.stringify(t), n.appendChild(e);
		}
		return n.submit();
	}
	async function s(e, t) {
		return await o("authenticate", await n.startAuthentication(e, t));
	}
	async function c(e) {
		return a().forEach((e) => {
			if (e.required && !e.value) throw Error(`Missing required field: ${e.name}`);
		}), await o("register", await n.startRegistration(e));
	}
	async function l() {
		if (!n.browserSupportsWebAuthnAutofill()) return;
		let e = await r("authenticate");
		if (!e) {
			console.error("Failed to fetch option for autofill authentication");
			return;
		}
		try {
			await s(e.options, !0);
		} catch (e) {
			console.error(e);
		}
	}
	async function u() {
		let e = i();
		if (!n.browserSupportsWebAuthn()) {
			e.style.display = "none";
			return;
		}
		e && e.addEventListener("submit", async (e) => {
			e.preventDefault();
			let t = await r(void 0);
			if (!t) {
				console.error("Failed to fetch options for form submission");
				return;
			}
			if (t.action === "authenticate") try {
				await s(t.options, !1);
			} catch (e) {
				console.error(e);
			}
			else if (t.action === "register") try {
				await c(t.options);
			} catch (e) {
				console.error(e);
			}
		});
	}
	u(), l();
}
//#endregion
//#region node_modules/@auth/core/lib/pages/signin.js
var Ta = {
	default: "Unable to sign in.",
	Signin: "Try signing in with a different account.",
	OAuthSignin: "Try signing in with a different account.",
	OAuthCallbackError: "Try signing in with a different account.",
	OAuthCreateAccount: "Try signing in with a different account.",
	EmailCreateAccount: "Try signing in with a different account.",
	Callback: "Try signing in with a different account.",
	OAuthAccountNotLinked: "To confirm your identity, sign in with the same account you used originally.",
	EmailSignin: "The e-mail could not be sent.",
	CredentialsSignin: "Sign in failed. Check the details you provided are correct.",
	SessionRequired: "Please sign in to access this page."
};
function Ea(e) {
	return U(z, { children: U("script", { dangerouslySetInnerHTML: { __html: `
const currentURL = window.location.href;
const authURL = currentURL.substring(0, currentURL.lastIndexOf('/'));
(${wa})(authURL, "${e}");
` } }) });
}
function Da(e) {
	let { csrfToken: t, providers: n = [], callbackUrl: r, theme: i, email: a, error: o } = e;
	typeof document < "u" && i?.brandColor && document.documentElement.style.setProperty("--brand-color", i.brandColor), typeof document < "u" && i?.buttonText && document.documentElement.style.setProperty("--button-text-color", i.buttonText);
	let s = o && (Ta[o] ?? Ta.default), c = n.find((e) => e.type === "webauthn" && e.enableConditionalUI)?.id;
	return U("div", {
		className: "signin",
		children: [
			i?.brandColor && U("style", { dangerouslySetInnerHTML: { __html: `:root {--brand-color: ${i.brandColor}}` } }),
			i?.buttonText && U("style", { dangerouslySetInnerHTML: { __html: `
        :root {
          --button-text-color: ${i.buttonText}
        }
      ` } }),
			U("div", {
				className: "card",
				children: [
					s && U("div", {
						className: "error",
						children: U("p", { children: s })
					}),
					i?.logo && U("img", {
						src: i.logo,
						alt: "Logo",
						className: "logo"
					}),
					n.map((e, i) => {
						let o, s, c;
						(e.type === "oauth" || e.type === "oidc") && ({bg: o = "#fff", brandColor: s, logo: c = `https://authjs.dev/img/providers/${e.id}.svg`} = e.style ?? {});
						let l = s ?? o ?? "#fff";
						return U("div", {
							className: "provider",
							children: [
								e.type === "oauth" || e.type === "oidc" ? U("form", {
									action: e.signinUrl,
									method: "POST",
									children: [
										U("input", {
											type: "hidden",
											name: "csrfToken",
											value: t
										}),
										r && U("input", {
											type: "hidden",
											name: "callbackUrl",
											value: r
										}),
										U("button", {
											type: "submit",
											className: "button",
											style: { "--provider-brand-color": l },
											tabIndex: 0,
											children: [U("span", {
												style: {
													filter: "invert(1) grayscale(1) brightness(1.3) contrast(9000)",
													"mix-blend-mode": "luminosity",
													opacity: .95
												},
												children: ["Sign in with ", e.name]
											}), c && U("img", {
												loading: "lazy",
												height: 24,
												src: c
											})]
										})
									]
								}) : null,
								(e.type === "email" || e.type === "credentials" || e.type === "webauthn") && i > 0 && n[i - 1].type !== "email" && n[i - 1].type !== "credentials" && n[i - 1].type !== "webauthn" && U("hr", {}),
								e.type === "email" && U("form", {
									action: e.signinUrl,
									method: "POST",
									children: [
										U("input", {
											type: "hidden",
											name: "csrfToken",
											value: t
										}),
										U("label", {
											className: "section-header",
											htmlFor: `input-email-for-${e.id}-provider`,
											children: "Email"
										}),
										U("input", {
											id: `input-email-for-${e.id}-provider`,
											autoFocus: !0,
											type: "email",
											name: "email",
											value: a,
											placeholder: "email@example.com",
											required: !0
										}),
										U("button", {
											id: "submitButton",
											type: "submit",
											tabIndex: 0,
											children: ["Sign in with ", e.name]
										})
									]
								}),
								e.type === "credentials" && U("form", {
									action: e.callbackUrl,
									method: "POST",
									children: [
										U("input", {
											type: "hidden",
											name: "csrfToken",
											value: t
										}),
										Object.keys(e.credentials).map((t) => U("div", { children: [U("label", {
											className: "section-header",
											htmlFor: `input-${t}-for-${e.id}-provider`,
											children: e.credentials[t].label ?? t
										}), U("input", {
											name: t,
											id: `input-${t}-for-${e.id}-provider`,
											type: e.credentials[t].type ?? "text",
											placeholder: e.credentials[t].placeholder ?? "",
											...e.credentials[t]
										})] }, `input-group-${e.id}`)),
										U("button", {
											id: "submitButton",
											type: "submit",
											tabIndex: 0,
											children: ["Sign in with ", e.name]
										})
									]
								}),
								e.type === "webauthn" && U("form", {
									action: e.callbackUrl,
									method: "POST",
									id: `${e.id}-form`,
									children: [
										U("input", {
											type: "hidden",
											name: "csrfToken",
											value: t
										}),
										Object.keys(e.formFields).map((t) => U("div", { children: [U("label", {
											className: "section-header",
											htmlFor: `input-${t}-for-${e.id}-provider`,
											children: e.formFields[t].label ?? t
										}), U("input", {
											name: t,
											"data-form-field": !0,
											id: `input-${t}-for-${e.id}-provider`,
											type: e.formFields[t].type ?? "text",
											placeholder: e.formFields[t].placeholder ?? "",
											...e.formFields[t]
										})] }, `input-group-${e.id}`)),
										U("button", {
											id: `submitButton-${e.id}`,
											type: "submit",
											tabIndex: 0,
											children: ["Sign in with ", e.name]
										})
									]
								}),
								(e.type === "email" || e.type === "credentials" || e.type === "webauthn") && i + 1 < n.length && U("hr", {})
							]
						}, e.id);
					})
				]
			}),
			c && Ea(c)
		]
	});
}
//#endregion
//#region node_modules/@auth/core/lib/pages/signout.js
function Oa(e) {
	let { url: t, csrfToken: n, theme: r } = e;
	return U("div", {
		className: "signout",
		children: [
			r?.brandColor && U("style", { dangerouslySetInnerHTML: { __html: `
        :root {
          --brand-color: ${r.brandColor}
        }
      ` } }),
			r?.buttonText && U("style", { dangerouslySetInnerHTML: { __html: `
        :root {
          --button-text-color: ${r.buttonText}
        }
      ` } }),
			U("div", {
				className: "card",
				children: [
					r?.logo && U("img", {
						src: r.logo,
						alt: "Logo",
						className: "logo"
					}),
					U("h1", { children: "Signout" }),
					U("p", { children: "Are you sure you want to sign out?" }),
					U("form", {
						action: t?.toString(),
						method: "POST",
						children: [U("input", {
							type: "hidden",
							name: "csrfToken",
							value: n
						}), U("button", {
							id: "submitButton",
							type: "submit",
							children: "Sign out"
						})]
					})
				]
			})
		]
	});
}
//#endregion
//#region node_modules/@auth/core/lib/pages/styles.js
var ka = ":root {\n  --border-width: 1px;\n  --border-radius: 0.5rem;\n  --color-error: #c94b4b;\n  --color-info: #157efb;\n  --color-info-hover: #0f6ddb;\n  --color-info-text: #fff;\n}\n\n.__next-auth-theme-auto,\n.__next-auth-theme-light {\n  --color-background: #ececec;\n  --color-background-hover: rgba(236, 236, 236, 0.8);\n  --color-background-card: #fff;\n  --color-text: #000;\n  --color-primary: #444;\n  --color-control-border: #bbb;\n  --color-button-active-background: #f9f9f9;\n  --color-button-active-border: #aaa;\n  --color-separator: #ccc;\n  --provider-bg: #fff;\n  --provider-bg-hover: color-mix(\n    in srgb,\n    var(--provider-brand-color) 30%,\n    #fff\n  );\n}\n\n.__next-auth-theme-dark {\n  --color-background: #161b22;\n  --color-background-hover: rgba(22, 27, 34, 0.8);\n  --color-background-card: #0d1117;\n  --color-text: #fff;\n  --color-primary: #ccc;\n  --color-control-border: #555;\n  --color-button-active-background: #060606;\n  --color-button-active-border: #666;\n  --color-separator: #444;\n  --provider-bg: #161b22;\n  --provider-bg-hover: color-mix(\n    in srgb,\n    var(--provider-brand-color) 30%,\n    #000\n  );\n}\n\n.__next-auth-theme-dark img[src$=\"42-school.svg\"],\n  .__next-auth-theme-dark img[src$=\"apple.svg\"],\n  .__next-auth-theme-dark img[src$=\"boxyhq-saml.svg\"],\n  .__next-auth-theme-dark img[src$=\"eveonline.svg\"],\n  .__next-auth-theme-dark img[src$=\"github.svg\"],\n  .__next-auth-theme-dark img[src$=\"mailchimp.svg\"],\n  .__next-auth-theme-dark img[src$=\"medium.svg\"],\n  .__next-auth-theme-dark img[src$=\"okta.svg\"],\n  .__next-auth-theme-dark img[src$=\"patreon.svg\"],\n  .__next-auth-theme-dark img[src$=\"ping-id.svg\"],\n  .__next-auth-theme-dark img[src$=\"roblox.svg\"],\n  .__next-auth-theme-dark img[src$=\"threads.svg\"],\n  .__next-auth-theme-dark img[src$=\"wikimedia.svg\"] {\n    filter: invert(1);\n  }\n\n.__next-auth-theme-dark #submitButton {\n    background-color: var(--provider-bg, var(--color-info));\n  }\n\n@media (prefers-color-scheme: dark) {\n  .__next-auth-theme-auto {\n    --color-background: #161b22;\n    --color-background-hover: rgba(22, 27, 34, 0.8);\n    --color-background-card: #0d1117;\n    --color-text: #fff;\n    --color-primary: #ccc;\n    --color-control-border: #555;\n    --color-button-active-background: #060606;\n    --color-button-active-border: #666;\n    --color-separator: #444;\n    --provider-bg: #161b22;\n    --provider-bg-hover: color-mix(\n      in srgb,\n      var(--provider-brand-color) 30%,\n      #000\n    );\n  }\n    .__next-auth-theme-auto img[src$=\"42-school.svg\"],\n    .__next-auth-theme-auto img[src$=\"apple.svg\"],\n    .__next-auth-theme-auto img[src$=\"boxyhq-saml.svg\"],\n    .__next-auth-theme-auto img[src$=\"eveonline.svg\"],\n    .__next-auth-theme-auto img[src$=\"github.svg\"],\n    .__next-auth-theme-auto img[src$=\"mailchimp.svg\"],\n    .__next-auth-theme-auto img[src$=\"medium.svg\"],\n    .__next-auth-theme-auto img[src$=\"okta.svg\"],\n    .__next-auth-theme-auto img[src$=\"patreon.svg\"],\n    .__next-auth-theme-auto img[src$=\"ping-id.svg\"],\n    .__next-auth-theme-auto img[src$=\"roblox.svg\"],\n    .__next-auth-theme-auto img[src$=\"threads.svg\"],\n    .__next-auth-theme-auto img[src$=\"wikimedia.svg\"] {\n      filter: invert(1);\n    }\n    .__next-auth-theme-auto #submitButton {\n      background-color: var(--provider-bg, var(--color-info));\n    }\n}\n\nhtml {\n  box-sizing: border-box;\n}\n\n*,\n*:before,\n*:after {\n  box-sizing: inherit;\n  margin: 0;\n  padding: 0;\n}\n\nbody {\n  background-color: var(--color-background);\n  margin: 0;\n  padding: 0;\n  font-family:\n    ui-sans-serif,\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    \"Segoe UI\",\n    Roboto,\n    \"Helvetica Neue\",\n    Arial,\n    \"Noto Sans\",\n    sans-serif,\n    \"Apple Color Emoji\",\n    \"Segoe UI Emoji\",\n    \"Segoe UI Symbol\",\n    \"Noto Color Emoji\";\n}\n\nh1 {\n  margin-bottom: 1.5rem;\n  padding: 0 1rem;\n  font-weight: 400;\n  color: var(--color-text);\n}\n\np {\n  margin-bottom: 1.5rem;\n  padding: 0 1rem;\n  color: var(--color-text);\n}\n\nform {\n  margin: 0;\n  padding: 0;\n}\n\nlabel {\n  font-weight: 500;\n  text-align: left;\n  margin-bottom: 0.25rem;\n  display: block;\n  color: var(--color-text);\n}\n\ninput[type] {\n  box-sizing: border-box;\n  display: block;\n  width: 100%;\n  padding: 0.5rem 1rem;\n  border: var(--border-width) solid var(--color-control-border);\n  background: var(--color-background-card);\n  font-size: 1rem;\n  border-radius: var(--border-radius);\n  color: var(--color-text);\n}\n\np {\n  font-size: 1.1rem;\n  line-height: 2rem;\n}\n\na.button {\n  text-decoration: none;\n  line-height: 1rem;\n}\n\na.button:link,\n  a.button:visited {\n    background-color: var(--color-background);\n    color: var(--color-primary);\n  }\n\nbutton,\na.button {\n  padding: 0.75rem 1rem;\n  color: var(--provider-color, var(--color-primary));\n  background-color: var(--provider-bg, var(--color-background));\n  border: 1px solid #00000031;\n  font-size: 0.9rem;\n  height: 50px;\n  border-radius: var(--border-radius);\n  transition: background-color 250ms ease-in-out;\n  font-weight: 300;\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\n:is(button,a.button):hover {\n    background-color: var(--provider-bg-hover, var(--color-background-hover));\n    cursor: pointer;\n  }\n\n:is(button,a.button):active {\n    cursor: pointer;\n  }\n\n:is(button,a.button) span {\n    color: var(--provider-bg);\n  }\n\n#submitButton {\n  color: var(--button-text-color, var(--color-info-text));\n  background-color: var(--brand-color, var(--color-info));\n  width: 100%;\n}\n\n#submitButton:hover {\n    background-color: var(\n      --button-hover-bg,\n      var(--color-info-hover)\n    ) !important;\n  }\n\na.site {\n  color: var(--color-primary);\n  text-decoration: none;\n  font-size: 1rem;\n  line-height: 2rem;\n}\n\na.site:hover {\n    text-decoration: underline;\n  }\n\n.page {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  display: grid;\n  place-items: center;\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\n.page > div {\n    text-align: center;\n  }\n\n.error a.button {\n    padding-left: 2rem;\n    padding-right: 2rem;\n    margin-top: 0.5rem;\n  }\n\n.error .message {\n    margin-bottom: 1.5rem;\n  }\n\n.signin input[type=\"text\"] {\n    margin-left: auto;\n    margin-right: auto;\n    display: block;\n  }\n\n.signin hr {\n    display: block;\n    border: 0;\n    border-top: 1px solid var(--color-separator);\n    margin: 2rem auto 1rem auto;\n    overflow: visible;\n  }\n\n.signin hr::before {\n      content: \"or\";\n      background: var(--color-background-card);\n      color: #888;\n      padding: 0 0.4rem;\n      position: relative;\n      top: -0.7rem;\n    }\n\n.signin .error {\n    background: #f5f5f5;\n    font-weight: 500;\n    border-radius: 0.3rem;\n    background: var(--color-error);\n  }\n\n.signin .error p {\n      text-align: left;\n      padding: 0.5rem 1rem;\n      font-size: 0.9rem;\n      line-height: 1.2rem;\n      color: var(--color-info-text);\n    }\n\n.signin > div,\n  .signin form {\n    display: block;\n  }\n\n.signin > div input[type], .signin form input[type] {\n      margin-bottom: 0.5rem;\n    }\n\n.signin > div button, .signin form button {\n      width: 100%;\n    }\n\n.signin .provider + .provider {\n    margin-top: 1rem;\n  }\n\n.logo {\n  display: inline-block;\n  max-width: 150px;\n  margin: 1.25rem 0;\n  max-height: 70px;\n}\n\n.card {\n  background-color: var(--color-background-card);\n  border-radius: 1rem;\n  padding: 1.25rem 2rem;\n}\n\n.card .header {\n    color: var(--color-primary);\n  }\n\n.card input[type]::-moz-placeholder {\n    color: color-mix(\n      in srgb,\n      var(--color-text) 20%,\n      var(--color-button-active-background)\n    );\n  }\n\n.card input[type]::placeholder {\n    color: color-mix(\n      in srgb,\n      var(--color-text) 20%,\n      var(--color-button-active-background)\n    );\n  }\n\n.card input[type] {\n    background: color-mix(in srgb, var(--color-background-card) 95%, black);\n  }\n\n.section-header {\n  color: var(--color-text);\n}\n\n@media screen and (min-width: 450px) {\n  .card {\n    margin: 2rem 0;\n    width: 368px;\n  }\n}\n\n@media screen and (max-width: 450px) {\n  .card {\n    margin: 1rem 0;\n    width: 343px;\n  }\n}\n";
//#endregion
//#region node_modules/@auth/core/lib/pages/verify-request.js
function Aa(e) {
	let { url: t, theme: n } = e;
	return U("div", {
		className: "verify-request",
		children: [n.brandColor && U("style", { dangerouslySetInnerHTML: { __html: `
        :root {
          --brand-color: ${n.brandColor}
        }
      ` } }), U("div", {
			className: "card",
			children: [
				n.logo && U("img", {
					src: n.logo,
					alt: "Logo",
					className: "logo"
				}),
				U("h1", { children: "Check your email" }),
				U("p", { children: "A sign in link has been sent to your email address." }),
				U("p", { children: U("a", {
					className: "site",
					href: t.origin,
					children: t.host
				}) })
			]
		})]
	});
}
//#endregion
//#region node_modules/@auth/core/lib/pages/index.js
function ja({ html: e, title: t, status: n, cookies: r, theme: i, headTags: a }) {
	return {
		cookies: r,
		status: n,
		headers: { "Content-Type": "text/html" },
		body: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${ka}</style><title>${t}</title>${a ?? ""}</head><body class="__next-auth-theme-${i?.colorScheme ?? "auto"}"><div class="page">${ya(e)}</div></body></html>`
	};
}
function Ma(e) {
	let { url: t, theme: n, query: r, cookies: i, pages: a, providers: o } = e;
	return {
		csrf(e, t, n) {
			return e ? (t.logger.warn("csrf-disabled"), n.push({
				name: t.cookies.csrfToken.name,
				value: "",
				options: {
					...t.cookies.csrfToken.options,
					maxAge: 0
				}
			}), {
				status: 404,
				cookies: n
			}) : {
				headers: {
					"Content-Type": "application/json",
					"Cache-Control": "private, no-cache, no-store",
					Expires: "0",
					Pragma: "no-cache"
				},
				body: { csrfToken: t.csrfToken },
				cookies: n
			};
		},
		providers(e) {
			return {
				headers: { "Content-Type": "application/json" },
				body: e.reduce((e, { id: t, name: n, type: r, signinUrl: i, callbackUrl: a }) => (e[t] = {
					id: t,
					name: n,
					type: r,
					signinUrl: i,
					callbackUrl: a
				}, e), {})
			};
		},
		signin(t, s) {
			if (t) throw new se("Unsupported action");
			if (a?.signIn) {
				let t = `${a.signIn}${a.signIn.includes("?") ? "&" : "?"}${new URLSearchParams({ callbackUrl: e.callbackUrl ?? "/" })}`;
				return s && (t = `${t}&${new URLSearchParams({ error: s })}`), {
					redirect: t,
					cookies: i
				};
			}
			let c = o?.find((e) => e.type === "webauthn" && e.enableConditionalUI && !!e.simpleWebAuthnBrowserVersion), l = "";
			if (c) {
				let { simpleWebAuthnBrowserVersion: e } = c;
				l = `<script src="https://unpkg.com/@simplewebauthn/browser@${e}/dist/bundle/index.umd.min.js" crossorigin="anonymous"><\/script>`;
			}
			return ja({
				cookies: i,
				theme: n,
				html: Da({
					csrfToken: e.csrfToken,
					providers: e.providers?.filter((e) => [
						"email",
						"oauth",
						"oidc"
					].includes(e.type) || e.type === "credentials" && e.credentials || e.type === "webauthn" && e.formFields || !1),
					callbackUrl: e.callbackUrl,
					theme: e.theme,
					error: s,
					...r
				}),
				title: "Sign In",
				headTags: l
			});
		},
		signout() {
			return a?.signOut ? {
				redirect: a.signOut,
				cookies: i
			} : ja({
				cookies: i,
				theme: n,
				html: Oa({
					csrfToken: e.csrfToken,
					url: t,
					theme: n
				}),
				title: "Sign Out"
			});
		},
		verifyRequest(e) {
			return a?.verifyRequest ? {
				redirect: `${a.verifyRequest}${t?.search ?? ""}`,
				cookies: i
			} : ja({
				cookies: i,
				theme: n,
				html: Aa({
					url: t,
					theme: n,
					...e
				}),
				title: "Verify Request"
			});
		},
		error(e) {
			return a?.error ? {
				redirect: `${a.error}${a.error.includes("?") ? "&" : "?"}error=${e}`,
				cookies: i
			} : ja({
				cookies: i,
				theme: n,
				...Ca({
					url: t,
					theme: n,
					error: e
				}),
				title: "Error"
			});
		}
	};
}
//#endregion
//#region node_modules/@auth/core/lib/utils/date.js
function Na(e, t = Date.now()) {
	return new Date(t + e * 1e3);
}
//#endregion
//#region node_modules/@auth/core/lib/actions/callback/handle-login.js
async function Pa(e, t, n, r) {
	if (!n?.providerAccountId || !n.type) throw Error("Missing or invalid provider account");
	if (![
		"email",
		"oauth",
		"oidc",
		"webauthn"
	].includes(n.type)) throw Error("Provider not supported");
	let { adapter: i, jwt: a, events: o, session: { strategy: s, generateSessionToken: c } } = r;
	if (!i) return {
		user: t,
		account: n
	};
	let l = t, u = n, { createUser: d, updateUser: f, getUser: p, getUserByAccount: m, getUserByEmail: h, linkAccount: g, createSession: _, getSessionAndUser: v, deleteSession: y } = i, b = null, x = null, S = !1, C = s === "jwt";
	if (e) if (C) try {
		let t = r.cookies.sessionToken.name;
		b = await a.decode({
			...a,
			token: e,
			salt: t
		}), b && "sub" in b && b.sub && (x = await p(b.sub));
	} catch {}
	else {
		let t = await v(e);
		t && (b = t.session, x = t.user);
	}
	if (u.type === "email") {
		let t = await h(l.email);
		return t ? (x?.id !== t.id && !C && e && await y(e), x = await f({
			id: t.id,
			emailVerified: /* @__PURE__ */ new Date()
		}), await o.updateUser?.({ user: x })) : (x = await d({
			...l,
			emailVerified: /* @__PURE__ */ new Date()
		}), await o.createUser?.({ user: x }), S = !0), b = C ? {} : await _({
			sessionToken: c(),
			userId: x.id,
			expires: Na(r.session.maxAge)
		}), {
			session: b,
			user: x,
			isNewUser: S
		};
	} else if (u.type === "webauthn") {
		let e = await m({
			providerAccountId: u.providerAccountId,
			provider: u.provider
		});
		if (e) {
			if (x) {
				if (e.id === x.id) {
					let e = {
						...u,
						userId: x.id
					};
					return {
						session: b,
						user: x,
						isNewUser: S,
						account: e
					};
				}
				throw new ve("The account is already associated with another user", { provider: u.provider });
			}
			b = C ? {} : await _({
				sessionToken: c(),
				userId: e.id,
				expires: Na(r.session.maxAge)
			});
			let t = {
				...u,
				userId: e.id
			};
			return {
				session: b,
				user: e,
				isNewUser: S,
				account: t
			};
		} else {
			if (x) {
				await g({
					...u,
					userId: x.id
				}), await o.linkAccount?.({
					user: x,
					account: u,
					profile: l
				});
				let e = {
					...u,
					userId: x.id
				};
				return {
					session: b,
					user: x,
					isNewUser: S,
					account: e
				};
			}
			if (l.email && await h(l.email)) throw new ve("Another account already exists with the same e-mail address", { provider: u.provider });
			x = await d({ ...l }), await o.createUser?.({ user: x }), await g({
				...u,
				userId: x.id
			}), await o.linkAccount?.({
				user: x,
				account: u,
				profile: l
			}), b = C ? {} : await _({
				sessionToken: c(),
				userId: x.id,
				expires: Na(r.session.maxAge)
			});
			let e = {
				...u,
				userId: x.id
			};
			return {
				session: b,
				user: x,
				isNewUser: !0,
				account: e
			};
		}
	}
	let w = await m({
		providerAccountId: u.providerAccountId,
		provider: u.provider
	});
	if (w) {
		if (x) {
			if (w.id === x.id) return {
				session: b,
				user: x,
				isNewUser: S
			};
			throw new O("The account is already associated with another user", { provider: u.provider });
		}
		return b = C ? {} : await _({
			sessionToken: c(),
			userId: w.id,
			expires: Na(r.session.maxAge)
		}), {
			session: b,
			user: w,
			isNewUser: S
		};
	} else {
		let { provider: e } = r, { type: t, provider: n, providerAccountId: i, userId: a, ...s } = u, f = {
			providerAccountId: i,
			provider: n,
			type: t,
			userId: a
		};
		if (u = Object.assign(e.account(s) ?? {}, f), x) return await g({
			...u,
			userId: x.id
		}), await o.linkAccount?.({
			user: x,
			account: u,
			profile: l
		}), {
			session: b,
			user: x,
			isNewUser: S
		};
		let p = l.email ? await h(l.email) : null;
		if (p) if (r.provider?.allowDangerousEmailAccountLinking) x = p, S = !1;
		else throw new O("Another account already exists with the same e-mail address", { provider: u.provider });
		else x = await d({
			...l,
			emailVerified: null
		}), S = !0;
		return await o.createUser?.({ user: x }), await g({
			...u,
			userId: x.id
		}), await o.linkAccount?.({
			user: x,
			account: u,
			profile: l
		}), b = C ? {} : await _({
			sessionToken: c(),
			userId: x.id,
			expires: Na(r.session.maxAge)
		}), {
			session: b,
			user: x,
			isNewUser: S
		};
	}
}
//#endregion
//#region node_modules/oauth4webapi/build/index.js
var Fa;
(typeof navigator > "u" || !navigator.userAgent?.startsWith?.("Mozilla/5.0 ")) && (Fa = "oauth4webapi/v3.8.7");
function Ia(e, t) {
	if (e == null) return !1;
	try {
		return e instanceof t || Object.getPrototypeOf(e)[Symbol.toStringTag] === t.prototype[Symbol.toStringTag];
	} catch {
		return !1;
	}
}
var W = "ERR_INVALID_ARG_VALUE", G = "ERR_INVALID_ARG_TYPE";
function K(e, t, n) {
	let r = TypeError(e, { cause: n });
	return Object.assign(r, { code: t }), r;
}
var La = Symbol(), Ra = Symbol(), za = Symbol(), Ba = Symbol(), Va = Symbol(), Ha = Symbol(), Ua = new TextEncoder(), Wa = new TextDecoder();
function q(e) {
	return typeof e == "string" ? Ua.encode(e) : Wa.decode(e);
}
var Ga;
if (Uint8Array.prototype.toBase64) Ga = (e) => (e instanceof ArrayBuffer && (e = new Uint8Array(e)), e.toBase64({
	alphabet: "base64url",
	omitPadding: !0
}));
else {
	let e = 32768;
	Ga = (t) => {
		t instanceof ArrayBuffer && (t = new Uint8Array(t));
		let n = [];
		for (let r = 0; r < t.byteLength; r += e) n.push(String.fromCharCode.apply(null, t.subarray(r, r + e)));
		return btoa(n.join("")).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
	};
}
var Ka = Uint8Array.fromBase64 ? (e) => {
	try {
		return Uint8Array.fromBase64(e, { alphabet: "base64url" });
	} catch (e) {
		throw K("The input to be decoded is not correctly encoded.", W, e);
	}
} : (e) => {
	try {
		let t = atob(e.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "")), n = new Uint8Array(t.length);
		for (let e = 0; e < t.length; e++) n[e] = t.charCodeAt(e);
		return n;
	} catch (e) {
		throw K("The input to be decoded is not correctly encoded.", W, e);
	}
};
function J(e) {
	return typeof e == "string" ? Ka(e) : Ga(e);
}
var Y = class extends Error {
	code;
	constructor(e, t) {
		super(e, t), this.name = this.constructor.name, this.code = Ts, Error.captureStackTrace?.(this, this.constructor);
	}
}, qa = class extends Error {
	code;
	constructor(e, t) {
		super(e, t), this.name = this.constructor.name, t?.code && (this.code = t?.code), Error.captureStackTrace?.(this, this.constructor);
	}
};
function X(e, t, n) {
	return new qa(e, {
		code: t,
		cause: n
	});
}
function Ja(e, t) {
	if (!(e instanceof CryptoKey)) throw K(`${t} must be a CryptoKey`, G);
}
function Ya(e, t) {
	if (Ja(e, t), e.type !== "private") throw K(`${t} must be a private CryptoKey`, W);
}
function Xa(e) {
	return !(typeof e != "object" || !e || Array.isArray(e));
}
function Za(e) {
	Ia(e, Headers) && (e = Object.fromEntries(e.entries()));
	let t = new Headers(e ?? {});
	if (Fa && !t.has("user-agent") && t.set("user-agent", Fa), t.has("authorization")) throw K("\"options.headers\" must not include the \"authorization\" header name", W);
	return t;
}
function Qa(e, t) {
	if (t !== void 0) {
		if (typeof t == "function" && (t = t(e.href)), !(t instanceof AbortSignal)) throw K("\"options.signal\" must return or be an instance of AbortSignal", G);
		return t;
	}
}
function $a(e) {
	return e.includes("//") ? e.replace("//", "/") : e;
}
function eo(e, t, n = !1) {
	return e.pathname === "/" ? e.pathname = t : e.pathname = $a(`${t}/${n ? e.pathname : e.pathname.replace(/(\/)$/, "")}`), e;
}
function to(e, t) {
	return e.pathname = $a(`${e.pathname}/${t}`), e;
}
async function no(e, t, n, r) {
	if (!(e instanceof URL)) throw K(`"${t}" must be an instance of URL`, G);
	Mo(e, r?.[La] !== !0);
	let i = n(new URL(e.href)), a = Za(r?.headers);
	return a.set("accept", "application/json"), (r?.[Ba] || fetch)(i.href, {
		body: void 0,
		headers: Object.fromEntries(a.entries()),
		method: "GET",
		redirect: "manual",
		signal: Qa(i, r?.signal)
	});
}
async function ro(e, t) {
	return no(e, "issuerIdentifier", (e) => {
		switch (t?.algorithm) {
			case void 0:
			case "oidc":
				to(e, ".well-known/openid-configuration");
				break;
			case "oauth2":
				eo(e, ".well-known/oauth-authorization-server");
				break;
			default: throw K("\"options.algorithm\" must be \"oidc\" (default), or \"oauth2\"", W);
		}
		return e;
	}, t);
}
function io(e, t, n, r, i) {
	try {
		if (typeof e != "number" || !Number.isFinite(e)) throw K(`${n} must be a number`, G, i);
		if (e > 0) return;
		if (t) {
			if (e !== 0) throw K(`${n} must be a non-negative number`, W, i);
			return;
		}
		throw K(`${n} must be a positive number`, W, i);
	} catch (e) {
		throw r ? X(e.message, r, i) : e;
	}
}
function Z(e, t, n, r) {
	try {
		if (typeof e != "string") throw K(`${t} must be a string`, G, r);
		if (e.length === 0) throw K(`${t} must not be empty`, W, r);
	} catch (e) {
		throw n ? X(e.message, n, r) : e;
	}
}
async function ao(e, t) {
	let n = e;
	if (!(n instanceof URL) && n !== Ys) throw K("\"expectedIssuerIdentifier\" must be an instance of URL", G);
	if (!Ia(t, Response)) throw K("\"response\" must be an instance of Response", G);
	if (t.status !== 200) throw X("\"response\" is not a conform Authorization Server Metadata response (unexpected HTTP status code)", As, t);
	Rs(t);
	let r = await Js(t);
	if (Z(r.issuer, "\"response\" body \"issuer\" property", Q, { body: r }), n !== Ys && new URL(r.issuer).href !== n.href) throw X("\"response\" body \"issuer\" property does not match the expected value", Fs, {
		expected: n.href,
		body: r,
		attribute: "issuer"
	});
	return r;
}
function oo(e) {
	co(e, "application/json");
}
function so(e, ...t) {
	let n = "\"response\" content-type must be ";
	if (t.length > 2) {
		let e = t.pop();
		n += `${t.join(", ")}, or ${e}`;
	} else t.length === 2 ? n += `${t[0]} or ${t[1]}` : n += t[0];
	return X(n, ks, e);
}
function co(e, t) {
	if ($o(e) !== t) throw so(e, t);
}
function lo() {
	return J(crypto.getRandomValues(new Uint8Array(32)));
}
function uo() {
	return lo();
}
function fo() {
	return lo();
}
function po() {
	return lo();
}
async function mo(e) {
	return Z(e, "codeVerifier"), J(await crypto.subtle.digest("SHA-256", q(e)));
}
function ho(e) {
	return e instanceof CryptoKey ? { key: e } : e?.key instanceof CryptoKey ? (e.kid !== void 0 && Z(e.kid, "\"kid\""), {
		key: e.key,
		kid: e.kid
	}) : {};
}
function go(e) {
	switch (e.algorithm.hash.name) {
		case "SHA-256": return "PS256";
		case "SHA-384": return "PS384";
		case "SHA-512": return "PS512";
		default: throw new Y("unsupported RsaHashedKeyAlgorithm hash name", { cause: e });
	}
}
function _o(e) {
	switch (e.algorithm.hash.name) {
		case "SHA-256": return "RS256";
		case "SHA-384": return "RS384";
		case "SHA-512": return "RS512";
		default: throw new Y("unsupported RsaHashedKeyAlgorithm hash name", { cause: e });
	}
}
function vo(e) {
	switch (e.algorithm.namedCurve) {
		case "P-256": return "ES256";
		case "P-384": return "ES384";
		case "P-521": return "ES512";
		default: throw new Y("unsupported EcKeyAlgorithm namedCurve", { cause: e });
	}
}
function yo(e) {
	switch (e.algorithm.name) {
		case "RSA-PSS": return go(e);
		case "RSASSA-PKCS1-v1_5": return _o(e);
		case "ECDSA": return vo(e);
		case "Ed25519":
		case "ML-DSA-44":
		case "ML-DSA-65":
		case "ML-DSA-87": return e.algorithm.name;
		case "EdDSA": return "Ed25519";
		default: throw new Y("unsupported CryptoKey algorithm name", { cause: e });
	}
}
function bo(e) {
	let t = e?.[Ra];
	return typeof t == "number" && Number.isFinite(t) ? t : 0;
}
function xo(e) {
	let t = e?.[za];
	return typeof t == "number" && Number.isFinite(t) && Math.sign(t) !== -1 ? t : 30;
}
function So() {
	return Math.floor(Date.now() / 1e3);
}
function Co(e) {
	if (typeof e != "object" || !e) throw K("\"as\" must be an object", G);
	Z(e.issuer, "\"as.issuer\"");
}
function wo(e) {
	if (typeof e != "object" || !e) throw K("\"client\" must be an object", G);
	Z(e.client_id, "\"client.client_id\"");
}
function To(e) {
	return Z(e, "\"clientSecret\""), (t, n, r, i) => {
		r.set("client_id", n.client_id), r.set("client_secret", e);
	};
}
function Eo(e, t) {
	let n = So() + bo(t);
	return {
		jti: lo(),
		aud: e.issuer,
		exp: n + 60,
		iat: n,
		nbf: n,
		iss: t.client_id,
		sub: t.client_id
	};
}
function Do(e, t) {
	let { key: n, kid: r } = ho(e);
	return Ya(n, "\"clientPrivateKey.key\""), async (e, i, a, o) => {
		let s = {
			alg: yo(n),
			kid: r
		}, c = Eo(e, i);
		t?.[Va]?.(s, c), a.set("client_id", i.client_id), a.set("client_assertion_type", "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"), a.set("client_assertion", await Ao(s, c, n));
	};
}
function Oo(e, t) {
	Z(e, "\"clientSecret\"");
	let n = t?.[Va], r;
	return async (t, i, a, o) => {
		r ||= await crypto.subtle.importKey("raw", q(e), {
			hash: "SHA-256",
			name: "HMAC"
		}, !1, ["sign"]);
		let s = { alg: "HS256" }, c = Eo(t, i);
		n?.(s, c);
		let l = `${J(q(JSON.stringify(s)))}.${J(q(JSON.stringify(c)))}`, u = await crypto.subtle.sign(r.algorithm, r, q(l));
		a.set("client_id", i.client_id), a.set("client_assertion_type", "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"), a.set("client_assertion", `${l}.${J(new Uint8Array(u))}`);
	};
}
function ko() {
	return (e, t, n, r) => {
		n.set("client_id", t.client_id);
	};
}
async function Ao(e, t, n) {
	if (!n.usages.includes("sign")) throw K("CryptoKey instances used for signing assertions must include \"sign\" in their \"usages\"", W);
	let r = `${J(q(JSON.stringify(e)))}.${J(q(JSON.stringify(t)))}`;
	return `${r}.${J(await crypto.subtle.sign(Vs(n), n, q(r)))}`;
}
var jo = URL.parse ? (e, t) => URL.parse(e, t) : (e, t) => {
	try {
		return new URL(e, t);
	} catch {
		return null;
	}
};
function Mo(e, t) {
	if (t && e.protocol !== "https:") throw X("only requests to HTTPS are allowed", js, e);
	if (e.protocol !== "https:" && e.protocol !== "http:") throw X("only HTTP and HTTPS requests are allowed", Ms, e);
}
function No(e, t, n, r) {
	let i;
	if (typeof e != "string" || !(i = jo(e))) throw X(`authorization server metadata does not contain a valid ${n ? `"as.mtls_endpoint_aliases.${t}"` : `"as.${t}"`}`, e === void 0 ? Is : Ls, { attribute: n ? `mtls_endpoint_aliases.${t}` : t });
	return Mo(i, r), i;
}
function Po(e, t, n, r) {
	return n && e.mtls_endpoint_aliases && t in e.mtls_endpoint_aliases ? No(e.mtls_endpoint_aliases[t], t, n, r) : No(e[t], t, n, r);
}
var Fo = class extends Error {
	cause;
	code;
	error;
	status;
	error_description;
	response;
	constructor(e, t) {
		super(e, t), this.name = this.constructor.name, this.code = ws, this.cause = t.cause, this.error = t.cause.error, this.status = t.response.status, this.error_description = t.cause.error_description, Object.defineProperty(this, "response", {
			enumerable: !1,
			value: t.response
		}), Error.captureStackTrace?.(this, this.constructor);
	}
}, Io = class extends Error {
	cause;
	code;
	error;
	error_description;
	constructor(e, t) {
		super(e, t), this.name = this.constructor.name, this.code = Es, this.cause = t.cause, this.error = t.cause.get("error"), this.error_description = t.cause.get("error_description") ?? void 0, Error.captureStackTrace?.(this, this.constructor);
	}
}, Lo = class extends Error {
	cause;
	code;
	response;
	status;
	constructor(e, t) {
		super(e, t), this.name = this.constructor.name, this.code = Cs, this.cause = t.cause, this.status = t.response.status, this.response = t.response, Object.defineProperty(this, "response", { enumerable: !1 }), Error.captureStackTrace?.(this, this.constructor);
	}
}, Ro = "[a-zA-Z0-9!#$%&\\'\\*\\+\\-\\.\\^_`\\|~]+", zo = "[a-zA-Z0-9\\-\\._\\~\\+\\/]+={0,2}", Bo = "(" + Ro + ")\\s*=\\s*\"((?:[^\"\\\\]|\\\\[\\s\\S])*)\"", Vo = "(" + Ro + ")\\s*=\\s*([a-zA-Z0-9!#$%&\\'\\*\\+\\-\\.\\^_`\\|~]+)", Ho = RegExp("^[,\\s]*(" + Ro + ")"), Uo = RegExp("^[,\\s]*" + Bo + "[,\\s]*(.*)"), Wo = RegExp("^[,\\s]*" + Vo + "[,\\s]*(.*)"), Go = RegExp("^(" + zo + ")(?:$|[,\\s])(.*)");
function Ko(e) {
	if (!Ia(e, Response)) throw K("\"response\" must be an instance of Response", G);
	let t = e.headers.get("www-authenticate");
	if (t === null) return;
	let n = [], r = t;
	for (; r;) {
		let e = r.match(Ho), t = e?.["1"].toLowerCase();
		if (!t) return;
		let i = r.substring(e[0].length);
		if (i && !i.match(/^[\s,]/)) return;
		let a = i.match(/^\s+(.*)$/), o = !!a;
		r = a ? a[1] : void 0;
		let s = {}, c;
		if (o) for (; r;) {
			let t, n;
			if (e = r.match(Uo)) {
				if ([, t, n, r] = e, n.includes("\\")) try {
					n = JSON.parse(`"${n}"`);
				} catch {}
				s[t.toLowerCase()] = n;
				continue;
			}
			if (e = r.match(Wo)) {
				[, t, n, r] = e, s[t.toLowerCase()] = n;
				continue;
			}
			if (e = r.match(Go)) {
				if (Object.keys(s).length) break;
				[, c, r] = e;
				break;
			}
			return;
		}
		else r = i || void 0;
		let l = {
			scheme: t,
			parameters: s
		};
		c && (l.token68 = c), n.push(l);
	}
	if (n.length) return n;
}
async function qo(e) {
	if (e.status > 399 && e.status < 500) {
		Rs(e), oo(e);
		try {
			let t = await e.clone().json();
			if (Xa(t) && typeof t.error == "string" && t.error.length) return t;
		} catch {}
	}
}
async function Jo(e, t, n) {
	if (e.status !== t) {
		ss(e);
		let t;
		throw (t = await qo(e)) ? (await e.body?.cancel(), new Fo("server responded with an error in the response body", {
			cause: t,
			response: e
		})) : X(`"response" is not a conform ${n} response (unexpected HTTP status code)`, As, e);
	}
}
function Yo(e) {
	if (!fs.has(e)) throw K("\"options.DPoP\" is not a valid DPoPHandle", W);
}
async function Xo(e, t, n, r, i, a) {
	if (Z(e, "\"accessToken\""), !(n instanceof URL)) throw K("\"url\" must be an instance of URL", G);
	Mo(n, a?.[La] !== !0), r = Za(r), a?.DPoP && (Yo(a.DPoP), await a.DPoP.addProof(n, r, t.toUpperCase(), e)), r.set("authorization", `${r.has("dpop") ? "DPoP" : "Bearer"} ${e}`);
	let o = await (a?.[Ba] || fetch)(n.href, {
		duplex: Ia(i, ReadableStream) ? "half" : void 0,
		body: i,
		headers: Object.fromEntries(r.entries()),
		method: t,
		redirect: "manual",
		signal: Qa(n, a?.signal)
	});
	return a?.DPoP?.cacheNonce(o, n), o;
}
async function Zo(e, t, n, r) {
	Co(e), wo(t);
	let i = Po(e, "userinfo_endpoint", t.use_mtls_endpoint_aliases, r?.[La] !== !0), a = Za(r?.headers);
	return t.userinfo_signed_response_alg ? a.set("accept", "application/jwt") : (a.set("accept", "application/json"), a.append("accept", "application/jwt")), Xo(n, "GET", i, a, null, {
		...r,
		[Ra]: bo(t)
	});
}
var Qo = Symbol();
function $o(e) {
	return e.headers.get("content-type")?.split(";")[0];
}
async function es(e, t, n, r, i) {
	if (Co(e), wo(t), !Ia(r, Response)) throw K("\"response\" must be an instance of Response", G);
	if (ss(r), r.status !== 200) throw X("\"response\" is not a conform UserInfo Endpoint response (unexpected HTTP status code)", As, r);
	Rs(r);
	let a;
	if ($o(r) === "application/jwt") {
		let { claims: n, jwt: o } = await Hs(await r.text(), Us.bind(void 0, t.userinfo_signed_response_alg, e.userinfo_signing_alg_values_supported, void 0), bo(t), xo(t), i?.[Ha]).then(cs.bind(void 0, t.client_id)).then(us.bind(void 0, e));
		is.set(r, o), a = n;
	} else {
		if (t.userinfo_signed_response_alg) throw X("JWT UserInfo Response expected", Ds, r);
		a = await Js(r);
	}
	switch (Z(a.sub, "\"response\" body \"sub\" property", Q, { body: a }), n) {
		case Qo: break;
		default: if (Z(n, "\"expectedSubject\""), a.sub !== n) throw X("unexpected \"response\" body \"sub\" property value", Fs, {
			expected: n,
			body: a,
			attribute: "sub"
		});
	}
	return a;
}
async function ts(e, t, n, r, i, a, o) {
	return await n(e, t, i, a), a.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"), (o?.[Ba] || fetch)(r.href, {
		body: i,
		headers: Object.fromEntries(a.entries()),
		method: "POST",
		redirect: "manual",
		signal: Qa(r, o?.signal)
	});
}
async function ns(e, t, n, r, i, a) {
	let o = Po(e, "token_endpoint", t.use_mtls_endpoint_aliases, a?.[La] !== !0);
	i.set("grant_type", r);
	let s = Za(a?.headers);
	s.set("accept", "application/json"), a?.DPoP !== void 0 && (Yo(a.DPoP), await a.DPoP.addProof(o, s, "POST"));
	let c = await ts(e, t, n, o, i, s, a);
	return a?.DPoP?.cacheNonce(c, o), c;
}
var rs = /* @__PURE__ */ new WeakMap(), is = /* @__PURE__ */ new WeakMap();
function as(e) {
	if (!e.id_token) return;
	let t = rs.get(e);
	if (!t) throw K("\"ref\" was already garbage collected or did not resolve from the proper sources", W);
	return t;
}
async function os(e, t, n, r, i, a) {
	if (Co(e), wo(t), !Ia(n, Response)) throw K("\"response\" must be an instance of Response", G);
	await Jo(n, 200, "Token Endpoint"), Rs(n);
	let o = await Js(n);
	if (Z(o.access_token, "\"response\" body \"access_token\" property", Q, { body: o }), Z(o.token_type, "\"response\" body \"token_type\" property", Q, { body: o }), o.token_type = o.token_type.toLowerCase(), o.expires_in !== void 0) {
		let e = typeof o.expires_in == "number" ? o.expires_in : parseFloat(o.expires_in);
		io(e, !0, "\"response\" body \"expires_in\" property", Q, { body: o }), o.expires_in = e;
	}
	if (o.refresh_token !== void 0 && Z(o.refresh_token, "\"response\" body \"refresh_token\" property", Q, { body: o }), o.scope !== void 0 && typeof o.scope != "string") throw X("\"response\" body \"scope\" property must be a string", Q, { body: o });
	if (o.id_token !== void 0) {
		Z(o.id_token, "\"response\" body \"id_token\" property", Q, { body: o });
		let a = [
			"aud",
			"exp",
			"iat",
			"iss",
			"sub"
		];
		t.require_auth_time === !0 && a.push("auth_time"), t.default_max_age !== void 0 && (io(t.default_max_age, !0, "\"client.default_max_age\""), a.push("auth_time")), r?.length && a.push(...r);
		let { claims: s, jwt: c } = await Hs(o.id_token, Us.bind(void 0, t.id_token_signed_response_alg, e.id_token_signing_alg_values_supported, "RS256"), bo(t), xo(t), i).then(_s.bind(void 0, a)).then(ds.bind(void 0, e)).then(ls.bind(void 0, t.client_id));
		if (Array.isArray(s.aud) && s.aud.length !== 1) {
			if (s.azp === void 0) throw X("ID Token \"aud\" (audience) claim includes additional untrusted audiences", Ps, {
				claims: s,
				claim: "aud"
			});
			if (s.azp !== t.client_id) throw X("unexpected ID Token \"azp\" (authorized party) claim value", Ps, {
				expected: t.client_id,
				claims: s,
				claim: "azp"
			});
		}
		s.auth_time !== void 0 && io(s.auth_time, !0, "ID Token \"auth_time\" (authentication time)", Q, { claims: s }), is.set(n, c), rs.set(o, s);
	}
	if (a?.[o.token_type] !== void 0) a[o.token_type](n, o);
	else if (o.token_type !== "dpop" && o.token_type !== "bearer") throw new Y("unsupported `token_type` value", { cause: { body: o } });
	return o;
}
function ss(e) {
	let t;
	if (t = Ko(e)) throw new Lo("server responded with a challenge in the WWW-Authenticate HTTP Header", {
		cause: t,
		response: e
	});
}
function cs(e, t) {
	return t.claims.aud === void 0 ? t : ls(e, t);
}
function ls(e, t) {
	if (Array.isArray(t.claims.aud)) {
		if (!t.claims.aud.includes(e)) throw X("unexpected JWT \"aud\" (audience) claim value", Ps, {
			expected: e,
			claims: t.claims,
			claim: "aud"
		});
	} else if (t.claims.aud !== e) throw X("unexpected JWT \"aud\" (audience) claim value", Ps, {
		expected: e,
		claims: t.claims,
		claim: "aud"
	});
	return t;
}
function us(e, t) {
	return t.claims.iss === void 0 ? t : ds(e, t);
}
function ds(e, t) {
	let n = e[Xs]?.(t) ?? e.issuer;
	if (t.claims.iss !== n) throw X("unexpected JWT \"iss\" (issuer) claim value", Ps, {
		expected: n,
		claims: t.claims,
		claim: "iss"
	});
	return t;
}
var fs = /* @__PURE__ */ new WeakSet();
function ps(e) {
	return fs.add(e), e;
}
var ms = Symbol();
async function hs(e, t, n, r, i, a, o) {
	if (Co(e), wo(t), !fs.has(r)) throw K("\"callbackParameters\" must be an instance of URLSearchParams obtained from \"validateAuthResponse()\", or \"validateJwtAuthResponse()", W);
	Z(i, "\"redirectUri\"");
	let s = Ws(r, "code");
	if (!s) throw X("no authorization code in \"callbackParameters\"", Q);
	let c = new URLSearchParams(o?.additionalParameters);
	return c.set("redirect_uri", i), c.set("code", s), a !== ms && (Z(a, "\"codeVerifier\""), c.set("code_verifier", a)), ns(e, t, n, "authorization_code", c, o);
}
var gs = {
	aud: "audience",
	c_hash: "code hash",
	client_id: "client id",
	exp: "expiration time",
	iat: "issued at",
	iss: "issuer",
	jti: "jwt id",
	nonce: "nonce",
	s_hash: "state hash",
	sub: "subject",
	ath: "access token hash",
	htm: "http method",
	htu: "http uri",
	cnf: "confirmation",
	auth_time: "authentication time"
};
function _s(e, t) {
	for (let n of e) if (t.claims[n] === void 0) throw X(`JWT "${n}" (${gs[n]}) claim missing`, Q, { claims: t.claims });
	return t;
}
var vs = Symbol(), ys = Symbol();
async function bs(e, t, n, r) {
	return typeof r?.expectedNonce == "string" || typeof r?.maxAge == "number" || r?.requireIdToken ? xs(e, t, n, r.expectedNonce, r.maxAge, r[Ha], r.recognizedTokenTypes) : Ss(e, t, n, r?.[Ha], r?.recognizedTokenTypes);
}
async function xs(e, t, n, r, i, a, o) {
	let s = [];
	switch (r) {
		case void 0:
			r = vs;
			break;
		case vs: break;
		default: Z(r, "\"expectedNonce\" argument"), s.push("nonce");
	}
	switch (i ??= t.default_max_age, i) {
		case void 0:
			i = ys;
			break;
		case ys: break;
		default: io(i, !0, "\"maxAge\" argument"), s.push("auth_time");
	}
	let c = await os(e, t, n, s, a, o);
	Z(c.id_token, "\"response\" body \"id_token\" property", Q, { body: c });
	let l = as(c);
	if (i !== ys) {
		let e = So() + bo(t), n = xo(t);
		if (l.auth_time + i < e - n) throw X("too much time has elapsed since the last End-User authentication", Ns, {
			claims: l,
			now: e,
			tolerance: n,
			claim: "auth_time"
		});
	}
	if (r === vs) {
		if (l.nonce !== void 0) throw X("unexpected ID Token \"nonce\" claim value", Ps, {
			expected: void 0,
			claims: l,
			claim: "nonce"
		});
	} else if (l.nonce !== r) throw X("unexpected ID Token \"nonce\" claim value", Ps, {
		expected: r,
		claims: l,
		claim: "nonce"
	});
	return c;
}
async function Ss(e, t, n, r, i) {
	let a = await os(e, t, n, void 0, r, i), o = as(a);
	if (o) {
		if (t.default_max_age !== void 0) {
			io(t.default_max_age, !0, "\"client.default_max_age\"");
			let e = So() + bo(t), n = xo(t);
			if (o.auth_time + t.default_max_age < e - n) throw X("too much time has elapsed since the last End-User authentication", Ns, {
				claims: o,
				now: e,
				tolerance: n,
				claim: "auth_time"
			});
		}
		if (o.nonce !== void 0) throw X("unexpected ID Token \"nonce\" claim value", Ps, {
			expected: void 0,
			claims: o,
			claim: "nonce"
		});
	}
	return a;
}
var Cs = "OAUTH_WWW_AUTHENTICATE_CHALLENGE", ws = "OAUTH_RESPONSE_BODY_ERROR", Ts = "OAUTH_UNSUPPORTED_OPERATION", Es = "OAUTH_AUTHORIZATION_RESPONSE_ERROR", Ds = "OAUTH_JWT_USERINFO_EXPECTED", Os = "OAUTH_PARSE_ERROR", Q = "OAUTH_INVALID_RESPONSE", ks = "OAUTH_RESPONSE_IS_NOT_JSON", As = "OAUTH_RESPONSE_IS_NOT_CONFORM", js = "OAUTH_HTTP_REQUEST_FORBIDDEN", Ms = "OAUTH_REQUEST_PROTOCOL_FORBIDDEN", Ns = "OAUTH_JWT_TIMESTAMP_CHECK_FAILED", Ps = "OAUTH_JWT_CLAIM_COMPARISON_FAILED", Fs = "OAUTH_JSON_ATTRIBUTE_COMPARISON_FAILED", Is = "OAUTH_MISSING_SERVER_METADATA", Ls = "OAUTH_INVALID_SERVER_METADATA";
function Rs(e) {
	if (e.bodyUsed) throw K("\"response\" body has been used already", W);
}
function zs(e) {
	let { algorithm: t } = e;
	if (typeof t.modulusLength != "number" || t.modulusLength < 2048) throw new Y(`unsupported ${t.name} modulusLength`, { cause: e });
}
function Bs(e) {
	let { algorithm: t } = e;
	switch (t.namedCurve) {
		case "P-256": return "SHA-256";
		case "P-384": return "SHA-384";
		case "P-521": return "SHA-512";
		default: throw new Y("unsupported ECDSA namedCurve", { cause: e });
	}
}
function Vs(e) {
	switch (e.algorithm.name) {
		case "ECDSA": return {
			name: e.algorithm.name,
			hash: Bs(e)
		};
		case "RSA-PSS": switch (zs(e), e.algorithm.hash.name) {
			case "SHA-256":
			case "SHA-384":
			case "SHA-512": return {
				name: e.algorithm.name,
				saltLength: parseInt(e.algorithm.hash.name.slice(-3), 10) >> 3
			};
			default: throw new Y("unsupported RSA-PSS hash name", { cause: e });
		}
		case "RSASSA-PKCS1-v1_5": return zs(e), e.algorithm.name;
		case "ML-DSA-44":
		case "ML-DSA-65":
		case "ML-DSA-87":
		case "Ed25519": return e.algorithm.name;
	}
	throw new Y("unsupported CryptoKey algorithm name", { cause: e });
}
async function Hs(e, t, n, r, i) {
	let { 0: a, 1: o, length: s } = e.split(".");
	if (s === 5) if (i !== void 0) e = await i(e), {0: a, 1: o, length: s} = e.split(".");
	else throw new Y("JWE decryption is not configured", { cause: e });
	if (s !== 3) throw X("Invalid JWT", Q, e);
	let c;
	try {
		c = JSON.parse(q(J(a)));
	} catch (e) {
		throw X("failed to parse JWT Header body as base64url encoded JSON", Os, e);
	}
	if (!Xa(c)) throw X("JWT Header must be a top level object", Q, e);
	if (t(c), c.crit !== void 0) throw new Y("no JWT \"crit\" header parameter extensions are supported", { cause: { header: c } });
	let l;
	try {
		l = JSON.parse(q(J(o)));
	} catch (e) {
		throw X("failed to parse JWT Payload body as base64url encoded JSON", Os, e);
	}
	if (!Xa(l)) throw X("JWT Payload must be a top level object", Q, e);
	let u = So() + n;
	if (l.exp !== void 0) {
		if (typeof l.exp != "number") throw X("unexpected JWT \"exp\" (expiration time) claim type", Q, { claims: l });
		if (l.exp <= u - r) throw X("unexpected JWT \"exp\" (expiration time) claim value, expiration is past current timestamp", Ns, {
			claims: l,
			now: u,
			tolerance: r,
			claim: "exp"
		});
	}
	if (l.iat !== void 0 && typeof l.iat != "number") throw X("unexpected JWT \"iat\" (issued at) claim type", Q, { claims: l });
	if (l.iss !== void 0 && typeof l.iss != "string") throw X("unexpected JWT \"iss\" (issuer) claim type", Q, { claims: l });
	if (l.nbf !== void 0) {
		if (typeof l.nbf != "number") throw X("unexpected JWT \"nbf\" (not before) claim type", Q, { claims: l });
		if (l.nbf > u + r) throw X("unexpected JWT \"nbf\" (not before) claim value", Ns, {
			claims: l,
			now: u,
			tolerance: r,
			claim: "nbf"
		});
	}
	if (l.aud !== void 0 && typeof l.aud != "string" && !Array.isArray(l.aud)) throw X("unexpected JWT \"aud\" (audience) claim type", Q, { claims: l });
	return {
		header: c,
		claims: l,
		jwt: e
	};
}
function Us(e, t, n, r) {
	if (e !== void 0) {
		if (typeof e == "string" ? r.alg !== e : !e.includes(r.alg)) throw X("unexpected JWT \"alg\" header parameter", Q, {
			header: r,
			expected: e,
			reason: "client configuration"
		});
		return;
	}
	if (Array.isArray(t)) {
		if (!t.includes(r.alg)) throw X("unexpected JWT \"alg\" header parameter", Q, {
			header: r,
			expected: t,
			reason: "authorization server metadata"
		});
		return;
	}
	if (n !== void 0) {
		if (typeof n == "string" ? r.alg !== n : typeof n == "function" ? !n(r.alg) : !n.includes(r.alg)) throw X("unexpected JWT \"alg\" header parameter", Q, {
			header: r,
			expected: n,
			reason: "default value"
		});
		return;
	}
	throw X("missing client or server configuration to verify used JWT \"alg\" header parameter", void 0, {
		client: e,
		issuer: t,
		fallback: n
	});
}
function Ws(e, t) {
	let { 0: n, length: r } = e.getAll(t);
	if (r > 1) throw X(`"${t}" parameter must be provided only once`, Q);
	return n;
}
var Gs = Symbol(), Ks = Symbol();
function qs(e, t, n, r) {
	if (Co(e), wo(t), n instanceof URL && (n = n.searchParams), !(n instanceof URLSearchParams)) throw K("\"parameters\" must be an instance of URLSearchParams, or URL", G);
	if (Ws(n, "response")) throw X("\"parameters\" contains a JARM response, use validateJwtAuthResponse() instead of validateAuthResponse()", Q, { parameters: n });
	let i = Ws(n, "iss"), a = Ws(n, "state");
	if (!i && e.authorization_response_iss_parameter_supported) throw X("response parameter \"iss\" (issuer) missing", Q, { parameters: n });
	if (i && i !== e.issuer) throw X("unexpected \"iss\" (issuer) response parameter value", Q, {
		expected: e.issuer,
		parameters: n
	});
	switch (r) {
		case void 0:
		case Ks:
			if (a !== void 0) throw X("unexpected \"state\" response parameter encountered", Q, {
				expected: void 0,
				parameters: n
			});
			break;
		case Gs: break;
		default: if (Z(r, "\"expectedState\" argument"), a !== r) throw X(a === void 0 ? "response parameter \"state\" missing" : "unexpected \"state\" response parameter value", Q, {
			expected: r,
			parameters: n
		});
	}
	if (Ws(n, "error")) throw new Io("authorization response from the server is an error", { cause: n });
	let o = Ws(n, "id_token"), s = Ws(n, "token");
	if (o !== void 0 || s !== void 0) throw new Y("implicit and hybrid flows are not supported");
	return ps(new URLSearchParams(n));
}
async function Js(e, t = oo) {
	let n;
	try {
		n = await e.json();
	} catch (n) {
		throw t(e), X("failed to parse \"response\" body as JSON", Os, n);
	}
	if (!Xa(n)) throw X("\"response\" body must be a top level object", Q, { body: n });
	return n;
}
var Ys = Symbol(), Xs = Symbol(), Zs = 900;
async function Qs(e, t, n) {
	let { cookies: r, logger: i } = n, a = r[e], o = /* @__PURE__ */ new Date();
	o.setTime(o.getTime() + Zs * 1e3), i.debug(`CREATE_${e.toUpperCase()}`, {
		name: a.name,
		payload: t,
		COOKIE_TTL: Zs,
		expires: o
	});
	let s = await Ar({
		...n.jwt,
		maxAge: Zs,
		token: {
			value: t,
			provider: n.provider.id
		},
		salt: a.name
	}), c = {
		...a.options,
		expires: o
	};
	return {
		name: a.name,
		value: s,
		options: c
	};
}
async function $s(e, t, n) {
	try {
		let { logger: r, cookies: i, jwt: a } = n;
		if (r.debug(`PARSE_${e.toUpperCase()}`, { cookie: t }), !t) throw new T(`${e} cookie was missing`);
		let o = await jr({
			...a,
			token: t,
			salt: i[e].name
		});
		if (!o?.value) throw Error("Invalid cookie");
		if (o.provider !== n.provider?.id) throw Error(`${e} cookie was created for a different provider than the one handling the callback`);
		return o.value;
	} catch (t) {
		throw new T(`${e} value could not be parsed`, { cause: t });
	}
}
function ec(e, t, n) {
	let { logger: r, cookies: i } = t, a = i[e];
	r.debug(`CLEAR_${e.toUpperCase()}`, { cookie: a }), n.push({
		name: a.name,
		value: "",
		options: {
			...i[e].options,
			maxAge: 0
		}
	});
}
function tc(e, t) {
	return async function(n, r, i) {
		let { provider: a, logger: o } = i;
		if (!a?.checks?.includes(e)) return;
		let s = n?.[i.cookies[t].name];
		o.debug(`USE_${t.toUpperCase()}`, { value: s });
		let c = await $s(t, s, i);
		return ec(t, i, r), c;
	};
}
var nc = {
	async create(e) {
		let t = uo(), n = await mo(t);
		return {
			cookie: await Qs("pkceCodeVerifier", t, e),
			value: n
		};
	},
	use: tc("pkce", "pkceCodeVerifier")
}, rc = 900, ic = "encodedState", ac = {
	async create(e, t) {
		let { provider: n } = e;
		if (!n.checks.includes("state")) {
			if (t) throw new T("State data was provided but the provider is not configured to use state");
			return;
		}
		let r = {
			origin: t,
			random: fo()
		}, i = await Ar({
			secret: e.jwt.secret,
			token: r,
			salt: ic,
			maxAge: rc
		});
		return {
			cookie: await Qs("state", i, e),
			value: i
		};
	},
	use: tc("state", "state"),
	async decode(e, t) {
		try {
			t.logger.debug("DECODE_STATE", { state: e });
			let n = await jr({
				secret: t.jwt.secret,
				token: e,
				salt: ic
			});
			if (n) return n;
			throw Error("Invalid state");
		} catch (e) {
			throw new T("State could not be decoded", { cause: e });
		}
	}
}, oc = {
	async create(e) {
		if (!e.provider.checks.includes("nonce")) return;
		let t = po();
		return {
			cookie: await Qs("nonce", t, e),
			value: t
		};
	},
	use: tc("nonce", "nonce")
}, sc = 900, cc = "encodedWebauthnChallenge", lc = {
	async create(e, t, n) {
		return { cookie: await Qs("webauthnChallenge", await Ar({
			secret: e.jwt.secret,
			token: {
				challenge: t,
				registerData: n
			},
			salt: cc,
			maxAge: sc
		}), e) };
	},
	async use(e, t, n) {
		let r = t?.[e.cookies.webauthnChallenge.name], i = await $s("webauthnChallenge", r, e), a = await jr({
			secret: e.jwt.secret,
			token: i,
			salt: cc
		});
		if (ec("webauthnChallenge", e, n), !a) throw new T("WebAuthn challenge was missing");
		return a;
	}
};
//#endregion
//#region node_modules/@auth/core/lib/actions/callback/oauth/callback.js
function uc(e) {
	return encodeURIComponent(e).replace(/%20/g, "+");
}
function dc(e, t) {
	let n = uc(e), r = uc(t);
	return `Basic ${btoa(`${n}:${r}`)}`;
}
async function fc(e, t, n) {
	let { logger: r, provider: i } = n, a, { token: o, userinfo: s } = i;
	if ((!o?.url || o.url.host === "authjs.dev") && (!s?.url || s.url.host === "authjs.dev")) {
		let e = new URL(i.issuer);
		if (a = await ao(e, await ro(e, {
			[La]: !0,
			[Ba]: i[ri]
		})), !a.token_endpoint) throw TypeError("TODO: Authorization server did not provide a token endpoint.");
		if (!a.userinfo_endpoint) throw TypeError("TODO: Authorization server did not provide a userinfo endpoint.");
	} else a = {
		issuer: i.issuer ?? "https://authjs.dev",
		token_endpoint: o?.url.toString(),
		userinfo_endpoint: s?.url.toString()
	};
	let c = {
		client_id: i.clientId,
		...i.client
	}, l;
	switch (c.token_endpoint_auth_method) {
		case void 0:
		case "client_secret_basic":
			l = (e, t, n, r) => {
				r.set("authorization", dc(i.clientId, i.clientSecret));
			};
			break;
		case "client_secret_post":
			l = To(i.clientSecret);
			break;
		case "client_secret_jwt":
			l = Oo(i.clientSecret);
			break;
		case "private_key_jwt":
			l = Do(i.token.clientPrivateKey, { [Va](e, t) {
				t.aud = [a.issuer, a.token_endpoint];
			} });
			break;
		case "none":
			l = ko();
			break;
		default: throw Error("unsupported client authentication method");
	}
	let u = [], d = await ac.use(t, u, n), f;
	try {
		f = qs(a, c, new URLSearchParams(e), i.checks.includes("state") ? d : Gs);
	} catch (e) {
		if (e instanceof Io) {
			let t = {
				providerId: i.id,
				...Object.fromEntries(e.cause.entries())
			};
			throw r.debug("OAuthCallbackError", t), new k("OAuth Provider returned an error", t);
		}
		throw e;
	}
	let p = await nc.use(t, u, n), m = i.callbackUrl;
	!n.isOnRedirectProxy && i.redirectProxyUrl && (m = i.redirectProxyUrl);
	let h = await hs(a, c, l, f, m, p ?? "decoy", {
		[La]: !0,
		[Ba]: (...e) => (i.checks.includes("pkce") || e[1].body.delete("code_verifier"), (i[ri] ?? fetch)(...e))
	});
	i.token?.conform && (h = await i.token.conform(h.clone()) ?? h);
	let g = {}, _ = di(i);
	if (i[ii]) switch (i.id) {
		case "microsoft-entra-id":
		case "azure-ad": {
			let e = await h.clone().json();
			if (e.error) {
				let t = {
					providerId: i.id,
					...e
				};
				throw new k(`OAuth Provider returned an error: ${e.error}`, t);
			}
			let { tid: t } = dr(e.id_token);
			if (typeof t == "string") {
				let e = a.issuer?.match(/microsoftonline\.com\/(\w+)\/v2\.0/)?.[1] ?? "common", n = new URL(a.issuer.replace(e, t));
				a = await ao(n, await ro(n, { [Ba]: i[ri] }));
			}
			break;
		}
		default: break;
	}
	let v = await bs(a, c, h, {
		expectedNonce: await oc.use(t, u, n),
		requireIdToken: _
	}), y = v;
	if (_) {
		let t = as(v);
		if (g = t, i[ii] && i.id === "apple") try {
			g.user = JSON.parse(e?.user);
		} catch {}
		if (i.idToken === !1) {
			let e = await Zo(a, c, v.access_token, {
				[Ba]: i[ri],
				[La]: !0
			});
			g = await es(a, c, t.sub, e);
		}
	} else if (s?.request) {
		let e = await s.request({
			tokens: y,
			provider: i
		});
		e instanceof Object && (g = e);
	} else if (s?.url) g = await (await Zo(a, c, v.access_token, {
		[Ba]: i[ri],
		[La]: !0
	})).json();
	else throw TypeError("No userinfo endpoint configured");
	return y.expires_in && (y.expires_at = Math.floor(Date.now() / 1e3) + Number(y.expires_in)), {
		...await pc(g, i, y, r),
		profile: g,
		cookies: u
	};
}
async function pc(e, t, n, r) {
	try {
		let r = await t.profile(e, n);
		return {
			user: {
				...r,
				id: crypto.randomUUID(),
				email: r.email?.toLowerCase()
			},
			account: {
				...n,
				provider: t.id,
				type: t.type,
				providerAccountId: r.id ?? crypto.randomUUID()
			}
		};
	} catch (n) {
		r.debug("getProfile error details", e), r.error(new A(n, { provider: t.id }));
	}
}
//#endregion
//#region node_modules/@auth/core/lib/utils/webauthn-utils.js
function mc(e, t, n) {
	let { user: r, exists: i = !1 } = n ?? {};
	switch (e) {
		case "authenticate": return "authenticate";
		case "register":
			if (r && t === i) return "register";
			break;
		case void 0:
			if (!t) return r ? i ? "authenticate" : "register" : "authenticate";
			break;
	}
	return null;
}
async function hc(e, t, n, r) {
	let i = await bc(e, t, n), { cookie: a } = await lc.create(e, i.challenge, n);
	return {
		status: 200,
		cookies: [...r ?? [], a],
		body: {
			action: "register",
			options: i
		},
		headers: { "Content-Type": "application/json" }
	};
}
async function gc(e, t, n, r) {
	let i = await yc(e, t, n), { cookie: a } = await lc.create(e, i.challenge);
	return {
		status: 200,
		cookies: [...r ?? [], a],
		body: {
			action: "authenticate",
			options: i
		},
		headers: { "Content-Type": "application/json" }
	};
}
async function _c(e, t, n) {
	let { adapter: r, provider: i } = e, a = t.body && typeof t.body.data == "string" ? JSON.parse(t.body.data) : void 0;
	if (!a || typeof a != "object" || !("id" in a) || typeof a.id != "string") throw new h("Invalid WebAuthn Authentication response");
	let o = wc(Cc(a.id)), s = await r.getAuthenticator(o);
	if (!s) throw new h(`WebAuthn authenticator not found in database: ${JSON.stringify({ credentialID: o })}`);
	let { challenge: c } = await lc.use(e, t.cookies, n), l;
	try {
		let n = i.getRelayingParty(e, t);
		l = await i.simpleWebAuthn.verifyAuthenticationResponse({
			...i.verifyAuthenticationOptions,
			expectedChallenge: c,
			response: a,
			authenticator: Sc(s),
			expectedOrigin: n.origin,
			expectedRPID: n.id
		});
	} catch (e) {
		throw new _e(e);
	}
	let { verified: u, authenticationInfo: d } = l;
	if (!u) throw new _e("WebAuthn authentication response could not be verified");
	try {
		let { newCounter: e } = d;
		await r.updateAuthenticatorCounter(s.credentialID, e);
	} catch (e) {
		throw new _(`Failed to update authenticator counter. This may cause future authentication attempts to fail. ${JSON.stringify({
			credentialID: o,
			oldCounter: s.counter,
			newCounter: d.newCounter
		})}`, e);
	}
	let f = await r.getAccount(s.providerAccountId, i.id);
	if (!f) throw new h(`WebAuthn account not found in database: ${JSON.stringify({
		credentialID: o,
		providerAccountId: s.providerAccountId
	})}`);
	let p = await r.getUser(f.userId);
	if (!p) throw new h(`WebAuthn user not found in database: ${JSON.stringify({
		credentialID: o,
		providerAccountId: s.providerAccountId,
		userID: f.userId
	})}`);
	return {
		account: f,
		user: p
	};
}
async function vc(e, t, n) {
	let { provider: r } = e, i = t.body && typeof t.body.data == "string" ? JSON.parse(t.body.data) : void 0;
	if (!i || typeof i != "object" || !("id" in i) || typeof i.id != "string") throw new h("Invalid WebAuthn Registration response");
	let { challenge: a, registerData: o } = await lc.use(e, t.cookies, n);
	if (!o) throw new h("Missing user registration data in WebAuthn challenge cookie");
	let s;
	try {
		let n = r.getRelayingParty(e, t);
		s = await r.simpleWebAuthn.verifyRegistrationResponse({
			...r.verifyRegistrationOptions,
			expectedChallenge: a,
			response: i,
			expectedOrigin: n.origin,
			expectedRPID: n.id
		});
	} catch (e) {
		throw new _e(e);
	}
	if (!s.verified || !s.registrationInfo) throw new _e("WebAuthn registration response could not be verified");
	let c = {
		providerAccountId: wc(s.registrationInfo.credentialID),
		provider: e.provider.id,
		type: r.type
	};
	return {
		user: o,
		account: c,
		authenticator: {
			providerAccountId: c.providerAccountId,
			counter: s.registrationInfo.counter,
			credentialID: wc(s.registrationInfo.credentialID),
			credentialPublicKey: wc(s.registrationInfo.credentialPublicKey),
			credentialBackedUp: s.registrationInfo.credentialBackedUp,
			credentialDeviceType: s.registrationInfo.credentialDeviceType,
			transports: Tc(i.response.transports)
		}
	};
}
async function yc(e, t, n) {
	let { provider: r, adapter: i } = e, a = n && n.id ? await i.listAuthenticatorsByUserId(n.id) : null, o = r.getRelayingParty(e, t);
	return await r.simpleWebAuthn.generateAuthenticationOptions({
		...r.authenticationOptions,
		rpID: o.id,
		allowCredentials: a?.map((e) => ({
			id: Cc(e.credentialID),
			type: "public-key",
			transports: Ec(e.transports)
		}))
	});
}
async function bc(e, t, n) {
	let { provider: r, adapter: i } = e, a = n.id ? await i.listAuthenticatorsByUserId(n.id) : null, o = Yr(32), s = r.getRelayingParty(e, t);
	return await r.simpleWebAuthn.generateRegistrationOptions({
		...r.registrationOptions,
		userID: o,
		userName: n.email,
		userDisplayName: n.name ?? void 0,
		rpID: s.id,
		rpName: s.name,
		excludeCredentials: a?.map((e) => ({
			id: Cc(e.credentialID),
			type: "public-key",
			transports: Ec(e.transports)
		}))
	});
}
function xc(e) {
	let { provider: t, adapter: n } = e;
	if (!n) throw new ee("An adapter is required for the WebAuthn provider");
	if (!t || t.type !== "webauthn") throw new le("Provider must be WebAuthn");
	return {
		...e,
		provider: t,
		adapter: n
	};
}
function Sc(e) {
	return {
		...e,
		credentialDeviceType: e.credentialDeviceType,
		transports: Ec(e.transports),
		credentialID: Cc(e.credentialID),
		credentialPublicKey: Cc(e.credentialPublicKey)
	};
}
function Cc(e) {
	return new Uint8Array(Buffer.from(e, "base64"));
}
function wc(e) {
	return Buffer.from(e).toString("base64");
}
function Tc(e) {
	return e?.join(",");
}
function Ec(e) {
	return e ? e.split(",") : void 0;
}
//#endregion
//#region node_modules/@auth/core/lib/actions/callback/index.js
async function Dc(e, t, n, r) {
	if (!t.provider) throw new le("Callback route called without provider");
	let { query: i, body: a, method: o, headers: s } = e, { provider: c, adapter: l, url: u, callbackUrl: d, pages: f, jwt: p, events: m, callbacks: g, session: { strategy: _, maxAge: v }, logger: b } = t, x = _ === "jwt";
	try {
		if (c.type === "oauth" || c.type === "oidc") {
			let o = c.authorization?.url.searchParams.get("response_mode") === "form_post" ? a : i;
			if (t.isOnRedirectProxy && o?.state) {
				let e = await ac.decode(o.state, t);
				if (e?.origin && new URL(e.origin).origin !== t.url.origin) {
					let t = `${e.origin}?${new URLSearchParams(o)}`;
					return b.debug("Proxy redirecting to", t), {
						redirect: t,
						cookies: r
					};
				}
			}
			let s = await fc(o, e.cookies, t);
			s.cookies.length && r.push(...s.cookies), b.debug("authorization result", s);
			let { user: h, account: _, profile: y } = s;
			if (!h || !_ || !y) return {
				redirect: `${u}/signin`,
				cookies: r
			};
			let S;
			if (l) {
				let { getUserByAccount: e } = l;
				S = await e({
					providerAccountId: _.providerAccountId,
					provider: c.id
				});
			}
			let C = await Oc({
				user: S ?? h,
				account: _,
				profile: y
			}, t);
			if (C) return {
				redirect: C,
				cookies: r
			};
			let { user: w, session: T, isNewUser: E } = await Pa(n.value, h, _, t);
			if (x) {
				let e = {
					name: w.name,
					email: w.email,
					picture: w.image,
					sub: w.id?.toString()
				}, i = await g.jwt({
					token: e,
					user: w,
					account: _,
					profile: y,
					isNewUser: E,
					trigger: E ? "signUp" : "signIn"
				});
				if (i === null) r.push(...n.clean());
				else {
					let e = t.cookies.sessionToken.name, a = await p.encode({
						...p,
						token: i,
						salt: e
					}), o = /* @__PURE__ */ new Date();
					o.setTime(o.getTime() + v * 1e3);
					let s = n.chunk(a, { expires: o });
					r.push(...s);
				}
			} else r.push({
				name: t.cookies.sessionToken.name,
				value: T.sessionToken,
				options: {
					...t.cookies.sessionToken.options,
					expires: T.expires
				}
			});
			return await m.signIn?.({
				user: w,
				account: _,
				profile: y,
				isNewUser: E
			}), E && f.newUser ? {
				redirect: `${f.newUser}${f.newUser.includes("?") ? "&" : "?"}${new URLSearchParams({ callbackUrl: d })}`,
				cookies: r
			} : {
				redirect: d,
				cookies: r
			};
		} else if (c.type === "email") {
			let e = i?.token, a = i?.email;
			if (!e) {
				let t = TypeError("Missing token. The sign-in URL was manually opened without token or the link was not sent correctly in the email.", { cause: { hasToken: !!e } });
				throw t.name = "Configuration", t;
			}
			let o = c.secret ?? t.secret, s = await l.useVerificationToken({
				identifier: a,
				token: await Jr(`${e}${o}`)
			}), u = !!s, h = u && s.expires.valueOf() < Date.now();
			if (!u || h || a && s.identifier !== a) throw new de({
				hasInvite: u,
				expired: h
			});
			let { identifier: _ } = s, y = await l.getUserByEmail(_) ?? {
				id: crypto.randomUUID(),
				email: _,
				emailVerified: null
			}, b = {
				providerAccountId: y.email,
				userId: y.id,
				type: "email",
				provider: c.id
			}, S = await Oc({
				user: y,
				account: b
			}, t);
			if (S) return {
				redirect: S,
				cookies: r
			};
			let { user: C, session: w, isNewUser: T } = await Pa(n.value, y, b, t);
			if (x) {
				let e = {
					name: C.name,
					email: C.email,
					picture: C.image,
					sub: C.id?.toString()
				}, i = await g.jwt({
					token: e,
					user: C,
					account: b,
					isNewUser: T,
					trigger: T ? "signUp" : "signIn"
				});
				if (i === null) r.push(...n.clean());
				else {
					let e = t.cookies.sessionToken.name, a = await p.encode({
						...p,
						token: i,
						salt: e
					}), o = /* @__PURE__ */ new Date();
					o.setTime(o.getTime() + v * 1e3);
					let s = n.chunk(a, { expires: o });
					r.push(...s);
				}
			} else r.push({
				name: t.cookies.sessionToken.name,
				value: w.sessionToken,
				options: {
					...t.cookies.sessionToken.options,
					expires: w.expires
				}
			});
			return await m.signIn?.({
				user: C,
				account: b,
				isNewUser: T
			}), T && f.newUser ? {
				redirect: `${f.newUser}${f.newUser.includes("?") ? "&" : "?"}${new URLSearchParams({ callbackUrl: d })}`,
				cookies: r
			} : {
				redirect: d,
				cookies: r
			};
		} else if (c.type === "credentials" && o === "POST") {
			let e = a ?? {};
			Object.entries(i ?? {}).forEach(([e, t]) => u.searchParams.set(e, t));
			let l = await c.authorize(e, new Request(u, {
				headers: s,
				method: o,
				body: JSON.stringify(a)
			}));
			if (l) l.id = l.id?.toString() ?? crypto.randomUUID();
			else throw new C();
			let f = {
				providerAccountId: l.id,
				type: "credentials",
				provider: c.id
			}, h = await Oc({
				user: l,
				account: f,
				credentials: e
			}, t);
			if (h) return {
				redirect: h,
				cookies: r
			};
			let _ = {
				name: l.name,
				email: l.email,
				picture: l.image,
				sub: l.id
			}, y = await g.jwt({
				token: _,
				user: l,
				account: f,
				isNewUser: !1,
				trigger: "signIn"
			});
			if (y === null) r.push(...n.clean());
			else {
				let e = t.cookies.sessionToken.name, i = await p.encode({
					...p,
					token: y,
					salt: e
				}), a = /* @__PURE__ */ new Date();
				a.setTime(a.getTime() + v * 1e3);
				let o = n.chunk(i, { expires: a });
				r.push(...o);
			}
			return await m.signIn?.({
				user: l,
				account: f
			}), {
				redirect: d,
				cookies: r
			};
		} else if (c.type === "webauthn" && o === "POST") {
			let i = e.body?.action;
			if (typeof i != "string" || i !== "authenticate" && i !== "register") throw new h("Invalid action parameter");
			let a = xc(t), o, s, c;
			switch (i) {
				case "authenticate": {
					let t = await _c(a, e, r);
					o = t.user, s = t.account;
					break;
				}
				case "register": {
					let n = await vc(t, e, r);
					o = n.user, s = n.account, c = n.authenticator;
					break;
				}
			}
			await Oc({
				user: o,
				account: s
			}, t);
			let { user: l, isNewUser: u, session: _, account: y } = await Pa(n.value, o, s, t);
			if (!y) throw new h("Error creating or finding account");
			if (c && l.id && await a.adapter.createAuthenticator({
				...c,
				userId: l.id
			}), x) {
				let e = {
					name: l.name,
					email: l.email,
					picture: l.image,
					sub: l.id?.toString()
				}, i = await g.jwt({
					token: e,
					user: l,
					account: y,
					isNewUser: u,
					trigger: u ? "signUp" : "signIn"
				});
				if (i === null) r.push(...n.clean());
				else {
					let e = t.cookies.sessionToken.name, a = await p.encode({
						...p,
						token: i,
						salt: e
					}), o = /* @__PURE__ */ new Date();
					o.setTime(o.getTime() + v * 1e3);
					let s = n.chunk(a, { expires: o });
					r.push(...s);
				}
			} else r.push({
				name: t.cookies.sessionToken.name,
				value: _.sessionToken,
				options: {
					...t.cookies.sessionToken.options,
					expires: _.expires
				}
			});
			return await m.signIn?.({
				user: l,
				account: y,
				isNewUser: u
			}), u && f.newUser ? {
				redirect: `${f.newUser}${f.newUser.includes("?") ? "&" : "?"}${new URLSearchParams({ callbackUrl: d })}`,
				cookies: r
			} : {
				redirect: d,
				cookies: r
			};
		}
		throw new le(`Callback for provider type (${c.type}) is not supported`);
	} catch (e) {
		if (e instanceof h) throw e;
		let t = new y(e, { provider: c.id });
		throw b.debug("callback route error details", {
			method: o,
			query: i,
			body: a
		}), t;
	}
}
async function Oc(e, t) {
	let n, { signIn: r, redirect: i } = t.callbacks;
	try {
		n = await r(e);
	} catch (e) {
		throw e instanceof h ? e : new v(e);
	}
	if (!n) throw new v("AccessDenied");
	if (typeof n == "string") return await i({
		url: n,
		baseUrl: t.url.origin
	});
}
//#endregion
//#region node_modules/@auth/core/lib/actions/session.js
async function kc(e, t, n, r, i) {
	let { adapter: a, jwt: o, events: s, callbacks: c, logger: l, session: { strategy: u, maxAge: d } } = e, f = {
		body: null,
		headers: {
			"Content-Type": "application/json",
			...!r && {
				"Cache-Control": "private, no-cache, no-store",
				Expires: "0",
				Pragma: "no-cache"
			}
		},
		cookies: n
	}, p = t.value;
	if (!p) return f;
	if (u === "jwt") {
		try {
			let n = e.cookies.sessionToken.name, a = await o.decode({
				...o,
				token: p,
				salt: n
			});
			if (!a) throw Error("Invalid JWT");
			let l = await c.jwt({
				token: a,
				...r && { trigger: "update" },
				session: i
			}), u = Na(d);
			if (l !== null) {
				let e = {
					user: {
						name: l.name,
						email: l.email,
						image: l.picture
					},
					expires: u.toISOString()
				}, r = await c.session({
					session: e,
					token: l
				});
				f.body = r;
				let i = await o.encode({
					...o,
					token: l,
					salt: n
				}), a = t.chunk(i, { expires: u });
				f.cookies?.push(...a), await s.session?.({
					session: r,
					token: l
				});
			} else f.cookies?.push(...t.clean());
		} catch (e) {
			l.error(new E(e)), f.cookies?.push(...t.clean());
		}
		return f;
	}
	try {
		let { getSessionAndUser: n, deleteSession: o, updateSession: l } = a, u = await n(p);
		if (u && u.session.expires.valueOf() < Date.now() && (await o(p), u = null), u) {
			let { user: t, session: n } = u, a = e.session.updateAge, o = n.expires.valueOf() - d * 1e3 + a * 1e3, m = Na(d);
			o <= Date.now() && await l({
				sessionToken: p,
				expires: m
			});
			let h = await c.session({
				session: {
					...n,
					user: t
				},
				user: t,
				newSession: i,
				...r ? { trigger: "update" } : {}
			});
			f.body = h, f.cookies?.push({
				name: e.cookies.sessionToken.name,
				value: p,
				options: {
					...e.cookies.sessionToken.options,
					expires: m
				}
			}), await s.session?.({ session: h });
		} else p && f.cookies?.push(...t.clean());
	} catch (e) {
		l.error(new re(e));
	}
	return f;
}
//#endregion
//#region node_modules/@auth/core/lib/actions/signin/authorization-url.js
async function Ac(e, t) {
	let { logger: n, provider: r } = t, i = r.authorization?.url;
	if (!i || i.host === "authjs.dev") {
		let e = new URL(r.issuer), t = await ao(e, await ro(e, {
			[Ba]: r[ri],
			[La]: !0
		})).catch((t) => {
			throw !(t instanceof TypeError) || t.message !== "Invalid URL" ? t : TypeError(`Discovery request responded with an invalid issuer. expected: ${e}`);
		});
		if (!t.authorization_endpoint) throw TypeError("Authorization server did not provide an authorization endpoint.");
		i = new URL(t.authorization_endpoint);
	}
	let a = i.searchParams, o = r.callbackUrl, s;
	!t.isOnRedirectProxy && r.redirectProxyUrl && (o = r.redirectProxyUrl, s = r.callbackUrl, n.debug("using redirect proxy", {
		redirect_uri: o,
		data: s
	}));
	let c = Object.assign({
		response_type: "code",
		client_id: r.clientId,
		redirect_uri: o,
		...r.authorization?.params
	}, Object.fromEntries(r.authorization?.url.searchParams ?? []), e);
	for (let e in c) a.set(e, c[e]);
	let l = [];
	r.authorization?.url.searchParams.get("response_mode") === "form_post" && (t.cookies.state.options.sameSite = "none", t.cookies.state.options.secure = !0, t.cookies.nonce.options.sameSite = "none", t.cookies.nonce.options.secure = !0);
	let u = await ac.create(t, s);
	if (u && (a.set("state", u.value), l.push(u.cookie)), r.checks?.includes("pkce")) {
		let { value: e, cookie: n } = await nc.create(t);
		a.set("code_challenge", e), a.set("code_challenge_method", "S256"), l.push(n);
	}
	let d = await oc.create(t);
	return d && (a.set("nonce", d.value), l.push(d.cookie)), r.type === "oidc" && !i.searchParams.has("scope") && i.searchParams.set("scope", "openid profile email"), n.debug("authorization url is ready", {
		url: i,
		cookies: l,
		provider: r
	}), {
		redirect: i.toString(),
		cookies: l
	};
}
//#endregion
//#region node_modules/@auth/core/lib/actions/signin/send-token.js
async function jc(e, t) {
	let { body: n } = e, { provider: r, callbacks: i, adapter: a } = t, o = (r.normalizeIdentifier ?? Mc)(n?.email), s = {
		id: crypto.randomUUID(),
		email: o,
		emailVerified: null
	}, c = await a.getUserByEmail(o) ?? s, l = {
		providerAccountId: o,
		userId: c.id,
		type: "email",
		provider: r.id
	}, u;
	try {
		u = await i.signIn({
			user: c,
			account: l,
			email: { verificationRequest: !0 }
		});
	} catch (e) {
		throw new v(e);
	}
	if (!u) throw new v("AccessDenied");
	if (typeof u == "string") return { redirect: await i.redirect({
		url: u,
		baseUrl: t.url.origin
	}) };
	let { callbackUrl: d, theme: f } = t, p = await r.generateVerificationToken?.() ?? Yr(32), m = new Date(Date.now() + (r.maxAge ?? 86400) * 1e3), h = r.secret ?? t.secret, g = new URL(t.basePath, t.url.origin), _ = r.sendVerificationRequest({
		identifier: o,
		token: p,
		expires: m,
		url: `${g}/callback/${r.id}?${new URLSearchParams({
			callbackUrl: d,
			token: p,
			email: o
		})}`,
		provider: r,
		theme: f,
		request: Kr(e)
	}), y = a.createVerificationToken?.({
		identifier: o,
		token: await Jr(`${p}${h}`),
		expires: m
	});
	return await Promise.all([_, y]), { redirect: `${g}/verify-request?${new URLSearchParams({
		provider: r.id,
		type: r.type
	})}` };
}
function Mc(e) {
	if (!e) throw Error("Missing email from request body.");
	let t = e.normalize("NFKC").toLowerCase().trim();
	if (t.includes("\"")) throw Error("Invalid email address format.");
	let [n, r] = t.split("@");
	if (!n || !r || t.split("@").length !== 2 || (r = r.split(",")[0], !r)) throw Error("Invalid email address format.");
	return `${n}@${r}`;
}
//#endregion
//#region node_modules/@auth/core/lib/actions/signin/index.js
async function Nc(e, t, n) {
	let r = `${n.url.origin}${n.basePath}/signin`;
	if (!n.provider) return {
		redirect: r,
		cookies: t
	};
	switch (n.provider.type) {
		case "oauth":
		case "oidc": {
			let { redirect: r, cookies: i } = await Ac(e.query, n);
			return i && t.push(...i), {
				redirect: r,
				cookies: t
			};
		}
		case "email": return {
			...await jc(e, n),
			cookies: t
		};
		default: return {
			redirect: r,
			cookies: t
		};
	}
}
//#endregion
//#region node_modules/@auth/core/lib/actions/signout.js
async function Pc(e, t, n) {
	let { jwt: r, events: i, callbackUrl: a, logger: o, session: s } = n, c = t.value;
	if (!c) return {
		redirect: a,
		cookies: e
	};
	try {
		if (s.strategy === "jwt") {
			let e = n.cookies.sessionToken.name, t = await r.decode({
				...r,
				token: c,
				salt: e
			});
			await i.signOut?.({ token: t });
		} else {
			let e = await n.adapter?.deleteSession(c);
			await i.signOut?.({ session: e });
		}
	} catch (e) {
		o.error(new oe(e));
	}
	return e.push(...t.clean()), {
		redirect: a,
		cookies: e
	};
}
//#endregion
//#region node_modules/@auth/core/lib/utils/session.js
async function Fc(e, t) {
	let { adapter: n, jwt: r, session: { strategy: i } } = e, a = t.value;
	if (!a) return null;
	if (i === "jwt") {
		let t = e.cookies.sessionToken.name, n = await r.decode({
			...r,
			token: a,
			salt: t
		});
		if (n && n.sub) return {
			id: n.sub,
			name: n.name,
			email: n.email,
			image: n.picture
		};
	} else {
		let e = await n?.getSessionAndUser(a);
		if (e) return e.user;
	}
	return null;
}
//#endregion
//#region node_modules/@auth/core/lib/actions/webauthn-options.js
async function Ic(e, t, n, r) {
	let i = xc(t), { provider: a } = i, { action: o } = e.query ?? {};
	if (o !== "register" && o !== "authenticate" && o !== void 0) return {
		status: 400,
		body: { error: "Invalid action" },
		cookies: r,
		headers: { "Content-Type": "application/json" }
	};
	let s = await Fc(t, n), c = s ? {
		user: s,
		exists: !0
	} : await a.getUserInfo(t, e), l = c?.user;
	switch (mc(o, !!s, c)) {
		case "authenticate": return gc(i, e, l, r);
		case "register":
			if (typeof l?.email == "string") return hc(i, e, l, r);
			break;
		default: return {
			status: 400,
			body: { error: "Invalid request" },
			cookies: r,
			headers: { "Content-Type": "application/json" }
		};
	}
}
//#endregion
//#region node_modules/@auth/core/lib/index.js
async function Lc(e, t) {
	let { action: n, providerId: r, error: i, method: a } = e, o = t.skipCSRFCheck === ti, { options: s, cookies: c } = await pi({
		authOptions: t,
		action: n,
		providerId: r,
		url: e.url,
		callbackUrl: e.body?.callbackUrl ?? e.query?.callbackUrl,
		csrfToken: e.body?.csrfToken,
		cookies: e.cookies,
		isPost: a === "POST",
		csrfDisabled: o
	}), l = new m(s.cookies.sessionToken, e.cookies, s.logger);
	if (a === "GET") {
		let t = Ma({
			...s,
			query: e.query,
			cookies: c
		});
		switch (n) {
			case "callback": return await Dc(e, s, l, c);
			case "csrf": return t.csrf(o, s, c);
			case "error": return t.error(i);
			case "providers": return t.providers(s.providers);
			case "session": return await kc(s, l, c);
			case "signin": return t.signin(r, i);
			case "signout": return t.signout();
			case "verify-request": return t.verifyRequest();
			case "webauthn-options": return await Ic(e, s, l, c);
			default:
		}
	} else {
		let { csrfTokenVerified: t } = s;
		switch (n) {
			case "callback": return s.provider.type === "credentials" && Qr(n, t), await Dc(e, s, l, c);
			case "session": return Qr(n, t), await kc(s, l, c, !0, e.body?.data);
			case "signin": return Qr(n, t), await Nc(e, c, s);
			case "signout": return Qr(n, t), await Pc(c, l, s);
			default:
		}
	}
	throw new se(`Cannot handle action: ${n}`);
}
//#endregion
//#region node_modules/@auth/core/index.js
async function Rc(e, t) {
	let n = zr(t), r = await Gr(e, t);
	if (!r) return Response.json("Bad request.", { status: 400 });
	let i = ke(r, t);
	if (Array.isArray(i)) i.forEach(n.warn);
	else if (i) {
		if (n.error(i), !new Set([
			"signin",
			"signout",
			"error",
			"verify-request"
		]).has(r.action) || r.method !== "GET") return Response.json({ message: "There was a problem with the server configuration. Check the server logs for more information." }, { status: 500 });
		let { pages: e, theme: a } = t, o = e?.error && r.url.searchParams.get("callbackUrl")?.startsWith(e.error);
		if (!e?.error || o) return o && n.error(new b(`The error page ${e?.error} should not require authentication`)), qr(Ma({ theme: a }).error("Configuration"));
		let s = `${r.url.origin}${e.error}?error=Configuration`;
		return Response.redirect(s);
	}
	let a = e.headers?.has("X-Auth-Return-Redirect"), o = t.raw === ni;
	try {
		let e = await Lc(r, t);
		if (o) return e;
		let n = qr(e), i = n.headers.get("Location");
		return !a || !i ? n : Response.json({ url: i }, { headers: n.headers });
	} catch (i) {
		let s = i;
		n.error(s);
		let c = s instanceof h;
		if (c && o && !a) throw s;
		if (e.method === "POST" && r.action === "session") return Response.json(null, { status: 400 });
		let l = me(s) ? s.type : "Configuration", u = new URLSearchParams({ error: l });
		s instanceof C && u.set("code", s.code);
		let d = c && s.kind || "error", f = t.pages?.[d] ?? `${t.basePath}/${d.toLowerCase()}`, p = `${r.url.origin}${f}?${u}`;
		return a ? Response.json({ url: p }) : Response.redirect(p);
	}
}
//#endregion
//#region node_modules/@auth/core/providers/google.js
function zc(e) {
	return {
		id: "google",
		name: "Google",
		type: "oidc",
		issuer: "https://accounts.google.com",
		style: { brandColor: "#1a73e8" },
		options: e
	};
}
//#endregion
//#region node_modules/@auth/core/adapters.js
var Bc = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;
function Vc(e) {
	return typeof e == "string" && Bc.test(e) && !isNaN(Date.parse(e));
}
//#endregion
//#region node_modules/@auth/d1-adapter/queries.js
var Hc = "INSERT INTO users (id, name, email, emailVerified, image) VALUES (?, ?, ?, ?, ?)", Uc = "SELECT * FROM users WHERE id = ?", Wc = "SELECT * FROM users WHERE email = ?", Gc = "\n  SELECT u.*\n  FROM users u JOIN accounts a ON a.userId = u.id\n  WHERE a.providerAccountId = ? AND a.provider = ?", Kc = "\n  UPDATE users \n  SET name = ?, email = ?, emailVerified = ?, image = ?\n  WHERE id = ? ", qc = "DELETE FROM users WHERE id = ?", Jc = "INSERT INTO sessions (id, sessionToken, userId, expires) VALUES (?,?,?,?)", Yc = "\n  SELECT id, sessionToken, userId, expires\n  FROM sessions\n  WHERE sessionToken = ?", Xc = "UPDATE sessions SET expires = ? WHERE sessionToken = ?", Zc = "DELETE FROM sessions WHERE sessionToken = ?", Qc = "DELETE FROM sessions WHERE userId = ?", $c = "\n  INSERT INTO accounts (\n    id, userId, type, provider, \n    providerAccountId, refresh_token, access_token, \n    expires_at, token_type, scope, id_token, session_state,\n    oauth_token, oauth_token_secret\n  ) \n  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", el = "SELECT * FROM accounts WHERE id = ? ", tl = "DELETE FROM accounts WHERE provider = ? AND providerAccountId = ?", nl = "DELETE FROM accounts WHERE userId = ?", rl = "SELECT * FROM verification_tokens WHERE identifier = ? AND token = ?", il = "INSERT INTO verification_tokens (identifier, expires, token) VALUES (?,?,?)", al = "DELETE FROM verification_tokens WHERE identifier = ? and token = ?";
//#endregion
//#region node_modules/@auth/d1-adapter/index.js
function ol(e) {
	for (let [t, n] of Object.entries(e)) n === null && delete e[t], Vc(n) && (e[t] = new Date(n));
	return e;
}
function sl(e) {
	return e.map((e) => e === void 0 ? null : e);
}
async function cl(e, t, n, r, i) {
	try {
		return n = sl(n), await e.prepare(t).bind(...n).run(), await $(e, r, i);
	} catch (e) {
		throw console.error(e.message, e.cause?.message), e;
	}
}
async function $(e, t, n) {
	try {
		n = sl(n);
		let r = await e.prepare(t).bind(...n).first();
		return r ? ol(r) : null;
	} catch (e) {
		throw console.error(e.message, e.cause?.message), e;
	}
}
async function ll(e, t, n) {
	try {
		return n = sl(n), await e.prepare(t).bind(...n).run();
	} catch (e) {
		throw console.error(e.message, e.cause?.message), e;
	}
}
async function ul(e, t, n) {
	try {
		n = sl(n), await e.prepare(t).bind(...n).run();
	} catch (e) {
		throw console.error(e.message, e.cause?.message), e;
	}
}
function dl(e) {
	return {
		async createUser(t) {
			let n = crypto.randomUUID(), r = await cl(e, Hc, [
				n,
				t.name,
				t.email,
				t.emailVerified?.toISOString(),
				t.image
			], Uc, [n]);
			if (r) return r;
			throw Error("Error creating user: Cannot get user after creation.");
		},
		async getUser(t) {
			return await $(e, Uc, [t]);
		},
		async getUserByEmail(t) {
			return await $(e, Wc, [t]);
		},
		async getUserByAccount({ providerAccountId: t, provider: n }) {
			return await $(e, Gc, [t, n]);
		},
		async updateUser(t) {
			let n = await $(e, Uc, [t.id]);
			if (n && (Object.assign(n, t), (await ll(e, Kc, [
				n.name,
				n.email,
				n.emailVerified?.toISOString(),
				n.image,
				n.id
			])).success)) {
				let t = await $(e, Uc, [n.id]);
				if (t) return t;
				throw Error("Error updating user: Cannot get user after updating.");
			}
			throw Error("Error updating user: Failed to run the update SQL.");
		},
		async deleteUser(t) {
			return await ul(e, nl, [t]), await ul(e, Qc, [t]), await ul(e, qc, [t]), null;
		},
		async linkAccount(t) {
			let n = crypto.randomUUID();
			return await cl(e, $c, [
				n,
				t.userId,
				t.type,
				t.provider,
				t.providerAccountId,
				t.refresh_token,
				t.access_token,
				t.expires_at,
				t.token_type,
				t.scope,
				t.id_token,
				t.session_state,
				t.oauth_token ?? null,
				t.oauth_token_secret ?? null
			], el, [n]);
		},
		async unlinkAccount({ providerAccountId: t, provider: n }) {
			await ul(e, tl, [n, t]);
		},
		async createSession({ sessionToken: t, userId: n, expires: r }) {
			let i = await cl(e, Jc, [
				crypto.randomUUID(),
				t,
				n,
				r.toISOString()
			], Yc, [t]);
			if (i) return i;
			throw Error("Couldn't create session");
		},
		async getSessionAndUser(t) {
			let n = await $(e, Yc, [t]);
			if (n === null) return null;
			let r = await $(e, Uc, [n.userId]);
			return r === null ? null : {
				session: n,
				user: r
			};
		},
		async updateSession({ sessionToken: t, expires: n }) {
			if (n === void 0) return await ul(e, Zc, [t]), null;
			let r = await $(e, Yc, [t]);
			return r ? (r.expires = n, await ll(e, Xc, [n?.toISOString(), t]), await e.prepare(Xc).bind(n?.toISOString(), t).first()) : null;
		},
		async deleteSession(t) {
			return await ul(e, Zc, [t]), null;
		},
		async createVerificationToken({ identifier: t, expires: n, token: r }) {
			return await cl(e, il, [
				t,
				n.toISOString(),
				r
			], rl, [t, r]);
		},
		async useVerificationToken({ identifier: t, token: n }) {
			let r = await $(e, rl, [t, n]);
			return r ? (await ul(e, al, [t, n]), r) : null;
		}
	};
}
//#endregion
//#region worker/index.ts
var fl = {
	23: {
		startK: 1,
		count: 32768,
		factors: ["47", "178481"]
	},
	29: {
		startK: 1,
		count: 32768,
		factors: [
			"233",
			"1103",
			"2089",
			"256999",
			"486737"
		]
	},
	37: {
		startK: 1,
		count: 32768,
		factors: ["223"]
	},
	43: {
		startK: 1,
		count: 32768,
		factors: [
			"431",
			"9719",
			"2099863"
		]
	}
};
function pl(e) {
	return !!(e.DB && e.AUTH_SECRET && e.AUTH_GOOGLE_ID && e.AUTH_GOOGLE_SECRET);
}
function ml(e) {
	if (!e.AUTH_SECRET || !e.AUTH_GOOGLE_ID || !e.AUTH_GOOGLE_SECRET) throw Error("Google OAuth environment variables are missing.");
	return {
		adapter: dl(e.DB),
		basePath: "/api/auth",
		providers: [zc({
			clientId: e.AUTH_GOOGLE_ID,
			clientSecret: e.AUTH_GOOGLE_SECRET
		})],
		secret: e.AUTH_SECRET,
		session: { strategy: "database" },
		trustHost: !0
	};
}
function hl(e) {
	let t = new Headers(e.headers);
	return t.set("referrer-policy", "strict-origin-when-cross-origin"), t.set("x-content-type-options", "nosniff"), t.set("x-frame-options", "DENY"), t.set("permissions-policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()"), new Response(e.body, {
		status: e.status,
		statusText: e.statusText,
		headers: t
	});
}
async function gl(e, t) {
	if (!pl(t)) return null;
	let n = new URL(e.url);
	n.pathname = "/api/auth/session", n.search = "";
	let r = new Headers(), i = e.headers.get("cookie");
	i && r.set("cookie", i);
	let a = await Rc(new Request(n, {
		method: "GET",
		headers: r
	}), ml(t));
	if (!a.ok) return null;
	let o = await a.json();
	return o?.user?.email ? o.user : null;
}
function _l(e) {
	return e.toLowerCase().replace(/[^a-z0-9_-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || `mesh-${crypto.randomUUID().slice(0, 8)}`;
}
async function vl(e, t) {
	let n = t.email, r = t.name || n;
	await e.DB.prepare("INSERT INTO profiles (email, display_name, public_handle)\n     VALUES (?, ?, ?)\n     ON CONFLICT(email) DO UPDATE SET\n       display_name = excluded.display_name,\n       updated_at = CURRENT_TIMESTAMP").bind(n, r, _l(n)).run();
}
async function yl(e, t) {
	let n = await e.DB.prepare("SELECT\n       coalesce(sum(cpu_core_milliseconds), 0) AS cpuCoreMilliseconds,\n       coalesce(sum(gpu_milliseconds), 0) AS gpuMilliseconds,\n       coalesce(sum(candidates), 0) AS candidates,\n       coalesce(sum(factor_count), 0) AS factors,\n       coalesce(sum(CASE WHEN verified = 1 THEN 1 ELSE 0 END), 0) AS validatedUnits\n     FROM contributions\n     WHERE user_email = ?").bind(t).first();
	return {
		cpuCoreMilliseconds: Number(n?.cpuCoreMilliseconds ?? 0),
		gpuMilliseconds: Number(n?.gpuMilliseconds ?? 0),
		candidates: Number(n?.candidates ?? 0),
		factors: Number(n?.factors ?? 0),
		validatedUnits: Number(n?.validatedUnits ?? 0)
	};
}
async function bl(e, t) {
	if (!t.DB) return Response.json({ error: "D1 binding DB is missing." }, { status: 503 });
	let n = await gl(e, t);
	if (!n?.email) return Response.json({ error: "Sign in required." }, { status: 401 });
	if (await vl(t, n), e.method === "GET") return Response.json({ stats: await yl(t, n.email) });
	if (e.method !== "POST") return new Response("Method not allowed", {
		status: 405,
		headers: { allow: "GET, POST" }
	});
	let r;
	try {
		r = await e.json();
	} catch {
		return Response.json({ error: "Invalid JSON." }, { status: 400 });
	}
	let i = Math.trunc(Number(r.exponent)), a = fl[i], o = Math.trunc(Number(r.elapsedMs)), s = Math.trunc(Number(r.candidates)), c = Math.max(1, Math.min(256, Math.trunc(Number(r.cores)))), l = r.engine === "gpu" ? "gpu" : "cpu", u = String(r.workUnitId ?? "").slice(0, 120), d = [...new Set((r.factors ?? []).map(String))].sort(), f = a?.factors.slice().sort(), p = a ? `validation-m${i}-k${a.startK}-${a.count}` : "";
	return !a || u !== p || !Number.isFinite(o) || o < 1 || o > 36e5 || s !== 16384 || JSON.stringify(d) !== JSON.stringify(f) ? Response.json({ error: "The result did not match the assigned validation range." }, { status: 422 }) : (await t.DB.prepare("INSERT INTO contributions (\n       user_email, work_unit_id, exponent, engine,\n       cpu_core_milliseconds, gpu_milliseconds, candidates,\n       factors_json, factor_count, verified\n     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)\n     ON CONFLICT(user_email, work_unit_id) DO NOTHING").bind(n.email, u, i, l, l === "cpu" ? o * c : 0, l === "gpu" ? o : 0, s, JSON.stringify(d), d.length).run(), Response.json({ stats: await yl(t, n.email) }, { status: 201 }));
}
async function xl(e, t) {
	let n = new URL(e.url);
	if (n.pathname === "/api/health") return Response.json({
		ok: !0,
		authConfigured: pl(t),
		databaseBound: !!t.DB,
		network: "validation",
		operatorContact: t.PUBLIC_CONTACT_EMAIL || null
	});
	if (n.pathname.startsWith("/api/auth")) return pl(t) ? Rc(e, ml(t)) : n.pathname === "/api/auth/session" ? Response.json(null) : Response.json({ error: "Google sign-in is not configured." }, { status: 503 });
	if (n.pathname === "/api/contributions") return bl(e, t);
	let r = await t.ASSETS.fetch(e);
	if (r.status === 404 && e.method === "GET" && (e.headers.get("accept") ?? "").includes("text/html")) {
		let n = new URL(e.url);
		n.pathname = "/index.html", n.search = "", r = await t.ASSETS.fetch(new Request(n, e));
	}
	return r;
}
var Sl = { async fetch(e, t, n) {
	try {
		return hl(await xl(e, t));
	} catch (e) {
		return console.error("Mersenne Mesh request failed", e), hl(Response.json({ error: "The service could not complete this request." }, { status: 500 }));
	}
} };
//#endregion
export { Sl as default };
