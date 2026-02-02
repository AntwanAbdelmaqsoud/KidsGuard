import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";

import { getAudioBySerialNumber } from "../controllers/audioController";

const router = Router(); // api/audio/

/**
 * @openapi
 * /api/audio/{serialNumber}:
 *   get:
 *     summary: Get the most recent recorded audio by watch serial number
 *     tags:
 *       - Audio
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: serialNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Watch serial number
 *     responses:
 *       200:
 *         description: Latest recorded audio data for the watch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 serialNumber:
 *                   type: string
 *                 recordedAudio:
 *                   type: string
 *                   description: Base64-encoded audio payload
 *                   nullable: true
 *                 emotion:
 *                   type: string
 *                   nullable: true
 *                 confidence:
 *                   type: number
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Serial number is required
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden - user does not own this watch
 *       500:
 *         description: Error retrieving audio data
 */
router.get("/:serialNumber", isAuthenticated, getAudioBySerialNumber);

// router.delete("/:audioId", isAuthenticated, deleteAudioById);

export default router;
