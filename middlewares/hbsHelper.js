const imageSrc = (contentType, data) => {
  return `data:image/${contentType};base64,${data.toString("base64")}`;
};

const removeRaw = (input) => {
  return input.replace(/<(?:.|\n)*?>/gm, "");
};

module.exports = {
  imageSrc,
  removeRaw,
};
