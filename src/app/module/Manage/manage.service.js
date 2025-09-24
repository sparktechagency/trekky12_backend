const { default: status } = require("http-status");
const {
  TermsConditions,
  PrivacyPolicy,
  AboutUs,
  FAQ,
  ContactUs,
} = require("./Manage");
const {ApiError} = require("../../../errors/errorHandler");
const validateFields = require("../../../utils/validateFields");

const addTermsConditions = async (payload) => {
  const checkIsExist = await TermsConditions.findOne();

  if (checkIsExist) {
    const result = await TermsConditions.findOneAndUpdate({}, payload, {
      new: true,
      runValidators: true,
    });

    return {
      message: "Terms & conditions updated",
      result,
    };
  } else {
    return await TermsConditions.create(payload);
  }
};

const getTermsConditions = async () => {
  return await TermsConditions.findOne();
};

const deleteTermsConditions = async (query) => {
  const { id } = query;

  const result = await TermsConditions.deleteOne({ _id: id });

  if (!result.deletedCount)
    throw new ApiError(status.NOT_FOUND, "TermsConditions not found");

  return result;
};

const addPrivacyPolicy = async (payload) => {
  const checkIsExist = await PrivacyPolicy.findOne();

  if (checkIsExist) {
    const result = await PrivacyPolicy.findOneAndUpdate({}, payload, {
      new: true,
      runValidators: true,
    });

    return {
      message: "Privacy policy updated",
      result,
    };
  } else {
    return await PrivacyPolicy.create(payload);
  }
};

const getPrivacyPolicy = async () => {
  return await PrivacyPolicy.findOne();
};

const deletePrivacyPolicy = async (query) => {
  const { id } = query;

  const result = await PrivacyPolicy.deleteOne({ _id: id });

  if (!result.deletedCount) {
    throw new ApiError(status.NOT_FOUND, "Privacy Policy not found");
  }

  return result;
};

const addAboutUs = async (payload) => {
  const checkIsExist = await AboutUs.findOne();

  if (checkIsExist) {
    const result = await AboutUs.findOneAndUpdate({}, payload, {
      new: true,
      runValidators: true,
    });

    return {
      message: "About Us updated",
      result,
    };
  } else {
    return await AboutUs.create(payload);
  }
};

const getAboutUs = async () => {
  return await AboutUs.findOne();
};

const deleteAboutUs = async (query) => {
  const { id } = query;

  const result = await AboutUs.deleteOne({ _id: id });

  if (!result.deletedCount)
    throw new ApiError(status.NOT_FOUND, "About Us not found");

  return result;
};

const addFaq = async (payload) => {
  validateFields(payload, ["question", "description"]);
  return await FAQ.create(payload);
};

const updateFaq = async (payload) => {
  validateFields(payload, ["faqId", "question", "description"]);

  const { faqId, ...rest } = payload;

  const result = await FAQ.findOneAndUpdate({ _id: faqId }, rest, {
    new: true,
    runValidators: true,
  });

  if (!result) throw new ApiError(status.NOT_FOUND, "FAQ not found");

  return result;
};

const getFaq = async () => {
  return await FAQ.find({});
};

const deleteFaq = async (query) => {
  validateFields(query, ["faqId"]);
  const { faqId } = query;

  const result = await FAQ.deleteOne({ _id: faqId });

  if (!result.deletedCount)
    throw new ApiError(status.NOT_FOUND, "FAQ not found");

  return result;
};

const addContactUs = async (payload) => {
  const checkIsExist = await ContactUs.findOne();

  if (checkIsExist) {
    const result = await ContactUs.findOneAndUpdate({}, payload, {
      new: true,
      runValidators: true,
    });

    return {
      message: "Contact Us updated",
      result,
    };
  } else {
    return await ContactUs.create(payload);
  }
};

const getContactUs = async () => {
  return await ContactUs.findOne({});
};

const deleteContactUs = async (query) => {
  const { id } = query;

  const result = await ContactUs.deleteOne({ _id: id });

  if (!result.deletedCount)
    throw new ApiError(status.NOT_FOUND, "Contact Us not found");

  return result;
};

const ManageService = {
  addPrivacyPolicy,
  getPrivacyPolicy,
  deletePrivacyPolicy,
  addTermsConditions,
  getTermsConditions,
  deleteTermsConditions,
  addAboutUs,
  getAboutUs,
  deleteAboutUs,
  addFaq,
  updateFaq,
  getFaq,
  deleteFaq,
  addContactUs,
  getContactUs,
  deleteContactUs,
};

module.exports = ManageService;
