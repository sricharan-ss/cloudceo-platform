type LogLevel = 'info' | 'http' | 'warn' | 'error';

const write = (level: LogLevel, message: string): void => {
  const timestamp = new Date().toISOString();
  const output = `[${timestamp}] ${level.toUpperCase()} ${message}`;

  if (level === 'error') {
    console.error(output);
    return;
  }

  if (level === 'warn') {
    console.warn(output);
    return;
  }

  console.log(output);
};

export const logger = {
  info: (message: string): void => write('info', message),
  http: (message: string): void => write('http', message),
  warn: (message: string): void => write('warn', message),
  error: (message: string): void => write('error', message)
};
