const express = require('express')
const router = express.Router()
const permissionController = require('../../controllers/permissions')
const grantAccess = require('../router.middleware').grantAccess
//Permission routes

//REQUIRES VALID TOKEN WITH AUTHORISER ROLE

//GET ALL PERMISSIONS
router.get('/', (req, res, next) => grantAccess("Authoriser", req, res, next), permissionController.getAllPermissions)

//GET PERMISSION BY NAME
router.get('/:name', (req, res, next) => grantAccess("Authoriser", req, res, next), permissionController.getPermissionByName)

//CREATE PERMISSION
router.post('/', (req, res, next) => grantAccess("Authoriser", req, res, next), permissionController.createPermission)

//UPDATE PERMISSION
router.put('/:id', (req, res, next) => grantAccess("Authoriser", req, res, next), permissionController.updatePermission)

//DELETE PERMISSION
router.delete('/:id', (req, res, next) => grantAccess("Authoriser", req, res, next), permissionController.deletePermission)

module.exports = router