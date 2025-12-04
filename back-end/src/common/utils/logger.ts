import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
  transports: [new winston.transports.Console()],
});

export default logger;

// // Log informativo
// logger.info("Servidor iniciado!");

// // Log de aviso
// logger.warn("Tentativa suspeita de login");

// // Log de erro
// logger.error("Falha ao conectar no banco");

// // Log debug (aparece só se level <= 'debug')
// logger.debug("Payload da requisição: " + JSON.stringify(data));
