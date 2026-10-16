import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Home from "../pages/Home";
import LoanEnquiryForm from "./LoanEnquiryForm";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

function configure() {
  vi.stubEnv("VITE_SUBMISSION_PROVIDER", "formspree");
  vi.stubEnv("VITE_FORMSPREE_ENDPOINT", "https://formspree.io/f/abc123");
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/full name/i), "Ramesh Sharma");
  await user.type(screen.getByLabelText(/mobile number/i), "98765 43210");
  await user.type(screen.getByLabelText(/^city/i), "Indore");
  await user.selectOptions(screen.getByLabelText(/loan type/i), "Home Loan");
  await user.selectOptions(screen.getByLabelText(/approximate loan amount/i), "Not Sure Yet");
  await user.selectOptions(screen.getByLabelText(/preferred contact time/i), "10 AM – 12 PM");
  await user.click(screen.getByLabelText(/I agree that Maa Bijasan Finance/i));
}

const renderForm = () => render(<MemoryRouter><LoanEnquiryForm /></MemoryRouter>);
const submitBtn = () => screen.getByRole("button", { name: /submit loan enquiry/i });

describe("LoanEnquiryForm", () => {
  it("consent checkbox is NOT preselected and privacy link points to the policy page", () => {
    renderForm();
    expect(screen.getByLabelText(/I agree that Maa Bijasan Finance/i)).not.toBeChecked();
    expect(screen.getByRole("link", { name: /privacy policy/i })).toHaveAttribute("href", "/privacy-policy");
  });

  it("does not offer Aadhaar / PAN / bank / OTP inputs", () => {
    renderForm();
    expect(screen.queryByLabelText(/aadhaar|pan\b|account|otp|password/i)).toBeNull();
  });

  it("blocks an empty submit, shows errors and never calls the service", async () => {
    configure();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderForm();
    await user.click(submitBtn());
    expect(await screen.findByText(/please enter your full name/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter your mobile number/i)).toBeInTheDocument();
    expect(screen.getByText(/please tick the consent box/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.queryByText(/thank you for your enquiry/i)).toBeNull();
  });

  it("blocks an incomplete mobile number with a clear message", async () => {
    configure();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderForm();
    await fillValid(user);
    const mobile = screen.getByLabelText(/mobile number/i);
    await user.clear(mobile);
    await user.type(mobile, "98765");
    await user.click(submitBtn());
    expect(await screen.findByText(/must be 10 digits/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows the thank-you panel after a CONFIRMED submission", async () => {
    configure();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({ ok: true })));
    const user = userEvent.setup();
    renderForm();
    await fillValid(user);
    await user.click(submitBtn());
    expect(await screen.findByRole("heading", { name: /thank you for your enquiry!/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /call our team/i })).toHaveAttribute("href", "tel:+918817071676");
    expect(screen.getByRole("button", { name: /back to home/i })).toBeInTheDocument();
  });

  it("shows an error, NOT success, when the service fails (HTTP 500)", async () => {
    configure();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({}, 500)));
    const user = userEvent.setup();
    renderForm();
    await fillValid(user);
    await user.click(submitBtn());
    expect(await screen.findByRole("alert")).toHaveTextContent(/could not be submitted/i);
    expect(screen.queryByText(/thank you for your enquiry/i)).toBeNull();
    expect(screen.getByLabelText(/full name/i)).toHaveValue("Ramesh Sharma"); // data kept so user can retry
  });

  it("shows an error, NOT success, on a network failure", async () => {
    configure();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    const user = userEvent.setup();
    renderForm();
    await fillValid(user);
    await user.click(submitBtn());
    expect(await screen.findByRole("alert")).toHaveTextContent(/internet connection/i);
    expect(screen.queryByText(/thank you for your enquiry/i)).toBeNull();
  });

  it("never shows success when no service is configured", async () => {
    vi.stubEnv("VITE_SUBMISSION_PROVIDER", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderForm();
    expect(screen.getByRole("note")).toHaveTextContent(/no submission service is configured/i);
    await fillValid(user);
    await user.click(submitBtn());
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.queryByText(/thank you for your enquiry/i)).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows a loading state and prevents duplicate submissions", async () => {
    configure();
    let release!: (r: Response) => void;
    const fetchMock = vi.fn().mockReturnValue(new Promise<Response>((res) => (release = res)));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderForm();
    await fillValid(user);
    await user.click(submitBtn());
    await user.click(screen.getByRole("button", { name: /submitting/i }));
    await user.keyboard("{Enter}");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /submitting/i })).toBeDisabled();
    release(json({ ok: true }));
    await waitFor(() => expect(screen.getByText(/thank you for your enquiry/i)).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not write customer data to web storage", async () => {
    configure();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(json({ ok: true })));
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const user = userEvent.setup();
    renderForm();
    await fillValid(user);
    await user.click(submitBtn());
    await screen.findByText(/thank you for your enquiry/i);
    expect(setItem).not.toHaveBeenCalled();
  });
});

describe("Loan category -> form preselection", () => {
  it.each([
    ["Personal Loan", "Personal Loan"],
    ["Business Loan", "Business Loan"],
    ["Home Loan", "Home Loan"],
    ["Loan Against Property", "Loan Against Property"],
    ["Vehicle Loan", "Vehicle Loan"],
    ["Other Loan Requirements", "Other"],
  ])("'Enquire Now' on %s preselects the loan type and scrolls to the form", async (cardTitle, expected) => {
    const user = userEvent.setup();
    render(<MemoryRouter><Home /></MemoryRouter>);
    const select = screen.getByLabelText(/loan type/i) as HTMLSelectElement;
    expect(select.value).toBe("");
    await user.click(screen.getByRole("button", { name: new RegExp(`enquire now about ${cardTitle}`, "i") }));
    expect(select.value).toBe(expected);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it("renders every required section heading on the home page", () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    for (const name of [
      /find loan options that fit your needs/i,
      /about maa bijasan finance/i,
      /explore our loan services/i,
      /why explore loan options with us/i,
      /how it works/i,
      /tell us about your loan requirements/i,
      /contact maa bijasan finance/i,
    ]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
    const services = screen.getByRole("heading", { name: /explore our loan services/i }).closest("section")!;
    expect(within(services).getAllByRole("button", { name: /enquire now/i })).toHaveLength(6);
  });
});
