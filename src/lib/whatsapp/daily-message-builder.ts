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
    en: `Good morning *${params.name}*! 🔯\n\nToday is Personal Day *${params.personalDay}* — ${params.personalDayMeaning}\n\nPanchang: ${params.panchangVerdict}\nCosmic Weather: Highly Auspicious\n\nYour Task: ${params.actionTask}\n\nReply STOP to unsubscribe.`,
    hi: `शुभ प्रभात *${params.name}*! 🔯\n\nआज आपका व्यक्तिगत दिन *${params.personalDay}* है — ${params.personalDayMeaning}\n\nपंचांग: ${params.panchangVerdict}\n\nआज का कार्य: ${params.actionTask}\n\nअनसब्सक्राइब करने के लिए STOP लिखें।`
  };

  return templates[params.language] || templates.en;
}
