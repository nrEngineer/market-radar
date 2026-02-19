/**
 * Discord Webhook Notification System
 * Sends alerts, errors, and operational events to a Discord channel.
 *
 * Setup: Set DISCORD_WEBHOOK_URL environment variable with your Discord webhook URL.
 * Get it from Discord > Server Settings > Integrations > Webhooks > New Webhook > Copy URL
 */

type Severity = 'info' | 'warning' | 'error' | 'critical'

interface NotifyOptions {
  title: string
  description: string
  severity: Severity
  fields?: { name: string; value: string; inline?: boolean }[]
  footer?: string
}

const SEVERITY_CONFIG: Record<Severity, { color: number; emoji: string }> = {
  info:     { color: 0x3b82f6, emoji: 'ℹ️' },
  warning:  { color: 0xf59e0b, emoji: '⚠️' },
  error:    { color: 0xef4444, emoji: '❌' },
  critical: { color: 0x991b1b, emoji: '🚨' },
}

async function sendToDiscord(options: NotifyOptions): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) {
    console.warn('[Discord] DISCORD_WEBHOOK_URL not configured, skipping notification')
    return
  }

  const config = SEVERITY_CONFIG[options.severity]

  const embed = {
    title: `${config.emoji} ${options.title}`,
    description: options.description,
    color: config.color,
    fields: options.fields?.map(f => ({
      name: f.name,
      value: f.value.slice(0, 1024), // Discord field value limit
      inline: f.inline ?? false,
    })) || [],
    footer: {
      text: options.footer || `Market Radar • ${new Date().toISOString()}`,
    },
    timestamp: new Date().toISOString(),
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Market Radar Monitor',
        embeds: [embed],
      }),
    })

    if (!response.ok) {
      console.error(`[Discord] Webhook failed: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    // Never let monitoring failures break the application
    console.error('[Discord] Failed to send notification:', error)
  }
}

// --- Public API ---

export async function notifyError(
  errorOrEndpoint: Error | string,
  contextOrMessage?: { endpoint?: string; userId?: string; requestId?: string } | string
): Promise<void> {
  // Overload: notifyError(endpoint: string, message: string)
  if (typeof errorOrEndpoint === 'string' && typeof contextOrMessage === 'string') {
    await sendToDiscord({
      title: 'Application Error',
      description: contextOrMessage,
      severity: 'error',
      fields: [
        { name: 'Endpoint', value: errorOrEndpoint, inline: true },
      ],
    })
    return
  }

  // Original: notifyError(error: Error | string, context?)
  const error = errorOrEndpoint
  const context = typeof contextOrMessage === 'object' ? contextOrMessage : undefined
  const errorMessage = error instanceof Error ? error.message : error
  const errorStack = error instanceof Error ? error.stack?.slice(0, 500) : undefined

  await sendToDiscord({
    title: 'Application Error',
    description: errorMessage,
    severity: 'error',
    fields: [
      ...(context?.endpoint ? [{ name: 'Endpoint', value: context.endpoint, inline: true }] : []),
      ...(context?.userId ? [{ name: 'User', value: context.userId, inline: true }] : []),
      ...(context?.requestId ? [{ name: 'Request ID', value: context.requestId, inline: true }] : []),
      ...(errorStack ? [{ name: 'Stack Trace', value: `\`\`\`\n${errorStack}\n\`\`\`` }] : []),
    ],
  })
}

export async function notifyCritical(
  message: string,
  details?: Record<string, string>
): Promise<void> {
  await sendToDiscord({
    title: 'CRITICAL ALERT',
    description: message,
    severity: 'critical',
    fields: details
      ? Object.entries(details).map(([name, value]) => ({ name, value, inline: true }))
      : [],
  })
}

export async function notifyAPIHealth(status: {
  healthy: boolean
  dbLatency?: number
  errorRate?: number
  details?: string
}): Promise<void> {
  await sendToDiscord({
    title: status.healthy ? 'Health Check OK' : 'Health Check FAILED',
    description: status.details || (status.healthy ? 'All systems operational' : 'System degradation detected'),
    severity: status.healthy ? 'info' : 'warning',
    fields: [
      ...(status.dbLatency !== undefined
        ? [{ name: 'DB Latency', value: `${status.dbLatency}ms`, inline: true }]
        : []),
      ...(status.errorRate !== undefined
        ? [{ name: 'Error Rate', value: `${status.errorRate}%`, inline: true }]
        : []),
    ],
  })
}

export async function notifyRateLimit(
  clientIP: string,
  endpoint: string
): Promise<void> {
  await sendToDiscord({
    title: 'Rate Limit Triggered',
    description: `Client exceeded rate limit on ${endpoint}`,
    severity: 'warning',
    fields: [
      { name: 'Client IP', value: clientIP, inline: true },
      { name: 'Endpoint', value: endpoint, inline: true },
    ],
  })
}

export async function notifyDeploy(
  version: string,
  environment: string
): Promise<void> {
  await sendToDiscord({
    title: 'Deployment Complete',
    description: `New version deployed to ${environment}`,
    severity: 'info',
    fields: [
      { name: 'Version', value: version, inline: true },
      { name: 'Environment', value: environment, inline: true },
    ],
  })
}

export async function notifyDataCollection(result: {
  totalSources: number
  successCount: number
  errorCount: number
  totalItems: number
}): Promise<void> {
  const severity: Severity = result.errorCount > 0
    ? (result.successCount === 0 ? 'error' : 'warning')
    : 'info'

  await sendToDiscord({
    title: 'Data Collection Report',
    description: `Collected ${result.totalItems} items from ${result.totalSources} sources`,
    severity,
    fields: [
      { name: 'Sources', value: String(result.totalSources), inline: true },
      { name: 'Success', value: String(result.successCount), inline: true },
      { name: 'Errors', value: String(result.errorCount), inline: true },
      { name: 'Items', value: String(result.totalItems), inline: true },
    ],
  })
}
