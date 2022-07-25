export default function firstToUpperCase(str: string) {
  if (str.length === 0) {
    return str;
  }

  return str[0].toUpperCase().concat(str.substring(1, str.length));
}
