import { site } from "./data.js";
export function validateEnquiry(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return { error: "Please complete all required fields." };
  const limits = { name: 120, phone: 40, email: 254, message: 5000 };
  const values = {};
  for (const [key, limit] of Object.entries(limits)) {
    if (typeof data[key] !== "string" || !data[key].trim() || data[key].length > limit) return { error: "Please complete all required fields within the allowed lengths." };
    values[key] = data[key].trim();
  }
  if (/[\r\n]/.test(values.name + values.email + values.phone) || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(values.email) || !/^[+\d\s().x-]{5,40}$/.test(values.phone)) return { error: "Please enter a valid email address and phone number." };
  const project = data.projectId ? site.projects.find(p => p.id === data.projectId) : null;
  if (data.projectId && !project) return { error: "Please select a valid project." };
  return { values, project };
}
export function buildEnquiryMail(values, project, from) {
  return {
    from,
    to: "hello@serendibcondos.com",
    replyTo: values.email,
    subject: project ? `Project enquiry: ${project.name}` : "Serendib Condos consultation enquiry",
    text: [project ? `Project: ${project.name}\nLocation: ${project.area}\nProject ID: ${project.id}` : "General consultation enquiry", `Name: ${values.name}`, `Phone: ${values.phone}`, `Email: ${values.email}`, `Message:\n${values.message}`].join("\n\n"),
  };
}
