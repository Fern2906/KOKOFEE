import { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../utils/http-error';

export const notFound: RequestHandler = (req, _res, next) => {
  next(new HttpError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Datos inválidos',
      errors: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      message: err.message,
      details: err.details,
    });
    return;
  }

  if (err?.name === 'CastError') {
    res.status(400).json({ message: 'Identificador inválido' });
    return;
  }

  if (err?.code === 11000) {
    res.status(409).json({ message: 'Ya existe un registro con esos datos' });
    return;
  }

  if (err?.name === 'ValidationError') {
    res.status(400).json({
      message: 'Datos inválidos',
      errors: Object.values(err.errors ?? {}).map((item: unknown) => ({
        message: (item as { message?: string }).message ?? 'Valor inválido',
      })),
    });
    return;
  }

  console.error('[error]', err);
  res.status(500).json({ message: 'Error interno del servidor' });
};
