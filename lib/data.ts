// Sections kept in the code but not rendered yet; flip to true to show.
export const SHOW = { work: false, problems: false, instruments: false };

export const NAV = [
  { href: "#focus", label: "Focus" },
  { href: "#work", label: "Work", show: SHOW.work },
  { href: "#problems", label: "Problems", show: SHOW.problems },
  { href: "#instruments", label: "Instruments", show: SHOW.instruments },
].filter((l) => l.show !== false);

// Console lines are trusted, static markup; c-* classes colour spans.
export type Module = { name: string; status: string; sub: string; desc: string; chips: string[]; cmd: string; out: string };

export const MODULES: Module[] = [
  {
    name: "Crypto Asset Graph",
    status: "Building",
    sub: "Find every key, cert and algorithm you depend on.",
    desc: "Agentless discovery across code, binaries, TLS endpoints, cloud KMS, HSMs and firmware images. Every finding becomes a node in a graph of owners, dependencies and data lifetimes.",
    chips: ["CBOM export", "TLS scan", "SBOM ingest", "KMS / HSM", "Risk scoring"],
    cmd: "planck scan --org acme --depth full",
    out: `<span class="c-dim">▸ enumerating 4 cloud accounts, 2 HSM partitions, 312 repos</span>
<span class="c-dim">▸ probing 1,904 TLS endpoints</span>
  assets discovered ............ <span class="c-ink">18,442</span>
  ├─ RSA-2048 / 3072 ........... <span class="c-bad">6,117</span>  <span class="c-dim">shor-vulnerable</span>
  ├─ ECDSA P-256 / Ed25519 ..... <span class="c-bad">9,830</span>  <span class="c-dim">shor-vulnerable</span>
  ├─ hybrid X25519MLKEM768 ..... <span class="c-ok">1,204</span>
  └─ ML-DSA-65 ................. <span class="c-ok">88</span>
<span class="c-warn">!</span> 41 long-lived secrets (x &gt; 20y) on classical KEX
<span class="c-warn">!</span> root CA "acme-iot-root" signs 2.1M devices, ROM-pinned
<span class="c-ok">✓</span> graph written → cbom://acme/2026-10-27`,
  },
  {
    name: "Interop & Release Lab",
    status: "Prototype",
    sub: "Prove PQC works on your real stack before you ship.",
    desc: "A continuous test matrix of PQC libraries, protocols, certificates, HSMs, middleboxes and constrained devices. Catch the oversized ClientHello before a firewall does.",
    chips: ["TLS 1.3 hybrid", "X.509 ML-DSA", "PKCS#11 3.2", "ESP32 / STM32", "Perf budgets"],
    cmd: "planck lab run --matrix release-2026.11",
    out: `<span class="c-dim">matrix: 7 libs × 5 HSMs × 12 devices × 4 middleboxes</span>
  openssl 3.5 ⇄ boringssl     X25519MLKEM768  <span class="c-ok">PASS</span>  1.9 ms
  rustls 0.23 ⇄ HSM-A         ML-DSA-65 sign  <span class="c-ok">PASS</span>  0.41 ms
  esp32-s3 (mbedtls+pq)       ML-KEM-768      <span class="c-ok">PASS</span>  11.2 ms  <span class="c-dim">heap 38 KiB</span>
  stm32l4                     ML-DSA-44 sign  <span class="c-warn">SLOW</span>  212 ms   <span class="c-dim">budget 150 ms</span>
  legacy-fw-v7 (middlebox)    ClientHello 1.6K <span class="c-bad">FAIL</span>  <span class="c-dim">drops fragmented CH</span>
──────────────────────────────────────────────────
<span class="c-ink">142 pass · 3 slow · 1 fail</span>  → release gate <span class="c-warn">HOLD</span>`,
  },
  {
    name: "Firmware Trust Transition",
    status: "Research",
    sub: "Move device fleets from classical to PQ signing.",
    desc: "Dual-signed release pipelines, staged trust-root rotation and rollback-safe update authorization for connected products whose boot ROMs can't simply be replaced.",
    chips: ["Hybrid signing", "Secure boot", "OTA staging", "Key ceremonies", "EU CRA evidence"],
    cmd: "planck fw sign --release 4.2.0 --policy hybrid",
    out: `  artifact   gateway-fw-4.2.0.bin  (1.8 MiB)
  digest     sha3-256 9f2c…e41a
  sig[0]     ECDSA-P256   key=rel-2024   <span class="c-ok">✓</span>
  sig[1]     ML-DSA-65    key=rel-pq-01  <span class="c-ok">✓</span>  <span class="c-dim">3,309 B</span>
  manifest   SUIT v1, rollback-floor=4.1.0

<span class="c-dim">fleet rollout plan</span>
  ring 0  lab           24 devices    <span class="c-ok">verified hybrid</span>
  ring 1  canary     1,200 devices    <span class="c-ok">verified hybrid</span>
  ring 2  general  412,880 devices    <span class="c-warn">scheduled 11-03</span>
  ring 3  rom-v1    31,004 devices    <span class="c-bad">classical-only — needs bridge key</span>`,
  },
  {
    name: "Chain Migration Lab",
    status: "Research",
    sub: "Measure and fix quantum exposure on-chain.",
    desc: "Scan ledgers for exposed public keys, model the value at risk, and prototype PQ signature schemes and account-abstraction migrations on forked networks.",
    chips: ["Exposure scanner", "PQ wallets", "Account abstraction", "Forked testnets", "Validator keys"],
    cmd: "planck chain exposure --network mainnet",
    out: `<span class="c-dim">▸ indexing UTXO/account state at height 9,41x,xxx</span>
  address class              keys exposed     share of supply
  ├─ public key revealed ..... <span class="c-bad">exposed</span>          <span class="c-bad">high</span>
  ├─ address reuse ........... <span class="c-bad">exposed</span>          <span class="c-warn">medium</span>
  ├─ hash-only, unspent ...... <span class="c-warn">at spend</span>         <span class="c-warn">medium</span>
  └─ PQ / hash-locked ........ <span class="c-ok">safe</span>             <span class="c-ok">low</span>

<span class="c-dim">sim: forked testnet, ML-DSA-44 via smart account</span>
  tx size  +2.4 KB   verify  +0.19 ms   gas  <span class="c-warn">+31%</span>
<span class="c-ok">✓</span> migration path drafted → report://chain/pq-v0`,
  },
];

