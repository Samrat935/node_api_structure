/**
 * Class name: User validation
 * Author: Matrix
 * Date: 2025-07-14
 * Version: 1.0.0
 * Description: Validates user-related data using Joi schemas.
 */
import Joi from "joi";

class UserValidation {
  /**
   * Function Name: createUserSchema
   * Author: Matrix
   * Date: 2025-07-14
   * Version: 1.0.0
   * Description: Validates the data for creating a new user.
   */
  public createUserSchema() {
    return Joi.object({
      email: Joi.string().email().required(),
      first_name: Joi.string(),
      last_name: Joi.string(),
      password: Joi.string().min(6).required(),
      type: Joi.string().required(),
      user_type: Joi.string().required(),
    });
  }
  /**
   * Function Name: changePasswordSchema
   * Description: Validates old and new password.
   */
  public changePasswordSchema() {
    return Joi.object({
      oldPassword: Joi.string().required().messages({
        "any.required": "Old password is required.",
        "string.empty": "Old password cannot be empty.",
      }),
      newPassword: Joi.string()
        .disallow(Joi.ref("oldPassword"))
        .min(6)
        .required()
        .trim()
        .messages({
          "any.required": "New password is required.",
          "string.empty": "New password cannot be empty.",
          "any.invalid": "New password must be different from old password.",
          "string.min": "New password must be at least 6 characters long.",
        }),
    });
  }
}
export default new UserValidation();
