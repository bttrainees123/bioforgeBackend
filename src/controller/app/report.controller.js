const reportService = require('../../service/app/report.service');
const statusCodes = require("../../helper/statusCodes");
const responseHelper = require("../../helper/response");
const { CustomError } = require('../../helper/customeErrors');

class reportController {

    add = async (request, response) => {
        try {
            const result = await reportService.reportUser(request);
            
            return responseHelper.success(
                response, 
                result.message, 
                {
                    reportCount: result.reportCount,
                    userBlocked: result.userBlocked
                }, 
                statusCodes.OK
            );
        } catch (error) {
            console.error("Report User Error:", error);
            
            if (error instanceof CustomError) {
                return responseHelper.error(response, error.message, error.statusCode);
            }
            
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };

    getReports = async (request, response) => {
        try {
            const result = await reportService.getReports(request);
            
            return responseHelper.success(
                response, 
                "Reports fetched successfully", 
                result, 
                statusCodes.OK
            );
        } catch (error) {
            console.error("Get Reports Error:", error);
            
            if (error instanceof CustomError) {
                return responseHelper.error(response, error.message, error.statusCode);
            }
            
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };

    getReportDetails = async (request, response) => {
        try {
            const { reportId } = request.params;
            
            const reportModel = require('../../model/report.model');
            const report = await reportModel.findById(reportId)
                .populate('reportedUserId', 'username email status')
                .populate('reportCount.userId', 'username email');

            if (!report) {
                const { NotFoundError } = require('../../helper/customErrors');
                throw new NotFoundError('Report not found');
            }

            return responseHelper.success(
                response, 
                "Report details fetched successfully", 
                report, 
                statusCodes.OK
            );
        } catch (error) {
            console.error("Get Report Details Error:", error);
            
            if (error instanceof CustomError) {
                return responseHelper.error(response, error.message, error.statusCode);
            }
            
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };

    deleteReport = async (request, response) => {
        try {
            const { reportId } = request.params;
            const result = await reportService.deleteReport(reportId);

            return responseHelper.success(
                response, 
                result.message, 
                null, 
                statusCodes.OK
            );
        } catch (error) {
            console.error("Delete Report Error:", error);
            
            if (error instanceof CustomError) {
                return responseHelper.error(response, error.message, error.statusCode);
            }
            
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };

    blockUser = async (request, response) => {
        try {
            const { userId } = request.body;
            const result = await reportService.blockUser(userId);

            return responseHelper.success(
                response, 
                result.message, 
                null, 
                statusCodes.OK
            );
        } catch (error) {
            console.error("Block User Error:", error);
            
            if (error instanceof CustomError) {
                return responseHelper.error(response, error.message, error.statusCode);
            }
            
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };

    unblockUser = async (request, response) => {
        try {
            const { userId } = request.body;
            const result = await reportService.unblockUser(userId);

            return responseHelper.success(
                response, 
                result.message, 
                null, 
                statusCodes.OK
            );
        } catch (error) {
            console.error("Unblock User Error:", error);
            
            if (error instanceof CustomError) {
                return responseHelper.error(response, error.message, error.statusCode);
            }
            
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };
}

module.exports = new reportController();