export type QStatus = "broken" | "weak" | "safe";
export type Algo = {
  id: string; name: string; short: string; role: string; cl: string; q: QStatus; pq: string; std: string;
  sizes: [string, number][]; desc: string;
};

// sizes: wire bytes per FIPS 203/204/205 and draft FIPS 206 parameter sets
export const ALGO_GROUPS: { group: string; algos: Algo[] }[] = [
  {
    group: "Classical public-key",
    algos: [
      { id: "rsa", name: "RSA-2048", short: "RSA", role: "KEM / Sig", cl: "112-bit", q: "broken", pq: "0-bit (Shor)", std: "PKCS#1 · FIPS 186",
        sizes: [["pk", 256], ["sig", 256]],
        desc: "Factoring-based. Shor's algorithm factors the modulus in polynomial time, so a CRQC recovers the private key from the public key alone." },
      { id: "ecdsa", name: "ECDSA P-256", short: "ECDSA", role: "Signature", cl: "128-bit", q: "broken", pq: "0-bit (Shor)", std: "FIPS 186-5",
        sizes: [["pk", 64], ["sig", 64]],
        desc: "Elliptic-curve discrete log. Fewer logical qubits are needed to break it than RSA-2048 — it is likely the first to fall. Secures most blockchains." },
      { id: "x25519", name: "X25519", short: "X25519", role: "Key exchange", cl: "128-bit", q: "broken", pq: "0-bit (Shor)", std: "RFC 7748",
        sizes: [["pk", 32], ["ct", 32]],
        desc: "Today's default TLS key exchange. Recorded handshakes can be decrypted retroactively — the harvest-now-decrypt-later threat." },
    ],
  },
  {
    group: "Symmetric & hash",
    algos: [
      { id: "aes128", name: "AES-128", short: "AES-128", role: "Cipher", cl: "128-bit", q: "weak", pq: "~64-bit (Grover)", std: "FIPS 197",
        sizes: [["key", 16]],
        desc: "Grover gives a quadratic speedup on key search, though it parallelises poorly in practice. Prefer AES-256 for long-lived data." },
      { id: "aes256", name: "AES-256", short: "AES-256", role: "Cipher", cl: "256-bit", q: "safe", pq: "~128-bit (Grover)", std: "FIPS 197",
        sizes: [["key", 32]],
        desc: "Remains strong against known quantum attacks. Post-quantum KEMs exist to establish keys like this one securely." },
      { id: "sha", name: "SHA-256 / SHA3", short: "SHA-256", role: "Hash", cl: "128-bit coll.", q: "safe", pq: "≥128-bit preimage", std: "FIPS 180-4 · 202",
        sizes: [["digest", 32]],
        desc: "Hash functions are only mildly affected by quantum attacks and form the foundation of SLH-DSA." },
    ],
  },
  {
    group: "Post-quantum (NIST)",
    algos: [
      { id: "mlkem", name: "ML-KEM-768", short: "ML-KEM", role: "KEM", cl: "Cat 3", q: "safe", pq: "Cat 3 (~AES-192)", std: "FIPS 203",
        sizes: [["pk", 1184], ["ct", 1088]],
        desc: "Module-lattice key encapsulation (formerly Kyber). Fast, compact enough for TLS, and deployed as a hybrid with X25519 in all major browsers." },
      { id: "mldsa", name: "ML-DSA-65", short: "ML-DSA", role: "Signature", cl: "Cat 3", q: "safe", pq: "Cat 3 (~AES-192)", std: "FIPS 204",
        sizes: [["pk", 1952], ["sig", 3309]],
        desc: "Module-lattice signatures (formerly Dilithium). The general-purpose replacement for ECDSA and RSA signatures — at ~50× the signature size." },
      { id: "slhdsa", name: "SLH-DSA-128s", short: "SLH-DSA", role: "Signature", cl: "Cat 1", q: "safe", pq: "Cat 1 (~AES-128)", std: "FIPS 205",
        sizes: [["pk", 32], ["sig", 7856]],
        desc: "Stateless hash-based signatures (SPHINCS+). Security rests only on hash functions — the conservative choice for root keys and firmware." },
      { id: "fndsa", name: "FN-DSA-512", short: "FN-DSA", role: "Signature", cl: "Cat 1", q: "safe", pq: "Cat 1 (~AES-128)", std: "draft FIPS 206",
        sizes: [["pk", 897], ["sig", 666]],
        desc: "NTRU-lattice signatures (Falcon). The smallest PQ signatures, but floating-point signing makes constant-time implementations hard." },
    ],
  },
];

export const PROBLEMS = [
  { area: "Quantum", q: "When does P-256 actually fall?",
    detail: "End-to-end resource estimates for elliptic-curve discrete log on surface-code machines, tracked against real hardware roadmaps." },
  { area: "Embedded", q: "Can a $4 microcontroller verify a lattice signature inside its boot budget?",
    detail: "Stack, flash and cycle limits for ML-DSA and SLH-DSA verification in secure boot, without giving up constant time." },
  { area: "Ledgers", q: "How does a chain migrate signatures without freezing coins?",
    detail: "Soft-fork paths, PQ account abstraction and proofs of key ownership for addresses whose public keys are already exposed." },
  { area: "Hardware", q: "What does crypto-agility cost at line rate?",
    detail: "FPGA pipelines that switch between classical, hybrid and PQ primitives at 100 Gbps without re-synthesis." },
  { area: "Systems", q: "Can a migration be proven, not just claimed?",
    detail: "Verifiable inventories and attestations that show which keys moved, when, and what still depends on classical trust." },
];
