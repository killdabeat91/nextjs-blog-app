"use client"

import { useActionState } from "react"
import { registerUser, RegisterState } from "@/app/actions/auth"
import Link from "next/link"

const initialState: RegisterState = {}

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(
    registerUser,
    initialState,
  )

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Register</h1>

      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            defaultValue={state.values?.username || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {state.errors?.username && (
            <p
              data-testid="username-error"
              className="mt-1 text-sm text-red-600"
            >
              {state.errors.username}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={state.values?.name || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {state.errors?.name && (
            <p className="mt-1 text-sm text-red-600">{state.errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {state.errors?.password && (
            <p className="mt-1 text-sm text-red-600">{state.errors.password}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="passwordConfirm"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password
          </label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {state.errors?.passwordConfirm && (
            <p
              data-testid="passwordConfirm-error"
              className="mt-1 text-sm text-red-600"
            >
              {state.errors.passwordConfirm}
            </p>
          )}
        </div>

        <button
          type="submit"
          data-testid="register-button"
          disabled={isPending}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
        >
          {isPending ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          login
        </Link>
      </p>
    </div>
  )
}
