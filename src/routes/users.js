// routes/users.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorizeRole = require('../middleware/authorizeRole');
const userController = require('../controllers/userController');
const multerMemory = require('multer');

// Usar almacenamiento en memoria para multer (ya no en disco)
const memoryStorage = multerMemory.memoryStorage();
const uploadMemory = multerMemory({ storage: memoryStorage });

// Rutas
router.get('/', authenticate, authorizeRole('admin', 'supervisor'), userController.getAllUsers);
router.get('/activos', authenticate, authorizeRole('admin', 'supervisor'), userController.getActiveUserCount);
router.get('/stats/activos', userController.getActiveUserCount); // Versión pública para dashboard
router.post('/verify-password', authenticate, userController.verifyPassword);

router.put('/:id/profile', authenticate, uploadMemory.single('image'), userController.updateUserProfile); // ✅ SOLO ESTA

router.put('/:id', authenticate, authorizeRole('admin'), userController.updateUserRole);
router.delete('/:id', authenticate, authorizeRole('admin'), userController.deleteUser);
router.post('/activity', authenticate, userController.updateActivity);
router.post('/logout', authenticate, userController.logout);
router.post('/logout-inactivos', userController.logoutInactiveUsers);
router.get('/:id/active', userController.isUserActive);

module.exports = router;
