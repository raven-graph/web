"use server";

import { Resend } from "resend";

export async function submitPartnershipInquiry(prevState: any, formData: FormData) {
    const rawData = {
        fundName: formData.get("fundName") as string,
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        aum: formData.get("aum") as string,
        strategy: formData.get("strategy") as string,
        note: formData.get("note") as string,
    };

    // Basic validation
    if (!rawData.email || !rawData.name) {
        return {
            success: false,
            message: "Please fill in all required fields.",
        };
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        console.error("Missing RESEND_API_KEY environment variable");
        return {
            success: false,
            message: "Configuration error: Email service not set up.",
        };
    }

    const resend = new Resend(apiKey);

    try {
        const { data, error } = await resend.emails.send({
            from: "RavenGraph Partnership <onboarding@resend.dev>", // Or your verified domain
            to: ["gabriel@ravengraph.com"], // Hardcoded for now as requested
            subject: `Partnership Inquiry: ${rawData.fundName || "New Fund"}`,
            html: `
        <h1>New Partnership Inquiry</h1>
        <p><strong>Name:</strong> ${rawData.name}</p>
        <p><strong>Email:</strong> ${rawData.email}</p>
        <p><strong>Fund Name:</strong> ${rawData.fundName}</p>
        <p><strong>AUM:</strong> ${rawData.aum}</p>
        <p><strong>Strategy:</strong> ${rawData.strategy}</p>
        <p><strong>Note:</strong> ${rawData.note}</p>
      `,
        });

        if (error) {
            console.error("Resend Error:", error);
            return {
                success: false,
                message: "Failed to send inquiry. Please try again later.",
            };
        }

        return {
            success: true,
            message: "Inquiry received. We'll be in touch shortly.",
        };
    } catch (error) {
        console.error("Submission Error:", error);
        return {
            success: false,
            message: "An unexpected error occurred.",
        };
    }
}
