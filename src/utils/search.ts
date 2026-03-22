export function normalizeSearchQuery(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

export function matchesSearchQuery(
  query: string,
  fields: Array<string | null | undefined>,
) {
  const normalizedQuery = normalizeSearchQuery(query);

  if (!normalizedQuery) {
    return true;
  }

  const searchableText = fields
    .filter((field): field is string => typeof field === "string" && field.length > 0)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedQuery);
}

export function filterBySearchQuery<T>(
  items: T[],
  query: string,
  getFields: (item: T) => Array<string | null | undefined>,
) {
  return items.filter((item) => matchesSearchQuery(query, getFields(item)));
}
