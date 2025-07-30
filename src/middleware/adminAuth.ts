import { RequestHandler } from 'express';
import { handleApiError } from '../utils/apiUtils';
import { errored } from '../utils/probablyUtils';
import { config } from '../config/env';

export const adminAuth: RequestHandler = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const adminToken = config.ADMIN_TOKEN;

    // Check if authorization header is present
    if (!authHeader) {
        const errorHandler = handleApiError(errored('Missing authorization header', 'expected'), 'Auth: ');
        errorHandler(req, res, next);
        return;
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
        const errorHandler = handleApiError(errored('Invalid authorization format. Use Bearer token', 'expected'), 'Auth: ');
        errorHandler(req, res, next);
        return;
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Validate token
    if (token !== adminToken) {
        const errorHandler = handleApiError(errored('Invalid admin token', 'expected'), 'Auth: ');
        errorHandler(req, res, next);
        return;
    }

    // Token is valid, proceed
    next();
};
