/* 
Both the bellow regular expressions have tolerance for trailing whitespace,
as it's trimmed when 
*/
const emailString = '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}[ \t]*$';
const usernameString =
  '^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]{4,30}(?<![_.])[ \t]*$';

export const emailValidation = RegExp(emailString);
export const usernameValidation = RegExp(usernameString);
export const passwordValidation =
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).{8,30}$/;
export const emailOrUsernameValidation = RegExp(
  `(${emailString})|(${usernameString})`,
);
