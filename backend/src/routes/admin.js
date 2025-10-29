const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const logger = require('../utils/logger');

// Admin authentication middleware (simplified for demo)
const authenticateAdmin = (req, res, next) => {
  const adminToken = req.headers['x-admin-token'] || req.headers.authorization?.replace('Bearer ', '');
  
  // In production, validate admin JWT token
  // For demo, accept any token
  if (!adminToken) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Admin authentication required'
      }
    });
  }
  
  // TODO: Validate admin token, check admin role
  req.admin = { id: 'admin-1', email: 'admin@nairavault.com', role: 'super_admin' };
  next();
};

/**
 * @route   GET /api/admin/stats
 * @desc    Get system statistics
 * @access  Admin
 */
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    // Get total users
    const totalUsersResult = await query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(totalUsersResult.rows[0].count);

    // Get active users (logged in within last 30 days)
    const activeUsersResult = await query(
      "SELECT COUNT(*) as count FROM users WHERE last_login_at > NOW() - INTERVAL '30 days'"
    );
    const activeUsers = parseInt(activeUsersResult.rows[0].count);

    // Get KYC statistics
    const pendingKYCResult = await query(
      "SELECT COUNT(*) as count FROM users WHERE kyc_status = 'pending'"
    );
    const pendingKYC = parseInt(pendingKYCResult.rows[0].count);

    const verifiedKYCResult = await query(
      "SELECT COUNT(*) as count FROM users WHERE kyc_status = 'verified'"
    );
    const verifiedKYC = parseInt(verifiedKYCResult.rows[0].count);

    // Get wallet statistics
    const walletsResult = await query('SELECT COUNT(*) as count FROM wallets');
    const totalWallets = parseInt(walletsResult.rows[0].count);

    // Get today's transaction count
    const todayTransactionsResult = await query(
      "SELECT COUNT(*) as count FROM transactions WHERE DATE(created_at) = CURRENT_DATE"
    );
    const todayTransactions = parseInt(todayTransactionsResult.rows[0].count);

    // Get today's transaction volume
    const todayVolumeResult = await query(
      "SELECT COALESCE(SUM(amount), 0) as volume FROM transactions WHERE DATE(created_at) = CURRENT_DATE"
    );
    const todayVolume = parseFloat(todayVolumeResult.rows[0].volume);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        pendingKYC,
        verifiedKYC,
        totalWallets,
        todayTransactions,
        todayVolume
      }
    });
  } catch (error) {
    logger.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch statistics'
      }
    });
  }
});

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination and filters
 * @access  Admin
 */
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', kycStatus = 'all' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (search) {
      whereConditions.push(`(
        LOWER(email) LIKE LOWER($${paramIndex}) OR 
        LOWER(first_name) LIKE LOWER($${paramIndex}) OR 
        LOWER(last_name) LIKE LOWER($${paramIndex}) OR 
        LOWER(phone) LIKE LOWER($${paramIndex})
      )`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (kycStatus && kycStatus !== 'all') {
      whereConditions.push(`kyc_status = $${paramIndex}`);
      queryParams.push(kycStatus);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as count FROM users ${whereClause}`,
      queryParams
    );
    const totalCount = parseInt(countResult.rows[0].count);

    // Get users
    queryParams.push(parseInt(limit));
    queryParams.push(offset);
    
    const usersResult = await query(
      `SELECT id, email, first_name, last_name, phone, kyc_status, account_type, 
              email_verified, phone_verified, is_active, created_at, last_login_at
       FROM users 
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      queryParams
    );

    const users = usersResult.rows.map(user => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      phone: user.phone,
      kycStatus: user.kyc_status,
      accountType: user.account_type,
      emailVerified: user.email_verified,
      phoneVerified: user.phone_verified,
      isActive: user.is_active,
      createdAt: user.created_at,
      lastLoginAt: user.last_login_at
    }));

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit))
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch users'
      }
    });
  }
});

/**
 * @route   GET /api/admin/users/recent
 * @desc    Get recent user registrations
 * @access  Admin
 */
router.get('/users/recent', authenticateAdmin, async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const result = await query(
      `SELECT id, email, first_name, last_name, kyc_status, created_at
       FROM users 
       ORDER BY created_at DESC
       LIMIT $1`,
      [parseInt(limit)]
    );

    const users = result.rows.map(user => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      status: user.kyc_status,
      joined: user.created_at
    }));

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    logger.error('Error fetching recent users:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch recent users'
      }
    });
  }
});

/**
 * @route   PUT /api/admin/users/:userId/deactivate
 * @desc    Deactivate a user account
 * @access  Admin
 */
router.put('/users/:userId/deactivate', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await query(
      'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id, email, first_name, last_name',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    logger.info('User deactivated by admin', {
      adminId: req.admin.id,
      userId,
      userEmail: result.rows[0].email
    });

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error deactivating user:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to deactivate user'
      }
    });
  }
});

/**
 * @route   PUT /api/admin/users/:userId/activate
 * @desc    Activate a user account
 * @access  Admin
 */
router.put('/users/:userId/activate', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await query(
      'UPDATE users SET is_active = true, updated_at = NOW() WHERE id = $1 RETURNING id, email, first_name, last_name',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    logger.info('User activated by admin', {
      adminId: req.admin.id,
      userId,
      userEmail: result.rows[0].email
    });

    res.status(200).json({
      success: true,
      message: 'User activated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error activating user:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to activate user'
      }
    });
  }
});

/**
 * @route   GET /api/admin/kyc/pending
 * @desc    Get all pending KYC verifications
 * @access  Admin
 */
