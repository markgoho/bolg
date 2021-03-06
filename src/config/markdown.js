import markdownParser from 'marked';

const markdownOptions = {
  gfm: true,
  smartypants: true,
};

export const marked = str => markdownParser(str, markdownOptions);
export const excerpt = str => markdownParser(`${str.split(' ').slice(0, 40).join(' ')}...`, markdownOptions);
export const description = str => markdownParser(`${str.replace(/#+.+\n/gm, '').split(' ').slice(0, 20).join(' ')}...`, markdownOptions);
