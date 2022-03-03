const express = require('express')
const router = express.Router()
const roleController = require('../../controllers/roles')
const permissionController = require('../../controllers/permissions')
const configController = require('../../controllers/config')
const grantAccess = require('../router.middleware').grantAccess // Authorisation middleware which checks the users permission.

/**
 * Roles Routes.
 */

//Get All Roles.
router.get('/role/', (req, res, next) => grantAccess("ReadRole", req, res, next), roleController.getAllRoles)

//Get Role By Name.
router.get('/role/:name', (req, res, next) => grantAccess("ReadRole", req, res, next), roleController.getRoleByName)

//Create Role.
router.post('/role/', (req, res, next) => grantAccess("CreateRole", req, res, next), roleController.createRole)

//Update Role.
router.put('/role/:id', (req, res, next) => grantAccess("UpdateRole", req, res, next), roleController.updateRole)

//Delete Role.
router.delete('/role/:id', (req, res, next) => grantAccess("DeleteRole", req, res, next), roleController.deleteRole)

/**
 * Permission Routes.
 */

//Get All Permissions.
router.get('/permission/', (req, res, next) => grantAccess("ReadPermission", req, res, next), permissionController.getAllPermissions)

//Get Permission by Name.
router.get('/permission/:name', (req, res, next) => grantAccess("ReadPermission", req, res, next), permissionController.getPermissionByName)

//Create Permission.
router.post('/permission/', (req, res, next) => grantAccess("CreatePermission", req, res, next), permissionController.createPermission)

//Update Permission.
router.put('/permission/:id', (req, res, next) => grantAccess("UpdatePermission", req, res, next), permissionController.updatePermission)

//Delete Permission.
router.delete('/permission/:id', (req, res, next) => grantAccess("DeletePermission", req, res, next), permissionController.deletePermission)

/**
 * Config Routes.
 */

//Get config.
router.get('/config/', (req, res, next) => grantAccess("GetConfig", req, res, next), configController.getAllConfig)

//Update config.
router.put('/config/:id', (req, res, next) => grantAccess("UpdateConfig", req, res, next), configController.updateConfig)

module.exports = router