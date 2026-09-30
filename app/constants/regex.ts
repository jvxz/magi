export const REGEX__A_TO_Z = /[a-z]/i
export const REGEX__ALPHANUMERIC = /^[a-z0-9]+$/
export const REGEX__CSS_FILE = /\.(?:css|less|sass|scss|styl|stylus|pcss|postcss)(?:\?[^.]+)?$/
export const REGEX__DATA_MX_COLOR = /^#[0-9a-f]{6}$/i
export const REGEX__EMOJI = /\p{RGI_Emoji}/gv
export const REGEX__EMOJI_VARIATION = /[\uFE00-\uFE0F]/gu
export const REGEX__MATRIX_ROOM_ALIAS =
  /^#[^\0:\uD800-\uDFFF]+:(?:\[[0-9A-F:.]{2,45}\]|[0-9A-Z.-]{1,255})(?::\d{1,5})?$/i
export const REGEX__MXID = /^([@$+#])([^\s:]*):(\S+)$/
export const REGEX__P_TAG = /^<p>(.*)<\/p>$/s
export const REGEX__QUERY_STRING = /\?.*$/
export const REGEX__REPLY_BODY = /^> <.+?> .+\n(>.*\n)*\n/m
export const REGEX__REPLY_PREVIEW_BODY = /^(?:```[^\r\n]*\r?\n)?([^\r\n]+)/
export const REGEX__ROOM_ID = /^!(?<localpart>[^\s:]+)(?::(?<server_name>\S+))?$/
export const REGEX__SHORTCODE_INPUT = /:([\w+-]+):$/
export const REGEX__SHORTCODE_PASTE = /(^|\s):([\w+-]+):/g
export const REGEX__TRAILING_NEWLINE = /\n$/
export const REGEX__UNDERLINE_EXT = /^__(?=\S)([\s\S]*?\S)__/
export const REGEX__USER_ID = /^@[^\s:]+:\S+$/
export const REGEX__WHITESPACE = /\s+/
