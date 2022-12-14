const moment = require("moment");

const imageSrc = (contentType, data) => {
  if (contentType === null || data === null) {
    return "https://bn02pap001files.storage.live.com/y4mRcXXDYHTXdKG_nfA3G604B2nqbx-8gTCCqqMXX6mEaY_M4DEQaJ5-4-6fOs1T7QFTOy7c4tS3kwQLOKQODahowOd6S1qwRMZQjOpnicKmR0ET7STLp8dL-sYu86dG3hI02K877gX2LkSq4xnJtHXFw6QhS7YXAlQchLbhnnDUNAG3NSyrehOWL43xrXgNI5a?encodeFailures=1&width=839&height=600";
  }

  return `data:image/${contentType};base64,${data.toString("base64")}`;
};

const formatDate = (input) => {
  return moment(input, "Do MMM YYYY", true).format("Do MMM YYYY");
};

const truncate = (string, length) => {
  if (string.length > length && string.length > 0) {
    let new_string = string + " ";
    new_string = string.substr(0, length);
    new_string = string.substr(0, new_string.lastIndexOf(" "));
    new_string = new_string.length > 0 ? new_string : string.substr(0, length);
    return new_string + "...";
  }
  return string;
};

module.exports = {
  imageSrc,
  formatDate,
  truncate,
};
