# Stable SMP Info Server

Next.js site for Stable SMP with:
- IGN login gate
- server info and rules
- market board with Minecraft item icons and pagination
- optional Discord login-event logging (with user consent)

## Environment Variables

Create a `.env.local` file in the project root:

```bash
DISCORD_WEBHOOK_URL=your_discord_webhook_url_here
```

Without this variable, consented login events will not be delivered.
