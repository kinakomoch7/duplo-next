import pino from 'pino';
import pretty from 'pino-pretty';
import path from 'path';
import fs from 'fs';

let logger: pino.Logger;

if (process.env.NODE_ENV == 'production') {

  const logDir = path.join(process.cwd(), 'logs');
  
  // ログディレクトリが存在しない場合は作成する
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // ファイルに出力
  const destination = pino.destination({
    dest: path.join(logDir, 'app.log'),
    sync: false,
  });
  logger = pino({ level: 'info' }, destination);

} else {
  const stream = pretty({
    colorize: true,
    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
    ignore: 'pid,hostname',
  });
  logger = pino({ level: 'debug' }, stream);
}

export default logger;