import nodemailer from "nodemailer";
import { validateEnquiry, buildEnquiryMail } from "@/lib/enquiry";
export const runtime = "nodejs";
export async function POST(request) {
  const origin = request.headers.get("origin");
  // A same-origin browser form only; no permissive cross-origin submission.
  if (origin) {
    let sameOrigin = false;
    try {
      const parsed = new URL(origin);
      sameOrigin = ["http:", "https:"].includes(parsed.protocol) && (origin === new URL(request.url).origin || parsed.host === request.headers.get("host"));
    } catch {}
    if (!sameOrigin) return Response.json({ error: "Please submit the form from this website." }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) return Response.json({ error: "Invalid request format." }, { status: 415 });
  let data;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).length > 16000) return Response.json({ error: "Your message is too long." }, { status: 413 });
    data = JSON.parse(text);
  } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  if (data?.website) return Response.json({ error: "Your enquiry could not be sent." }, { status: 400 });
  const result = validateEnquiry(data);
  if (result.error) return Response.json({ error: result.error }, { status: 400 });
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD || !process.env.SMTP_FROM) return Response.json({ error: "Our enquiry service is temporarily unavailable. Please email hello@serendibcondos.com." }, { status: 503 });
  const port = Number(process.env.SMTP_PORT || 587);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    requireTLS: port !== 465 && process.env.SMTP_SECURE !== "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
    disableFileAccess: true, disableUrlAccess: true,
  });
  try {
    const delivery = await transport.sendMail(buildEnquiryMail(result.values, result.project, process.env.SMTP_FROM));
    if (!delivery.accepted?.length || delivery.rejected?.length) throw new Error("Recipient not accepted");
    return Response.json({ ok: true });
  } catch { return Response.json({ error: "Your enquiry could not be sent. Please try again or email hello@serendibcondos.com." }, { status: 502 }); }
  finally { transport.close(); }
}
