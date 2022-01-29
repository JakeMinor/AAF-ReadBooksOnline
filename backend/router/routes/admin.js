const express = require('express')
const router = express.Router()
const roleController = require('../../controllers/roles')
const permissionController = require('../../controllers/permissions')
const configController = require('../../controllers/config')
const grantAccess = require('../router.middleware').grantAccess
//AUTHORISER ROUTES

//REQUIRES VALID TOKEN WITH AUTHORISER ROLE

//GET ALL ROLES
router.get('/role/', (req, res, next) => grantAccess("ReadRole", req, res, next), roleController.getAllRoles)

//GET ROLE BY NAME
router.get('/role/:name', (req, res, next) => grantAccess("ReadRole", req, res, next), roleController.getRoleByName)

//CREATE ROLE
router.post('/role/', (req, res, next) => grantAccess("CreateRole", req, res, next), roleController.createRole)

//UPDATE ROLE
router.put('/role/:id', (req, res, next) => grantAccess("UpdateRole", req, res, next), roleController.updateRole)

//DELETE ROLE
router.delete('/role/:id', (req, res, next) => grantAccess("DeleteRole", req, res, next), roleController.deleteRole)

//PERMISSION ROUTES

//GET ALL PERMISSIONS
router.get('/permission/', (req, res, next) => grantAccess("ReadPermission", req, res, next), permissionController.getAllPermissions)

//GET PERMISSION BY NAME
router.get('/permission/:name', (req, res, next) => grantAccess("ReadPermission", req, res, next), permissionController.getPermissionByName)

//CREATE PERMISSION
router.post('/permission/', (req, res, next) => grantAccess("CreatePermission", req, res, next), permissionController.createPermission)

//UPDATE PERMISSION
router.put('/permission/:id', (req, res, next) => grantAccess("UpdatePermission", req, res, next), permissionController.updatePermission)

//DELETE PERMISSION
router.delete('/permission/:id', (req, res, next) => grantAccess("DeletePermission", req, res, next), permissionController.deletePermission)

//CONFIG ROUTES 

router.get('/config/', (req, res, next) => grantAccess("GetConfig", req, res, next), configController.getAllConfig)

router.put('/config/:id', (req, res, next) => grantAccess("UpdateConfig", req, res, next), configController.updateConfig)

module.exports = router