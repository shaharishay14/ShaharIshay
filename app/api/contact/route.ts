import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Send notification email to you using Resend
    const { data: notificationData, error: notificationError } =
      await resend.emails.send({
        from: "Website Contact <noreply@supersave-ai.com>",
        to: ["shaharishay@supersave-ai.com"],
        subject: `New message from ${name}`,
        replyTo: email,
        html: `
        <div style="font-family: monospace; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; border: 2px solid #333; padding: 20px;">
            <h2 style="margin-top: 0; color: #333; border-bottom: 2px solid #ff6b6b; padding-bottom: 10px;">
              NEW CONTACT FORM SUBMISSION
            </h2>

            <div style="margin: 20px 0;">
              <p style="margin: 10px 0;">
                <strong style="color: #ff6b6b;">NAME:</strong><br/>
                ${name}
              </p>

              <p style="margin: 10px 0;">
                <strong style="color: #ff6b6b;">EMAIL:</strong><br/>
                <a href="mailto:${email}" style="color: #333;">${email}</a>
              </p>

              <p style="margin: 10px 0;">
                <strong style="color: #ff6b6b;">MESSAGE:</strong><br/>
                <span style="white-space: pre-wrap;">${message}</span>
              </p>
            </div>

            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
              <p style="margin: 0;">You can reply directly to this email to respond to ${name}</p>
            </div>
          </div>
        </div>
      `,
      });

    if (notificationError) {
      console.error("Resend notification error:", notificationError);
      return NextResponse.json(
        { error: notificationError.message },
        { status: 500 }
      );
    }

    // Send auto-reply confirmation email to the user
    const { error: autoReplyError } = await resend.emails.send({
      from: "Shahar Ishay <noreply@supersave-ai.com>",
      to: [email],
      subject: "Thanks for reaching out!",
      html: `
        <div style="font-family: monospace; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; border: 4px solid #333; padding: 30px; position: relative;">
            <!-- Corner accents -->
            <div style="position: absolute; top: 0; left: 0; width: 16px; height: 16px; border-top: 4px solid #ff6b6b; border-left: 4px solid #ff6b6b;"></div>
            <div style="position: absolute; top: 0; right: 0; width: 16px; height: 16px; border-top: 4px solid #ff6b6b; border-right: 4px solid #ff6b6b;"></div>
            <div style="position: absolute; bottom: 0; left: 0; width: 16px; height: 16px; border-bottom: 4px solid #c93b3b; border-left: 4px solid #c93b3b;"></div>
            <div style="position: absolute; bottom: 0; right: 0; width: 16px; height: 16px; border-bottom: 4px solid #c93b3b; border-right: 4px solid #c93b3b;"></div>

            <h1 style="margin-top: 0; font-size: 32px; font-weight: 900; color: #333; text-transform: uppercase; letter-spacing: -1px;">
              MESSAGE RECEIVED
            </h1>

            <div style="border-left: 4px solid #c93b3b; padding-left: 20px; margin: 20px 0;">
              <p style="font-size: 14px; color: #666; line-height: 1.6; margin: 0;">
                [ THANK YOU FOR REACHING OUT ]<br/>
                [ I'LL GET BACK TO YOU SOON ]<br/>
                [ CHECK YOUR INBOX IN 24-48H ]
              </p>
            </div>

            <p style="font-size: 14px; color: #333; line-height: 1.6;">
              Hi <strong>${name}</strong>,
            </p>

            <p style="font-size: 14px; color: #333; line-height: 1.6;">
              Thanks for getting in touch! I've received your message and will respond as soon as possible.
            </p>

            <p style="font-size: 14px; color: #333; line-height: 1.6;">
              In the meantime, feel free to check out my projects and connect with me on social media.
            </p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd;">
              <p style="font-size: 12px; color: #666; margin: 5px 0;">
                <strong>Shahar Ishay</strong>
              </p>
              <p style="font-size: 12px; color: #666; margin: 5px 0;">
                > Full Stack Developer<br/>
                > CS Student<br/>
                > Founder of SuperSave
              </p>
              <div style="margin-top: 15px;">
                <a href="https://github.com/shaharishay14" style="color: #ff6b6b; text-decoration: none; font-size: 12px; margin-right: 15px;">GITHUB</a>
                <a href="https://x.com/shahar_ishay14?s=21&t=pHYwv3OZuImbn_TGDDxPIQ" style="color: #ff6b6b; text-decoration: none; font-size: 12px; margin-right: 15px;">X</a>
                <a href="https://www.linkedin.com/in/shahar-ishay-831762303/" style="color: #ff6b6b; text-decoration: none; font-size: 12px;">LINKEDIN</a>
              </div>
            </div>

            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 11px; color: #999; text-align: center;">
              <p style="margin: 0;">[ ONLINE ] - This is an automated response</p>
            </div>
          </div>
        </div>
      `,
    });

    if (autoReplyError) {
      console.error("Auto-reply error:", autoReplyError);
      // Don't fail the whole request if auto-reply fails
    }

    return NextResponse.json(
      { success: true, data: notificationData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
