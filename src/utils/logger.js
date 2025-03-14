import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = "/tmp/logs";
//const logsDir = path.join(__dirname, '..', '..', 'logs');

// Loglar için klasör oluşturma
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
};

const currentLogLevel = process.env.LOG_LEVEL || 'info';

class Logger {
    #getTimestamp() {
        return new Date().toISOString().replace('T', ' ').substring(0, 19);
    }

    #shouldLog(level) {
        return logLevels[level] <= logLevels[currentLogLevel];
    }

    #log(level, message, ...args) {
        if (!this.#shouldLog(level)) return;

        const timestamp = this.#getTimestamp();
        const formattedMessage = typeof message === 'object'
            ? JSON.stringify(message)
            : message;

        const logMessage = `${timestamp} [${level.toUpperCase()}] ${formattedMessage} ${args.length ? JSON.stringify(args) : ''}`;

        console[level](logMessage);

        // Dosyaya loglama
        const logStream = fs.createWriteStream(
            path.join(logsDir, `${level}.log`),
            { flags: 'a' }
        );
        logStream.write(logMessage + '\n');
        logStream.end();
    }

    error(message, ...args) {
        this.#log('error', message, ...args);
    }

    warn(message, ...args) {
        this.#log('warn', message, ...args);
    }

    info(message, ...args) {
        this.#log('info', message, ...args);
    }

    debug(message, ...args) {
        this.#log('debug', message, ...args);
    }
}

export const logger = new Logger();