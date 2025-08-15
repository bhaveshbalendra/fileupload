import dotenv from "dotenv";

dotenv.config();

// Get environment variable with default value
const getEnv = (key: string, defaultValue?: string) => {
  const value = process.env[key];

  if (value === undefined || value === null || value === "") {
    if (
      defaultValue === "" ||
      defaultValue === undefined ||
      defaultValue === null
    ) {
      throw new Error(
        `Environment variable ${key} is not set and no default value provided.`
      );
    }
    return defaultValue;
  }

  return value;
};

export default getEnv;
