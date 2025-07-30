import { Router } from "express";
import { askAgentController, createAgentController, getAgentController, getAgentsController } from "../controllers/agents";
import { adminAuth } from "../middleware/adminAuth";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Agent:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - type
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the agent
 *         name:
 *           type: string
 *           description: Agent's name
 *         type:
 *           type: string
 *           enum: [Sales, Support, Marketing]
 *           description: Agent's type or role
 *         status:
 *           type: string
 *           enum: [Active, Inactive]
 *           description: Agent's current status
 *         description:
 *           type: string
 *           description: Optional agent description
 *       example:
 *         id: "abc123def456"
 *         name: "Hotel Sales Agent"
 *         type: "Sales"
 *         status: "Active"
 *         description: "Handles hotel bookings and sales inquiries"
 *     
 *     AgentInput:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - status
 *       properties:
 *         name:
 *           type: string
 *           description: Agent's name
 *         type:
 *           type: string
 *           enum: [Sales, Support, Marketing]
 *           description: Agent's type or role
 *         status:
 *           type: string
 *           enum: [Active, Inactive]
 *           description: Agent's current status
 *         description:
 *           type: string
 *           description: Optional agent description
 *       example:
 *         name: "Hotel Sales Agent"
 *         type: "Sales"
 *         status: "Active"
 *         description: "Handles hotel bookings and sales inquiries"
 *     
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *         details:
 *           type: string
 *           description: Additional error details
 *       example:
 *         error: "Agent not found"
 *         details: "No agent found with the specified ID"
 *     
 *     AgentQuestion:
 *       type: object
 *       required:
 *         - question
 *       properties:
 *         question:
 *           type: string
 *           description: The question to ask the agent
 *       example:
 *         question: "What are your check-in and check-out times?"
 *     
 *     AgentAnswer:
 *       type: object
 *       properties:
 *         answer:
 *           type: string
 *           description: The agent's response to the question
 *       example:
 *         answer: "Our standard check-in time is 3:00 PM and check-out time is 11:00 AM. Early check-in and late check-out may be available upon request and subject to availability."
 */

/**
 * @swagger
 * /api/agents:
 *   get:
 *     summary: Get all agents
 *     description: Retrieve a list of all available agents from the database
 *     tags: [Agents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved agents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 agents:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Agent'
 *             example:
 *               agents:
 *                 - id: "abc123def456"
 *                   name: "Hotel Sales Agent"
 *                   type: "Sales"
 *                   status: "Active"
 *                   description: "Handles hotel bookings and sales inquiries"
 *                 - id: "ghi789jkl012"
 *                   name: "Customer Support Agent"
 *                   type: "Support"
 *                   status: "Active"
 *       401:
 *         description: Unauthorized - Invalid or missing admin token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Auth: Invalid admin token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Failed to retrieve agents"
 *               details: "Database connection error"
 */
router.get('/agents', adminAuth, getAgentsController)

/**
 * @swagger
 * /api/agents:
 *   post:
 *     summary: Create a new agent
 *     description: Create a new agent with the provided information. The agent ID will be automatically generated.
 *     tags: [Agents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgentInput'
 *           example:
 *             name: "Hotel Sales Agent"
 *             type: "Sales"
 *             status: "Active"
 *             description: "Handles hotel bookings and sales inquiries"
 *     responses:
 *       201:
 *         description: Agent successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 agent:
 *                   $ref: '#/components/schemas/Agent'
 *             example:
 *               agent:
 *                 id: "abc123def456"
 *                 name: "Hotel Sales Agent"
 *                 type: "Sales"
 *                 status: "Active"
 *                 description: "Handles hotel bookings and sales inquiries"
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Invalid body"
 *               details: "Expected string, received number at 'name'"
 *       401:
 *         description: Unauthorized - Invalid or missing admin token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Auth: Invalid admin token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Failed to create agent"
 *               details: "Database write operation failed"
 */
router.post('/agents', adminAuth, createAgentController)

/**
 * @swagger
 * /api/agents/{id}:
 *   get:
 *     summary: Get agent by ID
 *     description: Retrieve a specific agent by their unique identifier
 *     tags: [Agents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the agent
 *         schema:
 *           type: string
 *         example: "abc123def456"
 *     responses:
 *       200:
 *         description: Successfully retrieved agent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 agent:
 *                   $ref: '#/components/schemas/Agent'
 *             example:
 *               agent:
 *                 id: "abc123def456"
 *                 name: "Hotel Sales Agent"
 *                 type: "Sales"
 *                 status: "Active"
 *                 description: "Handles hotel bookings and sales inquiries"
 *       400:
 *         description: Bad request - Invalid or missing agent ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Invalid input. Agent ID is required."
 *       401:
 *         description: Unauthorized - Invalid or missing admin token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Auth: Invalid admin token"
 *       404:
 *         description: Agent not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Agent not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Failed to retrieve agent"
 *               details: "Database query failed"
 */
router.get('/agents/:id', adminAuth, getAgentController)

/**
 * @swagger
 * /api/agents/{id}/ask:
 *   post:
 *     summary: Ask a question to an agent
 *     description: Submit a question to a specific support agent and receive an answer based on the hotel FAQ database. Only active support agents can answer questions.
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the support agent
 *         schema:
 *           type: string
 *         example: "abc123def456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgentQuestion'
 *           example:
 *             question: "Any attractions nearby?"
 *     responses:
 *       200:
 *         description: Successfully received answer from agent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AgentAnswer'
 *             example:
 *               answer: "Nearby attractions include Bergkirchli (0.3 miles), Kursaal Arosa (0.7 miles), and Schmid Sport (0.09 miles)."
 *       400:
 *         description: Bad request - Invalid input data or agent constraints
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalid_input:
 *                 summary: Invalid input
 *                 value:
 *                   error: "Invalid body: Expected string, received number at 'question'"
 *               wrong_agent_type:
 *                 summary: Non-support agent
 *                 value:
 *                   error: "Failed to ask agent: Only support agents can answer questions"
 *               inactive_agent:
 *                 summary: Inactive agent
 *                 value:
 *                   error: "Failed to ask agent: Inactive agents cannot answer questions"
 *       404:
 *         description: Agent not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Agent not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Failed to retrieve agent"
 *               details: "Database query failed"
 */
router.post('/agents/:id/ask', askAgentController)

export default router;