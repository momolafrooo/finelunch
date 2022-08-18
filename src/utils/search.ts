export const getSearchQuery = (searchFields: string[], search: string) => {
  return searchFields.map((field) => ({
    [field]: { $regex: search, $options: 'i' },
  }));
};
