// server/src/routes/projects.js — Saved generations.
//
// Every query is scoped by req.user.id. That scoping IS the authorization —
// there is no RLS behind it to catch a mistake here.

import express from 'express';
import { query, queryOne } from '../db.js';
import { requireAuth } from '../auth/middleware.js';

const router = express.Router();

const MAX_LIMIT = 100;
// credits_used is deliberately NOT here: it is a billing-named column and the
// client has no business writing it. Nothing aggregates projects.credits_used
// today, but leaving a user-writable accounting field in a mass-assignment
// allowlist is a landmine for whatever reads it next.
const EDITABLE = [
    'title', 'core_idea', 'genre', 'video_style', 'character_type', 'specific_object',
    'voice_tone', 'aspect_ratio', 'num_characters', 'num_scenes', 'duration',
    'generated_idea', 'generated_blueprint', 'status', 'is_favorite',
];

router.use(requireAuth);

// --- GET /api/projects -------------------------------------------------
router.get('/', async (req, res) => {
    try {
        const limit = Math.max(1, Math.min(parseInt(req.query.limit, 10) || 20, MAX_LIMIT));
        const { rows } = await query(
            `SELECT * FROM projects WHERE user_id = $1
             ORDER BY created_at DESC LIMIT $2`,
            [req.user.id, limit]
        );
        return res.json({ projects: rows });
    } catch (err) {
        console.error('[PROJECTS] list failed:', err.message);
        return res.status(500).json({ error: 'Could not load your projects' });
    }
});

// --- POST /api/projects ------------------------------------------------
router.post('/', async (req, res) => {
    try {
        const body = req.body || {};
        const columns = ['user_id'];
        const values = [req.user.id];

        for (const field of EDITABLE) {
            if (body[field] === undefined) continue;
            columns.push(field);
            values.push(body[field]);
        }

        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
        const row = await queryOne(
            `INSERT INTO projects (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`,
            values
        );
        return res.status(201).json({ project: row });
    } catch (err) {
        console.error('[PROJECTS] create failed:', err.message);
        return res.status(500).json({ error: 'Could not save your project' });
    }
});

// --- PATCH /api/projects/:id -------------------------------------------
router.patch('/:id', async (req, res) => {
    try {
        const body = req.body || {};
        const sets = [];
        const values = [];

        for (const field of EDITABLE) {
            if (body[field] === undefined) continue;
            values.push(body[field]);
            sets.push(`${field} = $${values.length}`);
        }
        if (!sets.length) return res.status(400).json({ error: 'Nothing to update' });

        values.push(req.params.id, req.user.id);
        const row = await queryOne(
            `UPDATE projects SET ${sets.join(', ')}
             WHERE id = $${values.length - 1} AND user_id = $${values.length}
             RETURNING *`,
            values
        );
        if (!row) return res.status(404).json({ error: 'Project not found' });
        return res.json({ project: row });
    } catch (err) {
        console.error('[PROJECTS] update failed:', err.message);
        return res.status(500).json({ error: 'Could not update your project' });
    }
});

// --- DELETE /api/projects/:id ------------------------------------------
router.delete('/:id', async (req, res) => {
    try {
        const { rowCount } = await query(
            'DELETE FROM projects WHERE id = $1 AND user_id = $2',
            [req.params.id, req.user.id]
        );
        if (!rowCount) return res.status(404).json({ error: 'Project not found' });
        return res.json({ ok: true });
    } catch (err) {
        console.error('[PROJECTS] delete failed:', err.message);
        return res.status(500).json({ error: 'Could not delete your project' });
    }
});

export default router;