router.get('/kyc/pending', authenticateAdmin, async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id as user_id, u.email, u.first_name, u.last_name, u.phone,
              u.bvn, u.nin, u.created_at as submitted_at
       FROM users u
       WHERE u.kyc_status = 'pending'
       ORDER BY u.created_at DESC`
    );

    const pendingKYC = result.rows.map(row => ({
      id: row.user_id,
      user: {
        id: row.user_id,
        name: `${row.first_name} ${row.last_name}`,
        email: row.email,
        phone: row.phone
      },
      verificationType: row.bvn ? 'BVN' : row.nin ? 'NIN' : 'Unknown',
      verificationNumber: row.bvn || row.nin || '',
      submittedAt: row.submitted_at,
      status: 'pending'
    }));

    res.status(200).json({
      success: true,
      data: pendingKYC
    });
  } catch (error) {
    logger.error('Error fetching pending KYC:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch pending KYC verifications'
      }
    });
  }
});

/**
 * @route   GET /api/admin/kyc/:userId/documents
 * @desc    Get KYC documents for a user
 * @access  Admin
 */
router.get('/kyc/:userId/documents', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await query(
      `SELECT id_card_data, id_card_type, id_card_name,
              selfie_data, selfie_type, selfie_name
       FROM kyc_documents
       WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'DOCUMENTS_NOT_FOUND',
          message: 'No KYC documents found for this user'
        }
      });
    }

    const docs = result.rows[0];

    res.status(200).json({
      success: true,
      data: {
        idCard: {
          data: docs.id_card_data,
          type: docs.id_card_type,
          name: docs.id_card_name
        },
        selfie: {
          data: docs.selfie_data,
          type: docs.selfie_type,
          name: docs.selfie_name
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching KYC documents:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch documents'
      }
    });
  }
});

/**
 * @route   PUT /api/admin/kyc/:userId/approve
 * @desc    Approve KYC verification
 * @access  Admin
 */
router.put('/kyc/:userId/approve', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { notes } = req.body;

    const result = await query(
      `UPDATE users 
       SET kyc_status = 'verified',
           kyc_verified_at = NOW(),
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, first_name, last_name`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    logger.info('KYC approved by admin', {
      adminId: req.admin.id,
      userId,
      userEmail: result.rows[0].email,
      notes
    });

    // TODO: Send email notification to user

    res.status(200).json({
      success: true,
      message: 'KYC verification approved',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error approving KYC:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to approve KYC'
      }
    });
  }
});

/**
 * @route   PUT /api/admin/kyc/:userId/reject
 * @desc    Reject KYC verification
 * @access  Admin
 */
router.put('/kyc/:userId/reject', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason, notes } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Rejection reason is required'
        }
      });
    }

    const result = await query(
      `UPDATE users 
       SET kyc_status = 'rejected',
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, first_name, last_name`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    logger.info('KYC rejected by admin', {
      adminId: req.admin.id,
      userId,
      userEmail: result.rows[0].email,
      reason,
      notes
    });

    // TODO: Send email notification to user with rejection reason

    res.status(200).json({
      success: true,
      message: 'KYC verification rejected',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error rejecting KYC:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to reject KYC'
      }
    });
  }
});

/**
 * @route   PUT /api/admin/kyc/:userId/allow-resubmission
 * @desc    Allow user to resubmit KYC (reset from rejected to pending)
 * @access  Admin
 */
router.put('/kyc/:userId/allow-resubmission', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check current status
    const checkResult = await query(
      'SELECT id, email, first_name, last_name, kyc_status FROM users WHERE id = $1',
      [userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    const user = checkResult.rows[0];

    // Reset KYC status to pending to allow resubmission
    const result = await query(
      `UPDATE users 
       SET kyc_status = 'pending',
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, first_name, last_name, kyc_status`,
      [userId]
    );

    logger.info('KYC resubmission allowed by admin', {
      adminId: req.admin.id,
      userId,
      userEmail: user.email,
      previousStatus: user.kyc_status
    });

    // TODO: Send email notification to user allowing resubmission

    res.status(200).json({
      success: true,
      message: 'User can now resubmit KYC documents',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error allowing KYC resubmission:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to allow resubmission'
      }
    });
  }
});

/**
 * @route   GET /api/admin/analytics/user-growth
 * @desc    Get user growth data
 * @access  Admin
 */
router.get('/analytics/user-growth', authenticateAdmin, async (req, res) => {
  try {
    const result = await query(
      `SELECT 
         TO_CHAR(created_at, 'Mon') as month,
         COUNT(*) as users
       FROM users
       WHERE created_at >= NOW() - INTERVAL '6 months'
       GROUP BY TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)
       ORDER BY DATE_TRUNC('month', created_at)`
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Error fetching user growth:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch user growth data'
      }
    });
  }
});

/**
 * @route   GET /api/admin/analytics/transaction-volume
 * @desc    Get transaction volume data
 * @access  Admin
 */
router.get('/analytics/transaction-volume', authenticateAdmin, async (req, res) => {
  try {
    const result = await query(
      `SELECT 
         TO_CHAR(created_at, 'Mon DD') as date,
         SUM(amount) as volume
       FROM transactions
       WHERE created_at >= NOW() - INTERVAL '7 days'
       GROUP BY TO_CHAR(created_at, 'Mon DD'), DATE(created_at)
       ORDER BY DATE(created_at)`
    );

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Error fetching transaction volume:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch transaction volume'
      }
    });
  }
});

module.exports = router;

