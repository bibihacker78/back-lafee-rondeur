const Categorie = require('../models/Categorie');

exports.getAllCategories = async (req,res) => {
    try {
        const categories = await Categorie.getAll();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des catégories", error });
    }
};

exports.getCategorieById = async (req, res) => {
    try {
        const { id } = req.params;
        const categorie = await Categorie.getById(id);

        if (!categorie) {
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }

        res.status(200).json(categorie);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de la catégorie", error });
    }
};

exports.createCategorie = async (req, res) => {
    try {
        const { nom } = req.body;

        if (!nom) {
            return res.status(400).json({ message: "Nom de la catégorie requis" });
        }
        await Categorie.create(nom);
        res.status(201).json({ message: "Catégorie créée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de la catégorie", error });
    }
};
exports.deleteCategorie = async (req, res) => {
    try {
        const { id } = req.params;
        await Categorie.delete(id);
        res.status(200).json({ message: "Catégorie supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la catégorie", error });
    }
};