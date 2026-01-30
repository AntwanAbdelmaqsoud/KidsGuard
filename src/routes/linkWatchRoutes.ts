import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { linkWatchToUser } from "../controllers/linkWatchController";

const router = Router(); //api/link-watch/

/**
 * @openapi
 * /api/link-watch:
 *   post:
 *     summary: Link a watch to the authenticated user
 *     tags:
 *       - Link Watch
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serialNumber
 *             properties:
 *               serialNumber:
 *                 type: string
 *                 description: Serial number of the watch to link
 *     responses:
 *       200:
 *         description: Watch linked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 serialNumbers:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Serial number is required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       409:
 *         description: Watch already linked to this user
 *       500:
 *         description: Failed to link watch
 */
router.post("/", isAuthenticated, linkWatchToUser);

export default router;
