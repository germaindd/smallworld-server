import { SignUpValidationResult } from '../models/sign-up-validation-result';

export class ValidateSignUpResponseDto {
  username?: SignUpValidationResult;
  password?: SignUpValidationResult;
  email?: SignUpValidationResult;
}
