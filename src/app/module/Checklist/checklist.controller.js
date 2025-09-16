const Checklist = require("./Checklist");
const asyncHandler = require("../../../utils/asyncHandler");
const { ApiError } = require("../../../errors/errorHandler");
const deleteDocumentWithFiles = require("../../../utils/deleteDocumentWithImages");
const QueryBuilder = require("../../../builder/queryBuilder");

exports.createChecklist = asyncHandler(async (req, res) => {
  const checklist = await Checklist.create(req.body);
  if (!checklist) throw new ApiError("checklist doesn't created!", 500);

  return res.status(201).json({
    success: true,
    message: "checklist created successfully",
    checklist,
  });
});

exports.getAllChecklist = asyncHandler(async (req, res) => {
  // Define searchable fields for the search functionality
  const searchableFields = ["title"];

  // Create QueryBuilder instance
  const queryBuilder = new QueryBuilder(Checklist.find(), req.query);
  // Apply all query operations
  const checklists = await queryBuilder
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields().modelQuery;

  // Get pagination info
  const paginationInfo = await queryBuilder.countTotal();

  // if (!checklists || checklists.length === 0) {
  //   throw new ApiError("There is No available checklist.", 404);
  // }

  return res.status(200).json({
    success: true,
    message: "checklists found successfully",
    pagination: paginationInfo,
    data: checklists,
  });
});

exports.getChecklistById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const checklist = await Checklist.findById(id);
  if (!checklist) {
    throw new ApiError("Checklist not found", 404);
    return checklist
  }

  return res.status(200).json({
    success: true,
    message: "checklist found",
    data: checklist,
  });
});

exports.updateChecklist = asyncHandler(async (req, res) => {
  const { title, items } = req.body;

  const checklist = await Checklist.findByIdAndUpdate(
    req.params.id,
    { title, items },
    { new: true, runValidators: true }
  );

  if (!checklist) {
    res.status(404);
    throw new Error("Checklist not found");
  }

  res.status(200).json({
    success: true,
    message: "Checklist updated successfully",
    data: checklist,
  });
});

exports.deleteChecklist = asyncHandler(async (req, res) => {
  const checklist = await Checklist.findByIdAndDelete(req.params.id);

  if (!checklist) {
    res.status(404);
    throw new Error("Checklist not found");
  }

  res.status(200).json({
    success: true,
    message: "Checklist deleted successfully",
  });
});
