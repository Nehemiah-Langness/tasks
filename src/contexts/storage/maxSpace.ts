const EXPECTED_USERS = 100;
const BUFFER_FOR_OVERFLOW = 1.2;
const BYTES_PER_CHAR = 4; // Assume UTF-8 and worst-case
const MAX_SPACE_PER_USER =
  (1 * // GB
    1024 * //MB
    1024 * // KB
    1024) / // Bytes
  (EXPECTED_USERS * BUFFER_FOR_OVERFLOW);

export const MAX_DATA_LENGTH_PER_USER = MAX_SPACE_PER_USER / BYTES_PER_CHAR;
