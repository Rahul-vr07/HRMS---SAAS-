const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
console.log("API_URL =", API_URL);
class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    
  console.log("API_URL =", API_URL);
  console.log("Request URL =", `${API_URL}/api/v1${path}`);
  console.log("Request Body =", options.body);

  const token = this.getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_URL}/api/v1${path}`, {
      ...options,
      headers,
    });

    console.log("Status =", res.status);
    console.log("OK =", res.ok);
    console.log("Response URL =", res.url);

    if (res.status === 401) {
      const refreshed = await this.tryRefresh();

      if (refreshed) return this.request(path, options);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";

      throw new Error("Unauthorized");
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({
        message: "Request failed",
      }));

      console.log("Response Error =", error);

      throw new Error(error.message);
    }

    return res.json();
  } catch (err) {
    console.error("FETCH ERROR =", err);
    throw err;
  }
}

  private async tryRefresh(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return true;
    } catch {
      return false;
    }
  }

  get<T>(path: string) {
    return this.request<T>(path);
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: 'POST', body: JSON.stringify(body) });
  }

  put<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: 'PUT', body: JSON.stringify(body) });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
