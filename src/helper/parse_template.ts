/**
 * Parses a template string and replaces placeholders like {{name}}, {{link}} with actual values.
 * 
 * @param template - The template string containing placeholders.
 * @param variables - An object containing key-value pairs for replacement.
 * @returns The template string with placeholders replaced by actual values.
 */
export const parseTemplate = (
  template: string,
  variables: Record<string, string>
): string => {
  let result = template;

  // Iterate over each variable key and replace all matching placeholders in the template
  for (const key in variables) {
    const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(pattern, variables[key]);
  }

  return result;
};
