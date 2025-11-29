import AdminAppLock from '../models/AdminAppLock.js';

export const setAdminPin = async (req, res) => {
  try {
    const { pin, previousPin } = req.body;
    const adminId = req.user._id;

    if (!pin || pin.length < 4 || pin.length > 6) {
      return res.status(400).json({ message: 'PIN must be between 4-6 digits' });
    }

    // Check if PIN already exists for this admin
    let appLock = await AdminAppLock.findOne({ admin: adminId });
    if (appLock) {
      // If changing existing PIN, require previousPin verification
      if (!previousPin) {
        return res.status(400).json({ message: 'Previous PIN is required to change PIN' });
      }
      const valid = await appLock.verifyPin(previousPin);
      if (!valid) {
        return res.status(401).json({ message: 'Previous PIN is incorrect' });
      }

      appLock.pinHash = pin;
      await appLock.save();
    } else {
      appLock = new AdminAppLock({
        admin: adminId,
        pinHash: pin,
      });
      await appLock.save();
    }

    res.json({ message: 'PIN set successfully' });
  } catch (err) {
    console.error('Error setting PIN:', err.message);
    res.status(500).json({ message: 'Failed to set PIN' });
  }
};

export const verifyAdminPin = async (req, res) => {
  try {
    const { pin } = req.body;
    const adminId = req.user._id;

    if (!pin) {
      return res.status(400).json({ message: 'PIN is required' });
    }

    const appLock = await AdminAppLock.findOne({ admin: adminId });
    if (!appLock) {
      return res.status(404).json({ message: 'App lock not configured for this admin' });
    }

    const isValid = await appLock.verifyPin(pin);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid PIN' });
    }

    res.json({ message: 'PIN verified successfully' });
  } catch (err) {
    console.error('Error verifying PIN:', err.message);
    res.status(500).json({ message: 'Failed to verify PIN' });
  }
};

export const getAdminLockStatus = async (req, res) => {
  try {
    const adminId = req.user._id;

    const appLock = await AdminAppLock.findOne({ admin: adminId });
    res.json({
      hasPin: !!appLock,
      isEnabled: appLock?.isEnabled || false,
    });
  } catch (err) {
    console.error('Error getting lock status:', err.message);
    res.status(500).json({ message: 'Failed to get lock status' });
  }
};

export const toggleAppLock = async (req, res) => {
  try {
    const { isEnabled, previousPin } = req.body;
    const adminId = req.user._id;

    const appLock = await AdminAppLock.findOne({ admin: adminId });
    if (!appLock) {
      return res.status(404).json({ message: 'App lock not configured' });
    }

    // If disabling, require current PIN verification for security
    if (isEnabled === false) {
      if (!previousPin) {
        return res.status(400).json({ message: 'Current PIN is required to disable app lock' });
      }
      const valid = await appLock.verifyPin(previousPin);
      if (!valid) return res.status(401).json({ message: 'Current PIN is incorrect' });
    }

    appLock.isEnabled = isEnabled;
    await appLock.save();

    res.json({ message: `App lock ${isEnabled ? 'enabled' : 'disabled'} successfully` });
  } catch (err) {
    console.error('Error toggling app lock:', err.message);
    res.status(500).json({ message: 'Failed to toggle app lock' });
  }
};
