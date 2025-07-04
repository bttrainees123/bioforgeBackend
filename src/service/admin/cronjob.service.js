const cron = require('node-cron');
const reportModel = require('../../model/report.model');
const userModel = require('../../model/user.model');
const mongoose = require('mongoose');

class UserReportCronService {
    
    static async checkAndInactiveReportedUsers() {
        try {
            console.log('🔍 Starting cron job: Checking users with multiple reports...');
            
            const usersWithMultipleReports = await reportModel.aggregate([
                {
                    $match: {
                        reportedUserId: { $exists: true }
                    }
                },
                {
                    $addFields: {
                        reportCountLength: { $size: "$reportCount" }
                    }
                },
                {
                    $match: {
                        reportCountLength: { $gte: 2 } 
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'reportedUserId',
                        foreignField: '_id',
                        as: 'userInfo',
                        pipeline: [
                            {
                                $match: {
                                    is_deleted: '0',
                                    status: 'active' 
                                }
                            },
                            {
                                $project: {
                                    username: 1,
                                    email: 1,
                                    status: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $match: {
                        userInfo: { $ne: [] } 
                    }
                },
                {
                    $project: {
                        reportedUserId: 1,
                        reportCountLength: 1,
                        userInfo: { $arrayElemAt: ['$userInfo', 0] },
                        reportCount: 1,
                        message: 1,
                        createdAt: 1
                    }
                }
            ]);

            console.log(` Found ${usersWithMultipleReports.length} users with 2+ reports`);

            if (usersWithMultipleReports.length === 0) {
                console.log(' No users found with multiple reports');
                return {
                    success: true,
                    message: 'No users found with multiple reports',
                    processedUsers: 0
                };
            }

            let processedUsers = 0;
            let errors = [];

            for (const report of usersWithMultipleReports) {
                try {
                    const userId = report.reportedUserId;
                    const reportCount = report.reportCountLength;
                    const userInfo = report.userInfo;

                    console.log(` Processing user: ${userInfo.username} (${userInfo.email}) - Reports: ${reportCount}`);

                    const updatedUser = await userModel.findByIdAndUpdate(
                        userId,
                        { 
                            status: 'inactive',
                            inactiveReason: 'Multiple reports received',
                            inactivatedAt: new Date(),
                            reportCount: reportCount
                        },
                        { new: true }
                    );

                    if (updatedUser) {
                        console.log(` User ${userInfo.username} has been inactivated (${reportCount} reports)`);
                        processedUsers++;
                        
                        await this.logUserInactivation(userId, reportCount, report.reportCount);
                    } else {
                        console.log(` Failed to inactivate user ${userInfo.username}`);
                        errors.push(`Failed to inactivate user ${userInfo.username}`);
                    }

                } catch (userError) {
                    console.error(` Error processing user ${report.userInfo?.username}:`, userError);
                    errors.push(`Error processing user ${report.userInfo?.username}: ${userError.message}`);
                }
            }

            const result = {
                success: true,
                message: `Processed ${processedUsers} users successfully`,
                processedUsers,
                totalFound: usersWithMultipleReports.length,
                errors: errors.length > 0 ? errors : null
            };

            console.log(' Cron job completed:', result);
            return result;

        } catch (error) {
            console.error(' Error in checkAndInactiveReportedUsers cron job:', error);
            return {
                success: false,
                message: 'Cron job failed',
                error: error.message
            };
        }
    }

    static async logUserInactivation(userId, reportCount, reportDetails) {
        try {
            console.log(` AUDIT LOG: User ${userId} inactivated due to ${reportCount} reports`);
            console.log(` Report details:`, reportDetails.map(r => ({
                reportedBy: r.userId,
                reportedAt: r.reportedAt
            })));
            
        } catch (error) {
            console.error(' Error logging user inactivation:', error);
        }
    }

    static async getReportStatistics() {
        try {
            const stats = await reportModel.aggregate([
                {
                    $addFields: {
                        reportCountLength: { $size: "$reportCount" }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalReports: { $sum: 1 },
                        totalReportInstances: { $sum: "$reportCountLength" },
                        usersWithOneReport: {
                            $sum: { $cond: [{ $eq: ["$reportCountLength", 1] }, 1, 0] }
                        },
                        usersWithTwoReports: {
                            $sum: { $cond: [{ $eq: ["$reportCountLength", 2] }, 1, 0] }
                        },
                        usersWithThreeOrMoreReports: {
                            $sum: { $cond: [{ $gte: ["$reportCountLength", 3] }, 1, 0] }
                        },
                        maxReportsForSingleUser: { $max: "$reportCountLength" }
                    }
                }
            ]);

            return stats[0] || {};
        } catch (error) {
            console.error(' Error getting report statistics:', error);
            return {};
        }
    }

    static startCronJob() {
        console.log(' Starting User Report Cron Job...');
        
        const task = cron.schedule('* * * * *', async () => {
            const now = new Date();
            console.log(` Running scheduled user report check at: ${now.toISOString()}`);
            console.log(` Local time: ${now.toLocaleString()}`);
            
            await this.checkAndInactiveReportedUsers();
            
            console.log(` Cron job cycle completed at: ${new Date().toISOString()}`);
            console.log(' Next run in 1 minute...\n');
        }, {
            scheduled: true,
            timezone: "Asia/Kolkata" 
        });

        console.log(' User Report Cron Job scheduled successfully');
        console.log(' Schedule: Every 1 minute (* * * * *)');
        console.log(' Timezone: Asia/Kolkata');
        console.log(' Status: ACTIVE');
        console.log(' Next run: In 1 minute\n');
        
        return task;
    }

    static async manualTrigger() {
        console.log(' Manual trigger initiated...');
        console.log(` Triggered at: ${new Date().toISOString()}`);
        return await this.checkAndInactiveReportedUsers();
    }

    static stopCronJob(task) {
        if (task) {
            task.stop();
            console.log(' User Report Cron Job stopped');
        }
    }

    static getCronJobInfo() {
        return {
            name: 'User Report Auto-Inactivation',
            schedule: 'Every 1 minute (* * * * *)',
            description: 'Automatically inactivates users with 2+ reports',
            timezone: 'Asia/Kolkata',
            status: 'ACTIVE',
            frequency: 'Every minute'
        };
    }
}

module.exports = UserReportCronService;
