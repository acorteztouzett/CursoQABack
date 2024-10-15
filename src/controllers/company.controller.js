const handleError = require("../lib/errorHandler");
const { readCompanies, writeCompanies } = require("../services/db/company.service");

exports.getCompanies = async (req, res) => {
  try {
    const companies = await readCompanies();
    res.status(200).json(companies);
  } catch (err) {
    handleError(err, res);
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    const companies = await readCompanies({ _id: req.params.id });
    if (!companies.length) {
      return res
        .status(404)
        .json({ type: "ErrorNotFound", message: "Empresa no encontrada :/" });
    }
    return res.status(200).json(companies[0]);
  } catch (err) {
    return handleError(err, res);
  }
};

exports.createCompanies = async (req, res) => {
  try {
    const companyData = {
      ...req.body,
      createdBy: req.user._id,
    };
    const writeData = await writeCompanies(companyData, "insertOne");
    res
      .status(201)
      .json({ type: "write_insert", result: writeData, message: "Creado." });
  } catch (err) {
    handleError(err, res);
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const companyData = {
      ...req.body,
      modifiedBy: req.user._id,
    };
    const writeData = await writeCompanies(companyData, "updateOne", {
      _id: req.params.id,
    });
    if (!writeData.modifiedCount) {
      return res
        .status(404)
        .json({ type: "ErrorNotFound", message: "Empresa no encontrada :/" });
    }
    return res
      .status(200)
      .json({ type: "write_update", result: writeData, message: "Actualizado." });
  } catch (err) {
    return handleError(err, res);
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const writeData = await writeCompanies({}, "deleteOne", { _id: req.params.id });
    if (!writeData.deletedCount) {
      return res
        .status(404)
        .json({ type: "ErrorNotFound", message: "Empresa no encontrada :/" });
    }
    return res
      .status(200)
      .json({ type: "write_delete", result: writeData, message: "Borrado." });
    // 204 : No Content actually returns no content..
  } catch (err) {
    return handleError(err, res);
  }
};
