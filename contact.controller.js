const ContactService = require("./services/contact.service");
const MongoDB = require("./utils/mongodb.util");
const ApiError = require("./api-error");

const service = () => new ContactService(MongoDB.client);

exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Name can not be empty"));
  }
  try {
    const document = await service().create(req.body);
    return res.send(document);
  } catch (error) {
    return next(error);
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const { name } = req.query;
    const documents = name 
      ? await service().findByName(name) 
      : await service().find({});
    return res.send(documents);
  } catch (error) {
    return next(error);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const document = await service().findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body || {}).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }
  try {
    const document = await service().update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send({ message: "Contact was updated successfully" });
  } catch (error) {
    return next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const document = await service().delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send({ message: "Contact was deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

exports.findAllFavorite = async (req, res, next) => {
  try {
    const documents = await service().findFavorite();
    return res.send(documents);
  } catch (error) {
    return next(error);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const deletedCount = await service().deleteAll();
    return res.send({
      message: `${deletedCount} contacts were deleted successfully`
    });
  } catch (error) {
    return next(error);
  }
};
