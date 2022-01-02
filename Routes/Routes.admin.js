const express = require('express')
const adminRoute = express.Router()
const {viewUserApprovalRequest, approveUserRequest, rejectUserRequest} = require('../controller/controller.admin')


console.log('Inside admin route')

adminRoute.get('/viewRequest',viewUserApprovalRequest )

adminRoute.post('/approveUserRequest', approveUserRequest)

adminRoute.post('/rejectUserRequest', rejectUserRequest)
module.exports = adminRoute

