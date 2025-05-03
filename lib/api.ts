import axios from "axios"

// Helper function to ensure error is a string
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  return "An error occurred"
}

// Cookie utility function
function getCookie(name: string) {
  if (typeof document === "undefined") return undefined
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(";").shift() || "")
  return undefined
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 100000,
  withCredentials: true,
})

// Add token to headers if available
api.interceptors.request.use(
  (config) => {
    const token = getCookie("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Ensure Content-Type is not overridden for multipart/form-data
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"] // Let browser set it
    }
    return config
  },
  (error) => {
    console.error("Request error:", error)
    return Promise.reject(getErrorMessage(error))
  },
)

// Handle response and errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.log(error, "errorAPI")

    // Log detailed error information
    console.error("API Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    })

    // Get a proper error message
    const message = error.response?.data?.message || getErrorMessage(error) || "An error occurred"

    // Throw error for component handling
    return Promise.reject(message)
  },
)

export default api
