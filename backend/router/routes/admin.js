const express = require('express')
const router = express.Router()
const roleController = require('../../controllers/roles')
const permissionController = require('../../controllers/permissions')
const grantAccess = require('../router.middleware').grantAccess
//AUTHORISER ROUTES

//REQUIRES VALID TOKEN WITH AUTHORISER ROLE

//GET ALL ROLES
router.get('/role/', (req, res, next) => grantAccess("Authoriser", "", req, res, next), roleController.getAllRoles)

//GET ROLE BY NAME
router.get('/role/:name', (req, res, next) => grantAccess("Authoriser", "", req, res, next), roleController.getRoleByName)

//CREATE ROLE
router.post('/role/', (req, res, next) => grantAccess("Authoriser", "", req, res, next), roleController.createRole)

//UPDATE ROLE
router.put('/role/:id', (req, res, next) => grantAccess("Authoriser", "", req, res, next), roleController.updateRole)

//DELETE ROLE
router.delete('/role/:id', (req, res, next) => grantAccess("Authoriser", "", req, res, next), roleController.deleteRole)

//PERMISSION ROUTES

//GET ALL PERMISSIONS
router.get('/permission/', (req, res, next) => grantAccess("Authoriser", "", "", req, res, next), permissionController.getAllPermissions)

//GET PERMISSION BY NAME
router.get('/permission/:name', (req, res, next) => grantAccess("Authoriser", "", req, res, next), permissionController.getPermissionByName)

//CREATE PERMISSION
router.post('/permission/', (req, res, next) => grantAccess("Authoriser", "", req, res, next), permissionController.createPermission)

//UPDATE PERMISSION
router.put('/permission/:id', (req, res, next) => grantAccess("Authoriser", "", req, res, next), permissionController.updatePermission)

//DELETE PERMISSION
router.delete('/permission/:id', (req, res, next) => grantAccess("Authoriser", "", req, res, next), permissionController.deletePermission)

module.exports = router