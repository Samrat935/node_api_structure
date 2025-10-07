import fs from 'fs';
import path from 'path';
import { parseTemplate } from "./parse_template";

/**
 * Renders an HTML template from a file by replacing placeholders with variables.
 *
 * @param templatePath - Absolute or relative path to the template file.
 * @param variables - Key-value pairs to replace placeholders inside the template.
 * @returns The processed template string with variables replaced.
 */
export const renderTemplateFromFile = (
  templatePath: string,
  variables: Record<string, string>
): string => {
  // Resolve the absolute file path from the given templatePath
  const absolutePath = path.resolve(templatePath);

  // Read the file content as a UTF-8 string
  const fileContent = fs.readFileSync(absolutePath, 'utf-8');

  // Parse the file content by replacing variables and return the result
  return parseTemplate(fileContent, variables);
};
