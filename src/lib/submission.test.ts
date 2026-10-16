import { SubmissionError, getSubmissionStatus, submitEnquiry } from "./submission";

const payload = {
  fullName: "Ramesh Sharma",
  mobile: "9876543210",
  city: "Indore",
  loanType: "Home Loan",
  loanAmount: "Not Sure Yet",
  contactTime: "10 AM – 12 PM",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

function useEnv(env: Record<string, string>) {
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
}

describe("not configured", () => {
  it("throws and never calls fetch", async () => {
    vi.stubEnv("VITE_SUBMISSION_PROVIDER", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(submitEnquiry(payload)).rejects.toMatchObject({ kind: "not-configured" });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(getSubmissionStatus().configured).toBe(false);
  });

  it("rejects a malformed Formspree URL", async () => {
    useEnv({ VITE_SUBMISSION_PROVIDER: "formspree", VITE_FORMSPREE_ENDPOINT: "http://evil.example/x" });
    await expect(submitEnquiry(payload)).rejects.toMatchObject({ kind: "not-configured" });
  });
});

describe("formspree", () => {
  beforeEach(() => useEnv({ VITE_SUBMISSION_PROVIDER: "formspree", VITE_FORMSPREE_ENDPOINT: "https://formspree.io/f/abc123" }));

  it("resolves on HTTP 200 and posts readable JSON fields", async () => {
    const fetchMock = vi.fn().mockResolvedValue(json({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(submitEnquiry({ ...payload, email: "a@b.in" })).resolves.toBeUndefined();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://formspree.io/f/abc123");
    const body = JSON.parse(init.body);
    expect(body["Mobile Number"]).toBe("+919876543210");
    expect(body.email).toBe("a@b.in");
    expect(body["Consent Given"]).toBe("Yes");
  });

  it("throws 'rejected' on 422", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({ errors: [] }, 422)));
    await expect(submitEnquiry(payload)).rejects.toMatchObject({ kind: "rejected" });
  });

  it("throws 'server' on 500", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({}, 500)));
    await expect(submitEnquiry(payload)).rejects.toMatchObject({ kind: "server" });
  });

  it("throws 'network' when fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    await expect(submitEnquiry(payload)).rejects.toMatchObject({ kind: "network" });
  });
});

describe("formsubmit", () => {
  beforeEach(() => useEnv({ VITE_SUBMISSION_PROVIDER: "formsubmit", VITE_FORMSUBMIT_TARGET: "owner@example.com" }));

  it("resolves only when success is confirmed", async () => {
    const fetchMock = vi.fn().mockResolvedValue(json({ success: "true", message: "ok" }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(submitEnquiry(payload)).resolves.toBeUndefined();
    expect(fetchMock.mock.calls[0][0]).toBe("https://formsubmit.co/ajax/owner%40example.com");
  });

  it("does NOT resolve when the form still needs activation, even with HTTP 200", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({ success: "false", message: "This form needs Activation." })));
    await expect(submitEnquiry(payload)).rejects.toMatchObject({ kind: "activation" });
  });

  it("does NOT resolve on HTTP 200 without a success flag", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({})));
    await expect(submitEnquiry(payload)).rejects.toBeInstanceOf(SubmissionError);
  });
});

describe("api (planned backend contract)", () => {
  it("POSTs to {VITE_API_BASE_URL}/api/enquiries", async () => {
    useEnv({ VITE_SUBMISSION_PROVIDER: "api", VITE_API_BASE_URL: "https://api.example.com/" });
    const fetchMock = vi.fn().mockResolvedValue(json({ id: 1 }, 201));
    vi.stubGlobal("fetch", fetchMock);
    await submitEnquiry(payload);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.example.com/api/enquiries");
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({ mobile: "+919876543210", consentGiven: true, source: "public-website" });
  });

  it("fails when the backend is missing (404)", async () => {
    useEnv({ VITE_SUBMISSION_PROVIDER: "api", VITE_API_BASE_URL: "https://api.example.com" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({}, 404)));
    await expect(submitEnquiry(payload)).rejects.toMatchObject({ kind: "rejected" });
  });
});

describe("privacy", () => {
  it("never touches web storage or the console", async () => {
    useEnv({ VITE_SUBMISSION_PROVIDER: "formspree", VITE_FORMSPREE_ENDPOINT: "https://formspree.io/f/abc123" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({ ok: true })));
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const log = vi.spyOn(console, "log");
    await submitEnquiry(payload);
    expect(setItem).not.toHaveBeenCalled();
    expect(log).not.toHaveBeenCalled();
  });
});
