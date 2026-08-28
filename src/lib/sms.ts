/**
 * Bangladesh SMS Notification Gateway Client
 * Supports Greenweb BD / BulkSMSBD / Alpha SMS / Custom Gateway API
 */

export interface SendSmsParams {
  to: string; // "017XXXXXXXX" or "88017XXXXXXXX"
  message: string;
}

export interface SmsResult {
  success: boolean;
  messageId?: string;
  response?: string;
  error?: string;
}

export function formatBdPhone(phone: string): string {
  let clean = phone.replace(/\D/g, "");
  if (clean.startsWith("880")) return clean;
  if (clean.startsWith("0")) return `88${clean}`;
  return `880${clean}`;
}

export async function sendBangladeshSms({ to, message }: SendSmsParams): Promise<SmsResult> {
  const apiKey = process.env.SMS_API_KEY;
  const senderId = process.env.SMS_SENDER_ID || "JerseyVerse";
  const formattedPhone = formatBdPhone(to);

  // In development / demo or when API token is not yet provided, log cleanly to console
  if (!apiKey) {
    console.log(`[SMS DISPATCH SIMULATION] To: ${formattedPhone} | Message: "${message}"`);
    return {
      success: true,
      messageId: `SIM-SMS-${Date.now()}`,
      response: "SMS logged in simulated dispatch mode",
    };
  }

  try {
    // Standard Greenweb / BulkSMSBD REST API format
    const url = `http://api.greenweb.com.bd/api.php?token=${encodeURIComponent(
      apiKey
    )}&to=${formattedPhone}&message=${encodeURIComponent(message)}`;

    const response = await fetch(url);
    const text = await response.text();

    return {
      success: response.ok,
      response: text,
    };
  } catch (error: any) {
    console.error("SMS dispatch error:", error);
    return {
      success: false,
      error: error.message || "Failed to dispatch SMS",
    };
  }
}

/**
 * Pre-formatted Matchday Notification Templates
 */
export async function sendOrderConfirmationSms(
  phone: string,
  orderNumber: string,
  totalBdt: number
) {
  const msg = `Jersey verse: Your matchday commission #${orderNumber} (৳${totalBdt.toLocaleString()} BDT) is registered! Upfront TrxID is queued for instant verification. Track live: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://j2-production.vercel.app'}/track?orderNumber=${orderNumber}`;
  return sendBangladeshSms({ to: phone, message: msg });
}

export async function sendDispatchSms(
  phone: string,
  orderNumber: string,
  consignmentId: string,
  courier: string = "Steadfast Courier"
) {
  const msg = `Jersey verse: Your matchday armor #${orderNumber} has been verified and DISPATCHED via ${courier}! Tracking: ${consignmentId}. Live status: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://j2-production.vercel.app'}/track?orderNumber=${orderNumber}`;
  return sendBangladeshSms({ to: phone, message: msg });
}
