"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
export default function EnquiryButton({ children, className = "button", projectId, projectName, onOpen }) {
  const dialog = useRef(null);
  const trigger = useRef(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  useEffect(() => { if (open && !dialog.current.open) dialog.current.showModal(); }, [open]);
  function close() { dialog.current?.close(); setOpen(false); trigger.current?.focus(); }
  async function submit(event) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending"); setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, projectId }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your enquiry could not be sent. Please try again.");
      setStatus("success");
    } catch (err) { setStatus("error"); setError(err.message); }
  }
  return <>
    <button ref={trigger} type="button" className={className} onClick={() => { onOpen?.(); setStatus("idle"); setError(""); setOpen(true); }}>{children}</button>
    {open && createPortal(<dialog ref={dialog} className="enquiry-dialog" aria-labelledby={projectId ? `enquiry-${projectId}` : undefined} aria-label={projectId ? undefined : "Book a consultation"} onCancel={close} onClose={() => setOpen(false)} onClick={(e) => {
      if (e.target !== dialog.current) return;
      const r = dialog.current.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close();
    }}>
      <button type="button" className="close-dialog flex items-center justify-center" aria-label="Close enquiry form" onClick={close}><X size={20} /></button>
      <h2 id={projectId ? `enquiry-${projectId}` : undefined}>{projectName ? "Enquire about this project" : "Book a consultation"}</h2>
      {projectName && <p>{projectName}</p>}
      {status === "success" ? <div role="status"><p className="form-success">Thank you. Your enquiry has been sent to our team.</p><button type="button" className="button mt-5" onClick={close}>Close</button></div> :
      <form className="enquiry-form" onSubmit={submit}>
        <label>Name<input name="name" autoComplete="name" required maxLength={120} autoFocus /></label>
        <div className="enquiry-pair">
          <label>Phone number<input name="phone" type="tel" autoComplete="tel" required minLength={5} maxLength={40} /></label>
          <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
        </div>
        <label>Message<textarea name="message" required maxLength={5000} rows={4} /></label>
        <label className="enquiry-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" className="button" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send enquiry"}</button>
      </form>}
    </dialog>, document.body)}
  </>;
}
