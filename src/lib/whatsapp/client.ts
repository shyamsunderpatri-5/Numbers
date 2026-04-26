// src/lib/whatsapp/client.ts
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

const client = twilio(accountSid, authToken);

export async function sendWhatsApp(to: string, message: string) {
  try {
    const response = await client.messages.create({
      from: whatsappNumber,
      to: `whatsapp:${to}`,
      body: message
    });
    return response.sid;
  } catch (error: any) {
    console.error('WhatsApp Send Error:', error.message);
    throw error;
  }
}

// src/lib/whatsapp/daily-message-builder.ts
export function buildDailyWhatsAppMessage(params: {
  name: string;
  personalDay: number;
  personalDayMeaning: string;
  panchangVerdict: string;
  actionTask: string;
  language: string;
}) {
  const templates: Record<string, string> = {
    en: `Good morning *${params.name}*! 🔯

Today is Personal Day *${params.personalDay}* — ${params.personalDayMeaning}

Panchang: ${params.panchangVerdict}
Cosmic Weather: Highly Auspicious

Your Task: ${params.actionTask}

Reply STOP to unsubscribe.`,
    hi: `शुभ प्रभात *${params.name}*! 🔯

आज आपका व्यक्तिगत दिन *${params.personalDay}* है — ${params.personalDayMeaning}

पंचांग: ${params.panchangVerdict}

आज का कार्य: ${params.actionTask}

अनसब्सक्राइब करने के लिए STOP लिखें।`
  };

  return templates[params.language] || templates.en;
}
