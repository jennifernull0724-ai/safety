import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send welcome email after successful purchase
 * 
 * @param email - Customer email address
 * @param name - Customer name (optional)
 * @returns Promise<boolean> - Success status
 */
export async function sendWelcomeEmail(email: string, name?: string): Promise<boolean> {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      replyTo: process.env.EMAIL_REPLY_TO!,
      subject: 'Welcome to T-REX - Your Account is Ready',
      react: null, // Use template ID instead
      // @ts-ignore - Resend template support
      template: process.env.RESEND_WELCOME_TEMPLATE_ID!,
      // Template variables (if your Resend template uses them)
      ...(name && { 
        // @ts-ignore
        templateData: { name } 
      }),
    });

    if (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }

    console.log('Welcome email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Welcome email error:', error);
    return false;
  }
}
