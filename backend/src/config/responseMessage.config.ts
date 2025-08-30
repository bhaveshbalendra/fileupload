// Message constants
const ResponseMessages = {
  NOT_FOUND: "Resource not found",
  INTERNAL_SERVER_ERROR: "Internal server error",
  BAD_REQUEST: "Bad request",
  UNAUTHORIZED: "Unauthorized access",
} as const;

export default ResponseMessages;
export type ResponseMessageKeysType = keyof typeof ResponseMessages;
