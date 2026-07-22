// middleware/upload.js
// ALTERADO: usa memoryStorage em vez de diskStorage.
// Motivo: o disco do Railway (e da maioria dos hosts) é EFÊMERO — é apagado
// a cada reinício/redeploy, e em alguns planos pode nem permitir escrita.
// Isso fazia o multer falhar silenciosamente e o produto nunca era
// inserido no banco. Agora os arquivos ficam só em memória (buffer) e
// quem decide o que fazer com eles é a rota (ver products.js), que vai
// salvar como base64 direto no PostgreSQL.

const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Apenas imagens JPG, PNG e WebP são permitidas'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
});

module.exports = upload;
