export function getCookie(name: string): string | undefined {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.?*|{}()[\]\\+^])/g, '\\$1') + '=([^;]*)')
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

interface CookieProps {
  path?: string;
  expires?: Date | string | number;
  [key: string]: unknown;
}

export function setCookie(name: string, value: string, props: CookieProps = {}) {
  const newProps: { [key: string]: unknown } = {
    path: '/',
    ...props,
  };

  const exp = newProps.expires;
  if (typeof exp == 'number' && exp) {
    const d = new Date();
    d.setTime(d.getTime() + exp * 1000);
    newProps.expires = d.toUTCString();
  } else if (exp instanceof Date) {
    newProps.expires = exp.toUTCString();
  }

  value = encodeURIComponent(value);
  let updatedCookie = name + '=' + value;
  for (const propName in newProps) {
    if (Object.prototype.hasOwnProperty.call(newProps, propName)) {
        updatedCookie += '; ' + propName;
        const propValue = newProps[propName];
        if (propValue !== true) {
        updatedCookie += '=' + propValue;
        }
    }
  }
  document.cookie = updatedCookie;
}

export function deleteCookie(name: string) {
  setCookie(name, '', {
    'max-age': -1,
  });
}
