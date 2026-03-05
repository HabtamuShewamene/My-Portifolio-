import Joi from 'joi';

export const projectSchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().min(2).required(),
  description: Joi.string().min(10).required(),
  techStack: Joi.array().items(Joi.string()).default([]),
  github: Joi.string().allow(''),
  demo: Joi.string().allow(''),
  category: Joi.string().allow(''),
  date: Joi.string().isoDate().allow(''),
  complexity: Joi.number().integer().min(1).max(5).default(1),
  difficulty: Joi.number().integer().min(1).max(5).default(1),
  screenshot: Joi.string().allow(''),
  features: Joi.array().default([]),
  challenges: Joi.array().default([]),
  architecture: Joi.array().default([]),
  codeSnippets: Joi.array().default([]),
  metrics: Joi.array().default([]),
});

export const contactRequestSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().trim().email().required(),
  message: Joi.string().trim().min(10).max(5000).required(),
  consent: Joi.boolean().valid(true).required(),
  website: Joi.string().allow('').optional(),
});

export const chatRequestSchema = Joi.object({
  message: Joi.string().trim().min(1).max(1000).required(),
  sessionId: Joi.string().trim().max(100).allow('').optional(),
});
