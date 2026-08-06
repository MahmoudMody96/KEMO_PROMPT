// src/services/creditsService.js — Read-only credit view + project storage.
//
// Credits are spent by the server as part of the same request that calls the
// AI. Nothing here deducts anything: a browser-side deduction is advisory at
// best and trivially skipped at worst.

import { account, projects as projectsApi } from '../lib/apiClient';

// Mirrors server/src/lib/credits.js. Display only — the server prices every action.
export const CREDIT_COSTS = Object.freeze({
    brainstorm: 1,
    generate: 3,
    extract: 2,
    trend_search: 1,
    architect: 2,
});

// Display metadata for a plan key as STORED BY THE SERVER (users.plan).
//
// Note the key/label split: the checkout tier sold as "Premium" on PricingPage
// is stored as `enterprise` — billing.js maps premium -> enterprise, and the DB
// CHECK constraint only accepts free|basic|pro|enterprise. So the key here is
// `enterprise` while the label must read "Premium", or someone buys Premium and
// their profile badge says Enterprise.
//
// Only `name`, `name_ar` and `credits_monthly` are read (App.jsx). `price_monthly`
// and `features` are NOT rendered anywhere — PricingPage carries its own pricing
// copy, and the authoritative price is whatever the LemonSqueezy variant charges.
export const PLANS = {
    free: {
        name: 'Free',
        name_ar: 'مجاني',
        credits_monthly: 20,
        price_monthly: 0,
        features: ['20 credits on signup', 'Basic models', 'Community support'],
        features_ar: ['20 رصيد عند التسجيل', 'نماذج أساسية', 'دعم مجتمعي'],
    },
    basic: {
        name: 'Basic',
        name_ar: 'الأساسي',
        credits_monthly: 200,
        price_monthly: 6.99,
        features: ['200 credits/month', 'Full Prompt Architect', 'Trend Hunter', 'Email support'],
        features_ar: ['200 رصيد/شهر', 'مهندس البرومبت الكامل', 'صيّاد الترندات', 'دعم بالبريد'],
    },
    pro: {
        name: 'Professional',
        name_ar: 'المحترف',
        credits_monthly: 500,
        price_monthly: 14.99,
        features: ['500 credits/month', 'Premium models', 'Priority support', 'Export history'],
        features_ar: ['500 رصيد/شهر', 'نماذج متقدمة', 'دعم أولوية', 'تصدير التاريخ'],
    },
    // Sold as "Premium" on the pricing page; stored as `enterprise`.
    enterprise: {
        name: 'Premium',
        name_ar: 'المميز',
        credits_monthly: 9999,
        price_monthly: 39.99,
        features: ['Effectively unlimited credits', 'All models', 'API access', 'Team features'],
        features_ar: ['رصيد شبه غير محدود', 'كل النماذج', 'وصول API', 'ميزات الفريق'],
    },
};

/**
 * Current balance, or null when it cannot be determined.
 * Callers must treat null as "unknown", not as "unlimited".
 */
export async function getCreditBalance() {
    try {
        return await account.credits();
    } catch (err) {
        console.error('Balance check error:', err.message);
        return null;
    }
}

/** Recent credit movements (audit trail). */
export async function getCreditHistory(limit = 20) {
    try {
        const { transactions } = await account.transactions(limit);
        return transactions || [];
    } catch (err) {
        console.error('Credit history error:', err.message);
        return [];
    }
}

/** Usage totals per action, for the profile screen. */
export async function getUsageSummary() {
    try {
        const { usage } = await account.usage();
        return (usage || []).reduce((totals, row) => {
            totals[row.action_type] = row.credits;
            return totals;
        }, {});
    } catch (err) {
        console.error('Usage summary error:', err.message);
        return {};
    }
}

/** Save a project. */
export async function saveProject(projectData) {
    try {
        const { project } = await projectsApi.create(projectData);
        return project;
    } catch (err) {
        console.error('Save project error:', err.message);
        return null;
    }
}

/** Load the user's projects, newest first. */
export async function loadProjects(limit = 20) {
    try {
        const { projects } = await projectsApi.list(limit);
        return projects || [];
    } catch (err) {
        console.error('Load projects error:', err.message);
        return [];
    }
}

export async function deleteProject(id) {
    try {
        await projectsApi.remove(id);
        return true;
    } catch (err) {
        console.error('Delete project error:', err.message);
        return false;
    }
}
