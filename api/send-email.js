// We'll use Resend (a free email service) for this.
// You must install it in your project by running: npm install resend
import { Resend } from 'resend';

// This is Vercel's required export for a serverless function
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  // Initialize Resend with your API key from Vercel's environment variables
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  try {
    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'Cygnatrix Website <onboarding@resend.dev>', // Resend's free plan sends from this
      to: ['cygnatrix@gmail.com'], // YOUR email address
      reply_to: email, // Set the sender's email as the reply-to
      subject: `New Contact Form Subject: ${subject}`,
      html: `
        <p>You have a new contact form submission:</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ success: false, error: 'Error sending email.' });
    }

    // Success
    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error.' });
  }
}