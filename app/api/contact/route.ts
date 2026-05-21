export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // For now, we'll just log the message and return success
    // In production, integrate with Resend, SendGrid, or your preferred email service
    console.log('Contact form submission:', { name, email, subject, message });

    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    // const response = await resend.emails.send({
    //   from: 'noreply@tumeloramaphosa.com',
    //   to: 't.ramaphosa@studex.dev',
    //   subject: `New contact: ${subject}`,
    //   html: `<p>From: ${name} (${email})</p><p>${message}</p>`,
    // });

    return new Response(JSON.stringify({ success: true, message: 'Message received' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
