const parseTitle = (body: string): null | string => {
  const match = body.match(/<title>(.*?)<\/title>/);
  if (!match || typeof match[1] !== 'string') return null;
  return match[1];
};

export default parseTitle;
