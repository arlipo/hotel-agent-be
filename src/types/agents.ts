import { z } from 'zod';


export const AgentDtoSchema = z.object({
    name: z.string(),
    type: z.enum(['Sales', 'Support', 'Marketing']),
    status: z.enum(['Active', 'Inactive']),
    description: z.string().optional(),
});

export const AgentQuestionSchema = z.object({
    question: z.string(),
});

export type AgentDto = z.infer<typeof AgentDtoSchema>;
export type AgentQuestion = z.infer<typeof AgentQuestionSchema>;