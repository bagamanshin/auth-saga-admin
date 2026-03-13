import { isPlainObject } from '@shared/lib/utils';

function toFormDataValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
}

export function buildFormData(data: unknown): FormData {
  const formData = new FormData();

  if (!isPlainObject(data)) {
    return formData;
  }

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File) {
          formData.append(`${key}[]`, item);
        } else {
          formData.append(`${key}[]`, toFormDataValue(item));
        }
      });
    } else {
      formData.append(key, toFormDataValue(value));
    }
  });

  return formData;
}

export function prepareRequestData(
  body: unknown,
  isFormData: boolean
): {
  requestBody: BodyInit | null;
  headers: Record<string, string>;
} {
  const headers: Record<string, string> = {};
  const hasBody = body !== null && body !== undefined;

  if (isFormData && hasBody) {
    return {
      requestBody: buildFormData(body),
      headers,
    };
  }

  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }

  const requestBody = hasBody ? JSON.stringify(body) : null;

  return {
    requestBody,
    headers,
  };
}
