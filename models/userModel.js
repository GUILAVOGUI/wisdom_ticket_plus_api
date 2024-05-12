const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Define a sub-schema for linked account
const linkedAccountSchema = new mongoose.Schema({
    socialMediaName: String,
    link: String
});

// Define a sub-schema for user information
const userInfoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    phoneNumber: String,
    gender: String,
    address: String
});

// Define a sub-schema for company profile
const companyProfileSchema = new mongoose.Schema({
    logoImageLink: String,
    name: String,
    address: String,
    contactPhone: String,
    contactEmail: String
});

// Define a sub-schema for user preferences
const userPreferenceSchema = new mongoose.Schema({
    language: {
        type: String,
        default: 'English'
    },
    region: {
        type: String,
        default: ''
    },
    timezone: {
        type: String,
        default: 'UTC'
    }
});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
    },
    inAdminTeam: {
        type: Boolean,
        default: false
    },
    userProfileImage: {
        type: String,
        default: 'https://res.cloudinary.com/ds1hlry5u/image/upload/v1713581113/qeyflpgbbjvgfejcm8gc.png'
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: String,
    topicsOfInterest: [String],
    type: {
        type: String,
        enum: ['Super_Admin', 'Admin', 'Agent_Monitoring', 'Organizer', 'ShopOwner', 'Normal_User'],
        default: 'Normal_User'
    },
    purchaseHistory: [{
        shopName: String,
        item: String
    }],
    teamMember: [{
        memberStatus: String,
        userRole: String,
        userInfo: userInfoSchema  // Sub-schema for user information
    }],
    adminTeamMember: [{
        memberStatus: String,
        userRole: String,
        userInfo: userInfoSchema  // Sub-schema for user information
    }],
    notifications: [String],
    complainHistory: [String],
    paymentMethod: [{
        bankName: String,
        number: String,
        expireDate: Date
    }],
    transactionHistory: [{
        type: String
    }],
    token: String,
    aboutUs: String,
    pageURL: String,
    creationDate: { type: Date, default: Date.now },
    billingPlan: String,
    actions: [String],
    linkedAccount: [linkedAccountSchema],
    companyProfile: companyProfileSchema,
    userPreference: userPreferenceSchema,


    accessList: {
        type: mongoose.Schema.Types.Mixed,
        default: {
            Super_Admin: {
                description: "The super admin has complete access and control over all aspects of the platform. This includes managing other administrator accounts, accessing sensitive data, making configuration changes, and overriding decisions made by lower-level administrators.",
                abilities: {
                    createAdminAccount: false,
                    editAdminAccount: false,
                    deleteAdminAccount: false,
                    accessDashboard: false,
                    configureSettings: false,
                    manageUserData: false,
                    overrideDecisions: false,
                    suspendOrganizerAccount: false
                },
                isActive: true // Super_Admin is activated by default
            },
            EventManagementAdmin: {
                description: "Event management admin is responsible for managing events on the platform. They can create, edit, and delete events.",
                abilities: {
                    createEvent: false,
                    editEvent: false,
                    deleteEvent: false
                },
                isActive: false
            },
            CommunicationAdmin: {
                description: "Communication admin oversees communication channels on the platform. They can send announcements, manage messaging templates, and moderate communications.",
                abilities: {
                    sendAnnouncement: false,
                    manageMessagingTemplates: false,
                    moderateCommunication: false
                },
                isActive: false
            },
            SupportAdmin: {
                description: "Support admin provides customer support assistance. They can view support tickets, respond to user inquiries, and escalate issues as needed.",
                abilities: {
                    viewSupportTickets: false,
                    respondToInquiries: false,
                    escalateIssues: false
                },
                isActive: false
            },
            AnalyticsAdmin: {
                description: "Analytics admin analyzes platform data to derive insights. They can view analytics reports, generate custom reports, and access data visualization tools.",
                abilities: {
                    viewAnalyticsReports: false,
                    generateCustomReports: false,
                    accessDataVisualizationTools: false
                },
                isActive: false
            },
            FinanceAdmin: {
                description: "Finance admin manages financial transactions and accounts on the platform. They can view transaction history, process payments, and generate financial reports.",
                abilities: {
                    viewTransactionHistory: false,
                    processPayments: false,
                    generateFinancialReports: false
                },
                isActive: false
            }
        }
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
