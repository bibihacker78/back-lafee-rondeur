const express = require('express');

const router = express.Router();
const avisController = require('../controllers/avisController');

router.get('/produit/:produitId', avisController.getAvisByProduit);
router.post('/', avisController.createAvis);
router.delete('/:id', avisController.deleteAvis);


module.exports = router;