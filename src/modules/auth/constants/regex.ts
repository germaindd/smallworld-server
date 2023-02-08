export const Regex = {
  emailValidation: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  usernameValidation: /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]{4,30}(?<![_.])$/,
  passwordValidation:
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).{8,30}$/,
};
