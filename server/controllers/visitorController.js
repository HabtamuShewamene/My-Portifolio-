import { trackVisitor } from '../models/jsonStore.js';

export async function getVisitor(req, res, next) {
  try {
    const snapshot = await trackVisitor(req.ip);
    return res.json({ ok: true, data: snapshot });
  } catch (error) {
    return next(error);
  }
}
