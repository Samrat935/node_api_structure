import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

interface LoggerOptions {
  logDirectory?: string;
  logFile?: string;
}

interface LogEntry {
  timestamp: string;
  method: string;
  path: string;
  query: Record<string, any>;
  body: Record<string, any> | null;
  statusCode: number;
  responseTimeMs: string;
  userId: string | null;
  clientIp: string | undefined;
  userAgent: string | undefined;
  error: string | null;
}

export class AccessLogger {
  private logDirectory: string;
  private logFile: string;
  private fullLogPath: string;
  private stream: fs.WriteStream;

  constructor(options: LoggerOptions = {}) {
    this.logDirectory = options.logDirectory || path.join(__dirname, 'logs');
    this.logFile = options.logFile || 'access.log';
    this.fullLogPath = path.join(this.logDirectory, this.logFile);

    this.ensureLogDirectory();
    this.stream = fs.createWriteStream(this.fullLogPath, { flags: 'a' });
  }

  private ensureLogDirectory(): void {
    try {
      if (!fs.existsSync(this.logDirectory)) {
        fs.mkdirSync(this.logDirectory, { recursive: true });
      }
    } catch (error: any) {
      console.error(`[AccessLogger] Failed to create log directory: ${error.message}`);
    }
  }

  private sanitizeBody(body: any): Record<string, any> | null {
    if (!body || typeof body !== 'object') return null;

    const clone = { ...body };
    const sensitiveFields = ['password', 'token', 'accessToken', 'refreshToken'];

    for (const field of sensitiveFields) {
      if (clone[field]) {
        clone[field] = '****'; // Mask sensitive data
      }
    }

    return clone;
  }

  public middleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      const startHrTime = process.hrtime();

      res.on('finish', () => {
        try {
          const elapsedHrTime = process.hrtime(startHrTime);
          const elapsedMs = (elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6).toFixed(3);

          const logEntry: LogEntry = {
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.originalUrl,
            query: req.query,
            body: this.sanitizeBody(req.body),
            statusCode: res.statusCode,
            responseTimeMs: elapsedMs,
            userId: (req as any).user?.id || null, // If you add user in auth middleware
            clientIp: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress,
            userAgent: req.headers['user-agent'],
            error: (res.locals?.errorMessage) || null
          };

          this.writeLog(logEntry);
        } catch (error: any) {
          console.error(`[AccessLogger] Failed to log request: ${error.message}`);
        }
      });

      next();
    };
  }

  private writeLog(entry: LogEntry): void {
    try {
      const line = JSON.stringify(entry) + '\n';
      this.stream.write(line);
    } catch (error: any) {
      console.error(`[AccessLogger] Failed to write log: ${error.message}`);
    }
  }

  public close(): void {
    try {
      this.stream.end();
    } catch (error: any) {
      console.error(`[AccessLogger] Failed to close log stream: ${error.message}`);
    }
  }
}
export default AccessLogger;