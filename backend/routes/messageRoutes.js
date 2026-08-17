const { Router } = require('express');
const { createMessage , getAllMessages , replyToMessage } = require('../controllers/messageController');

const router = Router();

// පරිශීලකයන්ගෙන් පණිවිඩ ලබාගන්නා endpoint එක
router.post('/', createMessage);
router.get('/messages', getAllMessages);
router.post('/reply/:messageId', replyToMessage);

module.exports = router;