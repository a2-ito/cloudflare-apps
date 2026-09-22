"use client";

import { useState, useMemo } from "react";

type Props = {
  t: {
    name: string;
    description: string;
    algorithm: string;
    keySize: string;
    generate: string;
    copy: string;
    publicKey: string;
    privateKey: string;
    entropy: string;
    securityLevel: string;
    format: string;
    strengthCheck: string;
    showPassword: string;
    hidePassword: string;
    download: string;
    generatedAt: string;
    error: string;
  };
};

type Algorithm = "rsa" | "ecdsa" | "ed25519";

interface KeyPair {
  publicKey: string;
  privateKey: string;
  entropy?: string;
  securityLevel?: string;
  generatedAt: string;
}

export default function KeypairGenerator({ t }: Props) {
  const [algorithm, setAlgorithm] = useState<Algorithm>("rsa");
  const [keySize, setKeySize] = useState("2048");
  const [format, setFormat] = useState<"pem" | "ssh">("pem");
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const keyOptions = useMemo(() => {
    switch (algorithm) {
      case "rsa":
        setKeySize("2048");
        return [
          { value: "2048", label: "2048 bits" },
          { value: "3072", label: "3072 bits" },
          { value: "4096", label: "4096 bits" },
        ];
      case "ecdsa":
        setKeySize("P-256");
        return [
          { value: "P-256", label: "P-256 (secp256r1)" },
          { value: "P-384", label: "P-384 (secp384r1)" },
          { value: "P-521", label: "P-521 (secp521r1)" },
        ];
      case "ed25519":
        return [{ value: "Ed25519", label: "Ed25519" }];
      default:
        return [];
    }
  }, [algorithm]);

  const generateKeyPair = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      let keys: { publicKey: string; privateKey: string } = {
        publicKey: "",
        privateKey: "",
      };
      let entropy = "";
      let securityLevel = "";

      // Use Web Crypto API for client-side key generation only
      if (algorithm === "rsa") {
        const bits = parseInt(keySize);
        const keyPair = await window.crypto.subtle.generateKey(
          {
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: bits,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: "SHA-256",
          },
          true,
          ["sign", "verify"],
        );

        const publicKeyExported = await window.crypto.subtle.exportKey(
          "spki",
          keyPair.publicKey,
        );
        const privateKeyExported = await window.crypto.subtle.exportKey(
          "pkcs8",
          keyPair.privateKey,
        );

        keys = {
          publicKey: `-----BEGIN PUBLIC KEY-----\n${btoa(String.fromCharCode(...new Uint8Array(publicKeyExported)))}\n-----END PUBLIC KEY-----`,
          privateKey: `-----BEGIN PRIVATE KEY-----\n${btoa(String.fromCharCode(...new Uint8Array(privateKeyExported)))}\n-----END PRIVATE KEY-----`,
        };

        entropy = Math.random().toString(36).substring(2, 15);
        securityLevel =
          bits >= 4096 ? "High" : bits >= 3072 ? "Medium" : "Basic";
      } else if (algorithm === "ecdsa") {
        const curveMap: Record<string, string> = {
          "P-256": "P-256",
          "P-384": "P-384",
          "P-521": "P-521",
        };

        const curveName = curveMap[keySize];
        if (!curveName) {
          throw new Error(`Unsupported ECDSA curve: ${keySize}`);
        }

        const ecKeyPair = await window.crypto.subtle.generateKey(
          {
            name: "ECDSA",
            namedCurve: curveName,
            hash: "SHA-256",
          },
          true,
          ["sign", "verify"],
        );

        const publicKeyExported = await window.crypto.subtle.exportKey(
          "spki",
          ecKeyPair.publicKey,
        );
        const privateKeyExported = await window.crypto.subtle.exportKey(
          "pkcs8",
          ecKeyPair.privateKey,
        );

        keys = {
          publicKey: `-----BEGIN PUBLIC KEY-----\n${btoa(String.fromCharCode(...new Uint8Array(publicKeyExported)))}\n-----END PUBLIC KEY-----`,
          privateKey: `-----BEGIN PRIVATE KEY-----\n${btoa(String.fromCharCode(...new Uint8Array(privateKeyExported)))}\n-----END PRIVATE KEY-----`,
        };

        entropy = Math.random().toString(36).substring(2, 15);
        securityLevel = "High";
      } else if (algorithm === "ed25519") {
        const edKeyPair = await window.crypto.subtle.generateKey(
          {
            name: "Ed25519",
          },
          true,
          ["sign", "verify"],
        );

        const publicKeyExported = await window.crypto.subtle.exportKey(
          "spki",
          edKeyPair.publicKey,
        );
        const privateKeyExported = await window.crypto.subtle.exportKey(
          "pkcs8",
          edKeyPair.privateKey,
        );

        keys = {
          publicKey: `-----BEGIN PUBLIC KEY-----\n${btoa(String.fromCharCode(...new Uint8Array(publicKeyExported)))}\n-----END PUBLIC KEY-----`,
          privateKey: `-----BEGIN PRIVATE KEY-----\n${btoa(String.fromCharCode(...new Uint8Array(privateKeyExported)))}\n-----END PRIVATE KEY-----`,
        };

        entropy = Math.random().toString(36).substring(2, 15);
        securityLevel = "High";
      }

      setKeyPair({
        ...keys,
        entropy,
        securityLevel,
        generatedAt: new Date().toLocaleString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t.error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadKey = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSecurityColor = (level?: string) => {
    if (!level) return "text-gray-600";
    switch (level) {
      case "High":
        return "text-green-600";
      case "Medium":
        return "text-yellow-600";
      case "Basic":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl px-2 sm:px-0">
      <h1 className="text-xl sm:text-2xl font-bold">{t.name}</h1>

      {/* Configuration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block font-medium text-sm sm:text-base">
            {t.algorithm}
          </label>
          <select
            className="w-full border rounded px-3 py-2 text-sm dark:bg-zinc-900"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
          >
            <option value="rsa">RSA</option>
            <option value="ecdsa">ECDSA</option>
            <option value="ed25519">Ed25519</option>
          </select>
        </div>

        {algorithm != "ed25519" && (
          <div className="space-y-2">
            <label className="block font-medium text-sm sm:text-base">
              {t.keySize}
            </label>
            <select
              className="w-full border rounded px-3 py-2 text-sm dark:bg-zinc-900"
              value={keySize}
              onChange={(e) => setKeySize(e.target.value)}
            >
              {keyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-2">
          <label className="block font-medium text-sm sm:text-base">
            {t.format}
          </label>
          <select
            className="w-full border rounded px-3 py-2 text-sm dark:bg-zinc-900"
            value={format}
            onChange={(e) => setFormat(e.target.value as "pem" | "ssh")}
          >
            <option value="pem">PEM</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={generateKeyPair}
            disabled={isGenerating}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isGenerating ? "Generating..." : t.generate}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-800">
          <h3 className="font-medium text-red-800 dark:text-red-200 mb-1">
            {t.error}
          </h3>
          <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Key Pair Display */}
      {keyPair && (
        <div className="space-y-6">
          {/* Security Information */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 dark:bg-green-900/20 dark:border-green-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">{t.entropy}:</span>
                <div className="text-xs sm:text-sm">{keyPair.entropy}</div>
              </div>
              <div>
                <span className="font-medium">{t.securityLevel}:</span>
                <div
                  className={`text-xs sm:text-sm ${getSecurityColor(keyPair.securityLevel)}`}
                >
                  {keyPair.securityLevel}
                </div>
              </div>
              <div>
                <span className="font-medium">{t.generatedAt}:</span>
                <div className="text-xs sm:text-sm">{keyPair.generatedAt}</div>
              </div>
            </div>
          </div>

          {/* Public Key */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-sm sm:text-base">
                {t.publicKey}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(keyPair.publicKey)}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {t.copy}
                </button>
                <button
                  onClick={() => downloadKey(keyPair.publicKey, "public.pem")}
                  className="text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                >
                  {t.download}
                </button>
              </div>
            </div>
            <div className="bg-white border rounded-lg p-3 dark:bg-zinc-800 dark:border-zinc-700">
              <pre className="text-xs sm:text-sm font-mono break-all whitespace-pre-wrap">
                {keyPair.publicKey}
              </pre>
            </div>
          </div>

          {/* Private Key */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-sm sm:text-base">
                {t.privateKey}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(keyPair.privateKey)}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {t.copy}
                </button>
                <button
                  onClick={() => downloadKey(keyPair.privateKey, "private.pem")}
                  className="text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                >
                  {t.download}
                </button>
                <button
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {showPrivateKey ? t.hidePassword : t.showPassword}
                </button>
              </div>
            </div>
            <div className="bg-white border rounded-lg p-3 dark:bg-zinc-800 dark:border-zinc-700">
              {showPrivateKey ? (
                <pre className="text-xs sm:text-sm font-mono break-all whitespace-pre-wrap text-red-600 dark:text-red-400">
                  {keyPair.privateKey}
                </pre>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  🔒 {t.privateKey} is hidden. Click &quot;{t.showPassword}
                  &quot; to reveal.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
