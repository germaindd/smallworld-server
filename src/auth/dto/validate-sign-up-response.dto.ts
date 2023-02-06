import { SignUpValidationResult } from '../sign-up-validation-result';

export class ValidateSignUpResponseDto {
  username?: SignUpValidationResult;
  password?: SignUpValidationResult;
  email?: SignUpValidationResult;
}
