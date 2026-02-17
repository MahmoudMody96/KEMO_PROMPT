// api/health.js — Vercel Serverless Function
// Health check endpoint

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.VERCEL_ENV || 'development'
    });
}
