const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. USER REGISTER (Auto-login support එක සහිතව)
const registerUser = async (req, res) => {
  try {
    const { fullname, email, phone, accounttype, password } = req.body;
    
    // Email එක දැනටමත් පද්ධතියේ තිබේදැයි බැලීම
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already registered' });

    // මුරපදය (Password) Encrypt කිරීම
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let profileurl = '';
    if (req.file) {
      profileurl = `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}`;
    }

    const newUser = new User({
      fullname,
      email,
      phone,
      accounttype: accounttype || 'client', // Default 'client' ලෙස සුරැකේ
      password: hashedPassword,
      profileurl
    });

    const savedUser = await newUser.save();

    // Register වූ සැනින් Token එකක් නිර්මාණය කිරීම
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // සාර්ථක පණිවිඩය සමඟ Token සහ _id ඇතුළත් User දත්ත Frontend එකට යැවීම
    res.status(201).json({ 
      message: 'User registered successfully!',
      token,
      user: {
        _id: savedUser._id, // <-- මේක අනිවාර්යයෙන්ම අවශ්‍යයි (Frontend LocalStorage එකට)
        fullname: savedUser.fullname,
        email: savedUser.email,
        phone: savedUser.phone,
        accounttype: savedUser.accounttype,
        profileurl: savedUser.profileurl
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. USER LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Email or Password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Email or Password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Login වූ පසු _id එකත් සමඟ දත්ත යැවීම
    res.json({
      token,
      user: {
        _id: user._id, // <-- මේක අනිවාර්යයෙන්ම අවශ්‍යයි (Frontend LocalStorage එකට)
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        accounttype: user.accounttype,
        profileurl: user.profileurl
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. COMPANY REQUEST (UPGRADE ACCOUNT)
const upgradeToCompany = async (req, res) => {
  try {
    const { userId, companyName, companyEmail, companyAddress, companyContact } = req.body;

    // වැදගත්: Frontend එකෙන් userId එක හරියට එවලා නැත්නම් Check කිරීම
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ message: 'User ID is missing or invalid. Please re-login.' });
    }

    // User කෙනෙක් සිටීදැයි බැලීම
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // BR Document එකක් upload වී තිබේදැයි බැලීම
    let brDocumentUrl = user.brDocumentUrl;
    if (req.file) {
      brDocumentUrl = `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: 'BR Document is required' });
    }

    // User ගේ විස්තර සහ accounttype එක 'pending' ලෙස update කිරීම
    user.companyName = companyName;
    user.companyEmail = companyEmail;
    user.companyAddress = companyAddress;
    user.companyContact = companyContact;
    user.brDocumentUrl = brDocumentUrl;
    user.accounttype = 'pending'; 

    await user.save();

    // Frontend එකේ localstorage එකත් සැනින් update කිරීමට අලුත් user object එකක් යැවීම
    res.status(200).json({ 
      message: 'Company upgrade request submitted successfully! Account status is pending.',
      user: {
        _id: user._id, // <-- LocalStorage එක ඉදිරියටත් වැඩ කිරීමට _id එක රඳවා ගැනීම
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        accounttype: user.accounttype,
        profileurl: user.profileurl,
        companyName: user.companyName,
        companyEmail: user.companyEmail,
        companyAddress: user.companyAddress,
        companyContact: user.companyContact,
        brDocumentUrl: user.brDocumentUrl
      }
    });

  } catch (error) {
    // MongoDB CastError එකක් ආවොත් (userId එක අවුල් නම්) වෙනම message එකක් දීම
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid User ID format. Please log out and log in again.' });
    }
    res.status(500).json({ message: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password'); // Password එක නැතුව දත්ත ගැනීම
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAccountSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { 
      fullname, phone, password,
      companyName, companyEmail, companyAddress, companyContact 
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (fullname) user.fullname = fullname;
    if (phone) user.phone = phone;

    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (user.accounttype === 'company') {
      user.companyName = companyName || '';
      user.companyEmail = companyEmail || '';
      user.companyAddress = companyAddress || '';
      user.companyContact = companyContact || '';
    }

    const updatedUser = await user.save();
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json({ 
      success: true, 
      message: "Account settings updated successfully!", 
      user: userResponse 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser, upgradeToCompany,getUserDetails, updateAccountSettings };