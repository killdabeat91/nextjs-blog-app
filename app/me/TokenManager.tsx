"use client"

import { useState } from "react"
import { generateApiToken } from "@/app/actions/user"

export default function TokenManager({
  initialToken,
}: {
  initialToken: string | null
}) {
  const [token, setToken] = useState<string | null>(initialToken)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await generateApiToken()
      setToken(res.token)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div data-testid="api-token-section" className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-800">API Access Token</h2>

      {token ? (
        <div data-testid="token-display" className="space-y-2">
          <p className="text-sm text-gray-600">Your current API token:</p>
          <div className="p-3 bg-gray-100 rounded-md font-mono text-sm break-all text-gray-800">
            <code data-testid="api-token">{token}</code>
          </div>
        </div>
      ) : (
        <p data-testid="no-token-message" className="text-sm text-gray-500">
          no token generated yet
        </p>
      )}

      <div>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          data-testid="generate-token-button"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
        >
          {loading
            ? "Generating..."
            : token
              ? "Regenerate Token"
              : "Generate Token"}
        </button>
      </div>
    </div>
  )
}
